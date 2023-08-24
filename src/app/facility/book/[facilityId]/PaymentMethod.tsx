import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { store } from "@/redux/index";
import request from "@/api/request";
import { useRouter } from "next/navigation";
import { ListingParam } from "../../unit";

export function PaymentMethod({ listing }: { listing: ListingParam }) {
  const [form, setForm] = useState({});
  const router = useRouter();

  const facilityInfo = store.getState().booking[listing.facilityID];
  const userInfo = facilityInfo?.userInfo
    ? facilityInfo.userInfo
    : store.getState().user.userinfo;

  const handleContinueClick = async () => {
    try {
      const fallback = await request.post("/api/fb/bookings/reserve", {
        bookingDetails: {
          setupRequest: "",
          buildingID: listing.buildingID,
          buildingName: listing.building.buildingName,
          facilityType: listing.facilityType,
          facilityID: listing.facilityID,
          facilityName: listing.facilityName,
          bookingDate: facilityInfo.bookingDate.toISOString(),
          bookingTimeFrom: facilityInfo.startTime.toISOString(),
          bookingTimeTo: facilityInfo.endTime.toISOString(),
          purpose: facilityInfo.purpose,
          unitRate: facilityInfo.price,
          duration: facilityInfo.duration,
          amount: facilityInfo.duration * facilityInfo.price,
          discount: facilityInfo.discount,
          discountedAmount: Number(facilityInfo.discountAmount),
          gst: 0.08,
          totalAmount: facilityInfo.total,
          chargeableAmenities: listing.chargeableAmenities,
        },
        applicantDetails: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          userName: userInfo.userName || "",
          mobilePhone: userInfo.phoneNumber,
          designation: userInfo.designation || "",
          email: userInfo.email,
          companyName: userInfo.companyName || "",
        },
      });

      if (fallback.data.isSuccess) {
        router.push(`/facility/book/confirmation/${fallback.data.data}`);
      } else {
        throw Error(fallback.data.error.message);
      }
    } catch (e: any) {
      throw Error(e);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mb-3 h-6 w-6"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Card
          </Label>
        </RadioGroup>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="First Last"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="number">Card number</Label>
          <Input
            id="number"
            placeholder=""
            onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="month">Expires</Label>
            <Select
              onValueChange={(value: string) =>
                setForm({ ...form, expires: value })
              }
            >
              <SelectTrigger id="month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Select
              onValueChange={(value: string) =>
                setForm({ ...form, year: value })
              }
            >
              <SelectTrigger id="year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                    {new Date().getFullYear() + i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="CVC"
              onChange={(e) => setForm({ ...form, cvc: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleContinueClick}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
