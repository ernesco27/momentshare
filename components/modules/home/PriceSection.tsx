"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Check, Star } from "lucide-react";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "sonner";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURE } from "@/constants";
import ROUTES from "@/constants/route";
import { cn } from "@/lib/utils";
import { GlobalPlan } from "@/types/global";

gsap.registerPlugin(ScrollTrigger);

export interface PaystackConfig {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  currency?: string;
  metadata?: Record<string, string | number>;
  channels?: string[];
  label?: string;
}

interface PlanWithPaystackProps extends GlobalPlan {
  paystackProps: PaystackConfig | null;
  configError: string | null; // Stores the error message for this plan's config
}

interface Props {
  plans: GlobalPlan[];
  userId?: string;
  email?: string;
}

// Dynamically import PaystackButtonClient
const DynamicPaystackButton = dynamic(
  () => import("@/components/paystack/PaystackButtonClient"),
  { ssr: false }
);

const PriceSection = ({ plans, userId, email }: Props) => {
  const router = useRouter();
  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

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

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const handlePaymentSuccess = useCallback(
    async (reference: string, planId: string) => {
      setIsSubscribing(false);
      setCurrentPlanId(null);
      toast.success("Payment successful! Verifying your subscription...");

      const amount = plans.find((plan) => plan._id === planId)?.price || 0;

      try {
        const response = await fetch("/api/paystack/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference, planId, userId, email, amount }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Subscription activated successfully!");
          router.push(ROUTES.DASHBOARD);
        } else {
          toast.error(
            data.message ||
              "Payment verification failed. Please contact support."
          );
          console.error("Backend verification failed:", data.message);
        }
      } catch (error) {
        toast.error(
          "An error occurred during payment verification. Please contact support."
        );
        console.error("Error verifying payment with backend:", error);
      }
    },
    [userId, plans, email, router]
  );

  const handlePaymentClose = useCallback(() => {
    toast.error("Payment closed without completing.");
    setIsSubscribing(false);
    setCurrentPlanId(null);
  }, []);

  const plansWithPaystackConfig = useMemo(() => {
    let globalConfigError: string | null = null;
    if (!publicKey) {
      globalConfigError = "Paystack public key is not configured.";
    } else if (!email) {
      globalConfigError = "Your email is required for payment.";
    }

    return plans.map((plan) => {
      const { _id, price } = plan;

      let configErrorForPlan: string | null = globalConfigError;

      if (userId && plan.name === "FREE") {
        configErrorForPlan = "Plan Activated";
      }

      if (configErrorForPlan) {
        return {
          ...plan,
          paystackProps: null,
          configError: configErrorForPlan,
        } as PlanWithPaystackProps;
      }

      const ref = nanoid(12);

      const paystackConfig: PaystackConfig = {
        reference: ref,
        email: email!,
        amount: price * 100,
        publicKey: publicKey!,
        currency: "GHS",
        metadata: {
          userId: userId || "N/A",
          planId: _id,
        },
      };
      return { ...plan, paystackProps: paystackConfig, configError: null };
    });
  }, [plans, publicKey, email, userId]);

  return (
    <section className="pt-10 price">
      <Container>
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 primary-text-gradient">
          Simple, Friendly Pricing
        </h2>
        <p className="text-center text-dark500_light400 max-w-3xl mx-auto mb-10">
          Plans are tailored for local organisers — from casual parties to
          professional event planners. Choose what fits your event and budget.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto p-8">
          {plansWithPaystackConfig.map((plan) => {
            const benefits: string[] = [];

            const {
              _id,
              name,
              credits,
              description,
              features,
              isFeatured,
              price,
              priceNote,
              paystackProps,
              configError,
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
                case FEATURE.CAN_ACCESS_ANALYTICS:
                  benefits.push("Access to Analytics Dashboard");
                  break;
                case FEATURE.DOWNLOAD_ACCESS:
                  benefits.push("Download Photos/Videos");
                  break;
                case FEATURE.MAX_UPLOADS:
                  benefits.push(
                    feature.limit !== -1
                      ? `${feature.limit} Total Uploads`
                      : "Unlimited Total Uploads"
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
                case FEATURE.MAX_ACTIVE_EVENTS:
                  benefits.push(
                    feature.limit !== -1
                      ? `${feature.limit} Active Events`
                      : "Unlimited Active Events"
                  );
                  break;
                case FEATURE.CAN_REMOVE_WATERMARK:
                  benefits.push("Watermark removed");
                  break;
                default:
                  break;
              }
            });

            const buttonIsDisabled =
              isSubscribing || !userId || !paystackProps || !!configError;
            const buttonText =
              isSubscribing && currentPlanId === _id
                ? "Processing..."
                : `Subscribe to ${name}`;

            return (
              <div id="price-card" key={_id}>
                <Card
                  className={cn(
                    "card-wrapper light-border md:max-w-[350px] relative",
                    isFeatured ? "ring-2 ring-primary-500/20 scale-105" : ""
                  )}
                >
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 min-w-[150px]">
                      <div className=" bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
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
                      {`${retentionDays?.limit || "N/A"} Days Expiry`}
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
                      {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-dark300_light900">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 space-y-3">
                      {!userId ? (
                        <Button
                          onClick={() => {
                            toast.info("Please sign in to subscribe.");
                            router.push(ROUTES.SIGN_IN);
                          }}
                          variant="outline"
                          className={cn(
                            "w-full cursor-pointer text-dark200_light900 hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out",
                            isFeatured
                              ? "primary-gradient "
                              : "ring-2 ring-primary-500/20"
                          )}
                        >
                          Sign In to Subscribe
                        </Button>
                      ) : paystackProps ? (
                        // Use the dynamically imported component
                        <DynamicPaystackButton
                          {...paystackProps}
                          onSuccess={(reference) =>
                            handlePaymentSuccess(reference.reference, _id)
                          }
                          onClose={handlePaymentClose}
                          className={cn(
                            "w-full rounded-lg h-8 cursor-pointer text-dark200_light900 hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out",
                            isFeatured
                              ? "primary-gradient"
                              : "ring-2 ring-primary-500/20",
                            buttonIsDisabled ? "cursor-not-allowed " : ""
                          )}
                          disabled={buttonIsDisabled}
                          text={buttonText}
                          onClick={() => {
                            setIsSubscribing(true);
                            setCurrentPlanId(_id);
                          }}
                        />
                      ) : (
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full cursor-not-allowed",
                            isFeatured
                              ? "primary-gradient "
                              : "ring-2 ring-primary-500/20",
                            plan.name === "FREE" &&
                              "text-green-500 dark:text-green-400"
                          )}
                          disabled={true}
                          onClick={() => {
                            if (configError) {
                              toast.error(`Cannot subscribe: ${configError}`);
                              console.error(
                                `Paystack config error for plan ${_id}: ${configError}`
                              );
                            } else if (!publicKey) {
                              toast.error(
                                "Paystack public key is missing. Please contact support."
                              );
                            } else if (!email) {
                              toast.error(
                                "Your email is missing. Please log in again."
                              );
                            }
                          }}
                        >
                          {configError || "Payment Unavailable"}
                        </Button>
                      )}
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
