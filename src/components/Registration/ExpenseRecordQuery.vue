<template>
    <div class="expense-record-query">
      <el-row type="flex" class="search-row">
        <el-col :span="8">
          <el-input v-model="searchForm.medicalRecord" placeholder="Medical record number"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchForm.name" placeholder="Name"></el-input>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="searchForm.timeLimit"
            type="daterange"
            range-separator="to"
            start-placeholder="Start date"
            end-placeholder="End date">
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-select v-model="searchForm.feeStatus" placeholder="Fee status">
            <el-option label="Not charged" value="not_charged"></el-option>
            <!-- Add other options here -->
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button @click="search">Search</el-button>
          <el-button @click="reset">Reset</el-button>
        </el-col>
      </el-row>
  
      <el-table :data="patientCostInfo" style="width: 100%">
        <el-table-column prop="medicalRecordNumber" label="Medical record number"></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="consumerName" label="Consumer name"></el-table-column>
        <el-table-column prop="unitPrice" label="Unit price"></el-table-column>
        <el-table-column prop="quantity" label="Quantity"></el-table-column>
        <el-table-column prop="feeStatus" label="Fee status"></el-table-column>
        <el-table-column prop="settlementMethod" label="Settlement method"></el-table-column>
        <el-table-column prop="operatingTime" label="Operating time"></el-table-column>
      </el-table>
  
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchForm: {
          medicalRecord: '',
          name: '',
          timeLimit: '',
          feeStatus: ''
        },
        patientCostInfo: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
    },
    methods: {
      search() {
        // Implement search logic here
      },
      reset() {
        // Reset search form and data
      },
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.search();
      },
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
        this.search();
      }
    },
    mounted() {
      // Fetch initial data here
    }
  };
  </script>
  
  <style scoped>
  .expense-record-query .search-row {
    margin-bottom: 20px;
  }
  
  /* Add additional styles as needed */
  </style>
  