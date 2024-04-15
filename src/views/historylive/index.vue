<template>
  <el-card class="history__container">
    <div slot="header">
      <span class="title">历史直播</span>
    </div>
    <div class="main">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        class="main-search"
      >
        <el-form-item label="主播名" prop="username">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入主播名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('searchFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="historyLiveList"
        v-loading="tableLoading"
        class="main-table"
        :cell-style="{
          height: '60px',
          fontSize: '16px',
        }"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          height: '60px',
          fontSize: '16px',
        }"
      >
        <el-table-column prop="user_name" label="主播名" width="220">
        </el-table-column>
        <el-table-column prop="title" label="直播标题" width="200">
        </el-table-column>
        <el-table-column prop="pull_url" label="拉流地址"> </el-table-column>
        <el-table-column label="直播时长" width="280" sortable>
          <template slot-scope="scope">
            {{ calculateTime(scope.row.open_time, scope.row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="open_time" label="开播时间" width="280" sortable>
          <template slot-scope="scope">
            {{ parseTime(scope.row.open_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="关播时间" width="280" sortable>
          <template slot-scope="scope">
            {{ parseTime(scope.row.end_time) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="main-footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getHistoryLiveListApi } from "@/api/live";
import { parseTime } from "@/utils";
export default {
  data() {
    return {
      parseTime,
      searchForm: {
        username: "",
      },
      tableLoading: false,
      historyLiveList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    // 表格
    calculateTime(begin, end) {
      var dateBegin = new Date(Number(begin));
      var dateEnd = new Date(Number(end));
      var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
      //计算相差秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      return `${dayDiff}天${hours}小时${minutes}分${seconds}秒`;
    },
    async getHistoryLiveList() {
      this.tableLoading = true;
      const res = await getHistoryLiveListApi({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.username,
      });
      this.tableLoading = false;
      if (res.code === 200) {
        this.historyLiveList = res.data.rows;
        this.total = res.data.count;
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },

    onSubmit() {
      this.getHistoryLiveList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getHistoryLiveList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getHistoryLiveList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getHistoryLiveList();
    },
  },
  mounted() {
    this.getHistoryLiveList();
  },
};
</script>

<style lang="scss" scoped>
.history__container {
  margin: 30px;
  .title {
    font-size: 20px;
    font-weight: 800;
    color: #666;
  }
  .main {
    padding: 30px;
    width: 100%;
    .main-search {
      float: right;
    }
    .main-table {
      width: 100%;
      .table_cell {
        height: 100px;
      }
    }
    .main-footer {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
