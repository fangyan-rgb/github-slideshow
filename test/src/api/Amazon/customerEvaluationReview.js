/**  =========================> *|`| % 客户评价Review % |`|*<======================== **/

import http from '@/http';

/**
 * JUDY
 * Review评价列表和模糊查询接口
 */
export function reviewList(params = {}) {
    params = {...params};
    return http.getAjax('/review/reviews/review_list', params);
}
/**
 * JUDY
 * Review评价批量处理
 */
export function batchDealMail(params = {}) {
    params = {...params};
    return http.getAjax('/review/amazon_email/batch_email_list', params);
}

/**
 * JUDY
 * Review评价日志接口
 */
export function getLogs(params = {}) {
    params = {...params};
    return http.getAjax('/review/reviews/get_logs', params);
}
/**
 * JUDY
 * 下拉
 */
export function getForParent(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/basic_config/get_for_parent', params);
}
/**
 * JUDY
 * 跟进状态
 */
export function followReview(params = {}) {
    params = {...params};
    return http.getAjax('/review/reviews/follow_review', params);
}
/**
 * JUDY
 * 差评原因
 */
export function reviewReason(params = {}) {
    params = {...params};
    return http.getAjax('/review/reviews/update_review', params);
}
/**
 * JUDY
 * ；列表下拉
 */
export function detailDropDown(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/basic_config/get_all_detail', params);
}
