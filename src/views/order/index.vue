<template>
  <el-card class="order__container">
    <div slot="header">
      <span class="title">所有打赏</span>
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
        <el-form-item label="主播名" prop="livename">
          <el-input
            v-model="searchForm.livename"
            placeholder="请输入主播名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('searchFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="orderList"
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
        <el-table-column prop="order_number" label="编号" width="320">
        </el-table-column>
        <el-table-column prop="user_name" label="用户名" width="220">
        </el-table-column>
        <el-table-column prop="live_name" label="主播名" width="220">
        </el-table-column>
        <el-table-column prop="gift_name" label="礼物" width="220">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="220" sortable>
          <template slot-scope="scope"> {{ scope.row.price }} 金币 </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="打赏时间" sortable>
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
import { getOrderListApi } from "@/api/order";
export default {
  data() {
    return {
      searchForm: {
        username: "",
        livename: "",
      },
      tableLoading: false,
      orderList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    // 表格
    async getOrderList() {
      this.tableLoading = true;
      const res = await getOrderListApi({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        user_name: this.searchForm.username,
        live_name: this.searchForm.livename,
      });
      this.tableLoading = false;
      if (res.code === 200) {
        this.orderList = res.data.rows;
        this.total = res.data.count;
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },

    onSubmit() {
      this.getOrderList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getOrderList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getOrderList();
    },
  },
  mounted() {
    this.getOrderList();
  },
};
</script>

<style lang="scss" scoped>
.order__container {
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
