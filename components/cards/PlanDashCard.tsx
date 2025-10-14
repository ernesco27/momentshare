"use client";

import { Info, XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import ROUTES from "@/constants/route";
import { cn, getExpiryDetails, getFormattedDate } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CardProps {
  heading: string;
  description: string;
  info: string | number;
  activationDate?: string | Date;
  activeStatus?: boolean;
  otherClasses?: string;
  isProSubscriber?: boolean;
}

const PlanDashCards = ({
  heading,
  description,
  info,
  otherClasses,
  activationDate,
  activeStatus,
  isProSubscriber = false,
}: CardProps) => {
  const router = useRouter();

  const expiryDetails = isProSubscriber
    ? getExpiryDetails(activationDate)
    : null;

  const getProgressColor = (daysLeft?: number) => {
    if (daysLeft === undefined || daysLeft <= 0) return "bg-red-500";
    if (daysLeft <= 2) return "bg-red-500";
    if (daysLeft <= 10) return "bg-yellow-400";
    return "bg-green-500";
  };

  const lowCredit = !isProSubscriber && Number(info) <= 5;
  const nearExpiry =
    isProSubscriber && expiryDetails && expiryDetails.daysLeft <= 10;

  const buttonBase =
    "bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-300 ease-in-out hover:shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:outline-none";

  const renderBadge = () => {
    if (isProSubscriber) {
      const { daysLeft } = expiryDetails || {};
      let icon, text, badgeColor;

      if (!activeStatus) {
        icon = <XCircle size={14} />;
        text = "Expired";
        badgeColor = "bg-red-600";
      } else if (daysLeft && daysLeft <= 5) {
        icon = <AlertTriangle size={14} />;
        text = "Expiring Soon";
        badgeColor = "bg-yellow-500 text-black";
      } else {
        icon = <CheckCircle2 size={14} />;
        text = "Active";
        badgeColor = "bg-green-600";
      }

      return (
        <Badge
          className={cn(
            badgeColor,
            "flex items-center gap-1 text-white px-2 py-1 text-xs"
          )}
          aria-label={`Subscription status: ${text}`}
        >
          {icon}
          {text}
        </Badge>
      );
    }

    return (
      <Badge
        className="bg-green-600 flex items-center gap-1 text-white px-2 py-1 text-xs"
        aria-label="Free Plan"
      >
        <span>
          <CheckCircle2 size={14} />
        </span>
        Active
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        "transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg card-wrapper light-border",
        otherClasses
      )}
    >
      <CardHeader className="">
        <CardTitle className=" w-full flex-between   gap-2">
          <div className="space-y-1">
            <p className="text-white paragraph-semibold text-center lg:h3-semibold">
              {heading}
            </p>

            <div className="flex items-center gap-1 text-sm text-gray-400 max-sm:hidden">
              <Info size={12} className="text-gray-500" />
              <span className="text-light400_light500 text-[10px] ">
                Activated on {getFormattedDate(activationDate)}
              </span>
            </div>
          </div>

          <div>{renderBadge()}</div>
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center -mt-4">
        <div>
          <div className="text-4xl font-bold text-white">{info}</div>
          <p className="text-lg text-gray-400 mt-1">{description}</p>
        </div>

        {/*Expiry Progress */}
        {isProSubscriber && expiryDetails && (
          <div className="space-y-2">
            <div
              className={cn(
                "relative h-2 w-full rounded-full overflow-hidden",
                `${getProgressColor(expiryDetails.daysLeft)}/20`
              )}
            >
              <div
                className={cn(
                  "absolute left-0 top-0 h-full transition-all duration-700 ease-in-out",
                  getProgressColor(expiryDetails.daysLeft)
                )}
                style={{ width: `${expiryDetails.progress}%` }}
                aria-valuenow={expiryDetails.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              />
            </div>

            <p className="text-xs text-gray-400 flex justify-between max-sm:hidden">
              <span>{expiryDetails.progress.toFixed(0)}% remaining</span>
              <span>
                {expiryDetails.daysLeft > 0
                  ? `${expiryDetails.daysLeft} days left`
                  : "Expired"}
              </span>
            </p>
            <p className="text-xs text-light400_light500 italic max-sm:hidden">
              Expires on {expiryDetails.expiryDate}
            </p>
          </div>
        )}

        <div className="pt-2">
          {lowCredit ? (
            <Button
              onClick={() => router.push(ROUTES.PRICING)}
              className={buttonBase}
              size="sm"
            >
              Buy More Credits
            </Button>
          ) : nearExpiry ? (
            <Button
              onClick={() => router.push(ROUTES.PRICING)}
              className={buttonBase}
            >
              Renew Subscription
            </Button>
          ) : !isProSubscriber ? (
            <Button
              variant="outline"
              className="hover:bg-green-600 hover:text-white transition-colors"
              onClick={() => router.push(ROUTES.PRICING)}
            >
              Upgrade to Pro
            </Button>
          ) : (
            ""
          )}
        </div>

        {!isProSubscriber && (
          <p className="text-xs text-gray-400 pt-2">* 1 Credit = 1 Event</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanDashCards;
