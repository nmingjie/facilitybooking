import ImageCard from "@/components/ImageCard";
import Link from "next/Link";

type CardSettings = {
  name: string;
  image: string;
  href?: string;
};

type Props = {
  cards: CardSettings[];
};

// const modules = [
//   { name: "Facility Booking", image: "./facility.png" },
//   { name: "Aircon Extension", image: "./aircon.png" },
// ];

export default function ImageCards({ cards }: Props) {
  return (
    <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 mx-auto">
      {cards.map((item, index) => (
        <div
          key={index}
        >
          {item.href ? (
            <Link href={item.href}>
              <ImageCard name={item.name} image={item.image}></ImageCard>
            </Link>
          ) : (
            <ImageCard name={item.name} image={item.image}></ImageCard>
          )}
        </div>
      ))}
    </div>
  );
}
