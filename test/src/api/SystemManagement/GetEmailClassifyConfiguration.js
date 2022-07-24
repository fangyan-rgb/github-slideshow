/**  =========================> *|`| % 邮件分类配置(请求数据) % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';
// /* 获取列表数据 */
// export function getEmailClassifyConfigurationListInfo(params) {
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
//         window.open('/system_set/mail_classify_rule/get_list' + str, '_self');
//         return new Promise((resolve => {
//             resolve({
//                 data: {
//                     status: 2
//                 }
//             });
//         }));
//     } else {
//         return http.getAjax('/system_set/mail_classify_rule/get_list', data);
//     }
// }
/* 获取列表数据 */
export function getEmailClassifyConfigurationListInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_classify_rule/get_list', data);
}

//操作日志
/* export function getOperationLogInfo(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/api/LogisticsImportCustomsElements/actionLog', data);   
} */


//新增确定
export function addEmailClassifyConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_classify_rule/create', data);
}

//编辑
export function editEmailClassifyConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_classify_rule/update', data);   
}

//删除
export function deleteEmailClassifyConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/mail_classify_rule/delete', data);   
}

//下拉数据
export function getdropDownData(dropDown) {
    const data = dropDown ? Object.assign(dropDown, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/basic_config/get_all_detail', data);   
}

//获取规则详情、编辑数据
export function getEmailClassifyConfigurationEditData(editData) {
    const data = editData ? Object.assign(editData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/mail_classify_rule/get_detail', data);   
}

//获取platform_code列表
export function getPlatformCodeData(PlatformCode) {
    const data = PlatformCode ? Object.assign(PlatformCode, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_platform_list', data);   
}

/* CaseeLee
 日志信息  
export function getLogData(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/showlog', params);
} */

//操作日志   
export function getLogData(LogData) {
    const data = LogData ? Object.assign(LogData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_logs', data);   
}
