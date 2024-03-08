<template>
    <div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <div>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    Query type<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a">Name</el-dropdown-item>
                    <el-dropdown-item command="b">Medical record number</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-form :model="searchPatient" :rules="searchPatientRules" ref="searchPatient">
                  <el-form-item :prop="prop">
                    <el-input v-if="searchByName===true" v-model="searchPatient.RealName" placeholder="Please enter the patient's name to query" style="width: 200px;margin-right: 10px" prefix-icon ="el-icon-question" clearable></el-input>
                    <el-input v-else v-model="searchPatient.CaseNumber" placeholder="Please enter the patient's medical record number to query" style="width: 200px;margin-right: 10px" prefix-icon="el-icon-question " clearable></el-input>
                    <el-button-group>
                      <el-button icon="el-icon-search" size="small" type="primary" @click="search('searchPatient')">Query</el-button>
                      <el-button icon="el-icon-refresh" size="small" type="info" @click="reset('searchPatient')">Reset</el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
        </el-col>

        <el-col :span="12">
            <el-card shadow="hover">
              <div>
                <span>Patients to be seen</span>
                <el-table :data="patientData"
                          stripe
                          border
                          :default-sort = "{prop: 'date', order: 'descending'}"
                          v-loading="loading"
                          max-height="250"
                          min-height="250"
                          element-loading-text="Loading..."
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.8)"
                          style="width: 401px">
                  <el-table-column align="center" prop="caseNumber" label="Medical Record Number" width="100"></el-table-column>
                  <el-table-column align="center" prop="realName" label="Name" width="100"></el-table-column>
                  <el-table-column align="center" prop="age" label="age" width="100"></el-table-column>
                  <el-table-column align="center" fixed="right" label="Operation" width="100">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="Select this patient and give final diagnosis" placement="right">
                        <el-button type="text" size="mini" @click="choosePatient(scope.row)">Choose</el-button>
                      </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>

        </el-col>
      </el-row>
    <div>
          <el-divider content-position="center">Confirmed patients</el-divider>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
              <el-collapse-transition>
                <div v-show="isChoose">
                  <el-form :model="medicalRecord" :rules="medicalRecordRules" ref="medicalRecord">
                    <el-descriptions class="margin-top" title="Outpatient Medical Record Home Page" :column="3" size="mini" border>
                      <el-descriptions-item label="Name">
                        <template>
                          <el-form-item prop="RealName">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.RealName"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Medical Record Number">
                        <template>
                          <el-form-item prop="CaseNumber">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.CaseNumber"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="gender">
                        <template>
                          <el-form-item prop="Gender">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.Gender"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Age">
                        <template>
                          <el-form-item prop="Age">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.Age"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Main complaint">
                        <template>
                          <el-form-item prop="Readme">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.Readme"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="History of current illness">
                        <template>
                          <el-form-item prop="Present">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.Present"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Treatment status of current illness">
                        <template>
                          <el-form-item prop="PresentTreat">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.PresentTreat"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Past History">
                        <template>
                          <el-form-item prop="History">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.History"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Allergy History">
                        <template>
                          <el-form-item prop="Allergy">
                            <el-input size="mini" :disabled="true" style="width: 100px" v-model="medicalRecord.Allergy"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Physical examination">
                        <template>
                          <el-form-item prop="Physique">
                            <el-input size="mini" type="textarea" style="width: 100px" v-model="medicalRecord.Physique"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Check recommendations">
                        <template>
                          <el-form-item prop="Proposal">
                            <el-input size="mini" type="textarea" style="width: 100px" v-model="medicalRecord.Proposal"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Notes">
                        <template>
                          <el-form-item prop="Careful">
                            <el-input ize="mini" type="textarea" style="width: 100px" v-model="medicalRecord.Careful"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Check results">
                        <template>
                          <el-form-item prop="CheckResult">
                            <el-input size="mini" type="textarea" style="width: 100px" v-model="medicalRecord.CheckResult"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                      <el-descriptions-item label="Diagnosis results">
                        <template>
                          <el-form-item prop="Diagnosis">
                            <el-tooltip placement="top">
                              <div slot="content">Select and enter keywords to search<br/>Support fuzzy search</div>
                              <el-select
                                  v-model="diseaseValue"
                                  filterable
                                  size="mini"
                                  style="width: 100px"
                                  remote
                                  clearable
                                  loading-text="Loading..."
                                  reserve-keyword
                                  placeholder="Please enter disease keywords"
                                  :remote-method="remoteMethod"
                                  :loading="diseaseLoading">
                                <el-option
                                    v-for="item in diseaseOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                              </el-select>
                            </el-tooltip>
                        </el-form-item>
                      </template>
                    </el-descriptions-item>
                    <el-descriptions-item label="Processing Opinions">
                        <template>
                          <el-form-item prop="Handling">
                            <el-input size="mini" type="textarea" style="width: 100px" v-model="medicalRecord.Handling"></el-input>
                          </el-form-item>
                        </template>
                      </el-descriptions-item>
                    </el-descriptions>
                    <el-button-group style="margin: 10px 180px">
                      <el-button type="danger" size="large" @click="commitResult('medicalRecord')" icon="el-icon-document-checked">Confirmed</el-button>
                      <el-button type="info" size="large" @click="resetResult('medicalRecord')" icon="el-icon-document-delete">Reset</el-button>
                    </el-button-group>
                  </el-form>
                </div>
              </el-collapse-transition>
            </el-card>

          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
              <el-collapse-transition>
                <div v-show="isChoose">
                  <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="Common diagnostics" name="first">
                      <el-radio-group v-model="templateRadio">
                        <el-radio :label="1" @change="initTemplate">Whole Hospital</el-radio>
                        <el-radio :label="2" @change="initTemplate">Department</el-radio>
                        <el-radio :label="3" @change="initTemplate">Personal</el-radio>
                      </el-radio-group>
                      <el-button :disabled="templateRadio===0" type="success" size="mini" @click="addTemplate" style="margin-left: 30px; margin-bottom: 5px" icon="el- icon-plus"></el-button>
                      <el-empty description="No diagnostic template range selected yet" v-if="templateRadio===0"></el-empty>
                      <el-collapse-transition>
                        <div v-show="templateRadio!==0">
                          <el-table :data="templates"
                                    stripe
                                    border
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                                    v-loading="templateLoading"
                                  element-loading-text="Loading..."
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                                    style="width: 601px">
                            <el-table-column align="center" type="index" label="serial number" width="100"></el-table-column>
                            <el-table-column align="center" prop="diagnosis" label="Diagnosis result" width="170"></el-table-column>
                            <el-table-column align="center" prop="handling" label="Handling Opinions" width="170"></el-table-column>
                            <el-table-column align="center" fixed="right" label="Operation" width="130">
                              <template slot-scope="scope">
                                <el-button-group>
                                  <div>
                                    <el-button style="color: #2fea7b" type="text" size="mini" @click="applyTemplate(scope.row)">Apply</el-button>
                                    <el-divider direction="vertical"></el-divider>
                                    <el-button style="color: #ff0606" :disabled="canDelete(scope.row)" type="text" size="mini" @click="deleteDialogVisible = true">Delete</el-button>
                                  </div>
                                </el-button-group>
                                <el-dialog
                                    title="Warning"
                                    :visible.sync="deleteDialogVisible"
                                    append-to-body
                                    width="20%">
                                  <span>Confirm deletion? </span>
                                  <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteDialogVisible = false" icon="el-icon-refresh-left">Cancel</el-button>
                                <el-button type="danger" @click="deleteTemplate(scope.row, scope.index);deleteDialogVisible = false" icon="el-icon-delete">OK</el-button>
                              </span>
                                </el-dialog>
                              </template>
                            </el-table-column>
                          </el-table>
 
                        </div>
                      </el-collapse-transition>
 
                    </el-tab-pane>
 
                    <el-tab-pane label="Test results" name="second">
                      <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
                      <el-collapse-transition>
                        <div v-show="isChoose">
                          <el-table :data="checkResult"
                                    stripe
                                    bord er
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                                    v-loading="resultLoading"
                                    max-height="250"
                                    min-height="250"
                                    element-loading-text="Loading..."
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                                    style="width: 601px">
                            <el-table-column align="center" prop="name" label="Project name" width="100"></el-table-column>
                            <el-table-column align="center" prop="objective" label="Objective" width="100"></el-table-column>
                            <el-table-column align="center" prop="position" label="Inspection site" width="100"></el-table-column>
                            <el-table-column align="center" prop="isUrgent" label="Is it urgent?" width="100"></el-table-column>
                            <el-table-column align="center" prop="num" label="quantity" width="100"></el-table-column>
                            <el-table-column align="center" prop="creationTime" label="creation time" width="100"></el-table-column>
                            <el-table-column align="center" prop="checkTime" label="check time" width="100"></el-table-column>
                            <el-table-column align="center" prop="result" label="check result" width="100"></el-table-column>
                            <el-table-column align="center" prop="resultTime" label="resultTime" width="100"></el-table-column>
                            <el-table-column align="center" fixed="right" label="Operation" width="100">
                              <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" content="Select this item and apply it to the patient's examination results" placement="right">
                                  <el-button style="color: #83e746" type="text" size="mini" @click="applyResult(scope.row)">Apply</el-button>
                                </el-tooltip>
 
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </el-collapse-transition>
                    </el-tab-pane>
                    <el-tab-pane label="Disposition result" name="third">
                      <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
                      <el-collapse-transition>
                        <div v-show="isChoose">
                          <el-table :data="dealResult"
                                    stripe
                                    border
                                    :default-sort = "{prop: 'date', order: 'descending'}"
                                    v-loading="dealLoading"
                                    max-height="250"
                                    min-height="250"
                                    element-loading-text="Loading..."
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                                    style="width: 601px">
                            <el-table-column align="center" prop="name" label="Project name" width="100"></el-table-column>
                            <el-table-column align="center" prop="objective" label="Objective" width="100"></el-table-column>
                            <el-table-column align="center" prop="position" label="Disposal position" width="100"></el-table-column>
                            <el-table-column align="center" prop="isUrgent" label="Is it urgent?" width="100"></el-table-column>
                            <el-table-column align="center" prop="num" label="quantity" width="100"></el-table-column>
                            <el-table-column align="center" prop="creationTime" label="creation time" width="100"></el-table-column>
                            <el-table-column align="center" prop="checkTime" label="Disposal Time" width="100"></el-table-column>
                            <el-table-column align="center" prop="result" label="Disposal result" width="100"></el-table-column>
                            <el-table-column align="center" prop="resultTime" label="resultTime" width="100"></el-table-column>
                            <el-table-column align="center" fixed="right" label="Operation" width="100">
                              <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" content="Select this item and apply it to the patient's examination results" placement="right">
                                  <el-button style="color: #83e746" type="text" size="mini" @click="applyDeal(scope.row)">Apply</el-button>
                                </el-tooltip>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </el-collapse-transition>
                      </el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-transition>
            </el-card>
 
          </el-col>
        </el-row>
      </div>
      <div>
        <el-dialog title="Add template" :visible.sync="addDialogVisible" width="80%">
          <el-form :model="addTemplateForm" :rules="addTemplateFormRules" ref="addTemplateForm" width="80%">
            <el-descriptions class="margin-top" :column="3" size="small" border>
              <el-descriptions-item label="Diagnosis results">
                <template>
                  <el-form-item prop="Diagnosis">
                    <el-tooltip placement="top">
                      <div slot="content">Select and enter keywords to search<br/>Support fuzzy search</div>
                      <el-select
                          v-model="diseaseValueInTemplate"
                          filterable
                          size="large"
                          style="width: 100%"
                          remote
                          clearable
                          loading-text="Loading..."
                          reserve-keyword
                          placeholder="Please enter disease keywords"
                          :remote-method="remoteMethodInTemplate"
                          :loading="diseaseLoadingInTemplate">
                        <el-option
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="Processing Opinions">
                 <template>
                  <el-form-item prop="Handling">
                    <el-input type="textarea" v-model="addTemplateForm.Handling" placeholder="Please enter processing opinions"></el-input>
                  </el-form-item>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="Scope of use">
                <template>
                  <el-form-item prop="Scope">
                    <el-select v-model="addTemplateForm.Scope" placeholder="Please select the scope">
                      <el-option label="Whole Hospital" value="Whole Hospital"></el-option>
                      <el-option label="Department" value="Department"></el-option>
                      <el-option label="Personal" value="Personal"></el-option>
                   </el-select>
                 </el-form-item>
              </template>
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button-group>
            <el-button type="info" @click="resetTemplate('addTemplateForm')" icon="el-icon-refresh">Reset</el-button>
            <el-button type="primary" @click="addDialogVisible = false; resetTemplate('addTemplateForm')" icon="el-icon-close">Cancel</el-button>
            <el-button type="success" @click="commitTemplate('addTemplateForm')" icon="el-icon-plus">Add</el-button>
          </el-button-group>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "OutpatientDiagnosis",
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
      patients: [],
      currentPageForPatient: 1,
      pageSizeForPatient: 3,
      isChoose: false,
      choosedPatient: {
        RealName: '',
        CaseNumber: '',
        Gender: '',
        Age: '',
      },
      medicalRecord: {
        RealName: '',
        CaseNumber: '',
        Gender: '',
        Age: '',
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
      medicalRecordRules: {
        RealName: [{required: true, message: 'Please enter your name', trigger: 'blur'}],
        CaseNumber: [{required: true, message: 'Please enter the medical record number', trigger: 'blur'}],
        Gender: [{required: true, message: 'Please enter gender', trigger: 'blur'}],
        Age: [{required: true, message: 'Please enter your age', trigger: 'blur'}],
        Readme: [{required: true, message: 'Please enter the main complaint', trigger: 'blur'}],
        Present: [{required: true, message: 'Please enter your current medical history', trigger: 'blur'}],
        PresentTreat: [{required: true, message: 'Please enter the current treatment status', trigger: 'blur'}],
        History: [{required: true, message: 'Please enter past history', trigger: 'blur'}],
        Allergy: [{required: true, message: 'Please enter allergy history', trigger: 'blur'}],
        Physique: [{required: true, message: 'Please enter a physical examination', trigger: 'blur'}],
        Proposal: [{required: true, message: 'Please enter inspection suggestions', trigger: 'blur'}],
        Careful: [{required: true, message: 'Please enter notes', trigger: 'blur'}],
        CheckResult: [{required: true, message: 'Please enter the check result', trigger: 'blur'}],
        Diagnosis: [{required: true, message: 'Please enter the diagnosis result', trigger: 'blur'}],
        Handling: [{required: true, message: 'Please enter processing opinions', trigger: 'blur'}],
      },
      checkResult: [],
      dealResult: [],
      resultLoading: false,
      dealLoading: false,
      activeName: 'first',
      templateRadio: 0,
      addDialogVisible: false,
      templates: [],
      templateLoading: false,
      deleteDialogVisible: false,
      addTemplateForm: {
        Name: '',
        DeptID: null,
        UserID: null,
        CreationTime: '',
        Scope: '',
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
        DelMark: 1,
      },
      addTemplateFormRules: {
        Name: [{required: true, message: 'Please enter a template name', trigger: 'blur'}],
        DeptID: [{required: true, message: 'Please enter department ID', trigger: 'blur'}],
        UserID: [{required: true, message: 'Please enter your doctor ID.', trigger: 'blur'}],
        CreationTime: [{required: true, message: 'Please enter the time of creation', trigger: 'blur'}],
        Scope: [{required: true, message: 'Please enter the scope of use', trigger: 'blur'}],
        Readme: [{required: true, message: 'Please enter the main complaint', trigger: 'blur'}],
        Present: [{required: true, message: 'Please enter your current medical history', trigger: 'blur'}],
        PresentTreat: [{required: true, message: 'Please enter the current treatment status', trigger: 'blur'}],
        History: [{required: true, message: 'Please enter your past history', trigger: 'blur'}],
        Allergy: [{required: true, message: 'Please enter an allergy history', trigger: 'blur'}],
        Physique: [{required: true, message: 'Please enter a medical examination', trigger: 'blur'}],
        Proposal: [{required: true, message: 'Please enter inspection suggestions', trigger: 'blur'}],
        Careful: [{required: true, message: 'Please enter precautions', trigger: 'blur'}],
        CheckResult: [{required: true, message: 'Please enter the results of the inspection', trigger: 'blur'}],
        Diagnosis: [{required: true, message: 'Please enter diagnostic results', trigger: 'blur'}],
        Handling: [{required: true, message: 'Please enter comments', trigger: 'blur'}],
        DelMark: [{required: true, message: 'Please enter whether to delete', trigger: 'blur'}],
      },

      diseaseLoading: false,
      diseaseValue: [],
      diseaseOptions: [],
      diseaseList: [],
      diseaseStates: [],
      isChooseCategory: false,
      diseaseCategoryLoading: false,
      diseaseCategoryValue: [],
      diseaseCategoryOptions: [],
      diseaseCategoryList: [],
      diseaseCategoryStates: [],
      diseaseLoadingInTemplate: false,
      diseaseValueInTemplate: [],
      diseaseOptionsInTemplate: [],
      diseaseListInTemplate: [],
      diseaseStatesInTemplate: [],




    }
  },
  mounted() {
    this.initUser();
    this.initPatient();
    this.initDiseasePrepare();
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
    initUser() {
      console.log("presentUser.id: ", this.presentUser.id);
      this.presentUser = JSON.parse(localStorage.getItem("User"));
      console.log("Initialization of Doctor:", this.presentUser);
    },
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
        console.log("111");
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            url = '/outpatientDoctorWorkStation/outpatientDiagnosis/searchByName';
            param = this.$qs.stringify(this.searchPatient);
            console.log("Search for patients:", this.searchPatient);
            this.$axios.post(url, param).then(res => {
              console.log("Medical Records Search Results:", res);
              this.patients = res.data.data;
            })
          }
        })
      } else {
        console.log("222");
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            url = '/outpatientDoctorWorkStation/outpatientDiagnosis/searchByNumber';
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
    initPatient() {
      this.loading = true;
      let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/initPatients';
      let param = JSON.parse(localStorage.getItem("User"));
      this.$axios.post(url, param).then(res => {
        this.loading = false;
        console.log("All patients:", res);
        this.patients = res.data.data;
      })
    },
    choosePatient(row) {
      console.log("Selected patients:", row);
      this.$refs['medicalRecord'].resetFields();

      this.$nextTick(() => {
        this.isChoose = true;
        this.choosedPatient.RealName = row.realName;
        this.choosedPatient.CaseNumber = row.caseNumber;
        this.choosedPatient.Gender = row.gender;
        this.choosedPatient.Age = row.age;
      })

      this.medicalRecord.RealName = row.realName;
      this.medicalRecord.Gender = row.gender;
      this.medicalRecord.Age = row.age;
      this.medicalRecord.CaseNumber = row.caseNumber;

      this.initRecord(row.caseNumber);
      this.initCheckResult(row.caseNumber);
      this.initDealResult(row.caseNumber);
      this.initDisease();

    },
    initRecord(number) {
      let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/initRecord';
      let param = {
        CaseNumber: number,
      }
      console.log("number = ", number);
      console.log("param = ", param);
      this.$axios.post(url, this.$qs.stringify(param)).then(res => {
        console.log("Initialize medical record information:", res);
        if (res.data.data) {
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
          this.medicalRecord.state = res.data.data.state;

          this.diseaseValue = res.data.data.diagnosis;
        }

      })
    },
    initCheckResult(number) {
      let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/initCheckResult';
      let param = {
        CaseNumber: number
      };
      console.log("CaseNumber = ", number);
      this.$axios.post(url, this.$qs.stringify(param)).then(res => {
        console.log("The results of the patient's examination:", res.data.data);
        this.checkResult = res.data.data;
      })

    },
    initDealResult(number) {
      let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/initDealResult';
      let param = {
        CaseNumber: number
      };
      console.log("CaseNumber = ", number);
      this.$axios.post(url, this.$qs.stringify(param)).then(res => {
        console.log("Results of patient treatment:", res.data.data);
        this.dealResult = res.data.data;
      })
    },
    applyResult(row) {
      console.log("Results to be applied:", row);
      this.medicalRecord.CheckResult = row.result;
    },
    applyDeal(row) {
      console.log("Results to be applied:", row);
      this.medicalRecord.CheckResult = row.result;
    },
    commitResult(ruleForm) {
      let str = this.diseaseValue.toString();
      console.log("Selected diseases:", str);
      let result = '';
      let index = 0;
      for (var i=0; i<str.length; i++) {
        if (str[i] === ':') {
          index = i;
          break;
        }
      }
      for (var i=index+1; i<str.length; i++) {
        result += str[i];
      }
      this.medicalRecord.Diagnosis = result;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          console.log("Information to be diagnosed:", this.medicalRecord);
          let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/confirm';
          let param = this.$qs.stringify(this.medicalRecord);
          this.$axios.post(url, param).then(res => {

          })
        }
      })
    },
    resetResult(ruleForm) {
      this.$refs[ruleForm].fields.forEach(function (e) {
        if(e.prop === 'Physique' || e.prop === 'Proposal' || e.prop === 'Careful' || e.prop === 'CheckResult' || e.prop === 'Diagnosis' || e.prop === 'Handling'){
          e.resetField();
        }
      })
    },
    handleClick(tab, event) {
      if (tab.label === "Common diagnoses") {
        console.log("Common diagnoses");
      } else if (tab.label === "Inspection results") {
        console.log("Inspection results");
      } else {

      }
    },
    initTemplate() {
      let url = '';
      let param = '';
      if (this.templateRadio === 1) {
        url = '/outpatientDoctorWorkStation/outpatientDiagnosis/getDiagnosisTemplateByHospital'
        this.$axios.post(url).then(res => {
          console.log("Initialize the generated diagnostics:", res);
          this.templates = res.data.data;
          console.log("this.templates.length:", this.templates.length);
          for (var i=0; i<this.templates.length; i++){
            console.log("this.presentUser.ID:", this.presentUser.ID)
            console.log("this.presentUser.id:", this.presentUser.id)
            console.log("this.templates[i].UserID:", this.templates[i].UserID)
            console.log("this.templates[i].userID:", this.templates[i].userID)
          }
        })
      } else if (this.templateRadio === 2) {
        url = '/outpatientDoctorWorkStation/outpatientDiagnosis/getDiagnosisTemplateByDepartment'
        param = JSON.parse(localStorage.getItem("User"));
        this.$axios.post(url, param).then(res => {
          console.log("Initialize the generated diagnostics:", res);
          this.templates = res.data.data;
        })
      } else {
        url = '/outpatientDoctorWorkStation/outpatientDiagnosis/getDiagnosisTemplatePersonally'
        param = JSON.parse(localStorage.getItem("User"));
        this.$axios.post(url, param).then(res => {
          console.log("Initialize the generated diagnostics:", res);
          this.templates = res.data.data;
        })
      }

    },
    addTemplate() {
      this.addDialogVisible = true;
    },
    applyTemplate(row) {
      console.log("Template to be applied:", row);
      this.$nextTick(() => {
        this.diseaseValue = row.diagnosis;
        this.medicalRecord.Diagnosis = row.diagnosis;
        this.medicalRecord.Handling = row.handling;
      })
    },
    deleteTemplate(row, index) {
      let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/deleteDiagnosisTemplate';
      let param = row;
      this.$axios.post(url, param).then(res => {
        this.initTemplate();
        console.log("Deleted results:", res);
      })
    },
    canDelete(row) {
      console.log("row.userID : ", row.userID);
      console.log("this.presentUser.id : ", this.presentUser.id);
      return row.userID !== this.presentUser.id;
    },
    resetTemplate(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    commitTemplate(formName) {
      let str = this.diseaseValueInTemplate.toString();
      console.log("Selected diseases:", str);
      let result = '';
      let index = 0;
      for (var i=0; i<str.length; i++) {
        if (str[i] === ':') {
          index = i;
          break;
        }
      }
      for (var i=index+1; i<str.length; i++) {
        result += str[i];
      }
      this.addTemplateForm.Diagnosis = result;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/commitTemplate';
          this.addTemplateForm.DeptID = this.presentUser.deptID;
          this.addTemplateForm.UserID = this.presentUser.id;
          console.log("Current time:", moment().format('YYYY-MM-DD HH:mm:ss'));
          this.addTemplateForm.CreationTime = moment().format('YYYY-MM-DD HH:mm:ss');
          let param = this.$qs.stringify(this.addTemplateForm);

          console.log("Template to be added:", this.addTemplateForm);
          this.$axios.post(url, param).then(res => {
            this.addDialogVisible = false;
            this.initTemplate();
          })
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.diseaseLoading = true;
        setTimeout(() => {
          this.diseaseLoading = false;
          this.diseaseOptions = this.diseaseList.filter(item => {
            return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.diseaseOptions = [];
      }
    },
    remoteMethodInTemplate(query) {
      if (query !== '') {
        this.diseaseLoadingInTemplate = true;
        setTimeout(() => {
          this.diseaseLoadingInTemplate = false;
          this.diseaseOptionsInTemplate = this.diseaseListInTemplate.filter(item => {
            return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.diseaseOptionsInTemplate = [];
      }
    },
    initDiseasePrepare() {
      let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/initDiseasePrepare';
      this.$axios.post(url).then(res => {
        this.diseaseStates = res.data.data;
        this.diseaseStatesInTemplate = res.data.data;
        console.log("diseaseStates : ", res.data.data);

      })
    },
    initDisease() {
        var i = 0;
        var j = 0;
        console.log("start initDisease");
        this.diseaseList = this.diseaseStates.map(item => {
          return {value: `${++i}:${item}`, label: `${item}`}
        })
        this.diseaseListInTemplate = this.diseaseStatesInTemplate.map(item => {
          return {value: `${++j}:${item}`, label: `${item}`}
        })


    },
    initCategoryDiseasePrepare() {
      let url = '/outpatientDoctorWorkStation/outpatientDiagnosis/initCategoryDiseasePrepare';
      this.$axios.post(url).then(res => {
        this.diseaseCategoryStates = res.data.data;
        console.log("diseaseCategoryStates : ", res.data.data);

      })
    },
    initCategoryDisease() {
      console.log("start initCategoryDisease");
      var i = 0;
      this.diseaseCategoryList = this.diseaseCategoryStates.map(item => {
        return {value: `${++i}:${item}`, label: `${item}`}
      })


    },
    remoteCategoryMethod(query) {
      if (query !== '') {
        this.diseaseCategoryLoading = true;
        setTimeout(() => {
          this.diseaseCategoryLoading = false;
          this.diseaseCategoryOptions = this.diseaseCategoryList.filter(item => {
            return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.diseaseCategoryOptions = [];
      }
    },

  }
}
</script>

<style scoped>
.aaa {
  height: 40px;
  width: 70px;
}
</style>