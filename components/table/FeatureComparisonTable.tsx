"use client";

import { Check, X } from "lucide-react";

import { GlobalPlan } from "@/types/global";

interface Props {
  plans: GlobalPlan[];
  popularPlan: string;
}

const FeatureComparisonTable = ({ plans, popularPlan = "STANDARD" }: Props) => {
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
  return (
    <div className="mb-8  overflow-x-auto max-w-7xl mx-auto p-6 card-wrapper rounded-lg">
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full ">
          <thead>
            <tr className="background-light700_dark400 text-left">
              <th className="p-3 font-semibold text-dark300_light900">
                Feature
              </th>
              {plans.map((plan) => {
                const isHighlighted = plan.name === popularPlan;
                return (
                  <th
                    key={plan._id}
                    className={`p-3 text-center font-semibold ${
                      isHighlighted
                        ? "bg-primary-100/40 text-primary-500 border-b-2 border-primary-500"
                        : "text-dark300_light900"
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
                  index % 2 === 0
                    ? "background-light800_dark100"
                    : "background-light900_dark200"
                }`}
              >
                <td className="p-3 text-dark300_light900 capitalize">
                  {featureKey.replaceAll("_", " ")}
                </td>
                {plans.map((plan) => {
                  const isHighlighted = plan.name === popularPlan;
                  return (
                    <td
                      key={`${plan._id}-${featureKey}`}
                      className={`p-3 text-center ${
                        isHighlighted ? "bg-primary-100/40" : ""
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
      <div className="block md:hidden space-y-6">
        {plans.map((plan) => {
          const isHighlighted = plan.name === popularPlan;
          return (
            <div
              key={plan._id}
              className={`rounded-xl border p-4 shadow-sm ${
                isHighlighted
                  ? "border-primary-500 bg-primary-100/20"
                  : "border-gray-200 background-light800_dark200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  isHighlighted ? "text-primary-500" : "text-dark300_light900"
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
                    <span className="text-dark300_light900 capitalize">
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

      {/* Optional small note */}
      <p className="text-sm text-gray-500 mt-3 text-center">
        ✅ = Included &nbsp;&nbsp; ❌ = Not included &nbsp;&nbsp; 📊 = Limited
        use
      </p>
    </div>
  );
};

export default FeatureComparisonTable;
