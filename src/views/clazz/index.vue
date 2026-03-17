<script setup>
import {exportToExcel} from '@/utils/exportToExcel.js';
import {getCurrentTime} from '@/utils/getCurrentTime.js';
import {requestApi,addApi,queryByIdApi,updateApi,deleteApi} from '@/api/clazz.js';
import {queryAllApi as queryAllSubjectApi} from '@/api/sub.js';
import {queryAllApi as queryAllEmpApi} from '@/api/emp.js';
import { ElMessage,ElMessageBox } from 'element-plus'; 
import { ref,reactive,onMounted,watch } from 'vue';;
//在 Vue 3 的 <script setup> 中如果访问数据需要使用.value，ref 定义的变量在 模板（<template>）里会自动解包（无需 .value），
// 但在某些情况下，你可能仍然需要手动加 .value，比如 绑定到组件或原生 HTML 属性时。
onMounted(()=>{ //页面加载时执行
  queryMasterList();
  queryAllSubject();
  search();
})

const loading = ref(false);
const resetForm = ()=>{
  clazz.value ={
    name: '',
    room: '',
    beginDate: '',
    endDate: '',
    masterId:null,
    subject:null
  };
  if(ruleFormRef.value){
    ruleFormRef.value.resetFields(); //清除表单校验
  }
}
const queryMasterList = async ()=>{ 
  const result = await queryAllEmpApi();
  if(result.code){
    marsterList.value= result.data;
  }
}

const queryAllSubject = async()=>{
  const result = await queryAllSubjectApi();
  if(result.code){
    subjectList.value = result.data;
  }
}

const marsterList = ref([]);

const subjectList = ref([]);

const clazz = ref({
  name: '',
  room: '',
  beginDate: '',
  endDate: '',
  masterId:null,
  subject:null
});


const ruleFormRef = ref(); //获取表单ref实例
//制定表单校验规则
//每个规则单独作为一个数组项
const rules = ref({
  name: [
    { required: true, message: '班级名称不能为空!', trigger: 'blur' }, //输入框为空是的规则
    // { min: 2, max: 10, message: 'The length of Department Name should between 2 and 10.', trigger: 'blur' },
  ],
  room: [
    { required: true, message: '教室不能为空!', trigger: 'blur' },
  ],
  beginDate: [
    { required: true, message: '请选择开课日期!', trigger: 'blur' },
  ],
  endDate: [
    { required: true, message: '请选择结课日期!', trigger: 'blur'},
    {validator: (rule, value, callback) => { //参数：rule, value, callback分别为当前规则对象、当前字段的值、一个回调函数
        if (value&&(value < clazz.value.beginDate)) {
          callback(new Error('结课日期必须在开课日期之后')) //校验完成后需调用callback()
        } else {
          callback()
        }
      }
    }
  ],
  subject:[
    { required: true, message: '请选择学科', trigger: 'blur' },
  ]
})
//分页大小改变时执行
//val（变量名任意） 是 Element Plus 分页组件自动传入的参数，表示当前页码。你无需手动赋值，只需接收并使用即可。
const handleSizeChange  = (val) => { 
  formInline.pageSize = val;
  search();
}
//分页页码改变时执行
const handleCurrentChange  = (val) => { 
  formInline.page = val;
  search();
}
const TitleName = ref('');
const dialogFormVisible = ref(false);

const formInline = reactive({
  user: '',
  begin: '',
  end: '',
  date: [],
  page:1,
  pageSize:5
})
const onQuery = () => {
  search();
}

const onClear = () => { 
  formInline.user = '';
  formInline.begin = '';
  formInline.end = '';
  search();
  ElMessage.info('Conditions Cleared')
}

const search = async () => { 
  loading.value = true;
  const result = await requestApi(formInline);
  if(result.code){ 
    tableData.value = result.data;
  }
  loading.value = false;
}
const tableData = ref(
  {
    total:0,
    rows:[]
  })

const addClass = () => {
  TitleName.value = '添加班级';
  dialogFormVisible.value=true;
}

const editClass = async (id) => { 
  TitleName.value = '编辑班级';
  dialogFormVisible.value = true;
  const result = await queryByIdApi(id);
  if(result.code){ 
    clazz.value = result.data;
  }else{ 
    dialogFormVisible.value = false;
    ElMessage.error(result.message);
  }
}

//watch()函数的使用,用于时间选择器的监听，自动检测变化并分别封装到begin和end变量中
//第一个参数为监听的变量，第二个参数为监听的回调函数（回调函数的参数为新值和旧值），第三个参数为监听的配置项，有默认值（immediate:false）（deep:false监听对象中的所有属性））
watch(()=>formInline.date,(newValue,oldValue)=>{
  if(newValue.length==2){
    formInline.begin = newValue[0];
    formInline.end = newValue[1];
  }else{
    formInline.begin = '';
    formInline.end = '';
  }
})
//添加或修改班级确认按钮
const onSubmit  = async () => {
  let result;
  if(!ruleFormRef.value) return; //为获取表单实例直接结束
  ruleFormRef.value.validate( async (valid)=>{
    if(valid){ //验证成功
      if(clazz.value.id){ //修改
        result = await updateApi(clazz.value);
        if(result.code){ 
          ElMessage.success('修改成功!');
          dialogFormVisible.value = false;
          search();
          resetForm();
        }else{
          ElMessage.error(`修改失败!${result.msg}`);
        }
      }else{ //添加
        result = await addApi(clazz.value);
        if(result.code){
          ElMessage.success('添加成功!'); //提示信息，使用Message的气泡提示
          dialogFormVisible.value = false;
          search();
          resetForm();
        }else{
          ElMessage.error(result.msg);
        }
      }
    }else{ //验证失败
      ElMessage.error('表单校验错误，请检查是否有误!');
    }
  })
}
//添加或修改班级取消按钮
const onCancel = () => { 
  dialogFormVisible.value = false;
  resetForm();
}

// 删除确认逻辑
const deleteConfirm = (id) => {
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
  exportToExcel(`班级数据_导出_原始数据_${getCurrentTime()}`,tableData.value.rows);
  buttonLoading.value = false;
}
const getSubjectName = (id)=>{
  const subject = subjectList.value.find(item=>item.id==id);
  return subject?subject.name:'';
}
</script>

<template>
  <div class="container">
    <h1>班级管理</h1>
  </div>
  <div class="container" v-loading="loading" element-loading-text="加载中...">
    <div class="container">
      <el-form :inline="true" :model="formInline">
      <el-form-item label="班级名称:" >
        <el-input v-model="formInline.user" placeholder="输入班级名称" clearable style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="结课日期:" style="margin-right: 15px;">
        <el-date-picker
          v-model="formInline.date"
          type="daterange"
          start-placeholder="起始"
          end-placeholder="结束"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <!-- 条件查询按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onQuery">查询</el-button>
      </el-form-item>
      <!-- 清空条件查询按钮 -->
      <el-form-item>
        <el-button type="info" @click="onClear">清空</el-button>
      </el-form-item>
      </el-form>
    </div>
    <!-- 新增班级按钮 -->
    <div class="container">
      <el-button type="primary" @click="addClass">+ 新增班级</el-button>
      <el-button type="success" @click="toExcel" :loading="buttonLoading">> 导出本页数据为Excel</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="container">
      <el-table :data="tableData.rows" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="name" label="班级名称" width="200" align="center" show-overflow-tooltip/>
      <el-table-column prop="room" label="教室" width="80" align="center"/>
      <el-table-column prop="masterName" label="班主任" width="150" align="center"/>
      <el-table-column label="课程名称" width="150" align="center">
        <template #default="scope">
          {{getSubjectName(scope.row.subject)}}
        </template>
      </el-table-column>
      <el-table-column prop="beginDate" label="开课日期" width="150" align="center"/>
      <el-table-column prop="endDate" label="结课日期" width="150" align="center"/>
      <el-table-column prop="status" label="状态" width="80" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editClass(scope.row.id)"><el-icon><Edit /></el-icon> 编辑</el-button>
          <el-button type="danger" size="small" @click="deleteConfirm(scope.row.id)" ><el-icon><Delete /></el-icon> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 分页条 -->
      <div class="container">
        <el-pagination
        v-model:current-page="formInline.page"
        v-model:page-size="formInline.pageSize"
        :page-sizes="[5,10, 20, 30, 40]"
        :background=true
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
      </div>

      <!-- 添加班级弹窗 -->

      <el-dialog v-model="dialogFormVisible" width="500px" @close="onCancel"> 
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <el-icon><CollectionTag style="color: #409EFF;"/></el-icon>
        <span style="margin-left: 8px;color: #409EFF;font-size: large;">{{TitleName}}</span>
        </div>
        <el-form :model="clazz" label-width="150px" ref="ruleFormRef" :rules="rules">
        <el-row gutter="10">
          <el-col :span="12">
            <el-form-item label="班级名称:" style="width: 400px;" prop="name">
              <el-input v-model="clazz.name" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="24">
            <el-form-item label="教室:" style="width: 400px;" prop="room">
              <el-input v-model="clazz.room" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="24">
            <el-form-item label="开课日期:" style="width: 400px;" prop="beginDate">
              <el-date-picker
                v-model="clazz.beginDate"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="24">
            <el-form-item label="结课日期:" style="width: 400px;" prop="endDate">
              <el-date-picker
                v-model="clazz.endDate"
                type="date"
                placeholder="请选择日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="24">
            <el-form-item label="班主任:" style="width: 400px;">
            <el-select v-model="clazz.masterId" placeholder="请选择班主任">
              <!-- value:表示要提交的值（选中的）  key:唯一的值  label:显示的文字  -->
              <el-option v-for="m in marsterList" :key="m.id"  :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
      <el-row gutter="10">
          <el-col :span="24">
            <el-form-item label="学科:" style="width: 400px;" prop="subject">
            <el-select v-model="clazz.subject" placeholder="请选择开设学科">
              <!-- value:表示要提交的值（选中的）  key:唯一的值  label:显示的文字  -->
              <el-option v-for="s in subjectList" :key="s.id"  :label="s.name" :value="s.id" />
            </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center;">
          <el-button type="info" @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  
</template>

<style scoped>
.container {
  margin: 20px 0;
}
</style>