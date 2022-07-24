/**  =========================> *|`| % AMAZON国内退件 % |`|*<======================== **/
import http from '@/http';

// AM取消订单结果列表
export function getReturnGoodsHomeList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/amazon_return_goods_home/get_list', params);
}

// 日志
export function amazonReturnGoodsHomeLog(params = {}) {
    params = {...params};
return http.getAjax('/aftersales/amazon_return_goods_home/log', params);
}

//驳回/aftersales/ebay_return_goods_home/reject
export function amazonReturnGoodsHomeReject(params = {}) {
    params = {...params};
return http.getAjax('/aftersales/amazon_return_goods_home/reject', params);
}

//暂不处理 /aftersales/ebay_return_goods_home/hangup
export function amazonReturnGoodsHomeHangup(params = {}) {
    params = {...params};
return http.getAjax('/aftersales/amazon_return_goods_home/hangup', params);
}