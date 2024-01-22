<template>
  <div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <el-collapse-transition>
              <div>
                <span>PATIENT TO BE CHECKED</span>
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
                          style="width: 571px">
                  <el-table-column align="center" prop="caseNumber" label="Medical record number" width="150"></el-table-column>
                  <el-table-column align="center" prop="realName" label="name" width="200"></el-table-column>
                  <el-table-column align="center" prop="age" label="age" width="100"></el-table-column>
                  <el-table-column align="center" fixed="right" label="operate" width="120">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="Select this patient and open a treatment program" placement="right">
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
            </el-collapse-transition>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <el-empty description="No patient selected." v-if="!isChoose"></el-empty>
            <el-collapse-transition>
              <div v-show="isChoose">
                <el-descriptions size="mini" title="Basic patient information" direction="vertical" :column="4" border>
                  <el-descriptions-item label="name" :span="2">{{choosedPatient.RealName}}</el-descriptions-item>
                  <el-descriptions-item label="Medical record number" :span="2">{{choosedPatient.CaseNumber}}</el-descriptions-item>
                  <el-descriptions-item label="age" :span="2">{{choosedPatient.Age}}</el-descriptions-item>
                  <el-descriptions-item label="Add a project" :span="2">
                    <el-button size="mini" type="success" @click="openAddApply">+</el-button>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-collapse-transition>
          </el-card>
        </el-col>
      </el-row>
      <div>
        <el-divider content-position="center">List of patient care items</el-divider>
      </div>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <el-empty description="No patient selected." v-if="!isChoose"></el-empty>
            <el-collapse-transition>
              <div v-show="isChoose" style="width: 100%">
                <el-table :data="itemData"
                          stripe
                          border
                          :default-sort = "{prop: 'date', order: 'descending'}"
                          v-loading="checkApplyLoading"

                          element-loading-text="loading"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.8)"
                          style="width: 100%">
                  <el-table-column align="center" prop="medicalID" label="Medical ID" width="75px"></el-table-column>
                  <el-table-column align="center" prop="name" label="Name of project" width="150px"></el-table-column>
                  <el-table-column align="center" prop="itemID" label="Project ID" width="75px"></el-table-column>
                  <el-table-column align="center" prop="objective" label="Purpose requirements" width="125px"></el-table-column>
                  <el-table-column align="center" prop="position" label="inspection site" width="125px"></el-table-column>
                  <el-table-column align="center" prop="isUrgent" label="isUrgent" width="100px">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.isUrgent === 1" type="danger" size="mini">Yes</el-tag>
                      <el-tag v-else type="primary" size="mini">No</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="result" label="Inspection results" width="150px"></el-table-column>
                  <el-table-column align="center" prop="state" label="state" :formatter="applyState" width="113px">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.state === 1" type="primary" size="mini">temporary deposit</el-tag>
                      <el-tag v-if="scope.row.state === 2" type="success" size="mini">Open</el-tag>
                      <el-tag v-if="scope.row.state === 3" type="success" size="mini">Fees paid</el-tag>
                      <el-tag v-if="scope.row.state === 4" type="info" size="mini">Registered</el-tag>
                      <el-tag v-if="scope.row.state === 5" type="warning" size="mini">Implementation completed</el-tag>
                      <el-tag v-if="scope.row.state === 6" type="danger" size="mini">Refunded fee</el-tag>
                      <el-tag v-if="scope.row.state === 0" type="danger" size="mini">Abolished</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="operate" width="300px">
                    <template slot-scope="scope">
                      <el-button-group>
                        <div>
                          <el-button v-if="!(scope.row.state===2) && !(scope.row.state===5)" style="color: #89e250" type="text" size="mini" :disabled="scope.row.state===2" @click="tempApply(scope.row)">temporary deposit</el-button>
                          <el-button v-else type="text" size="mini" :disabled="scope.row.state===2 || scope.row.state===5" @click="tempApply(scope.row)">temporary deposit</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button v-if="!(scope.row.state===2) && !(scope.row.state===5)" style="color: #e2cf1c" type="text" size="mini" :disabled="scope.row.state===2" @click="openEditApply(scope.row)">Editorial Board</el-button>
                          <el-button v-else type="text" size="mini" :disabled="scope.row.state===2 || scope.row.state===5" @click="openEditApply(scope.row)">Editorial Board</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button v-if="!(scope.row.state===2) && !(scope.row.state===5)" style="color: #0796b8" type="text" size="mini" :disabled="scope.row.state===2" @click="commitApply(scope.row)">open</el-button>
                          <el-button v-else type="text" size="mini" :disabled="scope.row.state===2 || scope.row.state===5" @click="commitApply(scope.row)">open</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button v-if="!(scope.row.state===2) && !(scope.row.state===5)" style="color: #fa7b0c" type="text" size="mini" :disabled="scope.row.state===2" @click="deleteApply(scope.row)">Delete</el-button>
                          <el-button v-else type="text" size="mini" :disabled="scope.row.state===2 || scope.row.state===5" @click="deleteApply(scope.row)">Delete</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button v-if="!(scope.row.state!==2) && !(scope.row.state===5)" style="color: #fa0707" type="text" size="mini" :disabled="scope.row.state!==2" @click="cancelApply(scope.row)">nullify</el-button>
                          <el-button v-else type="text" size="mini" :disabled="scope.row.state!==2 || scope.row.state===5" @click="cancelApply(scope.row)">nullify</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-popover
                              placement="right"
                              width="400"
                              trigger="click">
                            <el-descriptions :data="scope.row" size="mini" title="Information on patient outcomes" direction="vertical" :column="4" border>
                              <el-descriptions-item :span="2" width="100" property="name" label="Name of project">{{scope.row.name}}</el-descriptions-item>
                              <el-descriptions-item :span="2" width="100" property="objective" label="Purpose requirements">{{scope.row.objective}}</el-descriptions-item>
                              <el-descriptions-item :span="2" width="100" property="position" label="inspection site">{{scope.row.position}}</el-descriptions-item>
                              <el-descriptions-item :span="2" width="100" property="result" label="Inspection results">{{scope.row.result}}</el-descriptions-item>
                            </el-descriptions>
                            <el-button v-if="!(scope.row.state!==5)" style="color: #d828ff" type="text" size="mini" :disabled="scope.row.state!==5" slot="reference">result</el-button>
                            <el-button v-else type="text" size="mini" :disabled="scope.row.state!==5" slot="reference">result</el-button>
                          </el-popover>
                        </div>
                      </el-button-group>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    background
                    :hide-on-single-page="applyCheckList.length <= pageSize"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="pageSize"
                    :current-page.sync="currentPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="applyCheckList.length">
                </el-pagination>
              </div>
            </el-collapse-transition>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-dialog title="Add a project" :visible.sync="addDialogVisible" width="80%">
        <el-form :model="addApplyForm" :rules="addApplyFormRules" ref="addApplyForm" width="80%">
          <el-descriptions class="margin-top" :column="3" size="small" border>
            <el-descriptions-item label="Name of project">
              <template>
                <el-form-item prop="name">
                  <el-select v-model="addApplyForm.name" placeholder="Please select an item">
                    <el-option v-for="item in itemName"
                               :key="item.ID"
                               :label="item.ItemName"
                               :value="item.ItemName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Purpose requirements">
              <template>
                <el-form-item prop="objective">
                  <el-input type="textarea" v-model="addApplyForm.objective" placeholder="Please enter the purpose requirement"></el-input>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="inspection site">
              <template>
                <el-form-item prop="position">
                  <el-input type="textarea" v-model="addApplyForm.position" placeholder="Please enter the inspection area"></el-input>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="isUrgent">
              <template>
                <el-form-item prop="isUrgent">
                  <el-radio-group v-model="addApplyForm.isUrgent">
                    <el-radio :label="1">yes</el-radio>
                    <el-radio :label="0">no</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Number">
              <template>
                <el-form-item prop="num">
                  <el-input-number v-model="addApplyForm.num" :min="1" label="Please enter the number"></el-input-number>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Opening time">
              <template>
                <el-form-item prop="creationTime">
                  <el-date-picker
                      v-model="addApplyForm.creationTime"
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
            <el-button type="info" @click="resetApply('addApplyForm')" icon="el-icon-refresh">Reset</el-button>
            <el-button type="primary" @click="addDialogVisible = false; resetApply('addApplyForm')" icon="el-icon-close">Cancel</el-button>
            <el-button type="success" @click="addApply('addApplyForm')" icon="el-icon-plus">Add</el-button>
          </el-button-group>
        </div>
      </el-dialog>
      <el-dialog title="Modification of projects" :visible.sync="editDialogVisible" width="80%" @close="editDialogVisible = false; resetApply('addApplyForm')">
        <el-form :model="addApplyForm" :rules="addApplyFormRules" ref="addApplyForm" width="80%">
          <el-descriptions class="margin-top" :column="3" size="small" border>
            <el-descriptions-item label="Name of project">
              <template>
                <el-form-item prop="name">
                  <el-select v-model="addApplyForm.name" placeholder="Please select an item">
                    <el-option v-for="item in itemName"
                               :key="item.ID"
                               :label="item.ItemName"
                               :value="item.ItemName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Purpose requirements">
              <template>
                <el-form-item prop="objective">
                  <el-input type="textarea" v-model="addApplyForm.objective" placeholder="Please enter the purpose requirement"></el-input>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="inspection site">
              <template>
                <el-form-item prop="position">
                  <el-input type="textarea" v-model="addApplyForm.position" placeholder="Please enter the inspection area"></el-input>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="isUrgent">
              <template>
                <el-form-item prop="isUrgent">
                  <el-radio-group v-model="addApplyForm.isUrgent">
                    <el-radio :label="1">yes</el-radio>
                    <el-radio :label="0">no</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Number">
              <template>
                <el-form-item prop="num">
                  <el-input-number v-model="addApplyForm.num" :min="1" label="Please enter the number"></el-input-number>
                </el-form-item>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="Opening time">
              <template>
                <el-form-item prop="creationTime">
                  <el-date-picker
                      v-model="addApplyForm.creationTime"
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
            <el-button type="info" @click="resetApply('addApplyForm')" icon="el-icon-refresh">Reset</el-button>
            <el-button type="primary" @click="editDialogVisible = false; resetApply('addApplyForm')" icon="el-icon-close">Cancel</el-button>
            <el-button type="success" @click="editApply('addApplyForm')" icon="el-icon-edit">Edit</el-button>
          </el-button-group>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "DisposalApplication",
  data() {
    return {
      prop: 'RealName',
      searchByName: true,
      presentUser: {},
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
      patients: [],
      currentPageForPatient: 1,
      currentPage: 1,
      pageSizeForPatient: 3,
      pageSize: 5,
      loading: false,
      choosedPatient: {
        ID: '',
        RegistID: '',
        RealName: '',
        CaseNumber: '',
        Gender: '',
        Age: '',
      },
      checkApplyLoading: false,
      addDialogVisible: false,
      applyCheckList: [],
      applyList: {
        ID: '',
        MedicalID: '',
        RegistID: '',
        ItemID: '',
        Name: '',
        Objective: '',
        Position: '',
        IsUrgent: '',
        Num: '',
        CreationTime: '',
        DoctorID: '',
        CheckOperID: '',
        ResultOperID: '',
        CheckTime: '',
        Result: '',
        ResultTime: '',
        State: '',
        RecordType: '',
      },
      isChoose: false,
      addApplyForm: {
        id: '',
        medicalID: '',
        registID: '',
        itemID: '',
        name: '',
        objective: '',
        position: '',
        isUrgent: '',
        num: '',
        creationTime: '',
        doctorID: '',
        checkOperID: '',
        resultOperID: '',
        checkTime: '',
        result: '',
        resultTime: '',
        state: '',
        recordType: '',
      },
      addApplyFormRules: {
        id: [{required: true, message: 'Please enter your ID', trigger: 'blur'}],
        medicalID: [{required: true, message: 'Please enter the first page ID.', trigger: 'blur'}],
        registID: [{required: true, message: 'Please enter your medical ID.', trigger: 'blur'}],
        itemID: [{required: true, message: 'Please enter the project ID', trigger: 'blur'}],
        name: [{required: true, message: 'Please enter the project name', trigger: 'blur'}],
        objective: [{required: true, message: 'Please enter the purpose requirement', trigger: 'blur'}],
        position: [{required: true, message: 'Please enter the inspection area', trigger: 'blur'}],
        isUrgent: [{required: true, message: 'Please enter whether urgent', trigger: 'blur'}],
        num: [{required: true, message: 'Please enter the number', trigger: 'blur'}],
        creationTime: [{required: true, message: 'Please enter the opening time', trigger: 'blur'}],
        doctorID: [{required: true, message: 'Please enter your doctor ID.', trigger: 'blur'}],
        checkOperID: [{required: true, message: 'Please enter inspector ID', trigger: 'blur'}],
        resultOperID: [{required: true, message: 'Please enter the result input personnel ID', trigger: 'blur'}],
        checkTime: [{required: true, message: 'Please enter the inspection time', trigger: 'blur'}],
        result: [{required: true, message: 'Please enter the results of the inspection', trigger: 'blur'}],
        resultTime: [{required: true, message: 'Please enter the result time', trigger: 'blur'}],
        state: [{required: true, message: 'Please enter status', trigger: 'blur'}],
        recordType: [{required: true, message: 'Please enter record type', trigger: 'blur'}],
      },
      itemName: [],
      editDialogVisible: false,
    }
  },
  mounted() {
    this.initUser();
    this.initPatient();
    if (this.isChoose === true) {
      this.initApply(this.choosedPatient.ID);
    }

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
    itemData() {
      if (this.applyCheckList.length > 0) {
        return this.applyCheckList.slice( (this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) || [];
      }
      return this.applyCheckList;
    }
  },
  methods: {
    initUser() {
      console.log("presentUser.id: ", this.presentUser.id);
      this.presentUser = JSON.parse(localStorage.getItem("User"));
      console.log("Initialization of Doctor:", this.presentUser);
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initApply(this.choosedPatient.ID);
    },
    sizeChange(currentSize) {
      this.pageSize = currentSize;
      this.initApply(this.choosedPatient.ID);
    },



    currentChangeForPatient(currentPage) {
      this.currentPageForPatient = currentPage;
      this.initPatient();
    },
    sizeChangeForPatient(currentSize) {
      this.pageSizeForPatient = currentSize;
      this.initPatient();
    },
    initPatient() {
      this.loading = true;
      let url = '/outpatientDoctorWorkStation/disposalApplicationService/initPatients';
      let param = JSON.parse(localStorage.getItem("User"));
      this.$axios.post(url, param).then(res => {
        this.loading = false;
        console.log("All patients:", res);
        this.patients = res.data.data;
      })
    },
    choosePatient(row) {
      console.log("Selected patients:", row);
      this.$nextTick(() => {
        this.isChoose = true;
        this.choosedPatient.RealName = row.realName;
        this.choosedPatient.CaseNumber = row.caseNumber;
        this.choosedPatient.ID = row.id;
        this.choosedPatient.RegistID = row.registID;
        this.choosedPatient.Age = row.age;
      })

      this.applyList.MedicalID = row.id;
      this.initApply(row.id);
    },
    initApply(number) {
      let url = '/outpatientDoctorWorkStation/disposalApplicationService/initApply';
      let param = {

        ID: number,
      }
      console.log("number = ", number);
      console.log("param = ", param);
      this.$axios.post(url, this.$qs.stringify(param)).then(res => {
        console.log("Initialize medical record information:", res);
        if (res.data.data) {
          this.applyCheckList = res.data.data;
          console.log("Initialized medical record information 2:", this.applyCheckList);

          this.applyList.ID = res.data.data.id;
          this.applyList.MedicalID = res.data.data.medicalID;
          this.applyList.RegistID = res.data.data.registID;
          this.applyList.ItemID = res.data.data.itemID;
          this.applyList.Name = res.data.data.name;
          this.applyList.Objective = res.data.data.objective;
          this.applyList.Position = res.data.data.position;
          this.applyList.IsUrgent = res.data.data.isUrgent;
          this.applyList.Num = res.data.data.num;
          this.applyList.CreationTime = res.data.data.creationTime;
          this.applyList.DoctorID = res.data.data.doctorID;
          this.applyList.CheckOperID = res.data.data.checkOperID;
          this.applyList.ResultOperID = res.data.data.resultOperID;
          this.applyList.CheckTime = res.data.data.checkTime;
          this.applyList.Result = res.data.data.result;
          this.applyList.ResultTime = res.data.data.resultTime;
          this.applyList.State = res.data.data.state;
          console.log("initApply的this.applyList", res.data.data);
        }

      })
    },
    applyState(row, column) {
      switch (row[column.property]) {
        case 0:
          return 'Abolished';
        case 1:
          return 'temporary deposit';
        case 2:
          return 'Open';
        case 3:
          return 'Fees paid';
        case 4:
          return 'Registered';
        case 5:
          return 'Implementation completed';
        case 6:
          return 'Refunded fee';
      }
    },
    tempApply(row) { 
      let url = '/outpatientDoctorWorkStation/disposalApplicationService/tempApply';
      row.state = 1;
      let param = row;
      console.log("Upcoming projects:", param);
      this.$axios.post(url, param).then(res => {

      })
    },
    openEditApply(row) {
      this.editDialogVisible = true;
      this.initItemName();
      this.addApplyForm = row;
    },
    editApply() {
      this.$refs['addApplyForm'].validate((valid) => {
        if (valid) {
          let url = '/outpatientDoctorWorkStation/disposalApplicationService/editApply';
          let param = this.addApplyForm;
          console.log("Items to be modified:", param);
          this.$axios.post(url, param).then(res => {
            this.editDialogVisible = false;
          })
        }
      })
    },
    commitApply(row) {
      let url = '/outpatientDoctorWorkStation/disposalApplicationService/commitApply';
      row.state = 2;
      let param = row;
      console.log("Upcoming projects:", param);
      this.$axios.post(url, param).then(res => {

      })
    },
    deleteApply(row) {
      let url = '/outpatientDoctorWorkStation/disposalApplicationService/deleteApply';
      let param = row;
      console.log("Items to be deleted:", param);
      this.$axios.post(url, param).then(res => {
        this.initApply(this.choosedPatient.ID);
        console.log("currentPage = ", this.currentPage);
        console.log("pageSize = ", this.pageSize);
      })
    },
    cancelApply(row) {
      if (row.state !== 6) { 
        let url = '/outpatientDoctorWorkStation/disposalApplicationService/cancelApply';
        row.state = 0;
        let param = row;
        console.log("Projects to be abolished:", param);
        this.$axios.post(url, param).then(res => {

        })
      } else {
        Element.Message.warning("This item has been registered and cannot be cancelled");
      }

    },
    openAddApply() {
      this.addDialogVisible = true;
      this.initItemName();
    },
    addApply(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("ApplyList：", this.applyList);
          this.addApplyForm.medicalID = this.choosedPatient.ID;
          this.addApplyForm.registID = this.choosedPatient.RegistID;
          this.addApplyForm.doctorID = this.presentUser.id;
          this.addApplyForm.checkOperID = 1;
          this.addApplyForm.resultOperID = 1;
          this.addApplyForm.itemID = this.itemNameToID(this.addApplyForm.name);
          this.addApplyForm.state = 1;
          this.addApplyForm.recordType = 3;
          console.log("Items to be added:", this.addApplyForm);
          let url = '/outpatientDoctorWorkStation/disposalApplicationService/addApply';
          let param = this.addApplyForm;
          this.$axios.post(url, param).then(res => {
            this.initApply(this.choosedPatient.ID);
          })
          this.addDialogVisible = false;
          this.$refs[formName].resetFields();
        }
      })

    },
    itemNameToID(name) {
      for (let i=0; i<this.itemName.length; i++) {
        if (name === this.itemName[i].ItemName) {
          return this.itemName[i].ID;
        }
      }
      return null
    },
    resetApply(formName) {
      console.log("reset");
      this.addApplyForm = {};
      this.$refs[formName].resetFields();
      this.initApply(this.choosedPatient.ID);
    },
    initItemName() {
      let url = '/outpatientDoctorWorkStation/disposalApplicationService/initItemName';
      this.$axios.post(url).then(res => {
        console.log("Project Name:", res);
        this.itemName = res.data.data;
      })
    }
  }
}
</script>

<style scoped>

</style>
