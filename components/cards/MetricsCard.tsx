"use client";

import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { VIDEO_FORMATS } from "@/constants";
import ROUTES from "@/constants/route";
import {
  getMediaTypeStats,
  getRecentMedia,
  getUploadsPerHour,
  getVideoThumbnailUrl,
} from "@/lib/utils";
import { GlobalEvent } from "@/types/global";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const COLORS = ["#6366F1", "#F59E0B"];

interface MetricsCardProps {
  selectedEvent?: GlobalEvent;
  isAnalyticsAllowed: boolean;
}

const MetricsCard = ({
  selectedEvent,
  isAnalyticsAllowed,
}: MetricsCardProps) => {
  const router = useRouter();

  if (!selectedEvent) {
    return (
      <Card className="card-wrapper light-border">
        <CardContent className="text-center py-10">
          <p className="text-dark400_light500">
            Select an event to view analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentMedia = getRecentMedia(selectedEvent.media, 12);
  const uploadsPerHour = getUploadsPerHour(selectedEvent.media);
  const mediaTypeStats = getMediaTypeStats(selectedEvent.media);

  return (
    <>
      {isAnalyticsAllowed ? (
        <Card className="card-wrapper light-border">
          <CardHeader className=" space-y-0 pb-2">
            <CardTitle className="h2-semibold text-dark100_light900">
              <div className="flex-between gap-4 w-full">
                <div className="flex gap-2 items-start flex-col w-full">
                  <h2 className="text-lg  lg:h3-semibold text-dark100_light900 line-clamp-1">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-[12px] lg:text-[14px] text-light-400">
                    {selectedEvent.totalMedia} uploads
                  </p>
                </div>
                <div className="flex gap-2 items-end flex-col w-full">
                  <p className="paragraph-regular text-light-400">Expires</p>
                  <p className="text-[14px] text-dark100_light900">
                    {format(new Date(selectedEvent.expiryDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <section className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 light-border">
                <h3 className="text-lg text-dark200_light900 font-semibold mb-4">
                  Uploads Per Hour
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={uploadsPerHour}>
                    <XAxis dataKey="hour" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar
                      dataKey="uploads"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 light-border">
                <h3 className="text-lg text-dark200_light900  font-semibold mb-4">
                  Media Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={mediaTypeStats}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {mediaTypeStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </section>
            <section className="mt-6">
              <div>
                <h3 className="font-semibold text-dark200_light900 mb-2">
                  Recent Media
                </h3>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {recentMedia.map((media, index) => {
                    const isVideo = VIDEO_FORMATS.includes(media.fileType);
                    return (
                      <div
                        key={media._id}
                        className="aspect-square bg-gray-200 rounded overflow-hidden relative"
                      >
                        {isVideo ? (
                          <video
                            src={media.fileUrl}
                            className="w-full h-full object-cover"
                            controls={false}
                            muted
                            poster={getVideoThumbnailUrl(media.fileUrl)}
                            onMouseOver={(e) =>
                              (e.currentTarget as HTMLVideoElement).play()
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget as HTMLVideoElement).pause()
                            }
                            playsInline
                          />
                        ) : (
                          <Image
                            src={media.fileUrl}
                            alt={`media-${index}`}
                            className="w-full h-full object-cover"
                            width={400}
                            height={400}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                onClick={() => {
                  router.push(ROUTES.EVENT(selectedEvent._id!));
                }}
                size="lg"
                className="bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white text-md lg:text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer w-full mt-6"
              >
                View Event
              </Button>
            </section>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-wrapper light-border">
          <CardContent className="text-center py-10">
            <p className="text-dark400_light500 mb-4">
              Your current plan does not support analytics.
            </p>
            <Button
              onClick={() => {
                router.push(ROUTES.PRICING);
              }}
              size="lg"
              className="bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white text-md lg:text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
            >
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MetricsCard;
