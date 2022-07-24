/**
 * CaseeLee
 * 默认配置，对应模块的main_title_id
 */
export const defaultConfig = {
    1: '/Inbox', 2: '/DraftBox', 3: '/Outbox',
    4: '/RecycleBin', 5: '/MessageCenter' ,6: '/DisputeCenter', 
    7: '/CustomerEvaluationReview', 8: '/CustomerReviewsFeedBack', 9: '/OrderListManagement', 
    10: '/LabelConfiguration', 11: '/AutomationReplyRule', 12: '/AutomationSendRule',
    13: '/EmailClassifyConfiguration', 14: '/AutomationAfterSaleRule', 15: '/AutomationMessage', 
    16: '/TemplateConfiguration', 17: '/TemplateClassificationConfiguration', 18: '/BasicDataConfiguration',
    19: '/MailManagement', 20: '/JurisdictionManagement', 21: '/AfterSalesOrderManagement', 
    22: '/RegisteredPaymentList', 23: '/ReceiptRequestList', 24: '/CustomerComplaintList',

    // 二期搜索配置
    29: '/EbayMessage', 30: '/EbayCancel', 31: '/EbayINR', 
    32: '/EbayReturn', 33: '/EbayEvaluateFeedBack', 34: '/EbayUpgradeRefundRules',
    35: '/EbayMessageFilter', 36: '/EbayOrderListManagement', 37: '/EbayAfterSalesOrderManagement', 
    38: '/EbayRegisteredPaymentList', 39: '/EbayReceiptRequestList', 40: '/EbayCustomerComplaintList',
    41: '/EbaySendMessageRecord', 42: '/DataPermission', 43: '/TaskPermission', 

    // V2.0.1
    44: '/EbayDisputeRefundResult', 
    
    // V2.1.0
    45: '/EbayInbox', 46:'/EbayDraftBox',47: '/EbayOutbox', 
    48: '/AmazonDomesticRefund', 49: '/AmazonOverseasRefund',50: '/EbayDomesticRefund', 
    51: '/EbayOverseasRefund', 52: '/CancelOrderResult',53: '/AutomaticSendingRecord', 
    54: '/AutomaticReviewRules', 55: '/AmazonAutomaticReplyRcord', 56: '/EbayAutomaticReplyRcord',
    57: '/AutomaticAssessmentRecord',
}

export const defaultConfigArr = Object.keys(defaultConfig).map(item => defaultConfig[item])

