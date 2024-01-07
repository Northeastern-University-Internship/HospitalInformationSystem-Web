<template>
  <div class="container">
    <div class="title-container">
      <h1>Hospital Information Management System</h1>
    </div>
    <div class="login-container">
      <div class="login-header">
        <h3>Login Form</h3>
      </div>
      <div class="login-form">
        <label for="username">Username</label>
        <el-input v-model="id" type="text" placeholder="Enter your username" id="username"></el-input>
        <label for="password">Password</label>
        <el-input v-model="psw" type="password" placeholder="Enter your password" id="password"></el-input>
      </div>
      <div class="login-actions">
        <el-button type="primary" @click="login">Login</el-button>
        <el-button type="primary" @click="goToSignUp" plain>Sign Up</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
      id: '',
      psw: ''
    }
  },
  methods: {
    login() {
      if (!this.id || !this.psw) {
        this.$message.error("Please complete all fields.")
      } else {
        axios.post("/login", {userId: this.id, userPsw: this.psw}).then((res)=>{
          if (res.data) {
            this.$store.commit("login", res.data)
            this.$router.replace("/index")
            this.$message.success("Login successful.")
          } else {
            this.$message.error("Incorrect username or password.")
          }
        })
        this.clear()
      }
    },
    goToSignUp() {
      this.clear()
      this.$router.replace("/sign_up")
    },
    clear() {
      this.id = ''
      this.psw = ''
    }
  },
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #6f924f;
  position: absolute;
  top: 0;
  left: 0;
}

.title-container {
  margin-top: 40px;
  text-align: center;
  color: white;
}

.title-container h1 {
  font-size: 35px;
  font-weight: bold;
}

.title-container h2 {
  font-size: 28px;
}

.login-container {
  margin-top: 50px;
  width: 24%;
  height: 50%;
  position: relative;
  left: 38%;
  transform: translateY(3%);
  background-color: white;
  border-radius: 5px;
  opacity: 0.95;
  padding: 20px;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
}

.login-header h3 {
  font-size: 30px;
  color: gray;
  margin-bottom: 30px;
}

.login-form {
  margin: 0 30px;
}

.login-form label {
  font-size: 18px;
  color: gray;
  display: block;
  margin-bottom: 10px;
}

.login-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
