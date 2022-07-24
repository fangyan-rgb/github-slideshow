                            /**  =========================> *|`| % 数据权限管理 % |`|*<======================== **/
import http from '@/http';

// 数据权限列表
export function getDataPermissionList(params = {}) {
    params = {...params};
    return http.getAjax('/account_set/User_data_permission/get_list', params);
}

//获取要修改的人员详细权限
export function getDataPermissionDetail(params = {}) {
    params = {...params};
    return http.getAjax('/account_set/User_data_permission/get_detail', params);
}

//权限列表默认加载数据
export function dataDisplayList(params = {}) {
    params = {...params};
    return http.getAjax('/account_set/user_permission/load_default_data', params);
}

//获取账号信息
export function getAccountOptionList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/mail_auto_reply/get_account_site', params);
}

//获取产品线数据
export function getProLineOptionList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/product_line/get_list_redis', params);
}

//保存修改后的权限
export function setPermission(params = {}) {
    params = {...params};
    return http.postAjax('/account_set/User_data_permission/save', params);
}

//获取权限日志信息
export function getPermissionLogs(params = {}) {
    params = {...params};
    return http.getAjax('/account_set/user_data_permission/get_logs', params);
}