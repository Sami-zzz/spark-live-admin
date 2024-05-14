import request from "@/utils/request";

// 管理员登录
export function loginApi(data) {
  return request({
    url: "/api/user/login_admin",
    method: "post",
    data,
  });
}

// 获取用户信息
export const getUserInfoApi = (data) => {
  return request({
    url: "/api/user/get_user_info",
    method: "post",
    data,
  });
};

// 获取全部用户
export function getUserListApi(data) {
  return request({
    url: "/api/user/getuserlist_admin",
    method: "post",
    data,
  });
}

//  重置密码
export function resetPasswordApi(id) {
  return request({
    url: `/api/user/reset_pwd_admin/${id}`,
    method: "get",
  });
}

export function deleteUserApi(id) {
  return request({
    url: `/api/user/delete_admin/${id}`,
    method: "get",
  });
}

export function changeUserApi(data) {
  return request({
    url: "/api/user/change_user_admin",
    method: "post",
    data,
  });
}

// 获取全部用户记录
export function getUserRecordListApi(data) {
  return request({
    url: "/api/user/getuserrecordlist_admin",
    method: "post",
    data,
  });
}

export function getCountApi() {
  return request({
    url: "/api/user/count",
    method: "get",
  });
}

export function getUserGroupApi() {
  return request({
    url: "/api/user/group",
    method: "get",
  });
}
