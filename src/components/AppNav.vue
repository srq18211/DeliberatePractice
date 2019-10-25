<template>
  <el-header>
    <nav>
      <router-link v-for="(item,index) in navs" :to="item.link" :key="index">{{item.text}}</router-link>
    </nav>
    <div class="user-login">
       <el-avatar size="large" fit="fill" shape="square" :src="avatarUrl">游客</el-avatar>
       <span>登录/注册</span>
    </div>
  </el-header>
</template>

<script>
export default {
  data() {
    return {
      navs: [
        {
          text: "知识点专项练习",
          link: "/knowledge"
        },
        {
          text: "题库管理",
          link: "/mgmt"
        }
      ],
      avatarUrl:"https://cn.vuejs.org/images/logo.png"
    };
  }
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding-left: 60px;
  /*box-shadow: 2px 4px 6px #228581;*/
  background: #36cfc9;
  color: #fff;
  nav {
    float: left;

    a {
      padding: 0 10px;
      color: #fff;
    }
  }
  .user-login {
    float: right;
    display: flex;
    align-items: center;
    cursor: pointer;
    .el-avatar{
      margin-right: 20px;
      background: #fff;
    }
  }
}
</style>