/**  =========================> *|`| % 模板分类配置% |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * JUDY
 * 列表
 */
export function getClassTemplateList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/template_category/get_list', params);
}
/**
 * JUDY
 * 删除 system_set/template_category/update
 */
export function getClassTemplateDelete(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/template_category/delete', params);
}
/**
 * JUDY
 * 编辑
 */
export function getClassTemplateEdit(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/template_category/update', params);
}
/**
 * JUDY
 *  日志
 */
export function getLog(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/General_data/get_logs', params);
}
/**
 * JUDY
 *  获取平台下拉数据
 */
export function getPlatformCodeList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/General_data/get_platform_list', params);
}