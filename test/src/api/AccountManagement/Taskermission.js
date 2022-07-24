/**  =========================> *|`| % 数据权限管理 % |`|*<======================== **/
import http from '@/http';

// 任务权限列表
export function getTaskPermissionList(params = {}) {
    params = {...params};
    return http.getAjax('/account_set/user_task_permission/get_list', params);
}
//获取日志信息
export function getPermissionLogs(params = {}) {
    params = {...params};
    return http.getAjax('/account_set/user_task_permission/get_logs', params);
}
//获取客服人员信息
export function getUserList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/account_sales/get_list', params);
}
//保存修改信息
export function saveEditInfo(params = {}) {
    params = {...params};
    return http.postAjax('/account_set/user_task_permission/save', params);
}