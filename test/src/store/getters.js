
const getters = {
    loginInfo: state => state.loginInfo,
    systemId: state => state.systemId,
    showLoading: state => state.showLoading,
    buttonList: state => state.buttonList,
    queryParamsInfo: state => state.queryParamsInfo,
    pageCacheStatus: state => state.pageCacheStatus,
    permitPath: state => state.permitPath,
    permitResource: state => state.permitResource,

    // 导航激活index
    navIndex: state => state.navIndex,

    // 展开指定导航面板INDEX
    singleNavIndex: state => state.singleNavIndex,

    // 多页签
    tabLabel: state => state.tabLabel,

    // 草稿箱
    DraftBoxObj: state => state.DraftBox.DraftBoxObj,

    // 发件箱
    OutboxObj: state => state.Outbox.OutboxObj,

    // 回收站
    RecycleBinObj: state => state.RecycleBin.RecycleBinObj,

    // 收件箱
    InboxObj: state => state.Inbox.InboxObj,

    // 消息中心
    MessageCenterObj: state => state.MessageCenter.MessageCenterObj,

    // 纠纷中心
    DisputeCenterObj: state => state.DisputeCenter.DisputeCenterObj,

    //订单管理
    orderListManagementInfo: state => state.order_list_management.orderListManagementInfo,

    //订单信息
    orderInformation: state => state.order_information.orderInformation,

    //邮箱管理
    mailManagementMation: state => state.mail_management.mailManagementMation,

    //任务权限管理
    jurisdictionManagementMation: state => state.jurisdiction_management.jurisdictionManagementMation,

    /* 系统配置 */
    //标签配置
    labelConfigurationInfo:state => state.LabelConfiguration.labelConfigurationInfo,    // store/module/LabelConfiguration文件内的labelConfigurationInfo，定义至组件内的getters
    //邮件分类配置
    emailClassifyConfigurationInfo:state => state.EmailClassifyConfiguration.emailClassifyConfigurationInfo,
    //自动发信规则
    automationSendRuleInfo:state => state.AutomationSendRule.automationSendRuleInfo,
    //自动回复规则
    automationReplyRuleInfo:state => state.AutomationReplyRule.automationReplyRuleInfo,
    //自动售后单规则
    automationAfterSaleRuleInfo:state => state.AutomationAfterSaleRule.automationAfterSaleRuleInfo,
    //自动信息记录
    automationMessageInfo:state => state.AutomationMessage.automationMessageInfo,

    // 客户评价review
    CustomerReviewInfo: state => state.CustomerEvaluationReview.CustomerReviewInfo,
    // 客户评价feedback
    CustomerFeedbackInfo: state => state.CustomerReviewsFeedBack.CustomerFeedbackInfo,

    // 售后单管理
    AfterSaleInfo: state => state.AfterSalesOrderManagement.AfterSaleInfo,
    // 客诉列表
    CustomerComplaintInfo: state => state.CustomerComplaintList.CustomerComplaintInfo,
    // 收款请求列表
    ReceiptRequestInfo: state => state.ReceiptRequestList.ReceiptRequestInfo,
    // 登记收款列表
    RegisteredPaymentInfo: state => state.RegisteredPaymentList.RegisteredPaymentInfo,

    // 系统配置 基础数据配置
    BasicDataInfo: state => state.BasicDataConfiguration.BasicDataInfo,
    // 系统配置 发票信息配置
    InvoiceInfoConfiguration: state => state.InvoiceInfoConfiguration.InvoiceInfoConfiguration,
    // 系统配置 模板配置
    TemplateConfigInfo: state => state.TemplateConfiguration.TemplateConfigInfo,
    // 系统配置 模板分类配置
    TemplateClassInfo: state => state.TemplateClassificationConfiguration.TemplateClassInfo,

    // 搜索配置
    searchConfig: state => state.searchConfig,
    // 勾选搜索条件
    checkedSearchInfo: state => state.checkedSearchInfo,
    // 选中搜索条件
    checkedMainData: state => state.checkedMainData,
};

export default getters
