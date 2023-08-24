import { SET_USER_TOKEN, SET_USER_INFO, SET_LOGOUT, SET_SHOW_CHANGEPWD } from './constant';

export const setUserToken = (data: string) => ({ type: SET_USER_TOKEN, data });
export const setUserInfo = (data: {}) => ({ type: SET_USER_INFO, data });
export const setLogout = (data: boolean) => ({type: SET_LOGOUT, data});
export const setShowChangePwd = (data: boolean) => ({type: SET_SHOW_CHANGEPWD, data});