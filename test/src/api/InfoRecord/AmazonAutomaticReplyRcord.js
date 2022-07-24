/**  =========================> *|`| % amazon自动回复记录 % |`|*<======================== **/
import http from '@/http';

// amazon自动回复记录列表
export function getListAmazon(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_auto_reply/get_list', params);
}