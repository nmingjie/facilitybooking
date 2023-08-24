"use client";
import { useEffect, useState, Suspense } from "react";
import ClientOnly from "@/components/ClientOnly";
import Loader from "@/components/Loader";
import ListingClient from "./ListingClient";
import getListingById from "@/app/actions/getListingById";
import { useParams } from "next/navigation";
interface IParams {
  facilityId?: string;
}

const ListingPage = ({ params }: { params: IParams }) => {
  const [listing, setListing] = useState<object>({});
  const query = useParams();
  const init = async () => {
    const listing = await getListingById(query);
    setListing(listing);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <ClientOnly>
      <Suspense fallback={<Loader />}>
        {Object.keys(listing).length !== 0 && (
          <ListingClient listing={listing} />
        )}
      </Suspense>
    </ClientOnly>
  );
};

export default ListingPage;
