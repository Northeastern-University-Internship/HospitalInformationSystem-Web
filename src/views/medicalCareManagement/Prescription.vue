<template>
   <div>
     <div>
       <el-row :gutter="20">
         <el-col :span="6">
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
                   <el-descriptions-item label="Gender" :span="2" v-else><el-tag type="warning">Female</el-tag></el-descriptions-item>
                   <el-descriptions-item label="Age" :span="2">{{choosedPatient.Age}}</el-descriptions-item>
                 </el-descriptions>
               </div>
             </el-collapse-transition>
           </el-card>
         </el-col>
         <el-col :span="8">
           <el-card shadow="hover">
             <div>
               <span>Patients awaiting prescription</span>
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
                     <el-tooltip class="item" effect="dark" content="Select this patient and issue a prescription" placement="right">
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
         <el-col :span="10">
           <el-card shadow="hover">
             <el-empty description="No prescription details selected yet" v-if="!isChooseDetail"></el-empty>
             <el-collapse-transition>
               <div v-show="isChooseDetail">
                 <div>
                   <el-empty description="No details selected yet" v-if="!isChooseDetail"></el-empty><el-collapse-transition>
                     <div v-show="isChooseDetail">
                       <el-radio-group v-model="templateRadio">
                         <el-radio :label="1" @change="initTemplate">Whole Hospital</el-radio>
                         <el-radio :label="2" @change="initTemplate">Department</el-radio>
                         <el-radio :label="3" @change="initTemplate">Personal</el-radio>
                       </el-radio-group>
                       <div>
                         <span>Pharmaceutical Template Table</span>
                         <el-button :disabled="templateRadio===0" type="success" size="mini" @click="addTemplate" style="margin-left: 30px; margin-bottom: 5px" icon="el- icon-plus"></el-button>
                       </div>
                       <el-empty description="No template range selected yet" v-if="!isChooseTemplate"></el-empty>
                       <el-collapse-transition>
                         <div v-show="isChooseTemplate">
                           <el-table :data="drugsTemplateData"
                                     stripe
                                     border
                                     :default-sort = "{prop: 'date', order: 'descending'}"
                                     v-loading="templateLoading"
                                     max-height="250"
                                     min-height="250"
                                     element-loading-text="Loading..."
                                     element-loading-spinner="el-icon-loading"
                                     element-loading-background="rgba(0, 0, 0, 0.8)"
                                     style="width: 100%">
                             <el-table-column align="center" prop="id" label="ID" width="50" show-overflow-tooltip></el-table-column>
                             <el-table-column align="center" prop="name" label="name" width="100" show-overflow-tooltip>
                               <template slot-scope="scope">
                                 <el-tag type="danger" size="mini">{{scope.row.name}}</el-tag>
                               </template>
                             </el-table-column>
                             <el-table-column align="center" prop="userID" label="Doctor ID" width="50" show-overflow-tooltip></el-table-column>
                             <el-table-column align="center" prop="creationTime" label="Creation Time" width="75" show-overflow-tooltip></el-table-column>
                             <el-table-column align="center" prop="scope" label="Use scope" width="75" show-overflow-tooltip>
                               <template slot-scope="scope">
                                 <el-tag v-if="scope.row.scope === 'Whole Hospital'" type="danger" size="mini">{{scope.row.scope}}</el-tag>
                                 <el-tag v-if="scope.row.scope === 'Department'" type="warning" size="mini">{{scope.row.scope}}</el-tag>
                                 <el-tag v-if="scope.row.scope === 'Personal'" type="success" size="mini">{{scope.row.scope}}</el-tag>
                               </template>
                             </el-table-column>
                             <el-table-column align="center" fixed="right" label="Operation" width="100" show-overflow-tooltip>
                               <template slot-scope="scope">
                                 <el-button-group>
                                   <div>
                                     <el-tooltip class="item" effect="dark" content="Select this template and view template details" placement="right">
                                       <el-button type="text" size="mini" @click="chooseTemplate(scope.row)">Choose</el-button>
                                     </el-tooltip>
                                     <el-divider direction="vertical"></el-divider>
                                     <el-button type="text" size="mini" @click="deleteTemplate(scope.row)">Delete</el-button>
                                   </div>
                                 </el-button-group>
                               </template>
                             </el-table-column>
                           </el-table>
                         </div>
                       </el-collapse-transition>
                     </div>
                   </el-collapse-transition>
                 </div>
                 <div>
                   <el-divider content-position="center"></el-divider>
                 </div>
                 <div>
                   <el-empty description="No template selected yet" v-if="(!isChooseTemplateDetail) && (isChooseDetail) && (isChooseTemplate)" style="height: 200px"></el-empty>
                   <el-collapse-transition>
                     <div v-show="isChooseTemplateDetail">
                       <div>
                         <span>Pharmaceutical Template Details</span>
                         <el-button size="mini" style="margin-left: 10px" type="success" @click="addTemplateDetailDialogVisible = true" icon="el-icon-plus"></el-button>
                       </div>
                       <el-table :data="drugsTemplateDetailData"
                                 stripeborder
                                 :default-sort = "{prop: 'date', order: 'descending'}"
                                 v-loading="templateDetailLoading"
                                 max-height="250"
                                 min-height="250"
                                 element-loading-text="Loading..."
                                 element-loading-spinner="el-icon-loading"
                                 element-loading-background="rgba(0, 0, 0, 0.8)"
                                 style="width: 100%">
                         <el-table-column align="center" prop="id" label="ID" width="50" show-overflow-tooltip></el-table-column>
                         <el-table-column align="center" prop="drugsTempID" label="drug template ID" width="50" show-overflow-tooltip></el-table-column>
                         <el-table-column align="center" prop="drugsID" label="Drug ID" width="50" show-overflow-tooltip></el-table-column>
                         <el-table-column align="center" prop="drugsUsage" label="usage" width="60" show-overflow-tooltip></el-table-column>
                         <el-table-column align="center" prop="dosage" label="Dosage" width="75" show-overflow-tooltip></el-table-column>
                         <el-table-column align="center" prop="frequency" label="frequency" width="75" show-overflow-tooltip></el-table-column>
                         <el-table-column align="center" fixed="right" label="Operation" width="100" show-overflow-tooltip>
                           <template slot-scope="scope">
                             <el-button-group>
                               <div>
                                 <el-tooltip class="item" effect="dark" content="Select this template detail and apply" placement="right">
                                   <el-button type="text" size="mini" @click="applyTemplateDetail(scope.row)">Apply</el-button>
                                 </el-tooltip>
                                 <el-divider direction="vertical"></el-divider>
                                 <el-button type="text" size="mini" @click="deleteTemplateDetail(scope.row)">Delete</el-button>
                               </div>
                             </el-button-group>
                           </template>
                         </el-table-column>
                       </el-table>
                     </div>
                   </el-collapse-transition>
                 </div>
               </div>
             </el-collapse-transition>
           </el-card>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="15">
           <el-card shadow="hover">
             <el-empty description="No patient selected yet" v-if="!isChoose"></el-empty>
             <el-collapse-transition>
               <div v-show="isChoose">
                 <div>
                   <span>Patient prescription list</span>
                   <el-button size="mini" style="margin-left: 10px" type="success" @click="addDialogVisible = true" icon="el-icon-plus"></el-button>
                 </div>
                 <el-table :data="prescriptionData"
                           stripe
                           border
                           :default-sort = "{prop: 'date', order: 'descending'}"
                           v-loading="prescriptionLoading"
                           max-height="250"
                           min-height="250"
                           element-loading-text="Loading..."
                           element-loading-spinner="el-icon-loading"
                           element-loading-background="rgba(0, 0, 0, 0.8)"
                           style="width: 100%">
                   <el-table-column align="center" prop="id" label="ID" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="medicalID" label="Medical ID" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="registID" label="registration ID" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="userID" label="Doctor ID" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="prescriptionName" label="Prescription Name" width="90" show-overflow-tooltip>
                     <template slot-scope="scope">
                       <el-tag type="primary" size="mini">{{scope.row.prescriptionName}}</el-tag>
                     </template>
                   </el-table-column>
                   <el-table-column align="center" prop="prescriptionTime" label="Prescription Time" width="90" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="prescriptionState" label="prescription state" width="90" :formatter="applyState" show-overflow-tooltip>
                     <template slot-scope="scope">
                       <el-tag v-if="scope.row.prescriptionState === 1" type="primary" size="mini">Temporary storage</el-tag>
                       <el-tag v-if="scope.row.prescriptionState === 3" type="success" size="mini">Sent</el-tag>
                       <el-tag v-if="scope.row.prescriptionState === 4" type="warning" size="mini">Deleted</el-tag>
                       <el-tag v-if="scope.row.prescriptionState === 0" type="danger" size="mini">Obsolete</el-tag>
                     </template>
                   </el-table-column>
                   <el-table-column align="center" fixed="right" label="Operation" style="width: 100%">
                     <template slot-scope="scope">
                       <el-button-group>
                         <div>
                           <el-button style="color: #89e250" v-if="!(scope.row.prescriptionState===3)" :disabled="scope.row.prescriptionState===3" type="text" size ="mini" @click="tempPrescription(scope.row)">Temporarily</el-button>
                           <el-button v-else :disabled="scope.row.prescriptionState===3" type="text" size="mini" @click="tempPrescription(scope.row)">Temporary storage</el-button >
                           <el-divider direction="vertical"></el-divider>
                           <el-button style="color: #e2cf1c" v-if="!(scope.row.prescriptionState===3 || scope.row.prescriptionState===0 || scope.row.prescriptionState===4 )" :disabled="scope.row.prescriptionState===3 || scope.row.prescriptionState===0 || scope.row.prescriptionState===4" type="text" size="mini" @click ="sendPrescription(scope.row)">Send</el-button>
                           <el-button v-else :disabled="scope.row.prescriptionState===3 || scope.row.prescriptionState===0 || scope.row.prescriptionState===4" type="text" size= "mini" @click="sendPrescription(scope.row)">Send</el-button>
                           <el-divider direction="vertical"></el-divider>
                           <el-button style="color: #fa7b0c" v-if="!(scope.row.prescriptionState===3)" :disabled="scope.row.prescriptionState===3" type="text" size ="mini" @click="deletePrescription(scope.row)">Delete</el-button>
                           <el-button v-else :disabled="scope.row.prescriptionState===3" type="text" size="mini" @click="deletePrescription(scope.row)">Delete</el-button>
                           <el-divider direction="vertical"></el-divider>
                           <el-button style="color: #fa0707" v-if="!(scope.row.prescriptionState!==3)" :disabled="scope.row.prescriptionState!==3" type="text" size ="mini" @click="cancelPrescription(scope.row)">Cancel</el-button>
                           <el-button v-else :disabled="scope.row.prescriptionState!==3" type="text" size="mini" @click="cancelPrescription(scope.row)">Void</el-button>
                           <el-divider direction="vertical"></el-divider>
                           <el-tooltip class="item" effect="dark" content="Select this prescription and display prescription details" placement="right">
                             <el-button type="text" size="mini" @click="chooseDetail(scope.row)">Details</el-button>
                           </el-tooltip>
                         </div>

                       </el-button-group>
                     </template>
                   </el-table-column>
                 </el-table>
                 <el-pagination
                     @size-change="sizeChange"
                     @current-change="currentChange"
                     background

                     :current-page="currentPage"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="pageSize"
                     :current-page.sync="currentPage"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="prescription.length">
                 </el-pagination>

               </div>
             </el-collapse-transition>
           </el-card>
         </el-col>
         <el-col :span="9">
           <el-card shadow="hover">
             <el-empty description="No prescription details selected yet" v-if="!isChooseDetail"></el-empty>
             <el-collapse-transition>
               <div v-show="isChooseDetail">
                 <div>
                   <span>Patient prescription list</span>
                   <el-button size="mini" style="margin-left: 10px" type="success" @click="addDrugDialogVisible = true" icon="el-icon-plus"></el-button>
                 </div>
                 <el-table
                     :data="detailData"
                     stripe
                     border
                     :default-sort = "{prop: 'date', order: 'descending'}"
                     v-loading="detailLoading"
                     max-height="250"
                     min-height="250"
                     element-loading-text="Loading..."
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.8)"
                     style="width: 100%">
                   <el-table-column align="center" prop="id" label="ID" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="prescriptionID" label="Prescription ID" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="drugsID" label="Drug ID" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="drugsName" labell="drug name" width="100" show-overflow-tooltip>
                     <template slot-scope="scope">
                       <el-tag type="primary" size="mini">{{scope.row.drugsName}}</el-tag>
                     </template>
                   </el-table-column>
                   <el-table-column align="center" prop="drugsUsage" label="usage" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="dosage" label="Dosage" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="frequency" label="frequency" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="amount" label="amount" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" prop="state" label="state" width="50" show-overflow-tooltip></el-table-column>
                   <el-table-column align="center" fixed="right" label="Operation" width="50">
                     <template slot-scope="scope">
                       <el-button-group>
                         <el-button style="color: #ff0000" type="text" size="mini" @click="deleteDrugs(scope.row)">Delete Drug</el-button>
                       </el-button-group>
                     </template>
                   </el-table-column>
                 </el-table>
               </div>
             </el-collapse-transition>
           </el-card>
         </el-col>
       </el-row>
     </div>
     <div>
       <el-dialog title="Add prescription" :visible.sync="addDialogVisible" width="80%">
         <el-form :model="addPrescriptionForm" :rules="addPrescriptionFormRules" ref="addPrescriptionForm" width="80%">
           <el-descriptions class="margin-top" :column="3" size="small" border>
             <el-descriptions-item label="Prescription name">
               <template>
                 <el-form-item prop="prescriptionName">
                   <el-input v-model="addPrescriptionForm.prescriptionName" placeholder="Please enter the prescription name" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Opening time">
               <template>
                 <el-form-item prop="prescriptionTime">
                   <el-date-picker
                       v-model="addPrescriptionForm.prescriptionTime"
                       type="datetime"
                       placeholder="Select opening time"
                       default-time="12:00:00">
                   </el-date-picker>
                 </el-form-item>
               </template>
             </el-descriptions-item>
           </el-descriptions>
         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button-group>
             <el-button type="info" @click="resetPrescription('addPrescriptionForm')" icon="el-icon-refresh">Reset</el-button>
             <el-button type="primary" @click="addDialogVisible = false; resetPrescription('addPrescriptionForm')" icon="el-icon-close">Cancel</el-button>
             <el-button type="success" @click="addPrescription('addPrescriptionForm')" icon="el-icon-plus">Add</el-button>
           </el-button-group>

         </div>
       </el-dialog>
       <el-dialog title="Add Drug" :visible.sync="addDrugDialogVisible" width="80%">
         <el-form :model="addDrugForm" :rules="addDrugFormRules" ref="addDrugForm" width="80%">
           <el-descriptions class="margin-top" :column="3" size="small" border>
             <el-descriptions-item label="drug name">
               <template>
                 <el-form-item prop="drugsName">
                   <el-tooltip placement="top">
                     <div slot="content">Select and enter keywords to search<br/>Support fuzzy search</div>
                     <el-select
                         v-model="drugsValue"
                         filterable
                         size="mini"
                         style="width: 100px"
                         remote
                         clearable
                         loading-text="Loading..."
                         reserve-keyword
                         placeholder="Please enter drug keywords"
                         :remote-method="remoteMethod"
                         :loading="drugsLoading">
                       <el-option
                           v-for="item in drugsOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                       </el-option>
                     </el-select>
                   </el-tooltip>

                 </el-form-item>
               </template>
             </el-descriptions-item>

             <el-descriptions-item label="usage">
               <template>
                 <el-form-item prop="drugsUsage">
                   <el-input v-model="addDrugForm.drugsUsage" placeholder="Please enter usage" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Dosage">
               <template>
                 <el-form-item prop="dosage">
                   <el-input v-model="addDrugForm.dosage" placeholder="Please enter the dosage" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="frequency">
               <template>
                 <el-form-item prop="frequency">
                   <el-input v-model="addDrugForm.frequency" placeholder="Please enter frequency" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="quantity">
               <template>
                 <el-form-item prop="amount">
                   <el-input-number v-model="addDrugForm.amount" :min="1" label="Please enter the amount"></el-input-number>
                 </el-form-item>
               </template>
             </el-descriptions-item>
           </el-descriptions>
         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button-group>
             <el-button type="info" @click="resetDrug('addDrugForm')" icon="el-icon-refresh">Reset</el-button>
             <el-button type="primary" @click="addDrugDialogVisible = false; resetDrug('addDrugForm')" icon="el-icon-close">Cancel</el-button>
             <el-button type="success" @click="addDrugs('addDrugForm')" icon="el-icon-plus">Add</el-button>
           </el-button-group>

         </div>
       </el-dialog>
       <el-dialog title="Add Drug Template" :visible.sync="addTemplateDialogVisible" width="80%">
         <el-form :model="addTemplateForm" :rules="addTemplateFormRules" ref="addTemplateForm" width="80%">
           <el-descriptions class="margin-top" :column="3" size="small" border>
             <el-descriptions-item label="template name">
               <template>
                 <el-form-item prop="name">
                   <el-input v-model="addTemplateForm.name" placeholder="Please enter the template name" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>

             <el-descriptions-item label="Creation time">
               <template>
                 <el-form-item prop="creationTime">
                   <el-date-picker
                       v-model="addTemplateForm.creationTime"
                       type="datetime"
                       placeholder="Select opening time"
                       default-time="12:00:00">
                   </el-date-picker>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="Scope of use">
               <template>
                 <el-form-item prop="scope">
                   <el-select v-model="addTemplateForm.scope" placeholder="Please select the scope" clearable>
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
             <el-button type="primary" @click="addTemplateDialogVisible = false; resetTemplate('addTemplateForm')" icon="el-icon-close">Cancel</el-button>
             <el-button type="success" @click="addTemplateConfirm('addTemplateForm')" icon="el-icon-plus">Add</el-button>
           </el-button-group>

         </div>
       </el-dialog>
       <el-dialog title="Add patent medicine detail template" :visible.sync="addTemplateDetailDialogVisible" width="80%">
         <el-form :model="addTemplateDetailForm" :rules="addTemplateDetailFormRules" ref="addTemplateDetailForm" width="80%">
           <el-descriptions class="margin-top" :column="3" size="small" border>
             <el-descriptions-item label="drug name">
               <template>
                 <el-form-item prop="drugsName">
                   <el-tooltip placement="top">
                     <div slot="content">Select and enter keywords to search<br/>Support fuzzy search</div>
                     <el-select
                         v-model="drugsValue"
                         filterable
                         size="mini"
                         style="width: 100px"
                         remote
                         clearable
                         loading-text="Loading..."
                         reserve-keyword
                         placeholder="Please enter drug keywords"
                         :remote-method="remoteMethod"
                         :loading="drugsLoading">
                       <el-option
                           v-for="item in drugsOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                       </el-option>
                     </el-select>
                   </el-tooltip>

                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="usage">
               <template>
                 <el-form-item prop="drugsUsage">
                   <el-input v-model="addTemplateDetailForm.drugsUsage" placeholder="Please enter usage" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>

             <el-descriptions-item label="Dosage">
               <template>
                 <el-form-item prop="dosage">
                   <el-input v-model="addTemplateDetailForm.dosage" placeholder="Please enter the dosage" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>
             <el-descriptions-item label="frequency">
               <template>
                 <el-form-item prop="frequency">
                   <el-input v-model="addTemplateDetailForm.frequency" placeholder="Please enter frequency" clearable></el-input>
                 </el-form-item>
               </template>
             </el-descriptions-item>

           </el-descriptions>
         </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button-group>
             <el-button type="info" @click="resetTemplateDetail('addTemplateDetailForm')" icon="el-icon-refresh">Reset</el-button>
             <el-button type="primary" @click="addTemplateDetailDialogVisible = false; resetTemplateDetail('addTemplateDetailForm')" icon="el-icon-close">Cancel</el-button>
             <el-button type="success" @click="addTemplateDetailConfirm('addTemplateDetailForm')" icon="el-icon-plus">Add</el-button>
           </el-button-group>

         </div>
       </el-dialog>
     </div>
   </div>
</template>

<script>
export default {
   name: "PatentPrescription",
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
       isChoose: false,
       chosenPatient: {
         RealName: '',
         CaseNumber: '',
         Gender: '',
         Age: '',
         RegistID: '',
         MedicalID: '',
       },
       patients: [],
       currentPageForPatient: 1,
       pageSizeForPatient: 3,
       prescription: [],
       prescriptionRules: {
         ID: [{required: true, message: 'Please enter ID', trigger: 'blur'}],
         MedicalID: [{required: true, message: 'Please enter medical record ID', trigger: 'blur'}],
         RegistID: [{required: true, message: 'Please enter the registration ID', trigger: 'blur'}],
         UserID: [{required: true, message: 'Please enter the issuing doctor ID', trigger: 'blur'}],
         PrescriptionName: [{required: true, message: 'Please enter the prescription name', trigger: 'blur'}],
         PrescriptionTime: [{required: true, message: 'Please enter the opening time', trigger: 'blur'}],
         PrescriptionState: [{required: true, message: 'Please enter the prescription status', trigger: 'blur'}],
       },
       addPrescriptionForm: {
         id: '',
         medicalID: '',
         registerID: '',
         userID: '',
         prescriptionName: null,
         prescriptionTime: null,
         prescriptionState: '',
       },
       addPrescriptionFormRules: {
         id: [{required: true, message: 'Please enter ID', trigger: 'blur'}],
         medicalID: [{required: true, message: 'Please enter medical record ID', trigger: 'blur'}],
         registID: [{required: true, message: 'Please enter the registration ID', trigger: 'blur'}],
         userID: [{required: true, message: 'Please enter the issuing doctor ID', trigger: 'blur'}],
         prescriptionName: [{required: true, message: 'Please enter the prescription name', trigger: 'blur'}],
         prescriptionTime: [{required: true, message: 'Please enter the prescription time', trigger: 'blur'}],
         prescriptionState: [{required: true, message: 'Please enter prescription status', trigger: 'blur'}],
       },
       addDialogVisible: false,
       currentPage: 1,
       currentPageForDetail: 1,
       pageSize: 5,
       pageSizeForDetail: 5,
       isChooseDetail: false,
       detailLoading: false,
       detail: [],
       addDrugDialogVisible: false,
       addDrugForm: {
         id: '',
         prescriptionID: '',
         drugsID: '',
         drugsUsage: '',
         dosage: '',
         frequency: '',
         amount: '',
         state: 2,
         drugsName: '',
       },
       addDrugFormRules: {
         id: [{required: true, message: 'Please enter ID', trigger: 'blur'}],
         prescriptionID: [{required: true, message: 'Please enter prescription ID', trigger: 'blur'}],
         drugsID: [{required: true, message: 'Please enter the drug ID', trigger: 'blur'}],
         drugsUsage: [{required: true, message: 'Please enter usage', trigger: 'blur'}],
         dosage: [{required: true, message: 'Please enter the dosage', trigger: 'blur'}],
         frequency: [{required: true, message: 'Please enter frequency', trigger: 'blur'}],
         amount: [{required: true, message: 'Please enter the quantity', trigger: 'blur'}],
         state: [{required: true, message: 'Please enter the drug status', trigger: 'blur'}],
         drugsName: [{required: true, message: 'Please enter the drug name', trigger: 'blur'}],
       },
       drugsLoading: false,
       drugsValue: [],
       drugsOptions: [],
       drugsList: [],
       drugsStates: [],
       chooseTemp: null,
       templateLoading: false,
       drugsTemplate: [],
       currentPageForTemplate: 1,
       pageSizeForTemplate: 3,
       isChooseTemplate: false,
       templateRadio: 0,
       isChooseTemplateDetail: false,
       drugsTemplateDetail: [],
       currentPageForTemplateDetail: 1,
       pageSizeForTemplateDetail: 3,
       templateDetailLoading: false,
       tempTemplate: [],
       addTemplateDialogVisible: false,
       addTemplateForm: {
         id: '',
         name: '',
         userID: '',
         creationTime: '',
         scope: '',
         delMark: 1
       },
       addTemplateFormRules: {
         id: [{required: true, message: 'Please enter ID', trigger: 'blur'}],
         name: [{required: true, message: 'Please enter the template name', trigger: 'blur'}],
         userID: [{required: true, message: 'Please enter doctor ID', trigger: 'blur'}],
         creationTime: [{required: true, message: 'Please enter the creation time', trigger: 'blur'}],
         scope: [{required: true, message: 'Please enter the usage scope', trigger: 'blur'}],
         delMark: 1
       },
       addTemplateDetailDialogVisible: false,
       addTemplateDetailForm: {
         id: '',
         drugsTempID: '',
         drugsID: '',
         drugsUsage: '',
         dosage: '',
         frequency: '',
         drugsName: ''
       },
       addTemplateDetailFormRules: {
         id: [{required: true, message: 'Please enter ID', trigger: 'blur'}],
         drugsTempID: [{required: true, message: 'Please enter the drug template ID', trigger: 'blur'}],
         drugsID: [{required: true, message: 'Please enter the drug ID', trigger: 'blur'}],
         drugsUsage: [{required: true, message: 'Please enter usage', trigger: 'blur'}],
         dosage: [{required: true, message: 'Please enter the dosage', trigger: 'blur'}],
         frequency: [{required: true, message: 'Please enter frequency', trigger: 'blur'}],
         drugsName: [{required: true, message: 'Please enter the drug name', trigger: 'blur'}],
       },
       prescriptionLoading: false,


     }
   },
   mounted() {
     this.initUser();
     this.initPatient();
     this.initDrugsPrepare();
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
     prescriptionData() {
       if (this.prescription.length > 0) {
         return this.prescription.slice( (this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) || [];
       }
       return this.prescription;
     },
     detailData() {
       if (this.detail.length > 0) {
         return this.detail.slice( (this.currentPageForDetail - 1) * this.pageSizeForDetail, this.currentPageForDetail * this.pageSizeForDetail) || [];
       }
       return this.detail;
     },
     drugsTemplateData() {
       if (this.drugsTemplate.length > 0) {
         return this.drugsTemplate.slice( (this.currentPageForTemplate - 1) * this.pageSizeForTemplate, this.currentPageForTemplate * this.pageSizeForTemplate) || [];
       }
       return this.drugsTemplate;
     },
     drugsTemplateDetailData() {
       if (this.drugsTemplateDetail.length > 0) {
         return this.drugsTemplateDetail.slice( (this.currentPageForTemplateDetail - 1) * this.pageSizeForTemplateDetail, this.currentPageForTemplateDetail * this.pageSizeForTemplateDetail) || [];
       }
       return this.drugsTemplateDetail;
     }
   },
   methods: {
     initUser() {
       console.log("presentUser.id: ", this.presentUser.id);
       this.presentUser = JSON.parse(localStorage.getItem("User"));
       console.log("Initializing doctor:", this.presentUser);
     },
     currentChange(currentPage) {
       this.currentPage = currentPage;
       this.initPrescription(this.choosedPatient.CaseNumber);
     },
     sizeChange(currentSize) {
       this.pageSize = currentSize;
       this.initPrescription(this.choosedPatient.CaseNumber);
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
             url = '/outpatientDoctorWorkStation/patentPrescription/searchByName';
             param = this.$qs.stringify(this.searchPatient);
             console.log("Patient searched:", this.searchPatient);
             this.$axios.post(url, param).then(res => {
               console.log("Medical record number search results:", res);
               this.patients = res.data.data;})
           }
         })
       } else {
         console.log("enter else");
         this.$refs[ruleForm].validate((valid) => {
           if (valid) {
             url = '/outpatientDoctorWorkStation/patentPrescription/searchByNumber';
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
     resetRecord(ruleForm) {
       this.$refs[ruleForm].resetFields();
     },
     reset(ruleForm) {
       this.$refs[ruleForm].resetFields();
       this.initPatient();
     },
     choosePatient(row) {
       console.log("Selected patient:", row);

       this.$nextTick(() => {
         this.isChoose = true;
         this.choosedPatient.RealName = row.realName;
         this.choosedPatient.CaseNumber = row.caseNumber;
         this.choosedPatient.Gender = row.gender;
         this.choosedPatient.Age = row.age;
         this.choosedPatient.RegistID = row.id;
         this.getMedicalID(row.caseNumber);
       })
       console.log("choosedPatient = ", this.choosedPatient);
       this.initPrescription(row.caseNumber);
     },
     sizeChangeForPatient(currentSize) {
       this.pageSizeForPatient = currentSize;
       this.initPatient();
     },
     currentChangeForPatient(currentPage) {
       this.currentPageForPatient = currentPage;
       this.initPatient();
     },
     initPatient() {
       this.loading = true;
       let url = '/outpatientDoctorWorkStation/patentPrescription/initPatients';
       let param = JSON.parse(localStorage.getItem("User"));
       this.$axios.post(url, param).then(res => {
         this.loading = false;
         console.log("All patients:", res);
         this.patients = res.data.data;
       })
     },
     initPrescription(number) {
       console.log("Patient's medical record number CaseNumber: ", number);
       let url = '/outpatientDoctorWorkStation/patentPrescription/initPrescription';
       let param = {
         CaseNumber: number
       };
       this.$axios.post(url, this.$qs.stringify(param)).then(res => {
         console.log("Initialized drug information:", res.data.data);
         this.prescription = res.data.data;
       })
     },
     tempPrescription(row) {
       let url = '/outpatientDoctorWorkStation/patentPrescription/tempPrescription';
       row.prescriptionState = 1;
       let param = row;
       console.log("Prescription to be temporarily saved:", param);
       this.$axios.post(url, param).then(res => {

       })
     },
     sendPrescription(row) {
       let url = '/outpatientDoctorWorkStation/patentPrescription/sendPrescription';
       row.prescriptionState = 3;
       let param = row;
       console.log("Prescription to be sent:", param);
       this.$axios.post(url, param).then(res => {

       })
     },
     deletePrescription(row) {
       let url = '/outpatientDoctorWorkStation/patentPrescription/deletePrescription';
       row.prescriptionState = 4;
       let param = row;
       console.log("Prescription to be deleted:", param);
       this.$axios.post(url, param).then(res => {

       })
     },
     cancelPrescription(row) {
       let url = '/outpatientDoctorWorkStation/patentPrescription/cancelPrescription';
       row.prescriptionState = 0;
       let param = row;
       console.log("Prescription about to be invalidated:", param);
       this.$axios.post(url, param).then(res => {

       })
     },
     chooseDetail(row) {
       this.isChooseDetail = true;
       console.log("Selected prescription:", row);
       this.initDetail(row);
       this.chooseTemp = row;
     },
     initDetail(row) {
       let url = '/outpatientDoctorWorkStation/patentPrescription/initDetail';
       let param = row;
       this.$axios.post(url, param).then(res => {
         if (res.data.data) {
           this.detail = res.data.data;
         }

         console.log("Prescription details:", this.detail);
       })
       this.initDrugs();
     },
     addPrescription(formName) {
       this.$refs[formName].validate((valid) => {
         if (valid) {
           this.getMedicalID(this.choosedPatient.CaseNumber);
           this.addPrescriptionForm.medicalID = this.choosedPatient.MedicalID;
           this.addPrescriptionForm.registID = this.choosedPatient.RegistID;
           this.addPrescriptionForm.userID = this.presentUser.id;
           this.addPrescriptionForm.prescriptionState = 1;
           console.log("Prescription to be added:", this.addPrescriptionForm);
           let url = '/outpatientDoctorWorkStation/patentPrescription/addPrescription';
           let param = this.addPrescriptionForm;
           this.$axios.post(url, param).then(res => {
             this.initPrescription(this.choosedPatient.CaseNumber);
           })
           this.addDialogVisible = false;
           this.$refs[formName].resetFields();
         }
       })

     },
     getMedicalID(CaseNumber) {
       let url = '/outpatientDoctorWorkStation/patentPrescription/getMedicalID';
       let param = {
         CaseNumber : CaseNumber
       }

       this.$axios.post(url, this.$qs.stringify(param)).then(res => {
         console.log("Conversion result:", res.data.data);
         this.choosedPatient.MedicalID = res.data.data;
       })
     },
     resetPrescription(formName) {
       console.log("Reset");
       this.addApplyForm = {};
       this.$refs[formName].resetFields();
       this.initPrescription(this.choosedPatient.CaseNumber);
     },
     addDrugs(formName) {
       this.addDrugForm.drugsName = this.drugsValue;
       this.$refs[formName].validate((valid) => {
         if (valid) {
           this.addDrugForm.prescriptionID = this.chooseTemp.id;
           this.addDrugForm.drugsID = this.drugsValue;
           this.addDrugForm.state = 2;

           console.log("Drug to be added:", this.addDrugForm);
           let url = '/outpatientDoctorWorkStation/patentPrescription/addDrugs';
           let param = this.addDrugForm;
           this.$axios.post(url, this.$qs.stringify(param)).then(res => {
             this.initDetail(this.chooseTemp);
             this.resetDrug(formName);
             this.addDrugDialogVisible = false;
           })
         }

       })

     },
     deleteDrugs(row) {
       console.log("Medicine to be deleted:", row);
       let url = '/outpatientDoctorWorkStation/patentPrescription/deleteDrugs';
       let param = row;
       this.$axios.post(url, param).then(res => {
         this.initDetail(this.chooseTemp);
       })

     },
     resetDrug(formName) {
       console.log("Reset");
       this.addDrugForm = {};
       this.$refs[formName].resetFields();
     },
     remoteMethod(query) {
       if (query !== '') {
         this.drugsLoading = true;
         setTimeout(() => {
           this.drugsLoading = false;
           this.drugsOptions = this.drugsList.filter(item => {
             return item.label.toLowerCase()
                 .indexOf(query.toLowerCase()) > -1;
           });
         }, 200);
       } else {
         this.drugsOptions = [];
       }
     },
     initDrugsPrepare() {
       let url = '/outpatientDoctorWorkStation/patentPrescription/initDrugsPrepare';
       this.$axios.post(url).then(res => {
         this.drugsStates = res.data.data;
         console.log("drugsStates : ", res.data.data);

       })
     },
     initDrugs() {
       var i = 0;
       console.log("Execute initDisease");
       this.drugsList = this.drugsStates.map(item => {
         return {value: `${item.ID}`, label: `${item.DrugsName}`}
       })


     },
     initTemplate() {
       this.isChooseTemplate = true;
       let url = '';
       let param = '';
       if (this.templateRadio === 1) {
         url = '/outpatientDoctorWorkStation/patentPrescription/getDrugsTemplateByHospital'
         this.$axios.post(url).then(res => {
           console.log("Initialization generated template:", res);
           this.drugsTemplate = res.data.data;
           console.log("this.templates.length:", this.drugsTemplate.length);
         })
       } else if (this.templateRadio === 2) {
         url = '/outpatientDoctorWorkStation/patentPrescription/getDrugsTemplateByDepartment'
         param = JSON.parse(localStorage.getItem("User"));
         this.$axios.post(url, param).then(res => {
           console.log("Initialization generated template:", res);
           this.drugsTemplate = res.data.data;
         })
       } else {
         url = '/outpatientDoctorWorkStation/patentPrescription/getDrugsTemplatePersonally'
         param = JSON.parse(localStorage.getItem("User"));
         this.$axios.post(url, param).then(res => {
           console.log("Initialization generated template:", res);
           this.drugsTemplate = res.data.data;
         })
       }
     },
     addTemplate() {
       this.addTemplateDialogVisible = true;
     },
     addTemplateConfirm(formName) {
       this.$refs[formName].validate((valid) => {
         if (valid) {
           let url = '/outpatientDoctorWorkStation/patentPrescription/addTemplateConfirm';
           let param = this.addTemplateForm;
           this.addTemplateForm.userID = this.presentUser.id;
           console.log("Template to be added:", this.addTemplateForm);
           this.$axios.post(url, param).then(res => {
             this.initTemplate();
             this.addTemplateDialogVisible = false;
           })

         }
       })
     },
     resetTemplate(formName) {
       this.$refs[formName].resetFields();
     },
     chooseTemplate(row) {
       this.tempTemplate = row;
       this.isChooseTemplateDetail = true;
       console.log("Selected template:", row);
       let url = '/outpatientDoctorWorkStation/patentPrescription/chooseTemplate';
       let param = row;
       this.$axios.post(url, param).then(res => {
         this.drugsTemplateDetail = res.data.data;
       })
     },
     deleteTemplate(row) {
       console.log("Deleted template:", row);
       let url = '/outpatientDoctorWorkStation/patentPrescription/deleteTemplate';
       let param = row;
       this.$axios.post(url, param).then(res => {
         this.initTemplate();
         this.isChooseTemplateDetail = false;
       })
     },
     applyTemplateDetail(row) {
       console.log("this.chooseTemp：", this.chooseTemp);

       this.addDrugForm.prescriptionID = this.chooseTemp.id;
       this.addDrugForm.drugsID = row.drugsID;
       this.addDrugForm.drugsUsage = row.drugsUsage;
       this.addDrugForm.dosage = row.dosage;
       this.addDrugForm.frequency = row.frequency;
       this.addDrugForm.amount = 1;
       this.addDrugForm.state = 2;
       console.log("Template details to be applied 2:", this.addDrugForm);
       let url = '/outpatientDoctorWorkStation/patentPrescription/addDrugs';
       let param = this.addDrugForm;
       this.$axios.post(url, this.$qs.stringify(param)).then(res => {
         this.initDetail(this.chooseTemp);
         this.addDrugForm.prescriptionID = '';
         this.addDrugForm.drugsID = '';
         this.addDrugForm.drugsUsage = '';
         this.addDrugForm.dosage = '';
         this.addDrugForm.frequency = '';
         this.addDrugForm.amount = '';
       })


     },
     deleteTemplateDetail(row) {
       console.log("Details of templates to be deleted:", row);
       let url = '/outpatientDoctorWorkStation/patentPrescription/deleteTemplateDetail';
       let param = row;
       this.$axios.post(url, param).then(res => {
         this.chooseTemplate(this.tempTemplate);
       })
     },
     addTemplateDetailConfirm(formName) {
       this.addTemplateDetailForm.drugsName = this.drugsValue;
       this.addTemplateDetailForm.drugsTempID = this.tempTemplate.id;
       this.addTemplateDetailForm.drugsID = this.drugsValue;

       this.$refs[formName].validate((valid) => {
         if (valid) {
           console.log("Details of the patent medicine template to be added:", this.addTemplateDetailForm);
           let url = '/outpatientDoctorWorkStation/patentPrescription/addTemplateDetailConfirm';
           let param = this.addTemplateDetailForm;
           this.$axios.post(url, param).then(res => {
             this.chooseTemplate(this.tempTemplate);
             this.addTemplateDetailDialogVisible = false;
           })
         }
       })
     },
     resetTemplateDetail(formName) {
       this.$refs[formName].resetFields();
     },
     applyState(row, column) {
       switch (row[column.property]) {
         case 0:
           return 'voided';
         case 1:
           return 'temporary storage';
         case 3:
           return 'sent';
         case 4:
           return 'Deleted';
       }
     },
   }
}
</script>

<style scoped>

</style>