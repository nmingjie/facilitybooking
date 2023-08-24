import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/datepicker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FaRegClock } from "react-icons/fa6";

function FacilitySearch() {
  return (
    <div className="mx-auto md:w-3/4 rounded-xl shadow-lg flex flex-col bg-blue-500">
      <div className="p-6">
        <div className="text-4xl text-white font-semi mb-2">
          Search Our Facilities
        </div>
        <form className="flex flex-col md:flex-row gap-4">
          <Select>
            <SelectTrigger >
              <SelectValue placeholder="Facility Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Facility Type PlaceHolder 1</SelectItem>
              <SelectItem value="dark">Facility Type PlaceHolder 2</SelectItem>
              <SelectItem value="system">Facility Type PlaceHolder 3</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger >
              <SelectValue placeholder="Building Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Facility Type PlaceHolder 1</SelectItem>
              <SelectItem value="dark">Facility Type PlaceHolder 2</SelectItem>
              <SelectItem value="system">Facility Type PlaceHolder 3</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker placeholder="Date of Booking"></DatePicker>
          {/* Start Time */}
          <DatePicker  placeholder = "Start Time"></DatePicker>
          {/* End Time */}
          <DatePicker  placeholder = "End Time"></DatePicker>
          <Input type="number"></Input>

        </form>

        {/* <div className="text-md">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center space-x-2">
                <FaRegClock />
                <Label>
                  {" "}
                  FacilityType PlaceHolder - FacilityName Placeholder
                </Label>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-2">
                <FaRegClock />
                <Label> Facility Max Cap Placeholder</Label>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-2">
                <FaRegClock />
                <Label> Facility Status Placeholder</Label>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex justify-between pt-4">
          <div className="flex items-center space-x-2 text-blue-500">
            <FaRegClock />
            <Label> Location Placeholder</Label>
          </div>
          <Label>
            {" "}
            <div>$ (Price Placeholder)/Hour</div>
          </Label>
        </div> */}
      </div>
      <div className="px-6 pt-4 pb-2 self-center">
        <Button> Search</Button>
      </div>
    </div>
  );
}

export default FacilitySearch;
