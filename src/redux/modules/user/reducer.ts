import { produce } from "immer";
import { AnyAction } from "redux";
import { userType } from "../../types/user";
import { SET_USER_TOKEN, SET_USER_INFO, SET_LOGOUT, SET_SHOW_CHANGEPWD } from './constant';

const userState: userType = {
  token: '',
  userinfo: {},
  showChangePwd: false
};

const user = (preState: userType = userState, action: AnyAction) =>
  produce(preState, draftState => {
    switch (action.type) {
      case SET_USER_TOKEN:
        draftState.token = action.data;
        break;
      case SET_USER_INFO:
        draftState.userinfo = action.data;
        break;
      case SET_LOGOUT:
        if (action.data) {
          draftState.userinfo = {};
          draftState.token = '';
          sessionStorage.clear();
        }
        break;
      case SET_SHOW_CHANGEPWD:
        if (action.data) {
          draftState.showChangePwd = true;
        } else {
          draftState.showChangePwd = false;
        }
        break;
      default:
        return draftState;
    }
  });

export default user; 