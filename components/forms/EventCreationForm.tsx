"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { createEvent } from "@/lib/actions/event.action";
import { cn, getEventExpiryDate } from "@/lib/utils";
import { eventFormSchema } from "@/lib/validations";

import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

interface CreateEvent {
  planFeatures: IPlanFeature[];
}

const EventCreationForm = ({ planFeatures }: CreateEvent) => {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      location: "",
      themeColor: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<any>();

  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  const handleCreateEvent = async (values: z.infer<typeof eventFormSchema>) => {
    const maxUploads = planFeatures.find(
      (feature) => feature.featureKey === FEATURE.MAX_UPLOADS
    );

    const retentionDays = planFeatures.find(
      (feature) => feature.featureKey === FEATURE.RETENTION_DAYS
    );

    const expiryDate = getEventExpiryDate(
      values.startDate,
      retentionDays?.limit
    );

    try {
      setIsSubmitting(true);

      const result = await createEvent({
        title: values.title,
        description: values.description,
        loc: values.location,
        startDate: values.startDate,
        coverImage: coverPhoto?.secure_url || "",
        expiryDate: expiryDate,
        maxUploads: maxUploads?.limit || 0,
        themeColor: values.themeColor,
      });

      if (result?.success) {
        toast.success("Event created successfully!");

        router.push(ROUTES.EVENTS);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
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
                  Be specific and imagine you&apos;re giving info to another
                  person
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormLabel className="paragraph-semibold text-dark400_light800">
            Cover Photo (Optional)
          </FormLabel>

          {coverPhoto ? (
            <div className="relative w-full h-[200px] border rounded-md overflow-hidden">
              <Image
                src={coverPhoto?.secure_url}
                alt="cover photo"
                fill
                className="object-cover"
              />
              {/* Remove button overlay */}
              <button
                type="button"
                onClick={() => setCoverPhoto(null)}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
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
                  onClick={() => open()}
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

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              className="bg-red-700 text-light-900"
              type="button"
              disabled={isSubmitting}
              // onClick={onClose}
            >
              Discard
            </Button>
            <Button
              className="bg-green-700 text-light-900"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Publish Event
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventCreationForm;
