/**  =========================> *|`| % 自动发信规则(请求数据) % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';
/* 获取列表数据 */
// export function getAutomationSendRuleListInfo(params) {
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
//         window.open('/system_set/mail_auto_send/get_list' + str, '_self');
//         return new Promise((resolve => {
//             resolve({
//                 data: {
//                     status: 2
//                 }
//             });
//         }));
//     } else {
//         return http.getAjax('/system_set/mail_auto_send/get_list', data);
//     }
// }
//获取列表数据
export function getAutomationSendRuleListInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_auto_send/get_list', data);
}

//获取平台信息
export function platformCodeInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_platform_list', data);
}

//获取邮件模板
export function maliTemplateInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_template/get_all_list', data);
}

//获取触发条件信息
export function triggerConditionInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_auto_send/get_option_value', data);
}

//获取运输方式
export function getBuyerOptionList(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/general_data/get_buyer_option_list', data);
}

//获取账号信息
export function getAccountOptionList(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_auto_reply/get_account_site', data);
}

//获取仓库列表
export function getWarehouseOptionList(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/general_data/get_warehouse_list', data);
}

//获取邮寄方式
export function getLogisticsOptionList(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/general_data/get_logistics_list', data);
}

//获取国家列表
export function getCountryOptionList(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/general_data/get_country_list', data);
}

//新增确定
export function addEmailClassifyConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_auto_send/create', data);
}

//编辑确定
export function editEmailClassifyConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_auto_send/update', data);
}

//删除确定
export function deleteAutomationSendRule(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_auto_send/delete', data);
}

//   CaseeLee
//   编辑自动发信
export function editSendRule(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_auto_send/update', data);
}

//  CaseeLee
//  日志信息
// export function getLogData(params = {}) {
//     params = {...params};
//     return http.getAjax('/aftersales/after_sales_order/showlog', params);
// }

//操作日志
export function getLogData(LogData) {
    const data = LogData ? Object.assign(LogData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_logs', data);
}

// 获取规则详情
export function getRuleInfo(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/mail_auto_send/get_detail', params);
}
