import { type ComponentType, SVGProps } from "react";

interface Props {
  heading: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const FeatureCard = ({ heading, description, icon: Icon }: Props) => {
  return (
    <div className="p-6 rounded-md flex flex-col items-center justify-center card-wrapper md:max-w-[250px]">
      <Icon className="h-14 w-14 text-primary-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-dark100_light900">
        {heading}
      </h3>
      <p className="text-dark400_light500 text-md text-center">{description}</p>
    </div>
  );
};

export default FeatureCard;
