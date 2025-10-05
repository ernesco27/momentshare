interface Props {
  heading: string;
  description: string;
  no: number;
}

const HowToCard = ({ heading, description, no }: Props) => {
  return (
    <div className="p-6 rounded-md flex gap-12 justify-between items-center card-wrapper md:max-w-[400px]">
      <div className="text-9xl font-bold primary-text-gradient">{no}</div>
      <div className="flex flex-col justify-center gap-4">
        <h2 className="text-dark100_light900 h2-semibold">{heading}</h2>
        <h3 className="text-dark400_light500">{description}</h3>
      </div>
    </div>
  );
};

export default HowToCard;
