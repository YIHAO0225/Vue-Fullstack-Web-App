<template>
  <NavMenu></NavMenu>
  <div class="background-image-blur-whitewash"></div>
  <div class="common-layout">
    <el-row :gutter="10" type="flex">
      <el-col :offset="3" :span="18" style="text-align: center">
        <div>
          <h2>Delete a Character</h2>
        </div>
        <el-table :data="characters" header-align='right' highlight-current-row style="margin-top:20px,"
                  @row-click="handle" :cell-style="{ 'text-align': 'center' }" height="500">
          <el-table-column type="index" width="50"/>
          <el-table-column property="name" label="Name" header-align="center"/>
          <el-table-column property="active" label="active" header-align="center"/>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="deleteSelection">Delete selection</el-button>
          <el-button @click="restoreSelection">Restore selection</el-button>
        </div>

        <div>
          <h2 class="subtitle">All Contributions:</h2>
          <div class="tag-list">
            <el-table :data="contributions" style="width: 100%" height="700">
              <el-table-column prop="user_id._id.firstname" label="UserName">
                <template #default="{ row }">
                  <span style="color: dodgerblue">{{ row.user_id._id.firstname }} {{ row.user_id._id.lastname }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="action" label="Action"/>
              <el-table-column prop="date" label="Date"/>
              <el-table-column prop="data.id" label="Character Name"/>
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
                    <el-table :data="convertToTableData(row.data)">
                      <el-table-column width="150" property="attribute" label="attribute"/>
                      <el-table-column width="200" property="value" label="value"/>
                    </el-table>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="Status">
                <template #default="{ row }">
                  <span v-if="row.status === 'Pending'" style="color: #f50;">Pending</span>
                  <span v-else-if="row.status === 'Approved'" style="color: #87d068;">Approved</span>
                  <span v-else-if="row.status === 'Rejected'" style="color: #f5222d;">Rejected</span>
                </template>
              </el-table-column>
              <el-table-column prop="reviewed_by" label="Reviewed By / Review" width="200">
                <template #default="{ row }">
                  <div v-if="row.status === 'Pending'" style="width: 200px">
                    <el-button type="success" @click="HandleContribution(row, 'Approved')">Approve</el-button>
                    <el-button type="danger" @click="HandleContribution(row, 'Rejected')">Reject</el-button>
                  </div>

                  <span v-else>by <span style="color: dodgerblue">{{ row.reviewed_by._id.firstname }} {{
                      row.reviewed_by._id.lastname
                    }}</span></span>
                </template>
              </el-table-column>


            </el-table>
            <!--          <el-tag v-for="(character, index) in favouriteCharacters" :key="index" class="tag">{{ character.name }}</el-tag>-->
          </div>
        </div>
        <div>
          <h2 class="subtitle">Character Change Log</h2>
          <el-table :data="contributionshistrory" header-align='right' highlight-current-row style="margin-top:200px,"
                    @row-click="handle" :cell-style="{ 'text-align': 'center' }" height="500">
            <el-table-column type="index" width="50"/>
            <el-table-column property="data.id" label="user" header-align="center"/>
            <el-table-column property="action" label="Action" header-align="center"/>
            <el-table-column property="date" label="date" header-align="center"/>
            <el-table-column prop="data.id" label="Details" header-align="center">
              <template #default="{ row }">
                <el-popover placement="right" :width="350" trigger="hover">
                  <template #reference>
                    <el-button style="margin-right: 16px">Details
                      <el-icon class="el-icon--right">
                        <icon-view/>
                      </el-icon>
                    </el-button>
                  </template>
                  <el-table :data="convertToTableData(row.data)">
                    <el-table-column width="150" property="attribute" label="attribute"/>
                    <el-table-column width="200" property="value" label="value"/>
                  </el-table>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>

</style>

<script setup>
import {View as IconView} from '@element-plus/icons-vue'
</script>

<script>
import NavMenu from "../components/NavMenu.vue";
import axios from 'axios';

export default {

  name: "CharacterDetail",
  components: {NavMenu},
  data() {
    return {
      characters: null,
      currentSelect: null,
      contributions: [],
      contributionshistrory: [],
    };
  },
  methods: {
    convertToTableData(data) {
      // console.log(Object.entries(data).map(([key, value]) => ({attribute: key, value})));
      return Object.entries(data).map(([key, value]) => ({attribute: key, value}));
    },
    HandleContribution(data, status) {
      let id = JSON.parse(sessionStorage.getItem('user'))._id
      axios.patch('/contributions/' + data._id, {
        status: status,
        reviewed_by: {
          _id: id
        }
      }).then(response => {
        this.$message({
          message: response.data.message,
          type: "success"
        })
        this.getContributions()
      }).catch(error => {
        this.$message({
          message: JSON.stringify(error),
          type: "error"
        })
      });
    },
    deleteSelection() {
      if (this.currentSelect == null) {
        this.$message({
          message: "No character be selected!",
          type: "error"
        })
        return
      }
      axios.delete('/characters/' + this.currentSelect)
          .then(response => {
            this.$message({
              message: response.data.message,
              type: "success"
            })
            this.getcharacters()
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "success"
            })
          })
    },
    restoreSelection() {
      if (this.currentSelect == null) {
        this.$message({
          message: "No character select!",
          type: "success"
        })
        return
      }
      axios.patch('/characters/' + this.currentSelect, {active: true}).then(response => {
        this.$message({
          message: response.data.message,
          type: "success"
        })
        this.getcharacters()
      }).catch(error => {
        this.$message({
          message: error,
          type: "error"
        })
      })
    },
    handle(row) {
      this.currentSelect = row._id
    },
    getcharacters() {
      axios.get('/characters')
          .then(response => {
            this.characters = response.data;
            console.log("characters:", this.characters)
          })
          .catch(error => {
            console.error('Error fetching character data:', error);
          });
    },
    getContributions() {
      axios.get('/contributions')
          .then(response => {
            this.contributions = response.data;
            console.log("contributions:", this.contributions)
          })
          .catch(error => {
            this.$message({
              message: 'Error fetching character data:', error,
              type: "error"
            })
          });
    },
    getContributionshistory() {
      axios.get('/contributions/history/date')
          .then(response => {
            this.contributionshistrory = response.data;
            console.log("contributions:", this.contributionshistrory)
          })
          .catch(error => {
            this.$message({
              message: 'Error fetching character data:', error,
              type: "error"
            })
          });
    }
  },
  created() {
    this.getcharacters()
    this.getContributions()
    this.getContributionshistory()
  },
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