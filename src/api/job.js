import RequestApi  from '@/utils/request.js'

//查询工作列表
export const queryAllApi = ()=> RequestApi.get('/jobs');

//查询回显
export const queryByIdApi = (id)=> RequestApi.get(`/jobs/${id}`);

//修改工作
export const updateApi = (job)=> RequestApi.put('/jobs',job);

//删除工作
export const deleteApi = (id)=> RequestApi.delete(`/jobs/${id}`);

//添加工作
export const addApi = (job)=> RequestApi.post('/jobs',job);