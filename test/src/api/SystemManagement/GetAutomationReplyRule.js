/**  =========================> *|`| % 自动回复规则(请求数据) % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';
// /* 获取列表数据 */
// export function getAutomationReplyRuleListInfo(params) {
//     const data = {
//         page: 1,
//         page_size: 20,
//         ...CONFIG.ajaxData,
//         ...params
//     };

//     // 查询参数带isExcel为导出
//     if (data.isExcel) {
//         let str = '?';
//         for (let key in data) {
//             str = `${str}&${key}=${data[key] || ''}`;
//         }
//         window.open('/system_set/mail_auto_reply/get_list' + str, '_self');
//         return new Promise((resolve => {
//             resolve({
//                 data: {
//                     status: 2
//                 }
//             });
//         }));
//     } else {
//         return http.getAjax('/system_set/mail_auto_reply/get_list', data);
//     }
// }
/* 获取列表数据 */
export function getAutomationReplyRuleListInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_auto_reply/get_list', data);
}

//获取平台信息
export function platformCodeInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_platform_list', data);
}
//获取邮件模板(选择模板)
export function getMaliTemplateInfo(MaliTemplateInfo) {
    const data = MaliTemplateInfo ? Object.assign(MaliTemplateInfo, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_template/get_all_list', data);
}
//获取编辑信息
export function editDetailsInfo(editDeta) {
    const data = editDeta ? Object.assign(editDeta, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_auto_reply/get_detail', data);
}
//新增
export function addAutomationReplyRule(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_auto_reply/create', data);
}

//编辑
export function editAutomationReplyRule(edit) {
    const data = edit ? Object.assign(edit, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_auto_reply/update', data);   
}

//删除确定
export function deleteAutomationReplyRule(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_auto_reply/delete', data);   
}

/**
 * CaseeLee
 * 日志信息  
 */
// export function getLogData(params = {}) {
//     params = {...params};
//     return http.getAjax('/aftersales/after_sales_order/showlog', params);
// }

//操作日志   
export function getLogData(LogData) {
    const data = LogData ? Object.assign(LogData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_logs', data);   
}

//获取消息来源账号、站点数据
export function getNewsSourceData(NewsSource) {
    const data = NewsSource ? Object.assign(NewsSource, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_auto_reply/get_account_site', data);   
}

//获取邮件模板内容
export function getEmailContentData(emailContent) {
    const data = emailContent ? Object.assign(emailContent, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_template/get_detail', data);   
}

//获取国家列表
export function getCountryListData(countryList) {
    const data = countryList ? Object.assign(countryList, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/general_data/get_country_list', data);   
}