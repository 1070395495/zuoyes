import request from './request'
import qs from 'qs'

// 登录
export function login(obj) {
  return request({
    url: '/login',
    method: 'post',
    data:qs.stringify(obj)
  })
}


// 用户列表接口
export function getUser(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}
export function postUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

// 修改用户状态接口
export function modifyUserStaus(user) {
  return request({
    url: `/users/${user.id}/state/${user.mg_state}`,
    method: 'put'
  })
}

// 编辑用户信息
export function editUserInfo(userid, data) {
  return request({
    url: `/users/${userid}`,
    method: 'put',
    data
  })
}