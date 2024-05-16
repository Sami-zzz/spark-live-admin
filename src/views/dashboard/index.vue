<template>
  <div class="dashboard">
    <el-row :gutter="30">
      <el-col :span="6">
        <div class="count-card">
          <div class="header">
            <span class="title">注册用户</span>
            <el-tooltip placement="top" effect="dark">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
          <div class="content">
            <span ref="count1Ref">{{ userCount }}</span>
          </div>
          <div class="footer">
            <span>注册用户数量</span>
            <span ref="count2Ref">{{ userCount }}</span>
          </div>
        </div></el-col
      >
      <el-col :span="6">
        <div class="count-card">
          <div class="header">
            <span class="title">历史直播</span>
            <el-tooltip placement="top" effect="dark">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
          <div class="content">
            <span ref="count3Ref">{{ historyCount }}</span>
          </div>
          <div class="footer">
            <span>历史直播数量</span>
            <span ref="count4Ref">{{ historyCount }}</span>
          </div>
        </div></el-col
      >
      <el-col :span="6">
        <div class="count-card">
          <div class="header">
            <span class="title">正在直播</span>
            <el-tooltip placement="top" effect="dark">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
          <div class="content">
            <span ref="count5Ref">{{ liveCount }}</span>
          </div>
          <div class="footer">
            <span>正在直播数量</span>
            <span ref="count6Ref">{{ liveCount }}</span>
          </div>
        </div></el-col
      >
      <el-col :span="6">
        <div class="count-card">
          <div class="header">
            <span class="title">所有送礼</span>
            <el-tooltip placement="top" effect="dark">
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
          <div class="content">
            <span ref="count7Ref">{{ orderCount }}</span>
          </div>
          <div class="footer">
            <span>送出礼物数量</span>
            <span ref="count8Ref">{{ orderCount }}</span>
          </div>
        </div></el-col
      >
    </el-row>
    <el-row :gutter="30" class="chart">
      <el-col :span="10">
        <el-card header="用户状态">
          <div id="status" class="card-content"></div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card header="送礼记录">
          <div id="order" class="card-content"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { CountUp } from "countup.js";
import { getCountApi, getUserGroupApi } from "@/api/user";
import { getOrderGroupApi } from "@/api/order";
import * as echarts from "echarts";
export default {
  name: "Dashboard",
  data() {
    return {
      userCount: 0,
      historyCount: 0,
      liveCount: 0,
      orderCount: 0,
    };
  },
  methods: {
    async getCount() {
      const res = await getCountApi();
      this.userCount = res.res[0];
      this.historyCount = res.res[1];
      this.liveCount = res.res[2];
      this.orderCount = res.res[3];
      this.countFun();
    },

    async getUserGroup() {
      const res = await getUserGroupApi();
      const data = res.res;
      let userchartdom = document.getElementById("status");
      let userChart = echarts.init(userchartdom);
      let option = {
        title: {
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: data[0].total, name: "启用状态" },
              { value: data[1].total, name: "封禁状态" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      userChart.setOption(option);
    },

    async getOrderGroup() {
      const res = await getOrderGroupApi();
      const data = res.res;
      function sortBy(props) {
        return function (a, b) {
          return a[props] - b[props];
        };
      }
      data.sort(sortBy("gift_id"));
      const namelist = data.map((item) => {
        return item.gift_name;
      });
      const totallist = data.map((item) => {
        return item.total;
      });

      let orderchartdom = document.getElementById("order");
      let orderChart = echarts.init(orderchartdom);

      let option = {
        xAxis: {
          type: "category",
          data: namelist,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: totallist,
            type: "bar",
          },
        ],
      };

      orderChart.setOption(option);
    },

    countFun() {
      const countup1 = new CountUp(this.$refs.count1Ref, this.userCount);
      const countup2 = new CountUp(this.$refs.count2Ref, this.userCount);
      const countup3 = new CountUp(this.$refs.count3Ref, this.historyCount);
      const countup4 = new CountUp(this.$refs.count4Ref, this.historyCount);
      const countup5 = new CountUp(this.$refs.count5Ref, this.liveCount);
      const countup6 = new CountUp(this.$refs.count6Ref, this.liveCount);
      const countup7 = new CountUp(this.$refs.count7Ref, this.orderCount);
      const countup8 = new CountUp(this.$refs.count8Ref, this.orderCount);
      countup1.start();
      countup2.start();
      countup3.start();
      countup4.start();
      countup5.start();
      countup6.start();
      countup7.start();
      countup8.start();
    },
  },
  mounted() {
    this.getCount();
    this.getUserGroup();
    this.getOrderGroup();
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  margin: 50px;
  .count-card {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    height: 130px;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .header {
      display: flex;
      height: 38px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      justify-content: space-between;
      align-items: flex-end;
    }

    .content {
      display: flex;
      align-items: center;
      flex: 1;
      margin-left: 0px;
      font-size: 26px;
      color: rgba(0, 0, 0, 0.85);
    }

    .footer {
      display: flex;
      height: 38px;
      line-height: 38px;
      font-size: 14px;
      letter-spacing: 1px;
      color: rgba(0, 0, 0, 0.85);
      border-top: 1px solid #f0f0f0;

      span {
        margin-right: 10px;
      }
    }
  }
  .chart {
    margin-top: 50px;

    .card-content {
      height: 380px;
    }
  }
}
</style>
