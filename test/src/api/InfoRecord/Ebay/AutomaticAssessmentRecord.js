/**  =========================> *|`| % Ebay自动留评记录 % |`|*<======================== **/
import http from '@/http';

// ebay自动留评记录列表
export function getListEbay(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_auto_feedback_record/get_list', params);
}

// ebay自动留评记录日志
export function getLogListEbay(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_auto_feedback_record/log', params);
}