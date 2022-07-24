import http from '@/http';

/**
 * CaseeLee
 * 列表
 */
export function getSearchList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/item/get_list', params);
}

// 获取个人收藏网址数据列表
export function getPersonalCollectionList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/user_save_url/get_list', params);
}

// 添加个人收藏网址数据
export function addPersonalCollectionItem(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/user_save_url/create', params);
}

// 邮件处理页面用户自定义模板分类列表
export function getCustomizeMailTemplateList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/mail_template/get_mail_template_list', params);
}

// 邮件处理页面添加常用模板
export function addCustomizeMailTemplate(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/mail_template/add_ofen_use_template', params);
}

// 编辑主题
export function saveMailSubjectEditor(params = {}, platform = 'Amazon') {
    params = {...params};
    return http.postAjax(`/emails/${platform}_common_subject/create`, params);
}

// 获取已保存的主题
export function getMailSubjectEditor(params = {}, platform = 'Amazon') {
    params = {...params};
    return http.postAjax(`/emails/${platform}_common_subject/get_list`, params);
}
