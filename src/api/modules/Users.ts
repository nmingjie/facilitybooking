import request from '../request';

interface userInfoType {
  email: string;
  password: string;
}

export const login = (query: userInfoType) => {
  const url = `/api/users/login`;
  return  request.post(url, query);
};

export const loginOut = () => {
  const url = `/api/users/logout`;
  return  request.post(url);
};

export const guestLogin = () => {
  const url = '/api/users/guest_login';
  return request.post(url);
}

export const extendSession = () => {
  const url = '/api/users/extendSession';
  return request.post(url);
}

export const expireSession = () => {
  const url = '/api/users/expireSession';
  return request.post(url);
}

/**
 * @param username 
 * @param parmas email
 */
export const forgotpassword = (username: string, parmas: any) => {
  const url = `/api/users/${username}/forgotpassword`;
  return request.post(url, parmas);
}

/**
 * @param username 
 * @param parmas {token, userName, newPassword, confirmPassword}
 */
export const resetpassword = (username: string, parmas: any) => {
  const url = `/api/users/${username}/resetpassword`;
  return request.post(url, parmas);
}

/**
 * @param username 
 * @param parmas {userName, currentPassword, newPassword, confirmPassword}
 */
export const changepassword = (username: string, parmas: any) => {
  const url = `/api/users/${username}/changepassword`;
  return request.post(url, parmas);
}