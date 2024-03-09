<template>
    <div>
      <el-input placeholder="Please type in your name" class="my_el_input" v-model="query_name">
        <el-button slot="append" icon="el-icon-search" @click="doQuery"></el-button>
      </el-input>
      <el-button-group>
        <el-button style="margin-left: 50px;" type="primary" @click="showAdvanceSearchView = !showAdvanceSearchView">
          <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
            aria-hidden="true"></i>
            registered
        </el-button>
      </el-button-group>
      <transition name="slide-fade">
        <div v-show="showAdvanceSearchView"
            style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
          <el-form :model="registerValue" :rules="registerRules" ref="registerValue">
            <el-row>
              <el-col :span="5">
                <el-form-item label="Medical record number:" prop="caseNumber">
                  <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                            v-model="registerValue.caseNumber" placeholder="Medical Record Number" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Name:" prop="realName">
                  <el-input v-model="registerValue.realName" placeholder="Name" size="mini"
                            style="width: 150px;" filterable>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="gender:" prop="Gender">
                  <el-select v-model="registerValue.gender" placeholder="gender" size="mini" style="width: 80px;">
                    <el-option
                        v-for="item in Gender"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Age:" prop="age">
                  <el-input v-model="registerValue.age" placeholder="Age" size="mini"
                            style="width: 140px;" filterable>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="" prop="ageType">
                  <el-select v-model="registerValue.ageType" placeholder="year" size="mini" style="width: 80px;">
                    <el-option
                        v-for="item in ageType"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Birthdate:" prop="birthDate">
                  <el-date-picker
                      v-model="registerValue.birthDate"
                      type="date"
                      placeholder="Select date">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="ID card number:" prop="iDnumber">
                  <el-input v-model="registerValue.iDnumber" placeholder="ID card number" size="mini"
                            style="width: 180px;" filterable>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="HomeAddress:" prop="homeAddress">
                  <el-input v-model="registerValue.homeAddress" placeholder="HomeAddress" size="mini"
                            style="width: 180px;" filterable>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="Goodbye:" prop="noon">
                  <el-select v-model="registerValue.noon" placeholder="Noon Farewell" size="mini" style="width: 80px;">
                    <el-option
                        v-for="item in Noon"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="Registration Department ID:" prop="deptID">
                  <el-input v-model="registerValue.deptID" placeholder="Registration Department ID" size="mini"
                            style="width: 150px;" filterable>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Visit date:" prop="visitDate">
                  <el-date-picker
                      v-model="registerValue.visitDate"
                      type="date"
                      placeholder="Select date">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="5">
                <el-form-item label="Registered doctor ID:" prop="userID">
                  <el-input v-model="registerValue.userID" placeholder="Registration Department ID" size="mini"
                            style="width: 155px;" filterable>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Registration level:" prop="registLeID">
                  <el-select v-model="registerValue.registLeID" placeholder="Registration Level" size="mini" style="width: 100px;">
                    <el-option
                        v-for="item in RegistLeID"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Settlement category:" prop="settleID">
                  <el-select v-model="registerValue.settleID" placeholder="At your own expense" size="mini" style="width: 120px;">
                    <el-option
                        v-for="item in settleID"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="Register ID:" prop="registerID">
                  <el-input v-model="registerValue.registerID" placeholder="Register ID" size="mini"
                            style="width: 160px;" filterable>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Registration time:" prop="registTime">
                  <el-date-picker
                      v-model="registerValue.registTime"
                      type="datetime"
                      placeholder="Select date and time">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="visit status:" prop="visitState">
                  <el-select v-model="registerValue.visitState" placeholder="Visit State" size="mini" style="width: 165px;">
                    <el-option
                        v-for="item in VisitState"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="Medical Record Book:" prop="isBook">
                  <el-select v-model="registerValue.isBook" placeholder="Medical Record Book" size="mini" style="width: 100px;">
                    <el-option
                        v-for="item in IsBook"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-button style="margin-left: 90%" type="success" @click="doAdd();doQuery()">Register</el-button>
                <!-- <el-button>Reset</el-button>-->
              </el-col>
            </el-row>
          </el-form>
        </div>
      </transition>
        <el-card class="card">
          <el-table
              :data="list"
              height="600"
              border
              stripe
              style="width: 100%">
            <el-table-column
                prop="caseNumber"
                fixed
                label="Medical Record Number"
                width="100">
            </el-table-column>
            <el-table-column
                prop="realName"
                label="name"
                width="100">
            </el-table-column>
            <el-table-column
                prop="gender"
                label="gender"
                :formatter="isGender"
                width="60">
            </el-table-column>
            <el-table-column
                prop="idnumber"
                label="ID card number"
                width="100">
            </el-table-column>
            <el-table-column
                prop="birthDate"
                label="date of birth"
                width="100">
            </el-table-column>
            <el-table-column
                prop="visitDate"
                label="Visiting time"
                width="100">
            </el-table-column>
            <el-table-column
                prop="deptID"
                label="Registration Department ID"
                width="100">
            </el-table-column>
            <el-table-column
                prop="visitDate"
                label="Date of consultation"
                width="100">
            </el-table-column>
            <el-table-column
                prop="registTime"
                label="Registration Date"
               width="170">
           </el-table-column>
           <el-table-column
               prop="visitState"
               label="whether it has been diagnosed"
               :formatter="whetherDiagnose"
               width="80">
           </el-table-column>
           <el-table-columnprop="isBook"
               label="Whether to collect medical records"
               :formatter="whetherBook"
               width="120">
           </el-table-columnprop=>
           <el-table-column
               prop="visitState"
               label="status"
               :formatter="stateShift"
               width="100">
           </el-table-column>
           <!-- <el-descriptions-item label="status" :span="2" v-if="registerValue.visitState===1"><el-tag type="success">Registered</el -tag></el-descriptions-item>-->
           <!-- <el-descriptions-item label="State" :span="2" v-else-if="registerValue.visitState===2"><el-tag type="warning">Doctor's consultation </el-tag></el-descriptions-item>-->
           <el-table-column label="Operation" width="130px">
              <template slot-scope="scope">
                <el-button type ="info" @click="doPrint(scope.row)" round>Print invoice</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div style="display: flex;justify-content: flex-end">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[1, 5, 10, 20, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper, ->, total, slot"
                :total="list.length">
            </el-pagination>
          </div> -->
        </el-card>
      <el-dialog
          title="Invoice information"
          :visible.sync="dialogPrint"
          width="45%"
          center>
        <el-form
            ref="form"
            :model="invoice"
            label-width="150px">
          <el-form-item label="Invoice number:">
          <el-card class="box-card" v-text="invoice.invoiceNum">
          </el-card>
          </el-form-item>
          <el-form-item label="Invoice amount:">
            <el-card class="box-card" v-text="invoice.money">
            </el-card>
          </el-form-item>
          <el-form-item label="Invoice status:">
            <el-card class="box-card" v-text="invoice.state">
            </el-card>
          </el-form-item>
          <el-form-item label="Collection/refund time:">
            <el-card class="box-card" v-text="invoice.creationTime">
            </el-card>
          </el-form-item>
          <el-form-item label="Collector/Refund Personnel ID:">
            <el-card class="box-card" v-text="invoice.userID">
            </el-card>
          </el-form-item>
          <el-form-item label="Registration ID:">
            <el-card class="box-card" v-text="invoice.registID">
            </el-card>
          </el-form-item>
          <el-form-item label="Charging method:">
            <el-card class="box-card" v-text="invoice.feeType">
            </el-card>
          </el-form-item>
          <el-form-item label="Red invoice number:">
            <el-card class="box-card" v-text="invoice.back">
            </el-card>
          </el-form-item>
          <el-form-item label="Invoice status:">
            <el-card class="box-card" v-text="invoice.dailyState">
            </el-card>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPrint = false">Cancel</el-button>
          <el-button type="primary" @click="dialogPrint = false">OK</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
import moment from 'moment';
export default {
   name: "OnSiteRegistration",
   data(){
     return{
       registerValue:{
         caseNumber:'',
         realName:'',
         gender:'',
         iDnumber:'',
         birthDate:'',
         age:'',
         ageType:'',
         homeAddress:'',
         visitDate:'',
         noon:'',
         deptID:'',
         userID:'',
         registerLeID:'',
         settleID:'',
         isBook:'',
         registerTime:'',
         registerID:'',
         visitState:'',
       },
       register:{
         CaseNumber:'60',
     },
       query_name:'',
       list:[],
       invoice:[],
       Gender:['male','female'],
       ageType:['year','month','day'],
       settleID:['self-pay','municipal medical insurance'],
       deptID:[],
       showAdvanceSearchView:false,
       currentPage: 1,
       pageSize:10,
       dialogPrint:false,
       VisitState:['Registered','Doctor consultation','Consultation ended','Canceled'],
       Noon:['morning','afternoon'],
       IsBook:['Yes','No'],
       RegistLeID:['normal account','expert account'],
       registerRules: {
         caseNumber: [{required: true, message: 'Please enter the medical record number', trigger: 'blur'}],
         realName: [{required: true, message: 'Please enter your real name', trigger: 'blur'}],
         gender: [{required: true, message: 'Please enter gender', trigger: 'blur'}],
         age: [{required: true, message: 'Please enter your age', trigger: 'blur'}],
         ageType: [{required: true, message: 'Please enter age type', trigger: 'blur'}],
         visitDate: [{required: true, message: 'Please enter the consultation time', trigger: 'blur'}],
         noon: [{required: true, message: 'Please enter a farewell', trigger: 'blur'}],
         deptID: [{required: true, message: 'Please enter the registration department ID', trigger: 'blur'}],
         userID: [{required: true, message: 'Please enter the registered doctor ID', trigger: 'blur'}],
         registLeID: [{required: true, message: 'Please enter the registration level', trigger: 'blur'}],
         settleID: [{required: true, message: 'Please enter the settlement category', trigger: 'blur'}],
         registerTime:[{required: true, message: 'Please enter the registration time', trigger: 'blur'}],
         registerID: [{required: true, message: 'Please enter the registration ID', trigger: 'blur'}],
         visitState: [{required: true, message: 'Please enter the registration status', trigger: 'blur'}],
       }
     }
   },
   created() {
     this.doQuery();
   },
   mounted() {
     this.initData();
   },
   methods:{
     initData(){
       this.$axios.post(`/register_clerk/selectAll?RealName=${this.query_name}`).then( (resp)=> {
         this.list = resp.data.data;
         console.log('list=',this.list)
       }).catch( (err)=> {
         console.log("err",err);
       })
     },
     doQuery(){
       this.$axios.post(`/register_clerk/selectAll?RealName=${this.query_name}`).then( (resp)=> {
         this.list = resp.data.data;
         console.log('list=',this.list)
       }).catch( (err)=> {
         console.log("err",err);
       })
       this.initData();
     },
     doAdd(){
       this.$refs['registerValue'].validate(valid => {
         if (valid) {
           if (this.registerValue.gender ==='male'){
             this.registerValue.gender = '71';
           } else {
             this.registerValue.gender = '72';
           }
           if (this.registerValue.settleID ==='at your own expense'){
             this.registerValue.settleID = '1';
           } else {
             this.registerValue.settleID = '2';
           }
           if (this.registerValue.registLeID ==='Expert ID'){
             this.registerValue.registLeID = '1';
           } else {
             this.registerValue.registLeID = '2';
           }
           if (this.registerValue.visitState ==='Registered'){
             this.registerValue.visitState = '1';
           } else if(this.registerValue.visitState === 'Doctor consultation'){
             this.registerValue.visitState = '2';
           } else if(this.registerValue.visitState === 'Visiting is over') {
             this.registerValue.visitState = '3';
           } else {
             this.registerValue.visitState = '4';
           }
           if (this.registerValue.isBook ==='is'){
             this.registerValue.registLeID = '1';
           } else {
             this.registerValue.registLeID = '0';
           }
           this.registerValue.registTime = moment(this.registerValue.registTime).format('YYYY-MM-DD HH:mm:ss');
           let param=this.$qs.stringify(this.registerValue)
           this.$axios.post('/register_clerk/register',param).then( (resp)=> {
             console.log(resp.data.msg)
           }).catch( (err)=> {
             console.log("err",err);
           })
         }
       })
     },
     doPrint(data){
       console.log(data);
       console.log(this.registerValue);
       this.dialogPrint = true;
       // let param=this.$qs.stringify(this.sterValue)
       this.$axios.post('/register_clerk/print',data).then( (resp)=> {
         this.invoice = resp.data.data
         console.log(this.invoice)
       }).catch( (err)=> {
         console.log("err",err);
       })
     },
     stateShift(row, column){
       if(row[column.property] === 1){
         return 'Registered'
       }else if(row[column.property] === 2){
         return 'doctor consultation'
       }else if(row[column.property] === 3){
         return 'Consultation ended'
       }else {
         return 'number has been withdrawn'
       }
     },
     whetherDiagnose(row, column){
       if(row[column.property] < 2) {
         return 'no'
       } else {
         return 'is'
       }
     },
     whetherBook(row, column){
       if(row[column.property] === '1') {
         return 'is'
       }else {
         return 'No'
       }
     },
     isGender(row, column) {
       if(row[column.property] === 71){
         return 'male'
       } else {
         return 'female'
       }
     },
     handleSizeChange(val) {
       this.pageSize = val;
       this.initData();
       // console.log(`${val} items per page`);
     },
     handleCurrentChange(val) {
       this.currentPage = val;
       this.initData();
       // console.log(`Current page: ${val}`);
     }
   }
}
</script>

<style scoped="scoped">
.card {
   background: #ececec;
   border:1px solid;
}
.box-card {
   width: 480px;
   height: 50px;
}
.my_el_input {
   width: 400px;
}
</style>