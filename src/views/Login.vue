<template>
  <div class="auth-container">
    <div class="login-wrap">
      <div class="login-box">
        <el-row justify="center" type="flex" align="middle">
          <el-col :span="12">
            <div class="form-section">
              <h2>NEUSoft Hospital Information System</h2>
              <el-image :src="require('@/assets/logo.png')" style="height: 150px; width: 150px; margin-bottom: 20px"></el-image>
              <el-form :model="User" :rules="rules" ref="User" label-width="80px">
                <el-form-item label="Username" prop="UserName">
                  <el-input v-model="User.UserName"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="Password">
                  <el-input type="password" v-model="User.Password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-s-custom" @click="submitForm('User')">Log in</el-button>
                  <el-button @click="resetForm('User')" icon="el-icon-refresh">reset</el-button>
                  <el-button type="success" icon="el-icon-s-custom" @click="submitNewUserForm">Signup</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="divider">
              <el-divider direction="vertical"></el-divider>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      User: {
        UserName: '',
        Password: '',
      },
      NewUser: {
        UserName: '',
        Password: '',
      },
      rules: {
        UserName: [
          { required: true, message: 'Please enter username', trigger: 'blur' },
        ],
        Password: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
        ],
      },
      newUserRules: {
        NewUserName: [
          { required: true, message: 'Please enter username', trigger: 'blur' },
        ],
        NewPassword: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = this.$qs.stringify(this.User);
          console.log("param = ", param);
          this.$axios.post('/login', param).then(res => {
            console.log("res = ", res);
            localStorage.setItem("User", JSON.stringify(res.data.data));
            const jwt = res.headers['Authorization']
            this.$store.commit('SET_TOKEN', jwt);
            console.log(res.headers['Authorization'])
            this.$router.push('/index');
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitNewUserForm() {
    this.$router.push('/signup');
  },
    getCaptcha() {
      this.$axios.get('/captcha').then(res => {
        console.log('/captcha');
        console.log(res);
        this.User.token = res.data.data.token;
        this.captchaImg = res.data.data.captchaImg;
      })
    }
  },
  }
</script>

<style scoped>

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
  padding: 20px;
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
</style>
