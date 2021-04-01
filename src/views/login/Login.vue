<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">Ant Design 是西湖区最具影响力的 Web 设计规范</div>
    </div>
    <div class="loginAndRegister">
      <a-tabs size="large" :tabBarStyle="{ textAlign: 'center' }" style="padding: 0 2px">
        <a-tab-pane tab="登录" key="1">
          <a-form-model ref="loginRuleFormRef" :model="loginForm" :rules="loginFormRules">
            <a-form-model-item prop="username">
              <a-input size="large" placeholder="用户名/邮箱" v-model="loginForm.username">
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="password">
              <a-input size="large" placeholder="密码" v-model="loginForm.password" type="password">
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-model-item>
            <a-button type="primary" style="width: 100%; margin-top: 24px" size="large" @click="submitForm('loginRuleFormRef')"
              >登录</a-button
            >
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane tab="注册" key="2"> </a-tab-pane>
      </a-tabs>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import { userLogin, getUserProfile } from '@/apis/user'
import { setToken, setUserId } from '@/utils/auth'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    // let checkPending
    // let checkAge = (rule, value, callback) => {
    //   clearTimeout(checkPending)
    //   if (!value) {
    //     return callback(new Error('Please input the age'))
    //   }
    //   checkPending = setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //       callback(new Error('Please input digits'))
    //     } else {
    //       if (value < 18) {
    //         callback(new Error('Age must be greater than 18'))
    //       } else {
    //         callback()
    //       }
    //     }
    //   }, 1000)
    // }
    // let validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('Please input the password'))
    //   } else {
    //     if (this.loginForm.checkPass !== '') {
    //       this.$refs.ruleForm.validateField('checkPass')
    //     }
    //     callback()
    //   }
    // }
    // let validatePass2 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('Please input the password again'))
    //   } else if (value !== this.loginForm.pass) {
    //     callback(new Error("Two inputs don't match!"))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [{ required: true, message: '请输入用户名/邮箱', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { min: 6, max: 150, message: '密码长度不能小于6个字符或超过128个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser']),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userLogin(this.loginForm)
            .then((res) => {
              this.loginForm.username = ''
              this.loginForm.password = ''
              this.$message.success(res.message)
              setToken(res.data.access)
              setUserId(res.data.user_id)
              // 获取当前登录用户的信息
              getUserProfile(res.data.user_id).then((res) => {
                this.setUser(res.data)
              })
              this.$router.push('/demo')
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .loginAndRegister {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
