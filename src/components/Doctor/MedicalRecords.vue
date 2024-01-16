<template>
    <div class="medical-records">
      <div class="statistics-panel">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
              <div class="clearfix">
                <span class="statistics-title">Patients Seen Today</span>
                <span class="statistics-value">{{ statistics.todayPatients }}</span>
</div>
</el-card>
</el-col>
<el-col :span="8">
<el-card>
<div class="clearfix">
<span class="statistics-title">Currently in Line</span>
<span class="statistics-value">{{ statistics.currentlyInLine }}</span>
</div>
</el-card>
</el-col>
<el-col :span="8">
<el-input v-model="searchQuery"
         placeholder="Enter patient ID or name to search for patients"
         class="search-input"
       >
<el-button slot="append" icon="el-icon-search"></el-button>
</el-input>
</el-col>
</el-row>
</div>

<el-table :data="medicalRecords" style="width: 100%">
  <el-table-column prop="name" label="Patient Name"></el-table-column>
  <el-table-column prop="symptomDescription" label="Symptom Description"></el-table-column>
  <el-table-column prop="state" label="State">
    <template slot-scope="{row}">
      <el-tag :type="getStateTagType(row.state)">{{ row.state }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column prop="date" label="Date"></el-table-column>
  <el-table-column label="Operate">
    <template slot-scope="{row}">
      <el-button @click="updateMedicalRecord(row)">Update Medical Records</el-button>
   
    </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
  <el-pagination
    @current-change="handlePageChange"
    :current-page="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next, jumper"
    :total="totalRecords">
  </el-pagination>
</div>
</div>