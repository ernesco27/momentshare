import { Calendar } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DashCards = () => {
  return (
    <Card className="card-wrapper !bg-purple-400 light-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-4xl font-bold">1</div>
        <p className="text-xs text-muted-foreground mt-4">
          Active photo collection events
        </p>
      </CardContent>
    </Card>
  );
};

export default DashCards;
