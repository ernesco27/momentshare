"use client";

import Image from "next/image";
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

import {
  getMediaTypeStats,
  getRecentMedia,
  getUploadsPerHour,
} from "@/lib/utils";
import { GlobalEvent } from "@/types/global";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const COLORS = ["#6366F1", "#F59E0B"];

interface MetricsCardProps {
  selectedEvent?: GlobalEvent;
}

const MetricsCard = ({ selectedEvent }: MetricsCardProps) => {
  if (!selectedEvent) {
    return (
      <Card className="card-wrapper light-border">
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">
            Select an event to view metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentMedia = getRecentMedia(selectedEvent.media, 12);
  const uploadsPerHour = getUploadsPerHour(selectedEvent.media);
  const mediaTypeStats = getMediaTypeStats(selectedEvent.media);

  return (
    <Card className="card-wrapper light-border">
      <CardHeader className=" space-y-0 pb-2">
        <CardTitle className="h2-semibold text-dark100_light900">
          <div className="flex-between gap-4 w-full">
            <div className="flex gap-2 items-start flex-col w-full">
              <h2 className="text-lg  lg:h3-semibold text-dark100_light900">
                {selectedEvent.title}
              </h2>
              <p className="text-[12px] lg:text-[14px] text-light-400">
                {selectedEvent.totalMedia} uploads
              </p>
            </div>
            <div className="flex gap-2 items-end flex-col w-full flex-1">
              <p className="paragraph-regular text-light-400">Expires</p>
              <p className="text-[14px] text-dark100_light900">12/12/2025</p>
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
                <Bar dataKey="uploads" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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
                const isVideo = media.fileType?.startsWith("video");
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
            size="lg"
            className="bg-primary-500 hover:primary-dark-gradient  hover:ring-primary-500 hover:ring-offset-4 transition-all duration-300 ease-in-out  text-white text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-lg cursor-pointer w-full mt-6"
          >
            View Event
          </Button>
        </section>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
