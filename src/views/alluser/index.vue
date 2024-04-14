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
              @click="handleResetClick(scope.row.id)"
              style="margin-right: 10px"
              >重置密码</el-button
            >

            <el-button
              type="warning"
              size="mini"
              style="margin-right: 10px"
              @click="handleChangeClick(scope.row)"
              >更改状态</el-button
            >

            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteClick(scope.row.id)"
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
      <el-dialog
        title="密码重置"
        :visible.sync="resetDialogVisible"
        width="30%"
      >
        <span>确定重置密码吗？（默认密码123456）</span>
        <span slot="footer">
          <el-button @click="resetDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="resetSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="用户删除"
        :visible.sync="deleteDialogVisible"
        width="30%"
      >
        <span>确定删除用户吗？</span>
        <span slot="footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="状态变更"
        :visible.sync="changeDialogVisible"
        width="30%"
      >
        <el-input
          type="textarea"
          v-model="reason"
          placeholder="请输入原因"
        ></el-input>
        <span slot="footer">
          <el-button @click="changeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import {
  getUserListApi,
  resetPasswordApi,
  deleteUserApi,
  changeUserApi,
} from "@/api/user";

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

      // 重置密码
      resetId: 0,
      resetDialogVisible: false,
      // 删除用户
      deleteId: 0,
      deleteDialogVisible: false,
      // 变更
      changeId: 0,
      username: "",
      type: 0,
      reason: "",
      changeDialogVisible: false,
    };
  },
  methods: {
    // 表格
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

    // 重置密码
    handleResetClick(id) {
      this.resetId = id;
      this.resetDialogVisible = true;
    },

    async resetSubmit() {
      const res = await resetPasswordApi(this.resetId);
      if (res.code === 200) {
        this.$message({
          message: "重置密码成功",
          type: "success",
        });
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
      this.resetDialogVisible = false;
    },

    // 删除
    handleDeleteClick(id) {
      this.deleteId = id;
      this.deleteDialogVisible = true;
    },

    async deleteSubmit() {
      const res = await deleteUserApi(this.deleteId);
      if (res.code === 200) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getUserList();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
      this.deleteDialogVisible = false;
    },
    // 变更
    handleChangeClick(row) {
      this.changeId = row.id;
      this.username = row.username;
      if (row.status == 1) {
        this.type = 0;
      } else {
        this.type = 1;
      }
      this.changeDialogVisible = true;
    },

    async changeSubmit() {
      const res = await changeUserApi({
        user_id: this.changeId,
        username: this.username,
        type: this.type,
        reason: this.reason,
      });
      if (res.code === 200) {
        this.$message({
          message: "变更成功",
          type: "success",
        });
        this.reason = "";
        this.getUserList();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
      this.changeDialogVisible = false;
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
