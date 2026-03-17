import RequestApi  from '@/utils/request.js';

//登录
export const loginApi = (loginForm)=> RequestApi.post('/login',loginForm);