import { IParams } from "@/app/facility/unit";

export default async function getListingById(params: IParams) {
  try {
    const { facilityId } = params;

    const response = await fetch(
      `https://ste-fem2-internet-app.azurewebsites.net/api/facilities/${facilityId}`,
      {
        method: "GET",
        headers: {
          accept: "text/plain",
        },
      }
    );
    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
}
