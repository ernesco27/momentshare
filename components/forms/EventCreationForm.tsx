"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FEATURE } from "@/constants";
import ROUTES from "@/constants/route";
import { IPlanFeature } from "@/database/planFeatures.model";
import { createEvent, editEvent } from "@/lib/actions/event.action";
import { cn, getEventExpiryDate } from "@/lib/utils";
import { eventFormSchema } from "@/lib/validations";
import { GlobalEvent } from "@/types/global";

import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

interface CreateEvent {
  planFeatures?: IPlanFeature[];
  event?: GlobalEvent;
  isEdit?: boolean;
  isCustomBrandingEnabled: boolean;
}

// interface ImageUpload {
//   secure_url: string;
// }

const EventCreationForm = ({
  planFeatures,
  event,
  isEdit = false,
  isCustomBrandingEnabled = false,
}: CreateEvent) => {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      startDate: event?.startDate ? new Date(event.startDate) : new Date(),
      location: event?.loc || "",
      themeColor: event?.themeColor || "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState<boolean>(false);

  const [coverPhoto, setCoverPhoto] = useState<any>(
    isEdit && event?.coverImage ? { secure_url: event.coverImage } : null
  );

  const [logo, setLogo] = useState<any>(
    isEdit && event?.logo ? { secure_url: event.logo } : null
  );

  const [existingImageRemoved, setExistingImageRemoved] = useState(false);
  const [existingLogoRemoved, setExistingLogoRemoved] = useState(false);

  const router = useRouter();

  const handleCreateEvent = async (values: z.infer<typeof eventFormSchema>) => {
    const maxUploads = planFeatures?.find(
      (feature) => feature.featureKey === FEATURE.MAX_UPLOADS
    );

    const StorageLimit = planFeatures?.find(
      (feature) => feature.featureKey === FEATURE.STORAGE_LIMIT_GB
    );

    const retentionDays = planFeatures?.find(
      (feature) => feature.featureKey === FEATURE.RETENTION_DAYS
    );

    const expiryDate = getEventExpiryDate(
      values.startDate,
      retentionDays?.limit
    );

    startTransition(async () => {
      if (isEdit && event) {
        const result = await editEvent({
          eventId: event?._id,
          title: values.title,
          description: values.description,
          loc: values.location,
          coverImage: coverPhoto?.secure_url || "",
          logo: logo?.secure_url || "",
          themeColor: values.themeColor,
        });

        if (result.success) {
          toast.success("Event updated successfully!");

          router.push(ROUTES.EVENTS);
        } else {
          toast.error(result?.error?.message || "Failed to update event");
        }
        return;
      }

      const result = await createEvent({
        title: values.title,
        description: values.description,
        loc: values.location,
        startDate: values.startDate,
        coverImage: coverPhoto?.secure_url || "",
        logo: logo?.secure_url || "",
        expiryDate: expiryDate,
        maxUploads: maxUploads?.limit || 0,
        themeColor: values.themeColor,
        storageLimit: StorageLimit?.limit || 0.5,
      });

      if (result?.success) {
        toast.success("Event created successfully!");

        router.push(ROUTES.EVENTS);
      } else {
        toast.error(result?.error?.message || "Failed to create event");
      }
    });
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
    setExistingImageRemoved(true);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setExistingLogoRemoved(true);
  };

  return (
    <div className="mt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateEvent)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Event Title <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                    placeholder="Jane's Birthday"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular text-light-500 mt-2.5">
                  Be specific and imagine you&apos;re giving info to another
                  person
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Event Description <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                    placeholder="A little info about the event"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Event Location <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                    placeholder="Location of event"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular text-light-500 mt-2.5">
                  Be specific and imagine you&apos;re giving info to another
                  person
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="themeColor"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Theme Color <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="color"
                    className="h-12 w-20 p-1 cursor-pointer rounded border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="body-regular text-light-500 mt-2.5">
                  Select your event&apos;s theme color to personalize the
                  experience.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Event Date <span className="text-primary-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={isEdit}
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal text-dark400_light500",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 background-light900_dark200 text-dark200_light900"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="body-regular text-light-500 mt-2.5">
                  Event Starting Date cannot be updated after submission. Be
                  sure of the date before proceeding.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <div className="mb-4">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Event Cover Photo (Optional)
              </FormLabel>
              <FormDescription className="body-regular text-light-500 mt-1">
                Select your event&apos;s cover photo to personalize the
                experience.
              </FormDescription>
            </div>

            {coverPhoto && coverPhoto.secure_url ? (
              <div className="relative w-full h-[200px] border rounded-md overflow-hidden">
                <Image
                  src={coverPhoto?.secure_url}
                  alt="cover photo"
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveCoverPhoto}
                  className="absolute top-2 right-2 bg-red-600/60 text-white text-xs px-2 py-1 rounded hover:bg-red-600/80 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <CldUploadWidget
                uploadPreset="momentshare"
                options={{
                  sources: ["local"],
                  multiple: false,
                  maxFiles: 1,
                  maxFileSize: 2 * 1024 * 1024, // 2MB
                  clientAllowedFormats: ["png", "jpeg", "jpg"],
                  folder: "MomentShare/cover_images",
                }}
                onSuccess={(result, { widget }) => {
                  setCoverPhoto(result?.info);
                  setUploading(false);
                  setExistingImageRemoved(false);
                  widget.close();
                }}
                onClose={() => setUploading(false)}
                onError={() => {
                  toast.error("Failed to upload image. Please try again.");
                  setUploading(false);
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex flex-col justify-center w-full h-[200px] border text-lg text-gray-500 items-center gap-2"
                    onClick={() => {
                      if (!isCustomBrandingEnabled) {
                        setPrompt(true);
                        return;
                      }
                      open();
                    }}
                  >
                    <UploadIcon className="w-6 h-6" />
                    <span>{uploading ? "Uploading..." : "Upload photo"}</span>
                    <p className="text-xs text-black font-medium">
                      Browse (1 Photo - Max size 2MB)
                    </p>
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </div>
          <div>
            <div className="mb-4">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Event Logo (Optional)
              </FormLabel>
              <FormDescription className="body-regular text-light-500 mt-1">
                Select your event&apos;s logo to personalize the experience.
              </FormDescription>
            </div>

            {logo && logo.secure_url ? (
              <div className="relative  w-full h-[200px] border rounded-md overflow-hidden">
                <Image
                  src={logo?.secure_url}
                  alt="logo"
                  width={200}
                  height={200}
                  className="object-center flex justify-self-center pt-[5%]"
                />

                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2 bg-red-600/60 text-white text-xs px-2 py-1 rounded hover:bg-red-600/80 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <CldUploadWidget
                uploadPreset="momentshare"
                options={{
                  sources: ["local"],
                  multiple: false,
                  maxFiles: 1,
                  maxFileSize: 2 * 1024 * 1024, // 2MB
                  clientAllowedFormats: ["png", "jpeg", "jpg"],
                  folder: "MomentShare/cover_images",
                }}
                onSuccess={(result, { widget }) => {
                  setLogo(result?.info);
                  setUploading(false);
                  setExistingLogoRemoved(false);
                  widget.close();
                }}
                onClose={() => setUploading(false)}
                onError={() => {
                  toast.error("Failed to upload image. Please try again.");
                  setUploading(false);
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex flex-col justify-center w-full h-[200px] border text-lg text-gray-500 items-center gap-2"
                    onClick={() => {
                      if (!isCustomBrandingEnabled) {
                        setPrompt(true);
                        return;
                      }
                      open();
                    }}
                  >
                    <UploadIcon className="w-6 h-6" />
                    <span>{uploading ? "Uploading..." : "Upload photo"}</span>
                    <p className="text-xs text-black font-medium">
                      Browse (1 Photo - Max size 2MB)
                    </p>
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              className="bg-green-700 text-light-900 cursor-pointer hover:bg-green-800 transition duration-300 ease-in-out"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner className="size-4" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>{isEdit ? "Update Event" : "Create Event"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <AlertDialog open={prompt}>
        <AlertDialogContent className="light-border background-light900_dark200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary-500">
              Upgrade Plan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dark200_light800">
              Your current plan does not support{" "}
              <span className="primary-text-gradient">
                Cover Photo / Logo Upload
              </span>
              . Upgrade plan to <strong>Premium</strong> or <strong>Pro</strong>{" "}
              to upload event cover photo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPrompt(false)}
              className="text-primary-500 hover:bg-slate-200/50 cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                router.push(ROUTES.PRICING);
              }}
              className="primary-gradient text-white hover:primary-dark-gradient transition duration-300 ease-in-out cursor-pointer"
            >
              Upgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventCreationForm;
