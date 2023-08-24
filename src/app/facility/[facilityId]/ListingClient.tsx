"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ListingHead from "@/components/listing/ListingHead";
import ListingInfo from "./ListingInfo";
import ListingPrice from "@/components/listing/ListingPrice";

import Container from "@/components/Container";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import Map from "@/components/Map";
import { ScrollArea } from "@/components/ui/scroll-area";

import Link from "next/link";
import request from "@/api/request";
import { store } from "@/redux/index";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListingParam } from "../unit";

import { Checkbox } from "@/components/ui/checkbox";

interface ListingClientProps {
  listing: ListingParam;
}

type ReservationParam = {
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
};

type TramsportsParam = {
  itemDesc: string;
  itemName: string;
  itemType: string;
  seqNum: number;
};

type ParkingParam = {
  itemDesc: string;
  itemName: string;
  itemQty: number;
  itemType: string;
  seqNum: number;
};

type BuildingInfoParam = {
  amenities: string;
  parkings: ParkingParam[];
  transports: TramsportsParam[];
};

const ListingClient: React.FC<ListingClientProps> = ({ listing }) => {
  const [reservation, setReservation] = useState({
    bookingDate: new Date(Math.ceil(Date.now() / 3600000) * 3600000),
    startTime: new Date(Math.ceil(Date.now() / 3600000) * 3600000),
    endTime: new Date(Math.ceil(Date.now() / 3600000) * 3600000 + 1800000),
  });

  const [readRegulations, setReadRegulations] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const [center, setCenter] = useState<number[]>([]);
  const [purpose, setPurpose] = useState<string | undefined>("");
  const [width, setWidth] = useState(store.getState().global.currentSize);
  const [priceInfo, setPriceInfo] = useState({});
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfoParam>();
  const router = useRouter();
  const clientRef = useRef(null);

  const handleProceedToBookClick = (publicUserInfo = undefined) => {
    const basicBookingInfo = {
      bookingDate: reservation.bookingDate,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      purpose,
      facilityID: listing.facilityID,
      ...priceInfo,
    };

    if (publicUserInfo) {
      store.dispatch({
        type: "SET_BOOKING_INFO",
        data: {
          ...basicBookingInfo,
          userInfo: publicUserInfo,
        },
      });
    } else {
      store.dispatch({
        type: "SET_BOOKING_INFO",
        data: basicBookingInfo,
      });
    }

    router.push(`/facility/book/${listing.facilityID}`);
  };

  const dialogContentNode = (
    <p>
      The following terms and conditions shall apply to all persons and
      organisations who/that use the Facilities at Meeting Point: <br />•
      “Applicant” refers to any person or organisation who/that rent and uses
      the facilities. <br />• “JTC” refers to JTC Corporation at 8 Jurong Town
      Hall Road, Singapore 609434.
      <p>
        <br />
        1. Application <br />
        1.1 Completed application form to be signed and emailed to
        G12Helpdesk.Sgp@cwservices.com. <br />
        1.2 A minimum of 3 working days’ notice is required for any booking of
        the facility. <br />
        1.3 The booking is not valid without a confirmation email. <br />
        1.4 Invoice will be generated every month end, applicant to expect
        invoice in the first two weeks of the following month. JTC reserves the
        right to reject booking request from applicant who has not made payment
        for the previous booking(s). <br />
        1.5 Contact person has to sign in and out with our facility manager
        before and after each booking. <br />
        1.6 The signatory of this request form shall be deemed to be the
        Applicant or Representative authorized by the Applicant to act on behalf
        of the Applicant; and shall be responsible for matters regarding the use
        of facilities in Meeting Point. <br />
        1.7 The applicant may at the time of booking raise the request for other
        services but JTC reserves the rights not to provide. Any additional
        services, if so provided, shall be charged separately. These charges
        shall be fully paid not later than seven (7) working days before the day
        of use of the Facilities.
        <br />
        1.8 Extensions beyond the confirmed booking will be subject to its
        availability, and additional charges will be applicable at hourly rate
        or part thereof. No extension shall be granted beyond the stipulated
        business hours. <br />
        1.9 All bookings are non‐transferable. <br />
        1.10 No claim of partial rebate on the facilities rental charges shall
        be entertained in the event if the facilities are only partially
        occupied throughout its use. <br />
        1.11 Interest at 8% per annum will be levied until full payment is
        received.
      </p>
      <p>
        <br />
        2. Cancellation <br />
        2.1 Any cancellation or amendment of booking date, time or duration must
        be sent via email to G12Helpdesk.Sgp@cwservices.com at least 3 working
        days in advance from the event or meeting date booked. Penalty for
        cancellation without advance notice of 3 working days will be at 100% of
        rental charge.
      </p>
      <p>
        <br />
        3. Facilities Check‐in and Check‐out <br />
        3.1 Applicant shall be present at the stipulated time for Audio‐Visual
        Equipment/ Accessories Setup to ensure all requirements are met. He/she
        shall also check‐in and signed for the use of Audio‐Visual Equipment/
        Accessories & Furniture. <br />
        3.2 Applicant is responsible for the check‐out of all Audio‐Visual
        Equipment/ Accessories and Furniture with JTC Facilities Manager after
        use. <br />
        3.3 Applicant can appoint his representative to check‐in/ check‐out of
        all Audio‐Visual Equipment/ Accessories and Furniture on his/ her behalf
        with an official authorisation letter to JTC. Important note: In the
        event that the check‐in/ check‐out form is not duly completed and
        signed, he/she will still be held responsible and liable to pay JTC for
        any damages or loss/ repair/ replacement of Audio‐Visual Equipment/
        Accessories and Furniture.
      </p>
      <p>
        <br />
        4. Use of Facilities <br />
        4.1 It shall be the duty of the applicant to ensure that all acts to be
        performed have been licensed, censored or passed as the case may be, by
        the relevant Authorities. <br />
        4.2 The applicant must confine the event within the space approved.{" "}
        <br />
        4.3 No animals or pets, durian foodstuff, alcoholic drinks, inflammable
        or explosive materials shall be admitted to the Facilities and in the
        Buildings. <br />
        4.4 Subject to agreement, applicant’s properties may be stored in the
        facilities during the function or performance. JTC will not be held
        responsible for any damage, loss, theft or by any cause whatsoever to
        any property, goods, things, articles deposited in the rooms or by any
        persons in one way or another connected to the Lessee. These properties
        must be removed from the Facilities on termination of the booking
        period. <br />
        4.5 No external fixtures are allowed to be used in any part of the
        Facilities and any areas in Meeting point. <br />
        4.6 All corridors aisles and means of exit must be kept clear and shall
        not be obstructed by furniture or goods. The access way must be kept
        clear at all times. <br />
        4.7 The applicant is not allowed to shift any furniture/ fittings/
        equipment within/ out of the facilities without prior agreement with
        JTC. <br />
        4.8 No posters or notices to be put up by the Applicant in any part of
        the Facilities and any areas in the Buildings without the permission of
        JTC. <br />
        4.9 Electrical equipment or any other fittings that may cause damage to
        the Facilities are not allowed into the facilities. No electrical
        fittings of any kind shall be attached to, or used in conjunction with
        existing electrical fittings without the permission of JTC. <br />
        4.10 JTC shall not be liable for any loss due to any breakdown of
        machinery, failure of supply of electricity, leakage of water, fire,
        government restriction, act of God which may cause facilities to be
        temporarily closed, hiring interrupted or cancelled. <br />
        4.11 The applicant shall give prior written notice to JTC for agreement
        if he/she decides to use the own equipment and setup. <br />
        4.12 The Facilities shall only be used for official meetings, seminars,
        functions and/or such purposes approved by JTC. <br />
        4.13 Applicant shall not use JTC’s name or logos in any way either
        directly or indirectly in his advertising, promotions or any other
        activities, other than for purpose of providing the address of JTC
        Summit. <br />
        4.14 Smoking and littering are prohibited anywhere within the building.{" "}
        <br />
        4.15 Pre‐event preparation and post‐event clearing will be undertaken by
        the Applicant.
      </p>
      <p>
        <br />
        5. Damages <br />
        5.1 The Applicant shall indemnify JTC/ MA in full from and against all
        losses and damages to the rooms, equipment and all properties caused
        directly or indirectly by the Applicant, its employees, guests and
        agents. JTC shall repair, rectify and make good of such damages and bill
        the Applicant accordingly. <br />
        5.2 JTC shall not be liable for any loss due to any breakdown of
        equipment, failure of electricity supply, water leakage, fire,
        government restriction or acts of God which may cause the venue to be
        temporarily closed, event to be interrupted or cancelled.
        <br />
        5.3 The Applicant shall be fully responsible and liable to pay for any
        third party claims for any damages caused by its employees, guests and
        agents in the building either directly or indirectly in connection with
        the use of the facilities. <br />
        5.4 The Applicant who has obtained written agreement for the use of
        their own equipment or stage properties from JTC has to ensure the
        proper handling of such equipment or stage properties. He/ She shall
        undertake that their own equipment and stage properties are safe to use
        and do not cause any damages to the Facilities, Equipment and all other
        JTC properties. It is the responsibility of the Applicant to ensure that
        the event organiser he/ she hired has the knowledge of the equipment/
        stage properties and is capable to exercise preventive measures for the
        action taken so as not to cause any damages to the Facilities, Equipment
        and all other JTC properties. <br />
        5.5 Facilities Management will handle/ troubleshoot Audio‐Visual System
        or Equipment which are JTC’s properties. He shall not be obliged to
        handle any system/ equipment, which is engaged by the Applicant from
        other sources. In the event that JTC facility Technician handles the
        equipment which are non‐JTC property at the insistence of the Applicant,
        he &/or JTC shall not be liable for any damages caused. <br />
        5.6 The Applicant shall not claim against JTC in respect of damages,
        which are beyond JTC control or could not be reasonably avoided.
        <br />
        5.7 The Applicant shall not claim against JTC in respect of any
        cancellation of event arising from any loss, damage or circumstances
        which are beyond JTC control or could not be reasonably avoided. <br />
        5.8 No nails, adhesives, thumbtacks or such like materials are allowed
        to be used on any part of the Facilities, unless approved by JTC. If
        approved, the Applicant shall be liable for any damages arising from
        such use. Goods, equipment, furniture and such like articles should be
        properly handled and the Applicant shall be liable for any damages to
        the floor or other part of the Facilities.
      </p>
      <p>
        <br />
        6. Injuries <br />
        6.1 The Applicant shall ensure the safety and wellbeing of its
        employees, guests, agents and any other persons in the buildings in
        connection with the use of the facilities. <br />
        6.2 The Applicant shall be fully responsible and liable to pay for any
        claim for any injuries suffered by its employees, guests, agents or any
        other persons in the buildings either directly or indirectly in
        connection with the use of the facilities. <br />
        6.3 JTC/ MA shall not be responsible for any injuries suffered by the
        Applicant, its employees, guests, agents or any other persons in the
        building either directly or indirectly in connection with the use of the
        facilities in the buildings. JTC is not liable to pay for any such
        claims by either the Applicant or any third parties in connection with
        the use of the facilities in the buildings.
      </p>
      <p>
        <br />
        7. Fire Safety <br />
        7.1 The organiser must appoint a fire warden throughout the duration of
        the event. <br />
        7.2 The Applicant must comply with all Fire Safety regulations and must
        ensure that there are no obstructions to all fire escape routes, no
        storage and use of flammable materials. The Applicant shall be entirely
        responsible and liable to pay for any claims or injuries either directly
        or indirectly in connection with the use of flammable of any kind.
      </p>
      <p>
        <br />
        8. Others <br />
        8.1 JTC reserves the rights to make changes to the rental rates without
        any prior notice. <br />
        8.2 JTC may in its absolute discretion grant, reject any booking request
        or withdraw its agreement for use of the facilities without giving any
        reasons. <br />
        8.3 JTC shall not be liable for any loss, cost incurred by the
        Applicant, etc due to the cancellation or withdrawal of any bookings
        made by the Applicant. <br />
        8.4 JTC reserves the right to waive, add, amend and cancel any of the
        terms and conditions of rental without prior notice to Applicant. <br />
        8.5 In the event of contravention of any of these Terms and Conditions,
        JTC reserves the rights to ask the Applicant to vacate the Facilities.{" "}
        <br />
        8.6 Strictly no cooking is allowed at all times.
        <br />
        8.7 Strictly no smoking is allowed at all times. <br />
        8.8 Permissible floor loading should not exceed 5 kN/m2. <br />
        8.9 For any event that lasts for more than one (1) day, the Applicant
        must ensure that all exhibits are kept off‐site at a safe location, or
        to provide security on site, if off‐site storage is not possible. <br />
        8.10 The applicant shall provide details of the type of event in writing
        to seek JTC for agreement. JTC reserves the rights in its absolute
        discretion to decide the agreement of such event.
      </p>
    </p>
  );

  const init = async () => {
    try {
      const temp = await request.get(`/api/Building/${listing.buildingID}`);

      setMarkers([{ lat: temp.data.lat, lng: temp.data.lng }]);
      setCenter([temp.data.lat, temp.data.lng]);
      setBuildingInfo(temp.data);
    } catch (e: any) {
      throw Error(e);
    }
  };
  useEffect(() => {
    init();
  }, []);

  store.subscribe(() => {
    setWidth(store.getState().global.currentSize);
  });

  return (
    <>
      <ListingHead
        title={`${listing.building.buildingName} , ${listing.facilityName}`}
        subtitle={listing.building.buildingAddress}
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
                price={listing.hourlyRentWeekday}
                listing={listing}
                setReservation={(reservation: ReservationParam) => {
                  setReservation(reservation);
                }}
                purposeChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement> | undefined
                ) => {
                  setPurpose(e?.target.value);
                }}
                handleSubmitClick={handleProceedToBookClick}
                ref={clientRef}
              />
              <div className="md:col-span-3">
                <ListingPrice
                  price={listing.hourlyRentWeekday}
                  duration={
                    Object.keys(reservation).length !== 0
                      ? Math.abs(
                          (reservation.endTime as any) -
                            (reservation.startTime as any)
                        ) / 36e5
                      : 0
                  }
                  onChange={(change: object) => {
                    setPriceInfo(change);
                  }}
                />
              </div>
            </div>
            <Separator></Separator>
            <div className="text-lg font-bold">{"How to get there"}</div>
            <div className={width < 640 ? "flex flex-col" : "flex h-[400px]"}>
              <div className="aspect-square flex-1">
                {" "}
                {center.length === 0 ? (
                  <div key="initMap">
                    <Map />
                  </div>
                ) : (
                  <div key="readyMap">
                    <Map
                      center={center}
                      markers={markers}
                      className={"h-[400px] z-0"}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 pl-5">
                <div className="flex flex-row jutify-start items-center">
                  <div className="w-[40px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 32 33"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2.79756 12.0286C2.40887 9.95893 2.67869 7.9317 3.62053 6.34191C4.54602 4.77974 6.17319 3.54667 8.71655 3.10654C11.2824 2.66251 13.6742 3.22302 15.4619 4.31233C17.2666 5.41204 18.3695 6.98926 18.5394 8.52445L20.5504 8.28297C20.2979 6.0014 18.7251 3.95545 16.5501 2.63014C14.358 1.29441 11.4658 0.62804 8.39272 1.15984C5.29707 1.69555 3.1259 3.25709 1.874 5.37023C0.63846 7.45576 0.35185 9.98456 0.807999 12.4135C1.72094 17.2748 4.00237 21.8189 6.02697 25.1214C7.04299 26.7788 8.00295 28.1373 8.7103 29.0833C9.06416 29.5565 9.35531 29.9272 9.55931 30.181C9.66132 30.308 9.74158 30.4058 9.79705 30.4727C9.82478 30.5062 9.84632 30.5319 9.86128 30.5497L9.87874 30.5704L9.88368 30.5762L9.88519 30.578L9.8857 30.5786C9.88589 30.5788 9.88605 30.579 10.6667 29.9392C11.4473 29.2995 11.4474 29.2996 11.4475 29.2997L11.4471 29.2992L11.4443 29.2959L11.4312 29.2804C11.4192 29.2662 11.4006 29.244 11.376 29.2142C11.3266 29.1547 11.2526 29.0645 11.157 28.9456C10.9659 28.7077 10.6886 28.3549 10.3494 27.9012C9.6705 26.9933 8.74538 25.6842 7.76602 24.0867C5.79987 20.8795 3.64936 16.5644 2.79756 12.0286ZM10.6731 13.4896C12.4298 13.4896 13.7423 12.1272 13.7423 10.5823C13.7423 9.03736 12.4298 7.67504 10.6731 7.67504C8.9164 7.67504 7.60398 9.03736 7.60398 10.5823C7.60398 12.1272 8.9164 13.4896 10.6731 13.4896ZM10.6731 15.4896C13.4727 15.4896 15.7423 13.2925 15.7423 10.5823C15.7423 7.87209 13.4727 5.67504 10.6731 5.67504C7.87351 5.67504 5.60398 7.87209 5.60398 10.5823C5.60398 13.2925 7.87351 15.4896 10.6731 15.4896ZM30.6696 10.129C31.2219 10.129 31.6696 10.5767 31.6696 11.129V14.7388C31.7193 14.8575 31.7467 14.9878 31.7467 15.1246C31.7467 15.2614 31.7193 15.3917 31.6696 15.5104V18.9669C31.7193 19.0856 31.7467 19.2159 31.7467 19.3527C31.7467 19.4895 31.7193 19.6198 31.6696 19.7385L31.6696 31.0307C31.6696 31.4948 31.3534 31.8851 30.9247 31.9978C30.915 32.0004 30.9052 32.0028 30.8954 32.0051C30.8226 32.0219 30.7467 32.0309 30.6688 32.0309L12.0819 32.0309C11.5296 32.0309 11.0819 31.5832 11.0819 31.0309C11.0819 30.4786 11.5296 30.0309 12.0819 30.0309H15.0351C14.9471 29.8055 14.8988 29.5604 14.8988 29.3039V20.7631C14.8988 19.6585 15.7943 18.7631 16.8988 18.7631H18.6856V11.1296C18.6856 10.7865 18.8584 10.4837 19.1217 10.3036C19.2824 10.1935 19.4769 10.129 19.6864 10.129H30.6696ZM29.6696 14.1246L26.9871 14.1246C26.4348 14.1246 25.9871 14.5723 25.9871 15.1246C25.9871 15.6769 26.4348 16.1246 26.9871 16.1246L29.6696 16.1246V18.3527H27.457C26.9048 18.3527 26.457 18.8004 26.457 19.3527C26.457 19.905 26.9048 20.3527 27.457 20.3527H29.6696L29.6696 30.0309L25.7457 30.0309C25.8337 29.8055 25.882 29.5604 25.882 29.3039V23.1707C26.1817 22.998 26.3836 22.6744 26.3836 22.3036C26.3836 21.9328 26.1817 21.6091 25.882 21.4364V20.7631C25.882 19.6585 24.9865 18.7631 23.882 18.7631H20.6856V12.129H29.6696V14.1246ZM20.8777 21.3036H23.882V20.7631H16.8988V29.3039H23.882L23.882 23.3036H20.8777C20.3254 23.3036 19.8777 22.8559 19.8777 22.3036C19.8777 21.7513 20.3254 21.3036 20.8777 21.3036Z"
                        fill="#3A3A3A"
                      />
                    </svg>
                  </div>
                  <div className="pl-5">
                    <div className="font-semibold"> Transport</div>
                    {buildingInfo &&
                      buildingInfo.transports &&
                      buildingInfo.transports.map((trans) => (
                        <div key={trans.itemDesc}>{trans.itemDesc}</div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-row jutify-start items-center mt-7">
                  <div className="w-[40px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 31 31"
                      fill="none"
                    >
                      <rect
                        x="1.13965"
                        y="1.14111"
                        width="28"
                        height="28"
                        stroke="#3A3A3A"
                        stroke-width="2"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.0538 8.8177C13.4443 8.42718 13.4443 7.79401 13.0538 7.40349C12.6633 7.01296 12.0301 7.01296 11.6396 7.40349L7.02051 12.0226L5.06453 10.0666C4.674 9.67605 4.04084 9.67605 3.65032 10.0666C3.25979 10.4571 3.25979 11.0903 3.65032 11.4808L6.31336 14.1438C6.59025 14.4207 6.98912 14.5013 7.337 14.3855C7.47981 14.338 7.61403 14.2575 7.7277 14.1438L13.0538 8.8177Z"
                        fill="#3A3A3A"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.0538 19.5977C13.4443 19.2072 13.4443 18.574 13.0538 18.1835C12.6633 17.793 12.0301 17.793 11.6396 18.1835L7.02051 22.8026L5.06453 20.8466C4.674 20.4561 4.04084 20.4561 3.65032 20.8466C3.25979 21.2371 3.25979 21.8703 3.65032 22.2608L6.31336 24.9239C6.59025 25.2008 6.98912 25.2813 7.337 25.1656C7.47981 25.1181 7.61403 25.0375 7.7277 24.9238L13.0538 19.5977Z"
                        fill="#3A3A3A"
                      />
                      <path
                        d="M16.6396 10.6411H24.8896"
                        stroke="#3A3A3A"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                      <path
                        d="M16.6396 21.8911H24.8896"
                        stroke="#3A3A3A"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <div className="pl-5">
                    <div className="font-semibold"> Amentities</div>
                    <div>{buildingInfo && buildingInfo.amenities}</div>
                  </div>
                </div>

                <div className="flex flex-row jutify-start items-center mt-7">
                  <div className="w-[40px]">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.3623 15.1323L5.82729 10.5363C6.5652 8.52211 8.54937 7.17236 10.7795 7.17236H11.7961M27.9755 15.794C29.2437 16.2962 30.1401 17.4943 30.1401 18.8911"
                        stroke="#3A3A3A"
                        stroke-width="2"
                      />
                      <ellipse
                        cx="7.81388"
                        cy="21.0005"
                        rx="1.15079"
                        ry="1.17188"
                        fill="#3A3A3A"
                      />
                      <ellipse
                        cx="24.3861"
                        cy="21.0005"
                        rx="1.15079"
                        ry="1.17188"
                        fill="#3A3A3A"
                      />
                      <path
                        d="M27.575 8.57861C27.575 12.0044 24.8525 14.7505 21.5321 14.7505C18.2118 14.7505 15.4893 12.0044 15.4893 8.57861C15.4893 5.15279 18.2118 2.40674 21.5321 2.40674C24.8525 2.40674 27.575 5.15279 27.575 8.57861Z"
                        stroke="#3A3A3A"
                        stroke-width="2"
                      />
                      <path
                        d="M23.6178 3.62611C24.4978 3.62611 25.2028 3.89611 25.7328 4.43611C26.2728 4.97611 26.5428 5.68611 26.5428 6.56611C26.5428 7.43611 26.2678 8.13611 25.7178 8.66611C25.1778 9.19611 24.4628 9.46111 23.5728 9.46111H20.6478C20.6078 9.46111 20.5878 9.48111 20.5878 9.52111V13.9911C20.5878 14.0911 20.5378 14.1411 20.4378 14.1411H19.6728C19.5728 14.1411 19.5228 14.0911 19.5228 13.9911V3.77611C19.5228 3.67611 19.5728 3.62611 19.6728 3.62611H23.6178ZM23.4978 8.57611C24.0878 8.57611 24.5678 8.39611 24.9378 8.03611C25.3078 7.66611 25.4928 7.18111 25.4928 6.58111C25.4928 5.97111 25.3078 5.48111 24.9378 5.11111C24.5678 4.74111 24.0878 4.55611 23.4978 4.55611H20.6478C20.6078 4.55611 20.5878 4.57611 20.5878 4.61611V8.51611C20.5878 8.55611 20.6078 8.57611 20.6478 8.57611H23.4978Z"
                        fill="#3A3A3A"
                      />
                      <path
                        d="M30.1396 18.7411V22.7911C30.1396 24.7793 28.5659 26.3911 26.6245 26.3911H4.6548C2.71344 26.3911 1.13965 24.7793 1.13965 22.7911V18.7411C1.13965 16.7529 2.70974 15.1411 4.65111 15.1411"
                        stroke="#3A3A3A"
                        stroke-width="2"
                      />
                      <path
                        d="M4.3623 25.9224C4.3623 27.7974 4.98373 30.1411 6.64088 30.1411C8.29802 30.1411 8.50516 28.2661 8.50516 25.9224"
                        stroke="#3A3A3A"
                        stroke-width="2"
                      />
                      <path
                        d="M22.7744 25.9224C22.7744 27.7974 23.4649 30.1411 25.3062 30.1411C27.1474 30.1411 27.3776 28.2661 27.3776 25.9224"
                        stroke="#3A3A3A"
                        stroke-width="2"
                      />
                      <path
                        d="M4.3623 15.1411H14.4893"
                        stroke="#3A3A3A"
                        stroke-width="2"
                      />
                    </svg>
                  </div>
                  <div className="pl-5">
                    <div className="font-semibold"> Parking</div>
                    {buildingInfo &&
                      buildingInfo.parkings &&
                      buildingInfo.parkings.map((park) => (
                        <div key={park.itemDesc}>{park.itemDesc}</div>
                      ))}
                  </div>
                </div>
              </div>
            </div>{" "}
            {width < 640 && <Separator></Separator>}
            <div className="flex items-center">
              <Checkbox
                checked={readRegulations}
                onCheckedChange={() => setReadRegulations(!readRegulations)}
                className="border-slate-400"
              />
              <div className="pl-2">
                I have read and agree to the customer service portal
                <Dialog open={showDialog}>
                  <DialogTrigger asChild onClick={() => setShowDialog(true)}>
                    <span className="underline text-blue-500 px-1 cursor-pointer">
                      {" "}
                      Terms and Conditions{" "}
                    </span>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[1000px]">
                    <DialogHeader showClose={false}>
                      <DialogTitle
                        className="p-1 flex justify-start"
                        style={
                          width < 640
                            ? {
                                fontSize: 25,
                                lineHeight: "30px",
                                textAlign: "left",
                              }
                            : { fontSize: 40, lineHeight: "51px" }
                        }
                      >
                        Terms & Conditions Governing The Use of Facilities at
                        Meeting Point
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <ScrollArea className="h-[70vh] w-full text-black p-4">
                        {dialogContentNode}
                        <Button
                          className="mr-0 ml-auto my-8 block"
                          type="submit"
                          onClick={() => {
                            setReadRegulations(true);
                            setShowDialog(false);
                          }}
                        >
                          Accept
                        </Button>
                      </ScrollArea>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>{" "}
                for and on behalf of the business, including the Cancellation
                Policy.
              </div>
            </div>
            <div className="flex gap-4 justify-end my-8">
              <Link href={"/facility/search/"}>
                <Button className="bg-transparent text-blue-500 border-blue-500 border-2 hover:bg-gray-100">
                  Cancel{" "}
                </Button>
              </Link>

              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400"
                disabled={!readRegulations}
                onClick={() => {
                  if (clientRef?.current) {
                    const publicUser: any = (clientRef.current as any)
                      ?.handleClickOnSubmit?.handleClickOnSubmit;
                    if (publicUser) publicUser?.click();
                    else handleProceedToBookClick();
                  } else {
                    handleProceedToBookClick();
                  }
                }}
              >
                Proceed to Book
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ListingClient;
