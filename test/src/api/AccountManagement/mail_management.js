/**  =========================> *|`| % 邮箱管理 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

// export function getMailManagementMation(params) {
//     const data = {
//         now_page: 1,
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
//         window.open('/api/warehouse/index' + str, '_self');
//         return new Promise((resolve => {
//             resolve({
//                 data: {
//                     status: 2
//                 }
//             });
//         }));
//     } else {
//         return http.postAjax('/system_set/email_set/get_email_list', data);
//     }
// }
//邮箱管理列表
export function mailManagementList(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/email_set/get_email_list', data);
}
//新增邮箱
export function addNewMail(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/email_set/add', data);
}
//修改邮箱
export function editMail(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/email_set/update', data);
}
//删除邮箱
export function deleteMail(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/email_set/del', data);
}
//批量删除邮箱
export function batchDeleteMail(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/email_set/batch_delete', data);
}
//批量导入预览
export function batchImportEmail(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/email_set/batch_import_prview', data);
}
//提交批量导入数据
export function batchImportSubmit(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/system_set/email_set/batch_import_submit', data);
}
//获取平台下拉选项
export function platformPass(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/item/get_list', data);
}

//日志
export function getEmailLog(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.getAjax('/system_set/email_set/view_log', data);
}
