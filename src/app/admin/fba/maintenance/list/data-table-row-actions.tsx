"use client";

import { FaEllipsis } from "react-icons/fa6";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MessageDialog from "../components/MessageDialog";
import { deleteAnnoucementApi, getAnnoucementsApi } from "@/api/modules/annoucement";
import { store } from "@/redux";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  let [isLoading,setIsLoading] = useState(store.getState().maintenance.loading);
  const setLoading = (bool: boolean) => {
    console.log('bool',bool)
    store.dispatch({
      type: "SET_MAINTENANCE_LOADING",
      data: bool,
    });
  }
  store.subscribe(() => {
    setIsLoading(store.getState().maintenance.loading);
  });
  const gotoUrl = (data: any, urlParams: string) => {
    const url = qs.stringifyUrl(
      {
        url: urlParams,
        query: { maintenanceId: data.code },
      },
      { skipNull: true }
    );
    router.push(url);
  }
  const isDisabled = (data: any) => {
    if (data && data.maintenanceEndTime) {
      const maintenanceEndTime = new Date(data.maintenanceEndTime).getTime();
      if (maintenanceEndTime < new Date().getTime()) return true;
      if (data.status && data.status.toLowerCase() === "completed") return true;
    }
    return false;
  }
  const handlerConfirm = (data: any) => {
    console.log('handlerConfirm', data)
    setIsOpen(false)
    deleteMaintenance(data.code)
  };
  const onOpenChange = (bool: boolean, params?: object | undefined) => {
    setIsOpen(bool);
  };
  const deleteMaintenance = async (maintenanceId: string) => {
    setLoading(true);
    try {
      const { data } = await deleteAnnoucementApi(maintenanceId);
      console.log("data", data)
      if (data.isSuccess) {
        console.log("success")
        getAnnoucements()
      } else {
        console.log("error")
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error)
    }
  }
  const getAnnoucements = async () => {
    setLoading(true);
    try {
      const { data } = await getAnnoucementsApi();
      console.log('Maintenance List ===', data.data)
      if (data.isSuccess) {
        store.dispatch({
          type: "SET_MAINTENANCE_LIST",
          data: data.data,
        });
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      throw new Error(e);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <FaEllipsis className="h-4 w-4 text-blue-600" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => gotoUrl(row.original, "/admin/fba/maintenance/details")}>View</DropdownMenuItem>
          <DropdownMenuItem disabled={isDisabled(row.original)} onClick={() => gotoUrl(row.original, "/admin/fba/maintenance/update")}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={() => setIsOpen(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MessageDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        handlerConfirm={() => handlerConfirm(row.original)}
        title="Confirm Delete"
        message={<div>
          Are you sure to delete this maintenance record?
        </div>}
        type="delete"
      ></MessageDialog>
    </>
  );
}
