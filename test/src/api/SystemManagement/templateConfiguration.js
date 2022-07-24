/**  =========================> *|`| % 模板配置  % |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * JUDY
 * 列表
 */
export function getTemplateList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/mail_template/get_list', params);
}
/**
 * JUDY
 * 删除
 */
export function getTemplateDelete(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/mail_template/delete', params);
}
/**
 * JUDY
 * 新增编辑详情 下拉
 */
export function getTemplateDetail(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/basic_config/get_detail', params);
}
/**
 * JUDY
 * 新增编辑详情 确定 system_set/General_data/get_logs
 */
export function getTemplateEdit(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/mail_template/update', params);
}
/**
 * JUDY
 *  日志
 */
export function getLog(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/General_data/get_logs', params);
}