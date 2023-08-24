import { produce } from "immer";
import { AnyAction } from "redux";
import { SET_BOOKING_INFO, DELETE_BOOKING_INFO } from "./constant";

const userState = {};

const booking = (preState = userState, action: AnyAction) =>
  produce(preState, (state) => {
    switch (action.type) {
      case SET_BOOKING_INFO:
        return {
          ...state,
          [action.data.facilityID]: action.data,
        };

      case DELETE_BOOKING_INFO:
        return {
          ...state,
          [action.data.facilityID]: null,
        };
      default:
        return state;
    }
  });

export default booking;
