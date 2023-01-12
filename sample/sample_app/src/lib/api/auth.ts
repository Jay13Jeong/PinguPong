import { userSignupData, ITutorInfoType } from '../../types/userSignupData';
import client from './client';

export const signup = (userSignupData: userSignupData) =>
  client.post('/auth/signup', userSignupData);
export const login = (body: { login_id: string; login_password: string }) =>
  client.post('/auth/login', body);
export const logout = () => client.get('/auth/logout');
export const isValidInfo = (body: string) =>
  client.get(`/auth/signup/user?${body}`);

export const refresh = () => client.get('/auth/refresh');
export const changeAccount = (to: string) => client.put(`/auth/changeaccount?to=${to}`);
export const tutorsignup = (tutorInfoType: ITutorInfoType) => client.post('/auth/tutorsignup', tutorInfoType);
export const loginCheck = () => client.get('/auth/logincheck');