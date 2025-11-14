<template>
  <NavMenu></NavMenu>
  <div class="background-image-blur-whitewash"></div>
  <div class="full-container">
    <div class="box">
      <headerpart>
        <label> NewCharacter</label>
        <label> Please enter details below</label>
      </headerpart>
      <div class="container">
        <form @submit.prevent="submitForm" class="layout">
          <left class="spacing">
            <div>
              <label> *ID: </label>
              <input type="text" v-model="id" required>
            </div>
            <div>
              <label> *Name: </label>
              <input type="text" v-model="name" required>
            </div>
            <div>
              <label> Image URL: </label>
              <input type="text" v-model="image_url">
            </div>
            <div>
              <label> Subtitle: </label>
              <input type="text" v-model="subtitle">
            </div>
            <div>
              <label> Description: </label>
              <textarea v-model="description"></textarea>
            </div>
          </left>
          <right class="spacing">
            <div>
              <label> *Strength: </label>
              <input type="number" v-model="strength" class="int-attribute" min="0" max="100" value="50" required>
            </div>
            <div>
              <label> *Speed: </label>
              <input type="number" v-model="speed" class="int-attribute" min="0" max="100" value="50" required>
            </div>
            <div>
              <label> *Skill: </label>
              <input type="number" v-model="skill" class="int-attribute" min="0" max="100" value="50" required>
            </div>
            <div>
              <label> *Fear Factor: </label>
              <input type="number" v-model="fear_factor" class="int-attribute" min="0" max="100" value="50" required>
            </div>
            <div>
              <label> *Power: </label>
              <input type="number" v-model="power" class="int-attribute" min="0" max="100" value="50" required>
            </div>
            <div>
              <label> *Intelligence: </label>
              <input type="number" v-model="intelligence" class="int-attribute" min="0" max="100" value="50" required>
            </div>
            <div>
              <label> *Wealth: </label>
              <input type="number" v-model="wealth" class="int-attribute" min="0" max="100" value="50" required>
            </div>
            <button type="submit">Submit</button>
          </right>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from "../components/NavMenu.vue";
import axios from 'axios';

export default {
  name: "NewCharacter",
  components: {NavMenu},
  methods: {
    submitForm() {
      try {
        // Prepare the "data" attribute
        const formData = {
          id: this.id,
          name: this.name,
          subtitle: this.subtitle,
          description: this.description,
          image_url: this.image_url,
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
        const dateString = year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "Z";

        console.log(dateString + "<-dateString");

        // get user info
        let storedUserJson = sessionStorage.getItem("user");
        let storedUser = JSON.parse(storedUserJson);
        const userId = {
          _id: storedUser._id,
        };

        const newContribution = {
          contribution_id: -1,
          user_id: userId,
          action: "AddCharacter",
          status: storedUser.isAdmin ? "Approved" : "Pending",
          reviewed_by: storedUser.isAdmin ? userId : null,
          date: dateTime,
          data: formData,
        };
        // Make a POST request to backend API endpoint
        axios.post('/contributions', newContribution)
            .then(response => {
              if (storedUser.isAdmin) {
                const newCharacter = {
                  id: this.id,
                  active: true,
                  name: this.name,
                  subtitle: this.subtitle,
                  description: this.description,
                  image_url: this.image_url,
                  strength: this.strength,
                  speed: this.speed,
                  skill: this.skill,
                  fear_factor: this.fear_factor,
                  power: this.power,
                  intelligence: this.intelligence,
                  wealth: this.wealth
                }
                const resChar = axios.post('/characters', newCharacter);
                console.log(resChar);

                this.$router.push("/Home");
              }
              this.$message({
                message: response.data.message,
                type: 'success'
              });
            }).catch(error => {
          console.error(error)
          this.$message({
            message: error.response.data.message,
            type: 'warning'
          });
        })
      } catch (error) {
        console.error('Error saving contribution:', error);
      }
    }
  },
  data() {
    return {
      id: '',
      name: '',
      subtitle: '',
      description: '',
      image_url: '',
      strength: 50,
      speed: 50,
      skill: 50,
      fear_factor: 50,
      power: 50,
      intelligence: 50,
      wealth: 50
    };
  }
};
</script>

<style scoped>

.full-container {
  display: flex;
  justify-content: center;
}

.container {
  padding: 10px;
  display: flex;
  margin-top: 20px;
  justify-content: center;
}


.layout {
  display: grid;
  grid-template-columns: 3fr 3fr;
  height: auto;
}

headerpart {
  grid-area: header;
  text-align: center;
  padding: 5px;
  font-size: large;
}


.box {
  padding: 20px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 800px;
  height: 600px;
  margin: 80px 0 40px 0;
  border-radius: 8px;
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

.spacing {
  margin: 0 10px 0 10px;
}

textarea {
  width: 300px;
  height: 100px;
}

button {
  background-color: rgb(0, 0, 0);
  padding: 10px;
  margin: 20px 0;
  border: 1px solid #ccc;
  box-sizing: border-box;
  width: 300px;
  border-radius: 4px;
  color: #ffffff;
}

button:hover {
  opacity: 0.7;
}

</style>