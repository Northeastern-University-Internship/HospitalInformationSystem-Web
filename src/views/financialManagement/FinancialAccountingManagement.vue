<template>
  <div>
    <el-card class="card">
      <div class="search-box">
        <el-form ref="formInline" :model="formInline" :inline="true" class="demo-form-inline">
          <el-form-item prop="name" class="form">
            <el-input v-model="formInline.expName" placeholder="Please Enter Department" class="input"></el-input>
          </el-form-item>
          <el-button
              round
              icon="el-icon-search"
              class="inputButton"
              @click="getInsTemplateAll()"
              type="primary">Search
          </el-button>
          <el-button
              round
              @click="enableAddDialog"
              icon="el-icon-plus"
              style="margin-top: 10px; margin-right: 10px; height: 40px; float: right"
              type="primary">Add extra clinic
          </el-button>
        </el-form>
      </div>
      <el-table :data="ExpenseClassList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                style="width: 100%; margin-top: 10px" stripe>
        <el-table-column label="idNumber" width="350">
          <template slot-scope="scope">
            <span style="color: #051525">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="appointmentDepartment" width="350">
          <template slot-scope="scope">
            <span style="color: #051525">{{ scope.row.expName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="appointmentCode" width="350">
          <template slot-scope="scope">
            <span style="color: #051525">{{ scope.row.expCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="operation" fixed="right">
          <template slot-scope="scope">
            <el-button
                type="primary"
                @click="enableUpdateDialog(scope.row)"
                size="mini">Edit
            </el-button>
            <el-button
                type="danger"
                @click="enableDeleteDialog(scope.row)"
                size="mini">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[4,8,12]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="ExpenseClassList.length">
      </el-pagination>
    </el-card>
    <el-dialog
        :visible.sync="dialog.updateDialog"
        width="25%">
      <el-form ref="currentRow" :rules="addRowRules" :model="currentRow" label-width="110px">
        <el-form-item prop="expName" label="appointmentDepartment">
          <el-input v-model="currentRow.expName"></el-input>
        </el-form-item>
        <el-form-item prop="expCode" label="appointmentCode">
          <el-input v-model="currentRow.expCode"></el-input>
        </el-form-item>
        <div style="margin-top: 30px; margin-left: 50%">
          <el-button
              @click="dialog.updateDialog = false; updateInsTemplateAll(currentRow)"
              type="primary">
            Submit
          </el-button>
          <el-button
              @click="dialog.updateDialog = false; resetForm('currentRow')"
              type="info">
            Cancel
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
        center
        title="DeleteInfo"
        :visible.sync="dialog.deleteDialog"
        width="20%">
      <h3>Are you sure with deleting this information?</h3>
      <div style="margin-top: 50px; margin-left: 100px">
        <el-button
            @click="deleteInsTemplateAll(currentRow); dialog.deleteDialog = false"
            type="primary">
          Submit
        </el-button>
        <el-button
            @click="dialog.deleteDialog = false"
            type="info">
          Cancel
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
        title="AddInfo"
        :visible.sync="dialog.addDialog"
        width="25%">
      <el-form ref="addRow" :rules="addRowRules" :model="addRow" label-width="110px">
        <el-form-item prop="expName" label="appointmentDepartment">
          <el-input v-model="addRow.expName"></el-input>
        </el-form-item>
        <el-form-item prop="expCode" label="appointmentCode">
          <el-input v-model="addRow.expCode"></el-input>
        </el-form-item>
        <div style="margin-top: 30px; margin-left: 50%">
          <el-button
              @click="addSubmitForm('addRow')"
              type="primary">
            Submit
          </el-button>
          <el-button
              @click="dialog.addDialog = false; resetForm('addRow')"
              type="info">
            Cancle
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ExpenseAccountManagement",
  data() {
    return {
      form: '',
      currentPage: 1,
      pageSize: 8,
      ExpenseClassList: [],
      recordTypeList: [
        {
          id: 1,
          name: 'Check Example'
        },
        {
          id: 2,
          name: 'Inspection Example'
        },
        {
          id: 3,
          name: 'Disposition Example'
        }
      ],
      scopeList: [
        {
          id: '1',
          name: 'Hospital'
        },
        {
          id: '2',
          name: 'Department'
        },
        {
          id: '3',
          name: 'Individual'
        }
      ],
      formInline: {
        expName: ''
      },
      addRowRules: {
        expName: [{required: true, message: 'Please Enter Appointment Department Name', trigger: 'blur'}],
        expCode: [{required: true, message: 'Please Enter Appointment Code', trigger: 'blur'}],
      },
      currentRow: {},
      addRow: {
        expName: '',
        expCode: ''
      },
      dialog: {
        updateDialog: false,
        deleteDialog: false,
        addDialog: false
      }
    }
  },

  created() {
    this.getInsTemplateAll();
  },

  methods: {
    /**
     * 
     * @returns {Promise<void>}
     */
    async getInsTemplateAll() {
      const resp = await this.$axios
          .get(`/expenseclass/getExpenseClassAll?ExpName=${this.formInline.expName}`);
      this.ExpenseClassList = resp.data.data;
      this.ExpenseClassList = this.tableDataNew;
    },
    /**
     * 
     * @param param
     */
    deleteInsTemplateAll(param) {
      this.$axios.post(`/expenseclass/deleteExpenseClass`, param)
      window.setTimeout(this.getInsTemplateAll, 200)
    },
    /**
     * 
     * @param param
     */
    updateInsTemplateAll(param) {
      this.$axios.post(`/expenseclass/updateExpenseClass`, param)
      window.setTimeout(this.getInsTemplateAll, 200)
    },
    addInsTemplate() {
      this.$axios.post(`/expenseclass/addExpenseClass`, this.addRow)
      window.setTimeout(this.getInsTemplateAll, 200)
      console.log(this.addRow)
    },

    /**
     * 
     * @param formName
     */
    addSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addInsTemplate()
          this.dialog.addDialog = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
     * 
     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**
     * 
     * @param param
     */
    enableUpdateDialog(param) {
      this.dialog.updateDialog = true
      this.currentRow = param
    },
    /**
     * 
     * @param param
     */
    enableDeleteDialog(param) {
      this.dialog.deleteDialog = true
      this.currentRow = param
    },
    enableAddDialog() {
      const user = JSON.parse(localStorage.getItem("User"))
      this.addRow.userID = user.id
      this.dialog.addDialog = true
    }
  },

  computed: {
    /**
     * 
     * @returns {*[]}
     */
    tableDataNew: function () {
      return this.ExpenseClassList.filter((data) => {
        return data.delMark === 1
      })
    }
  }
}
</script>

<style scoped>
.card {
  background: #ececec;
}

.input {
  width: 300px;
}

.inputButton {
  margin-top: 10px;
  color: white;
}

.search-box {
  background: white;
  height: 60px;
}

.form {
  margin-top: 10px;
  margin-left: 10px;
}

</style>