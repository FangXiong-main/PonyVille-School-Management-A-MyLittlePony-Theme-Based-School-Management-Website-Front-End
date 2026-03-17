<script setup>
  import { ref,onMounted } from 'vue';
  import { ElMessage,ElMessageBox } from 'element-plus'; 
  import {queryByIdApi} from '@/api/job.js'
  import {useRouter} from 'vue-router';
  import {loginApi} from '@/api/login.js';
  const loginForm = ref({username:'', password:''})
  const  router = useRouter();
  const loading = ref(false);
  const detectIsLogin = async ()=>{ 
    const user  = JSON.parse(localStorage.getItem('LoginUser'));
    if(user && user.id){
      const result = await queryByIdApi(0);
      if(result.code){
        router.push('/');
        ElMessage.warning('您已登录');
      }
    }
  }
  const resetForm = ()=>{
    loginForm.value.username = '';
    loginForm.value.password = '';
  }
  const onLogin = async ()=>{
    loading.value = true;
    const result = await loginApi(loginForm.value);
    if(result.code){
      ElMessage.success('登录成功')
      //储存登录用户信息至localStorage
      localStorage.setItem('LoginUser',JSON.stringify(result.data)); //存储用户信息JSON.stringify()作用是将对象或值转换为字符串
      router.push('/index');
    }else{
      ElMessage.error(result.msg);
    }
    loading.value = false;
  }
  onMounted(() => {
    detectIsLogin();
  })
</script>

<template>
  <div id="container" style="text-align:center;">
    <div class="login-form">
      <img src="@/assets/logo.png" alt="" style="width: 100px;float: left;">
      <p class="title">PonyVilleSchool<br>管理系统</p>
      <el-form label-width="80px" v-loading="loading" element-loading-text="登录中..."> 
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="button" type="primary" @click="onLogin">登 录</el-button>
          <el-button class="button" type="info" @click="resetForm">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
#container {
  padding: 20%;
  background-image: url('@/assets/SchoolBac.jpg');
  background-size: cover;
  background-position: center;
}

.login-form {
  max-width: 400px;
  padding: 30px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: white;
}

.title {
  line-height: 50px;
  font-size: 30px;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  background-image: linear-gradient(to right, #b119c5, #45d7ff);
  -webkit-background-clip: text; /* 将背景裁剪为文字形状 */
  color: transparent; /* 文字颜色透明，显示背景 */
}

.button {
  margin-top: 30px;
  width: 120px;
}
</style>



