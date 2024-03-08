<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">New</el-button>
      </el-form-item>
    </el-form>

    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        stripe
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="name"
          label="name"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="perms"
          label="permission encoding"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="icon"
          label="icon">
      </el-table-column>
      <el-table-column
          prop="type"
          label="type">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0" type="primary">Table of contents</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 1" type="success">menu</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 2" type="danger">button</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="path"
          label="Menu URL">
      </el-table-column>
      <el-table-column
          prop="component"
          label="Menu component">
      </el-table-column>
      <el-table-column
          prop="orderNum"
          label="queue number">
      </el-table-column>
      <el-table-column
          prop="statu"
          label="state">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.statu === 1" type="success">normal</el-tag>
          <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">Disable</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="icon"
          label="operate">
        <template slot-scope="scope">
          <el-button type="text">edit</el-button>
          <el-divider direction="vertical"></el-divider>
          <!--          <el-button type="text">delete</el-button>-->
          <template>
            <el-popconfirm title="confirm to delete?">
              <el-button type="text" slot="reference">delete</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        title="hint"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="Previous menu" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="Please select the upper level menu">
            <template v-for="item in tableData">
              <el-option :label="item.name" :value="item.id"></el-option>
              <template v-for="child in item.children">
                <el-option :label="child.name" :value="child.id">
                  <span>{{"- " + child.name}}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="Menu name" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="permission encoding" prop="perms" label-width="100px">
          <el-input v-model="editForm.perms" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="icon" prop="icon" label-width="100px">
          <el-input v-model="editForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Menu URL" prop="path" label-width="100px">
          <el-input v-model="editForm.path" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Menu component" prop="component" label-width="100px">
          <el-input v-model="editForm.component" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="type" prop="type" label-width="100px">
          <el-radio-group v-model="editForm.type">
            <el-radio :label=0>Table of contents</el-radio>
            <el-radio :label=1>menu</el-radio>
            <el-radio :label=2>button</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="state" prop="statu" label-width="100px">
          <el-radio-group v-model="editForm.statu">
            <el-radio :label=0>Disable</el-radio>
            <el-radio :label=1>normal</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="queue number" prop="orderNum" label-width="100px">
          <el-input-number v-model="editForm.orderNum" :min="1" label="queue number">1</el-input-number>
        </el-form-item>



        <el-form-item label="special resources" prop="resource">
          <el-radio-group v-model="editForm.resource">
            <el-radio label="Online brand sponsorship"></el-radio>
            <el-radio label="Offline venues are free"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Create now</el-button>
          <el-button @click="resetForm('editForm')">reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      editForm: {

      },
      tableData: [],
      dialogVisible: false,
      editFormRules: {
        parentId: [
          {required: true, message: 'Please select the upper level menu', trigger: 'blur'}
        ],
        name: [
          {required: true, message: 'Please enter name', trigger: 'blur'}
        ],
        perms: [
          {required: true, message: 'Please enter the permission code', trigger: 'blur'}
        ],
        type: [
          {required: true, message: 'Please select a status', trigger: 'blur'}
        ],
        orderNum: [
          {required: true, message: 'Please enter the sort number', trigger: 'blur'}
        ],
        statu: [
          {required: true, message: 'Please select a status', trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    this.getMenuTree();
  },
  methods: {
    getMenuTree() {
      this.$axios.get("/sys/menu/list").then(res => {
        this.tableData = res.data.data;
      })
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2024-01-01',
            name: 'Wang',
            address: 'NO. 3-11, Wenhua Road, Heping District, Shenyang, P. R. China'
          }, {
            id: 32,
            date: '2024-01-01',
            name: 'Donggi',
            address: 'NO. 3-11, Wenhua Road, Heping District, Shenyang, P. R. China'
          }
        ])
      }, 1000)
    }
  },
}
</script>

<style scoped>

</style>