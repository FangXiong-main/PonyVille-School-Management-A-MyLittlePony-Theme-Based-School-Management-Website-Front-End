<script setup>
import {exportToExcel} from '@/utils/exportToExcel.js';
import {getCurrentTime} from '@/utils/getCurrentTime.js';
import {queryAllApi,queryByIdApi,updateApi,deleteApi,addApi} from '@/api/job.js'
import { ref,onMounted } from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus';

onMounted(() => {
  search();
})
const ruleFormRef = ref();
const rules = {
    name: [
        { required: true, message: '请输入职位名称！', trigger: 'blur' },
        { min: 3, max: 20, message: '字符长度应为3-20个', trigger: 'blur' }
    ]
};
const loading = ref(false);
const tableData = ref([]);
const job  = ref({id:null,name:''});

const resetFrom =()=>{
    if(ruleFormRef.value){
        ruleFormRef.value.resetFields();
    }
    job.value = {id:null,name:''};
}
const search = async ()=>{
    loading.value = true;
    const result = await queryAllApi();
    if(result.data){
        tableData.value = result.data;
    }else{
        ElMessage.error(result.message);
    }
    loading.value = false;
}
const addJob =()=>{
    TitleName.value = '添加职位';
    dialogFormVisible.value = true;
}
const dialogFormVisible  = ref(false);
const TitleName = ref('');

const onCancel =()=>{
    resetFrom();
    dialogFormVisible.value = false;
}

const updateJob = async (id)=>{ 
    const result = await queryByIdApi(id);
    if(result.code){
        job.value = result.data;
        TitleName.value = '修改职位';
        dialogFormVisible.value = true;
    }else{
        ElMessage.error(result.message);
    }
}

const open = (id) => {
    ElMessageBox.confirm(
    '此操作将会永久删除该数据，是否继续？',
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
const deleteJob =(id)=>{
    open(id);
}

const onSave =()=>{
    if(!ruleFormRef.value) return; 
    let result;
    ruleFormRef.value.validate( async ()=>{
        if(job.value.id!==null){
            result = await updateApi(job.value);
        }else{
            result = await addApi(job.value);
        }
        if(result.code){
            ElMessage.success(`${TitleName.value}成功!`); //提示信息，使用Message的气泡提示
            dialogFormVisible.value = false;
            search();
            resetFrom();
        }else{
            ElMessage.error(result.message);
        }
    })
}
const buttonLoading = ref(false);
const toExcel = ()=>{ 
    buttonLoading.value = true;
    exportToExcel(`职位数据_导出_原始数据_${getCurrentTime()}`,tableData.value);
    buttonLoading.value = false;
}
</script>

<template>
    <div class="container">
        <h1>职位管理</h1>
    </div>
    <div class="container" v-loading="loading" element-loading-text="加载中...">
        <div class="container">
        <el-button type="primary" @click="addJob">+ 添加职位</el-button>
        <el-button type="success" @click="toExcel">> 导出本页数据为Excel</el-button>
        </div>
        <div class="container">
            <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="180" align="center"/>
            <el-table-column prop="name" label="职位" width="500" align="center"/>
            <el-table-column label="操作" align="center" >
                <template #default="scope">
                    <el-button type="primary" size="small" @click="updateJob(scope.row.id)"><el-icon><Edit /></el-icon> 编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteJob(scope.row.id)"><el-icon><Delete /></el-icon> 删除</el-button>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <!-- 添加工作弹窗 -->
        <el-dialog v-model="dialogFormVisible" width="500" @close="resetFrom">
        <!-- 使用插槽自定义标题#header -->
        <template #header> 
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <el-icon><CollectionTag style="color: #409EFF;"/></el-icon>
        <span style="margin-left: 8px;color: #409EFF;font-size: large;">{{TitleName}}</span>
        </div>
        </template>
        <!-- ref="ruleFormRef"是表示绑定表单 :rules="rules"进行规则绑定 props="name" 表单属性(对应规则)绑定  -->
         <!-- 注意事项： :model绑定对象，不要绑定对象的属性，否则校验会一直报错 -->
        <el-form :model="job" ref="ruleFormRef" :rules="rules"> 
        <el-form-item label="职位名称：" label-width="100px" prop="name">
            <el-input v-model="job.name"  placeholder="请输入工职位名称"/>
        </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onSave">确认</el-button>
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