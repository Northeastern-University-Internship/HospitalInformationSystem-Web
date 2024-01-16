<template>
    <div>
      <div class="table-pane-1">
        <span class="table-title">Patients Awaiting Diagnosis</span><br>
        <el-table :data="undiagnosedList" height="300px" highlight-current-row @current-change="handleCurrentChangePatient">
          <el-table-column label="Invoice Number" prop="id"></el-table-column>
          <el-table-column label="Patient Name" prop="name"></el-table-column>
        </el-table>
      </div>
      <div class="table-pane-2">
        <span class="table-title">Patients Diagnosed</span><br>
        <el-table :data="diagnosedList" height="300px" highlight-current-row @current-change="handleCurrentChangePatient">
          <el-table-column label="Invoice Number" prop="id"></el-table-column>
          <el-table-column label="Patient Name" prop="name"></el-table-column>
        </el-table>
      </div>
      <div class="info-pane">
        <span class="table-title">Medical Record Front Page</span><br>
        <div class="patient-info">
          <span style="margin-right: 30px;">Record Number: {{patient.recordId}}</span>
          <span style="margin-right: 30px;">Patient Name: {{patient.name}}</span>
          <span style="margin-right: 30px;">Age: {{patient.age}}</span>
          <span style="margin-right: 30px;">Gender: {{patient.gender}}</span>
        </div>
        <div class="record-info">
          <span>Complaint:</span><br>
          <el-input v-model="record.complaint" type="textarea"></el-input>
          <span>Current Medical History:</span><br>
          <el-input v-model="record.diseaseLog" type="textarea"></el-input>
          <span>Allergy History:</span><br>
          <el-input v-model="record.allergicLog" type="textarea"></el-input>
          <span>Diagnosis Result:</span><br>
          <el-input v-model="record.diseases" style="width: 90%;"></el-input>
          <el-button type="primary" icon="el-icon-plus" circle size="small" plain @click="addDiseaseDrawer=true"></el-button><br>
          <span>Diagnostic Advice:</span><br>
          <el-input v-model="record.advice" type="textarea"></el-input><br>
        </div>
        <div class="record-operate">
          <el-button type="primary" @click="uploadRecord()">Submit Medical Record</el-button>
          <el-button type="primary" plain @click="newPage()">Start a New Page</el-button>
          <el-button type="danger" plain @click="init()">Refresh Page</el-button>
        </div>
        <el-drawer title="Add Disease" :visible.sync="addDiseaseDrawer" direction="btt" size="50%">
          <div class="disease-table">
            <el-table :data="diseases" height="300px" highlight-current-row @current-change="handleCurrentChangeDisease">
              <el-table-column label="International ICD Code" prop="icd"></el-table-column>
              <el-table-column label="Disease Code" prop="code"></el-table-column>
              <el-table-column label="Disease Name"prop="name"></el-table-column>
</el-table>
</div>
<div class="add-disease-pane">
<el-input v-model="diseaseCode" placeholder="Disease Code" style="width: 180px"></el-input>
<el-button type="primary" icon="el-icon-search" plain circle style="margin-right: 50px" @click="searchDisease(diseaseCode)">
</el-button>
<el-input v-model="diseaseName" placeholder="Add Disease" style="width: 180px"></el-input>
<el-button type="primary" icon="el-icon-check" plain circle @click="addDisease(diseaseName)"></el-button>
</div>
</el-drawer>
</div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Diagnose',
  data() {
    return {
      addDiseaseDrawer: false,
      undiagnosedList: [],
      diagnosedList: [],
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
      record: {
        order: null,
        id: null,
        complaint: null,
        diseaseLog: null,
        allergicLog: null,
        diseases: null,
        advice: null
      },
      registerFormId: null,
      diseases: [],
      diseaseCode: null,
      diseaseName: null,
      updated: false
    }
  },
  methods: {
    handleCurrentChangePatient(val) {
      this.registerFormId = val.id
      axios.post("/diagnose/search_reg", {id: val.id}).then((res)=>{
        if (res.data) {
          axios.post("/diagnose/search_patient", {id: res.data.patientId}).then((res)=>{
            if (res.data) {
              this.patient = res.data
              axios.post("/diagnose/search_rec", {id: res.data.recordId}).then((res)=>{
                if (res.data) this.record = res.data
                if (res.data.complaint == null) this.updated = true
              })
            }
          })
        }
      })
    },
    handleCurrentChangeDisease(val) {
      this.diseaseCode = val.code
      this.diseaseName = val.name
    },
    searchDisease(code) {
      var len = this.diseases.length
      for (var i=0; i<len; i++) {
        if (this.diseases[i].code == code) {
          this.diseaseName = this.diseases[i].name
          break
        }
      }
    },
    addDisease(name) {
      if (this.record.diseases == null) this.record.diseases = name
      else {
        this.record.diseases += "/"
        this.record.diseases += name
      }
      this.diseaseCode = null
      this.diseaseName = null
    },
    uploadRecord() {
      if (this.updated) {
        axios.post("/diagnose/insert", this.record)
axios.post("/diagnose", {id: this.registerFormId})
this.$message("Medical Record Submitted")
} else if (this.patient.id == null) {
this.$message("Please complete all information")
} else {
axios.post("/diagnose/update", this.record)
axios.post("/diagnose", {id: this.registerFormId})
this.$message("Medical Record Submitted")
}
},
newPage() {
this.updated = true
this.record.order += 1
this.record.complaint = null
this.record.diseaseLog = null
this.record.allergicLog = null
this.record.diseases = null
this.record.advice = null
},
init() {
axios.post("/diagnose/init_undia", {id: this.$store.state.user.id}).then((res)=>{
if (res.data) this.undiagnosedList = res.data
})
axios.post("/diagnose/init_diag", {id: this.$store.state.user.id}).then((res)=>{
if (res.data) this.diagnosedList = res.data
})
axios.post("/diagnose/init_disease").then((res)=>{
if (res.data) this.diseases = res.data
})
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
this.record = {
order: null,
id: null,
complaint: null,
diseaseLog: null,
allergicLog: null,
diseases: null,
advice: null
}
this.updated = false
this.diseaseCode = null
this.diseaseName = null
}
},
mounted() {
this.init()
}
}
</script>
<style scoped>
.table-pane-1 {
  width: 250px;
  height: 300px;
  text-align: center;
}
.table-pane-2 {
  width: 250px;
  height: 300px;
  text-align: center;
}
.info-pane {
  width: 60%;
  height: 80%;
  position: absolute;
  left: 550px;
  top: 130px;
}
.patient-info {
  width: 500px;
  height: 100px;
  position: absolute;
  top: 50px;
}
.record-info {
  width: 100%;
  height: 65%;
  position: absolute;
  top: 100px;
}
.record-operate {
  width: 100%;
  height: 20%;
  position: absolute;
  top: 550px;
}
.disease-table {
  width: 60%;
  height: 100%;
}
.add-disease-pane {
  width: 60%;
  height: 100%;
  position: absolute;
  top: 100px;
  left: 900px;
}
.table-title {
  color: #409EFF;
  font-size: 16px;
  font-weight: bold;
}
span {
  color: gray;
  font-size: 14px;
}
</style>


  