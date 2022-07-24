import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/review/ebay_feedback/get_list', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/review/ebay_feedback/show_log', params);
}

export function getReplyData(params = {}) {
    params = {...params};
    return http.getAjax('/review/ebay_feedback/get_reply_data', params);
}

export function setReplyData(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback_response/store', params);
}

export function getAfterReason(params = {}) {
    params = {...params};
    return http.getAjax('/review/ebay_feedback/after_reason', params);
}

export function setAfterReason(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback/after_reason', params);
}

export function getFollowUp(params = {}) {
    params = {...params};
    return http.getAjax('/review/ebay_feedback/follow_up', params);
}

export function setFollowUp(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback/follow_up', params);
}

export function getSendMessage(params = {}) {
    params = {...params};
    return http.getAjax('/review/ebay_feedback/send_message', params);
}

export function setSendMessage(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/active_contact', params);
}

export function setSignStatus(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback/sign_status', params);
}

export function saveKefu(params = {}) {
    params = {...params};
    return http.postAjax('/review/ebay_feedback/distribution_user', params);
}

export function dataOutput(params = {}) {
    params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
    params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
    let str = '';
    for (let key in params) {
        let val = params[key] === 0 ? 0 : (params[key] || '');
        if( val !== '' ){
            if( Array.isArray(val) ){
                val.forEach(e => {
                    str = str ? `${str}&${key}[]=${e}` : `${key}[]=${e}`;
                });
            }else{
                str = str ? `${str}&${key}=${val}` : `${key}=${val}`;
            }
        }
    }
    window.open('/api/review/ebay_feedback/download?' + str, '_self');
}
