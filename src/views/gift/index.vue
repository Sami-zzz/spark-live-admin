<template>
  <el-card class="gift__container">
    <div slot="header">
      <span class="title">所有礼物</span>
    </div>
    <div class="main">
      <el-table
        :data="giftList"
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
        <el-table-column prop="gift_name" label="礼物名" width="320">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="320" sortable>
          <template slot-scope="scope"> {{ scope.row.price }} 金币 </template>
        </el-table-column>
        <el-table-column prop="info" label="备注"> </el-table-column>
        <el-table-column prop="createdAt" sortable label="创建时间" width="320">
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
import { getGiftListApi } from "@/api/order";
export default {
  data() {
    return {
      tableLoading: false,
      giftList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    // 表格
    async getGiftList() {
      this.tableLoading = true;
      const res = await getGiftListApi({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      });
      this.tableLoading = false;
      if (res.code === 200) {
        this.giftList = res.data.rows;
        this.total = res.data.count;
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },

    onSubmit() {
      this.getGiftList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getGiftList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGiftList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getGiftList();
    },
  },
  mounted() {
    this.getGiftList();
  },
};
</script>

<style lang="scss" scoped>
.gift__container {
  margin: 30px;
  .title {
    font-size: 20px;
    font-weight: 800;
    color: #666;
  }
  .main {
    padding: 30px;
    width: 100%;
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
