/**  =========================> *|`| % 发送消息记录 % |`|*<======================== **/
import http from '@/http';

// ebay发送消息记录列表
export function outboxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/get_list_ebay', params);
}
//获取发送消息记录日志信息
export function showLog(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/ebay_show_log', params);
}
//重发
export function reSendBatch(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/re_send_batch', params);
}