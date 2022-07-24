import http from '@/http';

export function getMainList(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_case_refund_set/get_list', params);
}

export function changeRuleStatus(params = {}) {
    params = {...params};
    return http.getAjax('/ebay/ebay_case_refund_set/status', params);
}

export function getLogs(params = {}) {
  params = {...params};
  return http.getAjax('/ebay/ebay_case_refund_set/log', params);
}

export function setDefaultRule(params = {}) {
  params = {...params};
  return http.getAjax('/ebay/ebay_case_refund_set/set_default', params);
}

export function editRule(params = {}) {
  params = {...params};
  return http.postAjax('/ebay/ebay_case_refund_set/update', params);
}

export function getDefaultRule(params = {}) {
  params = {...params};
  return http.getAjax('/ebay/ebay_case_refund_set/get_default_data', params);
}
