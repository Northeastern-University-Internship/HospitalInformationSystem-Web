<template>
  <div>
    <section ref="print" class="recordImg" id="printRecord">
    </section>
    <div ref="print">
      <el-card class="box-card">
        <div class="search-box" >
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
            <el-button  icon="el-icon-search"
                        @click="doQuery()">
            </el-button>
            <el-button type="round" @click="PrintRow" style="float:right">Print</el-button>
          </el-form>
        </div>
        <el-table
            :data="prescriptionList"
            style="width: 100%"
            class="ddd"
            max-height="120">
          <el-table-column
              prop="caseNumber"
              label="Medical record number"
              width="180">
          </el-table-column>
          <el-table-column
              prop="realName"
              label="patient name"
              width="180">
          </el-table-column>
          <el-table-column
              prop="age"
              label="age">
          </el-table-column>
          <el-table-column
              prop="gender"
              label="gender"
              width="180">
          </el-table-column>
          <el-table-column
              prop="prescriptionState"
              label="prescription status">
            <template slot-scope="scope">
              <span v-if="scope.row.prescriptionState === 1">temporary storage</span>
              <span v-if="scope.row.prescriptionState === 2">Already opened</span>
              <span v-if="scope.row.prescriptionState === 0">Abolished</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="payTime"
              label="Charge date">
          </el-table-column>
        </el-table>

        <el-table :data="prescriptionList">
          <el-table-column label="Case number" prop="caseNumber"></el-table-column>
          <el-table-column label="prescription number" prop="id"></el-table-column>
          <el-table-column label="billing doctor" prop="userID"></el-table-column>
          <el-table-column label="Drug Name" prop="drugsName"></el-table-column>
          <el-table-column label="Specification" prop="drugsFormat"></el-table-column>
          <el-table-column label="quantity" prop="amount"></el-table-column>
          <el-table-column label="unit" prop="drugsUnit"></el-table-column>
          <el-table-column label="unit price" prop="drugsPrice"></el-table-column>
          <el-table-column label="lump sum" prop="sum"></el-table-column>
          <el-table-column label="factory" prop="manufacturer"></el-table-column>
          <el-table-column label="usage" prop="drugsUsage"></el-table-column>
          <el-table-column label="Dosage" prop="dosage"></el-table-column>
          <el-table-column label="Dispensing status" prop="state">
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
                         @click="doUpdate(scope.row)">Distribute medicine
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </div>
  </div>

</template>

<script>
// Referenced within the current vue file
import printJS from 'print-js'
export default {
  data() {
    return {
      prescriptionList: [],
      updateDialogVisable: false,
      addForm: {
        caseNumber:'',
        id: '',
        userId: '',
        medicalID:'',
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
    }
  },

  created() {
    this.doQuery()
  },

  mounted() {
    this.prescriptionList = this.$route.query.prescriptionList;
  },

  methods: {

    doQuery() {
      let url = '/outpatientPharmacyWorkstation/outpatientDispensing/selectAll';
      let params = this.$qs.stringify(this.addForm);
      console.log('test')
      console.log(params)
      this.$axios.post(url, params)
          .then((resp) => {
            this.prescriptionList = resp.data.data;
          })
          .catch((err) => {
            console.log('error=', err);
          })
    },


    doUpdate(param) {
      console.log('33333333')
      console.log(param)
      if (!confirm('Is the medicine retrieval operation confirmed?')) {
        return;
      }
      this.currentRow = param
      let params = this.$qs.stringify(this.currentRow);
      let url = '/outpatientPharmacyWorkstation/outpatientDispensing/update';
      this.$axios.post(url, params)
          .then((resp) => {
            let i = resp.data.code;
            if (i == 200) {
              location.reload();
            } else {
              this.msg = 'Failed to get medicine'
            }
          })
          .catch((err) => {
            console.log('error=', err);
          })
    },

    enableUpdateDialog(param) {
      this.updateDialogVisable = true
      this.currentRow = param
    },
    PrintRow(index, row){
      this.$print(this.$refs.print) // use
    },

  }
}
</script>

<style scoped>
.search-box{
  height: 70px;

}

.ddd{
  height: 250px;
}
</style>
