"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, UploadIcon } from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ErrorResponse } from "@/types/global";

import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  planFeatures: IPlanFeature[];
  accountId: string;
}

const EventCreationForm = ({
  open,
  onClose,
  planFeatures,
  accountId,
}: CreateEventDialogProps) => {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      location: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<any>();

  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  const session = useSession();
  const user = session?.data?.user;

  // const handleCreateEvent = async () => {
  //   const maxUploads = planFeatures.find(
  //     (feature) => feature.featureKey === "MAX_UPLOADS"
  //   );

  //   try {
  //     setIsSubmitting(true);
  //     const formData = new FormData();
  //     const title = formData.get("title") as string;
  //     const description = formData.get("description") as string;
  //     const loc = formData.get("location") as string;
  //     const startDate = formData.get("startDate");
  //     const coverImage = coverPhoto.secure_url;
  //     const qrCode = nanoid(12);
  //     const expiryDate = getEventExpiryDate(new Date(), 7);
  //     const maxUploadsPerAttendee = maxUploads?.limit;
  //     const organizer = accountId;

  //     const result = await createEvent({
  //       title,
  //       description,
  //       loc,
  //       startDate,
  //       coverImage,
  //       qrCode,
  //       expiryDate,
  //       maxUploadsPerAttendee,
  //       organizer,
  //     });

  //     if (result?.success) {
  //       toast.success("Event created successfully!");
  //       onClose();
  //       router.push(ROUTES.EVENTS(user.id!));
  //     }
  //   } catch (error) {
  //     return error as ErrorResponse;
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleCreateEvent = async (values: z.infer<typeof eventFormSchema>) => {
    const maxUploads = planFeatures.find(
      (feature) => feature.featureKey === FEATURE.MAX_UPLOADS
    );

    const retentionDays = planFeatures.find(
      (feature) => feature.featureKey === FEATURE.RETENTION_DAYS
    );

    try {
      setIsSubmitting(true);

      const result = await createEvent({
        title: values.title,
        description: values.description,
        loc: values.location,
        startDate: values.startDate,
        coverImage: coverPhoto?.secure_url || "", // optional
        qrCode: nanoid(12),
        expiryDate: getEventExpiryDate(new Date(), retentionDays?.limit), // adjust duration if plan-based
        maxUploadsPerAttendee: maxUploads?.limit || 0,
        organizer: accountId,
      });

      if (result?.success) {
        toast.success("Event created successfully!");
        onClose();
        router.push(ROUTES.EVENTS(user?.id!));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-screen overflow-scroll my-6  background-light900_dark200">
        <DialogHeader>
          <DialogTitle className="text-xl text-dark100_light900">
            Create New Event
          </DialogTitle>
          <DialogDescription className="paragraph-medium text-dark400_light500">
            Set up a new memories collection event for your attendees.
          </DialogDescription>
        </DialogHeader>

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
                    Event Description{" "}
                    <span className="text-primary-500">*</span>
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
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

            <div className="space-y-2">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Cover Photo (Optional)
              </FormLabel>
              <div className="space-y-4">
                {coverPhoto ? (
                  <div className="border rounded-md w-full h-[200px] cursor-pointer overflow-hidden">
                    <Image
                      src={coverPhoto?.secure_url}
                      alt="cover photo"
                      fill
                    />
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset="momentshare"
                    onSuccess={(result, widget) => {
                      setCoverPhoto(result.info);
                      widget.close();
                    }}
                  >
                    {({ open }) => {
                      return (
                        <div
                          className="flex flex-col justify-center border rounded-md w-full h-[200px] text-lg text-gray-500 items-center gap-2 cursor-pointer"
                          onClick={() => open()}
                        >
                          <UploadIcon className="w-6 h-6" />
                          <span>
                            {uploading ? "Uploading..." : "Upload photo"}
                          </span>
                          <p className="text-xs text-black font-medium">
                            Browse (1 Photo - Max size 2MB)
                          </p>
                        </div>
                      );
                    }}
                  </CldUploadWidget>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                className="bg-red-700 text-light-900"
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
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
      </DialogContent>
    </Dialog>
  );
};

export default EventCreationForm;
