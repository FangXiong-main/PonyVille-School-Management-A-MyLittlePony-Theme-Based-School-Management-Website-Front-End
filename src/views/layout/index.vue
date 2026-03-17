<script setup>
import { ElMessage,ElMessageBox } from 'element-plus'; 
import { ref,onMounted } from 'vue';
import {useRouter} from 'vue-router';
import {loginApi} from '@/api/login.js';
import {updateApi} from '@/api/emp.js';
import {queryByIdApi} from '@/api/job.js';
const detectIsLogin = async ()=>{
  const user  = JSON.parse(localStorage.getItem('LoginUser'));
  if(user && user.id){
    const result = await queryByIdApi(0);
  }else{
    ElMessage.warning('请先登录！');
    router.push('/login');
  }
}
const confirmDialogFormVisible = ref(false);
const newDialogFormVisible = ref(false);
const router = useRouter();
onMounted(()=>{
  detectIsLogin();
  getUserName();
})
const resetForm = () => {
  if(ruleFormRef.value){
    ruleFormRef.value.resetFields();
  }
  loginForm.value = {username:'',password:''};
  passwordForm.value = {fPassword:'',sPassword:''};
};
const ruleFormRef = ref();
const rules = ref({
  fPassword:[
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {min:6,message:'密码长度不能小于6位'}
  ],
  sPassword:[
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule,value,callback) =>{
        if(value !== passwordForm.value.fPassword){
          callback(new Error('两次输入的密码不一致'));
        }else{
          callback();
        }
      }
    }
  ]
})
const loginForm = ref({
  username: '',
  password: ''
});
const userName = ref('');///用户名
const passwordForm = ref({fPassword:'',sPassword:''});  //用于校验两次输入的密码
const userNew = ref({id:null,password:''}); //存储用户修改后的密码并提交修改
const getUserName = ()=>{
  const User = JSON.parse(localStorage.getItem('LoginUser'));
  if(User && User.name){
    userName.value = User.name;
  }
}
const logOut = () => {
  ElMessageBox.confirm(
    `${userName.value},你是否要退出登录？`,
    '退出登录',
    {
      confirmButtonText: '没错',
      cancelButtonText: '手滑了',
      type: 'warning',
    }
  )
    .then( async () => { //确定
      localStorage.removeItem('LoginUser');
      router.push('/login');
      ElMessage.success('退出成功');
      userName.value = '';
    })
    .catch(() => { //取消
      ElMessage.info('取消退出');
    })
}
const onConfirm  = async ()=>{ 
  const result = await loginApi(loginForm.value);
  if(result.code){
    confirmDialogFormVisible.value = false;
    ElMessage.success('身份验证成功');
    newDialogFormVisible.value = true;
  }else{
    ElMessage.error('密码错误');
  }
}
const modifyButton = ()=>{ 
  confirmDialogFormVisible.value =  true;
  const User = JSON.parse(localStorage.getItem('LoginUser'));
  if(User && User.username && User.id){
    loginForm.value.username = User.username;
    userNew.value.id = User.id;
  }else{
    confirmDialogFormVisible.value =  true;
    resetForm();
    ElMessage.error('未知错误，请联系管理员');
  }
}
const onCancel  = ()=>{ 
  confirmDialogFormVisible.value = false;
  newDialogFormVisible.value = false;
  resetForm();
}
const modifyPassword = ()=>{
  if(!ruleFormRef.value) return;
  userNew.value.password = passwordForm.value.fPassword;
  ruleFormRef.value.validate(async(valid)=>{ 
    if(valid){
      const result = await updateApi(userNew.value);
      if(result.code){
        ElMessage.success('密码修改成功！');
        newDialogFormVisible.value  = false;
        userNew.value = {id:null,password:''};
        resetForm();
        localStorage.removeItem('LoginUser');
        ElMessage.warning('请重新登录')
        router.push('/login');
      }else{
        ElMessage.error(`密码修改失败！${result.msg}`);
        userNew.value = {id:null,password:''};
        resetForm();
        newDialogFormVisible.value = false;
      }
    }else{
      ElMessage.error('请检查填写是否有误');
    }
  })
}
</script>

<template>
  <div class="common-layout">
    <link rel="icon" href="../../assets/Logo.png" type="image/x-icon">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header" >
        <span class="logo"><img src="../../assets/Logo.png" alt="Logo"></span>
        <span class="title">PonyVilleSchool管理平台</span>
        <span class="right_tool">
          <a href="javascript:void(0);" @click="modifyButton">
            <el-icon><EditPen /></el-icon> 修改密码 &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp;
          </a>
          <!-- javascript:void(0);作用是阻止默认行为，即不跳转页面 -->
          <a href="javascript:void(0);" @click="logOut">
            <el-icon><SwitchButton /></el-icon> 退出登录【{{ userName }}】
          </a>
        </span>
      </el-header>
      
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-menu router="true">
            <!-- 首页菜单 -->
            <el-menu-item index="/index">
              <el-icon><Promotion /></el-icon> 首页
            </el-menu-item>
            
            <!-- 班级管理菜单 -->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon><Menu /></el-icon> 班级/学生管理
              </template>
              <el-menu-item index="/clazz">
                <el-icon><HomeFilled /></el-icon>班级管理
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon><UserFilled /></el-icon>学生管理
              </el-menu-item>
            </el-sub-menu>
            
            <!-- 系统信息管理 -->
            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Tools /></el-icon>学校系统管理
              </template>
              <el-menu-item index="/dept">
                <el-icon><HelpFilled /></el-icon>部门管理
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon><Avatar /></el-icon>职工管理
              </el-menu-item>
              <el-menu-item index="/jobs">
                <el-icon><Checked /></el-icon>职位管理
              </el-menu-item>
              <el-menu-item index="/subjects">
                <el-icon><Management /></el-icon>开设课程管理
              </el-menu-item>
            </el-sub-menu>

            <!-- 数据统计管理 -->
            <el-sub-menu index="/report">
              <template #title>
                <el-icon><Histogram /></el-icon>数据统计管理
              </template>
              <el-menu-item index="/empReport">
                <el-icon><TrendCharts /></el-icon>员工信息统计
              </el-menu-item>
              <el-menu-item index="/stuReport">
                <el-icon><Flag /></el-icon>学员信息统计
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon><List /></el-icon>日志信息统计
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <el-main>
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
      
    </el-container>
  </div>
  <!-- 校验用户 -->
  <el-dialog v-model="confirmDialogFormVisible" width="500" @close="resetForm">
        <!-- 使用插槽自定义标题#header -->
        <template #header> 
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <el-icon><CollectionTag style="color: #409EFF;"/></el-icon>
        <span style="margin-left: 8px;color: #409EFF;font-size: large;">确认身份</span>
        </div>
        </template>
        <!-- ref="ruleFormRef"是表示绑定表单 :rules="rules"进行规则绑定 props="name" 表单属性(对应规则)绑定  -->
         <!-- 注意事项： :model绑定对象，不要绑定对象的属性，否则校验会一直报错 -->
        <el-form :model="loginForm" ref="ruleFormRef" :rules="rules"> 
        <el-form-item label="请输入旧密码：" label-width="120px">
            <el-input v-model="loginForm.password"  placeholder="输入旧密码" type="password" show-password/>
        </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onConfirm">确认</el-button>
        </div>
        </template>
    </el-dialog>
    <!-- 新窗口 -->
    <el-dialog v-model="newDialogFormVisible" width="500" @close="resetForm">
        <!-- 使用插槽自定义标题#header -->
        <template #header> 
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <el-icon><CollectionTag style="color: #409EFF;"/></el-icon>
        <span style="margin-left: 8px;color: #409EFF;font-size: large;">修改密码</span>
        </div>
        </template>
        <!-- ref="ruleFormRef"是表示绑定表单 :rules="rules"进行规则绑定 props="name" 表单属性(对应规则)绑定  -->
         <!-- 注意事项： :model绑定对象，不要绑定对象的属性，否则校验会一直报错 -->
        <el-form :model="passwordForm" ref="ruleFormRef" :rules="rules"> 
        <el-form-item label="请输入新密码：" label-width="160px" prop="fPassword">
            <el-input v-model="passwordForm.fPassword"  placeholder="输入新密码" type="password" show-password/>
        </el-form-item>
        <el-form-item label="请再输入一遍：" label-width="160px" prop="sPassword">
            <el-input v-model="passwordForm.sPassword"  placeholder="再输入一遍" type="password" show-password/>
        </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="modifyPassword">确认</el-button>
        </div>
        </template>
    </el-dialog>
  <footer>
    <div class="footer">
      <span>Copyright © FangXiong Technology 2024-2025 </span>
      <br>
      <span>AllRights Received</span>
    </div>
  </footer>
</template>

<style scoped>

.footer {
  text-align: center;
  padding: 20px;
  background-image: linear-gradient(to right, #b119c5, #e019a8,#e449cfc9);
  color:whitesmoke;
  font-size: 18px;
}

.header {
  height: 80px;
  padding: 10px;
  background-image: linear-gradient(to right, #b119c5, #e019a8,#e449cfc9);
}
img{
  width: 70px;
}
.logo {
  float: left;
}
.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool{
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 200px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
