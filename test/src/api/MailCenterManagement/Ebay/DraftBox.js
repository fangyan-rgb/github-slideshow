import http from '@/http';

export function getDraftBoxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/ebay_mail_draftbox/get_list', params);
}

export function sendDraftBoxList(params = {}) {
    params = {...params};
    return http.postAjax('/emails/ebay_mail_draftbox/send', params);
}
