<script setup>
import {exportToExcel} from '@/utils/exportToExcel.js';
import {getCurrentTime} from '@/utils/getCurrentTime.js';
import { requestApi,addApi,queryByIdApi,updateApi,deleteApi } from '@/api/dept.js';
import { ref,onMounted } from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus'; // 引入Element Plus的Message组件
//这里采用响应式数据,调用ref()方法
const deptData = ref([]);
const ruleFormRef=ref(); // 获取表单实例
const TitleName=ref('');
const dept = ref({name:''});
const loading = ref(false);
const dialogFormVisible = ref(false); // 控制弹窗的显示与隐藏
const search = async () => {
  //原始方法
  // const result = await axios.get("http://127.0.0.1:4523/m1/6432332-6129787-default/depts");
  // if(result.data.code){
  //   deptData.value = result.data.data; //封装数据
  // }

  //优化后方法
  loading.value = true;
  const result = await requestApi();
  if(result.data){
    deptData.value = result.data;
  }
  loading.value = false;
}

//制定表单校验规则
const rules = ref({
  name: [
    { required: true, message: '部门名称不能为空!', trigger: 'blur' }, //输入框为空是的规则
    { min: 2, max: 10, message: '部门名称长度在2-10个字符之间', trigger: 'blur' },
  ]
})

const AddDept = () => { 
  TitleName.value = '添加部门';
  dialogFormVisible.value = true;
}

const cancel = () => { 
  dialogFormVisible.value = false;
  dept.value = {name:''};
  resetForm();
}
const save= async () => {
  if (!ruleFormRef.value) return; //未获取到表单时直接return
  ruleFormRef.value.validate( async (valid) => { //调用表单对象的验证方法validate
    if (valid) { //验证成功
      let result;
      if(dept.value.id){
        result = await updateApi(dept.value);
      }else{
        result = await addApi(dept.value);
      }
      if(result.code){
      ElMessage.success('操作成功!'); //提示信息，使用Message的气泡提示
      dialogFormVisible.value = false;
      search();
      dept.value = {name:''}; //重置表单
  }else{
    ElMessage.error(result.msg);
  }
    } else { //验证失败
      ElMessage.error('表单校验失败，请检查填写是否有误!');
    }
  })
}

const updateDept = async (id) => {
  TitleName.value = '修改部门';
  const result = await queryByIdApi(id);
  if(result.code){
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
}
//清除表单校验
const resetForm = () => {
  dept.value = {name:''};
  if (ruleFormRef.value){
    ruleFormRef.value.resetFields();//清除表单校验
  }
}

onMounted(() => {
  search();
})

// 删除确认逻辑
const open = (id) => {
  ElMessageBox.confirm(
    '此操作将永久删除该数据, 是否继续?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then( async () => { //确定
      const result =await deleteApi(id);
      if(result.code){
        ElMessage.success('删除成功!');
        search();
      }
    })
    .catch(() => { //取消
      ElMessage.info('操作取消');
    })
}
const buttonLoading = ref(false);
const toExcel = ()=>{
  buttonLoading.value = true;
  exportToExcel(`部门数据_导出_原始数据_${getCurrentTime()}`,deptData.value);
  buttonLoading.value = false;
}
</script>

<template>
  

  <div class="container">
    <h1>部门管理</h1>
  </div>
  <div class="container" v-loading="loading" element-loading-text="加载中...">
    <div class="container">
      <el-button type="primary" @click="AddDept">+ 新增部门</el-button>
      <el-button type="success" @click="toExcel" :loading="buttonLoading">> 导出本页数据为Excel</el-button>
    </div>
    <div class="container">
      <el-table :data="deptData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="180" align="center"/>
      <el-table-column prop="name" label="部门名称" width="180" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <!-- "scope" 是一个对象，它包含了当前行的数据和索引等信息 row	-Object-	当前行的数据对象-->
          <el-button type="primary" size="small" @click="updateDept(scope.row.id)"><el-icon><Edit /></el-icon> 编辑</el-button>
          <el-button type="danger" size="small" @click="open(scope.row.id)"><el-icon><Delete /></el-icon> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 新增部门弹窗 -->
    <el-dialog v-model="dialogFormVisible" width="500" @close="cancel">
      <!-- 使用插槽自定义标题#header -->
      <template #header> 
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <el-icon><CollectionTag style="color: #409EFF;"/></el-icon>
        <span style="margin-left: 8px;color: #409EFF;font-size: large;">{{TitleName}}</span>
      </div>
      </template>
      <!-- ref="ruleFormRef"是表示绑定表单 :rules="rules"进行规则绑定 props="name" 表单属性(对应规则)绑定  -->
      <el-form :model="dept" ref="ruleFormRef" :rules="rules"> 
        <el-form-item label="部门名称：" label-width="100px" prop="name">
          <el-input v-model="dept.name"  placeholder="请输入部门名称(2-10)"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  margin: 20px 0px;
}
</style>
