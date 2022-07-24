/**  =========================> *|`| % 标签配置(请求数据) % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';
// /* 获取列表数据 */
// export function getLabelConfigurationListInfo(params) {
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
//         window.open('/system_set/tag/get_tag_list' + str, '_self');
//         return new Promise((resolve => {
//             resolve({
//                 data: {
//                     status: 2
//                 }
//             });
//         }));
//     } else {
//         return http.getAjax('/system_set/tag/get_tag_list', data);
//     }
// }
/* 获取列表数据 */
export function getLabelConfigurationListInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/tag/get_tag_list', data);
}

//新增
export function addLabelConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/tag/create_tag', data);
}

//编辑
export function editLabelConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/tag/update_tag', data);   
}

//删除
export function deleteLabelConfiguration(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/tag/delete_tag', data);   
}

//获取platform_code列表
export function getPlatformCodeData(PlatformCode) {
    const data = PlatformCode ? Object.assign(PlatformCode, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_platform_list', data);   
}

/**
 * CaseeLee
 * 日志信息  
 */
/* export function getLogData(params = {}) {
    params = {...params};
    return http.getAjax('/aftersales/after_sales_order/showlog', params);
} */
//操作日志   
export function getLogData(LogData) {
    const data = LogData ? Object.assign(LogData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/General_data/get_logs', data);   
}