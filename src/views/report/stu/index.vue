<script setup>
import * as echarts from 'echarts';
import { onMounted,ref } from 'vue';
import {initChart} from '@/utils/initChart.js';
import {queryDegreeCountApi,queryClazzCountApi} from '@/api/report.js'
let stuChartDom;
let stuChart;
let stuOption;
let clazzChartDom;
let clazzChart;
let clazzOption;
const stuDegreeCount = ref([]);
const clazzCountList = ref([]);
const clazzList = ref([]);
const stuLoading = ref(false);
const clazzLoading = ref(false);
clazzOption = {
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
      name: '学生人数',
      type: 'bar',
      barWidth: '60%',
      data: [],
      color: '#FFA500'
    }
  ]
};
stuOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: '该学历人数',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
};
const getClazzData = async ()=>{
  clazzLoading.value = true;
  const result = await queryClazzCountApi();
  if(result.code){
    clazzCountList.value = result.data.dataList;
    clazzList.value = result.data.clazzList;
    clazzChart.setOption({
      xAxis: {
        data: clazzList.value
      },
      series: [{
        data: clazzCountList.value
      }]
    })
    clazzLoading.value = false;
  }
}
const getStuData = async ()=>{ 
  stuLoading.value = true;
  const result = await queryDegreeCountApi();
  if(result.code){
    stuDegreeCount.value = result.data;
    stuChart.setOption({
      series: [{
        data: stuDegreeCount.value
      }]
    });
    stuLoading.value = false;
  }
}
onMounted(()=>{
  getStuData();
  getClazzData();
  stuChartDom = document.getElementById('stuChar');
  stuChart= initChart(stuChartDom);
  stuChart.setOption(stuOption);
  clazzChartDom = document.getElementById('clazzChar');
  clazzChart= initChart(clazzChartDom);
  clazzChart.setOption(clazzOption);
})
</script>

<template>
  <div class="container">
    <h1>学员信息统计</h1>
  </div>
  <el-row  :gutter="20">
    <el-col :span="24">
      <div class="title" align="center">各班级学生数量</div>
      <div id="clazzChar" style="width: 100%;height:600px;" v-loading="clazzLoading" element-loading-text="加载中..."/>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <div class="title" align="center">各学历学生数量</div>
      <div id="stuChar" style="width: 100%;height:600px;" v-loading="stuLoading" element-loading-text="加载中..."/>
    </el-col>
  </el-row>
</template>

<style scoped>
.container{
  margin: 20px 0;
}
.title{
  margin-top: 60px;
  font-size: 16px;
}
</style>