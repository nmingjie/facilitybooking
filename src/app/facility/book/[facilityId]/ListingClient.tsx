"use client";

import ListingHead from "@/components/listing/ListingHead";
import ListingInfo from "./ListingInfo";
import ListingPrice from "@/components/listing/ListingPrice";

import Container from "@/components/Container";

import { PaymentMethod } from "./PaymentMethod";
import { store } from "@/redux";
import { ListingParam } from "../../unit";

interface ListingClientProps {
  listing: ListingParam;
}

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {
  const bookingInfo = store.getState().booking;
  const facilityBookingInfo = bookingInfo[listing.facilityID];

  return Object.keys(listing).length !== 0 ? (
    <>
      <ListingHead
        title={`${listing.building.buildingName} , ${listing.facilityName}`}
        subtitle={`${listing.building.buildingAddress}`}
        images={listing.images}
      />
      <Container>
        <div
          className="
          max-w-screen-lg 
          mx-auto
        "
        >
          <div className="flex flex-col gap-6">
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
                capacity={listing.capacity}
                buildingName={listing.building.buildingName}
                listing={listing}
              />

              <div
                className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
                flex
                flex-col
                gap-4
              "
              >
                <ListingPrice
                  price={listing.hourlyRentWeekday}
                  duration={
                    facilityBookingInfo.startTime && facilityBookingInfo.endTime
                      ? Math.abs(
                          facilityBookingInfo.endTime -
                            facilityBookingInfo.startTime
                        ) / 36e5
                      : 0
                  }
                />

                <PaymentMethod listing={listing}></PaymentMethod>
              </div>
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
