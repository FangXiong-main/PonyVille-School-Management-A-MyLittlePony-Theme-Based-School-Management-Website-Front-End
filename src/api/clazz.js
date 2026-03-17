import RequestApi  from '@/utils/request.js';

//查询
export const requestApi = (queryParam)=> RequestApi.get(`/clazzs?name=${queryParam.user}&begin=${queryParam.begin}&end=${queryParam.end}&page=${queryParam.page}&pageSize=${queryParam.pageSize}`);

//查询所有班级
export const queryAllApi = ()=> RequestApi.get('/clazzs/list');

//查询ById
export const queryByIdApi = (id)=> RequestApi.get(`/clazzs/${id}`);

//添加
export const addApi = (clazz)=> RequestApi.post('/clazzs',clazz);

//修改
export const updateApi = (clazz)=> RequestApi.put('/clazzs',clazz);

//删除
export const deleteApi = (id)=> RequestApi.delete(`/clazzs/${id}`);