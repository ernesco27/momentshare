import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CardProps {
  heading: string;
  description: string;
  info: string | number;
  accountType?: string;
  otherClasses?: string;
}

const DashCards = ({ heading, description, info, otherClasses }: CardProps) => {
  return (
    <Card className={cn("card-wrapper light-border", otherClasses)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white text-md lg:h3-semibold">
          {heading}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-4xl font-bold text-white">{info}</div>
        <p className="text-xs lg:text-lg text-light400_light500 mt-4">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default DashCards;
