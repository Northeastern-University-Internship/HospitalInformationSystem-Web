<template>
  <div>
    <div>complete the examination</div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  Search Type<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">name</el-dropdown-item>
                  <el-dropdown-item command="b">Medical record number</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-form :model="searchPatient" :rules="searchPatientRules" ref="searchPatient">
                <el-form-item :prop="prop">
                  <el-input v-if="searchByName===true" v-model="searchPatient.RealName" placeholder="Please enter the patient's name to inquire." style="width: 200px;margin-right: 10px" prefix-icon="el-icon-question" clearable></el-input>
                  <el-input v-else v-model="searchPatient.CaseNumber" placeholder="Please enter the patient's medical record number to inquire" style="width: 200px;margin-right: 10px" prefix-icon="el-icon-question" clearable></el-input>
                  <el-button-group>
                    <el-button icon="el-icon-search" size="small" type="primary" @click="search('searchPatient')">Search</el-button>
                    <el-button icon="el-icon-refresh" size="small" type="info" @click="reset('searchPatient')">Reset</el-button>
                  </el-button-group>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-divider content-position="left"></el-divider>
            </div>
            <el-empty description="No patient selected." v-if="!isChoose"></el-empty>
            <el-collapse-transition>
              <div v-show="isChoose">
                <el-descriptions size="mini" title="Basic patient information" direction="vertical" :column="4" border>
                  <el-descriptions-item label="name" :span="2">{{choosedPatient.RealName}}</el-descriptions-item>
                  <el-descriptions-item label="Medical record number" :span="2">{{choosedPatient.CaseNumber}}</el-descriptions-item>
                  <el-descriptions-item label="gender" :span="2" v-if="choosedPatient.Gender===71"><el-tag type="success">m</el-tag></el-descriptions-item>
                  <el-descriptions-item label="gender" :span="2" v-else><el-tag type="warning">f</el-tag></el-descriptions-item>
                  <el-descriptions-item label="age" :span="2">{{choosedPatient.Age}}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-collapse-transition>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div>
            <span>Pending patient</span>
            <el-table :data="patientData"
                      stripe
                      border
                      :default-sort = "{prop: 'date', order: 'descending'}"
                      v-loading="loading"
                      max-height="250"
                      min-height="250"
                      element-loading-text="loading"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                      style="width: 100%">
              <el-table-column align="center" prop="caseNumber" label="Medical record number" style="width: 25%"></el-table-column>
              <el-table-column align="center" prop="realName" label="name" style="width: 25%"></el-table-column>
              <el-table-column align="center" prop="age" label="age" style="width: 25%"></el-table-column>
              <el-table-column align="center" fixed="right" label="operate" style="width: 25%">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="Select this patient and confirm completion." placement="right">
                    <el-button type="text" size="mini" @click="choosePatient(scope.row)">Select</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end">
              <el-pagination
                  background
                  @current-change="currentChangeForPatient"
                  @size-change="sizeChangeForPatient"
                  :page-size="pageSizeForPatient"
                  :current-page.sync="currentPageForPatient"
                  layout="prev, pager, next, jumper, ->, total, slot"
                  :total="patients.length">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <el-empty description="No patient selected" v-if="!isChoose"></el-empty>
            <el-collapse-transition>
              <div v-show="isChoose">
                <el-descriptions size="mini" title="Patient history information" direction="vertical" :column="8" border>
                  <el-descriptions-item label="ID" :span="3">{{medicalRecord.ID}}</el-descriptions-item>
                  <el-descriptions-item label="Medical record number" :span="3">{{medicalRecord.CaseNumber}}</el-descriptions-item>
                  <el-descriptions-item label="registered number" :span="3">{{medicalRecord.RegistID}}</el-descriptions-item>
                  <el-descriptions-item label="main complaint" :span="3">{{medicalRecord.Readme}}</el-descriptions-item>
                  <el-descriptions-item label="current medical history" :span="3">{{medicalRecord.Present}}</el-descriptions-item>
                  <el-descriptions-item label="Treatment of current disease" :span="3">{{medicalRecord.PresentTreat}}</el-descriptions-item>
                  <el-descriptions-item label="past history" :span="3">{{medicalRecord.History}}</el-descriptions-item>
                  <el-descriptions-item label="History of allergies" :span="3">{{medicalRecord.Allergy}}</el-descriptions-item>
                  <el-descriptions-item label="Medical examination" :span="3">{{medicalRecord.Physique}}</el-descriptions-item>
                  <el-descriptions-item label="Inspection recommendations" :span="3"><el-tag effect="dark" size="mini" type="success">{{medicalRecord.Proposal}}</el-tag></el-descriptions-item>
                  <el-descriptions-item label="Precautions" :span="3"><el-tag effect="dark" size="mini" type="warning">{{medicalRecord.Careful}}</el-tag></el-descriptions-item>
                  <el-descriptions-item label="Inspection results" :span="3"><el-tag effect="dark" size="mini" type="danger">{{medicalRecord.CheckResult}}</el-tag></el-descriptions-item>
                  <el-descriptions-item label="Diagnostic results" :span="3"><el-tag effect="dark" size="mini" type="danger">{{medicalRecord.Diagnosis}}</el-tag></el-descriptions-item>
                  <el-descriptions-item label="Disposition of opinions" :span="3"><el-tag effect="dark" size="mini" type="primary">{{medicalRecord.Handling}}</el-tag></el-descriptions-item>
                  <el-descriptions-item label="medical record status" :span="3" v-if="medicalRecord.CaseState === 1">
                    <el-tag  effect="dark" size="mini" type="primary">temporary deposit</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="病历状态" :span="3" v-else-if="medicalRecord.CaseState === 2">
                    <el-tag  effect="dark" size="mini" type="success">Submitted</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="病历状态" :span="3" v-else>
                    <el-tag  effect="dark" size="mini" type="danger">complete the examination</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
                <el-popover
                    placement="top"
                    width="160"
                    v-model="endVisible">
                  <p>Are you sure you're done?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="endVisible = false" icon="el-icon-close">Cancel</el-button>
                    <el-button size="mini" type="danger" @click="commitEnd" icon="el-icon-check">Submit</el-button>
                  </div>
                  <el-button slot="reference" size="large" :disabled="medicalRecord.CaseState === 3" style="text-align: center; margin-left: 500px" type="danger" icon="el-icon-aim">诊毕</el-button>
                </el-popover>
              </div>
            </el-collapse-transition>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "AfterDiagnosis",
  data() {
    return {
      prop: 'RealName',
      presentUser: {},
      searchByName: true,
      searchPatient: {
        RealName: '',
        CaseNumber: '',
        DeptID: null,
        UserID: null,
      },
      searchPatientRules: {
        RealName: [{required: true, message: 'Please enter your name', trigger: 'blur'}],
        CaseNumber: [{required: true, message: 'Please enter your medical record number', trigger: 'blur'}]
      },
      loading: false,
      isChoose: false,
      choosedPatient: {
        RealName: '',
        CaseNumber: '',
        Gender: '',
        Age: '',
      },
      patients: [],
      currentPageForPatient: 1,
      pageSizeForPatient: 5,
      medicalRecord: {
        ID: '',
        CaseNumber: '',
        RegistID: '',
        Readme: '',
        Present: '',
        PresentTreat: '',
        History: '',
        Allergy: '',
        Physique: '',
        Proposal: '',
        Careful: '',
        CheckResult: '',
        Diagnosis: '',
        Handling: '',
        CaseState: 1,
      },
      endVisible: false,

    }
  },
  mounted() {
    this.initUser();
    this.initPatient();
  },
  computed: {
    patientData() {
      console.log("patients.length = ", this.patients.length);
      if (this.patients.length > 0) {
        return this.patients.slice( (this.currentPageForPatient -1) * this.pageSizeForPatient, this.currentPageForPatient * this.pageSizeForPatient) || [];
      }
      console.log("patients = ", this.patients);
      return this.patients;
    },
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') {
        this.searchByName = true;
        this.prop = 'RealName';
      } else {
        this.searchByName = false;
        this.prop = 'CaseNumber';
      }
      this.$message('searchByName = ' + this.searchByName);
    },
    search(ruleForm) {
      let url = '';
      let param = null;
      let user = JSON.parse(localStorage.getItem("User"));
      console.log("user = ", user);
      this.searchPatient.UserID = user.id;
      this.searchPatient.DeptID = user.deptID;
      if (this.searchByName === true) {
        console.log("11");
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            url = '/outpatientDoctorWorkStation/afterDiagnosis/searchByName';
            param = this.$qs.stringify(this.searchPatient);
            console.log("Search for patients:", this.searchPatient);
            this.$axios.post(url, param).then(res => {
              console.log("Medical Records Search Results:", res);
              this.patients = res.data.data;
            })
          }
        })
      } else {
        console.log("22");
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            url = '/outpatientDoctorWorkStation/afterDiagnosis/searchByNumber';
            param = this.$qs.stringify(this.searchPatient);
            console.log("Search for patients:", this.searchPatient);
            this.$axios.post(url, param).then(res => {
              console.log("Name Search Results:", res);
              this.patients = res.data.data;
            })
          }
        })
      }
    },
    reset(ruleForm) {
      this.$refs[ruleForm].resetFields();
      this.initPatient();
    },
    initUser() {
      console.log("presentUser.id: ", this.presentUser.id);
      this.presentUser = JSON.parse(localStorage.getItem("User"));
      console.log("Initialization of Doctor:", this.presentUser);
    },
    initPatient() {
      this.loading = true;
      let url = '/outpatientDoctorWorkStation/afterDiagnosis/initPatients';
      let param = JSON.parse(localStorage.getItem("User"));
      this.$axios.post(url, param).then(res => {
        this.loading = false;
        console.log("For all patients waiting:", res);
        this.patients = res.data.data;
      })
    },
    choosePatient(row) {
      console.log("Selected patients:", row);
      this.$nextTick(() => {
        this.isChoose = true;
        this.choosedPatient.RealName = row.realName;
        this.choosedPatient.CaseNumber = row.caseNumber;
        this.choosedPatient.Gender = row.gender;
        this.choosedPatient.Age = row.age;
      })

      this.medicalRecord.CaseNumber = row.caseNumber;
      this.medicalRecord.RegistID = row.id;
      this.initRecord(row.caseNumber);

    },
    sizeChangeForPatient(currentSize) {
      this.pageSizeForPatient = currentSize;
      this.initPatient();
    },
    currentChangeForPatient(currentPage) {
      this.currentPageForPatient = currentPage;
      this.initPatient();
    },
    initRecord(number) {
      let url = '/outpatientDoctorWorkStation/afterDiagnosis/initRecord';
      let param = {
        CaseNumber: number,
      }
      console.log("number = ", number);
      console.log("param = ", param);
      this.$axios.post(url, this.$qs.stringify(param)).then(res => {
        console.log("Initialize medical record information:", res);
        if (res.data.data) {
          this.medicalRecord.ID = res.data.data.id;
          this.medicalRecord.Readme = res.data.data.readme;
          this.medicalRecord.Present = res.data.data.present;
          this.medicalRecord.PresentTreat = res.data.data.presentTreat;
          this.medicalRecord.History = res.data.data.history;
          this.medicalRecord.Allergy = res.data.data.allergy;
          this.medicalRecord.Physique = res.data.data.physique;
          this.medicalRecord.Proposal = res.data.data.proposal;
          this.medicalRecord.Careful = res.data.data.careful;
          this.medicalRecord.CheckResult = res.data.data.checkResult;
          this.medicalRecord.Diagnosis = res.data.data.diagnosis;
          this.medicalRecord.Handling = res.data.data.handling;
          this.medicalRecord.CaseState = res.data.data.caseState;
        }

      })
    },
    commitEnd() {
      this.endVisible = false;
      console.log("Patients who are about to be diagnosed:", this.choosedPatient);
      console.log("Medical records to be completed:", this.medicalRecord);
      let url = '/outpatientDoctorWorkStation/afterDiagnosis/commitEndPatient';
      let param = this.choosedPatient;
      this.$axios.post(url, this.$qs.stringify(param)).then(res => {
        url = '/outpatientDoctorWorkStation/afterDiagnosis/commitEndMedicalRecord';
        this.medicalRecord.CaseState = 3;
        param = this.medicalRecord;
        this.$axios.post(url, this.$qs.stringify(param)).then(res => {
          this.initRecord(this.medicalRecord.CaseNumber);
        })
      })

    }
  }
}
</script>

<style scoped>

</style>
