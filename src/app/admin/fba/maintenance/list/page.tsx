"use client";
import { Metadata } from "next";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
import { getAnnoucementsApi } from "@/api/modules/annoucement";
import { columns } from "./columns";
import Loader from "@/components/Loader";
import { store } from "@/redux";
const metadata: Metadata = {
  title: "Maintenance | JTC",
  description: "Maintenance | JTC",
};

export default function Page() {
  let [maintenanceList,setMaintenanceList] = useState(store.getState().maintenance.list);
  let [isLoading,setIsLoading] = useState(store.getState().maintenance.loading);
  const setLoadingStore = (bool:boolean)=>{
    store.dispatch({
      type: "SET_MAINTENANCE_LOADING",
      data: bool,
    });
  }
  store.subscribe(() => {
    setMaintenanceList(store.getState().maintenance.list);
    setIsLoading(store.getState().maintenance.loading);
  });
  const init = async () => {
    setLoadingStore(true)
    try {
      const { data } = await getAnnoucementsApi();
      if (data.isSuccess) {
        store.dispatch({
          type: "SET_MAINTENANCE_LIST",
          data: data.data,
        });
      }
      setLoadingStore(false)
    } catch (e: any) {
      setLoadingStore(false)
      throw new Error(e);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="container px-0 font-display">
      <div className="py-4 ml-4 text-4xl font-medium md:text-7xl lg:ml-32">
        System Maintenance
      </div>
      <div>
        {isLoading && <Loader />}
        {!isLoading && (<DataTable columns={columns} data={maintenanceList} />)}
      </div>
    </div>
  );
}
