<template>
  <div class="signup-container">
    <div class="header">
      <h1>Hospital Information Management System</h1>
    </div>
    <div class="signup-form-container">
      <div class="signup-form-header">
        <h3>SignUp Form</h3>
      </div>
      <div class="signup-form">
        <label>Username</label>
        <el-input v-model="user.id" size="small" placeholder="Enter your username"></el-input>
        <label>Full Name</label>
        <el-input v-model="user.name" size="small" placeholder="Enter your real name"></el-input>
        <label>Password</label>
        <el-input v-model="user.psw" size="small" type="password" placeholder="Enter your password"></el-input>
        <label>Repeat Password</label>
        <el-input v-model="pswCheck" size="small" type="password" placeholder="Repeat your password"></el-input>
        <label>User Type</label>
        <el-select v-model="user.type" size="small" placeholder="Select user type">
          <el-option v-for="t in types" :key="t.value" :label="t.label" :value="t.value"></el-option>
        </el-select>
        <label>Department</label>
        <el-select v-model="user.departmentId" size="small" placeholder="Select department">
          <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id"></el-option>
        </el-select>
        <div class="signup-form-actions">
        <el-button type="primary" @click="signUp">Sign Up</el-button>
        <el-button type="primary" @click="back" plain>Back</el-button>
      </div>
      </div>
  
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUp',
  data() {
    return {
      user: {
        id: null,
        name: null,
        password: null,
        psw: null,
        departmentId: null,
        type: null
      },
      pswCheck: null,
      types: [
        { label: "Registration Administrator", value: 1 },
        { label: "Physician", value: 2 },
        { label: "Laboratory Technician", value: 3 },
        { label: "Pharmacist", value: 4 },
        { label: "Financial Officer", value: 5 },
        { label: "Administrative Manager", value: 6 }
      ],
      departments: [
        { label: "Jr. Registrer", value: 1}
      ]
    };
  },
  methods: {
    signUp() {
      if (this.user.password !== this.passwordCheck) {
        this.$message.error("The passwords do not match.");
      } else if (!this.user.id || !this.user.name || !this.user.password || 
                 !this.user.type || !this.user.departmentId) {
        this.$message.error("Please fill in all the information.");
      } else {
        axios.post("/sign_up", this.user).then((response) => {
          if (response.data) {
            this.$store.commit("login", response.data);
            this.$router.replace("/index");
            this.$message.success("Login successful.");
          } else {
            this.$message.error("Registration failed.");
          }
        });
        this.init();
      }
    },
    back() {
      this.init();
      this.$router.replace("/login");
    },
    init() {
      this.user = {
        id: null,
        password: null,
        type: null,
        departmentId: null
      };
      axios.post("/sign_up/init_id").then((response) => {
        this.user.id = response.data;
      });
      axios.post("/sign_up/init_depart").then((response) => {
        this.departments = response.data;
      });
      this.passwordCheck = null;
    }
  },
  mounted() {
    this.init();
  }
};
</script>


<style scoped>
.signup-container {
  width: 100%;
  /* height: 100%; */
  background-color: #6f924f;
  position: absolute;
  top: 0;
  left: 0;
}

.el-select {
    display: inline;
    position: relative;
}

.header {
  text-align: center;
  padding-top: 40px;
  color: white;
}

.header h1 {
  font-size: 35px;
  font-weight: bold;
}

.header h2 {
  font-size: 28px;
}

.signup-form-container {
  margin-bottom: 50px;
  margin-top: 10px;
  width: 24%;
  /* height: 60%; */
  position: relative;
  left: 38%;
  transform: translateY(3%);
  background-color: white;
  border-radius: 5px;
  opacity: 0.95;
  padding: 10px;
  box-sizing: border-box;
}

.signup-form-header {
  text-align: center;
  margin-bottom: 20px;
}

.signup-form-header h3 {
  font-size: 30px;
  color: gray;
}

.signup-form {
  width: calc(100% - 60px);
  margin: 0 30px;
}

.signup-form label {
  display: block;
  color: gray;
  font-size: 14px;
  margin: 10px 0;
}

.signup-form-actions {
  margin-top: 20px;
  text-align: center;
}

.signup-form-actions .el-button {
  margin: 0 10px;
}
</style>