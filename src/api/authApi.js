import { api, cookieApi } from '@/api/axiosInstance';

//회원가입
export const userSignUp = async (signUpData) => {
  const url = '/auth/sign-up';
  const response = await api.post(url, signUpData);
  return response;
};

//회원탈퇴
export const userDelete = async () => {
  const url = '/auth/withdrawal';
  const response = await cookieApi.delete(url);
  return response;
};

//로그인
export const userSignIn = async (signInData) => {
  const url = '/auth/sign-in';
  const response = await cookieApi.post(url, signInData);
  return response;
};

//로그아웃
export const userSignOut = async (signInData) => {
  const url = '/auth/sign-out';
  const response = await cookieApi.post(url, signInData);
  return response;
};

//회원가입 -> 이메일 인증
export const userSignUpEmail = async (email) => {
  const url = '/auth/sign-up/email';
  const response = await api.post(url, email);
  return response;
};

//회원가입 -> 이메일 인증 확인
export const userSignUpEmailVerify = async (token) => {
  const url = '/auth/sign-up/email-verification';
  const response = await api.post(url, token);
  return response;
};

//회원가입 -> 휴대폰 인증번호 발급
export const sendPhoneNumber = async (phoneNumber) => {
  const url = '/auth/phone';
  const response = await api.post(url, phoneNumber);
  return response;
};

//회원가입 -> 휴대폰 인증번호 발급 확인
export const sendPhoneNumberVerify = async (phoneNumberData) => {
  const url = '/auth/phone-verification';
  const response = await api.post(url, phoneNumberData);
  return response;
};

//이메일 찾기
export const findEmail = async (emailFindData) => {
  const url = '/auth/email';
  const response = await api.post(url, emailFindData);
  return response;
};

//비밀번호 찾기
export const findPassWord = async (pwFindData) => {
  const url = '/auth/password';
  const response = await api.post(url, pwFindData);
  return response;
};

//사용자 상태 확인
export const userStatusVerify = async (pwFindData) => {
  const url = '/auth/status';
  const response = await api.get(url, pwFindData);
  return response;
};

//인증서 업로드 하기 위해 필요한 URL 받기
export const getPresigneUrl = async (params) => {
  const url = '/certificates/upload-info?';
  const response = await api.get(url, params);
  return response;
};

//받아온 URL에 IMAGE url 보내기
export const certificatesImageUpload = async (presigneUrl, imageData) => {
  const url = presigneUrl;
  const response = await api.get(url, imageData);
  return response;
};