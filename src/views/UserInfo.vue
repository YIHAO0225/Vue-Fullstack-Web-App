<template>
  <NavMenu></NavMenu>
  <div class="background-image-blur-whitewash"></div>
  <div class="common-layout">
    <el-row :gutter="10" type="flex">
      <el-col :offset="3" :span="18" style="text-align: center">
        <div>
          <h2>UserInfo</h2>
        </div>
        <el-table :data="users" header-align='right' highlight-current-row style="margin-top:20px"
                  @row-click="handle" :cell-style="{ 'text-align': 'center' }" height="700">
          <el-table-column type="index" width="70" header-align="center"/>
          <el-table-column property="firstname" label="Fristname" header-align="center"/>
          <el-table-column property="lastname" label="Lastname" header-align="center"/>
          <el-table-column property="email" label="Email" header-align="center"/>
          <el-table-column property="_id" label="Detailed Info" header-align="center">
            <template #default="{ row }">
              <el-button type="primary" @click="goToUserProfile(row._id)">Details
                <el-icon class="el-icon--right">
                  <icon-view/>
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="SetAdministrator">Set as administrator</el-button>
          <el-button @click="DeleteAdministrator">Set as user</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {View as IconView} from '@element-plus/icons-vue'
</script>

<script>
import NavMenu from "../components/NavMenu.vue";
import axios from 'axios';

export default {
  name: "UserInfo",
  components: {
    NavMenu
  },
  data() {
    return {
      users: null,
      currentSelect: null,
    }
  },
  methods: {
    goToUserProfile(id) {
      this.$router.push({name: 'otherUserProfile', params: {id: id}})
    },
    getusers() {
      axios.get('/users')
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            console.error('Error fetching character data:', error);
          });
    },
    SetAdministrator() {
      if (this.currentSelect == null) {
        this.$message({
          message: "No character be selected!",
          type: "error"
        })
        return
      }
      axios.post('/adminlist/' + this.currentSelect)
          .then(response => {
            if (response.status == 200) {
              this.$message({
                message: response.data.message,
                type: 'success'
              })
            } else {
              this.$message({
                message: response.data.message,
                type: 'warning'
              })
            }
          })
    },
    DeleteAdministrator() {
      if (this.currentSelect == null) {
        this.$message({
          message: "No character be selected!",
          type: "error"
        })
        return
      }
      axios.post('/adminlist/delete/' + this.currentSelect)
          .then(response => {
            if (response.status == 200) {
              this.$message({
                message: response.data.message,
                type: 'success'
              })
            } else {
              this.$message({
                message: response.data.message,
                type: 'warning'
              })
            }
          })
    },
    handle(row) {
      this.currentSelect = row._id
    }
  },
  created() {
    this.getusers()
  }
}
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
}

h1 {
  font-size: 20px;
}

h2 {
  font-size: 18px;
}

.container > div {
  margin-bottom: 50px;
}
</style>