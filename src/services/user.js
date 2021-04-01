import { request, METHOD, removeAuthorization } from '@/utils/request'
//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
const URLS = {
  LOGIN: `${BASE_URL}/auth/login/`
}
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(URLS.LOGIN, METHOD.POST, {
    username: name,
    password: password
  })
}

/**
 * 获取当前登录用户信息
 * @param userId
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function userProfile(userId) {
  return request(`${BASE_URL}/user/profile/${userId}/`, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  removeAuthorization()
}
export default {
  login,
  userProfile,
  logout
}
