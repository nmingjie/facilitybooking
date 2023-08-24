"use client";
import { Separator } from "@/components/ui/separator";
import { BookingDetailsParam } from "../../../unit";
interface ListingInfoProps {
    listing: BookingDetailsParam;
  }
const PriceList: React.FC<ListingInfoProps> = ({
    listing,
  }) => {
    const {bookingDetails} = listing;
    return(
    <div className="col-span-4 flex flex-col gap-8">
        <Separator></Separator>
        <div className="flex-col">
            <div className="text-lg font-semibold">{"I paid..."}</div>
            <div className="flex flex-col sm:pb-6">
                <div className="flex flex-col gap-2 py-4">
                    <span className="text-neutral-500"> Charges Per Hour</span>
                    <span className="font-medium">$ {bookingDetails.unitRate || "Unknown"}</span>
                </div>
                <Separator></Separator>
                <div className="flex flex-col gap-2 py-4">
                    <span className="text-neutral-500"> Duration (Hours)</span>
                    <span className="font-medium">{bookingDetails.duration  || "Unknown"}</span>
                </div>
                <Separator></Separator>
                <div className="flex flex-col gap-2 py-4">
                    <span className="text-neutral-500"> Discount</span>
                    <span className="font-medium">$ {bookingDetails.discountedAmount}</span>
                </div>
                <Separator></Separator>
                <div className="flex flex-col gap-2 py-4">
                    <span className="text-neutral-500"> {bookingDetails.gst || 8}% GST Tax</span>
                    <span className="font-medium">$ {(bookingDetails.totalAmount-(bookingDetails.amount-bookingDetails.discountedAmount)).toFixed(2) || "Unknown"}</span>
                </div>
                <Separator></Separator>
                <div className="flex flex-col gap-2 py-4 text-xl font-semibold">
                    <span className="text-neutral-500"> Total Amount</span>
                    <span>$ {bookingDetails.totalAmount  || "Unknown"}</span>
                </div>
            </div>
        </div>
    </div>)
}
export default PriceList;