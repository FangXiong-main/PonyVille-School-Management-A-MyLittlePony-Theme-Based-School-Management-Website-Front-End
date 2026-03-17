import RequestApi  from '@/utils/request.js';

//查询学科列表
export const queryAllApi = ()=> RequestApi.get('/subjects');

//修改学科
export const updateApi = (subject)=> RequestApi.put('/subjects',subject);

//删除学科
export const deleteApi = (id)=> RequestApi.delete(`/subjects/${id}`);

//添加学科
export const addApi = (subject)=> RequestApi.post('/subjects',subject);

//查询回显
export const queryByIdApi = (id)=> RequestApi.get(`/subjects/${id}`);