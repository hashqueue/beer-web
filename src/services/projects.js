import request from '@/utils/request'
/*
1. 如果发送get请求, 需要传参的话使用params
2. 如果发送post/put/delete/patch请求, 需要传body类型的参数的话使用data
3. params和data都是对象类型：{...}
 */
export function getProjectsDataList(params) {
  return request({
    url: '/projects/',
    method: 'get',
    params
  })
}

export default {
  getProjectsDataList
}
