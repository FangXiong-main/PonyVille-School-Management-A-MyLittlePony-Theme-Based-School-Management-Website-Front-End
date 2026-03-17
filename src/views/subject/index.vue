<script setup>
import {exportToExcel} from '@/utils/exportToExcel.js';
import {getCurrentTime} from '@/utils/getCurrentTime.js';
import { ElMessage,ElMessageBox } from 'element-plus'; 
import { ref,reactive,onMounted,watch } from 'vue';
import { addApi,queryAllApi,updateApi,deleteApi,queryByIdApi } from '@/api/sub.js';
onMounted(()=>{
    search();
})
const resetForm = ()=>{
    if(ruleFormRef.value){
        ruleFormRef.value.resetFields();
    }
    subject.value={id:null,name:''};
}
const TitleName = ref('');
const loading = ref(false);
const subList = ref([]);
const ruleFormRef = ref();
const dialogFormVisible = ref(false);
const rules = ref({
    name:[
        {required:true,message:'请输入开设课程名称',trigger:'blur'},
        {min:2,max:10,message:'名称长度在2到10个字符',trigger:'blur'}
    ]
})
const subject= ref({id:null,name:''})
const search = async ()=>{ 
    loading.value = true;
    const result = await queryAllApi();
    if(result.code){
        subList.value = result.data;
    }
    loading.value = false;
}

const onCancel = ()=>{
    dialogFormVisible.value = false;
    resetForm();
}
const addSub = ()=>{ 
    TitleName.value = '新增课程'
    dialogFormVisible.value = true;
}
const updateSub = async (id)=>{
    const result = await queryByIdApi(id);
    if(result.code){
        subject.value = result.data;
    }else{
        ElMessage.error(result.msg);
        return;
    }
    TitleName.value = '修改课程';
    dialogFormVisible.value = true;
}
const deleteSub = async (id)=>{
    open(id);
}
const onSave = ()=>{
    if(!ruleFormRef.value) return;
    let result = null;
    ruleFormRef.value.validate( async (valid)=>{
        if(valid){
            if(subject.value.id){
                result = await updateApi(subject.value); //若不加await，则result为undefined，会导致无法判断是否添加成功
            }else{
                result = await addApi(subject.value);
            }
            if(result.code){
            ElMessage.success(`${TitleName.value}成功！`);
            dialogFormVisible.value = false;
            resetForm();
            search();
            }else{
            ElMessage.error(`${TitleName.value}失败！${result.msg}`);
            }
        }else{
            ElMessage.error('表单校验失败！请检查填写是否有误！');
        }
    })
}

// 删除确认逻辑
const open = (id) => {
  ElMessageBox.confirm(
    '此操作将永久删除该数据，是否继续？',
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
        ElMessage.success('删除成功！');
        search();
      }
    })
    .catch(() => { //取消
      ElMessage.info('操作取消');
    })
}

const buttonLoading  = ref(false);
const toExcel  = () => { 
    buttonLoading.value = true;
    exportToExcel(`日志记录数据_导出_原始数据_${getCurrentTime()}`,subList.value);
    buttonLoading.value = false;
}   
</script>

<template>
    <div class="container">
        <h1>开设课程管理</h1>
    </div>
    <div class="container" v-loading="loading" element-loading-text="加载中...">
        <div class="container">
            <el-button type="primary" @click="addSub">+ 新增课程</el-button>
            <el-button type="success" @click="toExcel">> 导出本页数据为Excel</el-button>
        </div>
        <div class="container">
            <el-table :data="subList" border style="width: 100%">
            <el-table-column type="index" label="ID" width="180" align="center"/>
            <el-table-column prop="name" label="课程名称" width="500" align="center"/>
            <el-table-column label="操作" align="center" >
                <template #default="scope">
                    <el-button type="primary" size="small" @click="updateSub(scope.row.id)"><el-icon><Edit /></el-icon>编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteSub(scope.row.id)"><el-icon><Delete /></el-icon>删除</el-button>
                </template>
            </el-table-column>
            </el-table>
        </div>
    </div>
    <!-- 新增课程弹窗 -->
    <el-dialog v-model="dialogFormVisible" width="500" @close="resetFrom">
      <!-- 使用插槽自定义标题#header -->
      <template #header> 
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <el-icon><CollectionTag style="color: #409EFF;"/></el-icon>
        <span style="margin-left: 8px;color: #409EFF;font-size: large;">{{TitleName}}</span>
      </div>
      </template>
      <!-- ref="ruleFormRef"是表示绑定表单 :rules="rules"进行规则绑定 props="name" 表单属性(对应规则)绑定  -->
      <el-form :model="subject" ref="ruleFormRef" :rules="rules"> 
        <el-form-item label="课程名称：" label-width="100px" prop="name">
          <el-input v-model="subject.name"  placeholder="请输入开设课程名称(2-10)"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSave">确认</el-button>
        </div>
      </template>
    </el-dialog>

</template>

<style scoped>
.container{
    margin: 20px 0;
}
</style>