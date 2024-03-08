<template>
  <div class="auth-container">
    <div class="login-wrap">
      <div class="login-box">
        <div style="text-align: center;">
          <el-image :src="require('@/assets/logo.png')" style="height: 120px; width: 250px; margin-bottom: 10px; text-align: center;"></el-image>
        </div>
        <el-form ref="userForm" :model="user" :rules="rules" label-position="left" label-width="100px">
          <h2 class="form-title">User Registration</h2>
          <el-form-item label="Username" prop="UserName">
            <el-input v-model="user.UserName"></el-input>
          </el-form-item>
          <el-form-item label="Real Name" prop="RealName">
            <el-input v-model="user.RealName"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="Password">
            <el-input type="password" v-model="user.Password"></el-input>
          </el-form-item>
          <el-form-item label="User Type" prop="UseType">
            <el-select v-model="user.UseType" placeholder="Select user type">
              <el-option v-for="item in userTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Department" prop="DeptID">
            <el-input v-model="user.DeptID"></el-input>
          </el-form-item>
          <div class="form-buttons">
            <el-button type="primary" @click="submitForm('userForm')">Register</el-button>
            <el-button @click="resetForm('userForm')">Reset</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  name: 'UserRegistration',
  data() {
    return {
      user: {
        UserName: '',
        Password: '',
        RealName: '',
        UseType: null,
        DeptID: ''
      },
      userTypes: [
        { label: "Registration Administrator", value: 1 },
        { label: "Physician", value: 2 },
        { label: "Laboratory Technician", value: 3 },
        { label: "Pharmacist", value: 4 },
        { label: "Financial Officer", value: 5 },
        { label: "Administrative Manager", value: 6 }
      ],
      rules: {
        UserName: [{ required: true, message: 'Please input your username', trigger: 'blur' }],
        Password: [{ required: true, message: 'Please input your password', trigger: 'blur' }],
        RealName: [{ required: true, message: 'Please input your real name', trigger: 'blur' }],
        UseType: [{ required: true, message: 'Please select your user type', trigger: 'change' }],
        DeptID: [{ required: true, message: 'Please input your department ID', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!', this.user);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    loginForm() {
    this.$router.push('/login'); 
  },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .login-wrap {
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  .login-box {
    max-width: 500px;
    margin: auto;
  }
  .form-title {
    text-align: center;
    margin-bottom: 20px;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .form-buttons {
    text-align: center;
  }
  .el-button {
    margin: 0 10px;
  }
  .el-select {
    min-width: -webkit-fill-available;
  }
  .auth-container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .login-wrap {
    position: relative;
    width: 1000px;
    height: 600px;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  .login-box {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
  }
  
  .form-section {
    padding: 40px;
    text-align: center;
  }
  
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
  
  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  .el-divider {
    height: 80%;
  }
  
  /* You might need to adjust the following styles according to your project's design */
  </style>





