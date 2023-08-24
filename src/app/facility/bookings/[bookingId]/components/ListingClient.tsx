"use client";

import ListingHead from "@/components/listing/ListingHead";
import ListingInfo from "./ListingInfo";
import ListingPrice from "./ListingPrice";
import Container from "@/components/Container";
import PriceList from "./PriceList";
import { Button } from "@/components/ui/button";
import { BsDownload } from "react-icons/bs";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { BookingDetailsParam } from "../../../unit";
interface ListingClientProps {
  listing: BookingDetailsParam | undefined;
  downloadInvoice:any;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing, downloadInvoice }) => {
  const router = useRouter();
  return listing&&Object.keys(listing).length !== 0 ? (
    <>
      <ListingHead
        title={`${listing.facilityDetails.building.buildingName} , ${listing.facilityDetails.facilityName}`}
        subtitle={`${listing.facilityDetails.building.buildingAddress}`}
        images={listing.facilityDetails.images}
      />
      <Container>
        <div
          className="
          max-w-screen-lg 
          mx-auto
        "
        >
          <div className="flex flex-col md:gap-6">
            <div
              className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
            >
              <ListingInfo
                capacity={listing.facilityDetails.capacity}
                buildingName={listing.facilityDetails.building.buildingName}
                listing={listing}
              />

              <div
                className="
                hidden 
                sm:block
                order-first 
                sm:mb-10 
                md:order-last 
                md:col-span-3
                flex
                flex-col
                gap-4
              "
              >
                <ListingPrice
                  listing={listing}
                />
              </div>
              <div
                className="
                block 
                sm:hidden
                mb-10
                md:order-last 
                md:col-span-3
                flex
                flex-col
                gap-4
              ">
                <PriceList listing={listing}></PriceList>
              </div>
            </div>
            <Separator className="hidden sm:block"></Separator>
            <div className="flex justify-end mb-5 ">
              <Button onClick={() => router.push("/facility/bookings")} className="hidden sm:block border-blue-400 text-blue-400 hover:text-blue-400" variant={"outline"}>
                Back
              </Button>
              <Button  className="ml-3" onClick={downloadInvoice}>
                <BsDownload className="mr-3"/>
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  ) : (
    <></>
  );
};

export default ListingClient;
