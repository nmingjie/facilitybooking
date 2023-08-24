"use client";
import request from "@/api/request";
import {useState, useEffect, useCallback} from "react"
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { DownloadFile } from "@/lib/utils";
import Loader from "@/components/Loader";
import { useParams } from "next/navigation";
interface IParams {
    bookingId?: string;
}
type BookingParams = {
    bookingID: string;
    bookingDate: string;
    bookingTimeFrom:string;
    bookingTimeTo:string;
    facilityName:string;
    customerEmail:string;
}
export default function BookingSuccessPage ({params}:{params:IParams}) {
    const [bookingData,setBookingData] = useState<BookingParams>();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const query = useParams();
    
    const init  = useCallback(() => {
        request.get(`/api/fb/bookings/${query?.bookingId}`)
        .then((resDate) => {
            if (resDate) 
                setBookingData(resDate.data);
            setIsLoading(false);
        })
        .catch((e) => {
            setIsLoading(false);
            throw new Error(e);
        })
    },[])
     
    useEffect(() => {
        if(query?.bookingId)
            init();
    },[])

    const downloadInvoice = () => {
        request.get(`/api/fb/bookings/${params.bookingId}/invoice`,{responseType: "blob"})
        .then((res) => {
            // When no file interface returns an error, the returned data type is json(normally, the type is octet-stream). So this condition determines whether to download the file
            if (res.data.type !== "application/json") 
                DownloadFile(res.data,`${params.bookingId}-Invoice`,'.pdf');
        })
        .catch((err) => {
            throw new Error(err);
        });
    }
    return (
        <div className="container px-0">
        {
            isLoading && <Loader />
        }
        {!isLoading&&(
            <div>
                <div className="bg-[#008550]">
                <div className="px-3 xl:px-20 py-4 text-white">
                    <div className="flex mb-2">
                        <div className="mr-2 xl:mr-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
                                <circle cx="14.1406" cy="14" r="13" stroke="white" stroke-width="2"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.6115 10.0405C21.002 9.64993 21.002 9.01676 20.6115 8.62624C20.221 8.23571 19.5878 8.23571 19.1973 8.62624L12.2181 15.6054L9.08211 12.4694C8.69158 12.0788 8.05842 12.0788 7.66789 12.4694C7.27737 12.8599 7.27737 13.4931 7.66789 13.8836L11.5102 17.7259C11.5105 17.7262 11.5108 17.7264 11.511 17.7267C11.5598 17.7755 11.6125 17.8183 11.6679 17.8549C12.0561 18.1111 12.5835 18.0684 12.9252 17.7267C12.9255 17.7264 12.9258 17.7262 12.9261 17.7259L20.6115 10.0405Z" fill="white"/>
                            </svg>
                        </div>
                        <div className="text-lg xl:text-xl">Congratulations! You have successfully submitted the booking (Booking ID : {bookingData?.bookingID})</div>
                    </div>
                    <div className="ml-9 xl:ml-12 text-base xl:text-lg">You may download a copy of the booking and payment confirmation. A copy has also been sent to {bookingData?.customerEmail}. You may now view and manage this booking under Upcoming Bookings.</div>
                    <Button onClick={downloadInvoice} className="w-full mt-2 bg-transparent border border-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent text-base font-normal">
                        <svg className="mr-4" xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                            <path d="M0.636719 10.0684L0.636718 14.7754" stroke="white" stroke-linecap="round"/>
                            <path d="M8.83398 1.06836L8.83398 10.0684" stroke="white" stroke-linecap="round"/>
                            <path d="M11.5312 6.82617L8.8335 10.0645" stroke="white" stroke-linecap="round"/>
                            <path d="M5.73828 6.9668L8.83398 10.0625" stroke="white" stroke-linecap="round"/>
                            <path d="M0.634766 14.9316H16.6348" stroke="white" stroke-linecap="round"/>
                            <path d="M16.6465 10.0684L16.6465 14.7754" stroke="white" stroke-linecap="round"/>
                        </svg>
                        Download Invoice
                    </Button>
                </div>
                </div>
                <div className="bg-white">
                    <div className="px-3 xl:px-20 py-4 text-xl xl:text-2xl">
                        <div className="font-semibold">Next Steps:</div>
                        <div className="mt-2.5">You will receive a booking confirmation email shortly.</div>
                    </div>
                </div>
                <div className="px-3 xl:px-20 py-4 bg-gray-200/70">
                    <div className="text-xl xl:text-2xl">
                        <div className="font-semibold mb-2">Your Booking Details:</div>
                        <div className="flex">
                            <div className="w-48 sm:w-64">Booking Date/Time:</div>
                            <div>
                                <div className="mb-2.5">{bookingData?.bookingDate?format(new Date(bookingData.bookingDate), "dd MMM yyyy"):"--"}</div>
                                <div>
                                    <span>{bookingData?.bookingTimeFrom?format(new Date(bookingData?.bookingTimeFrom),"haaa"):"-"}</span>
                                    <span className="mx-1">-</span>
                                    <span>{bookingData?.bookingTimeTo?format(new Date(bookingData?.bookingTimeTo),"haaa"):"-"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex py-4">
                            <div className="w-48 sm:w-64">Facility Name:</div>
                            <div>{bookingData?.facilityName}</div>
                        </div>
                        <div className="">
                            <a className="text-lg xl:text-xl text-blue-600 underline decoration-1 underline-offset-2" href="/facility/bookings">View bookings here.</a>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-3 xl:pl-20 py-4 flex justify-end text-base">
                    <Button onClick={() => router.push("/facility/search")}>Book again</Button>
                </div>
            </div>
        )}
        </div>
    )
}