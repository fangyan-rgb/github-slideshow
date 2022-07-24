/**  =========================> *|`| % 取消订单结果 % |`|*<======================== **/
import http from '@/http';

// ebay取消订单结果列表
export function getEbayCancelOrderList(params = {}) {
    params = {...params};
    return http.getAjax('/order/ebay_cancel_order/get_list', params);
}
// 刷新
export function cancelOrderFlush(params = {}) {
    params = {...params};
return http.getAjax('/order/ebay_order_list/cancel_order_flush', params);
}