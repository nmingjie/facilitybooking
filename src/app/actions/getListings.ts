export interface IListingsParams {
    userId?: string;
    facilityType?: string;
    buildingName?: string;
    bookingDate?: string;
    bookingTimeFrom?: string;
    bookingTimeTo?: string;
    capacity?: number;
     
    // guestCount?: number;
    // roomCount?: number;
    // startDate?: string;
    // endDate?: string;
    // locationValue?: string;
    // category?: string;
  }
  
export default async function getListing(
    params: IListingsParams
  ) {

    try{
        const {
        userId,
        facilityType,
        buildingName,
        bookingDate,
        bookingTimeFrom,
        bookingTimeTo,
        capacity,
      } = params;

      let query: any = {};

      if (userId) {
        query.userId = userId;
      }
  
      if (facilityType) {
        query.facilityType = facilityType;
      }

      if (buildingName) {
        query.buildingName = buildingName;
      }

      if (bookingDate) {
        query.bookingDate = bookingDate;
      }

      if (bookingTimeFrom) {
        query.bookingTimeFrom = bookingTimeFrom;
      }

      if (bookingTimeTo) {
        query.bookingTimeTo = bookingTimeTo;
      }
  

      if (capacity) {
        query.capacity = capacity;
        // query.capacity = {
        //   gte: +capacity
        // }
      }

      const response = await fetch(
        "https://ste-fem2-internet-app.azurewebsites.net/api/fb/Search",
        {
          method: "POST",
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
          },
          body : JSON.stringify(query)

        }
      )


      return await response.json();


    } catch(error:any) {
        throw new Error(error);

    }

}
