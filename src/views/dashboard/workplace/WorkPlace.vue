<template>
  <page-layout v-if="currUser" :avatar="currUser.avatar">
    <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="用户名">{{ currUser.username }}</detail-list-item>
      <detail-list-item term="部门">{{ currUser.department === '' ? '未填写' : currUser.department }}</detail-list-item>
      <detail-list-item term="职位">{{ currUser.position === '' ? '未填写' : currUser.position }}</detail-list-item>
      <detail-list-item term="邮箱">{{ currUser.email }}</detail-list-item>
      <detail-list-item term="电话">{{ currUser.phone === '' ? '未填写' : currUser.phone }}</detail-list-item>
      <detail-list-item term="角色">{{ currUser.is_staff ? '管理员' : '普通用户' }}</detail-list-item>
    </detail-list>
    <template slot="extra">
      <head-info title="项目数量" content="3" />
      <head-info title="测试套件数量" content="19" />
      <head-info title="测试用例数量" content="2647" />
    </template>
    <template slot="action">
      <a-button type="primary" @click="showDrawer">修改个人信息</a-button>
      <a-drawer title="更新用户信息" :width="720" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
        <a-form-model ref="updateUserRuleFormRef" :model="updateUserForm" :rules="updateUserFormRules">
          <a-form-model-item prop="username">
            <a-input allowClear size="large" placeholder="用户名/邮箱" v-model="updateUserForm.username">
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input-password allowClear size="large" placeholder="密码" v-model="updateUserForm.password" type="password">
              <a-icon slot="prefix" type="lock" />
            </a-input-password>
          </a-form-model-item>
          <a-button
            type="primary"
            style="width: 100%; margin-top: 24px"
            size="large"
            @click="submitUpdateUserForm('updateUserRuleFormRef')"
            >登录</a-button
          >
        </a-form-model>
      </a-drawer>
    </template>
  </page-layout>
  <page-layout v-else>
    <a-spin size="large" />
  </page-layout>
</template>

<script>
import { mapState } from 'vuex'
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import DetailList from '@/components/tool/DetailList'
import { updateUserProfile } from '@/apis/user'
import { getUserId } from '@/utils/auth'

const DetailListItem = DetailList.Item
export default {
  name: 'WorkPlace',
  components: { HeadInfo, DetailList, PageLayout, DetailListItem },
  computed: {
    ...mapState('account', { currUser: 'user' })
  },
  data() {
    return {
      updateUserForm: {
        username: '',
        password: ''
      },
      visible: false,
      updateUserFormRules: {
        username: [{ required: true, message: '请输入用户名/邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    updateUserInfo() {
      updateUserProfile(getUserId()).then((res) => {
        this.$message.success(res.message)
      })
    },
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    submitUpdateUserForm() {
      console.log(1)
    }
  }
}
</script>

<style lang="less">
@import 'index';
</style>
