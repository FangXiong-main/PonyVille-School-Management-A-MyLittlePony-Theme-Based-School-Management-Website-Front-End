import RequestApi  from '@/utils/request.js';

//查询
export const queryAllApi = (stu)=> RequestApi.get(`/students?name=${stu.name}&degree=${stu.degree}&clazzId=${stu.clazzId}&page=${stu.page}&pageSize=${stu.pageSize}`);

//添加
export const addApi = (stu)=> RequestApi.post('/students',stu);

//删除
export const delApi = (ids)=> RequestApi.delete(`/students/${ids}`);

//修改
export const updateApi = (stu)=> RequestApi.put('/students',stu);

//查询回显
export const queryByIdApi = (id)=> RequestApi.get(`/students/${id}`);

//违纪处理
export const violationApi = (stu)=> RequestApi.put(`/students/violation/${stu.id}/${stu.score}`);