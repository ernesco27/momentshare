"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, X } from "lucide-react";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

import { GlobalPlan } from "@/types/global";

interface Props {
  plans: GlobalPlan[];
  popularPlan: string;
}

const FeatureComparisonTable = ({ plans, popularPlan = "STANDARD" }: Props) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({
    maxWidth: 768,
  });

  const allFeatures = Array.from(
    new Set(plans.flatMap((plan) => plan.features.map((f) => f.key)))
  );

  const getFeatureDisplay = (plan: GlobalPlan, featureKey: string) => {
    const feature = plan.features.find((f) => f.key === featureKey);
    if (!feature) return <X className="text-red-500 mx-auto" />;

    if (feature.enabled && feature.limit)
      return (
        <span className="text-green-600 font-medium">
          {feature.limit !== -1
            ? `${feature.limit.toLocaleString()}`
            : "Unlimited"}
        </span>
      );
    return feature.enabled ? (
      <Check className="text-green-500 mx-auto" />
    ) : (
      <X className="text-red-500 mx-auto" />
    );
  };

  useGSAP(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.utils.toArray(".feature-card").forEach((card, i) => {
          gsap.from(card as HTMLElement, {
            opacity: 0,
            xPercent: i % 2 === 0 ? -100 : 100,
            duration: 1,
            ease: "power3.Out",

            scrollTrigger: {
              trigger: card as HTMLElement,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        });
      } else {
        gsap.from(".feature-table", {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="mt-20 mb-8 w-full px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 primary-text-gradient">
        Compare All Features
      </h2>

      {/* 💻 Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm feature-table">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-semibold text-gray-700">Feature</th>
              {plans.map((plan) => {
                const isHighlighted = plan.name === popularPlan;
                return (
                  <th
                    key={plan._id}
                    className={`p-3 text-center font-semibold ${
                      isHighlighted
                        ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500"
                        : "text-gray-700"
                    }`}
                  >
                    {plan.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((featureKey, index) => (
              <tr
                key={featureKey}
                className={`border-t ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-3 text-gray-600 capitalize">
                  {featureKey.replaceAll("_", " ")}
                </td>
                {plans.map((plan) => {
                  const isHighlighted = plan.name === popularPlan;
                  return (
                    <td
                      key={`${plan._id}-${featureKey}`}
                      className={`p-3 text-center ${
                        isHighlighted ? "bg-indigo-50" : ""
                      }`}
                    >
                      {getFeatureDisplay(plan, featureKey)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  Mobile Cards */}
      <div className="block md:hidden space-y-6">
        {plans.map((plan) => {
          const isHighlighted = plan.name === popularPlan;
          return (
            <div
              key={plan._id}
              className={`feature-card rounded-xl border p-4 shadow-sm  card-wrapper light-border  ${
                isHighlighted
                  ? "!border-primary-500 !bg-primary-50/20 scale-[1.02]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  isHighlighted ? "!text-primary-500" : "text-dark300_light700"
                }`}
              >
                {plan.name}
              </h3>
              <ul className="divide-y divide-gray-100">
                {allFeatures.map((featureKey) => (
                  <li
                    key={featureKey}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span className="text-dark300_light700 capitalize">
                      {featureKey.replaceAll("_", " ")}
                    </span>
                    <span>{getFeatureDisplay(plan, featureKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-4 text-center">
        ✅ = Included &nbsp;&nbsp; ❌ = Not included &nbsp;&nbsp; 📊 = Limited
      </p>
    </section>
  );
};

export default FeatureComparisonTable;
