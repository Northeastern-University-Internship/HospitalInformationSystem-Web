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
            prop="invoiceNum"
            label="Invoice number"
            width="80">
        </el-table-column>
        <el-table-column
            prop="money"
            label="Invoice amount"
            width="100">
        </el-table-column>
        <el-table-column
            prop="state"
            label="Invoice status"
            width="80">
        </el-table-column>
        <el-table-column
            prop="creationTime"
            label="Collection/refund time"
            width="155">
        </el-table-column>
        <el-table-column
            prop="userID"
            label="ID of person who collects/refunds fees"
            width="120">
        </el-table-column>
        <el-table-column
            prop="registID"
            label="Registration ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="feeType"
            label="Charging method"
            width="100">
        </el-table-column>
        <el-table-column
            prop="back"
            label="red invoice number"
            width="110">
        </el-table-column>
        <el-table-column
            prop="dailyState"
            label="Invoice status"
            width="100">
        </el-table-column>
        <el-table-column label="operate" width="200px">
          <template slot-scope="scope">
            <el-button type ="warning"  @click="doGet(scope.row)" plain>修改</el-button>
            <el-button type ="danger"  @click="doBack(scope.row)" plain>退号</el-button>
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
          :model="invoiceInFormation"
          label-width="150px"
          :rules="invoiceRules">
        <el-form-item label="Invoice number:" prop="invoiceNum">
          <el-input class="box-card" v-model="invoiceInFormation.invoiceNum" placeholder="发票编号"></el-input>
        </el-form-item>
        <el-form-item label="Invoice amount:" prop="money">
          <el-input class="box-card" v-model="invoiceInFormation.money" placeholder="发票金额"></el-input>
        </el-form-item>
        <el-form-item label="Invoice status:" prop="state">
          <el-input class="box-card" v-model="invoiceInFormation.state" placeholder="发票状态"></el-input>
        </el-form-item>
        <el-form-item label="Collection/refund time:">
          <el-input class="box-card" v-model="invoiceInFormation.creationTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="ID of person who collects/refunds fees:">
          <el-input class="box-card" v-model="invoiceInFormation.userID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Registration ID:">
          <el-input class="box-card" v-model="invoiceInFormation.registID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Charge method:">
          <el-input class="box-card" v-model="invoiceInFormation.feeType" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Red invoice number:" prop="back">
          <el-input class="box-card" v-model="invoiceInFormation.back" placeholder="冲红发票号码"></el-input>
        </el-form-item>
        <el-form-item label="Invoice status:" prop="dailyState">
          <el-input class="box-card" v-model="invoiceInFormation.dailyState" placeholder="发票状态"></el-input>
        </el-form-item>
      </el-form>
<!--      <template slot-scope="scope">-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdate = false">Cancel</el-button>
            <el-button type="primary" @click="doUpdate()">Revise</el-button>
        </span>
<!--      </template>-->
    </el-dialog>
    <el-dialog
        title="Invoice Information"
        :visible.sync="dialogBackNum"
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
        <el-form-item label="Red invoice number::">
          <el-card class="box-card" v-text="invoiceInFormation.back">
          </el-card>
        </el-form-item>
        <el-form-item label="Invoice status:">
          <el-card class="box-card" v-text="invoiceInFormation.dailyState">
          </el-card>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBackNum = false">Cancel</el-button>
        <el-button type="primary" @click="dialogBackNum = false">Sure</el-button>
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
      dialogUpdate: false,
      dialogBackNum: false,
      temp:'',
      invoiceRules: {
        invoiceNum: [{required: true, message: 'Please enter the invoice number', trigger: 'blur'}],
        money: [{required: true, message: 'Please enter the amount', trigger: 'blur'}],
        state: [{required: true, message: 'Please enter invoice status', trigger: 'blur'}],
        dailyState: [{required: true, message: 'Please enter the daily settlement review status', trigger: 'blur'}],
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
      this.$axios.post('/backnumber/selectAllInvoice').then( (resp)=> {
        this.list = resp.data.data;
        console.log('list=',this.list)
      }).catch( (err)=> {
        console.log("err",err);
      })
    },
    doQuery(){
      this.$axios.post(`/backnumber/selectAllInvoice?RegistID=${this.query_registID}`).then( (resp)=> {
        this.list = resp.data.data;
        console.log('list=',this.list)
      }).catch( (err)=> {
        console.log("err",err);
      })
      this.initData();
    },
    doUpdate(){
      console.log(this.invoiceInFormation)
      this.$refs['invoiceInFormation'].validate(valid => {
        if(valid){
          this.$axios.post('/backnumber/updateInvoice', this.invoiceInFormation).then((resp) => {
            console.log('list=', this.invoice)
          }).catch((err) => {
            console.log("err", err);
          })
          this.dialogUpdate = false;
        }
      })
    },
    doAdd(data){
      this.$axios.post('/backnumber/addInvoice',data).then( (resp)=> {
        console.log('list=',this.list)
      }).catch( (err)=> {
        console.log("err",err);
      })
    },
    doGet(data){
      this.dialogUpdate=true;
      console.log(data);
      this.invoice = data;
      this.invoiceInFormation = data;
    },
    doBack(data){
      this.$confirm('This operation will return to registration. Do you want to continue?', 'hint', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/backnumber/backNumber',data).then( (resp)=> {
          this.invoiceInFormation = resp.data.data;
          console.log("I am msg",resp.data.msg);
          if(resp.data.msg === 'Number withdrawn successfully') {
            this.dialogBackNum = true;
          }
        }).catch( (err)=> {
          console.log("err",err);
        })
        this.initData();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Refund canceled'
        });
      });
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
.input-with-select {
  background-color: #fff;
}

.my_el_input {
  width: 400px;
}
</style>
