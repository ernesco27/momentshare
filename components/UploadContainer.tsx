"use client";

import { Camera, UploadIcon, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { generateUploadSignature } from "@/lib/actions/generateUploadSignature.action";
import { createEventMedia } from "@/lib/actions/media.action";
import handleError from "@/lib/handlers/error";
import { cn } from "@/lib/utils";
import { ErrorResponse, GlobalEvent } from "@/types/global";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

const UploadContainer = ({ event }: { event: GlobalEvent }) => {
  const [photos, setPhotos] = useState<File[]>([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Limit to 4 photos
    if (photos.length + newFiles.length > 4) {
      toast.error("Maximum 4 photos allowed");
      return;
    }

    // Validate file sizes
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
    }

    setPhotos((prev) => [...prev, ...newFiles]);

    // Reset the input value to allow re-uploading the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      toast.error("Please select at least one photo to upload.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Get signature from server
      const { timestamp, signature, cloudName, apiKey, folder } =
        await generateUploadSignature(event._id);

      // 2. Upload all files to Cloudinary
      const uploadResults = await Promise.all(
        photos.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("api_key", apiKey!);
          formData.append("timestamp", timestamp.toString());
          formData.append("signature", signature);
          formData.append("folder", `${folder}`);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!res.ok) {
            const err = await res.text();
            throw new Error(`Cloudinary error: ${err}`);
          }
          return res.json();
        })
      );

      await createEventMedia({
        eventId: event._id,
        media: uploadResults.map((r) => ({
          fileType: r.format,
          fileUrl: r.secure_url,
          publicId: r.public_id,
        })),
      });
      toast.success("Photos uploaded successfully!");
      setPhotos([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload photos"
      );
      return handleError(error) as ErrorResponse;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen my-10 p-4">
      {/* Header */}
      {event.coverImage && (
        <div className="w-full h-[40vh] rounded-lg mb-8 mt-20 bg-red-500">
          <Image
            src={event.coverImage! || "/images/event-cover-placeholder.jpg"}
            alt="Event Cover"
            width={800}
            height={400}
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="text-center mt-30">
        <div className="flex items-center justify-center mb-4">
          <div className="background-light800_dark300 p-3 rounded-full ">
            <Camera
              className="h-8 w-8 text-primary-500"
              style={{
                color: event.themeColor ? event.themeColor : undefined,
              }}
            />
          </div>
        </div>
        <h1
          className={cn(
            "h1-bold mb-2",
            !event.themeColor && "primary-text-gradient"
          )}
          style={{
            color: event.themeColor ? event.themeColor : undefined,
          }}
        >
          {event.title}
        </h1>
        <p className="text-light400_light500">
          {event.description || "Share your photos and videos from this event"}
        </p>
      </div>
      {/* Upload Area */}
      <Card
        className="card-wrapper bg-primary-500/5 light-border mt-20"
        style={{
          backgroundColor: event.themeColor
            ? `${event.themeColor}30`
            : undefined,
        }}
      >
        <CardHeader>
          <CardTitle className="text-center text-dark300_light700">
            Upload Your Photos & Videos
          </CardTitle>
          <CardDescription className="text-center text-light-400">
            Click to select your photos/videos. Supports images and videos up to
            5MB each.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex flex-col justify-center border rounded-md w-full  text-lg text-gray-500 items-center gap-2 cursor-pointer background-dark400_light900 hover:!background-light800_darkgradient transition-colors light-border">
              <div
                className="flex flex-col justify-center border rounded-md w-full h-[200px] text-lg text-gray-500 items-center gap-2 cursor-pointer light-border"
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploading || photos.length >= 4}
                />
                <UploadIcon className="w-6 h-6 text-dark300_light700" />
                <span className="text-dark300_light700">
                  {uploading ? "Uploading..." : "Upload photos"}
                </span>
                <p className="text-xs text-dark300_light700 font-medium">
                  Browse (Max 4 photos/videos, 5MB each)
                </p>
              </div>

              {photos.length > 0 && (
                <div className="flex-center gap-4 flex-wrap">
                  {photos.map((file, index) => (
                    <div key={index} className="relative group p-2">
                      <div className="w-[100px] h-[100px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Event file ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="size-6 absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="default"
            size="lg"
            className="btn primary-gradient hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer mt-6 w-full text-white"
            style={{
              background: event.themeColor
                ? `linear-gradient(to right, ${event.themeColor}, ${event.themeColor}40)`
                : undefined,
            }}
            onClick={handleSubmit}
            disabled={submitting || photos.length === 0}
          >
            {submitting ? "Submitting..." : "Submit Photos"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadContainer;
