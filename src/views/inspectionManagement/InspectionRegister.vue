
<template>
  <div>
    <el-input
        class="el-text"
        placeholder="Please enter content"
        v-model="userInfo.RealName">
      <el-button slot="append" icon="el-icon-search"  @click="search">search</el-button>
    </el-input>
    <hr>
      <el-button type="info" icon="el-icon-edit" size="medium" @click="updatePrice" plain>Medical technology project supplementary registration</el-button>
      <el-button type="info" icon="el-icon-edit" size="medium" @click="maintainDialog = true" plain>Common project maintenance</el-button>
    <div>
      <el-table
          :data="tableData.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
          style="width: 100%" height="450">
        <el-table-column
            prop="id"
            label="serial number"
            width="80">
        </el-table-column>
        <el-table-column
            prop="realName"
            label="Name"
            width="160">
        </el-table-column>
        <el-table-column
            prop="registID"
            label="Registration number"
            width="160">
        </el-table-column>
        <el-table-column
            prop="caseNumber"
            label="Medical record number"
            width="120">
        </el-table-column>
        <el-table-column
            prop="age"
            label="age"
            width="160">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="gender"
            width="160">
        </el-table-column>
        <el-table-column
            prop="name"
            label="Item name"
            width="160">
        </el-table-column>
        <el-table-column
            prop="state"
            label="state"
            width="160">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="operate"
            width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="updataState(scope.row)">Register</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5,9, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <el-dialog width="45%" align="center" :visible.sync="maintainDialog">
      <el-transfer
          style="text-align: left; display: inline-block;"
          v-model="value"
          filterable
          @right-check-change="rightCopeChane"
          :titles="['All projects', 'Commonly used items']"
          :button-texts="['Shift left', 'Move right']"
          :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
          @change="handleChange"
          :data="data">
        <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
        <el-button class="transfer-footer" slot="left-footer" size="small">operate</el-button>
        <el-button class="transfer-footer" slot="right-footer" size="small">View selected</el-button>
      </el-transfer>
      <el-button type="info" style="margin-left: 10px" size="small" @click="maintainDialog = false">quit</el-button>
    </el-dialog title="hint" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="Project code" prop="itemCode">
            <el-input class="form-input" v-model="ruleForm.itemCode"></el-input>
          </el-form-item>
          <el-form-item label="project name" prop="itemName">
            <el-select v-model="ruleForm.itemName" placeholder="Please select a project name" @change="selectid()">
              <el-option
                  v-for="item in fmeditem"
                  :key="item.itemName"
                  :label="item.itemName"
                  :value="item.itemName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="price" prop="price">
            <el-input class="form-input" v-model="ruleForm.price"></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">Create now</el-button>
          <el-button @click="resetForm('ruleForm')">reset</el-button>
          <el-button @click="dialogVisible = false">Cancel</el-button>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
        title="hint"
        :visible.sync="fmeditemVisbles"
        width="40%">
      <div>
        <el-form :model="fmeditemdetail" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="Project code" prop="itemCode">
            <el-input style="width: 90%" v-model="fmeditemdetail.itemCode"></el-input>
          </el-form-item>
          <el-form-item label="project name" prop="itemName">
            <el-input style="width: 90%" v-model="fmeditemdetail.itemName"></el-input>
          </el-form-item>
          <el-form-item label="deptID" prop="deptID">
            <el-input style="width: 90%" v-model="fmeditemdetail.deptID"></el-input>
          </el-form-item>
          <el-form-item label="CreationDate" prop="CreationDate">
            <el-input style="width: 90%" v-model="fmeditemdetail.CreationDate"></el-input>
          </el-form-item>
          <el-form-item label="price" prop="price">
            <el-input style="width: 90%" v-model="fmeditemdetail.price"></el-input>
          </el-form-item>
          <el-form-item label="mnemonicCode" prop="mnemonicCode">
            <el-input style="width: 90%" v-model="fmeditemdetail.mnemonicCode"></el-input>
          </el-form-item>
          <el-form-item label="expClassID" prop="expClassID">
            <el-input style="width: 90%" v-model="fmeditemdetail.expClassID"></el-input>
          </el-form-item>
          <el-form-item label="deptID" prop="deptID">
            <el-input style="width: 90%" v-model="fmeditemdetail.deptID"></el-input>
          </el-form-item>
          <el-form-item label="creationDate" prop="creationDate">
            <el-input style="width: 90%" v-model="fmeditemdetail.creationDate"></el-input>
          </el-form-item>
          <el-button type="info" style="margin-left: 80%" @click="fmeditemVisbles = false">退出</el-button>
        </el-form>
      </div>

    </el-dialog>
  </div>

</template>

<script>
export default {

  data() {
    return {
      data: [],
      value: [],
      dialogVisibles: false,
      fmeditemVisbles: false,
      fmeditem: [],
      fmeditemdetail: {},
      maintainDialog: false,
      ruleForm: {
        itemCode: '',
        itemName: '',
        price: ''
      },
      rules: {
        itemCode: [
          {required: true, message: 'Please enter the project code', trigger: 'blur'},
          {min: 9, max: 9, message: 'Length is less than 9 characters', trigger: 'blur'}
        ],
        itemName: [
          {required: true, message: 'Please enter project name', trigger: 'blur'}
        ],
        price: [
          {required: true, message: 'Please enter the amount', trigger: 'blur'}
        ]
      },
      tableData: [],
      userInfo: {
        RealName: ''
      },
      pageSize: 7,
      currentPage: 1,
      total: 0,
      userMessage: {
        ID: '',
        State: ''
      },
      dialogVisible: false,
    }
  },
  created() {
    this.search()
    this.getAllfmeditem()
  },
  methods: {
    rightCopeChane(id) {
      if (id.length > 1) return;
      if (id.length !== 0) {
        this.println(id[0]);
      }
    },
    println(id) {
      console.log(id);
      this.fmeditemdetail = this.fmeditem[id];
      console.log(this.fmeditemdetail);
      this.fmeditemVisbles = true;
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    selectid() {
      for (var i = 0; i < this.fmeditem.length; i++) {
        if (this.fmeditem[i].itemName == this.ruleForm.itemName) {
          this.ruleForm.itemCode = this.fmeditem[i].itemCode;
          this.ruleForm.price = this.fmeditem[i].price;
          break;
        }
      }
    },
    getAllfmeditem() {
      this.$axios.post('getFmeditemAll').then(res => {
        this.fmeditem = res.data.data;
        console.log(res);
        this.data = [];
        for (let i = 0; i < res.data.data.length; i++) {
          this.data.push({
            key: i,
            label: ` ${res.data.data[i].itemName}`,

          });
        }
      })

      console.log("-----------")
      console.log(this.data)
    },
    search() {
      console.log(this.userInfo.RealName);
      this.$axios.post('/getCheckApplyAll', this.$qs.stringify(this.userInfo)).then(res => {
        console.log(res.data.data);
        this.tableData = res.data.data;
        this.total = res.data.data.length;
      })
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    updataState(row) {
      if (row.state !== 3) {
        this.$message({
          type: 'error',
          message: "Modification not allowed"
        })
        return
      } else {
        console.log(row.id);
        row.state = 4;
        this.userMessage.ID = row.id;
        this.userMessage.State = row.state;
        this.$axios.post('/updateCheckApplyState', this.$qs.stringify(this.userMessage)).then(res => {
          console.log(res);
          this.search();
        })
      }
    },
    updatePrice() {
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      console.log(this.ruleForm)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style>
.form-input {
  width: 80%;
}
.el-text{
  width: 300px;
}
</style>
