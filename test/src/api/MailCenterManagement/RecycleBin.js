import http from '@/http';

export function getRecycleBinList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_recycle/get_list', params);
}

export function getDropDownBoxList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_recycle/get_header_select', params);
}

export function resetRecycleBinList(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_recycle/restore', params);
}

export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/emails/mail_recycle/show_log', params);
}
