"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import BookingsFilter from "@/components/BookingsFilter";
import BookingCard from "@/components/BookingCard";
import { useState, useEffect, Suspense } from "react";
import Loader from "@/components/Loader";
import request from "@/api/request";

export default function DemoPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    try {
      const temp = await request.get("/api/fb/Bookings");
      if (temp) setData(temp.data);
    } catch (e: any) {
      throw new Error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className=" container mx-auto py-10">
          <h2 className="mb-2 text-4xl md:text-7xl leading-tight font-medium py-4">
            View Bookings
          </h2>
          <div className="block lg:hidden">
            <BookingsFilter></BookingsFilter>
            <div className="w-full  justify-center flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
                {data.map((item) => (
                  <BookingCard key={item.id} data={item}></BookingCard>
                ))}
              </div>
              <p className="mb-2 text-xl md:text-2xl leading-tight font-medium self-center pb-4">
                Showing 1 - 3 of 3 properties
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      )}
    </>
  );
}
