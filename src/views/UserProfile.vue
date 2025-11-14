<template>
  <NavMenu></NavMenu>
  <div class="background-image-blur-whitewash"></div>
  <el-row :gutter="20">
    <el-col class="container">
      <div class="card-format">
        <el-card v-if="user">
          <div class="layout">
            <div>
              <h1>User Information</h1>
              <div class="user-info">
                <p class="user-detail"><b>First Name</b> </p>
                <p> {{ user.firstname }}</p>
                <p class="user-detail"><b>Last Name</b> </p>
                <p> {{ user.lastname }}</p>
                  <p class="user-detail"><b>Email</b></p>
                  <p>{{ user.email }}</p>
                  <p class="user-detail"><b>Is Admin</b></p>
                  <p> {{ user.isAdmin ? 'Yes' : 'No' }}</p>
              </div>
            </div>
            <div>
              <div class="inside-layout">
                <div>
                  <h2 class="subtitle">Favourite Characters:</h2>
                  <div class="favourite-info">
                    <el-table :data="favouriteCharacters">
                      <el-table-column label="Favorite" width="100">
                        <el-icon class="heart-icon" size="20"></el-icon>
                      </el-table-column>
                      <el-table-column prop="name" label="Character Name"/>
                    </el-table>
                  </div>
                </div>
                <div>
                  <h2 class="subtitle">Recent Comparisons:</h2>
                  <div class="recent-info">
                    <el-table :data="recentComparisons" style="width: 100%" :empty-text="noData">
                      <el-table-column prop="character1" label="Character Name"/>
                      <el-table-column>vs</el-table-column>
                      <el-table-column prop="character2" label="Character Name"/>
                    </el-table>
                  </div>
                </div>
              </div>
              <h2 class="subtitle" style="margin-top: 50px">Changes/Contributions:</h2>
              <div class="change-list">
                <el-table :data="changeList">
                  <el-table-column label="Date" prop="date"></el-table-column>
                  <el-table-column label="Action" prop="action" width="130"></el-table-column>
                  <el-table-column label="Character" prop="data.id"></el-table-column>
                  <el-table-column prop="data.id" label="Details">
                    <template #default="{ row }">
                      <el-popover placement="right" :width="350" trigger="hover">
                        <template #reference>
                          <el-button style="margin-right: 16px">Details
                            <el-icon class="el-icon--right">
                              <icon-view/>
                            </el-icon>
                          </el-button>
                        </template>
                        <el-table :data="convertToTableData(row)">
                          <el-table-column width="150" property="attribute" label="attribute"/>
                          <el-table-column width="200" property="value" label="value"/>
                        </el-table>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="Status" prop="status">
                    <template #default="{ row }">
                      <span v-if="row.status === 'Pending'" style="color: #f50;">Pending</span>
                      <span v-else-if="row.status === 'Approved'" style="color: #87d068;">Approved</span>
                      <span v-else-if="row.status === 'Rejected'" style="color: #f5222d;">Rejected</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Revoke">
                    <template #default="{ row }">
                      <template v-if="!isGuest">
                        <el-button type="danger" v-if="row.status === 'Pending'" @click="revokeChange(row)">Revoke
                        </el-button>
                        <el-button type="warning" v-if="row.status !== 'Pending'" @click="cannotRevoke()">Revoke
                        </el-button>
                      </template>
                      <template v-else>
                        <el-button type="info" @click="guestAlert()">Revoke
                        </el-button>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import {View as IconView} from '@element-plus/icons-vue'
</script>

<script>
import NavMenu from "../components/NavMenu.vue";
import axios from "axios";
import {ElIcon} from "element-plus";

export default {
  name: "user-profile",
  components: {NavMenu, ElIcon},
  data() {
    return {
      favouriteCharacters: ['Character 1', 'Character 2', 'Character 3'],
      recentComparisons: [],
      changeList: [
        {action: 'Change 1', status: 'pending', date: 1},
        {action: 'Change 2', status: 'approved', date: 1},
        {action: 'Change 3', status: 'rejected', date: 1}
      ],
      previousCompArr: [],
      characters: [],
      user: null,
      isGuest: false,
      noData: 'No Data'
    };
  },
  methods: {
    guestAlert() {
      this.$message({
        message: "You cannot revoke other user's action!",
        type: "info"
      })
    },
    convertToTableData(data) {
      if (data.data) data = data.data
      return Object.entries(data).map(([key, value]) => ({attribute: key, value}));
    },
    revokeChange(data) {
      axios.delete('/contributions/' + data._id).then(() => {
        this.$message({
          message: "The action has been revoked successfully!",
          type: "success"
        })

        const index = this.changeList.findIndex(item => item._id === data._id);
        if (index !== -1) {
          this.changeList.splice(index, 1);
        }

      }).catch(error => {
        console.error('Error fetching data:', error);
        this.$message.error({
          message: error.response.data.message,
        });
      })

    },
    cannotRevoke() {
      this.$message({
        message: "Only [Pending] Action can be revoked!",
        type: 'warning'
      });
    },
    getCharacters() {
      /** characters */
      axios.get('/characters').then(response => {
        this.characters = response.data
        console.log("Characters:", this.characters)

        if (window.localStorage.previousCompArr) {
          this.previousCompArr = JSON.parse(window.localStorage.previousCompArr)

          this.previousCompArr.forEach((item) => {
            this.recentComparisons.push({
              character1: this.characters[item[0]].id,
              character2: this.characters[item[1]].id,
            })
          })
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
        this.$message.error({
          message: error.response.data.message,
        });
      });
    },
    getContributions() {
      /** contributions */
      axios.get('/users/' + this.user._id + '/contributions').then(response => {
        this.changeList = response.data
      }).catch(error => {

        console.error('Error fetching data:', error);
      });
    },
    getFavourites() {
      /** favourites */
      axios.get('/users/' + this.user._id + '/favourites').then(response => {
        this.favouriteCharacters = []
        response.data.forEach((i, index) => {
          this.favouriteCharacters.push({
            index: index, name: i,
          })
        })
        console.log("favouriteCharacters", this.favouriteCharacters)
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.isGuest = true
      this.noData = "You cannot see other users' Recent Comparisons"
      axios.get('/users/' + this.$route.params.id).then(res => {
        this.user = res.data
        console.log("this.user:", this.user)
        this.getContributions()
        this.getFavourites()
      }).catch(error => {
        console.error('Error fetching data:', error);
        this.$message.error({
          message: error.response.data.message,
        });
      });
    } else {
      if (sessionStorage.getItem('user')) {
        this.user = JSON.parse(sessionStorage.getItem('user'))
        this.getCharacters()
        this.getContributions()
        this.getFavourites()
      } else {
        this.$router.push('/login')
      }
    }


  },
}
</script>
<style scoped>
.card-format {
  margin-top: 50px;
  width: 1150px;
  margin-left: calc(50% - 1150px / 2);
}

.layout {
  display: grid;
  grid-template-columns: 2fr 2fr;
  height: auto;
}
.user-detail{
  font-size: 16px;
}

.inside-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: auto;
}

.user-info {
  padding: 8px;
  width: 200px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 20px 0 0;
  border-radius: 8px;
}

.favourite-info {
  padding: 10px;
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 20px 0 0;
  border-radius: 8px;
}


.recent-info {
  padding: 12px;
  width: 500px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 20px 0 0;
  border-radius: 8px;
}

.change-list {
  padding: 10px;
  width: 850px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0 0 0;
  border-radius: 8px;
}


h1 {
  font-size: 21px;
}

h2 {
  font-size: 18px;
}

.container > div {
  margin-bottom: 50px;
}

.heart-icon {
  background: url('data:image/svg+xml;utf8,<svg fill="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>') center/cover no-repeat;
  display: inline-block;
}
</style>