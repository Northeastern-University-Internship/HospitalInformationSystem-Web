<template>
    <div class="window-charges">
      <el-row :gutter="20">
        <el-col :span="24">
          <h2>Window charges</h2>
        </el-col>
      </el-row>
  
      <el-row :gutter="20" class="search-section">
        <el-col :span="8">
          <el-input v-model="searchForm.medicalRecord" placeholder="Medical record"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchForm.name" placeholder="Name"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="searchPatients">search</el-button>
          <el-button @click="resetSearch">reset</el-button>
        </el-col>
      </el-row>
  
      <el-row :gutter="20" class="info-section">
        <el-col :span="24">
          <h3>patient information</h3>
          <el-form label-position="left" inline class="patient-info-form">
            <el-form-item label="Name">
              <el-input v-model="patientInfo.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="ID number">
              <el-input v-model="patientInfo.idNumber" readonly></el-input>
            </el-form-item>
            <el-form-item label="Gender">
              <el-select v-model="patientInfo.gender" readonly>
                <el-option label="Male" value="male"></el-option>
                <el-option label="Female" value="female"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Age">
              <el-input-number v-model="patientInfo.age" readonly></el-input-number>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
  
      <el-row :gutter="20" class="charges-section">
        <el-col :span="24">
          <el-checkbox-group v-model="selectedCharges">
            <el-table :data="chargesList" style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="projectName" label="project name"></el-table-column>
              <el-table-column prop="unitPrice" label="unit price"></el-table-column>
              <el-table-column prop="quantity" label="quantity"></el-table-column>
              <el-table-column prop="openingTime" label="Opening time"></el-table-column>
            </el-table>
          </el-checkbox-group>
          <el-row>
            <el-col :span="24" class="total-price">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Total price: {{ totalPrice }} yuan</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="submitCharges">Charge settlement</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchForm: {
          medicalRecord: '',
          name: ''
        },
        patientInfo: {
          name: 'Emran Hasan',
          idNumber: '20288024',
          gender: 'male',
          age: 27
        },
        chargesList: [
          // This should be populated with data from your backend
        ],
        selectedCharges: [],
        checkAll: false,
        isIndeterminate: false
      };
    },
    methods: {
      searchPatients() {
        // Implement the search logic here
      },
      resetSearch() {
        this.searchForm = {
          medicalRecord: '',
          name: ''
        };
      },
      handleCheckAllChange(val) {
        this.selectedCharges = val ? this.chargesList.map(item => item.id) : [];
        this.isIndeterminate = false;
      },
      submitCharges() {
        // Implement the charge submission logic here
      }
    },
    computed: {
      totalPrice() {
        // Calculate the total price of selected charges
        return this.selectedCharges.reduce((total, charge) => {
          const item = this.chargesList.find(item => item.id === charge);
          return total + (item ? item.unitPrice * item.quantity : 0);
        }, 0);
      }
    }
  };
  </script>
  
  <style scoped>
  .window-charges h2, .window-charges h3 {
    margin-bottom: 20px;
  }
  
  .patient-info-form .el-form-item {
    margin-right: 30px;
  }
  
  .total-price {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .charges-section .el-button {
    margin-top: 20px;
  }
  
  /* Add additional styles as needed */
  </style>
  