<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">{{ new Date().getHours() >= 12 ? '下午好' : '上午好' }}，{{ currUser.username }}</div>
      <div>{{ currUser.department }}</div>
      <div>{{ currUser.position }}</div>
      <div>{{ currUser.email }}</div>
      <div>{{ currUser.phone }}</div>
    </div>
    <template slot="extra">
      <head-info class="split-right" title="项目数" content="6" />
      <head-info class="split-right" title="套件数" content="24" />
      <head-info class="split-right" title="用例数" content="2223" />
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import { mapState } from 'vuex'

export default {
  name: 'WorkPlace',
  components: { HeadInfo, PageLayout },
  computed: {
    ...mapState('account', { currUser: 'user' })
  }
}
</script>

<style lang="less">
@import 'index';
</style>
