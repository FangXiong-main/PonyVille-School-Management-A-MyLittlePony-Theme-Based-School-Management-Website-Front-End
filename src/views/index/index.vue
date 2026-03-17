<script setup>

</script>

<template>
  <div class="container">
    <span class="title">欢迎使用PonyVilleSchool管理平台</span>
  </div>
  <div class="container" style="margin-top: 50px;">
    <span style="font-size: 20px;">精英教师团队</span>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="4">
        <el-card class="box-card">
          <img src="@/assets/ts.jpg" style="width: 100%;">
          <span class="name">Twilight Sparkle</span>
          <br>
          <span class="info">创建者及第一任校长</span>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <img src="@/assets/pp.jpg" style="width: 100%;">
          <span class="name">Pinke Pie</span>
          <br>
          <span class="info">欢笑课教师</span>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <img src="@/assets/fs.jpg" style="width: 100%;">
          <span class="name">Flutter Shy</span>
          <br>
          <span class="info">友善课教师</span>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <img src="@/assets/rd.jpg" style="width: 100%;">
          <span class="name">Rainbow Dash</span>
          <br>
          <span class="info">诚实课教师</span>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <img src="@/assets/rt.jpg" style="width: 100%;">
          <span class="name">Rarity</span>
          <br>
          <span class="info">慷慨课教师</span>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <img src="@/assets/aj.jpg" style="width: 100%;">
          <span class="name">Apple Jack</span>
          <br>
          <span class="info">忠诚课教师</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <img src="@/assets/School_of_Friendship_group_photo_S8E2.webp" style="width: 100%;">
  
</template>

<style scoped>
img{
  border-radius: 30px;
}
.box-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.image-container {
  flex: 1; /* 图片区域自动填充剩余空间 */
  width: 100%;
  overflow: hidden;
}

.name{
  font-size: 20px;
  margin: 30px 0;
  font-family: Georgia, 'Times New Roman', Times, serif;
}
.container{
  margin: 15px 0;
  text-align: center;
}
.title{
  font-size: 30px;
  font-weight: bold;
}
.info{
  font-size: 15px;
}
</style>