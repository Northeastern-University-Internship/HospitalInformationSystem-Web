<template>
  <div style="text-align: center;">
    <h2>welcome {{ userInfo.RealName }} Visit the user center</h2>
    <div>
      <h3>
        your identity：
        <el-tag v-if="userInfo.UseType === 1" effect="dark" type="danger">hospital administrator</el-tag>
        <el-tag v-else-if="userInfo.UseType === 2" effect="dark" type="info">Registered toll collector</el-tag>
        <el-tag v-else-if="userInfo.UseType === 3" effect="dark" type="success">outpatient doctor</el-tag>
        <el-tag v-else-if="userInfo.UseType === 4" effect="dark" type="success">medical technician</el-tag>
        <el-tag v-else-if="userInfo.UseType === 5" effect="dark" type="primary">pharmacy operator</el-tag>
        <el-tag v-else-if="userInfo.UseType === 6" effect="dark" type="danger">financial administrator</el-tag>
        <el-tag v-else>Unknown identity</el-tag>
      </h3>
    </div>

    <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px">
      <el-form-item label="Old Password" prop="currentPass">
        <el-input type="Password" v-model="passForm.currentPass" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="New Password" prop="Password">
        <el-input type="Password" v-model="passForm.Password" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="checkPass">
        <el-input type="Password" v-model="passForm.checkPass" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('passForm')" icon="el-icon-check">submit</el-button>
        <el-button type="info" @click="resetForm('passForm')" icon="el-icon-close">reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "UserCenter",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password again'));
      } else if (value !== this.passForm.Password) {
        callback(new Error('The password entered twice is inconsistent!'));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
        ID: '',
        UserName: '',
        RealName: '',
        UseType: '',
      },
      passForm: {
        Password: '',
        checkPass: '',
        currentPass: ''
      },
      rules: {
        Password: [
          { required: true, message: 'Please enter a new password', trigger: 'blur' },
          { min: 6, max: 12, message: '6 to 12 characters in length 12', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        currentPass: [
          { required: true, message: 'Please enter current password', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      let user = JSON.parse(localStorage.getItem("User"));
      this.userInfo.ID = user.id;
      this.userInfo.UserName = user.userName;
      this.userInfo.RealName = user.realName;
      this.userInfo.UseType = user.useType;
      console.log("this.userInfo : ", this.userInfo);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          const _this = this
          this.$axios.get('/userCenter/changePassword', {
            params: {
              ID: this.userInfo.ID,
              password: this.passForm.Password,
              checkPass: this.passForm.checkPass,
              currentPass: this.passForm.currentPass
            }
          }).then(res => {

            this.$router.push("/login");
          })
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}
</style>
