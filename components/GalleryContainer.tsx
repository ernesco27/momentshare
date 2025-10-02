"use client";

import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

import { EMPTY_EVENT } from "@/constants/states";
import { GlobalEvent } from "@/types/global";

import MediaCard from "./cards/MediaCard";
import DataRenderer from "./DataRenderer";
import { Button } from "./ui/button";

import "yet-another-react-lightbox/styles.css";

interface Props {
  event: GlobalEvent;
  success: boolean;
  error?: ApiError;
}

const GalleryContainer = ({ event, success, error }: Props) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = event.media.map((m) => ({
    src: m.fileUrl,
    type: m.fileType.startsWith("video") ? "video" : "image",
  }));

  console.log("slides", slides);

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-8">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-muted-foreground">
              {event.media.length} photos collected • Expires{" "}
              {format(new Date(event.expiryDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <DataRenderer
          data={event.media}
          success={success}
          error={error}
          empty={EMPTY_EVENT}
          render={(media) => (
            <div className="grid grid-cols-4 gap-6">
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

export default GalleryContainer;
