// "use client";

// import { Download, Trash2, Video } from "lucide-react";
// import Image from "next/image";

// import { IMAGE_FORMATS, VIDEO_FORMATS } from "@/constants";
// import { getVideoThumbnailUrl } from "@/lib/utils";
// import { GlobalMedia } from "@/types/global";

// import { Button } from "../ui/button";
// import { Card } from "../ui/card";

// interface Props {
//   media: GlobalMedia;
//   onDelete?: (id: string) => void; // optional delete handler
//   onClick?: () => void; // optional click handler
// }

// const MediaCard = ({ media, onDelete, onClick }: Props) => {
//   const isImage = IMAGE_FORMATS.includes(media.fileType);
//   const isVideo = VIDEO_FORMATS.includes(media.fileType);

//   return (
//     <Card
//       onClick={onClick}
//       className="relative aspect-square overflow-hidden light-border group"
//     >
//       {/* Media preview */}
//       {isImage ? (
//         <Image
//           src={media.fileUrl}
//           alt="media"
//           fill
//           className="w-full h-full object-cover"
//         />
//       ) : isVideo ? (
//         <video
//           src={media.fileUrl}
//           className="w-full h-full object-cover"
//           muted
//           loop
//           playsInline
//           poster={getVideoThumbnailUrl(media.fileUrl)}
//           onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
//           onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
//         />
//       ) : (
//         <div className="w-full h-full bg-secondary flex items-center justify-center">
//           <Video className="h-12 w-12 text-muted-foreground" />
//         </div>
//       )}

//       {/* Hover overlay */}
//       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
//         <div className="flex space-x-2">
//           <Button size="sm" variant="secondary" asChild>
//             <a href={media.fileUrl} download>
//               <Download className="h-4 w-4" />
//             </a>
//           </Button>
//           {onDelete && (
//             <Button
//               size="sm"
//               variant="destructive"
//               onClick={() => onDelete(media._id)}
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default MediaCard;

"use client";

import { Play, ZoomIn } from "lucide-react";
import Image from "next/image";

import { VIDEO_FORMATS } from "@/constants";
import { getVideoThumbnailUrl } from "@/lib/utils";

import { Badge } from "../ui/badge";

interface MediaCardProps {
  media: {
    _id: string;
    fileUrl: string;
    fileType: string;
    caption?: string;
  };
  onClick: () => void;
}

const MediaCard = ({ media, onClick }: MediaCardProps) => {
  // const isVideo = media.fileType.startsWith("video");
  const isVideo = VIDEO_FORMATS.includes(media.fileType);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-md group"
    >
      {/* Thumbnail */}
      {isVideo ? (
        <video
          src={media.fileUrl}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          muted
          playsInline
          poster={getVideoThumbnailUrl(media.fileUrl)}
          onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
          onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
        />
      ) : (
        <Image
          src={media.fileUrl}
          alt={media.caption || "Media"}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {isVideo ? (
          <Play className="w-10 h-10 text-white drop-shadow-md" />
        ) : (
          <ZoomIn className="w-10 h-10 text-white drop-shadow-md" />
        )}
      </div>

      {/* Media Type Badge */}
      <Badge
        variant="secondary"
        className="absolute top-2 left-2 bg-white/90 text-xs text-gray-800"
      >
        {isVideo ? "Video" : "Image"}
      </Badge>
    </div>
  );
};

export default MediaCard;
