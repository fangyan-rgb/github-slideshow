/**  =========================> *|`| % 客户评价feedback % |`|*<======================== **/

import http from '@/http';
import { getSessionStorage } from '@/utils/storage';

/**
 * JUDY
 * feedback评价列表和模糊查询接口
 */
export function feedbackList(params = {}) {
    params = {...params};
    return http.getAjax('/review/feedback/feedback_list', params);
}
/**
 * JUDY
 * feedback批量申请移除
 */
export function batchDelete(params = {}) {
    params = {...params};
    return http.postAjax('/review/amazon_feedback/batch_delete', params);
}
/**
 * JUDY
 * Feedback操作日志列表接口
 */
export function getFeedbackLogs(params = {}) {
    params = {...params};
    return http.getAjax('/review/feedback/get_logs', params);
}

/**
 * JUDY
 * 跟进状态
 */
export function followReview(params = {}) {
    params = {...params};
    return http.getAjax('/review/feedback/follow_review', params);
}
/**
 * JUDY
 * 差评原因
 */
export function reviewReason(params = {}) {
    params = {...params};
    return http.getAjax('/review/feedback/update_feedback', params);
}

/**
 * JUDY
 * 回复评论 详情
 */
export function replyDetail(params = {}) {
    params = {...params};
    return http.getAjax('/review/feedback/item_template', params);
}
/**
 * JUDY
 * 回复评论 确定
 */
export function replyDetailConfirm(params = {}) {
    params = {...params};
    return http.postAjax('/review/feedback/return_review', params);
}

// 标记移除
export function tagRemoval(params = {}) {
    params = {...params};
    return http.postAjax('/review/feedback/move_stamp', params);
}

export function dataOutput(params = {}) {
    params.uid = JSON.parse(getSessionStorage('userInfo')).uid;
    params.staff_code = JSON.parse(getSessionStorage('userInfo')).staff_code;
    let str = '';
    for (let key in params) {
        let val = params[key] === 0 ? 0 : (params[key] || '');
        if( val !== '' ){
            if( Array.isArray(val) ){
                val.forEach(e => {
                    str = str ? `${str}&${key}[]=${e}` : `${key}[]=${e}`;
                });
            }else{
                str = str ? `${str}&${key}=${val}` : `${key}=${val}`;
            }
        }
    }
    window.open('/api/review/feedback/get_download?' + str, '_self');
}
