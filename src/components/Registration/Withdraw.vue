<template>
    <div>
      <div>
        <el-input class="control-l" v-model="registerForm.id" placeholder="Invoice Number"></el-input>
        <el-button @click="searchRegisterFormById(registerForm.id)" icon="el-icon-search" circle></el-button>
      </div>
      <h3 style="color: gray;">Registration Information</h3><br>
      <div>
        <span>Patient Name:</span>
        <el-input class="control" v-model="patient.name" readonly></el-input>
        <span>Patient Gender:</span>
        <el-input class="control" v-model="patient.gender" readonly></el-input>
        <span>Identity Card Number:</span>
        <el-input class="control-xl" v-model="patient.id" readonly></el-input>
        <span>Department:</span>
        <el-input class="control" v-model="registerForm.department" readonly></el-input><br>
        <span>Consulting Physician:</span>
        <el-input class="control" v-model="registerForm.doctor" readonly></el-input>
        <span>Registration Level:</span>
        <el-input class="control" v-model="registerForm.level" readonly></el-input>
        <span>Current Status:</span>
        <el-input class="control" v-model="registerForm.diagnosed" readonly></el-input>
      </div>
      <div class="bottom">
        <span>Total Cost:</span>
        <el-input class="control" v-model="costAll" readonly></el-input>
        <el-button type="primary" @click="withdraw()">Confirm Withdrawal</el-button>
        <el-button type="primary" plain @click="init()">Refresh Page</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name: 'Withdraw',
    data() {
      return {
        registerForm: {
          id: null,
          patientId: null,
          department: null,
          doctor: null,
          level: null,
          recordNeeded: null,
          cost: null,
          diagnosed: null
        },
        patient: {
          id: null,
          name: null,
          gender: null,
          birth: null,
          age: null,
          addr: null,
          tel: null,
          recordId: null
        }
      }
    },
    methods: {
      searchRegisterFormById(registerFormId) {
        axios.post("/withdraw/search_reg", {id: registerFormId}).then((response)=>{
          if (response.data) {
            this.registerForm = response.data
            axios.post("/withdraw/search_patient", {id: response.data.patientId}).then((response)=>{
              if (response.data) this.patient = response.data
            })
          }
        })
      },
      withdraw() {
        if (this.registerForm.patientId == null) {
          this.$message("Please complete the information")
        } else if (this.registerForm.diagnosed == "Diagnosed") {
          this.$message("Withdrawal failed")
        } else {
          axios.post("/withdraw", {id: this.registerForm.id})
          this.$message("Withdrawal successful")
        }
      },
      init() {
        axios.post("/register/init_depart").then((response)=>{
          this.departments = response.data
        })
        axios.post("/withdraw/init_doc").then((response)=>{
          this.doctors = response.data
        })
  
        // Reset the form
        this.registerForm = {
          id: null,
          patientId: null,
          department: null,
          doctor: null,
          level: null,
          recordNeeded: null,
          cost: null,
          diagnosed: null
        }
        this.patient = {
          id: null,
          name: null,
          gender: null,
          birth: null,
          age: null,
          addr: null,
          tel: null,
          recordId: null
        }
      }
    },
    computed: {
      costAll() {
        // Compute the total cost
        if (this.registerForm.recordNeeded) return this.registerForm.cost - 1
        else return this.registerForm.cost
      }
    },
    mounted() {
      // Initialize the component
      this.init()
    }
  }
  </script>
  
  <style scoped>
  .bottom {
    height: 100px;
    width: 500px;
    position: absolute;
    bottom: 0px;
    right: 150px;
  }
  span {
    color: gray;
    font-size: 14px;
  }
  </style>
  