<script setup>
import * as echarts from 'echarts';
import { onMounted,ref } from 'vue';
import {queryJobCountApi,queryGenderCountApi} from '@/api/report.js'
let JobchartDom
let JobChart
let JobOption;
let sexOption;
let sexChartDom;
let sexChart;
const jobList = ref();
const jobListData = ref();
const sexListData = ref();
const jobLoading = ref(false);
const sexLoading = ref(false);
JobOption = {
  color:[
    '#FF0096',
    '#FF64FF'
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '人数',
      type: 'bar',
      barWidth: '60%',
      data: []
    }
  ]
};
sexOption= {
  color:[
    '#FF0096',
    '#FF64FF'
  ],
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: '员工性别数量',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '70%'],
      // adjust the start and end angle
      startAngle: 180,
      endAngle: 360,
      data: []
    }
  ]
};
const initChart = (chart)=>{
  echarts.init(chart);
}
const getJobData = async ()=>{ 
  jobLoading.value = true;
  const result = await queryJobCountApi();
  if(result.code){
    jobList.value = result.data.jobList;
    jobListData.value = result.data.dataList;
    JobChart.setOption({
      xAxis: {
        data: jobList.value
      },
      series: [{
        data: jobListData.value
      }]
    });
    jobLoading.value = false;
  }
}
const getSexData = async ()=>{ 
  sexLoading.value = true;
  const result = await queryGenderCountApi();
  if(result.code){
    sexListData.value = result.data;
    sexChart.setOption({
      series: [{
        data: sexListData.value
      }]
    });
    sexLoading.value = false;
  }
}
onMounted(() => {
  getJobData();
  getSexData();
  JobchartDom = document.getElementById('job');
  JobChart = echarts.init(JobchartDom);
  sexChartDom = document.getElementById('sex');
  sexChart = echarts.init(sexChartDom);
  JobChart.setOption(JobOption);
  sexChart.setOption(sexOption);
})



</script>

<template>
  <div class="container">
    <h1>员工信息统计</h1>
  </div>
  <el-row :gutter="20">
    <el-col :span="24" >
      <div class="title" align="center">各职位员工数量</div>
      <div id="job" style="width: 100%;height:600px;" v-loading="jobLoading" element-loading-text="加载中..."/>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24" >
      <div class="title" align="center">各性别员工数量</div>
      <div id="sex" style="width: 100%;height:600px;" v-loading="sexLoading" element-loading-text="加载中..."/>
    </el-col>
  </el-row>
</template>

<style scoped>
.container{
  margin: 20px 0px;
}
.title{
  margin-top: 60px;
  font-size: 16px;
}
</style>