/**  =========================> *|`| 自动留评规则 |`|*<======================== **/

import http from '@/http';

//列表
export function getFeedbackAccountRuleList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/feedback_account_rule/get_list', params);   
}
//删除
export function FeedbackAccountRuleDelete(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/feedback_account_rule/delete', params);   
}
//新增
export function FeedbackAccountRuleAdd(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/feedback_account_rule/add', params);   
}
//编辑
export function FeedbackAccountRuleUpdate(params = {}) {
    params = {...params};
    return http.postAjax('/system_set/feedback_account_rule/update', params);   
}
//日志
export function FeedbackAccountRuleLog(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/feedback_account_rule/log', params);   
}
//状态启用/停用
export function FeedbackAccountRuleStatus(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/feedback_account_rule/status', params);   
}

//模板
export function getTemplateList(params = {}) {
    params = {...params};
    return http.getAjax('/system_set/feedback_account_rule/template_list', params);   
}