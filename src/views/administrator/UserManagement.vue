<template>
  <div class="user-management">
    <!-- Actions for Adding a New User -->
    <div class="add-user-action">
      <button class="btn add-user" @click="showAddUserModal">Add New User</button>
    </div>
    
    <!-- User Table -->
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>Password</th>
            <th>RealName</th>
            <th>UseType</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.userName }}</td>
            <td>{{ user.password }}</td>
            <td>{{ user.realName }}</td>
            <td>{{ user.useType }}</td>
            <td>
              <button class="btn edit" @click="editUser(user)">Edit</button>
              <button class="btn delete" @click="confirmDeletion(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserManagement",
  data() {
    return {
      users: [],
      addUserForm: {}, // Form data for adding users
      editUserForm: {}, // Form data for editing users
      msg: '', // Message to display feedback
      addDialogVisible: false, // Controls visibility of the add user dialog
      editDialogVisible: false, // Controls visibility of the edit user dialog
    };
  },
  methods: {
    fetchUsers() {
      let url = 'user/queryUserAll';
      this.$axios.get(url)
        .then(response => {
          this.users = response.data.data;
        })
        .catch(error => {
          console.log('error=', error);
          console.error('Error fetching users:', error);
        });
    },

    doAdd() {
      let url = '/user/add';
      let params = this.$qs.stringify(this.addUserForm);
      this.$axios.post(url, params)
        .then(resp => {
          if (resp.data.code === 200) {
            this.msg = 'User added successfully';
            this.fetchUsers(); // Refresh the user list
          } else {
            this.msg = 'Failed to add user, please try again';
          }
        })
        .catch(error => {
          console.log('error=', error);
          this.msg = 'Failed to add user, please try again';
        });
      this.addDialogVisible = false;
    },

    doDelete(userId) {
      if (!confirm("Are you sure you want to delete this user?")) {
        return; // Stop if the user does not confirm
      }
      let url = '/user/delete/' + userId;
      this.$axios.post(url)
        .then(resp => {
          if (resp.data.code === 200) {
            this.msg = 'User deleted successfully';
            this.fetchUsers(); // Refresh the user list
          } else {
            this.msg = 'Failed to delete user, please try again';
          }
        })
        .catch(error => {
          console.log('error=', error);
          this.msg = 'Failed to delete user, please try again';
        });
    },

    doEdit() {
      let url = '/user/update';
      let params = this.$qs.stringify(this.editUserForm);
      this.$axios.post(url, params)
        .then(resp => {
          if (resp.data.code === 200) {
            this.msg = 'User updated successfully';
            this.fetchUsers(); // Refresh the user list
          } else {
            this.msg = 'User update failed, please try again';
          }
        })
        .catch(error => {
          console.log('error=', error);
          this.msg = 'User update failed, please try again';
        });
      this.editDialogVisible = false;
    },

    showAddUserDialog() {
      this.addUserForm = {}; // Reset the form
      this.addDialogVisible = true;
    },

    showEditUserDialog(user) {
      this.editUserForm = { ...user }; // Clone the user data into the form
      this.editDialogVisible = true;
    },

    // Reset form fields when the dialog is closed
    addDialogClosed() {
      this.addUserForm = {};
    },

    editDialogClosed() {
      this.editUserForm = {};
    },
  },
  mounted() {
    this.fetchUsers(); // Fetch users when component is mounted
  }
}
</script>

import axios from 'axios';

export default {
  name: "UserManagement",
  data() {
    return {
      users: [], // This will hold the array of users
    };
  },
  methods: {
    fetchUsers() {
      // Replace with your actual API endpoint
      axios.get('/queryUserAll')
        .then(response => {
          this.users = response.data.data; // Assuming the data comes in this format
        })
        .catch(error => {
          console.error("There was an error fetching the users:", error);
          // Handle the error. Show user feedback
        });
    },
    // ... other methods for add, edit, delete ...
  },
  mounted() {
    this.fetchUsers(); // Fetch users when component is mounted
  }
}
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
