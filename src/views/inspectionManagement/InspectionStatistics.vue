<template>
  <div>
    <div style="margin: 20px 0;">
      <el-form :inline="true">
        total people: <el-input
          placeholder="total people"
          v-model="count.count"
          :disabled="true"
          style="width: 20%;">
      </el-input>
        <el-button  icon="el-icon-search"
                    @click="countN()">
                    refresh
        </el-button>
      </el-form>
    </div>

    <el-card class="box-card">
      <div class="search-box">
        <el-form :model="addForm" :inline="true">
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
            统计
          </el-button>
        </el-form>
      </div>

      <el-table :data = "costsList">
        <el-table-column label="patient name" prop="realName"></el-table-column>
        <el-table-column label="Department name" prop="deptName"></el-table-column>
        <el-table-column label="lump sum" prop="sum"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count:[],
      costsList: [],
      addForm:{
        startTime:'',
        endTime:''
      },
    }
  },

  created() {
    this.doQuery()
    this.countN()
  },

  mounted(){
    this.costsList = this.$route.query.costsList;
  },

  methods: {
    countN(){
      let url='/outpatientMedicalTechnologyWorkstation/personalWorkloadStatistics/selectByID';
      console.log('testtesttest')
      this.$axios.post(url)
          .then( (resp)=>{
            this.count=resp.data.data;
          } )
          .catch( (err)=>{
            console.log('error=', err);
          } )
    },
    doQuery(){
      let url='/outpatientMedicalTechnologyWorkstation/personalWorkloadStatistics/selectAll';
      let params = this.$qs.stringify(this.addForm);
      console.log('testtesttest')
      console.log(params)
      this.$axios.post(url,params)
          .then( (resp)=>{
            this.costsList=resp.data.data;
          } )
          .catch( (err)=>{
            console.log('error=', err);
          } )
    },

  }
}
</script>

<style scoped>

</style>

