"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type MessageDialogParam = {
  readonly open: boolean;
  readonly handlerConfirm: ((data?:any)=>void);
  readonly onOpenChange: ((open: boolean) => void);
  readonly title: string;
  readonly message: string | React.ReactNode;
  readonly type?: string;
};
export default function MessageDialog({ open = false, title, message, type, onOpenChange, handlerConfirm }: MessageDialogParam) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="bg-gray-800 text-white">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-xl py-6 px-10 my-">{message}</div>
        </DialogDescription>
        <DialogFooter className="bg-[#F0F0F0] py-4 px-10">
          <Button variant="ghost" className="p-4 text-base mr-4 cursor-pointer"
            onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant={type === 'delete' ? 'destructive' : 'default'} className="p-4 text-base cursor-pointer" onClick={(data?:any) => handlerConfirm(data)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
