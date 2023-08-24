

export default async function getBuildingsByFacilityTypes(
) {
  try {

    const response = await fetch(
        `https://ste-fem2-internet-app.azurewebsites.net/api/Building/groupByFacilityTypes`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },

        }
      )

      return await response.json();

  } catch (error: any) {

    throw new Error(error);
  }
}
