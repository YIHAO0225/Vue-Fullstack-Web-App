<template>
  <NavMenu></NavMenu>
  <div class="background-image-blur-whitewash"></div>
  <div class="container">
    <div class="box">
      <div class="layout">
        <side class="image-container">
          <el-image class="character-image" :src="`/src/assets/${character.image_url}`"/>
        </side>
        <mainpart>
          <form @submit.prevent="submitForm">
            <div class="title">
              <div class="name-format">{{ character.name }}</div>
              <p>{{ character.subtitle }}</p>
            </div>
            <div>
              <label>Description:</label>
              <textarea v-model="description" :placeholder="character.description"></textarea>
            </div>
            <div>
              <label>Strength:</label>
              <input type="number" min="0" max="100" v-model="strength" :placeholder="character.strength">
            </div>
            <div>
              <label>Speed:</label>
              <input type="number" min="0" max="100" v-model="speed" :placeholder="character.speed">
            </div>
            <div>
              <label>Skill:</label>
              <input type="number" min="0" max="100" v-model="skill" :placeholder="character.skill">
            </div>
            <div>
              <label>Fear Factor:</label>
              <input type="number" min="0" max="100" v-model="fear_factor" :placeholder="character.fear_factor">
            </div>
            <div>
              <label>Power:</label>
              <input type="number" min="0" max="100" v-model="power" :placeholder="character.power">
            </div>
            <div>
              <label>Intelligence:</label>
              <input type="number" min="0" max="100" v-model="intelligence" :placeholder="character.intelligence">
            </div>
            <div>
              <label>Wealth:</label>
              <input type="number" min="0" max="100" v-model="wealth" :placeholder="character.wealth">
            </div>
            <button type="submit"> Submit</button>
          </form>
        </mainpart>
      </div>
    </div>
  </div>
</template>


<script>
import NavMenu from "../components/NavMenu.vue";
import axios from 'axios';

export default {
  name: "CharacterDetail",
  components: {
    NavMenu,
  },
  methods: {
    submitForm() {
      try {
        const formData = {
          id: this.character.id,
          description: this.description,
          strength: this.strength,
          speed: this.speed,
          skill: this.skill,
          fear_factor: this.fear_factor,
          power: this.power,
          intelligence: this.intelligence,
          wealth: this.wealth
        };

        const currentDate = new Date();
        // Get the date components
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        // Get the time components
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        // Combine date and time components in the desired format
        const dateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

        let storedUserJson = sessionStorage.getItem("user");
        let storedUser = JSON.parse(storedUserJson);
        const userId = {
          _id: storedUser._id,
        };

        const newContribution = {
          contribution_id: -1,
          user_id: userId,
          action: "EditCharacter",
          status: storedUser.isAdmin ? "Approved" : "Pending",
          reviewed_by: storedUser.isAdmin ? userId : null,
          date: dateTime,
          data: formData,
        };

        if (
            (formData.description == "" || formData.description == null || formData.description == undefined) &&
            (formData.strength == "" || formData.strength == null || formData.strength == undefined) &&
            (formData.speed == "" || formData.speed == null || formData.speed == undefined) &&
            (formData.skill == "" || formData.skill == null || formData.skill == undefined) &&
            (formData.fear_factor == "" || formData.fear_factor == null || formData.fear_factor == undefined) &&
            (formData.power == "" || formData.power == null || formData.power == undefined) &&
            (formData.intelligence == "" || formData.intelligence == null || formData.intelligence == undefined) &&
            (formData.wealth == "" || formData.wealth == null || formData.wealth == undefined)
        ) {
          // All fields are blank, display an error message

          this.$message({
            message: 'Please fill in at least one input box.',
            type: 'info'
          });
          return;
        }
        // Make a POST request to backend API endpoint
        axios.post('/contributions', newContribution)
            .then(() => {
              console.log("section 2 MODIFY: NOT YET");
              if (storedUser.isAdmin) {
                const updatedChar = {
                  id: this.character.id,
                  description: this.description,
                  strength: this.strength,
                  speed: this.speed,
                  skill: this.skill,
                  fear_factor: this.fear_factor,
                  power: this.power,
                  intelligence: this.intelligence,
                  wealth: this.wealth
                };
                axios.patch('/characters/' + this.character._id, updatedChar).then(res => {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                }).catch(error => {
                  this.$message({
                    message: error,
                    type: 'error'
                  });
                })
              }
              this.$message({
                message: 'Editing record has been saved successfully.',
                type: 'success'
              });
            }).catch(error => {
          this.$message({
            message: error.response.data.message,
            type: 'error'
          });
        })
      } catch (error) {
        this.$message({
          message: error,
          type: 'error'
        });
      }
    }
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
      createBy: "unknown",
      Wealth: "",

    };
  },
  mounted() {
    axios.get('/characters/' + this.$route.params.id)
        .then(res => {
          this.character = res.data
        }).catch(error => {
      this.$message({
        message: error,
        type: 'error'
      });
    });
  },
}
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 3fr;
  height: auto;
}

.box {
  padding: 20px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 800px;
  height: auto;
  margin: 80px 0 80px 0;
  border-radius: 8px;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.character-image {
  border-radius: 50%;
  width: 200px;
  height: 200px;
}

mainpart {
  display: flex;
  flex-direction: column;
  margin: auto;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name-format {
  padding: 10px;
  width: 100px;
  text-align: center;
  font-size: large;
  color: #000000;
  background: #dedede;
  border-radius: 9px;
}

input {
  width: 300px;
  margin: 5px 0 5px 0px;
  padding: 7px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 4px;
}

label {
  display: block;
}

textarea {
  width: 100%;
  height: 100px;
}

button {
  background-color: rgb(0, 0, 0);
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  box-sizing: border-box;
  border-radius: 4px;
  color: #ffffff;
}

button:hover {
  opacity: 0.7;
}

</style>
