<template>
  <el-card class="userrecord__container">
    <div slot="header">
      <span class="title">用户记录</span>
    </div>
    <div class="main">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        class="main-search"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('searchFormRef')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="userRecordList"
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
        <el-table-column prop="username" label="用户名" width="320">
        </el-table-column>
        <el-table-column prop="type" label="操作记录" width="320">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.type == 1"
              >启用</el-button
            >
            <el-button type="info" size="mini" plain v-if="scope.row.type == 0"
              >禁用</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="处理原因"> </el-table-column>
        <el-table-column prop="createdAt" label="变更时间" width="320" sortable>
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
import { getUserRecordListApi } from "@/api/user";
export default {
  data() {
    return {
      searchForm: {
        username: "",
      },
      tableLoading: false,
      userRecordList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    // 表格
    async getUserRecordList() {
      this.tableLoading = true;
      const res = await getUserRecordListApi({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.username,
      });
      this.tableLoading = false;
      if (res.code === 200) {
        console.log(res);
        this.userRecordList = res.data.rows;
        this.total = res.data.count;
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },

    onSubmit() {
      this.getUserRecordList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getUserRecordList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserRecordList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getUserRecordList();
    },
  },
  mounted() {
    this.getUserRecordList();
  },
};
</script>

<style lang="scss" scoped>
.userrecord__container {
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
