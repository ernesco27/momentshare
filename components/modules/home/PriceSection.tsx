"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Check, Star } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURE } from "@/constants";
import { cn } from "@/lib/utils";
import { GlobalPlan } from "@/types/global";

gsap.registerPlugin(ScrollTrigger);
const PriceSection = ({ plans }: { plans: GlobalPlan[] }) => {
  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  useGSAP(() => {
    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: ".price",
          start: "top 50%",
          end: "bottom top",
        },
      })
      .from("#price-card", {
        yPercent: 100,
        opacity: 0,
        ease: "back",
        duration: 1,
        stagger: {
          amount: 0.2,
          from: "start",
        },
      });

    return () => {
      if (tl) tl.kill();
    };
  }, [isMobile]);
  return (
    <section className="pt-10  price">
      <Container>
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 primary-text-gradient">
          Simple, Friendly Pricing
        </h2>
        <p className="text-center text-dark500_light400 max-w-3xl mx-auto mb-10">
          Plans are tailored for local organisers — from casual parties to
          professional event planners. Choose what fits your event and budget.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10  max-w-7xl mx-auto p-8">
          {plans.map((plan, index) => {
            const benefits: string[] = [];

            const {
              name,
              credits,
              description,
              durationDays,
              features,
              isFeatured,
              price,
              priceNote,
            } = plan;

            const retentionDays = features.find(
              (feature) => feature.key === FEATURE.RETENTION_DAYS
            );

            if (plan.type === "CREDIT") {
              benefits.push(`${credits ?? 1} Event`);
            } else if (plan.type === "SUBSCRIPTION") {
              benefits.push("Unlimited Events");
            }

            if (retentionDays?.limit) {
              benefits.push(`Expires in ${retentionDays.limit} days`);
            }

            features.forEach((feature) => {
              if (!feature.enabled) return;

              switch (feature.key) {
                case FEATURE.CUSTOM_BRANDING:
                  benefits.push("Event Cover + Logo Branding");
                  break;

                case FEATURE.ANALYTICS:
                  benefits.push("Access to Analytics Dashboard");
                  break;

                case FEATURE.DOWNLOAD_ACCESS:
                  benefits.push("Download Photos/Videos");
                  break;

                case FEATURE.MAX_UPLOADS:
                  benefits.push(
                    feature.limit
                      ? `${feature.limit} Total Uploads`
                      : "Unlimited Uploads"
                  );
                  break;

                case FEATURE.STORAGE_LIMIT_GB:
                  benefits.push(
                    feature.limit
                      ? `${feature.limit}GB total storage`
                      : "Unlimited storage"
                  );
                  break;

                case FEATURE.VIDEO_UPLOADS:
                  benefits.push("Upload Photos and Videos");
                  break;

                case FEATURE.RESELL_RIGHT:
                  benefits.push("White-label and Resell Right");
                  break;

                case FEATURE.PRIORITY_SUPPORT:
                  benefits.push("Priority Support");
                  break;

                default:
                  break;
              }
            });

            return (
              <div id="price-card" key={index}>
                <Card
                  className={`card-wrapper light-border  md:max-w-[350px]  relative ${
                    isFeatured ? "ring-2 ring-primary-500/20 scale-105" : ""
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 min-w-[150px]">
                      <div className=" bg-primary-500 text-white px-4 py-2 rounded-full text-sm  font-medium flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-dark300_light700 text-lg ">
                      {name}
                    </CardTitle>
                    <div className="text-sm text-dark400_light800">
                      {`${retentionDays?.limit} Days Expiry`}
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl lg:text-4xl font-bold text-primary-500">
                        GHs{price}
                      </span>
                      {priceNote && (
                        <span className="text-dark400_light500 ml-2">
                          /{priceNote}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="paragraph-regular text-dark400_light800 mb-4">
                      {description}{" "}
                    </p>
                    <ul className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-dark300_light900">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 space-y-3">
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full cursor-pointer text-dark200_light900 hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out",
                          isFeatured
                            ? "primary-gradient "
                            : "ring-2 ring-primary-500/20"
                        )}
                      >
                        {`Subscribe to ${name}`}
                      </Button>
                      <p className="text-xs text-dark500_light400 max-w-6xl mx-auto mt-6">
                        Notes: Media caps are total per event. We apply
                        automatic compression for videos to keep costs down. If
                        you expect heavy video usage, contact sales for a custom
                        Enterprise quote.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default PriceSection;
