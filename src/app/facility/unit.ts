export type ListingParam = {
  facilityID: string;
  facilityName: string;
  facilityType: string;
  capacity: number;
  hourlyRentWeekday: number;
  building: any;
  images: string[];
  buildingID: string;
  basicAmenities: any;
  chargeableAmenities: AmenityParam[];
};

export type AmenityParam = {
  amenityId: null | string;
  amenityName: string;
  imagePath: null | string;
};

export type BookingDetailsParam = {
  facilityDetails: FacilityDetailsParam;
  bookingDetails: BookingParam;
  applicantDetails: ApplicantDetailsParam;
};

export interface IParams {
  facilityId?: string;
}

type FacilityDetailsParam = {
  building: BuildingParam;
  facilityType: string;
  facilityName: string;
  images: Array<any>;
  capacity: number;
  basicAmenities: Array<AmenityParam>;
};

type BuildingParam = {
  buildingName: string;
  buildingAddress: string;
};

type BookingParam = {
  brid: string;
  bookingDate: string;
  bookingTimeFrom: string;
  bookingTimeTo: string;
  totalAmount: number;
  unitRate: number;
  duration: number;
  discountedAmount: number;
  amount: number;
  gst: number;
};

type ApplicantDetailsParam = {
  userName?: string;
  designation?: number;
  companyName?: string;
  email: string;
  mobilePhone: string;
};
