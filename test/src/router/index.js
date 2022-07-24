import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Layout from '../views/HomePage/Layout'
import NotAuthority from '../views/NotAuthority'
import { getAddressModelParams } from '../services/index'
import { getUserInfo } from '@/api/login'
import configFn from './routerConfig'
import CONFIG from '../assets/js/config'

// 首页
import staging from '../views/HomePage/HomePage'

// 邮件中心
import PostMail from '../views/HomePage/MailCenterManagement/PostMail'
import Inbox from '../views/HomePage/MailCenterManagement/Inbox'
import DraftBox from '../views/HomePage/MailCenterManagement/DraftBox'
import Outbox from '../views/HomePage/MailCenterManagement/Outbox'
import RecycleBin from '../views/HomePage/MailCenterManagement/RecycleBin'

// Ebay邮件中心
import EbayPostMail from '../views/HomePage/MailCenterManagement/Ebay/PostMail'
import EbayInbox from '../views/HomePage/MailCenterManagement/Ebay/Inbox'
import EbayDraftBox from '../views/HomePage/MailCenterManagement/Ebay/DraftBox'
import EbayOutbox from '../views/HomePage/MailCenterManagement/Ebay/Outbox'

// 邮件处理     用于keep-alive缓存
import MailProcessing_0 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_0'
import MailProcessing_1 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_1'
import MailProcessing_2 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_2'
import MailProcessing_3 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_3'
import MailProcessing_4 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_4'
import MailProcessing_5 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_5'
import MailProcessing_6 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_6'
import MailProcessing_7 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_7'
import MailProcessing_8 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_8'
import MailProcessing_9 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_9'
// 纠纷处理
import MailProcessing_10 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_10'
import MailProcessing_11 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_11'
import MailProcessing_12 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_12'
import MailProcessing_13 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_13'
import MailProcessing_14 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_14'
import MailProcessing_15 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_15'
import MailProcessing_16 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_16'
import MailProcessing_17 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_17'
import MailProcessing_18 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_18'
import MailProcessing_19 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_19'
// 消息处理
import MailProcessing_20 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_20'
import MailProcessing_21 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_21'
import MailProcessing_22 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_22'
import MailProcessing_23 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_23'
import MailProcessing_24 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_24'
import MailProcessing_25 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_25'
import MailProcessing_26 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_26'
import MailProcessing_27 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_27'
import MailProcessing_28 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_28'
import MailProcessing_29 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_29'
// Ebay-会员消息处理
import MailProcessing_30 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_30'
import MailProcessing_31 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_31'
import MailProcessing_32 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_32'
import MailProcessing_33 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_33'
import MailProcessing_34 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_34'
import MailProcessing_35 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_35'
import MailProcessing_36 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_36'
import MailProcessing_37 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_37'
import MailProcessing_38 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_38'
import MailProcessing_39 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_39'
// Ebay-ebay消息处理
import MailProcessing_40 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_40'
import MailProcessing_41 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_41'
import MailProcessing_42 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_42'
import MailProcessing_43 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_43'
import MailProcessing_44 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_44'
import MailProcessing_45 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_45'
import MailProcessing_46 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_46'
import MailProcessing_47 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_47'
import MailProcessing_48 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_48'
import MailProcessing_49 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_49'
// Ebay-ebay邮件处理
import MailProcessing_50 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_50'
import MailProcessing_51 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_51'
import MailProcessing_52 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_52'
import MailProcessing_53 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_53'
import MailProcessing_54 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_54'
import MailProcessing_55 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_55'
import MailProcessing_56 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_56'
import MailProcessing_57 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_57'
import MailProcessing_58 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_58'
import MailProcessing_59 from '../views/HomePage/MailCenterManagement/MailProcessing/pages/MailProcessing_59'

// 消息中心
import MessageCenter from '../views/HomePage/Amazon/MessageCenter'

// 纠纷中心
import DisputeCenter from '../views/HomePage/Amazon/DisputeCenter'

//账号管理模块
import JurisdictionManagement from '../views/HomePage/AccountManagement/JurisdictionManagement'
import MailManagement from '../views/HomePage/AccountManagement/MailManagement'

//订单信息模块
import OrderListManagement from '../views/HomePage/OrderManagement/OrderListManagement'
// import OrderInformation from '../views/HomePage/OrderManagement/OrderInformation'
import AmazonDomesticRefund from '../views/HomePage/OrderManagement/AmazonDomesticRefund'
import AmazonOverseasRefund from '../views/HomePage/OrderManagement/AmazonOverseasRefund'

// 客户评价
import CustomerEvaluationReview from '../views/HomePage/Amazon/CustomerEvaluationReview'
import CustomerReviewsFeedBack from '../views/HomePage/Amazon/CustomerReviewsFeedBack'

// 售后管理
import AfterSalesOrderManagement from '../views/HomePage/AfterSalesManagement/AfterSalesOrderManagement.vue'
import RegisteredPaymentList from '../views/HomePage/AfterSalesManagement/RegisteredPaymentList.vue'
import ReceiptRequestList from '../views/HomePage/AfterSalesManagement/ReceiptRequestList.vue'
import CustomerComplaintList from '../views/HomePage/AfterSalesManagement/CustomerComplaintList.vue'

//系统配置
import LabelConfiguration from '../views/HomePage/SystemConfiguration/LabelConfiguration'
import EmailClassifyConfiguration from '../views/HomePage/SystemConfiguration/EmailClassifyConfiguration'
import AutomationSendRule from '../views/HomePage/SystemConfiguration/AutomationSendRule'
import TemplateConfiguration from '../views/HomePage/SystemConfiguration/TemplateConfiguration'
import TemplateClassificationConfiguration from '../views/HomePage/SystemConfiguration/TemplateClassificationConfiguration'
import BasicDataConfiguration from '../views/HomePage/SystemConfiguration/BasicDataConfiguration'
import InvoiceInfoConfiguration from '../views/HomePage/SystemConfiguration/InvoiceInfoConfiguration'
//import EmailClassifyAddEdit from '../views/HomePage/SystemConfiguration/EmailClassifyConfiguration/component/EmailClassifyAddEdit'
import AutomaticReviewRules from '../views/HomePage/SystemConfiguration/AutomaticReviewRules'
import AutomationReplyRule from '../views/HomePage/SystemConfiguration/AutomationReplyRule'
import AutomationAfterSaleRule from '../views/HomePage/SystemConfiguration/AutomationAfterSaleRule'

//========================== AMAZON信息记录 =============================
import AutomationMessage from '../views/HomePage/InfoRecord/AutomationMessage'
import AmazonAutomaticReplyRcord from '../views/HomePage/InfoRecord/AmazonAutomaticReplyRcord'

//========================== ebay =============================
import EbayMessage from '../views/HomePage/Ebay/Message'
import EbayCancel from '../views/HomePage/Ebay/Cancel'
import EbayINR from '../views/HomePage/Ebay/INR'
import EbayReturn from '../views/HomePage/Ebay/Return'
import EbayEvaluateFeedBack from '../views/HomePage/Ebay/EvaluateFeedBack'
import EbayUpgradeRefundRules from '../views/HomePage/Ebay/UpgradeRefundRules'
import EbayMessageFilter from '../views/HomePage/Ebay/EbayMessageFilter'
import EbayDisputeRefundResult from '../views/HomePage/Ebay/DisputeRefundResult'

//========================== ebay订单列表 =============================
import EbayOrderListManagement from '../views/HomePage/OrderManagement/Ebay/OrderListManagement.vue'
import CancelOrderResult from '../views/HomePage/OrderManagement/Ebay/CancelOrderResult'
import EbayDomesticRefund from '../views/HomePage/OrderManagement/Ebay/EbayDomesticRefund'
import EbayOverseasRefund from '../views/HomePage/OrderManagement/Ebay/EbayOverseasRefund'

//========================== ebay信息记录 =============================
import EbaySendMessageRecord from '../views/HomePage/InfoRecord/Ebay/SendMessageRecord.vue'
import AutomaticSendingRecord from '../views/HomePage/InfoRecord/Ebay/AutomaticSendingRecord.vue'
import EbayAutomaticReplyRcord from '../views/HomePage/InfoRecord/Ebay/EbayAutomaticReplyRcord'
import AutomaticAssessmentRecord from '../views/HomePage/InfoRecord/Ebay/AutomaticAssessmentRecord'

//========================== ebay售后单管理 =============================
import EbayAfterSalesOrderManagement from '../views/HomePage/AfterSalesManagement/Ebay/AfterSalesOrderManagement.vue'
import EbayRegisteredPaymentList from '../views/HomePage/AfterSalesManagement/Ebay/RegisteredPaymentList.vue'
import EbayReceiptRequestList from '../views/HomePage/AfterSalesManagement/Ebay/ReceiptRequestList.vue'
import EbayCustomerComplaintList from '../views/HomePage/AfterSalesManagement/Ebay/CustomerComplaintList.vue'

//========================== 账号管理 =============================
import DataPermission from '../views/HomePage/AccountManagement/DataPermission.vue'
import TaskPermission from '../views/HomePage/AccountManagement/TaskPermission.vue'

Vue.use(Router);

const router =  new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Layout,
            redirect: '/staging',
            children: [
                {
                    path: '/staging',
                    name: '首页',
                    component: staging
                },
                {
                    path: '/notAuthority',
                    name: '无权限界面',
                    component: NotAuthority
                },
                // 邮件中心
                {
                    path: '/PostMail',
                    name: '发邮件',
                    component: PostMail
                },
                {
                    path: '/Inbox',
                    name: '收件箱',
                    component: Inbox
                },
                {
                    path: '/DraftBox',
                    name: '草稿箱',
                    component: DraftBox
                },
                {
                    path: '/Outbox',
                    name: '发件箱',
                    component: Outbox
                },
                {
                    path: '/RecycleBin',
                    name: '回收站',
                    component: RecycleBin
                },
                // Ebay邮件中心
                {
                    path: '/EbayPostMail',
                    name: '发邮件',
                    component: EbayPostMail
                },
                {
                    path: '/EbayInbox',
                    name: '收件箱',
                    component: EbayInbox
                },
                {
                    path: '/EbayDraftBox',
                    name: '草稿箱',
                    component: EbayDraftBox
                },
                {
                    path: '/EbayOutbox',
                    name: '发件箱',
                    component: EbayOutbox
                },
                // 邮件处理
                {
                    path: '/MailProcessing_0',
                    name: '邮件处理0',
                    component: MailProcessing_0
                },
                {
                    path: '/MailProcessing_1',
                    name: '邮件处理1',
                    component: MailProcessing_1
                },
                {
                    path: '/MailProcessing_2',
                    name: '邮件处理2',
                    component: MailProcessing_2
                },
                {
                    path: '/MailProcessing_3',
                    name: '邮件处理3',
                    component: MailProcessing_3
                },
                {
                    path: '/MailProcessing_4',
                    name: '邮件处理4',
                    component: MailProcessing_4
                },
                {
                    path: '/MailProcessing_5',
                    name: '邮件处理5',
                    component: MailProcessing_5
                },
                {
                    path: '/MailProcessing_6',
                    name: '邮件处理6',
                    component: MailProcessing_6
                },
                {
                    path: '/MailProcessing_7',
                    name: '邮件处理7',
                    component: MailProcessing_7
                },
                {
                    path: '/MailProcessing_8',
                    name: '邮件处理8',
                    component: MailProcessing_8
                },
                {
                    path: '/MailProcessing_9',
                    name: '邮件处理9',
                    component: MailProcessing_9
                },
                // 纠纷处理
                {
                    path: '/MailProcessing_10',
                    name: '纠纷处理0',
                    component: MailProcessing_10
                },
                {
                    path: '/MailProcessing_11',
                    name: '纠纷处理1',
                    component: MailProcessing_11
                },
                {
                    path: '/MailProcessing_12',
                    name: '纠纷处理2',
                    component: MailProcessing_12
                },
                {
                    path: '/MailProcessing_13',
                    name: '纠纷处理3',
                    component: MailProcessing_13
                },
                {
                    path: '/MailProcessing_14',
                    name: '纠纷处理4',
                    component: MailProcessing_14
                },
                {
                    path: '/MailProcessing_15',
                    name: '纠纷处理5',
                    component: MailProcessing_15
                },
                {
                    path: '/MailProcessing_16',
                    name: '纠纷处理6',
                    component: MailProcessing_16
                },
                {
                    path: '/MailProcessing_17',
                    name: '纠纷处理7',
                    component: MailProcessing_17
                },
                {
                    path: '/MailProcessing_18',
                    name: '纠纷处理8',
                    component: MailProcessing_18
                },
                {
                    path: '/MailProcessing_19',
                    name: '纠纷处理9',
                    component: MailProcessing_19
                },
                // 消息处理
                {
                    path: '/MailProcessing_20',
                    name: '消息处理0',
                    component: MailProcessing_20
                },
                {
                    path: '/MailProcessing_21',
                    name: '消息处理1',
                    component: MailProcessing_21
                },
                {
                    path: '/MailProcessing_22',
                    name: '消息处理2',
                    component: MailProcessing_22
                },
                {
                    path: '/MailProcessing_23',
                    name: '消息处理3',
                    component: MailProcessing_23
                },
                {
                    path: '/MailProcessing_24',
                    name: '消息处理4',
                    component: MailProcessing_24
                },
                {
                    path: '/MailProcessing_25',
                    name: '消息处理5',
                    component: MailProcessing_25
                },
                {
                    path: '/MailProcessing_26',
                    name: '消息处理6',
                    component: MailProcessing_26
                },
                {
                    path: '/MailProcessing_27',
                    name: '消息处理7',
                    component: MailProcessing_27
                },
                {
                    path: '/MailProcessing_28',
                    name: '消息处理8',
                    component: MailProcessing_28
                },
                {
                    path: '/MailProcessing_29',
                    name: '消息处理9',
                    component: MailProcessing_29
                },
                // Ebay-会员消息处理
                {
                    path: '/MailProcessing_30',
                    name: 'Ebay-会员消息处理0',
                    component: MailProcessing_30
                },
                {
                    path: '/MailProcessing_31',
                    name: 'Ebay-会员消息处理1',
                    component: MailProcessing_31
                },
                {
                    path: '/MailProcessing_32',
                    name: 'Ebay-会员消息处理2',
                    component: MailProcessing_32
                },
                {
                    path: '/MailProcessing_33',
                    name: 'Ebay-会员消息处理3',
                    component: MailProcessing_33
                },
                {
                    path: '/MailProcessing_34',
                    name: 'Ebay-会员消息处理4',
                    component: MailProcessing_34
                },
                {
                    path: '/MailProcessing_35',
                    name: 'Ebay-会员消息处理5',
                    component: MailProcessing_35
                },
                {
                    path: '/MailProcessing_36',
                    name: 'Ebay-会员消息处理6',
                    component: MailProcessing_36
                },
                {
                    path: '/MailProcessing_37',
                    name: 'Ebay-会员消息处理7',
                    component: MailProcessing_37
                },
                {
                    path: '/MailProcessing_38',
                    name: 'Ebay-会员消息处理8',
                    component: MailProcessing_38
                },
                {
                    path: '/MailProcessing_39',
                    name: 'Ebay-会员消息处理9',
                    component: MailProcessing_39
                },
                // Ebay-ebay消息处理
                {
                    path: '/MailProcessing_40',
                    name: 'Ebay-ebay消息处理0',
                    component: MailProcessing_40
                },
                {
                    path: '/MailProcessing_41',
                    name: 'Ebay-ebay消息处理1',
                    component: MailProcessing_41
                },
                {
                    path: '/MailProcessing_42',
                    name: 'Ebay-ebay消息处理2',
                    component: MailProcessing_42
                },
                {
                    path: '/MailProcessing_43',
                    name: 'Ebay-ebay消息处理3',
                    component: MailProcessing_43
                },
                {
                    path: '/MailProcessing_44',
                    name: 'Ebay-ebay消息处理4',
                    component: MailProcessing_44
                },
                {
                    path: '/MailProcessing_45',
                    name: 'Ebay-ebay消息处理5',
                    component: MailProcessing_45
                },
                {
                    path: '/MailProcessing_46',
                    name: 'Ebay-ebay消息处理6',
                    component: MailProcessing_46
                },
                {
                    path: '/MailProcessing_47',
                    name: 'Ebay-ebay消息处理7',
                    component: MailProcessing_47
                },
                {
                    path: '/MailProcessing_48',
                    name: 'Ebay-ebay消息处理8',
                    component: MailProcessing_48
                },
                {
                    path: '/MailProcessing_49',
                    name: 'Ebay-ebay消息处理9',
                    component: MailProcessing_49
                },
                // Ebay-ebay邮件处理
                {
                    path: '/MailProcessing_50',
                    name: 'Ebay-ebay邮件处理0',
                    component: MailProcessing_50
                },
                {
                    path: '/MailProcessing_51',
                    name: 'Ebay-ebay邮件处理1',
                    component: MailProcessing_51
                },
                {
                    path: '/MailProcessing_52',
                    name: 'Ebay-ebay邮件处理2',
                    component: MailProcessing_52
                },
                {
                    path: '/MailProcessing_53',
                    name: 'Ebay-ebay邮件处理3',
                    component: MailProcessing_53
                },
                {
                    path: '/MailProcessing_54',
                    name: 'Ebay-ebay邮件处理4',
                    component: MailProcessing_54
                },
                {
                    path: '/MailProcessing_55',
                    name: 'Ebay-ebay邮件处理5',
                    component: MailProcessing_55
                },
                {
                    path: '/MailProcessing_56',
                    name: 'Ebay-ebay邮件处理6',
                    component: MailProcessing_56
                },
                {
                    path: '/MailProcessing_57',
                    name: 'Ebay-ebay邮件处理7',
                    component: MailProcessing_57
                },
                {
                    path: '/MailProcessing_58',
                    name: 'Ebay-ebay邮件处理8',
                    component: MailProcessing_58
                },
                {
                    path: '/MailProcessing_59',
                    name: 'Ebay-ebay邮件处理9',
                    component: MailProcessing_59
                },
                // 消息中心
                {
                    path: '/MessageCenter',
                    name: '消息中心',
                    component: MessageCenter
                },
                // 纠纷中心
                {
                    path: '/DisputeCenter',
                    name: '纠纷中心',
                    component: DisputeCenter
                },

                {
                    path: '/JurisdictionManagement',
                    name: '用户权限管理',
                    component: JurisdictionManagement
                },
                {
                    path: '/MailManagement',
                    name: '邮箱管理',
                    component: MailManagement
                },
                {
                    path: '/OrderListManagement',
                    name: '订单管理',
                    component: OrderListManagement,
                },
                {
                    path: '/AmazonDomesticRefund',
                    name: 'AM-国内退件',
                    component: AmazonDomesticRefund,
                },
                {
                    path: '/AmazonOverseasRefund',
                    name: 'AM-海外退件',
                    component: AmazonOverseasRefund,
                },
                // {
                //     path: '/OrderInformation',
                //     name: '订单信息',
                //     component: OrderInformation
                // },
                // 客户评价
                {
                    path: '/CustomerEvaluationReview',
                    name: '客户评价Review',
                    component: CustomerEvaluationReview
                },
                {
                    path: '/CustomerReviewsFeedBack',
                    name: '客户评价FeedBack',
                    component: CustomerReviewsFeedBack
                },
                // 系统配置
                {
                    path: '/LabelConfiguration',
                    name: '标签配置',
                    component: LabelConfiguration
                },
                {
                    path: '/EmailClassifyConfiguration',
                    name: '邮件分类配置',
                    component: EmailClassifyConfiguration
                },
                {
                    path: '/AutomationSendRule',
                    name: '自动发信规则',
                    component: AutomationSendRule
                },
                {
                    path: '/AutomationReplyRule',
                    name: '自动回复规则',
                    component: AutomationReplyRule
                },
                {
                    path: '/AutomationAfterSaleRule',
                    name: '自动售后单规则',
                    component: AutomationAfterSaleRule
                },
                //AM信息记录
                {
                    path: '/AutomationMessage',
                    name: '自动信息记录',
                    component: AutomationMessage
                },
                {
                    path: '/AmazonAutomaticReplyRcord',
                    name: '自动回复记录',
                    component: AmazonAutomaticReplyRcord
                },

                {
                    path: '/TemplateConfiguration',
                    name: '模板配置',
                    component: TemplateConfiguration
                },
                {
                    path: '/TemplateClassificationConfiguration',
                    name: '模板分类配置',
                    component: TemplateClassificationConfiguration
                },
                {
                    path: '/BasicDataConfiguration',
                    name: '基础数据配置',
                    component: BasicDataConfiguration
                },
                {
                    path: '/InvoiceInfoConfiguration',
                    name: '发票信息配置',
                    component: InvoiceInfoConfiguration
                },
                {
                    path: '/AutomaticReviewRules',
                    name: '自动留评规则',
                    component: AutomaticReviewRules
                },
                // {
                //     path: '/EmailClassify_add_edit',
                //     name: '新增编辑',
                //     component: EmailClassifyAddEdit
                // },
                // 售后管理
                {
                    path: '/AfterSalesOrderManagement',
                    name: '售后单管理',
                    component: AfterSalesOrderManagement
                },
                {
                    path: '/RegisteredPaymentList',
                    name: '登记收款列表',
                    component: RegisteredPaymentList
                },
                {
                    path: '/ReceiptRequestList',
                    name: '收款请求列表',
                    component: ReceiptRequestList
                },
                {
                    path: '/CustomerComplaintList',
                    name: '客诉列表',
                    component: CustomerComplaintList
                },
                //========================== ebay =============================
                {
                    path: '/EbayMessage',
                    name: '消息',
                    component: EbayMessage
                },
                {
                    path: '/EbayCancel',
                    name: 'Cancel',
                    component: EbayCancel
                },
                {
                    path: '/EbayINR',
                    name: 'INR',
                    component: EbayINR
                },
                {
                    path: '/EbayReturn',
                    name: 'Return',
                    component: EbayReturn
                },
                {
                    path: '/EbayEvaluateFeedBack',
                    name: '评价FeedBack',
                    component: EbayEvaluateFeedBack
                },
                {
                    path: '/EbayUpgradeRefundRules',
                    name: '升级退款规则',
                    component: EbayUpgradeRefundRules
                },
                {
                    path: '/EbayMessageFilter',
                    name: 'Ebay消息过滤',
                    component: EbayMessageFilter
                },
                {
                    path: '/EbayDisputeRefundResult',
                    name: 'Ebay纠纷退款结果',
                    component: EbayDisputeRefundResult
                },
                //========================== ebay订单管理 =============================
                {
                    path: '/EbayOrderListManagement',
                    name: 'Ebay订单管理',
                    component: EbayOrderListManagement
                },
                {
                    path: '/CancelOrderResult',
                    name: 'Ebay取消订单结果',
                    component: CancelOrderResult
                },
                {
                    path: '/EbayDomesticRefund',
                    name: 'Ebay国内退件',
                    component: EbayDomesticRefund
                },
                {
                    path: '/EbayOverseasRefund',
                    name: 'Ebay海外退件',
                    component: EbayOverseasRefund
                },
                //========================== ebay信息记录 =============================
                {
                    path: '/EbaySendMessageRecord',
                    name: 'Ebay发送信息记录',
                    component: EbaySendMessageRecord
                },
                {
                    path: '/AutomaticSendingRecord',
                    name: 'Ebay自动发信记录',
                    component: AutomaticSendingRecord
                },
                {
                    path: '/EbayAutomaticReplyRcord',
                    name: 'Ebay自动回复记录',
                    component: EbayAutomaticReplyRcord
                },
                {
                    path: '/AutomaticAssessmentRecord',
                    name: 'Ebay自动留评记录',
                    component: AutomaticAssessmentRecord
                },
                //========================== ebay售后单管理 =============================
                {
                    path: '/EbayAfterSalesOrderManagement',
                    name: 'Ebay售后单列表',
                    component: EbayAfterSalesOrderManagement
                },
                {
                    path: '/EbayRegisteredPaymentList',
                    name: 'Ebay登记收款列表',
                    component: EbayRegisteredPaymentList
                },
                {
                    path: '/EbayReceiptRequestList',
                    name: 'Ebay收款请求列表',
                    component: EbayReceiptRequestList
                },
                {
                    path: '/EbayCustomerComplaintList',
                    name: 'Eay客诉列表',
                    component: EbayCustomerComplaintList
                },
                //========================== 账号管理 =============================
                {
                    path: '/DataPermission',
                    name: '数据权限',
                    component: DataPermission
                },
                {
                    path: '/TaskPermission',
                    name: '任务权限',
                    component: TaskPermission
                },
            ]
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
});

let isFirstRequset = false;

router.beforeEach((to, from, next) => {
    const path = to.path.replace(/\/$/, '');
    const isLogin = JSON.stringify(Store.getters.loginInfo) !== '{}';
    // 获取当前地址参数
    const queryParams = getAddressModelParams();
    // 判断是否第一次进入
    if (!isLogin && !isFirstRequset) {
        // 如果没有登录信息的话在这里调下初始化接口，查询登录信息后保存
        return new Promise(resolve => {
            getUserInfo({
                access_token: queryParams['access_token']
            }).then(({ data }) => {
                if (process.env.NODE_ENV == 'production') {
                    CONFIG.HOME_PATH = data.data.path;
                }
                Store.commit('SAVE_LOGIN_INFO', data.data);
                Store.commit('SAVE_PERMIT_PATH_INFO', data.data.permissions);
                Store.commit('SAVE_PERMIT_RESOURCE_INFO', data.data.permissions);
                resolve(1)
            });
        }).then(( data ) => {
            isFirstRequset = true;
            if (data) {
                let firstInx = '1';
                // 保存到多页签
                Store.commit('SAVE_TAB_LABELS', {
                    path: '/staging',
                    name: '首页',
                    index: firstInx
                });
                // 激活菜单
                Store.commit('SAVE_NAV_INDEX', firstInx)

                next({
                    path: '/staging'
                });
            }
        });
    } else if (isLogin) {
        if (path === '/staging') {
            next();
            return;
        };
        let isAuthority = Store.getters.permitPath;
        if (isAuthority.indexOf(path) === -1 && path !== '/notAuthority') {
            return next({
                path: '/notAuthority'
            })
        }
        next()
    } else {
        next();
    }
});

router.afterEach((to, from) => {
    Store.commit('SAVE_BUTTON_CONFIG', to.path);
});

export default router;



