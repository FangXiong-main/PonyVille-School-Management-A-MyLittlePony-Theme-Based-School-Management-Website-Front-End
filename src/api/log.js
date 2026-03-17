import RequestApi  from '@/utils/request.js';

//查询日志数据  
export const queryLogApi = (page,pageSize)=> RequestApi.get(`/log/page?page=${page}&pageSize=${pageSize}`);