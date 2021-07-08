<template>
  <el-container>
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/img/logo_car.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" size="small">
        退出 <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i>
      </el-button>
    </el-header>

    <!--主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="collapse">
        <!--折叠按钮-->
        <div @click="togleCollapse">|||</div>

        <el-menu
          :collapse="isCollapse"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409FFF"
          :collapse-transition="false"
          :default-active="$route.path"
          unique-opened
          router
        >
          <!-- :unique-opened="true"->只允许展开一个菜单 -->
          <!-- :collapse-transition="false" -> 关闭动画 -->
          <!-- router -> 导航开启路由模式 -->
          <!--:default-active="$route.path" 通过$route.path获取活跃的路由绑定高亮-->
          <!-- 一级菜单的模板区域 -->
          <el-submenu v-for="item in menuList" :index="item.id + ''" :key="item.id">
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]" aria-hidden="true"></i> &nbsp;
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 导航开启路由模式：将index值作为导航路由 -->
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--内容区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isCollapse: false,
      menuList: '',
      // 被激活导航地址
      activePath: '',
      iconsObj: {
        '125': 'fa fa-user fa-lg fa-fw',
        '103': 'fa fa-first-order fa-lg fa-fw',
        '101': 'fa fa-shopping-bag fa-lg fa-fw',
        '102': 'fa fa-list-alt fa-lg fa-fw',
        '145': 'fa fa-line-chart fa-lg fa-fw'
      }
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  computed: {
    collapse() {
      return this.isCollapse ? '64px' : '200px'
    }
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 导航栏折叠
    togleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 获取请求菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res.data)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #333744;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  color: #fff;
  font-size: 18px;
  text-shadow: 1px 1px rgba(216, 223, 228, 0.3);
  > div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  color: #fff;
  > div {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    // 鼠标放上去变成小手
    cursor: pointer;
  }
  .el-menu {
    border: none;
  }
}
</style>
