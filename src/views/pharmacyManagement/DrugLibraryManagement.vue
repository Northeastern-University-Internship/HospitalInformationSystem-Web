<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="Please enter the drug name"
                    v-model="addForm.drugsName" clearable
                    @clear="doQuery()">
            <el-button slot="append" icon="el-icon-search"
                      @click="doQuery()">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisable = true">Add drug information</el-button>
        </el-col>
      </el-row>

      <el-table :data = "drugsList">
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="drug code" prop="drugsCode"></el-table-column>
        <el-table-column label="Drug Name" prop="drugsName"></el-table-column>
        <el-table-column label="Specification" prop="drugsFormat"></el-table-column>
        <el-table-column type="packaging unit" prop="drugsUnit"></el-table-column>
        <el-table-column label="Pharmaceutical dosage form" prop="drugsDosageID"></el-table-column>
        <el-table-column label="Drug type" prop="drugsTypeID"></el-table-column>
        <el-table-column label="Pinyin mnemonic code" prop="mnemonicCode"></el-table-column>
        <el-table-column label="unit price" prop="drugsPrice"></el-table-column>
        <el-table-column label="factory" prop="manufacturer"></el-table-column>
        <el-table-column label="Creation date" prop="creationDate"></el-table-column>
        <el-table-column label="Last Modified" prop="lastUpdateDate"></el-table-column>
        <el-table-column label="delete mark" prop="delMark"></el-table-column>
        <el-table-column label="Modify operations" width="100px">
          <template slot-scope="scope">
            <el-button type="primary"  size="mini"
                      @click="enableUpdateDialog(scope.row)">Revise</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Delete operation" width="100px">
          <template slot-scope="scope">
            <el-button type="primary"  size="mini"
                      @click="doDelete(scope.row)">delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
        title="Add drug information"
        :visible.sync="addDialogVisable"
        width="50%" @close="addDialogClosed">
      <el-form :model="addForm"  ref="addFormRed" label-width="100px" >
        <el-form-item label="drug code" prop="drugsCode">
          <el-input v-model="addForm.drugsCode"></el-input>
        </el-form-item>
        <el-form-item label="Drug Name" prop="drugsName">
          <el-input v-model="addForm.drugsName"></el-input>
        </el-form-item>
        <el-form-item label="Specification" prop="drugsFormat">
          <el-input v-model="addForm.drugsFormat"></el-input>
        </el-form-item>
        <el-form-item label="packaging unit" prop="drugsUnit">
          <el-input v-model="addForm.drugsUnit"></el-input>
        </el-form-item>
        <el-form-item label="Pharmaceutical dosage form" prop="drugsDosageID">
          <el-input v-model="addForm.drugsDosageID"></el-input>
        </el-form-item>
        <el-form-item label="Drug type" prop="drugsTypeID">
          <el-input v-model="addForm.drugsTypeID"></el-input>
        </el-form-item>
        <el-form-item label="Pinyin mnemonic code" prop="mnemonicCode">
          <el-input v-model="addForm.mnemonicCode"></el-input>
        </el-form-item>
        <el-form-item label="unit price" prop="drugsPrice">
          <el-input v-model="addForm.drugsPrice"></el-input>
        </el-form-item>
        <el-form-item label="factory" prop="manufacturer">
          <el-input v-model="addForm.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="Creation date" prop="creationDate">
          <el-input v-model="addForm.creationDate"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisable = false">Cancel</el-button>
    <el-button type="primary" @click="doAdd()">Sure</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="Modify user"
        :visible.sync="updateDialogVisable"
        width="50%" @close="updateDialogClosed">
      <el-form :model="currentRow" ref="addFormRed" label-width="100px">
        <el-form-item label="drug code" prop="drugsCode">
          <el-input v-model="currentRow.drugsCode"></el-input>
        </el-form-item>
        <el-form-item label="Drug Name" prop="drugsName">
          <el-input v-model="currentRow.drugsName"></el-input>
        </el-form-item>
        <el-form-item label="Specification" prop="drugsFormat">
          <el-input v-model="currentRow.drugsFormat"></el-input>
        </el-form-item>
        <el-form-item label="packaging unit" prop="drugsUnit">
          <el-input v-model="currentRow.drugsUnit"></el-input>
        </el-form-item>
        <el-form-item label="Pharmaceutical dosage form" prop="drugsDosageID">
          <el-input v-model="currentRow.drugsDosageID"></el-input>
        </el-form-item>
        <el-form-item label="Drug type" prop="drugsTypeID">
          <el-input v-model="currentRow.drugsTypeID"></el-input>
        </el-form-item>
        <el-form-item label="Pinyin mnemonic code" prop="mnemonicCode">
          <el-input v-model="currentRow.mnemonicCode"></el-input>
        </el-form-item>
        <el-form-item label="unit price" prop="drugsPrice">
          <el-input v-model="currentRow.drugsPrice"></el-input>
        </el-form-item>
        <el-form-item label="factory" prop="manufacturer">
          <el-input v-model="currentRow.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="Creation date" prop="creationDate">
          <el-input v-model="currentRow.creationDate"></el-input>
        </el-form-item>
        <el-form-item label="Modification date" prop="lastUpdateDate">
          <el-input v-model="currentRow.lastUpdateDate"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"  class = "dialog-footer">
    <el-button @click="updateDialogVisable = false">Cancel</el-button>
    <el-button type="primary" @click="doUpdate()">Sure</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      drugsList: [],
      total: 0,
      addDialogVisable:false,
      updateDialogVisable:false,
      addForm:{
        drugsCode: '',
        drugsTypeID:'',
        drugsName: '',
        drugsUnit:'',
        drugsFormat:'',
        manufacturer :'',
        drugsDosageID : '',
        drugsPrice :'',
        creationDate:'',
        mnemonicCode:'',
        lastUpdateDate:'',
        searchText: '',
      },
      currentRow: {
        drugsCode: '',
        drugsTypeID:'',
        drugsName: '',
        drugsUnit:'',
        drugsFormat:'',
        manufacturer :'',
        drugsDosageID : '',
        drugsPrice :'',
        creationDate:'',
        mnemonicCode:'',
        lastUpdateDate:'',
      },
    }
  },

  created() {
    this.doQuery()
  },

  mounted(){
    this.drugsList = this.$route.query.drugsList;
  },

  methods: {

    doQuery(){
      let url='/outpatientPharmacyWorkstation/drugCatalogueManagement/selectAll';
      let params = this.$qs.stringify(this.addForm);
      this.$axios.post(url,params)
          .then( (resp)=>{
            this.drugsList=resp.data.data;
          } )
          .catch( (err)=>{
            console.log('error=', err);
          } )
    },

    addDialogClosed() {
      this.$refs.addFormRed.resetFields()
    },

    updateDialogClosed() {
      this.$refs.addFormRed.resetFields()
    },
    doAdd(){
      let url='/outpatientPharmacyWorkstation/drugCatalogueManagement/add';
      let param=this.$qs.stringify(this.addForm);
      console.log('tttttttt')
      console.log(this.addForm)
      this.$axios.post(url,param)
          .then((resp)=>{
            let i=resp.data.code;
            console.log('rrrrrrr')
            console.log(resp.data)
            if(i==200){
              this.$router.push('/outpatientPharmacyWorkstation/drugCatalogueManagement/')
              location.reload();
            }else{
              this.msg='Failed to add, please process'
            }
          })
          .catch((err)=>{
            console.log('error=',err)
            this.msg='Failed to add, please process'
          })
      this.addDialogVisable = false
    },

    doUpdate(){
      let url='/outpatientPharmacyWorkstation/drugCatalogueManagement/update';
      let param=this.$qs.stringify(this.currentRow);
      console.log('ttttttteeeeeeeeeerrrt')
      console.log(param)
      this.$axios.post(url,param)
          .then((resp)=>{
            let i=resp.data.code;
            if(i==200){
              this.$router.push('/outpatientPharmacyWorkstation/drugCatalogueManagement')
              location.reload();
            }else{
              this.msg='Modification failed, please process'
            }
          })
          .catch((err)=>{
            console.log('error=',err)
          })
      this.updateDialogVisable = false
    },

    enableUpdateDialog(param) {
      this.updateDialogVisable = true
      this.currentRow = param
    },

  }
}
</script>

<style scoped>

</style>
