<template>
  <el-card class="live__container">
    <div slot="header">
      <span class="title">正在直播</span>
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
        :data="liveroomList"
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
        <el-table-column prop="title" label="直播标题" width="280">
        </el-table-column>
        <el-table-column prop="pull_url" label="拉流地址"> </el-table-column>
        <el-table-column prop="open_time" label="开播时间" width="280" sortable>
          <template slot-scope="scope">
            {{ parseTime(scope.row.open_time) }}
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
import { getLiveroomListApi } from "@/api/live";
import { parseTime } from "@/utils";
export default {
  data() {
    return {
      parseTime,
      searchForm: {
        username: "",
      },
      tableLoading: false,
      liveroomList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    // 表格
    async getLiveroomList() {
      this.tableLoading = true;
      const res = await getLiveroomListApi({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.username,
      });
      this.tableLoading = false;
      if (res.code === 200) {
        this.liveroomList = res.data.rows;
        this.total = res.data.count;
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },

    onSubmit() {
      this.getLiveroomList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getLiveroomList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLiveroomList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getLiveroomList();
    },
  },
  mounted() {
    this.getLiveroomList();
  },
};
</script>

<style lang="scss" scoped>
.live__container {
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
