 
export default async function getFacilitySearchSelection(

  ) {

    try{

      const response = await fetch(
        "https://ste-fem2-internet-app.azurewebsites.net/api/fb/Search",
        {
          method: "GET",
          headers: {
            accept: "text/plain",
          }
        }
      )
      return await response.json();


    } catch(error:any) {
        throw new Error(error);

    }

}
