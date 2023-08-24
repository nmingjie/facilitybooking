type CardSettings = {
  name: string;
  image: string;
};

import Image from "next/image";

// const modules = [
//   { name: "Facility Booking", image: "./facility.png" },
//   { name: "Aircon Extension", image: "./aircon.png" },
// ];

export default function ImageCards({ name, image }: CardSettings) {
  return (
    <div className="group border shadow-lg rounded-xl duration-300 flex flex-col">
      <div
        className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
      >
        <Image
          fill
          className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
          src={image}
          alt="Listing"
        />
      </div>

      <div className="px-2 py-4 self-center">
        <span className="text-2xl md:text-4xl">{name}</span>
      </div>
    </div>
  );
}
