<template>
  <el-card class="alluser__container">
    <div slot="header">
      <span class="title">所有用户</span>
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
        :data="userList"
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
        <el-table-column prop="username" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="push_url" label="推流地址" width="300">
        </el-table-column>

        <el-table-column prop="email" label="邮箱" width="200">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.status == 1"
              >已启用</el-button
            >
            <el-button
              type="info"
              size="mini"
              plain
              v-if="scope.row.status == 0"
              >已禁用</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="220" sortable>
        </el-table-column>
        <el-table-column prop="updatedAt" label="上次登录" width="220" sortable>
        </el-table-column>
        <el-table-column
          prop="updatedAt"
          label="操作"
          width="340"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              style="margin-right: 10px"
              >重置密码</el-button
            >
            <el-button type="warning" size="mini" style="margin-right: 10px"
              >更改状态</el-button
            >

            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
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
import { getUserListApi } from "@/api/user";
export default {
  data() {
    return {
      searchForm: {
        username: "",
      },
      tableLoading: false,
      userList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    async getUserList() {
      this.tableLoading = true;
      const res = await getUserListApi({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.username,
      });
      this.tableLoading = false;
      if (res.code === 200) {
        this.userList = res.data.rows;
        this.total = res.data.count;
        console.log(this.userList);
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },

    onSubmit() {
      this.getUserList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getUserList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getUserList();
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style lang="scss" scoped>
.alluser__container {
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
