<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Logout",
  mounted() {
    sessionStorage.clear();
    localStorage.clear();
    this.$router.push('/login')
  }
}

</script>

<!-- eslint-disable-next-line -->
<template>

</template>

<style>

</style>