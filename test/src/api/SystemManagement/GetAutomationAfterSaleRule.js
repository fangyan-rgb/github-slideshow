/**  =========================> *|`| % 自动售后单规则(请求数据) % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';
// /* 获取列表数据 */
// export function getAutomationAfterSaleRuleListInfo(params) {
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
//         window.open('/system_set/aftersale/get_list' + str, '_self');
//         return new Promise((resolve => {
//             resolve({
//                 data: {
//                     status: 2
//                 }
//             });
//         }));
//     } else {
//         return http.getAjax('/system_set/aftersale/get_list', data);
//     }
// }
/* 获取列表数据 */
export function getAutomationAfterSaleRuleListInfo(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/aftersale/get_list', data);
}

//新增
export function addAutomationAfterSaleRule(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/aftersale/create', data);
}

//编辑
export function editAutomationAfterSaleRule(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/aftersale/update', data);   
}

//删除
export function deleteAutomationAfterSaleRule(addObj) {
    const data = addObj ? Object.assign(addObj, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/aftersale/delete', data);   
}

//下拉数据
export function getdropDownData(dropDown) {
    const data = dropDown ? Object.assign(dropDown, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/basic_config/get_all_detail', data);   
}

//获取规则详情、编辑数据
export function getAutomationAfterSaleRuleData(dropDown) {
    const data = dropDown ? Object.assign(dropDown, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/aftersale/get_detail', data);   
}

//获取第三级数据（售后规则）
export function getThirdStageData(thirdStage) {
    const data = thirdStage ? Object.assign(thirdStage, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/basic_config/get_third_data', data);   
}
/**
 * JUDY
 *  日志
 */
export function getLog(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/General_data/get_logs', params);
}