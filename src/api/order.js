import request from "@/utils/request";

export function getGiftListApi(data) {
  return request({
    url: "/api/order/getgiftlist_admin",
    method: "post",
    data,
  });
}

export function getOrderListApi(data) {
  return request({
    url: "/api/order/getorderlist_admin",
    method: "post",
    data,
  });
}
