<template>
    <div>
      <el-container>
        <el-header height="100px" style="background-color: #81b9f0; line-height: 100px;">
          <span style="font-size: 40px; color: white;">NeuSoft HIS</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="font-size: 20px; color: white;">A practical training project</span>
          <span class="hello-text" style="font-size: 20px; color: white;">Hello, {{user.name}}</span>
          <el-button @click="drawer = true" class="user-center-btn" type="primary" icon="el-icon-more" circle></el-button>
        </el-header>
        <el-container>
          <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu default-active="1" unique-opened=true>
              <!-- Menu items -->
              <el-submenu index="1">
                <template slot="title">Registration & Billing</template>
                <el-menu-item index="register" @click="goTo('/index/register')">Register</el-menu-item>
                <el-menu-item index="withdraw" @click="goTo('/index/withdraw')">Cancel Registration</el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">Outpatient Doctor</template>
                <el-menu-item index="diagnose" @click="goTo('/index/diagnose')">Outpatient Records</el-menu-item>
                <el-menu-item index="exam_req">Test Requests</el-menu-item>
                <el-menu-item index="make_presc" @click="goTo('/index/make_presc')">Prescribe</el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">Lab Procedures</template>
                <el-menu-item index="do_exam">Patient Testing</el-menu-item>
                <el-menu-item index="exam_man">Project Management</el-menu-item>
              </el-submenu>
                <el-submenu index="4">
                    <template slot="title">Pharmacy Management</template>
                    <el-menu-item index="drug_trans" @click="goTo('/index/drug_trans')">Dispense Medication</el-menu-item>
                    <el-menu-item index="drug_rcv" @click="goTo('/index/drug_rcv')">Medication Returns</el-menu-item>
                    <el-menu-item index="drug_man">Drug Management</el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">Financial Management</template>
                    <el-menu-item index="pay" @click="goTo('/index/pay')">Payment Transactions</el-menu-item>
                    <el-menu-item index="refund" @click="goTo('/index/refund')">Refund Transactions</el-menu-item>
                    <el-menu-item index="finance">Financial Statistics</el-menu-item>
                </el-submenu>
                <el-submenu index="6">
                    <template slot="title">Inspection management</template>
                    <el-menu-item index="Check application">Check Application</el-menu-item>
                    <el-menu-item index="patient entry">Patient Entrys</el-menu-item>
                    <el-menu-item index="Check entry">Check Entry</el-menu-item>
                    <el-menu-item index="Inspection management">Inspection Management</el-menu-item>
                </el-submenu>
                <el-submenu index="7">
                    <template slot="title">System Information</template>
                    <el-menu-item index="constant">Constant Item Management</el-menu-item>
                    <el-menu-item index="department">Department Management</el-menu-item>
                    <el-menu-item index="user">User Management</el-menu-item>
                    <el-menu-item index="disease">Disease Information Management</el-menu-item>
                    <el-menu-item index="examination">Test Item Management</el-menu-item>
                    <el-menu-item index="drug">Drug Management</el-menu-item>
                    <el-menu-item index="arrange">Physician Scheduling Management</el-menu-item>
                </el-submenu>
              <!-- ... -->
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
        <el-drawer title="User Center" :visible.sync="drawer" size="20%" direction="rtl">
          <div>
            <div class="user-center-main">
              <!-- Form fields -->
              <span class="user-center-font">User ID</span><br>
              <el-input style="width: 90%;" v-model="userTemp.id" readonly></el-input><br>
              <span class="user-center-font">Password</span><br>
              <el-input type="password" style="width: 90%;" v-model="userTemp.psw"></el-input><br>
              <span class="user-center-font">Name</span><br>
              <el-input style="width: 90%;" v-model="userTemp.name"></el-input><br>
              <span class="user-center-font">Department</span><br>
              <el-select v-model="userTemp.departmentId" style="width: 90%">
                <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id"></el-option>
              </el-select><br>
              <span class="user-center-font">User Type</span><br>
              <el-select v-model="userTemp.type" style="width: 90%">
                <el-option v-for="t in types" :key="t.value" :label="t.label" :value="t.value"></el-option>
              </el-select><br>
              <el-button type="primary" style="margin-top: 50px; margin-left: 45px;" size="small" @click="save()">Save</el-button>
              <el-button type="primary" style="margin-top: 50px;" size="small" plain @click="reset()">Reset</el-button>
            </div>
            <div class="user-center-bottom">
              <el-button type="danger" @click="logout()" plain>Log Out</el-button> 
            </div>
          </div>
        </el-drawer>
      </el-container>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Index',
    data() {
      return {
        drawer: false,
        user: {
          id: null,
          name: null,
          psw: null,
          departmentId: null,
          type: null
        },
        userTemp: {
          id: null,
          name: null,
          psw: null,
          departmentId: null,
          type: null
        },
        types: [
          {
            label: "Registration Administrator",
            value: 1
          },
          {
            label: "Physician",
            value: 2
          },
          {
            label: "Lab Technician",
            value: 3
          },
          {
            label: "Pharmacist",
            value: 4
          },
          {
            label: "Finance Officer",
            value: 5
          },
          {
            label: "Administrative Manager",
            value: 6
          }
        ],
        departments: []
      }
    },
    methods: {
      goTo(url) {
        this.$router.replace(url);
      },
      save() {
        axios.post("/update_user", this.userTemp);
        this.user.id = this.userTemp.id;
        this.user.psw = this.userTemp.psw;
        this.user.name = this.userTemp.name;
        this.user.departmentId = this.userTemp.departmentId;
        this.user.type = this.userTemp.type;
      },
      reset() {
        this.userTemp.id = this.user.id;
        this.userTemp.name = this.user.name;
        this.userTemp.psw = this.user.psw;
        this.userTemp.departmentId = this.user.departmentId;
        this.userTemp.type = this.user.type;
      },
      logout() {
        this.$store.commit('logout');
        this.$router.replace("/login");
      },
      init() {
        axios.post("/init_depart").then((res) => {
          this.departments = res.data;
        });
        this.user = this.$store.state.user;
        this.userTemp.id = this.user.id;
        this.userTemp.psw = this.user.psw;
        this.userTemp.name = this.user.name;
        this.userTemp.departmentId = this.user.departmentId;
        this.userTemp.type = this.user.type;
      }
    },
    mounted() {
      this.init();
    }
  }
  </script>
  