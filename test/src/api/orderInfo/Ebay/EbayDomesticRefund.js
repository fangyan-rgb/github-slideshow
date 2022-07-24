/**  =========================> *|`| % EB国内退件 % |`|*<======================== **/
import http from '@/http';

// ebay取消订单结果列表
export function getEbayReturnGoodsHomeList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/ebay_return_goods_home/get_list', params);
}

// 日志
export function returnGoodsHomeLog(params = {}) {
    params = {...params};
return http.getAjax('/aftersales/ebay_return_goods_home/log', params);
}

//驳回/aftersales/amazon_return_goods_home/reject
export function returnGoodsHomeReject(params = {}) {
    params = {...params};
return http.getAjax('/aftersales/ebay_return_goods_home/reject', params);
}

//暂不处理 /aftersales/ebay_return_goods_home/hangup
export function returnGoodsHomeHangup(params = {}) {
    params = {...params};
return http.getAjax('/aftersales/ebay_return_goods_home/hangup', params);
}
