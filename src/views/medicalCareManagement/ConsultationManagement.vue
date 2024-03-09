<template>
  <div>
    <el-card class="card">
      <div class="search-box">
        <el-form ref="formInline" :rules="formInlineRules" :model="formInline" :inline="true" class="demo-form-inline">
          <el-form-item prop="userID" label="creater" class="form">
            <el-select clearable v-model="formInline.userID" filterable placeholder="Creater">
              <template v-for="item in userList">
                <el-option :label="item.realName" :value="item.id" :key="item.id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="recordType" label="templateType" class="form">
            <el-select clearable v-model="formInline.recordType" filterable placeholder="templateType">
              <template v-for="item in recordTypeList">
                <el-option :label="item.name" :value="item.id" :key="item.id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" class="form">
            <el-input v-model="formInline.name" placeholder="Please Enter Template Name" class="input"></el-input>
          </el-form-item>
          <el-button
              round
              size="mini"
              icon="el-icon-search"
              class="inputButton"
              @click="getInsTemplateAll()"
              style="margin-top: 16px"
              type="primary">Search
          </el-button>
          <el-button
              round
              size="mini"
              icon="el-icon-delete"
              @click="resetForm('formInline')"
              style="margin-top: 16px"
              type="info">Clear
          </el-button>
          <el-button
              round
              size="mini"
              @click="enableAddDialog"
              icon="el-icon-plus"
              style="margin-top: 16px; margin-right: 10px; float: right"
              type="primary">Add Template
          </el-button>
        </el-form>
      </div>
      <el-table :data="insTemplateAllList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                style="width: 100%; margin-top: 10px" stripe>
        <el-table-column label="templateNumber" width="170">
          <template slot-scope="scope">
            <span style="color: #051525">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="templateName" width="180">
          <template slot-scope="scope">
            <span style="color: #051525">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="writer" width="170">
          <template slot-scope="scope">
            <span style="color: #051525">{{ getUserName(scope.row.userID) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="createdTime" width="220">
          <template slot-scope="scope">
            <span style="color: #051525">{{ scope.row.creationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="applicationScope" width="170">
          <template slot-scope="scope">
            <span style="color: #051525">{{ getScopeName(scope.row.scope) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="templateType" width="170">
          <template slot-scope="scope">
            <span style="color: #051525">{{ getRecordTypeName(scope.row.recordType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="submit" fixed="right" width="150">
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
      <!-- <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[1,5,10,20]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="insTemplateAllList.length">
      </el-pagination> -->
    </el-card>
    <el-dialog
        :visible.sync="dialog.updateDialog"
        width="50%">
      <el-form :model="currentRow">
        <el-descriptions title="Modify Information" :column="3" border>
          <el-descriptions-item span="1" label="templateName">
            <el-form-item style="margin: 0;padding: 0">
              <el-input v-model="currentRow.name"></el-input>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="2" label="createdTime">
            <el-form-item style="margin: 0;padding: 0">
              <el-input :disabled="true" v-model="currentRow.creationTime"></el-input>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="1" label="writer">
            <el-form-item style="margin: 0;padding: 0">
              <el-select clearable v-model="currentRow.userID" filterable placeholder="creater">
                <template v-for="item in userList">
                  <el-option :label="item.realName" :value="item.id" :key="item.id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="1" label="applicationScope">
            <el-form-item style="margin: 0;padding: 0">
              <el-select clearable v-model="currentRow.scope" filterable placeholder="templateType">
                <template v-for="item in scopeList">
                  <el-option :label="item.name" :value="item.id" :key="item.id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="1" label="templateType">
            <el-form-item style="margin: 0;padding: 0">
              <el-select clearable v-model="currentRow.recordType" filterable placeholder="templateType">
                <template v-for="item in recordTypeList">
                  <el-option :label="item.name" :value="item.id" :key="item.id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 30px; margin-left: 70%">
          <el-button
              @click="dialog.updateDialog = false; updateInsTemplateAll(currentRow)"
              type="primary">
            Submit
          </el-button>
          <el-button
              @click="dialog.updateDialog = false"
              type="info">
            Cancel
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
        center
        title="DeleteInformation"
        :visible.sync="dialog.deleteDialog"
        width="20%">
      <h3>Are you sure about deleting?</h3>
      <p>Only the Creater can operate!</p>
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
        title="addInfo"
        :visible.sync="dialog.addDialog"
        width="50%">
      <el-form ref="addRow" :rules="addRowRules" :model="addRow">
        <el-descriptions title="addTemplate" :column="3" border>
          <el-descriptions-item span="1" label="templateName">
            <el-form-item prop="name" style="margin: 0;padding: 0">
              <el-input v-model="addRow.name"></el-input>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="2" label="createdTime">
            <el-form-item prop="creationTime" style="margin: 0;padding: 0">
              <el-date-picker
                  style="width: 100%"
                  v-model="addRow.creationTime"
                  type="datetime"
                  placeholder="Select Date and Time">
              </el-date-picker>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="1" label="writer">
            <el-form-item prop="userID" style="margin: 0;padding: 0">
              <el-select clearable v-model="addRow.userID" filterable placeholder="creater">
                <template v-for="item in userList">
                  <el-option :label="item.realName" :value="item.id" :key="item.id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="1" label="applicationScope">
            <el-form-item prop="scope" style="margin: 0;padding: 0">
              <el-select clearable v-model="addRow.scope" filterable placeholder="templateType">
                <template v-for="item in scopeList">
                  <el-option :label="item.name" :value="item.id" :key="item.id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item span="1" label="templateType">
            <el-form-item prop="recordType" style="margin: 0;padding: 0">
              <el-select clearable v-model="addRow.recordType" filterable placeholder="templateType">
                <template v-for="item in recordTypeList">
                  <el-option :label="item.name" :value="item.id" :key="item.id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 30px; margin-left: 70%">
          <el-button
              @click="addSubmitForm('addRow')"
              type="primary">
            Submit
          </el-button>
          <el-button
              @click="dialog.addDialog = false"
              type="info">
            Cancel
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "InspectionTemplateManagement",
  data() {
    return {
      form: '',
      currentPage: 1,
      pageSize: 10,
      insTemplateAllList: [],
      userList: [],
      recordTypeList: [
        {
          id: 1,
          name: 'checkTemplate'
        },
        {
          id: 2,
          name: 'testTemplate'
        },
        {
          id: 3,
          name: 'dispositionTemplate'
        }
      ],
      scopeList: [
        {
          id: '1',
          name: 'hospital'
        },
        {
          id: '2',
          name: 'department'
        },
        {
          id: '3',
          name: 'Individual'
        }
      ],
      formInline: {
        userID: '',
        recordType: '',
        name: ''
      },
      formInlineRules: {
        userID: [
          {required: false, message: '', trigger: 'blur'},
        ],
        recordType: [
          {required: false, message: '', trigger: 'blur'},
        ],
        name: [
          {required: false, message: '', trigger: 'blur'},
        ]
      },
      addRowRules: {
        name: [{required: true, message: 'Please Enter Form Name', trigger: 'blur'}],
        userID: [{required: false, message: 'Please Enter Time', trigger: 'blur'}],
        creationTime: [{ required: true, message: 'Please Choose', trigger: 'change' }],
        scope: [{ required: true, message: 'Please Choose', trigger: 'change' }],
        recordType: [{ required: true, message: 'Please Choose', trigger: 'change' }],
      },
      currentRow: {},
      addRow: {
        name: '',
        userID: null,
        creationTime: null,
        scope: null,
        recordType: null,
        delMark: null
      },
      dialog: {
        updateDialog: false,
        deleteDialog: false,
        addDialog: false
      }
    }
  },

  created() {
    this.getUserAll();
    this.getInsTemplateAll();
  },

  methods: {
    /**
     * 
     * @returns {Promise<void>}
     */
    async getInsTemplateAll() {
      const resp = await this.$axios
          .get(`/getCheckTemplateAll?UserID=${this.formInline.userID}&RecordType=${this.formInline.recordType}&Name=${this.formInline.name}&${new Date().getTime()}`);
      this.insTemplateAllList = resp.data.data;

      this.insTemplateAllList = this.tableDataNew;
      for (let i = 0; i < this.insTemplateAllList.length; i++) {
        this.insTemplateAllList[i].creationTime = moment(this.insTemplateAllList[i].creationTime).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    /**
     * @param id
     * @returns {Promise<void>}
     */
    async getInsTemplateAllByID(id) {
      const resp = await this.$axios.get(`/getCheckTemplateByID?ID=${id}`);
      console.log(resp.data.data)
    },
    /**
     * @returns {Promise<void>}
     */
    async getUserAll() {
      const resp = await this.$axios.get(`/queryUserAll`);
      if (resp != null) {
        this.userList = resp.data.data;
      }
    },
    /**
     * @param param
     */
    deleteInsTemplateAll(param) {

      const user = JSON.parse(localStorage.getItem("User"))

      param.operatorID = user.id
      param.creationTime = moment(param.creationTime)

      this.$axios.post(`/deleteCheckTemplate`, param)
      window.setTimeout(this.getInsTemplateAll, 200)
    },
    /**

     * @param param
     */
    updateInsTemplateAll(param) {

      const user = JSON.parse(localStorage.getItem("User"))

      param.operatorID = user.id
      param.creationTime = moment(param.creationTime)

      this.$axios.post(`/updateCheckTemplate`, param)
      window.setTimeout(this.getInsTemplateAll, 200)
    },
    /**

     */
    addInsTemplate() {
      this.addRow.creationTime = moment(this.addRow.creationTime).format()

      this.$axios.post(`/addCheckTemplate`, this.addRow)
      window.setTimeout(this.getInsTemplateAll, 200)
      console.log(this.addRow)
    },

    /**

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

     * @param val
     */
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    /**

     * @param val
     */
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    /**

     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**
     * @param param
     */
    enableUpdateDialog(param) {
      this.dialog.updateDialog = true
      this.currentRow = param
    },
    /**
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
    },
    /**
     * @param rid
     * @returns {string}
     */
    getRecordTypeName(rid) {
      for (let i = 0; i < this.recordTypeList.length; i++) {
        if (rid === this.recordTypeList[i].id) {
          return this.recordTypeList[i].name
        }
      }
    },
    /**
     * @param uid
     * @returns {string}
     */
    getUserName(uid) {
      for (let i = 0; i < this.userList.length; i++) {
        if (uid === this.userList[i].id) {
          return this.userList[i].realName
        }
      }
    },
    /**
     * @param sid
     * @returns {string}
     */
    getScopeName(sid) {
      for (let i = 0; i < this.scopeList.length; i++) {
        if (sid === this.scopeList[i].id) {
          return this.scopeList[i].name
        }
      }
    },
  },

  computed: {
    /**
     * 数据过滤器
     * @returns {*[]}
     */
    tableDataNew: function () {
      return this.insTemplateAllList.filter((data) => {
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