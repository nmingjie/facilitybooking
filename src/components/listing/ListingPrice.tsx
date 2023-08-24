"use client";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ListingPriceProps {
  duration: number;
  price: number;
  onChange?: Function;
}

const ListingPrice: React.FC<ListingPriceProps> = ({
  duration,
  price,
  onChange,
}) => {
  const calculatePrice = (duration: number) => {
    const timeDiscount = duration < 4 ? 1 : duration < 8 ? 0.85 : 0.75;
    return {
      discountAmount: (
        duration * price +
        duration * price * 0.08 -
        Math.round(
          (duration * price + duration * price * 0.08) *
            0.5 *
            timeDiscount *
            100
        ) /
          100
      ).toFixed(2),
      discount: 0.5 * timeDiscount,
      total: (
        Math.round(
          (duration * price + duration * price * 0.08) *
            0.5 *
            timeDiscount *
            100
        ) / 100
      ).toFixed(2),
      duration,
      tax: (Math.round(duration * price * 0.08 * 100) / 100).toFixed(2),
      price,
    };
  };

  const [totalprice, setTotalPrice] = useState(calculatePrice(duration));

  useEffect(() => {
    setTotalPrice(calculatePrice(duration));
    if (onChange) onChange(calculatePrice(duration));
  }, [duration]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>I will be paying...</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex justify-between text-lg">
          <div className="text-wrapper-2 font-semibold">Total Amount</div>
          <div className="text-wrapper-3 font-semibold">
            $ {totalprice.total}
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="text-wrapper-2 font-light">Charges Per Hour</div>
          <div className="text-wrapper-3 font-light">$ {price.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-wrapper-2 font-light">Duration (Hours)</div>
          <div className="text-wrapper-3 font-light">{duration}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-wrapper-2 font-light">Discount</div>
          <div className="text-wrapper-3 font-light">
            $ {totalprice.discountAmount}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-wrapper-2 font-light">8% GST Tax</div>
          <div className="text-wrapper-3 font-light">$ {totalprice.tax}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingPrice;
