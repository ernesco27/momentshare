"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Check, Star } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);
const PriceSection = () => {
  const prices = [
    {
      plan: "Free",
      duration: "3 days Expiry",
      price: "0",
      priceNote: "Event",
      featured: false,
      benefits: [
        "1 Event",
        "Expires in 3 days",
        "200MB total uploads",
        "Upload photos only",
        "Watermarked",
      ],
      description: "Try it out — ideal for testing or tiny gatherings.",
    },
    {
      plan: "Standard",
      duration: "7 days Expiry",
      price: "150",
      priceNote: "Event",
      featured: true,
      benefits: [
        "1 Event",
        "Expires in 7 days",
        "2GB total uploads",
        "Upload photos and videos",
        "No watermark",
      ],
      description: "Most popular for birthdays & small weddings.",
    },
    {
      plan: "Premium",
      duration: "30 days Expiry",
      price: "250",
      priceNote: "Event",
      featured: false,
      benefits: [
        "1 Event",
        "Expires in 30 days",
        "10GB total uploads",
        "Upload photos and videos",
        "Event cover + Logo branding",
        "Priority support",
        "No watermark",
      ],
      description: "Recommended for weddings and medium events.",
    },
    {
      plan: "Pro (Monthly)",
      duration: "30 days Expiry",
      price: "350",
      priceNote: "Month",
      featured: false,
      benefits: [
        "Unlimited Events",
        "Expires in 30 days",
        "30GB / month uploads",
        "Upload photos and videos",
        "Event cover + Logo branding",
        "Priority support",
        "No watermark",
        "White-label and resell right",
        "Dedicated support",
      ],
      description: "For event planners, photographers & venues.",
    },
  ];

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
    <section className="py-20 background-light850_dark100 price">
      <Container>
        <h2 className="text-4xl font-bold text-center mb-12 primary-text-gradient">
          Simple, Friendly Pricing
        </h2>
        <p className="text-center text-dark500_light400 max-w-3xl mx-auto mb-10">
          Plans are tailored for local organisers — from casual parties to
          professional event planners. Choose what fits your event and budget.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 lg:gap-8 max-w-6xl mx-auto p-6">
          {prices.map((price, index) => (
            <div id="price-card" key={index}>
              <Card
                className={`card-wrapper light-border  md:max-w-[350px]  relative ${
                  price.featured ? "ring-2 ring-primary-500/20 scale-105" : ""
                }`}
              >
                {price.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 min-w-[150px]">
                    <div className=" bg-primary-500 text-white px-4 py-2 rounded-full text-sm  font-medium flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-dark300_light700 text-lg lg:text-2xl">
                    {price.plan}
                  </CardTitle>
                  <div className="text-sm text-dark400_light800">
                    {price.duration}
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl lg:text-4xl font-bold text-primary-500">
                      GHs{price.price}
                    </span>
                    {price.priceNote && (
                      <span className="text-dark400_light500 ml-2">
                        /{price.priceNote}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="paragraph-regular text-dark400_light800 mb-4">
                    {price.description}{" "}
                  </p>
                  <ul className="space-y-3">
                    {price.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start space-x-3">
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
                        price.featured
                          ? "primary-gradient "
                          : "ring-2 ring-primary-500/20"
                      )}
                    >
                      {`Subscribe to ${price.plan}`}
                    </Button>
                    <p className="text-xs text-dark500_light400 max-w-6xl mx-auto mt-6">
                      Notes: Media caps are total per event. We apply automatic
                      compression for videos to keep costs down. If you expect
                      heavy video usage, contact sales for a custom Enterprise
                      quote.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PriceSection;
