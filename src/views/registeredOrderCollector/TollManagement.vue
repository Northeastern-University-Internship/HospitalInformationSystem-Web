<template>
  <div>
    <el-card class="card">
      <div class="search-box">
        <el-form :model="invoiceInFormation" :inline="true">
          <el-input placeholder="Please enter the toll collector ID"
                    style="width: 200px"
                    v-model="invoiceInFormation.userID">
          </el-input>
          <span class="demonstration"></span>
          <el-date-picker
              v-model="invoiceInFormation.CreationTime"
              type="datetime"
              placeholder="Select date time">
          </el-date-picker>
          <span class="demonstration"></span>
          <el-button  icon="el-icon-search"
                      @click="doQuery()">
          </el-button>
        </el-form>
      </div>
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
        <el-table-column label="Daily settlement" width="200">
          <template slot-scope="scope">
            <el-button type="success" @click="doDaily(scope.row)">Daily settlement</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      list:[],
      start_time:'',
      end_time:'',
      get_time:'',
      invoiceInFormation:{
        id: '',
        invoiceNum: '',
        money: '',
        userID: '',
        state: '',
        registID: '',
        feeType: '',
        dailyState: '',
        CreationTime: '',
        back: '',
      }
    }
  },
  mounted() {
    this.doQuery();
  },
  methods:{
    getCurrentTime() {
      //Get the current time and print it
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      _this.gettime = yy+'/'+mm+'/'+dd+' '+hh+':'+mf+':'+ss;
      console.log(_this.gettime)
    },
    doQuery(){
      // this.start_time = moment(this.invoiceInFormation.createTime).format("yyyy-MM-dd HH:mm:ss");
      console.log("Starting time",this.invoiceInFormation.CreationTime);
      this.$axios.post('/daily/selectBydate?',this.invoiceInFormation).then( (resp)=> {
        this.list = resp.data.data;
        console.log('list=',this.list)
      }).catch( (err)=> {
        console.log("err",err);
      })
    },
    doDaily(Data){
      this.$axios.post('/daily/updateInvoice?',Data).then( (resp)=> {
      }).catch( (err)=> {
        console.log("err",err);
      })
      this.doQuery()
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
