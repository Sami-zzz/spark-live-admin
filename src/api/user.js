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
