<template>
  <div>
    <el-card class="card">
      <el-input placeholder="Please enter case number" class="my_el_input" v-model="query_num">
        <el-button slot="append" icon="el-icon-search" @click="doQuery"></el-button>
      </el-input>
      <el-table
          :data="list"
          height="250"
          border
          stripe
          style="width: 100%">
        <el-table-column
            prop="id"
            fixed
            label="ID"
            width="60">
        </el-table-column>
        <el-table-column
            prop="caseNumber"
            label="Medical record number"
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
            label="ID number"
            width="100">
        </el-table-column>
        <el-table-column
            prop="deptID"
            label="Registration department ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="visitDate"
            label="Consultation date"
            width="100">
        </el-table-column>
        <el-table-column
            prop="registTime"
            label="Registration date"
            width="170">
        </el-table-column>
        <el-table-column
            prop="visitState"
            label="Has it been diagnosed?"
            :formatter="whetherDiagnose"
            width="80">
        </el-table-column>
        <el-table-column
            prop="visitState"
            label="state"
            :formatter="stateShift"
            width="100">
        </el-table-column>
        <el-table-column label="operate" width="180px">
          <template slot-scope="scope">
            <el-button type ="primary"  @click="getCharge(scope.row)" round size="mini">Show accounts</el-button>
            <el-button type ="success"  @click="doCharge(scope.row)" round size="mini" :disabled="disabledCharge">TOLL</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-row :gutter="20">
        <el-col :span="12">
          <h1 style="margin-left: 40%">Drug expense account</h1>
          <hr>
          <el-table
              :data="drugs_list"
              border
              stripe
              height="250">
            <el-table-column
                prop="drugsCode"
                fixed
                label="Drug number"
                width="140">
            </el-table-column>
            <el-table-column
                prop="drugsName"
                fixed
                label="Drug Name"
                width="120">
            </el-table-column>
            <el-table-column
                prop="drugsFormat"
                fixed
                label="drug specifications"
                width="130">
            </el-table-column>
            <el-table-column
                prop="manufacturer"
                fixed
                label="producer"
                width="100">
            </el-table-column>
            <el-table-column
                prop="drugsPrice"
                fixed
                label="Drug unit price (yuan)"
                width="120">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <h1 style="margin-left: 40%">Non-drug expense accounts</h1>
          <hr>
          <el-table
              :data="items_list"
              border
              stripe
              height="250">
            <el-table-column
                prop="itemCode"
                fixed
                label="Item Number"
                width="120">
            </el-table-column>
            <el-table-column
                prop="itemName"
                fixed
                label="project name"
                width="120">
            </el-table-column>
            <el-table-column
                prop="format"
                fixed
                label="Specification"
                width="120">
            </el-table-column>
            <el-table-column
                prop="recordType"
                fixed
                label="project type"
                :formatter="recordType"
                width="120">
            </el-table-column>
            <el-table-column
                prop="price"
                fixed
                label="Unit price (yuan)"
                width="120">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
        title="Invoice Information"
        :visible.sync="dialogInvoice"
        width="45%"
        center>
      <el-form
          ref="invoiceInFormation"
          :model="invoiceInFormation"
          label-width="150px">
        <el-form-item label="Invoice number:">
          <el-card class="box-card" v-text="invoiceInFormation.invoiceNum">
          </el-card>
        </el-form-item>
        <el-form-item label="Invoice amount:">
          <el-card class="box-card" v-text="invoiceInFormation.money">
          </el-card>
        </el-form-item>
        <el-form-item label="Invoice status:">
          <el-card class="box-card" v-text="invoiceInFormation.state">
          </el-card>
        </el-form-item>
        <el-form-item label="Collection/refund time:">
          <el-card class="box-card" v-text="invoiceInFormation.creationTime">
          </el-card>
        </el-form-item>
        <el-form-item label="ID of person who collects/refunds fees:">
          <el-card class="box-card" v-text="invoiceInFormation.userID">
          </el-card>
        </el-form-item>
        <el-form-item label="Registration ID:">
          <el-card class="box-card" v-text="invoiceInFormation.registID">
          </el-card>
        </el-form-item>
        <el-form-item label="Charging method:">
          <el-card class="box-card" v-text="invoiceInFormation.feeType">
          </el-card>
        </el-form-item>
        <el-form-item label="red invoice number:">
          <el-card class="box-card" v-text="invoiceInFormation.back">
          </el-card>
        </el-form-item>
        <el-form-item label="Invoice status:">
          <el-card class="box-card" v-text="invoiceInFormation.dailyState">
          </el-card>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInvoice = false">Cancel</el-button>
        <el-button type="primary" @click="dialogInvoice = false">Sure</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Charge",
  data(){
    return{
      list:[],
      items_list:[],
      drugs_list:[],
      query_num:'',
      registerID:'',
      disabledCharge:true,
      dialogInvoice:false,
      invoiceInFormation: {
        id: '',
        invoiceNum: '',
        money: '',
        userID: '',
        state: '',
        registID: '',
        feeType: '',
        dailyState: '',
        createTime: '',
        back: '',
      },
    }
  },
  methods:{
    doQuery(){
      this.$axios.post(`/register_clerk/selectAll?CaseNumber=${this.query_num}`).then( (resp)=> {
        this.list = resp.data.data;
        this.registerID = this.list[0].ID;
        console.log("registerID",this.registerID);
        console.log('list=',this.list)
      }).catch( (err)=> {
        console.log("err",err);
      })
    },
    getCharge(data){
      this.disabledCharge = false;
      console.log("data=",data);
      console.log(data.id);
      this.$axios.post(`/charge/allItem?ID=${data.id}`).then( (resp)=> {
        this.items_list = resp.data.data;
        console.log('items_list=',this.items_list);
      }).catch( (err)=> {
        console.log("err",err);
      })
      this.$axios.post(`/charge/allDrugs?ID=${data.id}`).then( (resp)=> {
        this.drugs_list = resp.data.data;
        console.log('drugs_list=',this.drugs_list);
      }).catch( (err)=> {
        console.log("err",err);
      })
    },
    doCharge(data){
      this.$axios.post(`/charge/allCharge?ID=${data.id}`).then( (resp)=> {
        this.invoiceInFormation = resp.data.data;
        console.log('invoiceInFormation=',this.invoiceInFormation);
      }).catch( (err)=> {
        console.log("err",err);
      })
      this.dialogInvoice = true;
    },
    isGender(row, column) {
      if(row[column.property] === 71){
        return 'male'
      } else {
        return  'female'
      }
    },
    stateShift(row, column){
      if(row[column.property] === 1){
        return 'Registered'
      }else if(row[column.property] === 2){
        return 'doctor consultation'
      }else if(row[column.property] === 3){
        return 'Consultation ended'
      }else {
        return 'Number canceled'
      }
    },
    whetherDiagnose(row, column){
      if(row[column.property] < 2) {
        return 'no'
      } else {
        return 'yes'
      }
    },
    whetherBook(row, column){
      if(row[column.property] === '1') {
        return 'yes'
      }else {
        return 'no'
      }
    },
    recordType(row, column){
      if(row[column.property] === 1) {
        return 'examine';
      } else if(row[column.property] === 2) {
        return 'test';
      } else {
        return 'Dispose';
      }
    }
  }
}
</script>

<style scoped="scoped">
.card {
  background: #ececec;
  border:1px solid;
}
.my_el_input {
  width: 400px;
}
.box-card {
  width: 480px;
  height: 50px;
}
</style>
