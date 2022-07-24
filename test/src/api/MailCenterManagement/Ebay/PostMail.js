import http from '@/http';

export function sendEmail(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_active_send_email/store', params);
}

export function saveDraftEmail(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_mail_draftbox/store', params);
}

export function getItemTemplate(params = {}) {
    params = {...params};
    return http.getAjax('/emails/Ebay_active_send_email/create', params);
}

export function getOrderProItem(params = {}) {
    params = {...params};
    return http.postAjax('/order/ebay_order_list/order_pro_item', params);
}

export function getDraftBoxMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_mail_draftbox/get_one', params);
}

export function getOutBoxMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_mail_outbox/get_one', params);
}

export function getInBoxMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_inbox/get_one', params);
}

export function getSubjectList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/Ebay_common_subject/get_select_list', params);
}
