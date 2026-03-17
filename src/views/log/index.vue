<script setup>
import {exportToExcel} from '@/utils/exportToExcel.js';
import {getCurrentTime} from '@/utils/getCurrentTime.js';
import { ref,reactive,onMounted,watch } from 'vue';
import {ElMessage} from 'element-plus';
import {queryLogApi} from '@/api/log.js';
const logParam = ref({page:1,pageSize:5});
const tableData = ref({total:null,rows:[]});
const loading = ref(false);
const buttonLoading = ref(false);
const handleSizeChange = (val)=>{
  logParam.value.pageSize = val;
  search();
}
const handleCurrentChange = (val)=>{
  logParam.value.page = val;
  search();
}
//查询结果已返回
// const getEmpName = (id)=>{
//   if(empList == null) return;
//   const emp = empList.value.find(item => item.id == id); //可以直接调用find方法
//   return emp.name;
//   // return empList.value.forEach(emp => {
//   //   if(emp.id == id){
//   //     return emp.name;
//   //   }
//   // });
// }
const search = async ()=>{
  loading.value = true;
  const result = await queryLogApi(logParam.value.page,logParam.value.pageSize);
  if(result.code){
    tableData.value = result.data;
    loading.value = false;
  }else{
    ElMessage.error(result.msg);
  }
}
const toExcel = ()=>{
  buttonLoading.value = true;
  exportToExcel(`日志记录数据_导出_${getCurrentTime()}`,tableData.value.rows);
  buttonLoading.value = false;
}
onMounted(() => {
  search();
})
</script>

<template>
  <div class="container">
    <h1>日志信息统计</h1>
  </div>
  <div class="container" v-loading="loading" element-loading-text="加载中...">
    <div class="container">
    <el-button type="success" :loading="buttonLoading" @click="toExcel">> 导出本页数据为Excel</el-button>
    </div>
    <div class="container">
    <el-table :data="tableData.rows" border style="width: 100%">
    <el-table-column type="index" label="序号" width="60" align="center"/>
    <el-table-column prop="operateEmpName" label="操作人" width="80" align="center"/>
    <el-table-column prop="className" label="操作类名" width="310" align="center"/>
    <el-table-column prop="methodName" label="方法名" width="80" align="center"/>
    <el-table-column prop="methodParams" label="方法参数" width="600" align="center"/>
    <el-table-column prop="returnValue" label="返回值" width="320" align="center"/>
    <el-table-column prop="costTime" label="处理耗时(ms)" align="center"/>
  </el-table>
  </div>
  <div class="container">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="logParam.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="logParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style scoped>
.container{
  margin: 20px 0;
}
</style>