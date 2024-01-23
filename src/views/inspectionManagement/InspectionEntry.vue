<template>
  <div>
    <el-card class="card">
      <el-input placeholder="Please enter registration ID" class="my_el_input" v-model="query_registID">
        <el-button slot="append" icon="el-icon-search" @click="doQuery"></el-button>
      </el-input>
      <el-table
          :data="list"
          height="600"
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
            prop="medicalID"
            label="Case ID"
            width="80">
        </el-table-column>
        <el-table-column
            prop="registID"
            label="Registration ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="objective"
            label="Purpose requirements"
            width="80">
        </el-table-column>
        <el-table-column
            prop="CreationTime"
            label="Opening time"
            width="155">
        </el-table-column>
        <el-table-column
            prop="name"
            label="project name"
            width="120">
        </el-table-column>
        <el-table-column
            prop="checkOperID"
            label="Checker ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="doctorID"
            label="Issue a doctor ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="position"
            label="Check parts"
            width="120">
        </el-table-column>
        <el-table-column
            prop="state"
            label="status"
            width="120">
        </el-table-column>
        <el-table-column label="operate" width="100px">
          <template slot-scope="scope">
            <el-button type ="warning"  @click="doGet(scope.row)" plain>录入</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <el-dialog
        title="Invoice Information"
        :visible.sync="dialogUpdate"
        width="45%"
        center>
      <el-form
          ref="invoiceInFormation"
          :model="checkApplyInFormation"
          label-width="150px"
          :rules="invoiceRules">
        <el-form-item label="ID:" prop="invoiceNum">
          <el-input class="box-card" v-model="checkApplyInFormation.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Case ID:" prop="money">
          <el-input class="box-card" v-model="checkApplyInFormation.medicalID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Registration ID:" prop="state">
          <el-input class="box-card" v-model="checkApplyInFormation.registID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Purpose requirements:">
          <el-input class="box-card" v-model="checkApplyInFormation.objective" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Check parts:">
          <el-input class="box-card" v-model="checkApplyInFormation.position" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Issue a doctor ID:">
          <el-input class="box-card" v-model="checkApplyInFormation.doctorID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Opening time:">
          <el-input class="box-card" v-model="checkApplyInFormation.CreationTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Checker ID:" prop="back">
          <el-input class="box-card" v-model="checkApplyInFormation.checkOperID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="result:" prop="result">
          <el-input class="box-card" v-model="checkApplyInFormation.result" placeholder="结果"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdate = false">Cancel</el-button>
            <el-button type="primary" @click="doUpdate()">Revise</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      list: [],
      invoice: [],
      query_registID:'',
      checkApplyInFormation: {
        id: '',
        medicalID: '',
        registID: '',
        objective: '',
        state: '',
        CreationTime:'',
        name:'',
        checkOperID:'',
        doctorID:'',
        position:'',
        Result:'',
      },
      dialogUpdate: false,
      temp:'',
      invoiceRules: {
        result: [{required: true, message: 'Please enter the inspection results', trigger: 'blur'}],
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
      this.$axios.post('/input/selectAllCheckApply').then( (resp)=> {
        this.list = resp.data.data;
        console.log('list=',this.list)
      }).catch( (err)=> {
        console.log("err",err);
      })
    },
    doQuery(){
      this.$axios.post(`/input/selectAllCheckApply?RegistID=${this.query_registID}`).then( (resp)=> {
        this.list = resp.data.data;
        console.log('list=',this.list)
      }).catch( (err)=> {
        console.log("err",err);
      })
      this.initData();
    },
    doUpdate(){
      console.log(this.checkApplyInFormation);
          this.$axios.post('/input/updateCheckApply', this.checkApplyInFormation).then((resp) => {
            console.log('checkApplyInFormation=', this.checkApplyInFormation)
          }).catch((err) => {
            console.log("err", err);
          })
          this.dialogUpdate = false;
    },
    doGet(data){
      this.dialogUpdate=true;
      console.log(data);
      this.invoice = data;
      this.checkApplyInFormation = data;
    },
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
.input-with-select {
  background-color: #fff;
}

.my_el_input {
  width: 400px;
}
</style>
