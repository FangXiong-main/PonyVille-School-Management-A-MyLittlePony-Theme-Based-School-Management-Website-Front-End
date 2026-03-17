import axios from 'axios';
import { ElMessage } from 'element-plus'; 
import router from '@/router/index.js'; //在js中，不能直接引入useRouter(只能在vue组件中直接引入），其他需要引入router
//创建axios实例对象
const request = axios.create({
  baseURL: '/api', //此处添加baseURL，优化相同前缀的请求，使得后期维护更加简单
  timeout: 600000
})
//axios的请求 request 拦截器--获取在本地储存的用户数据，将其中的token数据添加到请求头中并带到服务器中去(只有由request发送的请求才会被拦截)
request.interceptors.request.use(
  (config)=>{ //成功回调
    const LoginUser = JSON.parse(localStorage.getItem('LoginUser'));
    if(LoginUser && LoginUser.token){
      config.headers.token = LoginUser.token;
      config.headers.id = LoginUser.id;
    }
    return config;
  },
  (error)=>{ //失败回调
    return Promise.reject(error);
  }
)

//axios的响应 response 拦截器
//这里的拦截器用于重新定义返回的类型，优化响应数据，可直接使用result.data获取数据
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    if(error.response.status == 401){
      ElMessage.error("登录已过期，请重新登录");
      //跳转到登录页面
      router.push('/login');
    }else{
      ElMessage.error('未知接口错误');
    }
    return Promise.reject(error);
  }
)

export default request

//添加export的作用是让其他文件可以引用该文件，将其暴露出去