<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!--表单区-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input placeholder="用户名" v-model="loginForm.username">
            <template slot="prepend">
              <i class="fa fa-user" aria-hidden="true"></i>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            type="password"
            v-model="loginForm.password"
          >
            <template slot="prepend">
              <i class="fa fa-lock" aria-hidden="true"></i>
            </template>
          </el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateUsername, validatePassword } from '@/assets/js/validate'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { trigger: 'blur', validator: validateUsername, required: true }
        ],
        password: [
          { trigger: 'blur', validator: validatePassword, required: true }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      //console.log(this)
      // resetFields：element-ui提供的表单方法
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      /*
      async 处理异步函数    用await声明函数内部需要异步的地方
      */
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
        //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  position: relative;
  top: 50%;
  left: 50%;
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  transform: translate(-50%, -50%);
}
.avatar_box {
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 2px 2px 2px #ddd;
  background-color: rgb(253, 253, 253);

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: rgb(200, 208, 209);
  }
}

.el-form {
  position: absolute;
  bottom: 0px;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.el-form .el-form-item:nth-child(3) {
  display: flex;
  justify-content: flex-end;
}
</style>
