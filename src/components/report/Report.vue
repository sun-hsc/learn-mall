<template>
  <div class="report">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为Echarts准备一个Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//     echarts使用 npm install echarts --save 安装echarts组件库并导入
/**
 * 1. 创建需要展示图表的容器
 * 2. 通过id获取容器对其进行 echarts.init()初始化图表实例
 * 3. 根据echarts图表提供的格式对需要渲染到图表的数据进行处理
 * 4. 调用 myChart.setOption(obj) 函数对配置好的object对象数据即可渲染
 */
// 引入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
/**  Lodash 通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。
 *   Lodash 的模块化方法 非常适用于：
 *  遍历 array、object 和 string,对值进行操作和检测,创建符合功能的函数
 */
export default {
  components: {},
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
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
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  //  页面渲染完毕后的回调函数
  mounted() {
    this.getEcharts()
  },
  methods: {
    async getEcharts() {
      // 3.基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message('获取折线图数据失败!')
      // 4.准备数据项和配置项
      // 指定图表的配置项和数据
      /**
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [15, 20, 36, 10, 10, 20]
          }
        ]
      }
       */
      // 数据合并
      const result = _.merge(res.data, this.options)
      // 5.展示数据
      myChart.setOption(result)
    }
  }
}
</script>

<style lang="less" scoped></style>
