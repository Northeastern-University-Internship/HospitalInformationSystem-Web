<template>
  <div>
    <el-card class="card">
      <div class="table-box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="clinicalWorkloadStatistics" name="first">
            <div class="search-box">
              <el-form ref="dateForm" :model="dateForm">
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="dateForm.startDate"
                    class="date-picker"
                    placeholder="Select Start Time">
                </el-date-picker>
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="dateForm.endDate"
                    class="date-picker"
                    placeholder="Select End Time">
                </el-date-picker>
                <div style="float: left">
                  <el-button @click="search(1)" icon="el-icon-search" type="primary" plain round>Search</el-button>
                  <el-button @click="resetForm" class="button-box" icon="el-icon-delete" type="info" plain round>Clear
                  </el-button>
                </div>
              </el-form>
            </div>
            <el-table :data="clinicalDeptList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                      style=" width: 100%; margin-top: 10px"
                      border
                      stripe>
              <el-table-column fixed="left" label="departmentName" width="120">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.deptName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="westernMedicineFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.xyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="traditionalChineseMedicine" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.zcyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="chineseHerbalMedicine" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.cyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="registrationFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.ghf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="medicalFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.zlf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="inspectionFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.jyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="disposalFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.czf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="anestheticFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.mzf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="anestheticMedicineFee" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.mzyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="inspectionMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.jyclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ultrasonicWaveExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.csjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ultrasonicWaveMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.csclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="radiologicalExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.fsjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="radiologicalMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.fsclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="mriExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.MRIjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="mriMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.MRIclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ctExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.CTjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ctMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.CTclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="outpatientSurgery" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.CTjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="disposalMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.czclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="etc">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.czclf | rounding }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[6,12,24]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="clinicalDeptList.length">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="medicalWorkloadStatistics" name="second">
            <div class="search-box">
              <el-form ref="dateForm" :model="dateForm">
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="dateForm.startDate"
                    class="date-picker"
                    placeholder="Select Start Time">
                </el-date-picker>
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="dateForm.endDate"
                    class="date-picker"
                    placeholder="Select End Time">
                </el-date-picker>
                <div style="float: left">
                  <el-button @click="search(2)" icon="el-icon-search" type="primary" plain round>Search</el-button>
                  <el-button @click="resetForm" class="button-box" icon="el-icon-delete" type="info" plain round>Clear
                  </el-button>
                </div>
              </el-form>
            </div>
            <el-table :data="clinicalDeptList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                      style=" width: 100%; margin-top: 10px"
                      border
                      stripe>
              <el-table-column fixed="left" label="departmentName" width="120">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.deptName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="westernMedicineFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.xyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="traditionalChineseMedicine" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.zcyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="chineseHerbalMedicine" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.cyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="registrationFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.ghf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="medicalFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.zlf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="inspectionFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.jyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="disposalFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.czf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="anestheticFee" width="70">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.mzf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="anestheticMedicineFee" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.mzyf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="inspectionMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.jyclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ultrasonicWaveExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.csjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ultrasonicWaveMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.csclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="radiologicalExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.fsjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="radiologicalMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.fsclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="mriExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.MRIjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="mriMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.MRIclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ctExamination" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.CTjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ctMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.CTclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="outpatientSurgery" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.CTjcf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column label="disposalMaterial" width="80">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.czclf | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="etc">
                <template slot-scope="scope">
                  <span style="color: #051525">{{ scope.row.czclf | rounding }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="[4,8,12]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="clinicalDeptList.length">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <el-dialog width="50%" :visible.sync="dialog">
      <el-descriptions
          class="information-box"
          :column="3"
          border>
        <el-descriptions-item>
          <template slot="label">
            PatientNumber
          </template>
          {{ registerInfo.id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            PatientName
          </template>
          {{ registerInfo.realName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            AppointmentTime
          </template>
          {{ registerInfo.registTime }}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            FeeDetail
          </template>
          <el-table :show-header="false" :data="patientCostList">
            <el-table-column width="200">
              <template slot-scope="scope">
                <span style="color: #051525">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.expName!==null" style="color: #051525">{{ scope.row.expName }}</span>
                <span v-else style="color: #051525">MedicineFee</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <span style="color: #051525">{{ scope.row.price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 30px; margin-left: 80%">
        <el-button
            @click="dialog = false"
            type="primary">
          Submit
        </el-button>
        <el-button
            @click="dialog= false"
            type="info">
          Cancel
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "WorkloadStaticsOfOutpatientDepartment",
  data() {
    return {
      activeName: 'first',
      clinicalDeptList: [],
      testList: [],
      medicalDeptList: [],
      workloadStaticsList: [],
      currentPage: 1,
      pageSize: 8,
      registerInfo: {},
      patientCostList: {},
      dialog: false,
      dateForm: {
        startDate: '',
        endDate: ''
      },
    }
  },
  methods: {
    /**
     * 
     * @returns {Promise<void>}
     */
    async getRegisterByUserID() {
      const resp = await this.$axios
          .get(`/outpatientFinancial/getWorkloadStatisticsAll?StartTime=${this.dateForm.startDate}&EndTime${this.dateForm.endDate}`)
      this.workloadStaticsList = resp.data.data
      console.log(this.workloadStaticsList)
    },
    /**
     * 获取科室列表
     * @returns {Promise<void>}
     */
    async getDeptList(type) {
      const resp = await this.$axios
          .get(`/outpatientFinancial/getDepartmentAll?DeptType=${type}`)
      this.clinicalDeptList = resp.data.data
    },
    test() {
      for (let i = 0; i < this.clinicalDeptList.length; i++) {
        for (let j = 0; j < this.workloadStaticsList.length; j++) {
          if (this.workloadStaticsList[j].deptName === this.clinicalDeptList[i].deptName) {
            switch (this.workloadStaticsList[j].constantName) {
              case 'westernMedicine':
                this.clinicalDeptList[i].xyf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'traditionalChineseMedicine':
                this.clinicalDeptList[i].zcyf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'chineseHerbalMedicine':
                this.clinicalDeptList[i].cyf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
            }
            switch (this.workloadStaticsList[j].expName) {
              case 'registrationFee':
                this.clinicalDeptList[i].ghf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'medicalFee':
                this.clinicalDeptList[i].zlf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'inspectionFee':
                this.clinicalDeptList[i].jyf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'disposalFee':
                this.clinicalDeptList[i].czf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'inspectionMaterialFee':
                this.clinicalDeptList[i].jyclf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'ultrasonicWaveExaminationFee':
                this.clinicalDeptList[i].csjcf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'ultrasonicWaveMaterialFee':
                this.clinicalDeptList[i].csclf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'radiologicalExaminationFee':
                this.clinicalDeptList[i].fsjcf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'radiologicalMaterialFee':
                this.clinicalDeptList[i].fsclf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'mriExaminationFee':
                this.clinicalDeptList[i].mrijcf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'mriMaterialFee':
                this.clinicalDeptList[i].mriclf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'ctExaminationFee':
                this.clinicalDeptList[i].ctjcf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'ctMaterialFee':
                this.clinicalDeptList[i].ctclf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'disposalMaterialFee':
                this.clinicalDeptList[i].czclf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'anestheticFee':
                this.clinicalDeptList[i].mzf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'anestheticMedicineFee':
                this.clinicalDeptList[i].mzyf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'outpatientSurgeryFee':
                this.clinicalDeptList[i].mzssf += (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
              case 'etc':
                this.clinicalDeptList[i].qt+= (this.workloadStaticsList[j].price*this.workloadStaticsList[j].amount);
                break;
            }
          }
        }
      }
    },
    /**
     * 
     * @param val
     */
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    /**
     * 
     * @param val
     */
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    /**
     * 重置搜索表单
     */
    resetForm() {
      this.dateForm.startDate = ''
      this.dateForm.endDate = ''
    },

    handleClick(tab, event) {
      if(this.activeName === 'first') {
        this.getDeptList(1)
        window.setTimeout(this.test, 200)
      } else if(this.activeName === 'second') {
        this.getDeptList(2)
        window.setTimeout(this.test, 200)
      }
    },

    resetExpense(param){
      param.ghf = 0;
      param.zlf = 0;
      param.jyf = 0;
      param.jyclf = 0;
      param.csjcf = 0;
      param.csclf = 0;
      param.fsjcf = 0;
      param.fsclf = 0;
      param.MRIjcf = 0;
      param.MRIclf = 0;
      param.CTjcf = 0;
      param.CTclf = 0;
      param.xyf = 0;
      param.zcyf = 0;
      param.cyf = 0;
      param.czf = 0;
      param.czclf = 0;
      param.mzf = 0;
      param.mzyf = 0;
      param.mzssf = 0;
      param.qt = 0;
    },

    search(type){
      this.getDeptList(type);
      this.getRegisterByUserID();
      window.setTimeout(this.test, 200)
    }
  },
  created() {
    this.getRegisterByUserID()
    this.getDeptList(1)
    window.setTimeout(this.test, 200)
  },

  filters: {
    rounding (value) {
      if (!value) {
        return 0;
      }
      return value.toFixed(2);
    }
  }
}
</script>

<style scoped>
.table-box {
}

.information-box {
  background: white;
}

.card {
  background: #ececec;
}

.search-box {
  height: 40px;
}

.date-picker {
  margin-right: 10px;
  float: left;
}

.button-box {
  margin-right: 10px;
}

strong {
  margin-top: 15px;
  margin-left: 10px;
  font-size: 24px;
  float: left;
  color: #575757;
}
</style>