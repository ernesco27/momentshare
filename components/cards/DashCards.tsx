import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CardProps {
  heading: string;
  description: string;
  info: string | number;
  otherClasses?: string;
}

const DashCards = ({ heading, description, info, otherClasses }: CardProps) => {
  return (
    <Card
      className={cn(
        "transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg card-wrapper light-border",
        otherClasses
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          <p className="text-white paragraph-semibold text-center lg:h3-semibold">
            {heading}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center -mt-4">
        <div className="text-4xl font-bold text-white">{info}</div>
        <p className="text-lg text-light400_light500 mt-4">{description}</p>
      </CardContent>
    </Card>
  );
};

export default DashCards;
