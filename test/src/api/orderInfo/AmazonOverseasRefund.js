/**  =========================> *|`| % AM海外退件 % |`|*<======================== **/
import http from '@/http';

//列表
export function getAmazonReturnGoodsSeasList(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/Amazon_return_goods_seas/get_list', params);
}
//日志
export function getAmazonReturnGoodsSeasLog(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/Amazon_return_goods_seas/show_log', params);
}