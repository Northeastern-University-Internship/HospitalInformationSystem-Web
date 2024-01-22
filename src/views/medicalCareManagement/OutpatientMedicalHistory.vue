<template>
   <div>
     <div>
       <el-row :gutter="20">
         <el-col :span="8">
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
             <div>
               <el-divider content-position="left"></el-divider>
             </div>
             <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
             <el-collapse-transition>
               <div v-show="isChoose">
                 <el-descriptions size="mini" title="Basic patient information" direction="vertical" :column="4" border>
                   <el-descriptions-item label="Name" :span="2">{{choosedPatient.RealName}}</el-descriptions-item>
                   <el-descriptions-item label="Medical Record Number" :span="2">{{choosedPatient.CaseNumber}}</el-descriptions-item>
                   <el-descriptions-item label="Gender" :span="2" v-if="choosedPatient.Gender===71"><el-tag type="success">Male</el-tag></ el-descriptions-item>
                   <el-descriptions-item label="gender" :span="2" v-else><el-tag type="warning">Female</el-tag></el-descriptions-item>
                   <el-descriptions-item label="Age" :span="2">{{choosedPatient.Age}}</el-descriptions-item>
               </div>
             </el-collapse-transition>
           </el-card>
         </el-col>
         <el-col :span="8">
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
                         style="width: 361px">
                 <el-table-column align="center" prop="caseNumber" label="Medical Record Number" width="90"></el-table-column>
                 <el-table-column align="center" prop="realName" label="Name" width="90"></el-table-column>
                 <el-table-column align="center" prop="age" label="age" width="90"></el-table-column>
                 <el-table-column align="center" fixed="right" label="Operation" width="90">
                   <template slot-scope="scope">
                     <el-tooltip class="item" effect="dark" content="Select this patient and give a preliminary diagnosis" placement="right">
                       <el-button type="text" size="mini" @click="choosePatient(scope.row)">Choose</el-button>
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
           </el-card>
         </el-col>
         <el-col :span="8">
           <el-card shadow="hover">
             <div>
               <span>Diagnosed patients</span>
               <el-table :data="historyPatientData"
                         stripe
                         border
                         :default-sort = "{prop: 'date', order: 'descending'}"
                         v-loading="historyLoading"
                         max-height="250"
                         min-height="250"
                         element-loading-text="Loading..."
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)"
                         style="width: 361px">
                 <el-table-column align="center" prop="caseNumber" label="Medical Record Number" width="120"></el-table-column>
                 <el-table-column align="center" prop="realName" label="Name" width="120"></el-table-column>
                 <el-table-column align="center" prop="age" label="age" width="120"></el-table-column>
               </el-table>
               <div style="display: flex;justify-content: flex-end">
                 <el-pagination
                     background
                     @current-change="currentChangeForHistoryPatient"
                     @size-change="sizeChangeForHistoryPatient"
                     :page-size="pageSizeForHistoryPatient"

                     :current-page.sync="currentPageForHistoryPatient"
                     layout="prev, pager, next, jumper, ->, total, slot"
                     :total="historyPatients.length">
                 </el-pagination>
               </div>
             </div>
           </el-card>

         </el-col>
       </el-row>
       <div>
         <el-divider content-position="left"></el-divider>
       </div>
       <el-row :gutter="20">
         <el-col :span="16">
           <el-card shadow="hover">
             <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
             <el-collapse-transition>
               <div class="grid-content bg-purple" v-show="isChoose">
                 <el-form :model="medicalRecord" :rules="medicalRecordRules" ref="medicalRecord" label-position="top">
                   <el-row>
                     <el-col :span="12">
                       <el-form-item prop="Readme" label="Main Complaint">
                         <el-input type="textarea" v-model="medicalRecord.Readme" placeholder="Please enter the chief complaint" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item prop="Present" label="History of current illness">
                         <el-input type="textarea" v-model="medicalRecord.Present" placeholder="Please enter your current medical history" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item prop="PresentTreat" label="Treatment status of current illness">
                         <el-input type="textarea" v-model="medicalRecord.PresentTreat" placeholder="Please enter the current treatment status" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item prop="History" label="Past History">
                         <el-input type="textarea" v-model="medicalRecord.History" placeholder="Please enter your past history" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item prop="Allergy" label="Allergy History">
                         <el-input type="textarea" v-model="medicalRecord.Allergy" placeholder="Please enter allergy history" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item prop="Physique" label="Physical Examination">
                         <el-input type="textarea" v-model="medicalRecord.Physique" placeholder="Please enter physical examination" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item prop="Proposal" label="Check Proposal">
                         <el-input type="textarea" v-model="medicalRecord.Proposal" placeholder="Please enter the test proposal" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item prop="Careful" label="Notes">
                         <el-input type="textarea" v-model="medicalRecord.Careful" placeholder="Please enter notes" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item prop="CheckResult" label="Check Result">
                         <el-input type="textarea" v-model="medicalRecord.CheckResult" placeholder="Please enter the check results" style="width: 300px;margin-right: 10px" clearable></el-input>
                         </el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-form-item prop="Diagnosis" label="Diagnosis results">
                         <el-tooltip placement="top">
                           <div slot="content">Select and enter keywords to search<br/>Support fuzzy search</div>
                           <el-select
                               v-model="diseaseValue"
                               filterable
                               size="large"
                               style="width: 300px"
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
                     </el-col>
                   </el-row>
                   <el-row>
                     <el-col :span="12">
                       <el-form-item prop="Handling" label="Handling Opinions">
                         <el-input type="textarea" v-model="medicalRecord.Handling" placeholder="Please enter processing opinions" style="width: 300px;margin-right: 10px" clearable></el-input>
                       </el-form-item>
                     </el-col>
                     <el-col :span="12">
                       <el-button-group style="margin: 50px 25px" type="flex" justify="center">
                         <el-button type="primary" @click="saveRecord('medicalRecord')" icon="el-icon-refresh">Save</el-button>
                         <el-button type="success" @click="commitRecord('medicalRecord')" icon="el-icon-check">Submit</el-button>
                         <el-button type="warning" @click="resetRecord('medicalRecord')" icon="el-icon-close">Clear screen</el-button>
                       </el-button-group>
                     </el-col>
                   </el-row>
                 </el-form>
               </div>
             </el-collapse-transition>
           </el-card>
         </el-col>
         <el-col :span="8">
           <el-card shadow="hover">
             <div v-if="isChoose">
               <div class="grid-content bg-purple">
                 <el-tabs v-model="activeName" @tab-click="handleClick">
                   <el-tab-pane label="Medical Record Template" name="first">
                     <el-radio-group v-model="templateRadio">
                       <el-radio :label="1" @change="initTemplate">Whole Hospital</el-radio>
                       <el-radio :label="2" @change="initTemplate">Department</el-radio>
                       <el-radio :label="3" @change="initTemplate">Personal</el-radio>
                     </el-radio-group>
                     <el-button :disabled="templateRadio===0" type="success" size="mini" @click="addTemplate" style="margin-left: 30px; margin-bottom: 5px" icon="el- icon-plus"></el-button>
                     <el-empty description="No medical record template range selected yet" v-if="templateRadio===0"></el-empty>
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
                                   style="width: 361px">
                           <el-table-column align="center" type="index" label="serial number" width="80"></el-table-column>
                           <el-table-column align="center" prop="name" label="name" width="140"></el-table-column>
                           <el-table-column align="center" fixed="right" label="Operation" width="140">
                             <template slot-scope="scope">
                               <el-button-group>
                                 <div>
                                   <el-button style="color: #2fea7b" type="text" size="mini" @click="applyTemplate(scope.row)">Apply</el-button>
                                   <el-divider direction="vertical"></el-divider>
                                   <el-button style="color: #ff0606" :disabled="canDelete(scope.row)" type="text" size="mini" @click="deleteDialogVisible = true">Delete</el-button>
                                 </div>
                               </el-button-group>
                               <el-dialogtitle="Warning"
                                   :visible.sync="deleteDialogVisible"
                                   append-to-body
                                   width="20%">
                                 <span>Confirm deletion? </span>
                                 <span slot="footer" class="dialog-footer">
                               <el-button @click="deleteDialogVisible = false" icon="el-icon-refresh-left">Cancel</el-button>
                               <el-button type="danger" @click="deleteTemplate(scope.row, scope.index);deleteDialogVisible = false" icon="el-icon-delete">OK</el-button>
                             </span>
                               </el-dialogtitle=>
                             </template>
                           </el-table-column>
                         </el-table>
                       </div>
                     </el-collapse-transition>
                   </el-tab-pane>
                   <el-tab-pane label="Historical medical records" name="third">
                     <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
                     <el-collapse-transition>
                       <div v-show="isChoose">
                         <el-table :data="historyRegister" style="width: 361px">
                           <el-table-column prop="VisitDate" label="Visit Date" width="100px"></el-table-column>
                           <el-table-column prop="deptName" label="Department" width="100px"></el-table-column>
                           <el-table-column prop="diagnosis" label="Diagnosis results" width="100px">
                             <template slot-scope="scope">
                               <el-tag type="danger">{{scope.row.diagnosis}}</el-tag>
                             </template>
                           </el-table-column>
                           <el-table-column fixed="right" label="Operation" width="60px">
                             <template slot-scope="scope">
                               <el-button-group>
                                 <el-button style="color: #0f4bf8" type="text" size="mini" @click="historyRegisterDetail(scope.row)">Details</el-button>
                               </el-button-group>
                             </template>
                           </el-table-column>
                         </el-table>
                         <el-empty description="No patient selected yet" v-if="!isChooseDetail"></el-empty>
                         <el-collapse-transition>
                           <div v-show="isChooseDetail && historyRegister.length!==0">
                             <el-descriptions title="Historical medical records details" direction="vertical" :column="4" border>
                               <el-descriptions-item label="Main Complaint">{{historyRegisterInfo.Readme}}</el-descriptions-item>
                               <el-descriptions-item label="History of current illness">{{this.historyRegisterInfo.Present}}</el-descriptions-item>
                               <el-descriptions-item label="Physical Examination" :span="2">{{this.historyRegisterInfo.Physique}}</el-descriptions-item>
                               <el-descriptions-item label="Diagnosis results">
                                 <template>
                                   <el-tag type="danger">{{this.historyRegisterInfo.Diagnosis}}</el-tag>
                                 </template>
                               </el-descriptions-item>
                             </el-descriptions>
                           </div>
                         </el-collapse-transition>
                       </div>
                     </el-collapse-transition>
                   </el-tab-pane>
                 </el-tabs>
               </div>
             </div>
             <div v-else>
               <el-empty description="No patient selected yet"></el-empty>
             </div>
           </el-card>
         </el-col>
       </el-row>
     </div>
     <div>
       <el-dialog title="Add template" :visible.sync="addDialogVisible" width="80%">
         <el-form :model="addTemplateForm" :rules="addTemplateFormRules" ref="addTemplateForm" width="80%">
           <el-descriptions class="margin-top" :column="3" size="small" border>
             <el-descriptions-item label="template name">
               <template>
                 <el-form-item prop="Name">
                   <el-input v-model="addTemplateForm.Name" size="large" prefix-icon="el-icon-edit-outline" placeholder="Please enter the template name"></el-input>
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
             <el-descriptions-item label="Main complaint">
               <template>
                 <el-form-item prop="Readme">
                   <el-input type="textarea" v-model="addTemplateForm.Readme" placeholder="Please enter the main complaint"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="History of current illness">
               <el-form-item prop="Present">
                 <el-input type="textarea" v-model="addTemplateForm.Present" placeholder="Please enter your current medical history"></el-input>
               </el-form-item>
             </el-descriptions-item>
             <el-descriptions-item label="Treatment status of current illness">
               <template>
                 <el-form-item prop="PresentTreat">
                   <el-input type="textarea" v-model="addTemplateForm.PresentTreat" placeholder="Please enter the current treatment status"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Past History">
               <template>
                 <el-form-item prop="History">
                   <el-input type="textarea" v-model="addTemplateForm.History" placeholder="Please enter past history"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Allergy History">
               <template>
                 <el-form-item prop="Allergy">
                   <el-input type="textarea" v-model="addTemplateForm.Allergy" placeholder="Please enter allergy history"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Physical examination">
               <template>
                 <el-form-item prop="Physique">
                   <el-input type="textarea" v-model="addTemplateForm.Physique" placeholder="Please enter physical examination"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Check recommendations">
               <template>
                 <el-form-item prop="Proposal">
                   <el-input type="textarea" v-model="addTemplateForm.Proposal" placeholder="Please enter inspection suggestions"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Notes">
               <template>
                 <el-form-item prop="Careful">
                   <el-input type="textarea" v-model="addTemplateForm.Careful" placeholder="Please enter precautions"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Check results">
               <template>
                 <el-form-item prop="CheckResult">
                   <el-input type="textarea" v-model="addTemplateForm.CheckResult" placeholder="Please enter the check result"></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Diagnosis results">
               <template>
                 <el-form-item prop="Diagnosis">
                   <el-tooltip placement="top">
                     <div slot="content">Select and enter keywords to search<br/>Support fuzzy search</div>
                     <el-select
                         v-model="diseaseValueInTemplate"
                         filterable
                         size="large"
                         style="width: 300px"
                         remote
                         clearable
                         loading-text="Loading..."
                         reserve-keyword
                         placeholder="Please enter disease keywords"
                         :remote-method="remoteMethodInTemplate"
                         :loading="diseaseLoadingInTemplate">
                       <el-option
                           v-for="item in diseaseOptionsInTemplate"
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
           </el-descriptions>
         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button-group>
             <el-button type="info" @click="resetTemplate('addTemplateForm')" icon="el-icon-refresh">Reset</el-button>
             <el-button type="primary" @click="addDialogVisible = false; resetTemplate('addTemplateForm')" icon="el-icon-close">Cancel</el-button>
             <el-button type="success" @click="commitTemplate('addTemplateForm')" icon="el-icon-check">Add</el-button>
           </el-button-group>

         </div>
       </el-dialog>
     </div>
   </div>

</template>

<script>
import moment from 'moment';

export default {
   name: "OutpatientMedicalRecordHomePage",

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
         CaseNumber: [{required: true, message: 'Please enter the medical record number', trigger: 'blur'}]
       },
       loading: false,
       historyLoading: false,
       patients: [],
       historyPatients: [],
       currentPageForPatient: 1,
       currentPageForHistoryPatient: 1,
       pageSizeForPatient: 3,
       pageSizeForHistoryPatient: 3,
       isChoose: false,
       chosenPatient: {
         RealName: '',
         CaseNumber: '',
         Gender: '',
         Age: '',
       },
       medicalRecord: {
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
       medicalRecordRules: {
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
       activeName: 'first',
       templateRadio: 0,
       templates: [],
       templateLoading: false,
       addDialogVisible: false,
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
         Name: [{required: true, message: 'Please enter the template name', trigger: 'blur'}],
         DeptID: [{required: true, message: 'Please enter department ID', trigger: 'blur'}],
         UserID: [{required: true, message: 'Please enter doctor ID', trigger: 'blur'}],
         CreationTime: [{required: true, message: 'Please enter the creation time', trigger: 'blur'}],
         Scope: [{required: true, message: 'Please enter the usage scope', trigger: 'blur'}],
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
         DelMark: [{required: true, message: 'Please enter whether to delete', trigger: 'blur'}],
       },
       historyRegister: [],
       historyRegisterInfo: {
         Readme: '',
         Present: '',
         Physique: '',
         Diagnosis: '',
       },
       isChooseDetail: false,
       deleteDialogVisible: false,

       diseaseLoading: false,
       diseaseValue: [],
       diseaseOptions: [],
       diseaseList: [],
       diseaseStates: [],

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
     this.initHistoryPatient();
     if (this.isChoose === true) {
       this.initTemplate();
     }
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
     historyPatientData() {
       if (this.historyPatients.length > 0) {
         return this.historyPatients.slice( (this.currentPageForHistoryPatient -1) * this.pageSizeForHistoryPatient, this.currentPageForHistoryPatient * this.pageSizeForHistoryPatient) || [];
       }
       return this.historyPatients;
     }
   },
   methods: {
     initUser() {
       console.log("presentUser.id: ", this.presentUser.id);
       this.presentUser = JSON.parse(localStorage.getItem("User"));
       console.log("Initializing doctor:", this.presentUser);
     },
     canDelete(row) {
       return row.userID !== this.presentUser.id;
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
         console.log("enter if");
         this.$refs[ruleForm].validate((valid) => {
           if (valid) {
             url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/searchByName';
             param = this.$qs.stringify(this.searchPatient);
             console.log("Patient searched:", this.searchPatient);
             this.$axios.post(url, param).then(res => {
               console.log("Medical record number search results:", res);
               this.patients = res.data.data;
             })
           }
         })
       } else {
         console.log("enter else");
         this.$refs[ruleForm].validate((valid) => {
           if (valid) {
             url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/searchByNumber';
             param = this.$qs.stringify(this.searchPatient);
             console.log("Patient searched:", this.searchPatient);
             this.$axios.post(url, param).then(res => {
               console.log("Name search results:", res);
               this.patients = res.data.data;
             })
           }
         })
       }
     },
     reset(ruleForm) {
       this.$refs[ruleForm].resetFields();
       this.initPatient();
       this.initHistoryPatient();
     },
     initPatient() {
       this.loading = true;
       let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/initPatients';
       let param = JSON.parse(localStorage.getItem("User"));
       this.$axios.post(url, param).then(res => {
         this.loading = false;
         console.log("All patients:", res);
         this.patients = res.data.data;
       })
     },
     initHistoryPatient() {
       this.historyLoading = true;
       let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/initHistoryPatients';
       let param = JSON.parse(localStorage.getItem("User"));
       this.$axios.post(url, param).then(res => {
         this.historyLoading = false;
         console.log("All diagnosed patients:", res);
         this.historyPatients = res.data.data;
       })
     },
     sizeChangeForPatient(currentSize) {
       this.pageSizeForPatient = currentSize;
       this.initPatient();
     },
     sizeChangeForHistoryPatient(currentSize) {
       this.pageSizeForHistoryPatient = currentSize;
       this.initHistoryPatient();
     },
     currentChangeForPatient(currentPage) {
       this.currentPageForPatient = currentPage;
       this.initPatient();
     },
     currentChangeForHistoryPatient(currentPage) {
       this.currentPageForHistoryPatient = currentPage;
       this.initHistoryPatient();
     },
     initChose() {
       if (this.isChoose === true) {
         console.log("Selected patient:", )
       }
     },
     choosePatient(row) {
       this.resetRecord('medicalRecord');
       console.log("Selected patient:", row);

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
       this.initDisease();
     },
     initRecord(number) {
       let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/initRecord';
       let param = {
         CaseNumber: number,
       }
       console.log("number = ", number);
       console.log("param = ", param);
       this.$axios.post(url, this.$qs.stringify(param)).then(res => {
         console.log("Initializing medical record information:", res);
         if (res.data.data) {
           this.medicalRecord.Readme = res.data.data.readme;
           this.medicalRecord.Present = res.data.data.present;
           this.medicalRecord.PresentTreat = res.data.data.presentTreat;
           this.medicalRecord.History = res.data.data.history;
           this.medicalRecord.Allergy = res.data.data.allergy;
           this.medicalRecord.Physique = res.data.data.physique;this.medicalRecord.Proposal = res.data.data.proposal;
           this.medicalRecord.Careful = res.data.data.careful;
           this.medicalRecord.CheckResult = res.data.data.checkResult;
           this.medicalRecord.Diagnosis = res.data.data.diagnosis;
           this.medicalRecord.Handling = res.data.data.handling;
           this.diseaseValue = res.data.data.diagnosis;
         }

       })
     },
     saveRecord(ruleForm) {
       let str = this.diseaseValue.toString();
       console.log("Selected disease:", str);
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
           this.medicalRecord.CaseState = 1;
           console.log("Record to be temporarily saved:", this.medicalRecord);
           let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/saveRecord';
           let param = this.$qs.stringify(this.medicalRecord);
           this.$axios.post(url, param).then(res => {
             console.log("Temporary results:", res);
           })
         }
       })
     },
     commitRecord(ruleForm) {
       let str = this.diseaseValue.toString();
       console.log("Selected disease:", str);
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
           this.medicalRecord.CaseState = 2;
           console.log("Record to be submitted:", this.medicalRecord);
           let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/commitRecord';
           let param = this.$qs.stringify(this.medicalRecord);
           this.$axios.post(url, param).then(res => {
             console.log("Submit results:", res);
           })
         }
       })
     },
     resetRecord(ruleForm) {
       this.$refs[ruleForm].resetFields();
     },
     handleClick(tab, event) {
       if (tab.label === "Medical Record Template") {
         console.log("Medical Record Template");
         this.isChooseDetail = false;
       } else {
         console.log("Historical medical records, selected patient medical record number: ", this.choosedPatient.CaseNumber);
         let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/historyRegister';
         let param = this.$qs.stringify(this.choosedPatient);
         this.$axios.post(url, param).then(res => {
           console.log("Historical medical record number:", res);
           moment(res.data.data.visitDate).format('YYYY-MM-DD HH:mm:ss')
           this.historyRegister = res.data.data;
         })
       }
     },
     initTemplate() {
       let url = '';
       let param = '';
       if (this.templateRadio === 1) {
         url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/getRecordTemplateByHospital'
         this.$axios.post(url).then(res => {
           console.log("Initialization generated template:", res);
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
         url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/getRecordTemplateByDepartment'
         param = JSON.parse(localStorage.getItem("User"));
         this.$axios.post(url, param).then(res => {
           console.log("Initialization generated template:", res);
           this.templates = res.data.data;
         })
       } else {
         url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/getRecordTemplatePersonally'
         param = JSON.parse(localStorage.getItem("User"));
         this.$axios.post(url, param).then(res => {
           console.log("Initialization generated template:", res);
           this.templates = res.data.data;
         })
       }

     },
     applyTemplate(row) {
       console.log("Template to be applied:", row);
       this.$nextTick(() => {
         this.medicalRecord.Readme = row.readme;
         this.medicalRecord.Present = row.present;
         this.medicalRecord.PresentTreat = row.presentTreat;
         this.medicalRecord.History = row.history;
         this.medicalRecord.Allergy = row.allergy;
         this.medicalRecord.Physique = row.physique;
         this.medicalRecord.Proposal = row.proposal;
         this.medicalRecord.Careful = row.careful;
         this.medicalRecord.CheckResult = row.checkResult;
         this.diseaseValue = row.diagnosis;
         this.medicalRecord.Diagnosis = row.diagnosis;this.medicalRecord.Handling = row.handling;
       })
       console.log("Template 2 to be applied:", this.medicalRecord);
     },
     deleteTemplate(row, index) {
       let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/deleteRecordTemplate';
       let param = row;
       this.$axios.post(url, param).then(res => {
         this.initTemplate();
         console.log("Delete result:", res);
       })


     },
     addTemplate() {
       this.addDialogVisible = true;

     },
     resetTemplate(ruleForm) {
       this.$refs[ruleForm].resetFields();
     },
     commitTemplate(formName) {
       let str = this.diseaseValueInTemplate.toString();
       console.log("Selected disease:", str);
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
           let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/commitTemplate';
           this.addTemplateForm.DeptID = this.presentUser.deptID;
           this.addTemplateForm.UserID = this.presentUser.id;
           console.log("Current time:", moment().format('YYYY-MM-DD HH:mm:ss'));
           this.addTemplateForm.CreationTime = moment().format('YYYY-MM-DD HH:mm:ss');
           let param = this.$qs.stringify(this.addTemplateForm);

           console.log("Template to be added:", param);
           this.$axios.post(url, param).then(res => {
             this.addDialogVisible = false;
             this.initTemplate();
           })
         }
       })
     },
     historyRegisterDetail(row) {
       this.isChooseDetail = true;
       let url = '/outpatientDoctorWorkStation/outpatientMedicalRecordHomePage/historyRegisterDetail';
       this.$axios.post(url, row).then(res => {
         console.log("Details:", res);
         this.$nextTick(() => {
           this.historyRegisterInfo.Readme = res.data.data.readme;
           this.historyRegisterInfo.Present = res.data.data.present;
           this.historyRegisterInfo.Diagnosis = res.data.data.diagnosis;
           this.historyRegisterInfo.Physique = res.data.data.physique;
           console.log("Drama World 2:", this.historyRegisterInfo);
         })

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
       console.log("Execute initDisease");
       this.diseaseList = this.diseaseStates.map(item => {
         return {value: `${++i}:${item}`, label: `${item}`}
       })
       this.diseaseListInTemplate = this.diseaseStatesInTemplate.map(item => {
         return {value: `${++j}:${item}`, label: `${item}`}
       })


     },
   }
}
</script>

<style scoped>
[v-cloak]{
   display: none;
}
.el-table .warning-row {
   background: #ec1838;
}

.el-table .success-row {
   background: #3ae77f;
}


</style>