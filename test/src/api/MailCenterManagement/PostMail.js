import http from '@/http';

export function sendEmail(params = {}) {
    params = {...params};
    return http.postAjax('/emails/Active_send_email/store', params);
}

export function saveDraftEmail(params = {}) {
    params = {...params};
    return http.postAjax('/emails/mail_draftbox/store', params);
}

export function getDraftBoxMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_draftbox/get_one', params);
}

export function getOutBoxMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_outbox/get_one', params);
}

export function getInBoxMail(params = {}) {
    params = {...params};
    return http.getAjax('/emails/amazon_inbox/get_one', params);
}

export function getOrderProItem(params = {}) {
    params = {...params};
    return http.postAjax('/order/order_list/order_pro_item', params);
}

export function getItemTemplate(params = {}) {
    params = {...params};
    return http.getAjax('/emails/Active_send_email/create', params);
}

export function getTemplateDetail(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/mail_template/get_detail', params);
}

export function getGoogleTranslate(params = {}) {
    params = {...params};
    return http.postAjax('/emails/Google/Translate_back', params);
}

export function getAccountIdList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/active_send_email/get_account_list', params);
}

export function getEmailById(params = {}) {
    params = {...params};
    return http.getAjax('/emails/active_send_email/get_email_by_id', params);
}

export function getSubjectList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/Amazon_common_subject/get_select_list', params);
}
