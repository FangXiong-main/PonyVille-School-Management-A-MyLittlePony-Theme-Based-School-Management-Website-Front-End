<script setup>
import {exportToExcel} from '@/utils/exportToExcel.js';
import {getCurrentTime} from '@/utils/getCurrentTime.js';
import { ElMessage,ElMessageBox } from 'element-plus'; 
import { ref,reactive,onMounted,watch } from 'vue';
import {queryAllApi,addApi,delApi,updateApi,queryByIdApi,violationApi} from '@/api/stu.js'
import {queryAllApi as queryALlClassApi} from '@/api/clazz.js';
onMounted( () => {
  queryAllClass();
  search();
})
const resetForm  = () => { 
  if(ruleFormRef.value){
    ruleFormRef.value.resetFields();
  }
  if(violationRuleFormRef.value){
    violationRuleFormRef.value.resetFields();
  }
  student.value={
  name:'',
  no:'',
  gender:null,
  phone:'',
  idCard:'',
  isCollege:null,
  address:'',
  clazzId:null,
  degree:null,
  graduationDate:'',
}
  violationStu.id = null;
}
const ruleFormRef = ref();
const rules=ref({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
  ],
  no: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个数字', trigger:'blur'},
    {
      validator: (rule, value, callback) => {
        const num = Number(value);
        if(isNaN(num)&&!Number.isInteger(num)){
          callback(new Error('请输入数字!'));
        }else{
          callback();
        }
      }
    }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { min: 18, max: 18, message: '请输入18位身份证号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if(value.length != 18){
          callback(new Error('请输入18位身份证号'));
        }else{
          callback();
        }
      }
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
  ],
  isCollege: [
    { required: true, message: '请选择', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  gender:[
    { required: true, message: '请选择性别', trigger: 'blur' }
  ]
})
const violationRuleFormRef = ref();
const violationRule = ref({
  score:[
    { required: true, message: '请输入分数', trigger: 'blur' },
    {
      validator:(rule,value,callback)=>{
        const score = Number(value);
        if(isNaN(score)){
          callback(new Error('请输入有效的分数(数字)'));
        }else if(score<=0 || score>=100){
          callback(new Error('请输入有效的分数(1-99)'));
        }else{
          callback();
        }
      }
    }
  ]
})
const dialogTitle = ref('添加学员');
const student = ref({
  name:'',
  no:'',
  gender:null,
  phone:'',
  idCard:'',
  isCollege:null,
  address:'',
  clazzId:null,
  degree:null,
  graduationDate:'',
  clazzId:null
})
const dialogFormVisible = ref(false);
const queryAllClass = async ()=>{
  const result = await queryALlClassApi();
  if(result.code){
    clazzList.value = result.data;
  }
}
const loading  = ref(false);
const formInline = ref({name:'',degree:'',clazzId:'',page:1,pageSize:5});
const clazzList = ref([]);

const getClazzName = (id)=>{
  const clazz = clazzList.value.find(item=>item.id === id);
  return clazz?clazz.name:''; //三元运算符，用法为：false时返回第二个参数
}

const getDegreeName = (id)=>{
  const degree = degreeList.value.find(item=>item.id === id);
  return degree?degree.name:'';
}

const tableData = ref({
  total: 0,
  rows: []
});
const degreeList = ref([{id:1,name:'初中'},{id:2,name:'高中'},{id:3,name:'大专'},{id:4,name:'本科'},{id:5,name:'硕士'},{id:6,name:'博士'}]);
const search = async () => {
  loading.value = true;
  const result = await queryAllApi(formInline.value);
  if(result.data){
  tableData.value = result.data;
}
  loading.value = false;
}
const onClear=()=>{
  formInline.value={name:'',degree:'',clazzId:'',page:1,pageSize:5};
  search();
}
const onQuery=()=>{
  search();
}
const handleSizeChange = (val)=>{
  formInline.value.pageSize = val;
  formInline.value.page = 1;
  search();
}
const handleCurrentChange = (val)=>{
  formInline.value.page = val;
  search();
}
const addStu = () => { 
  dialogFormVisible.value = true;
}
const onCancel = ()=>{
  dialogFormVisible.value = false;
  resetForm();
}
const onSave = ()=>{
  if(!ruleFormRef.value) return;
  let result;
  ruleFormRef.value.validate( async (valid)=>{
    if(valid){
      if(student.value.id){
        result = await updateApi(student.value);
      }else{
        result = await addApi(student.value);
      }
      if(result.code){
        ElMessage.success(`${dialogTitle.value}成功!`); //提示信息，使用Message的气泡提示
        dialogFormVisible.value = false;
        search();
        resetForm();
      }else{
        ElMessage.error(result.msg);
      }
    }
  })
}

const delIds =  ref([]);
const open = ()  => { 
  ElMessageBox.confirm(
    '此操作将永久删除数据, 是否继续?',
    '删除警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then( async () => { //确定
      const result =await delApi(delIds.value);
      if(result.code){
        ElMessage.success('删除成功!');
        search();
      }else{
        ElMessage.error(result.msg);
      }
      delIds.value = [];
    })
    .catch(() => { //取消
      ElMessage.info('操作取消');
      delIds.value = [];
    })
}

const handleSelectionChange  = (rows) => { 
  delIds.value = rows.map(item => item.id);
}
const delStuBySingle = (id) => { 
  delIds.value.push(id);
  open();
}
const delStuByIds = () => {
  if(delIds.value.length === 0){
    ElMessage.warning('请选择要删除的学员!');
  }else{
    open();
  }
}

const updateDept = async (id) => {
  const result = await queryByIdApi(id);
  if(result.code){
    student.value = result.data;
  }
  dialogTitle.value = '修改学员信息'
  dialogFormVisible.value = true;
}
const violationTitle = ref('');
const violationDialogVisible = ref(false);
const violationStu = ref({id: null,score:null});
const onViolation = (id,name) => { 
  violationDialogVisible.value = true;
  violationStu.value.id = id;
  violationTitle.value = `违纪处理（${name})`;
}
const  violation = async () => { 
  if(!violationRuleFormRef) return;
  violationRuleFormRef.value.validate(async (valid) => { 
    if(valid){
      const result = await violationApi(violationStu.value);
      if(result.code){
        violationDialogVisible.value = false;
        ElMessage.success('违纪处理成功！');
        violationStu.value.id = null;
        violationStu.value.score = null;
        search();
        resetForm();
      }else{ 
        ElMessage.error(`违纪处理失败！${result.msg}`);
        violationStu.value.id = null;
        violationStu.value.score = null;
      }
    }else{
      ElMessage.error('表单校验失败！请检查填写是否有误！');
    }
  })
}

const buttonLoading =ref(false);
const toExcel = ()=>{
  buttonLoading.value = true;
  exportToExcel(`学员数据_导出_原始数据_${getCurrentTime()}`,tableData.value.rows);
  buttonLoading.value = false;
}
</script>

<template>
  <div class="container">
    <h1>学员管理</h1>
  </div>
  <div class="container" v-lodaing="loading" element-loading-text="加载中...">
    <div class="container">
      <el-button type="primary" @click="addStu">+ 添加学员</el-button>
      <el-button type="danger" @click="delStuByIds">- 批量删除</el-button>
      <el-button type="success" @click="toExcel" :loading="buttonLoading">> 导出本页数据为Excel</el-button>
    </div>
    <!-- 条件搜索表单 -->
    <div class="container">
      <el-form :inline="true" :model="formInline">
      <el-form-item label="学生姓名:" >
        <el-input v-model="formInline.name" placeholder="输入学生姓名" clearable style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="最低学历:" style="width: 260px;">
        <el-select v-model="formInline.degree" placeholder="选择学历">
          <!-- value:表示要提交的值（选中的）  key:唯一的值  label:显示的文字  -->
          <el-option v-for="d in degreeList" :key="d.id"  :label="d.name" :value="d.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级:" style="width: 260px;">
        <el-select v-model="formInline.clazzId" placeholder="选择班级">
          <!-- value:表示要提交的值（选中的）  key:唯一的值  label:显示的文字  -->
          <el-option v-for="c in clazzList" :key="c.id"  :label="c.name" :value="c.id" />
        </el-select>
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
    <div class="container">
    <el-table :data="tableData.rows" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="name" label="姓名" width="100" align="center"/>
      <el-table-column prop="no" label="学号" align="center" width="150"/>
      <el-table-column label="班级" align="center" width="150">
        <template #default="scope">
          {{getClazzName(scope.row.clazzId)}}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="80">
        <template #default="scope">
          <span v-if="scope.row.gender==1">男</span>
          <span v-else-if="scope.row.gender==2">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" align="center" width="180"/>
      <el-table-column label="学历" align="center" width="80">
        <template #default="scope">
          {{getDegreeName(scope.row.degree)}}
        </template>
      </el-table-column>
      <el-table-column prop="violationCount" label="违纪次数" align="center" width="100"/>
      <el-table-column prop="violationScore" label="违纪分数" align="center" width="100"/>
      <el-table-column prop="updateTime" label="最后操作时间" align="center" width="150"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <!-- "scope" 是一个对象，它包含了当前行的数据和索引等信息 row	-Object-	当前行的数据对象-->
          <el-button type="primary" size="small" @click="updateDept(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="delStuBySingle(scope.row.id)">删除</el-button>
          <el-button type="warning" size="small" @click="onViolation(scope.row.id,scope.row.name)">违纪</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="container">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      >
      </el-pagination>
    </div>
  </div>

  <!-- 添加/修改学生弹窗 -->
  <el-dialog v-model="dialogFormVisible" width="720px" @close="resetForm" :title="dialogTitle"> 
    <!--label-width=""属性，会使 <el-form-item> 的标签都会默认以 120px 的宽度进行展示。 -->
    <el-form ref="ruleFormRef" :rules="rules" :model="student" label-width="130px" style="margin-bottom: 10px;" >
      <el-row gutter="10">
        <el-col :span="12">
          <el-form-item label="姓名：" prop="name">
            <el-input style="width: 180px;" v-model="student.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号：" prop="no">
            <el-input style="width: 180px;" v-model="student.no" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row gutter="10">
        <el-col :span="12">
          <el-form-item label="性别："  prop="gender">
            <el-select style="width: 180px;" v-model="student.gender" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号："  prop="phone">
            <el-input style="width: 180px;" v-model="student.phone"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row gutter="10">
        <el-col :span="12">
          <el-form-item label="身份证号：" prop="idCard">
            <el-input style="width: 180px;" v-model="student.idCard" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="家庭地址：" prop="address">
            <el-input style="width: 180px;" v-model="student.address"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row gutter="10">
        <el-col :span="12">
          <el-form-item label="是否院校学员：" prop="isCollege">
            <el-select style="width: 180px;" v-model="student.isCollege" placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高学历：">
            <el-select style="width: 180px;" v-model="student.degree" placeholder="请选择学历" >
                <el-option v-for="d in degreeList" :key="d.id" :label="d.name" :value="d.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row gutter="10">
        <el-col :span="12">
          <el-form-item label="毕业时间：">
            <el-date-picker 
            v-model="student.graduationDate" 
            type="date" 
            style="width: 180px;" 
            placeholder="请选择日期" 
            format="YYYY-MM-DD" 
            value-format="YYYY-MM-DD"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属班级：">
            <el-select style="width: 180px;" v-model="student.clazzId" placeholder="请选择班级" >
                <el-option v-for="c in clazzList" :key="c.id" :label="c.name" :value="c.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
        <div class="dialog-footer" >
          <el-button type="info" @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSave">确认</el-button>
        </div>
    </template>
  </el-dialog>

  <!-- 违纪处理窗口 -->
   <el-dialog v-model="violationDialogVisible" :title="violationTitle" width="500" center @close="resetForm">
    <el-form :model="violationStu" style="margin: 15px 0px;" ref="violationRuleFormRef" :rules="violationRule">
      <el-form-item label="违纪记分：" prop="score">
        <el-input v-model="violationStu.score" placeholder="请输入违纪分数(1-99)"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="violationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="violation">确认</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.container {
  margin: 20px 0;
}
</style>