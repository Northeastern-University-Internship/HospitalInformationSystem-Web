<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-container>
        <div class="box-userface">
          <img style="
              background: white;
              height: 80px;
              width: 80px;
              border: 1px solid #c0c0c0;
              border-radius: 50%;"
              src="../assets/logo.png" alt="profilePicture">
        </div>
        <label class="userlable">{{ userInfo.realName }}</label>
      </el-container>
    </div>
    <el-container direction="vertical" style="margin-top: 0px; text-align: left; margin-left: 20px">
      <label class="userinfolsit">Department:
        <label style="margin-left: 80px">
          {{ userDept.deptName }}
        </label>
      </label>
      <label class="userinfolsit">User Type:
        <label style="margin-left: 80px">
          {{ getUserTypeName() }}
        </label>
      </label>
    </el-container>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      userTypeList: [
        {
          id: 1,
          name: 'Hospital Administrator'
        },
        {
          id: 2,
          name: 'Registered Order Collector'
        },
        {
          id: 3,
          name: 'Outpatient Doctor'
        },
        {
          id: 4,
          name: 'Medical Technician Doctor'
        },
        {
          id: 5,
          name: 'Pharmacy Operator'
        },
        {
          id: 6,
          name: 'Accounting Manager'
        },
      ],
      userDept: {}
    }
  },
  methods: {
    /**
     * getting the type of the user
     * @returns {any}
     */
    getCurrentUser() {
      return JSON.parse(localStorage.getItem("User"))
    },

    /**
     * setting user type
     * @returns {Promise<void>}
     */
    async setCurrentUser() {
      this.userInfo = this.getCurrentUser()

      const resp = await this.$axios.get(`/queryUserDeptByID?DeptID=${this.userInfo.deptID}`)
      this.userDept = resp.data.data
    },

    getUserTypeName() {
      for (let i = 0; i < this.userTypeList.length; i++) {
        if (this.userInfo.useType === this.userTypeList[i].id) {
          return this.userTypeList[i].name
        }
      }
    }
  },
  created() {
    this.setCurrentUser()
  }
}
</script>

<style scoped>
.box-card {
  width: 370px;
  height: 198px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 7px 0px rgb(0 0 0 / 50%) !important;
}

.box-userface {
  display: inline;
  float: left;
  margin-left: 10px;
}

.userlable {
  color: rgb(30, 50, 115);
  float: left;
  font-size: 30px;
  font-weight: bolder;
  margin-top: 20px;
  margin-left: 60px;
}

.userinfolsit {
  float: left;
  top: 0;
  font-size: 15px;
  margin-bottom: 5px;
  margin-left: 30px;
  padding: 0;
}
</style>
