"use client";
import { useEffect, useState, Suspense } from "react";
import ClientOnly from "@/components/ClientOnly";
import Loader from "@/components/Loader";
import ListingClient from "./ListingClient";
import getListingById from "@/app/actions/getListingById";
import { useParams } from "next/navigation";
import { IParams, ListingParam } from "../../unit";

const ListingPage = () => {
  const [listing, setListing] = useState<ListingParam>();
  const query = useParams();
  const init = async () => {
    const listing = await getListingById(query as IParams);
    setListing(listing);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <ClientOnly>
      <Suspense fallback={<Loader />}>
        {listing && <ListingClient listing={listing} />}
      </Suspense>
    </ClientOnly>
  );
};

export default ListingPage;
