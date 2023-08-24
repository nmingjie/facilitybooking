import CarouselLowerRight from "@/components/CarouselLowerRight";
import {useState, useEffect, useCallback} from "react";
import {RichTextEditor} from "@/components/RichTextEditor";
import { format } from "date-fns";
type MessageSlideBannerProps = {
    announcementsInfo:object;
    bookingsInfo:Array<object>;
}
export default function MessageSlideBanner({announcementsInfo,bookingsInfo}:MessageSlideBannerProps){
    const [message,setMessage] = useState([]);
    
    const init = useCallback(() => {
        let info:any = [];
        // Add a title when sorting Scheduled Maintenance data
        if (Object.keys(announcementsInfo).length) {
            let obj:any = announcementsInfo;
            obj.messageType = "Scheduled Maintenance";
            info.push(obj);
        }
        if (bookingsInfo) {
            let data = bookingsInfo;
            let length = data.length;
            // booking organizes three pieces of data per slide and organizes the title information
            for(let i=0; i < length;i=i+3){
                let obj:any = {
                    messageType:"Bookings",
                    data:[]
                };
                let dateArray:any = [];
                data.slice(i,i+3).forEach((item:any) => {
                    let eventInfo:any = {};
                    if (!dateArray.includes(item.bookingDate.split("T")[0]))
                    {
                        dateArray.push(dateArray.includes(item.bookingDate.split("T")[0]));
                    }
                    eventInfo.timeRange = format(new Date(item.bookingTimeFrom), "haaa") + ' - ' + format(new Date(item.bookingTimeTo), "haaa, dd MMM yyyy");
                    eventInfo.roomInfo = item.facilityName + ', '+ item.buildingName;
                    obj.data.push(eventInfo);
                });
                obj.title = `You have 3 upcoming events in next ${dateArray.length} days.`;
                info.push(obj);
            }
            
        }
        setMessage(info);
    },[announcementsInfo,bookingsInfo])
    
    useEffect(() => {
        init();
    }, [init]);
    return(
        <div className="mr-4 rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" style={{background:"linear-gradient(180deg, rgba(0, 108, 235, 0.10) 0%, rgba(255, 255, 255, 0.25) 100%)"}}>
            {message.length > 0&&(
                <CarouselLowerRight sliderClass="w-full ml-0">
                {message.map(
                    (item: any,index: number) => (
                        <div
                            className="flex ml-0 flex-shrink-0 relative h-full"
                            key={index}
                        >
                            {item.messageType == "Scheduled Maintenance"&&(
                                <div className="p-2">
                                    <div className="mb-2.5 text-black text-xl font-medium">{item.messageType}</div>
                                    <div className="block sm:hidden">
                                        <RichTextEditor
                                            theme="bubble"
                                            value={item.subject}
                                            readOnly
                                            placeholder=""
                                            />
                                    </div>
                                    <div className="hidden sm:block">
                                        <RichTextEditor
                                            theme="bubble"
                                            value={item.content}
                                            readOnly
                                            placeholder=""
                                            />
                                    </div>
                                </div>
                            )}
                            {item.messageType == "Bookings"&&(
                                <div className="p-2">
                                    <div className="mb-2.5 text-black text-xl font-medium">{item.title}</div>
                                    {item.data&&item.data.map((event:any, index:number) => (
                                        <div key={index} className="flex text-lg text-[#666] border-solid border-b border-[#DDD]">
                                            <div className="px-2 space-y-2 min-w-[30%] max-w-[30%] md:max-w-max">{event.timeRange}</div>
                                            <span className="h-auto mt-1 mb-1 border-solid border-r border-[#DDD]"></span>
                                            <div className="px-2 space-y-2">{event.roomInfo}</div>
                                        </div>
                                    ))
                                    }
                                </div>
                            )}
                        </div>
                    )
                )}
            </CarouselLowerRight>
            )
            }
            
        </div>)
}