<template>
  <NavMenu></NavMenu>
  <div class="background"></div>
  <div class="container">
    <div class="box">
      <h1> Sign Up</h1>
      <form @submit.prevent="signup">
        <div>
          <input type="text" v-model="firstname" placeholder="Firstname">
        </div>
        <div>
          <input type="text" v-model="lastname" placeholder="Lastname">
        </div>
        <div>
          <input type="text" v-model="email" placeholder="Email">
        </div>
        <div>
          <input type="Password" v-model="password" placeholder="Password">
        </div>
        <button> SignUp</button>
        <div class="return">
          <router-link to="/Login">Return to login</router-link>
        </div>

      </form>
    </div>
  </div>

</template>
<script>
import axios from 'axios';
import NavMenu from "@/components/NavMenu.vue";

export default {
  components: {NavMenu},

  data() {
    return {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    }
  },
  methods: {
    async signup() {
      try {
        const response = await axios.post('/users', {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password
        });
        if (response.data.success) {
          this.$router.push("/LogIn");
          this.$message({
            message: response.data.message,
            type: 'success'
          });
        } else {
          this.$message({
            message: response.data.message,
            type: 'warning'
          });
        }
      } catch (error) {
        this.$message.error({
          message: error.response.data.message,
        });
      }
    }
  }
};
</script>

<style scoped>
@import "../assets/log.css";

</style>