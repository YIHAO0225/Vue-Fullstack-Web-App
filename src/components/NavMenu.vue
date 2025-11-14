<template>
  <el-row type="flex" style="flex-direction: row;">
    <el-col>
      <header>
        <h1>Cartoonopia</h1>
        <el-menu :collapse="false" :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect" background-color="#1f1f1f"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <!-- Home 菜单项始终显示 -->
          <el-menu-item v-if="isLoggedIn" index="/Home">
            Home
          </el-menu-item>

          <!-- 其他菜单项根据登录状态显示 -->
<!--          eslint-disable-next-line-->
          <el-menu-item v-if="isLoggedIn" :index="menuItem.index" v-for="menuItem in menuItems" :key="menuItem.index">
            {{ menuItem.text }}
          </el-menu-item>


<!--          <el-menu-item v-if="isLoggedIn && isAdmin" index="/NewCharacter">-->
<!--            Add a Character-->
<!--          </el-menu-item>-->

          <el-menu-item v-if="isLoggedIn && isAdmin" index="/Administrator">
            Administrator
          </el-menu-item>

          <el-menu-item v-if="isLoggedIn" index="/UserInfo">
            UserInfo
          </el-menu-item>

          <!-- 如果用户未登录，显示登录菜单项 -->
          <el-menu-item v-if="!isLoggedIn" index="/Login">
            Login
          </el-menu-item>
          <el-menu-item v-if="!isLoggedIn" index="/SignUp">
            Sign Up
          </el-menu-item>
          <!-- 如果用户已登录，显示退出菜单项 -->
          <el-menu-item v-if="isLoggedIn" index="/Logout">
            Logout
          </el-menu-item>
        </el-menu>
      </header>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: this.$route.path,
      menuItems: [
        { index: '/NewCharacter', text: 'Add a Character', route: '/NewCharacter' },
        { index: '/UserProfile', text: 'User Profile', route: '/UserProfile' },
      ],
      user: null,
      isLoggedIn: false,
      isAdmin: false,
    };
  },
  mounted() {
    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.isLoggedIn = true
      this.isAdmin = this.user.isAdmin
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(keyPath[0])
    }
  }
}
</script>

<style scoped>
.el-menu a{
  text-decoration: none;
}
.el-menu{
  display: flex;
  justify-content: center;
}

header {
  background: #1f1f1f;
  color: white;
  text-align: center;
  padding: 2px 0 0 0 ;
}
header h1 {
  font-size: 60px;
  padding: 0 0 10px 0;
  margin: 0;
}
</style>
