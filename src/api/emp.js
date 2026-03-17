//import模块不用加大括号，导入方法时需要大括号{}
import RequestApi  from '@/utils/request.js';

//查询员工列表
export const queryAllApi = ()=> RequestApi.get('/emps/list');

//查询回显
export const queryByIdApi = (id)=> RequestApi.get(`/emps/${id}`);

//查询员工

export const queryEmpApi = (emp)=> RequestApi.get(`/emps?name=${emp.name}&gender=${emp.gender}&begin=${emp.begin}&end=${emp.end}&page=${emp.page}&pageSize=${emp.pageSize}`);

//添加员工

export const addApi = (emp)=> RequestApi.post('/emps',emp);

//修改员工
export const updateApi = (emp)=> RequestApi.put('/emps',emp);

//删除员工

export const deleteApi = (id)=> RequestApi.delete(`/emps?ids=${id}`);