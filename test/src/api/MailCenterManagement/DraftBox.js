import http from '@/http';

export function getDraftBoxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_draftbox/get_list', params);
}

export function getDropDownBoxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_draftbox/get_header_select', params);
}

export function delDraftBoxList(params = {}) {
    params = {...params};
    return http.postAjax('/emails/mail_draftbox/destroy', params);
}

export function sendDraftBoxList(params = {}) {
    params = {...params};
    return http.postAjax('/emails/mail_draftbox/send', params);
}
