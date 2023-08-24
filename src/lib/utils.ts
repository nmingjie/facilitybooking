import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

declare global{
  interface Navigator{
    msSaveBlob:(blob: Blob,fileName:string) => boolean
  }
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * download file
 * @param stream - file stream
 * @param fileName - file name
 * @param suffix - file type(.pdf | .csv | .xlsx | ...)
 */
export function DownloadFile(stream:any, fileName: string = format(new Date(),"yyyy-MM-dd"), suffix:string)
{
  let blob = new Blob([stream], { type: "text/plain;charset=utf-8;" });
  if ('download' in document.createElement('a'))
  {
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', `${fileName}${suffix}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  else
  {
    if (navigator.msSaveBlob)
      navigator.msSaveBlob(blob, `${fileName}${suffix}`);
  }
}

export function getGuid (){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
