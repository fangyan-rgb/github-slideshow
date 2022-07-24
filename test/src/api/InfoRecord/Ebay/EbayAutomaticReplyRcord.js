/**  =========================> *|`| % Ebay自动回复记录 % |`|*<======================== **/
import http from '@/http';

// ebay自动回复记录列表
export function getListEbay(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/Ebay_auto_reply_record/get_list', params);
}