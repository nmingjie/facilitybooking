"use client";
import {useState, useEffect,Suspense } from "react";
import request from "@/api/request";
import ClientOnly from "@/components/ClientOnly";
import ListingClient from "./components/ListingClient";
import { DownloadFile } from "@/lib/utils";
import LoadingOverlay from "@/components/LoadingCustom";
import { useParams } from "next/navigation";
interface IParams {
    bookingId?: string;
}
export default function PaymentSummaryPage ({params}:{params:IParams}) {
    const [bookingData,setBookingData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const query = useParams();
    const init = () => {
        request.get(`/api/fb/bookings/${query?.bookingId}/details`)
        .then((res) => {
            if(res.data.isSuccess)
            {
                setBookingData(res.data.data);
                setIsLoading(false)
            }
        })
        .catch((e) => {
            throw new Error(e);
        })
    }
    const downloadInvoice = () => {
        request.get(`/api/fb/bookings/${query?.bookingId}/invoice`,{responseType: "blob"})
        .then((res) => {
            // When no file interface returns an error, the returned data type is json(normally, the type is octet-stream). So this condition determines whether to download the file
            if (res.data.type !== "application/json") 
                DownloadFile(res.data,`${query?.bookingId}-Invoice`,'.pdf');
        })
        .catch((err) => {
            throw new Error(err);
        });
      }
    useEffect(()=> {
        init()
    },[])
    return(<ClientOnly>
        <Suspense>
        {
            isLoading && <LoadingOverlay />
        }
        {
            !isLoading&&<ListingClient listing={bookingData} downloadInvoice={downloadInvoice} />
        }
        </Suspense>
      </ClientOnly>)
}