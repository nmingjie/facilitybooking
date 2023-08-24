import { produce } from "immer";
import { AnyAction } from "redux";
import { SET_CURRENT_WIDTH } from './constant';

const userState = {
  currentSize:0
};

const global = (preState = userState, action: AnyAction) =>
  produce(preState, state => {
    switch (action.type) {
      case SET_CURRENT_WIDTH:
        return{
            ...state,
            currentSize:action.data
        }
      default:
        return state;
    }
  });

export default global; 