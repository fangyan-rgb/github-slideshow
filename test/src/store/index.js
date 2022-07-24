
import getters from './getters';
import mutations from './mutation';
import state from './state';
import actions from './actions';

import Vue from 'vue';
import VueX from 'vuex';

// 邮箱中心
import DraftBox from '@/store/module/MailCenterManagement/DraftBox';
import Outbox from '@/store/module/MailCenterManagement/Outbox';
import RecycleBin from '@/store/module/MailCenterManagement/RecycleBin';
import Inbox from '@/store/module/MailCenterManagement/Inbox';

// 消息中心
import MessageCenter from '@/store/module/Amazon/MessageCenter';

// 纠纷中心
import DisputeCenter from '@/store/module/Amazon/DisputeCenter';

/* 导入store/module/xxxx文件 */
// 系统配置
import LabelConfiguration from './module/system_manage/LabelConfiguration';    //标签配置
import EmailClassifyConfiguration from './module/system_manage/EmailClassifyConfiguration';    //邮件分类配置
import AutomationSendRule from './module/system_manage/AutomationSendRule';    //自动发信规则
import AutomationReplyRule from './module/system_manage/AutomationReplyRule';    //自动回复规则
import AutomationAfterSaleRule from './module/system_manage/AutomationAfterSaleRule';    //自动售后规则
import AutomationMessage from './module/system_manage/AutomationMessage';    //自动信息记录



//订单管理
import order_list_management from './module/orderInfo/order_list_management';

//订单信息
import order_information from './module/orderInfo/order_information';

//邮箱管理
import mail_management from './module/AccountManagement/mail_management'

//任务权限管理
import jurisdiction_management from './module/AccountManagement/jurisdiction_management'

// 客户评价review
import CustomerEvaluationReview from './module/Amazon/CustomerEvaluationReview'
// 客户评价review
import CustomerReviewsFeedBack from './module/Amazon/CustomerReviewsFeedBack'
// 售后单管理
import AfterSalesOrderManagement from './module/AfterSalesManagement/AfterSalesOrderManagement'
// 客诉列表
import CustomerComplaintList from './module/AfterSalesManagement/CustomerComplaintList'
// 收款请求列表
import ReceiptRequestList from './module/AfterSalesManagement/ReceiptRequestList'
// 登记收款列表
import RegisteredPaymentList from './module/AfterSalesManagement/RegisteredPaymentList'

// 系统配置基础数据配置
import BasicDataConfiguration from './module/system_manage/BasicDataConfiguration'
// 系统配置发票信息配置
import InvoiceInfoConfiguration from './module/system_manage/InvoiceInfoConfiguration'
// 系统配置模板配置
import TemplateConfiguration from './module/system_manage/TemplateConfiguration'
// 系统配置模板分类配置
import TemplateClassificationConfiguration from './module/system_manage/TemplateClassificationConfiguration'




Vue.use(VueX);

export default new VueX.Store({

    // module名称必须和路由名称相同
    modules: {
        DraftBox,   // 草稿箱
        Outbox,     // 发件箱
        RecycleBin, // 回收站
        Inbox,      // 收件箱
        MessageCenter,  // 消息中心
        DisputeCenter,  // 纠纷中心
        LabelConfiguration,
        order_list_management,//订单管理
        order_information,//订单信息
        EmailClassifyConfiguration,
        AutomationSendRule,
        AutomationReplyRule,
        AutomationAfterSaleRule,
        AutomationMessage,
        mail_management,//邮箱管理
        jurisdiction_management,//任务权限管理
        CustomerEvaluationReview, // 客户评价review
        CustomerReviewsFeedBack, // 客户评价feedback
        AfterSalesOrderManagement, // 售后单管理
        CustomerComplaintList, // 客诉列表
        ReceiptRequestList, // 收款请求列表
        RegisteredPaymentList, // 登记收款列表
        BasicDataConfiguration, // 系统配置基础数据配置
        InvoiceInfoConfiguration, // 系统配置发票信息配置
        TemplateConfiguration, // 系统配置模板配置
        TemplateClassificationConfiguration, // 模板分类配置
    },
    state,
    getters,
    mutations,
    actions,
})
