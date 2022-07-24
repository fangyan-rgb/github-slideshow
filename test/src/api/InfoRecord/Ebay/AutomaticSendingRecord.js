/**  =========================> *|`| % 自动发信记录 % |`|*<======================== **/
import http from '@/http';

// ebay自动发信记录列表
export function getListEbay(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/email_send_record/get_list_ebay', params);
}
//拦截发送
export function interceptEbay(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/email_send_record/intercept_ebay', params);
}
//重发
export function reSendBatch(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/re_send_batch', params);
}