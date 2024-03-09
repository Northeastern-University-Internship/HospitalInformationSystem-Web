<template>
   <div>
     <el-card class="box-card">
       <div class="search-box">
         <el-form :model="addForm" :inline="true">
           <el-input placeholder="Please enter medical record number"
                     style="width: 20%;"
                     v-model="addForm.caseNumber"
                     @clear="doQuery()">
           </el-input>
           <el-input placeholder="Please enter drug status"
                     style="width: 20%;"
                     v-model="addForm.state"
                     @clear="doQuery()">
           </el-input>
           <el-button icon="el-icon-search"
                       @click="doQuery()">
           </el-button>
           <el-button type="round" @click="back()" style="float:right" size="mini">Full Back</el-button>
         </el-form>
       </div>

       <el-table :data = "prescriptionList">
         <el-table-column label="Case number" prop="caseNumber"></el-table-column>
         <el-table-column label="prescription number" prop="id"></el-table-column>
         <el-table-column label="billing doctor" prop="userID"></el-table-column>
         <el-table-column label="drug name" prop="drugsName"></el-table-column>
         <el-table-column label="Specification" prop="drugsFormat"></el-table-column>
         <el-table-column label="quantity" prop="amount"></el-table-column>
         <el-table-column label="unit" prop="drugsUnit"></el-table-column>
         <el-table-column label="unit price" prop="drugsPrice"></el-table-column>
         <el-table-column label="lump sum" prop="sum"></el-table-column>
         <el-table-column label="factory" prop="manufacturer"></el-table-column>
         <el-table-column label="usage" prop="drugsUsage"></el-table-column>
         <el-table-column label="Dosage" prop="dosage"></el-table-column>
         <el-table-column label="state" prop="state">
           <template slot-scope="scope">
             <span v-if="scope.row.state === 2">Already opened</span>
             <span v-if="scope.row.state === 3">Paid</span>
             <span v-if="scope.row.state === 4">Medicine has been distributed</span>
             <span v-if="scope.row.state === 5">Withdrawal of medicine</span>
             <span v-if="scope.row.state === 6">Refunded</span>
           </template>

         </el-table-column>
         <el-table-column label="operate" width="100px">
           <!--Modify button-->
           <template slot-scope="scope">
             <el-button type="primary" size="mini"
                        @click="enableUpdateDialog(scope.row)">Withdrawal from medicine</el-button>
           </template>
         </el-table-column>

       </el-table>
     </el-card>

     <!--Modify user-->
     <el-dialog
         title="Please enter the quantity of returned medicine"
         :visible.sync="updateDialogVisable"
         width="50%" @close="updateDialogClosed">
       <el-form :model="currentRow" ref="addFormRed" label-width="100px" :rules="FormRules">

         <el-form-item label="Number of withdrawals" prop="amount">
           <el-input v-model="currentRow.amount"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class = "dialog-footer">
         <el-button type="primary"
                    @click="enableDialog();doSum()">confirm</el-button>
     <el-button @click="updateDialogVisable = false">Cancel</el-button>
   </span>

     </el-dialog>
     <el-dialog
         :visible.sync="DialogVisable"
         width="50%" @close="DialogClosed">
       <el-form :model="this.res" ref="addFormRed" label-width="100px" >
         <el-form-item label="Total amount of drug refund" prop="sum" >
           <el-input
               v-model="this.res"
               :disabled="true">
           </el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class = "dialog-footer">
     <el-button @click="DialogVisable = false">Cancel</el-button>
             <el-button type="primary"
                        @click="doUpdate()">confirm</el-button>
   </span>
     </el-dialog>
     <el-dialog
         :visible.sync="DialogVisable2"
         width="50%" @close="DialogClosed2">
       <el-form :model="this.sum" ref="addFormRed" label-width="100px" >
         <el-form-item label="Total drug refund amount" prop="sum" >
           <el-input
               v-model="this.sum"
               :disabled="true">
           </el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class = "dialog-footer">
     <el-button @click="DialogVisable2 = false">Cancel</el-button>
             <el-button type="primary"
                        @click="DialogVisable2 = false">confirm</el-button>
   </span>
     </el-dialog>
   </div>
</template>

<script>
export default {
   data() {
     return {
       sum:'',
       prescriptionList: [],
       addDialogVisable:false,
       updateDialogVisable:false,
       DialogVisable2:false,
       DialogVisable:false,
       addForm:{
         caseNumber:'',
         id: '',
         userId: '',
         drugsFormat: '',
         amount: '',
         drugsUnit: '',
         drugsPrice: '',
         sum: '',
         manufacturer: '',
         drugsUsage: '',
         dosage: '',
         state: '',
       },
       currentRow: {
         caseNumber:'',
         id: '',
         userId: '',
         drugsFormat: '',
         amount: '',
         drugsUnit: '',
         drugsPrice: '',
         sum: '',
         manufacturer: '',
         drugsUsage: '',
         dosage: '',
         state: '',
       },
       res:'',
       FormRules:{
         amount: [
           {required:true,message:"The quantity of withdrawn medicine cannot exceed the quantity of medicines",trigger:"blur"},
           {min:1,max:3,message: "The quantity of withdrawn medicine cannot exceed the quantity of medicines",trigger: "blur"}
         ],
       }
     }
   },

   created() {
     this.doQuery()
   },

   mounted(){
     this.prescriptionList = this.$route.query.prescriptionList;
   },

   methods: {
     doSum(){
       this.res = this.currentRow.amount * this.currentRow.drugsPrice
     },

     doQuery(){
       let url='/outpatientPharmacyWorkstation/outpatientWithdrawal/selectAll';
       let params = this.$qs.stringify(this.addForm);
       console.log('test')
       const cn = this.addForm.caseNumber
       console.log(params)
       this.$axios.post(url,params)
           .then( (resp)=>{
             this.prescriptionList=resp.data.data;
           } )
           .catch( (err)=>{
             console.log('error=', err);
           } )
     },

     updateDialogClosed() {
       this.$refs.addFormRed.resetFields()
     },
     DialogClosed() {
       this.$refs.addFormRed.resetFields()
     },
     DialogClosed2() {
       this.$refs.addFormRed.resetFields()
     },

     doUpdate(){
       console.log('33333333')
       console.log(this.currentRow)
       let params =this.$qs.stringify(this.currentRow);
       console.log(params)
       let url='/outpatientPharmacyWorkstation/outpatientWithdrawal/update';
       this.$axios.post(url,params)
           .then( (resp)=>{
             let i=resp.data.code;
             if(i==200){
               location.reload();
             }else{
               this.msg='Withdrawal failed'
             }
           } )
           .catch( (err)=>{
             console.log('error=', err);
           } )
       this.updateDialogVisable = false
     },

     enableUpdateDialog(param) {
       this.updateDialogVisable = true
       this.currentRow = param
       console.log('rrr')
       console.log(this.FormRules.amount[1])
       console.log('ddddd')
       this.FormRules.amount[1] = {min:0,max:this.currentRow.amount,message: "The number of withdrawals cannot exceed the number of drugs",trigger: "blur"}
       console.log(this.FormRules.amount[1])
       console.log('fff')
       console.log(this.currentRow)
     },
     enableDialog() {
       this.updateDialogVisable = false
       this.DialogVisable = true
       console.log('ddddd')
       console.log(this.currentRow)
     },
     enableDialog2() {
       this.DialogVisable2 = true
     },
     back(){
       console.log('33333333')
       console.log(this.addForm.caseNumber)
       let params =this.$qs.stringify(this.addForm);
       console.log(params)
       let url='/outpatientPharmacyWorkstation/outpatientWithdrawal/updateAll';
       this.$axios.post(url,params)
           .then( (resp)=>{
             let i=resp.data.code;
             this.sum = resp.data.data.sum;
             if(i==200){
               this.enableDialog2();
             }else{
               this.msg='Withdrawal failed'
             }
           } )
           .catch( (err)=>{
             console.log('error=', err);
           } )
       this.updateDialogVisable = false
     }
   }
}
</script>

<style scoped>

</style>