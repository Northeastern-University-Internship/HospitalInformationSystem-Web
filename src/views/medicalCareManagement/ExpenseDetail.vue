<template>
  <div>
    <div>Patient Cost Details Inquiry</div>
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
                  <el-dropdown-item command="a">Name</el-dropdown-item>
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
            <el-empty description="暂未选择患者" v-if="!isChoose"></el-empty>
            <el-collapse-transition>
              <div v-show="isChoose">
                <el-descriptions size="mini" title="No patient selected" direction="vertical" :column="4" border>
                  <el-descriptions-item label="Name" :span="2">{{choosedPatient.RealName}}</el-descriptions-item>
                  <el-descriptions-item label="Medical record number" :span="2">{{choosedPatient.CaseNumber}}</el-descriptions-item>
                  <el-descriptions-item label="Gender" :span="2" v-if="choosedPatient.Gender===71"><el-tag type="success">Male</el-tag></el-descriptions-item>
                  <el-descriptions-item label="Gender" :span="2" v-else><el-tag type="warning">Female</el-tag></el-descriptions-item>
                  <el-descriptions-item label="Age" :span="2">{{choosedPatient.Age}}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-collapse-transition>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div>
            <span>PATIENTS TO BE INQUIRED WITH CHARGE DETAILS</span>
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
                    <el-button type="text" size="mini" @click="choosePatient(scope.row)">选择</el-button>
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
                <el-table
                    :data="costData"
                    stripe
                    border
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    v-loading="costLoading"
                    max-height="500"
                    min-height="250"
                    element-loading-text="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%">
                  <el-table-column align="center" prop="id" label="ID" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="registID" label="registered number ID" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="invoiceID" label="Invoices ID" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="itemID" label="Projects ID" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="itemType" label="Project Type" style="width: 10%" :filters="[{ text: 'Non-pharmaceutical', value: 1 }, { text: 'pharmaceutical', value: 2 }]" :filter-method="filterTag" filter-placement="bottom-end">
                    <template slot-scope="scope">
                      <el-tag :type="scope.row.itemType === 1 ? 'primary' : 'danger'" disable-transitions>{{scope.row.itemType === 1 ? 'Non-pharmaceutical' : 'pharmaceutical'}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="name" label="Name of project" style="width: 10%"></el-table-column>
                  <el-table-column align="center" prop="price" label="Project Price" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="amount" label="Number" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="deptID" label="Executive Section ID" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="createtime" label="Opening time" style="width: 10%"></el-table-column>
                  <el-table-column align="center" prop="createOperID" label="Opening staff ID" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="payTime" label="Collection/refund time" style="width: 10%"></el-table-column>
                  <el-table-column align="center" prop="registerID" label="Collection/refund ID" style="width: 5%"></el-table-column>
                  <el-table-column align="center" prop="feeType" label="Payment Methods" style="width: 10%"></el-table-column>
                  <el-table-column align="center" prop="backID" label="Refund history ID" style="width: 5%"></el-table-column>
                </el-table>
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
  name: "PatientExpenseDetailsQuery",
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
      costLoading: false,
      cost: [],
      currentPageForCost: 1,
      pageSizeForCost: 10,
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
    costData() {
      console.log("cost.length = ", this.cost.length);
      if (this.cost.length > 0) {
        return this.cost.slice( (this.currentPageForCost -1) * this.pageSizeForCost, this.currentPageForCost * this.pageSizeForCost) || [];
      }
      console.log("cost = ", this.cost);
      return this.cost;
    }
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
    sizeChangeForPatient(currentSize) {
      this.pageSizeForPatient = currentSize;
      this.initPatient();
    },
    currentChangeForPatient(currentPage) {
      this.currentPageForPatient = currentPage;
      this.initPatient();
    },
    search(ruleForm) {
      let url = '';
      let param = null;
      let user = JSON.parse(localStorage.getItem("User"));
      console.log("user = ", user);
      this.searchPatient.UserID = user.id;
      this.searchPatient.DeptID = user.deptID;
      if (this.searchByName === true) {
        console.log("11111111111eeee");
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            url = '/outpatientDoctorWorkStation/patientExpenseDetailsQuery/searchByName';
            param = this.$qs.stringify(this.searchPatient);
            console.log("Search for patients:", this.searchPatient);
            this.$axios.post(url, param).then(res => {
              console.log("Medical Records Search Results:", res);
              this.patients = res.data.data;
            })
          }
        })
      } else {
        console.log("222222");
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            url = '/outpatientDoctorWorkStation/patientExpenseDetailsQuery/searchByNumber';
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
      let url = '/outpatientDoctorWorkStation/patientExpenseDetailsQuery/initPatients';
      let param = JSON.parse(localStorage.getItem("User"));
      this.$axios.post(url, param).then(res => {
        this.loading = false;
        console.log("For all patients who want to check the cost details:", res);
        this.patients = res.data.data;
      })
    },
    choosePatient(row) {
      this.$nextTick(() => {
        this.isChoose = true;
        this.choosedPatient.RealName = row.realName;
        this.choosedPatient.CaseNumber = row.caseNumber;
        this.choosedPatient.Gender = row.gender;
        this.choosedPatient.Age = row.age;
      })
      console.log("Selected patients:", row);
      let url = '/outpatientDoctorWorkStation/patientExpenseDetailsQuery/choosePatient';
      let param = row;
      this.$axios.post(url, param).then(res => {
        this.cost = res.data.data;
      })
    },
    filterTag(value, row) {
      return row.itemType === value;
    },
  }
}
</script>

<style scoped>

</style>