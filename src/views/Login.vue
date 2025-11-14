<template>
  <NavMenu></NavMenu>
  <div class="background"></div>
  <div class="container">
    <div class="box">
      <h1> Login </h1>
      <form @submit.prevent="login">
        <div>
          <input type="text" v-model="email" placeholder="Email">
        </div>
        <div>
          <input type="Password" v-model="password" placeholder="Password">
        </div>
        <button> Login</button>
        <div class="return">
          <router-link to="/SignUp"> Does not have account yet?</router-link>
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
      email: "",
      password: "",
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/sessions', {
          email: this.email,
          password: this.password,
        });
        if (response.data.success) {
          sessionStorage.setItem('user', JSON.stringify(response.data.user))
          this.$message({
            message: response.data.message,
            type: 'success'
          });
          this.$router.push("/Home");
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