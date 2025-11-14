<template>
  <NavMenu></NavMenu>
  <div class="background-image-blur-whitewash"></div>
  <el-row :gutter="10" type="flex">
    <el-col :span="18" :offset="3">
      <el-card class="character-card">
        <template #header>
          <div class="card-header">
            <el-image class="character-image" :src="`/src/assets/${character.image_url}`"/>
            <div class="character-info">
              <span class="character-name">{{ character.name }}</span>
              <p class="subtitle">{{ character.subtitle }}</p>
            </div>
            <div class="star">
              <p>Add to favourites</p>
              <el-button @click="addFavourites" type="warning" circle>
                <el-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path fill="currentColor"
                          d="m512 747.84 228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z">
                    </path>
                  </svg>
                </el-icon>
              </el-button>
            </div>
            <div class="star">
              <p>Edit this character</p>
              <router-link :to='"/EditCharacter/" + this.$route.params.id'>
                <el-button type="primary" :icon="Edit" circle/>
              </router-link>
            </div>
          </div>
        </template>
        <div class="description">
          <p>{{ character.description }}</p>
          <div class="stats">
            <p><strong>Strength:</strong> {{ character.strength }}</p>
            <p><strong>Speed:</strong> {{ character.speed }}</p>
            <p><strong>Skill:</strong> {{ character.skill }}</p>
            <p><strong>Fear Factor:</strong> {{ character.fear_factor }}</p>
            <p><strong>Power:</strong> {{ character.power }}</p>
            <p><strong>Intelligence:</strong> {{ character.intelligence }}</p>
            <p><strong>Wealth:</strong> {{ character.wealth }}</p>
          </div>
        </div>
        <template #footer>Create/Add By {{ createBy }}</template>
      </el-card>

    </el-col>
    <el-row :span="24" type="flex" justify="center">

    </el-row>
  </el-row>
</template>

<style scoped>

.star {
  text-align: center;
  padding: 20px;
}

.character-card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
}

.character-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.character-info {
  flex: 1;
}

.character-name {
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  font-size: 18px;
  color: #666;
}

.description {
  padding: 20px;
}

.stats {
  margin-top: 10px;
}

.stats p {
  margin-bottom: 5px;
}

.stats p strong {
  margin-right: 5px;
}
</style>
<script setup>
import {Edit} from '@element-plus/icons-vue'

</script>

<script>
import NavMenu from "../components/NavMenu.vue";
import axios from 'axios';

export default {
  name: "CharacterDetail",
  components: {
    NavMenu,
    // Edit
  },
  data() {
    return {
      character: {
        _id: "6638612958fd36fdab4688f1",
        id: "batman",
        active: true,
        name: "Batman",
        subtitle: "The Dark Knight",
        description: "Batman is a fictional superhero appearing in American comic books published by DC Comics. The character was created by artist Bob Kane and writer Bill Finger, and first appeared in Detective Comics #27 in 1939.",
        image_url: "images/batman.jpg",
        strength: 40,
        speed: 40,
        skill: 90,
        fear_factor: 80,
        power: 80,
        intelligence: 90,
        wealth: 100
      },
      createBy: 'unknow'
    };
  },
  mounted() {
    axios.get('/characters/' + this.$route.params.id)
        .then(res => {
          this.character = res.data
          axios.get('/contributions/characters/' + this.character.id)
              .then(res => {
                console.log(res.data);
                if (res.data) {
                  this.createBy = res.data.user_id._id.firstname + res.data.user_id._id.lastname
                } else {
                  this.createBy = "Unknown"
                }
              }).catch(error => {
            this.$message({
              message: error,
              type: 'error'
            })
          })
        }).catch(error => {
      console.error('Error fetching data:', error);
    });
  },
  methods: {
    addFavourites() {
      axios.post('/favourites/update', {
        user_id: JSON.parse(sessionStorage.getItem('user'))._id,
        id: this.character.name
      })
          .then(response => {
            if (response.status === 201) {
              this.$message({
                message: "Character already added to favourites successfully!",
                type: "success"
              })
            } else if (response.status == 200) {
              this.$message({
                message: response.data.message,
                type: "success"
              })
            } else if (response.status == 400) {
              this.$message({
                message: "Character already exists in favourites!",
                type: "warning"
              })
            }
          })
    }
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
.el-card{
  margin-top: 80px;
}
</style>