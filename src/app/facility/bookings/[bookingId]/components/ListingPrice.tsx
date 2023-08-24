"use client";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingDetailsParam } from "../../../unit";
interface ListingPriceProps {
    listing:BookingDetailsParam;
}

const ListingPrice: React.FC<ListingPriceProps> = ({
    listing
}) => {
    const {bookingDetails} = listing;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">I paid...</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex justify-between text-2xl">
          <div className="text-wrapper-2 font-semibold text-neutral-500">Total Amount</div>
          <div className="text-wrapper-3 font-semibold">
            $ {bookingDetails.totalAmount  || "Unknown"}
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="text-wrapper-2 text-neutral-500">Charges Per Hour</div>
          <div className="text-wrapper-3 font-medium">$ {bookingDetails.unitRate || "Unknown"}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-wrapper-2 text-neutral-500">Duration (Hours)</div>
          <div className="text-wrapper-3 font-medium">{bookingDetails.duration  || "Unknown"}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-wrapper-2 text-neutral-500">Discount</div>
          <div className="text-wrapper-3 font-medium">$ {bookingDetails.discountedAmount}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-wrapper-2 text-neutral-500">{bookingDetails.gst || 8}% GST Tax</div>
          <div className="text-wrapper-3 font-medium">$ {(bookingDetails.totalAmount-(bookingDetails.amount-bookingDetails.discountedAmount)).toFixed(2) || "Unknown"}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingPrice;
