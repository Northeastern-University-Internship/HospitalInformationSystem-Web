<template>
  <div class="user-management">
    <el-card class="box-card">
      <div class="add-user-action">
        <el-button type="primary" @click="showAddUserDialog">Add New User</el-button>
      </div>
      
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="userName" label="Username"></el-table-column>
        <el-table-column prop="password" label="Password"></el-table-column>
        <el-table-column prop="realName" label="Real Name"></el-table-column>
        <el-table-column prop="useType" label="User Type"></el-table-column>
        <el-table-column label="Actions" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditUserDialog(scope.row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="confirmDeletion(scope.row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- Add User Dialog -->
    <el-dialog title="Add New User" :visible.sync="addDialogVisible" @close="addDialogClosed">
      <el-form :model="addUserForm" label-width="120px">
        <!-- Form fields for user details -->
        <!-- Assuming userName, password, realName, and useType are the fields you want to capture -->
        <el-form-item label="Username">
          <el-input v-model="addUserForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Real Name">
          <el-input v-model="addUserForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="User Type">
          <el-input v-model="addUserForm.useType"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="doAdd">Add</el-button>
      </span>
    </el-dialog>
    
    <!-- Edit User Dialog -->
    <el-dialog title="Edit User" :visible.sync="editDialogVisible" @close="editDialogClosed">
      <el-form :model="editUserForm" label-width="120px">
        <!-- Form fields for user details, similar to the add form -->
        <el-form-item label="Username">
          <el-input v-model="editUserForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="editUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Real Name">
          <el-input v-model="editUserForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="User Type">
          <el-input v-model="editUserForm.useType"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="doEdit">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// Import Axios if it's not globally available in your project
// You might need to adjust import paths based on your project structure
import axios from 'axios';

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      addUserForm: {},
      editUserForm: {},
      addDialogVisible: false,
      editDialogVisible: false,
      msg: ''
    };
  },
  methods: {
    fetchUsers() {
      // Adjust the URL to your API endpoint
      axios.get('/user/queryUserAll')
        .then(response => {
          this.users = response.data.data;
        })
        .catch(error => {
          console.error("Error fetching users:", error);
        });
    },
    showAddUserDialog() {
      this.addUserForm = {}; // Reset the form
      this.addDialogVisible = true;
    },
    addDialogClosed() {
      this.addUserForm = {};
    },
    doAdd() {
      // Adjust the URL and API endpoint as necessary
      axios.post('/user/add', this.addUserForm)
        .then(response => {
          if (response.data.code === 200) {
            this.fetchUsers(); // Refresh the user list after adding
            this.addDialogVisible = false;
          } else {
            this.msg = 'Failed to add user, please try again';
          }
        })
        .catch(error => {
          console.error("Error adding user:", error);
          this.msg = 'Failed to add user, please try again';
        });
    },
    showEditUserDialog(user) {
      this.editUserForm = Object.assign({}, user); // Clone the user object
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.editUserForm = {};
    },
    doEdit() {
      // Adjust the URL and API endpoint as necessary
      axios.post('/user/update', this.editUserForm)
        .then(response => {
          if (response.data.code === 200) {
            this.fetchUsers(); // Refresh the user list after editing
            this.editDialogVisible = false;
          } else {
            this.msg = 'User update failed, please try again';
          }
        })
        .catch(error => {
          console.error("Error updating user:", error);
          this.msg = 'User update failed, please try again';
        });
    },
    confirmDeletion(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        // Adjust the URL and API endpoint as necessary
        axios.post(`/user/delete/${userId}`)
          .then(response => {
            if (response.data.code === 200) {
              this.fetchUsers(); // Refresh the user list after deletion
            } else {
              this.msg = 'Failed to delete user, please try again';
            }
          })
          .catch(error => {
            console.error("Error deleting user:", error);
            this.msg = 'Failed to delete user, please try again';
          });
      }
    },
  },
  mounted() {
    this.fetchUsers(); // Initial fetch of the user list
  }
};
</script>


<style scoped>
.add-user-action {
  margin-bottom: 20px;
  text-align: right;
}
.user-management {
  padding: 20px;
  background-color: #f5f5f5;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: #007bff;
  color: white;
}

.table thead th {
  padding: 10px;
  text-align: left;
}

.table tbody td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.btn {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: white;
}

.edit {
  background-color: #ffc107;
}

.delete {
  background-color: #dc3545;
}

.add-user {
  background-color: #28a745;
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}
</style>
