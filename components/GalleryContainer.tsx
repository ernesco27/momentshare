"use client";

import { format } from "date-fns";
import { ArrowLeft, DownloadCloudIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

import { VIDEO_FORMATS } from "@/constants";
import { EMPTY_EVENT, EMPTY_GALLERY } from "@/constants/states";
import { GlobalEvent, GlobalMedia } from "@/types/global";

import MediaCard from "./cards/MediaCard";
import DataRenderer from "./DataRenderer";
import "yet-another-react-lightbox/styles.css";
import Pagination from "./Pagination";
import { Button } from "./ui/button";

interface Props {
  event: GlobalEvent;
  success: boolean;
  error?: ApiError;
  media: GlobalMedia[];
  isNext: boolean;
  totalMedia: number;
  page: number;
}

const MediaGallery = ({
  event,
  success,
  error,
  totalMedia,
  media,
  isNext,
  page,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const router = useRouter();

  const slides = media.map((m) => ({
    src: m.fileUrl,
    type: VIDEO_FORMATS.includes(m.fileType) ? "video" : "image",
  }));

  console.log("slides", slides);

  return (
    <div className="min-h-screen">
      <div className="mx-auto p-8 max-w-5xl">
        <div className="flex-between mb-8 mt-4">
          <Button
            onClick={() => router.back()}
            variant="link"
            size="sm"
            className="bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden">Back</span>
          </Button>
          <p className="text-dark200_light800 text-2xl font-semibold">
            Media Gallery
          </p>
          <Button
            variant="link"
            size="sm"
            className="bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
          >
            <DownloadCloudIcon className="h-4 w-4 mr-2" />
            <span className="max-sm:hidden">{`Download All (${event.storageUsedBytes}GB)`}</span>
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="h2-bold lg:h1-bold primary-text-gradient">
            {event.title}
          </h1>
          <p className="text-light400_light500 small-regular lg:paragraph-medium">
            {` ${totalMedia} photos collected • ${event.storageUsedBytes}GB/${event.storageLimit}GB used • Expires
            ${format(new Date(event.expiryDate), "MMM d, yyyy")}`}
          </p>
        </div>
        <DataRenderer
          data={media}
          success={success}
          error={error}
          empty={EMPTY_GALLERY}
          render={(media) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {media.map((item, index) => (
                <MediaCard
                  onClick={() => {
                    setIndex(index);
                    setOpen(true);
                  }}
                  key={item._id}
                  media={item}
                />
              ))}
            </div>
          )}
        />
        <Pagination page={page} isNext={isNext} />
        {open && (
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={slides}
            index={index}
            plugins={[Video]}
            carousel={{
              finite: false, // loop navigation
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
