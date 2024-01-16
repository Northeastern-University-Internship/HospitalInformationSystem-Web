<template>
    <div>
      <div>
        <el-input class="control-xl" v-model="patient.id" placeholder="Identity Card Number"></el-input>
        <el-button type="primary" icon="el-icon-search" plain circle @click="searchAffairs(patient.id)"></el-button><br>
      </div>
      <div class="main">
        <span>Name:</span>
        <el-input class="control" v-model="patient.name" readonly></el-input>
        <span>Gender:</span>
        <el-input class="control" v-model="patient.gender" readonly></el-input>
        <span>Age:</span>
        <el-input class="control" v-model="patient.age" readonly></el-input>
      </div>
      <div>
        <el-table :data="affairs" height="350px" style="margin-left: 30px; margin-right: 30px; width: 90%;" @selection-change="handleSelection">
          <el-table-column type="selection" :selectable="checkSelectable"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="Refund Item ID" prop="id"></el-table-column>
          <el-table-column label="Refund Item Name" prop="name"></el-table-column>
          <el-table-column label="Quantity" prop="num"></el-table-column>
          <el-table-column label="Total Price" prop="cost"></el-table-column>
          <el-table-column label="Payment Status" prop="paid"></el-table-column>
          <el-table-column label="State" prop="state"></el-table-column>
        </el-table>
      </div>
      <div class="foot">
        <span>Total Refund:</span>
        <el-input class="control" v-model="costAll" readonly></el-input>
        <el-button type="primary" plain @click="refund()">Refund Settlement</el-button>
        <el-button type="warning" plain @click="cancel()">Cancel Refund</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios"
  export default {
    name: 'Refund',
    data() {
      return {
        patient: {
          id: null,
          name: null,
          gender: null,
          birth: null,
          age: null,
          addr: null,
          tel: null,
          recordId: null
        },
        affairs: [],
        selected: [],
        costAll: 0
      }
    },
    methods: {
      searchAffairs(patientId) {
        axios.post("/fin/get_patient", {id: patientId}).then((response)=>{
          this.patient = response.data
        })
        axios.post("/fin/affair", {id: patientId}).then((response)=>{
          this.affairs = response.data
        })
      },
      checkSelectable(row) {
        if (row.paid == "Unpaid" || row.state == "Medicine Issued") return false;
        else return true;
      },
      handleSelection(val) {
        this.selected = val
        this.costAll = 0
        var len = val.length
        for (var i=0; i<len; i++) {
          this.costAll += val[i].cost
        }
      },
      refund() {
        if (this.patient.name == null) {
          this.$message("Please complete the information")
        } else {
          axios.post("/refund", {affairs: this.selected})
          this.cancel()
          this.$message("Refund Successful")
        }
      },
      cancel() {
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
        this.affairs = []
        this.selected = []
        this.costAll = 0
      }
    }
  }
  </script>
  
  <style scoped>
  .main {
    margin-top: 30px;
    margin-left: 30px;
  }
  .foot {
    margin-top: 50px;
    margin-left: 30px;
  }
  span {
    color: gray;
    font-size: 14px;
  }
  </style>
  