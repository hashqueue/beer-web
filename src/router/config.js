import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/views/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/exception/404')
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/exception/403')
    },
    {
      path: '/500',
      name: '500',
      component: () => import('@/views/exception/500')
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/dashboard/workplace',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '工作台',
              meta: {
                icon: 'desktop'
              },
              component: () => import('@/views/dashboard/workplace')
            }
          ]
        },
        {
          path: 'projects',
          name: '项目管理',
          meta: {
            icon: 'project'
          },
          component: () => import('@/views/projects')
        },
        {
          path: 'testsuites',
          name: '套件管理',
          meta: {
            icon: 'appstore'
          },
          component: () => import('@/views/testsuites')
        },
        {
          path: 'configs',
          name: '配置管理',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '配置列表',
              component: () => import('@/views/configs/ConfigsManagement')
            },
            {
              path: 'create',
              name: '新增配置',
              meta: {
                invisible: true
              },
              component: () => import('@/views/configs/CreateConfigs')
            },
            {
              path: 'update/:updateConfigId',
              name: '更新配置',
              meta: {
                invisible: true
              },
              component: () => import('@/views/configs/UpdateConfigs')
            },
            {
              path: 'detail/:detailConfigId',
              name: '配置详情',
              meta: {
                invisible: true
              },
              component: () => import('@/views/configs/ConfigsDetail')
            }
          ]
        }
      ]
    }
  ]
}

export default options
