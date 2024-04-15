import request from "@/utils/request";

export function getLiveroomListApi(data) {
  return request({
    url: "/api/srs/getliveroom_admin",
    method: "post",
    data,
  });
}

export function getHistoryLiveListApi(data) {
  return request({
    url: "/api/srs/gethistorylive_admin",
    method: "post",
    data,
  });
}
