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

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const uploadsPerHour = [
  { hour: "8 AM", uploads: 10 },
  { hour: "9 AM", uploads: 25 },
  { hour: "10 AM", uploads: 40 },
  { hour: "11 AM", uploads: 35 },
  { hour: "12 PM", uploads: 50 },
  { hour: "1 PM", uploads: 30 },
  { hour: "2 PM", uploads: 45 },
  { hour: "3 PM", uploads: 60 },
  { hour: "4 PM", uploads: 55 },
  { hour: "5 PM", uploads: 75 },
  { hour: "6 PM", uploads: 35 },
  { hour: "7 PM", uploads: 20 },
];

const topContributors = [
  { name: "Alice", uploads: 120 },
  { name: "Kwame", uploads: 95 },
  { name: "Ama", uploads: 80 },
  { name: "Kojo", uploads: 65 },
  { name: "Yaw", uploads: 40 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

const MetricsCard = () => {
  return (
    <Card className="card-wrapper light-border">
      <CardHeader className=" space-y-0 pb-2">
        <CardTitle className="h2-semibold text-dark100_light900">
          <div className="flex-between gap-4 w-full">
            <div className="flex gap-2 items-start flex-col w-full">
              <h2 className="text-lg  lg:h3-semibold text-dark100_light900">
                Ama & Kojo&apos;s Wedding
              </h2>
              <p className="text-[12px] lg:text-[14px] text-light-400">
                312 uploads • Storage 2.00 GB
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
              Top Contributors
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topContributors}
                  dataKey="uploads"
                  nameKey="name"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {topContributors.map((entry, index) => (
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
            {/* <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded overflow-hidden"
                >
                  <Image
                    src={`https://source.unsplash.com/random/400x400?sig=${i}`}
                    alt="memory"
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                </div>
              ))}
            </div> */}
          </div>
          <Button
            size="lg"
            className="bg-primary-500 hover:primary-dark-gradient  hover:ring-primary-500 hover:ring-offset-4 transition-all duration-300 ease-in-out  text-white text-lg font-semibold hover:shadow-primary-500/50 hover:shadow-lg cursor-pointer w-full mt-6"
          >
            Manage Event
          </Button>
        </section>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
