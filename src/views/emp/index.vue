<script setup>
import {exportToExcel} from '@/utils/exportToExcel.js';
import {getCurrentTime} from '@/utils/getCurrentTime.js';
import { ElMessage,ElMessageBox } from 'element-plus'; 
import { ref,reactive,onMounted,watch } from 'vue';
import {queryEmpApi,addApi,deleteApi,queryByIdApi,updateApi} from '@/api/emp.js';
import {queryAllApi as queryAllJobApi} from '@/api/job.js';
import { requestApi as queryAllDeptApi} from '@/api/dept.js';
import { Plus } from '@element-plus/icons-vue';

const token = ref('');
const getToken = () => {
  const LoginUser = JSON.parse(localStorage.getItem('LoginUser'));
  if(LoginUser && LoginUser.token){
    token.value = LoginUser.token;
  }
}

onMounted(() => {
  getJobList();
  getDeptList();
  getToken();
  search();
})
const resetForm  = () => { 
  employee.value = {username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []}
  if (ruleFormRef.value){
    ruleFormRef.value.resetFields();//清除表单校验
  }
}
const ruleFormRef = ref();
const getJobList = async ()=>{
  const result = await queryAllJobApi();
  if(result.code){
    jobList.value = result.data;
  }
}
const getDeptList = async ()=>{
  const result = await queryAllDeptApi();
  if(result.code){
    deptList.value = result.data;
  }
}
const deptList = ref([]);
const jobList = ref([]);
const searchEmp = reactive({
  name:'',
  gender:'',
  begin:'',
  end:'',
  date:[],
  page:1,
  pageSize:5
})
const loading = ref(false);
const empList = ref({total:0,rows:[]});

const handleSearch = () => {
  search();
}

const handleReset = () => { 
  searchEmp.name = '';
  searchEmp.gender = '';
  searchEmp.begin = '';
  searchEmp.end = '';
  search();
}

//制定表单校验规则
const rules = ref({
  name: [
    { required: true, message: '名称不能为空!', trigger: 'blur' }, //输入框为空是的规则
    { min: 2, max: 10, message: '姓名长度应在2-10个字符之间', trigger: 'blur' },
  ],
  username:[
    { required: true, message: '用户名不能为空!', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2-20个字符之间', trigger: 'blur' },
  ],
  phone:[
    { required: true, message: '电话不能为空!', trigger: 'blur' },
    { min: 11, max: 11, message: '非法的电话位数，应为11位', trigger: 'blur' },
  ],
  gender:[
    { required: true, message: '请选择性别！', trigger: 'blur' },
  ],
  job:[
    { required: true, message: '请选择职位!', trigger: 'blur' },
  ],
  salary:[
    { required: true, message: '薪资不能为空!', trigger: 'blur' },
    { 
    validator: (rule, value, callback) => {
      const num = Number(value);
      if (!isNaN(num) && Number.isInteger(num)) {
        callback();
      } else {
        callback(new Error('请输入有效的整数'));
      }
    }, 
    trigger: 'blur'
  }
  ],
  deptId:[
    { required: true, message: '请选择部门!', trigger: 'blur' },
  ],
  entryDate:[
    { required: true, message: '请选择入职时间!', trigger: 'blur' },
  ]
})

//新增/修改表单
const employeeFormRef = ref(null)
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: null,
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')

//文件上传
const imageUrl = ref('')
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  imageUrl.value = response.data;
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}
const addEmp = ()=>{
  dialogTitle.value = '新增员工';
  dialogVisible.value = true;
}

const search = async () => { 
  loading.value = true;
  const result = await queryEmpApi(searchEmp);
  if(result.code){ 
    empList.value = result.data;
  }
  loading.value = false;
}

//捕捉改变页面展示数量
const handleSizeChange = (val)  => { 
  searchEmp.pageSize = val;
  searchEmp.page = 1;
  search();
}
const handleCurrentChange = (val)  => { 
  searchEmp.page = val;
  search();
}

const getJobTitle = (id)=>{
  const Job = jobList.value.find(item=>item.id === id);
  return Job?Job.name : '';
}

const addExpr = ()=>{ 
  employee.value.exprList.push({date:[],begin:'',end:'',company:'',job:''});
}

const removeExpr = (index)=>{ 
  employee.value.exprList.splice(index,1); // 删除数组中指定索引位置的元素,splice(index,1)中对应参数表示：index为索引位置，1为删除的元素个数（从索引开始，包含索引自身）
}

//修改或者添加员工信息
const onSave = ()=>{
  let result = null;
  if(!ruleFormRef.value) return;//未获取到表单时直接return
  ruleFormRef.value.validate( async (valid)=>{
    if(valid){
      if(employee.value.id){
        result = await updateApi(employee.value);
      }else{
        result = await addApi(employee.value);
      }
      if(result.code){
        ElMessage.success(`${dialogTitle.value}成功!`); //提示信息，使用Message的气泡提示
        dialogVisible.value = false;
        search();
        resetForm();
      }else{
        ElMessage.error(result.msg);
      }
    }else{
      ElMessage.error('表单校验失败！请检查填写是否有误！');
    }
  })
}
const onCancel = ()=>{ 
  dialogVisible.value = false;
  resetForm();
}
// 删除确认逻辑
const open = () => {
  if(delIds.value.length>0){
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
      const result =await deleteApi(delIds.value);
      if(result.code){
        ElMessage.success('删除成功!');
        delIds.value = [];
        search();
      }
    })
    .catch(() => { //取消
      ElMessage.info('操作取消');
      delIds.value = [];
    })
  }else{
    ElMessage.info('请选择要删除的数据!')
  }
}
const delIds = ref([]);

const handleSelectionChange = (rows) => {
  delIds.value = rows.map(item=>item.id);
};

const handleDelete = (id)=>{
  delIds.value.push(id);
  open();
}

const delEmp = () =>{
  open();
}

//修改逻辑
const handleEdit = async (id)=>{
  dialogTitle.value = '修改员工';
  dialogVisible.value = true;
  const result = await queryByIdApi(id);
  if(result.code){
    employee.value = result.data;
  }
  employee.value.exprList.forEach((expr,index)=>{
    if(expr.begin&&expr.end){
      expr.date = [expr.begin,expr.end]; 
    }else{
      expr.date=[];
    }
  })
}

//监听时间选择器的变化(用于条件查询表单)，选择了之后自动封装到begin和end变量中
watch(()=>searchEmp.date,(newValue,oldValue)=>{ 
  if(newValue.length==2){
    searchEmp.begin = newValue[0];
    searchEmp.end = newValue[1];
  }else{
    searchEmp.begin = '';
    searchEmp.end = '';
  }
})
//监听时间选择器的变化（用于添加或修改弹窗的工作经历表单）
watch(() => employee.value.exprList?.map(expr => expr.date),(dates)=>{ 
  dates.forEach((date,index)=>{
    //是 JavaScript 的数组解构赋值（Destructuring Assignment） 语法，常用于从数组中提取值并赋给变量。
    const [begin='',end=''] = date || []; 
    //这个index是dates数组的索引，对应遍历的exprList中的索引
    employee.value.exprList[index].begin=begin;
    employee.value.exprList[index].end=end;
  })
},{deep:true});

const buttonLoading = ref(false);
const toExcel =()=>{
  buttonLoading.value = true;
  exportToExcel(`员工数据_导出_原始数据_${getCurrentTime()}`,empList.value.rows);
  buttonLoading.value = false;
}
</script>


<template>
  <div class="container">
    <h1>员工管理</h1>
  </div>
  <div class="container" v-loading="loading" element-loading-text="加载中...">
    <div class="container">
      <el-form :inline="true" :model="searchEmp">
        <el-form-item label="姓名">
          <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" ></el-input>
        </el-form-item>

        <el-form-item label="性别" style="width: 150px;">
          <el-select v-model="searchEmp.gender" placeholder="请选择">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入职日期">
          <el-date-picker
            v-model="searchEmp.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <el-button type="primary" @click="addEmp"> + 新增员工</el-button>
      <el-button type="danger" @click="delEmp"> - 批量删除</el-button>
      <el-button type="success" @click="toExcel" :loading="buttonLoading">> 导出本页数据为Excel</el-button>
    </div>
    <div class="container">
      <!-- 表格  @selection-change="handleSelectionChange"是加在表格头上的-->
      <el-table :data="empList.rows" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"  width="55" align="center" />
        <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column label="性别" width="80" align="center">
          <template #default="scope" >
            {{ scope.row.gender == 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column label="头像" width="120" align="center">
          <template #default="scope" >
            <img :src="scope.row.image" alt="Avatar" class="avatar" style="max-width: 80px; max-height: 80px;border-radius: 20px;"/>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="部门名称" width="170" align="center"></el-table-column>
        <el-table-column label="职位" width="120" align="center">
          <template #default="scope">
            {{ getJobTitle(scope.row.job) }}
          </template>
        </el-table-column>
        <el-table-column prop="entryDate" label="入职日期" width="180" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="最后操作时间" width="210" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row.id)"><el-icon><Edit /></el-icon> 编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)"><el-icon><Delete /></el-icon> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="container">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchEmp.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="searchEmp.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="empList.total"
      >
      </el-pagination>
    </div>
  </div>
  <!-- 新增/修改员工的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" @close="resetForm">
      <el-form ref="ruleFormRef" :model="employee" label-width="80px" :rules="rules">
        <!-- 基本信息 -->
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位" prop="job">
              <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;" >
                <el-option v-for="j in jobList" :key="j.id" :label="j.name" :value="j.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资" prop="salary">
              <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
                <el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entryDate">
              <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        

        <!-- 工作经历 -->
        <!-- 第六行 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="工作经历">
              <el-button type="success" size="small" @click="addExpr">+ 添加工作经历</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第七行 ...  工作经历  vue为数据驱动显示,通过数据来驱动视图的显示  -->
        <el-row :gutter="3" v-for="(expr,index) in employee.exprList">
          <el-col :span="10">
            <el-form-item size="small" label="时间" label-width="80px">
              <el-date-picker v-model="expr.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="公司" label-width="60px">
              <el-input v-model="expr.company" placeholder="请输入公司名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="职位" label-width="60px">
              <el-input v-model="expr.job" placeholder="请输入职位"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item size="small" label-width="0px">
              <el-button type="danger" @click="removeExpr(index)">- 删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<style scoped>
.container {
  margin: 20px 0;
}
.avatar-uploader .avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
}
</style>