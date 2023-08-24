import Message from "@/components/Message";
// import ImageCards from "@/components/ImageCards";
import ImageCard from "@/components/ImageCard";
import Link from "next/link";

const moduleList = [
  { name: "Facility Booking", image: "/facility.jpg", href: "/facility/home" },
  { name: "Aircon Extension", image: "/aircon.jpg" },
];

export default function Page() {
  return (
    <div className="container">
      <h2 className="mb-2 text-3xl md:text-5xl leading-tight">
        <span>Welcome {" , "}</span>
        <span className="text-blue-500">Admin {"!"}</span>
        {/* <span>!</span> */}
      </h2>

      <Message
        title="Scheduled Maintenance - Message Title Placeholder"
        message="FEM Services will be undergoing maintenance from 9 Sept (Fri) 6pm to 7pm. Thank you for your patience! - Message Content Placeholder"
      ></Message>

      <div className="justify-center mb-8">
        <div className="w-3/4 lg:w-3/4 xl:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 mx-auto">
          {moduleList.map((item, index) => (
            <div key={index}>
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
      </div>
    </div>
  );
}
