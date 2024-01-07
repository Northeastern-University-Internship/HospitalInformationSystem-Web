<template>
    <div>
      <div>
        <el-input class="control-xl" v-model="patient.id" placeholder="ID Number"></el-input>
        <el-button @click="searchPatientById(patient.id)" icon="el-icon-search" circle></el-button>
        <span style="position: absolute; right: 600px; top: 137px">Invoice Number:</span>
        <el-input class="control-l" style="position: absolute; right: 390px" v-model="registerForm.id"></el-input>
        <span style="position: absolute; right: 260px; top: 137px">Medical Record Number:</span>
        <el-input class="control-l" style="position: absolute; right: 50px" v-model="patient.recordId"></el-input><br>
      </div>
      <h3 style="color: gray;">Registration Information</h3><br>
      <div>
        <!-- First Row -->
        <span>Patient Name:</span>
        <el-input class="control" v-model="patient.name"></el-input>
        <span>Patient Gender:</span>
        <el-select class="control" v-model="patient.gender">
            <el-option label="Male" value="0"></el-option>
            <el-option label="Female" value="1"></el-option>
        </el-select>

        <!-- <el-select class="control" v-model="patient.gender">
          <el-option v-for="g in genders" :key="g.value" :label="g.label" :value="g.value"></el-option>
        </el-select> -->
        <span>Date of Birth:</span>
        <el-date-picker class="control" v-model="patient.birth" value-format="yyyy-MM-dd"></el-date-picker>
        <span>Patient Age:</span>
        <el-input class="control" v-model="patient.age"></el-input><br>
        <!-- Second Row -->
        <span>ID Number:</span>
        <el-input class="control-xl" v-model="patient.id"></el-input>
        <span>Address (Optional):</span>
        <el-input class="control-xl" style="width: 582px" v-model="patient.addr"></el-input><br>
        <!-- Third Row -->
        <span>Contact Number (Optional):</span>
        <el-input class="control-l" v-model="patient.tel" style="width: 223px;"></el-input>
        <span>Department:</span>
        <el-select class="control-xl" v-model="registerForm.departmentId" @change="handleChange(registerForm.departmentId)">
          <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id"></el-option>
        </el-select>
        <span>Consulting Physician:</span>
        <el-select class="control-xl" v-model="registerForm.doctorId">
          <el-option v-for="d in doctors" :key="d.id" :label="d.name" :value="d.id"></el-option>
        </el-select><br>
        <span>Registration Level:</span>
        <el-select class="control" v-model="registerForm.level">
          <el-option v-for="l in levels" :key="l.value" :label="l.label" :value="l.value"></el-option>
        </el-select>
        <!-- Fourth Row -->
        <span>Purchase Medical Record Book:</span>
        <el-radio v-model="registerForm.recordNeeded" label="false">No</el-radio>
        <el-radio v-model="registerForm.recordNeeded" label="true">Yes</el-radio>
      </div>
      <div class="bottom">
        <span>Total Cost:</span>
        <el-input class="control" v-model="costAll" readonly></el-input>
        <el-button type="primary" @click="register()">Confirm Registration</el-button>
        <el-button type="primary" plain @click="init()">Refresh Page</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name: 'Register',
    data() {
      return {
        // Gender Constants
        genders: [
          { label: "Male", value: 0 },
          { label: "Female", value: 1 }
        ],
        // Department List
        departments: [],
        // Doctors List for the Selected Department
        doctors: [],
        // Registration Level Constants
        levels: [
          { label: "General", value: 1 },
          { label: "Emergency", value: 2 },
          { label: "Specialist", value: 3 }
        ],
        // Form Data for Registration
        registerForm: {
          id: null,
          patientId: null,
          departmentId: null,
          doctorId: null,
          level: null,
          recordNeeded: null,
          cost: null,
          state: false
        },
        // Patient Data
        patient: {
          name: null,
          gender: null,
          birth: null,
          age: null,
          id: null,
          addr: null,
          tel: null,
          recordId: null
        }
      }
    },
    methods: {
      searchPatientById(patientId) {
        axios.post("/register/search_patient", { id: patientId }).then((res)=>{
          if (res.data) this.patient = res.data
        })
      },
      handleChange(departmentId) {
        axios.post("/register/doc_depart", { id: departmentId }).then((res)=>{
          this.doctors = res.data
        })
      },
      register() {
        if (!this.isFormComplete()) {
          this.$message("Please complete all required fields.")
          return
        }
        this.registerForm.patientId = this.patient.id
        this.registerForm.cost = this.costAll
        axios.post("/register/save_patient", this.patient)
        axios.post("/register", this.registerForm)
        this.$message("Registration successful")
      },
      isFormComplete() {
        return Object.values(this.registerForm).every(val => val != null) &&
               Object.values(this.patient).every(val => val != null)
      },
      init() {
        // Initialize registration and patient form
        axios.post("/register/init_rigid").then((res) => {
          this.registerForm.id = res.data
        })
        axios.post("/register/init_ricid").then((res) => {
          this.patient.recordId = res.data
        })
        axios.post("/register/init_depart").then((res) => {
          this.departments = res.data
        })
        this.doctors = []
        this.resetForm()
      },
      resetForm() {
        this.registerForm = { ...this.initialFormState.registerForm }
        this.patient = { ...this.initialFormState.patient }
      }
    },
    computed: {
      costAll: function() {
        let cost = Math.pow(this.registerForm.level, 2) * 5
        if (this.registerForm.recordNeeded === "true") cost += 1
        return cost
      }
    },
    mounted() {
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
  