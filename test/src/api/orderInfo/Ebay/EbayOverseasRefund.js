/**  =========================> *|`| % EB海外退件 % |`|*<======================== **/
import http from '@/http';

//列表
export function getEbayReturnGoodsSeasList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/Ebay_return_goods_seas/get_list', params);
}
//日志
export function getEbayReturnGoodsSeasLog(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/Ebay_return_goods_seas/show_log', params);
}