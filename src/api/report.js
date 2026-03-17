import RequestApi  from '@/utils/request.js';

//查询员工数量数据
export const queryJobCountApi = ()=> RequestApi.get('/report/empJobData');

//查询员工性别数量
export const queryGenderCountApi = ()=> RequestApi.get('/report/empGenderData');

//各学历学生数据
export const queryDegreeCountApi = ()=> RequestApi.get('/report/studentDegreeData');

//各班级人数数据
export const queryClazzCountApi = ()=> RequestApi.get('/report/studentCountData');