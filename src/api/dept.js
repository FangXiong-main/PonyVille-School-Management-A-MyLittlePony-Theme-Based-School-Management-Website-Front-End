import RequestApi  from '@/utils/request.js'

//查询
export const requestApi = ()=> RequestApi.get('/depts');

//新增
export const addApi = (dept)=> RequestApi.post('/depts',dept);
//查询回显
export const queryByIdApi = (id)=> RequestApi.get(`/depts/${id}`); //使用字符串拼接

//修改
export const updateApi = (dept)=> RequestApi.put('/depts',dept);

//删除
export const deleteApi = (id)=> RequestApi.delete(`/depts?id=${id}`); //使用字符串拼接(依据接口文档ß)