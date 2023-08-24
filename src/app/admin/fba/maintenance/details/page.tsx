"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Metadata } from "next";
import qs from "query-string";
import { CiEdit } from "react-icons/ci";
import { MdArrowBackIosNew } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { getAnnoucementByCodeApi } from "@/api/modules/annoucement";
import { RichTextEditor } from "../components/RichTextEditor"
import { maintenanceConfig } from "./dataConfig"
const metadata: Metadata = {
  title: "Maintenance | JTC",
  description: "Maintenance | JTC",
};
interface FormParamsSchema {
  maintenanceStartDate?: Date,
  maintenanceStartTime?: Date,
  maintenanceEndDate?: Date,
  maintenanceEndTime?: Date,
  startTime?: Date,
  endTime?: Date,
  code?: string,
  status?: string | undefined,
  type?: string,
  subject: string,
  content: string,
  isDisabled?: boolean
};
export default function Page() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);

  // Get url params
  const params = useSearchParams();
  let searchParams: any = params ? qs.parse(params.toString()) : {};

  const [maintenance, setMaintenance] = useState<any>({ content: "", subject: "" });
  const getMaintenanceInfo = async () => {
    setLoading(true);
    if (searchParams && searchParams.maintenanceId) {
      try {
        const { data } = await getAnnoucementByCodeApi(searchParams.maintenanceId)
        console.log('data', data)
        if (data.isSuccess) {
          if (data.data) {
            setLoading(false);
            setMaintenance(data.data)
          }
        }
      } catch (error) {
        console.log("error", error)
      }
    }
    setLoading(false);
  };
  const gotoUrl = (urlParams: string, maintenanceId?: string) => {
    let url = urlParams;
    if (maintenanceId) {
      url = qs.stringifyUrl(
        {
          url: urlParams,
          query: { maintenanceId },
        },
        { skipNull: true }
      );
    }
    router.push(url);
  }
  useEffect(() => {
    getMaintenanceInfo();
  }, [])

  return (
    <>
      <style>
        {
          `
        .ql-editor{
          padding:0px;
        }
        `
        }
      </style>
      <div className="container px-0 font-display">
        <div className="py-4 ml-4 text-4xl font-medium md:text-7xl lg:ml-32">
          System Maintenance
        </div>
        <div className="mx-4 pb-10">
          {isLoading && <Loader />}
          {!isLoading && (
            <>
              <div className="w-full flex py-4 justify-between">
                <Button variant="link" className="w-25" onClick={() => router.back()}>
                  <MdArrowBackIosNew className="text-blue-500 w-5 h-5 mr-2" />
                  <span> Back</span>
                </Button>
                <Button variant="link" className="w-25" onClick={() => gotoUrl("/admin/fba/maintenance/update", maintenance.code)}>
                  <CiEdit className="text-blue-500 w-5 h-5 mr-2" />
                  <span> Edit</span>
                </Button>
              </div>
              <div className="text-2xl font-bold mb-2">
                Maintenance Details
              </div>
              {
                maintenanceConfig.map((item) =>
                (<div className="mb-4" key={item.displayName + item.columnName}>
                  <div className="text-xl text-neutral-500 mb-2">{item.displayName}</div>
                  {item.isRichTextEditor ? (
                    <RichTextEditor
                      theme="bubble"
                      className="border-b-2 border-solid border-gray-200 text-xl"
                      value={maintenance[item.columnName]}
                      readOnly
                      placeholder=""
                    />
                  ) : ((item.formatter) ? (
                    <div className="text-xl">{item.formatter(maintenance[item.columnName])}</div>
                  ) : (
                    <div className="text-xl">{maintenance[item.columnName] || ""}</div>
                  ))}
                </div>)
                )
              }
            </>
          )}
        </div>
      </div>
    </>
  );
}
