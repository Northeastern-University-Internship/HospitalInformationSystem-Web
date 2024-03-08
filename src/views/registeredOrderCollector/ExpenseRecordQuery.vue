<template>
  <div>
    <el-card class="card">
      <el-card class="box-card">
        <div class="search-box">
          <el-form :model="addForm" :inline="true">
            <el-input placeholder="Please enter medical record ID"
                      style="width: 20%;"
                      v-model="addForm.caseNumber"
                      @clear="doQuery()">
            </el-input>
            <span class="demonstration"></span>
            <el-date-picker
                v-model="addForm.startTime"
                type="date"
                @clear="doQuery()"
                placeholder="Select start date">
            </el-date-picker>
            <span class="demonstration"></span>
            <el-date-picker
                v-model="addForm.endTime"
                type="date"
                @clear="doQuery()"
                placeholder="Select end date">
            </el-date-picker>

            <el-button  icon="el-icon-search"
                        @click="doQuery()">
            </el-button>
          </el-form>
        </div>

        <el-table :data = "costsList"
                  border
                  stripe>
          <el-table-column label="ID" prop="id" width="60"></el-table-column>
          <el-table-column label="Medical record number" prop="caseNumber" width="80"></el-table-column>
          <el-table-column label="Invoice ID" prop="invoiceID" width="80"></el-table-column>
          <el-table-column label="patient name" prop="realName" width="80"></el-table-column>
          <el-table-column label="project type" prop="itemType" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.itemType === 1">non-drugs</span>
              <span v-if="scope.row.itemType === 2">drug</span>
            </template>
          </el-table-column>
          <el-table-column label="project name" prop="name"></el-table-column>
          <el-table-column label="Project unit price" prop="price" width="80"></el-table-column>
          <el-table-column label="Project Departmen" prop="deptName" width="100"></el-table-column>
          <el-table-column label="quantity" prop="amount" width="60"></el-table-column>
          <el-table-column label="Opening time" prop="createtime" width="160"></el-table-column>
          <el-table-column label="Collection and refund time" prop="payTime" width="160"></el-table-column>
          <el-table-column label="Charging method" prop="constantName"></el-table-column>
          <el-table-column label="Whether to refund" prop="backID">
            <template slot-scope="scope">
              <span v-if="scope.row.backID === null">No refund</span>
              <span v-if="scope.row.backID === 1">Refund</span>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </el-card>

  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      costsList: [],
      addForm:{
        id: '',
        registID:'',
        invoiceID: '',
        caseNumber:'',
        itemType:'',
        realName:'',
        name :'',
        price : '',
        amount :'',
        deptName:'',
        createtime:'',
        payTime: '',
        constantName:'',
        backID:'',
        startTime:'',
        endTime:''
      },
    }
  },

  created() {
    this.doQuery()
  },

  mounted(){
    this.costsList = this.$route.query.costsList;
  },

  methods: {
    doQuery(){
      let url='/registeredTollCollector/patientExpenseQuery/selectAll';
      let params = this.$qs.stringify(this.addForm);
      // console.log("Starting time",this.addForm.startTime);
      console.log('testtesttest')
      console.log(params)
      this.$axios.post(url,params)
          .then( (resp)=>{
            console.log("I am resp:",resp)
            this.costsList=resp.data.data;
          } )
          .catch( (err)=>{
            console.log('error=', err);
          } )
    },

  }
}
</script>

<style scoped="scoped">
.card {
  background: #ececec;
  border:1px solid;
}
</style>

