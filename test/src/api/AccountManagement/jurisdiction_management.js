/**  =========================> *|`| % 邮箱管理 % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

export function getJurisdictionManagementMation(params) {
    const data = {
        page: 1,
        page_size: 10,
        ...CONFIG.ajaxData,
        ...params
    };

    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/api/warehouse/index' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax('/account_set/user_permission/load_default_data', data);
    }
}
//数据显示权限列表默认加载数据
export function dataDisplayList(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/account_set/user_permission/load_default_data', data);
}

//查询用户数据/account_set/user_permission/add
export function updateViewJurisdiction(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/account_set/user_permission/update_view', data);
}
//新增用户权限
export function newAddUserJurisdiction(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/account_set/user_permission/add', data);
}
//修改用户权限
export function updateUserJurisdiction(queryData) {
    const data = queryData ? Object.assign(queryData, CONFIG.ajaxData) : CONFIG.ajaxData;
    return http.postAjax('/account_set/user_permission/update', data);
}