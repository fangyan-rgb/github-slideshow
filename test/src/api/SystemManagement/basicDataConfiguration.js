/**  =========================> *|`| % 基础数据配置% |`|*<======================== **/

import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * JUDY
 * 列表
 */
export function getBasicDataList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/basic_config/get_list', params);
}
/**
 * JUDY
 * 删除
 */
export function getBasicDataDelete(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/basic_config/delete', params);
}
/**
 * JUDY
 * 新增编辑平台下拉
 */
export function getPlatformDropDown(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/General_data/get_platform_list', params);
}
/**
 * JUDY
 * 新增编辑类型下拉
 */
export function getCategoryDropDown(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/basic_config/get_category_list', params);
}
/**
 * JUDY
 * 编辑确定
 */
export function basicConfigEdit(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/basic_config/update', params);
}
/**
 * JUDY
 * 新增确定
 */
export function basicConfigAdd(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/basic_config/create', params);
}
/**
 * JUDY
 *  日志
 */
export function getLog(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/General_data/get_logs', params);
}
//获取二级类型值列表
export function getChildType(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/basic_config/get_for_parent', params);
}
//平台获取一级
export function getCategoryList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/basic_config/get_category_list', params);
}