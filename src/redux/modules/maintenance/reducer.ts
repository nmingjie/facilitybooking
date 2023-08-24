import { produce } from "immer";
import { AnyAction } from "redux";
import { SET_MAINTENANCE_LIST,SET_MAINTENANCE_LOADING } from "./constant";

const maintenanceState = {
  list: [],
  loading: true
};

const maintenance = (preState = maintenanceState, action: AnyAction) =>
  produce(preState, state => {
    switch (action.type) {
      case SET_MAINTENANCE_LIST:
        return {
          ...state,
          list:action.data
        };
      case SET_MAINTENANCE_LOADING:
        console.log('loading',action.data)
        return {
          ...state,
          loading:action.data
        };
      default:
        return state;
    }
  });

export default maintenance;
