"use client";

import { Download, Trash2, Video } from "lucide-react";
import Image from "next/image";

import { IMAGE_FORMATS, VIDEO_FORMATS } from "@/constants";
import { getVideoThumbnailUrl } from "@/lib/utils";
import { GlobalMedia } from "@/types/global";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface Props {
  media: GlobalMedia;
  onDelete?: (id: string) => void; // optional delete handler
  onClick?: () => void; // optional click handler
}

const MediaCard = ({ media, onDelete, onClick }: Props) => {
  const isImage = IMAGE_FORMATS.includes(media.fileType);
  const isVideo = VIDEO_FORMATS.includes(media.fileType);

  return (
    <Card
      onClick={onClick}
      className="relative aspect-square overflow-hidden light-border group"
    >
      {/* Media preview */}
      {isImage ? (
        <Image
          src={media.fileUrl}
          alt="media"
          fill
          className="w-full h-full object-cover"
        />
      ) : isVideo ? (
        <video
          src={media.fileUrl}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          poster={getVideoThumbnailUrl(media.fileUrl)}
          onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
          onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
        />
      ) : (
        <div className="w-full h-full bg-secondary flex items-center justify-center">
          <Video className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" asChild>
            <a href={media.fileUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(media._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MediaCard;
