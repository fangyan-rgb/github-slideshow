import Store from '@/store'

const config = {

    // 售后单管理
    AfterSalesOrderManagement: {
        name: '',
        buttonList: {

            // 按钮名称(需跟权限中心资源一致)
            reviewPass: {
                name: '审核通过',
                value: 'reviewPass',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            reviewReject: {
                name: '审核驳回',
                value: 'reviewReject',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            tagRefund: {
                name: '标记退款',
                value: 'tagRefund',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            refundDownLoad: {
                name: '退款数据下载',
                value: 'refundDownLoad',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            returnDownLoad: {
                name: '退货数据下载',
                value: 'returnDownLoad',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            resendDownLoad: {
                name: '重寄数据下载',
                value: 'resendDownLoad',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            modifyInfo: {
                name: '批量修改信息',
                value: 'modifyInfo',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            review: {
                name: '审核',
                value: 'review',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            changeInfo: {
                name: '修改信息',
                value: 'changeInfo',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            badType: {
                name: '不良类型',
                value: 'badType',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
            badReasons: {
                name: '不良原因',
                value: 'badReasons',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AfterSalesOrderManagement && permitResource.AfterSalesOrderManagement[this.value];
                }
            },
        }
    },
    // 客诉列表
    CustomerComplaintList: {
        name: '',
        buttonList: {
            bacthConfirm: {
                name: '批量确认',
                value: 'bacthConfirm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            confirm: {
                name: '确认',
                value: 'confirm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            batchReject: {
                name: '批量驳回',
                value: 'batchReject',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            reject: {
                name: '驳回',
                value: 'reject',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            del: {
                name: '删除',
                value: 'del',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            toExamine: {
                name: '审核',
                value: 'toExamine',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            handle: {
                name: '处理',
                value: 'handle',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
            edit: {
                name: '修改',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerComplaintList && permitResource.CustomerComplaintList[this.value];
                }
            },
        }
    },
    // 登记收款列表
    RegisteredPaymentList: {
        name: '',
        buttonList: {
            bacthExport: {
                name: '导出',
                value: 'bacthExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.RegisteredPaymentList && permitResource.RegisteredPaymentList[this.value];
                }
            },
        }
    },
    // 客户评价Review
    CustomerEvaluationReview: {
        name: '',
        buttonList: {

            batchDeal: {
                name: '批量处理',
                value: 'batchDeal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
            copyBuyerMail: {
                name: '复制买家邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
            copyAsin: {
                name: '复制Asin',
                value: 'copyAsin',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
            copyOrderNum: {
                name: '复制订单号',
                value: 'copyOrderNum',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
            followUpStatus: {
                name: '跟进状态',
                value: 'followUpStatus',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
            badReviewReason: {
                name: '差评原因',
                value: 'badReviewReason',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
            deal: {
                name: '处理',
                value: 'deal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerEvaluationReview && permitResource.CustomerEvaluationReview[this.value];
                }
            },
        }
    },
    // 客户评价FeedBack
    CustomerReviewsFeedBack: {
        name: '',
        buttonList: {
            batchContactBuyer: {
                name: '批量联系买家',
                value: 'batchContactBuyer',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            copyBuyerMail: {
                name: '复制买家邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            copyOrderNum: {
                name: '复制订单号',
                value: 'copyOrderNum',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            followUpStatus: {
                name: '跟进状态',
                value: 'followUpStatus',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            badReviewReason: {
                name: '差评原因',
                value: 'badReviewReason',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            contactBuyer: {
                name: '联系买家',
                value: 'contactBuyer',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            reply: {
                name: '回复评论',
                value: 'reply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            tagRemoval: {
                name: '标记移除',
                value: 'tagRemoval',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
            export: {
                name: '导出',
                value: 'export',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CustomerReviewsFeedBack && permitResource.CustomerReviewsFeedBack[this.value];
                }
            },
        }
    },
    // 邮箱管理
    MailManagement: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MailManagement && permitResource.MailManagement[this.value];
                }
            },
            batchNewAdd: {
                name: '批量新增',
                value: 'batchNewAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MailManagement && permitResource.MailManagement[this.value];
                }
            },
            batchDelete: {
                name: '批量删除',
                value: 'batchDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MailManagement && permitResource.MailManagement[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MailManagement && permitResource.MailManagement[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MailManagement && permitResource.MailManagement[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MailManagement && permitResource.MailManagement[this.value];
                }
            },
        }
    },
    // 发票信息配置
    InvoiceInfoConfiguration: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.InvoiceInfoConfiguration && permitResource.InvoiceInfoConfiguration[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.InvoiceInfoConfiguration && permitResource.InvoiceInfoConfiguration[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.InvoiceInfoConfiguration && permitResource.InvoiceInfoConfiguration[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.InvoiceInfoConfiguration && permitResource.InvoiceInfoConfiguration[this.value];
                }
            },
        }
    },
    // 基础数据配置
    BasicDataConfiguration: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.BasicDataConfiguration && permitResource.BasicDataConfiguration[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.BasicDataConfiguration && permitResource.BasicDataConfiguration[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.BasicDataConfiguration && permitResource.BasicDataConfiguration[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.BasicDataConfiguration && permitResource.BasicDataConfiguration[this.value];
                }
            },
        }
    },
    // 模板分类配置
    TemplateClassificationConfiguration: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateClassificationConfiguration && permitResource.TemplateClassificationConfiguration[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateClassificationConfiguration && permitResource.TemplateClassificationConfiguration[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateClassificationConfiguration && permitResource.TemplateClassificationConfiguration[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateClassificationConfiguration && permitResource.TemplateClassificationConfiguration[this.value];
                }
            },
        }
    },
    // 模板配置
    TemplateConfiguration: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateConfiguration && permitResource.TemplateConfiguration[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateConfiguration && permitResource.TemplateConfiguration[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateConfiguration && permitResource.TemplateConfiguration[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TemplateConfiguration && permitResource.TemplateConfiguration[this.value];
                }
            },
        }
    },
    // 自动售后单规则
    AutomationAfterSaleRule: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationAfterSaleRule && permitResource.AutomationAfterSaleRule[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationAfterSaleRule && permitResource.AutomationAfterSaleRule[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationAfterSaleRule && permitResource.AutomationAfterSaleRule[this.value];
                }
            },
            batchDelete: {
                name: '批量删除',
                value: 'batchDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationAfterSaleRule && permitResource.AutomationAfterSaleRule[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationAfterSaleRule && permitResource.AutomationAfterSaleRule[this.value];
                }
            },
        }
    },
    // 自动回复规则
    AutomationReplyRule: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationReplyRule && permitResource.AutomationReplyRule[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationReplyRule && permitResource.AutomationReplyRule[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationReplyRule && permitResource.AutomationReplyRule[this.value];
                }
            },
            batchDelete: {
                name: '批量删除',
                value: 'batchDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationReplyRule && permitResource.AutomationReplyRule[this.value];
                }
            },
            stop: {
                name: '停用',
                value: 'stop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationReplyRule && permitResource.AutomationReplyRule[this.value];
                }
            },
            start: {
                name: '启用',
                value: 'start',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationReplyRule && permitResource.AutomationReplyRule[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationReplyRule && permitResource.AutomationReplyRule[this.value];
                }
            },
        }
    },
    // 自动发信规则
    AutomationSendRule: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationSendRule && permitResource.AutomationSendRule[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationSendRule && permitResource.AutomationSendRule[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationSendRule && permitResource.AutomationSendRule[this.value];
                }
            },
            batchDelete: {
                name: '批量删除',
                value: 'batchDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationSendRule && permitResource.AutomationSendRule[this.value];
                }
            },
            stop: {
                name: '停用',
                value: 'stop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationSendRule && permitResource.AutomationSendRule[this.value];
                }
            },
            start: {
                name: '启用',
                value: 'start',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationSendRule && permitResource.AutomationSendRule[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomationSendRule && permitResource.AutomationSendRule[this.value];
                }
            },
        }
    },
    // 邮件分类配置
    EmailClassifyConfiguration: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EmailClassifyConfiguration && permitResource.EmailClassifyConfiguration[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EmailClassifyConfiguration && permitResource.EmailClassifyConfiguration[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EmailClassifyConfiguration && permitResource.EmailClassifyConfiguration[this.value];
                }
            },
            batchDelete: {
                name: '批量删除',
                value: 'batchDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EmailClassifyConfiguration && permitResource.EmailClassifyConfiguration[this.value];
                }
            },
            stop: {
                name: '停用',
                value: 'stop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EmailClassifyConfiguration && permitResource.EmailClassifyConfiguration[this.value];
                }
            },
            start: {
                name: '启用',
                value: 'start',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EmailClassifyConfiguration && permitResource.EmailClassifyConfiguration[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EmailClassifyConfiguration && permitResource.EmailClassifyConfiguration[this.value];
                }
            },
        }
    },
    // 标签配置
    LabelConfiguration: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.LabelConfiguration && permitResource.LabelConfiguration[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.LabelConfiguration && permitResource.LabelConfiguration[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.LabelConfiguration && permitResource.LabelConfiguration[this.value];
                }
            },
            batchDelete: {
                name: '批量删除',
                value: 'batchDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.LabelConfiguration && permitResource.LabelConfiguration[this.value];
                }
            },
            stop: {
                name: '停用',
                value: 'stop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.LabelConfiguration && permitResource.LabelConfiguration[this.value];
                }
            },
            start: {
                name: '启用',
                value: 'start',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.LabelConfiguration && permitResource.LabelConfiguration[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.LabelConfiguration && permitResource.LabelConfiguration[this.value];
                }
            },
        }
    },
    //自动留评规则
    AutomaticReviewRules: {
        name: '',
        buttonList: {

            newAdd: {
                name: '新增',
                value: 'newAdd',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            batchDelete: {
                name: '批量删除',
                value: 'batchDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            batchStop: {
                name: '批量停用',
                value: 'batchStop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            batchStart: {
                name: '批量启用',
                value: 'batchStart',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            stop: {
                name: '停用',
                value: 'stop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            start: {
                name: '启用',
                value: 'start',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticReviewRules && permitResource.AutomaticReviewRules[this.value];
                }
            },
        }
    },
    // 订单列表
    OrderListManagement: {
        name: '',
        buttonList: {

            batchContactBuyers: {
                name: '批量联系买家',
                value: 'batchContactBuyers',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            batchObsolete: {
                name: '批量作废',
                value: 'batchObsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            batchHold: {
                name: '批量暂扣',
                    value: 'batchHold',
                    method: '',
                    type: 'text',
                    action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            batchCancelHold: {
                name: '批量取消暂扣',
                value: 'batchCancelHold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            batchRemark: {
                name: '批量备注',
                value: 'batchRemark',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            obsolete: {
                name: '作废',
                value: 'obsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            cancelObsolete: {
                name: '取消作废',
                value: 'cancelObsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            hold: {
                name: '暂扣',
                value: 'hold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            cancelHold: {
                name: '取消暂扣',
                value: 'cancelHold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            receiptRequest: {
                name: '收款请求',
                value: 'receiptRequest',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            registeredPayment: {
                name: '登记收款',
                value: 'registeredPayment',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            newSalesOrder: {
                name: '新建售后单',
                value: 'newSalesOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            registerRefundForm: {
                name: '登记退款单',
                value: 'registerRefundForm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            registerComplaintList: {
                name: '登记客诉单',
                value: 'registerComplaintList',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            contactBuyer: {
                name: '联系买家',
                value: 'contactBuyer',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            invoice: {
                name: '发票',
                value: 'invoice',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            invoiceB2B: {
                name: 'B2B发票',
                value: 'invoiceB2B',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            deal: {
                name: '处理',
                value: 'deal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
            CancelClosingOrder: {
                name: '取消合单',
                value: 'CancelClosingOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.OrderListManagement && permitResource.OrderListManagement[this.value];
                }
            },
        }
    },
    // 回收站
    RecycleBin: {
        name: '',
        buttonList: {

            batchRestore: {
                name: '批量恢复',
                value: 'batchRestore',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.RecycleBin && permitResource.RecycleBin[this.value];
                }
            },
            restore: {
                name: '恢复',
                value: 'restore',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.RecycleBin && permitResource.RecycleBin[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.RecycleBin && permitResource.RecycleBin[this.value];
                }
            },
        }
    },
    // 纠纷中心
    DisputeCenter: {
        name: '',
        buttonList: {
            deal: {
                name: '处理',
                value: 'deal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },

            batchDeal: {
                name: '批量处理',
                value: 'batchDeal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            batchClass: {
                name: '批量分类',
                value: 'batchClass',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            batchTag: {
                name: '批量标签',
                value: 'batchTag',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            starMail: {
                name: '标星邮件',
                value: 'starMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            tagRead: {
                name: '标记已读',
                value: 'tagRead',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            copyBuyerMail: {
                name: '复制买家邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            copySku: {
                name: '复制SKU',
                value: 'copySku',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            copyAsin: {
                name: '复制Asin',
                value: 'copyAsin',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            copyOrderNum: {
                name: '复制订单号',
                value: 'copyOrderNum',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            batchCustomerService: {
                name: '批量分配客服人员',
                value: 'batchCustomerService',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            appeal: {
                name: '申诉',
                value: 'appeal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
            export: {
                name: '导出',
                value: 'export',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DisputeCenter && permitResource.DisputeCenter[this.value];
                }
            },
        }
    },
    // 消息中心
    MessageCenter: {
        name: '',
        buttonList: {

            deal: {
                name: '处理',
                value: 'deal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },

            batchDeal: {
                name: '批量处理',
                value: 'batchDeal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            batchClass: {
                name: '批量分类',
                value: 'batchClass',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            batchTag: {
                name: '批量标签',
                value: 'batchTag',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            starMail: {
                name: '标星邮件',
                value: 'starMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            tagRead: {
                name: '标记已读',
                value: 'tagRead',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            tagReply: {
                name: '标记已回复',
                value: 'tagReply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            copyBuyerMail: {
                name: '复制买家邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            copySku: {
                name: '复制SKU',
                value: 'copySku',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            copyAsin: {
                name: '复制Asin',
                value: 'copyAsin',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            copyOrderNum: {
                name: '复制订单号',
                value: 'copyOrderNum',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            batchCustomerService: {
                name: '批量分配客服人员',
                value: 'batchCustomerService',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
            logExport: {
                name: '日志导出',
                value: 'logExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.MessageCenter && permitResource.MessageCenter[this.value];
                }
            },
        }
    },
    // 发件箱
    Outbox: {
        name: '',
        buttonList: {
            copyBuyerMail: {
                name: '复制买家邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
            copyOrderNum: {
                name: '复制订单号',
                value: 'copyOrderNum',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
            batchModify: {
                name: '批量修改',
                value: 'batchModify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
            forward: {
                name: '转发',
                value: 'forward',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
            modify: {
                name: '重发',
                value: 'modify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
            look: {
                name: '查看',
                value: 'look',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Outbox && permitResource.Outbox[this.value];
                }
            },
        }
    },
    // 草稿箱
    DraftBox: {
        name: '',
        buttonList: {
            lineSend: {
                name: '直接发送',
                value: 'lineSend',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
            copyBuyerMail: {
                name: '复制买家邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
            copyOrderNum: {
                name: '复制订单号',
                value: 'copyOrderNum',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
            batchModify: {
                name: '批量重发',
                value: 'batchModify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
            forward: {
                name: '转发',
                value: 'forward',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
            modify: {
                name: '修改',
                value: 'modify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
            send: {
                name: '发送',
                value: 'send',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DraftBox && permitResource.DraftBox[this.value];
                }
            },
        }
    },
    // 收件箱
    Inbox: {
        name: '',
        buttonList: {

            reply: {
                name: '回复',
                value: 'reply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },

            batchReply: {
                name: '批量回复',
                value: 'batchReply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            batchClass: {
                name: '批量分类',
                value: 'batchClass',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            batchTag: {
                name: '批量标签',
                value: 'batchTag',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            forward: {
                name: '转发',
                value: 'forward',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            mailDelete: {
                name: '邮件删除',
                value: 'mailDelete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            starMail: {
                name: '标星邮件',
                value: 'starMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            tagRead: {
                name: '标记已读',
                value: 'tagRead',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            tagReply: {
                name: '标记已回复',
                value: 'tagReply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            copyBuyerMail: {
                name: '复制买家邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            copySku: {
                name: '复制SKU',
                value: 'copySku',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            copyAsin: {
                name: '复制Asin',
                value: 'copyAsin',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            copyOrderNum: {
                name: '复制订单号',
                value: 'copyOrderNum',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
            batchCustomerService: {
                name: '批量分配客服人员',
                value: 'batchCustomerService',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.Inbox && permitResource.Inbox[this.value];
                }
            },
        }
    },

    /**  =========================> *|`| % Ebay % |`|*<======================== **/

    // Cancel
    EbayCancel: {
        name: '',
        buttonList: {
            batchAccept: {
                name: '批量接受',
                value: 'batchAccept',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCancel && permitResource.EbayCancel[this.value];
                }
            },
            copyItemID: {
                name: '批量复制Item ID',
                value: 'copyItemID',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCancel && permitResource.EbayCancel[this.value];
                }
            },
            copyAccount: {
                name: '批量复制账号',
                value: 'copyAccount',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCancel && permitResource.EbayCancel[this.value];
                }
            },
            dealWith: {
                name: '处理',
                value: 'dealWith',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCancel && permitResource.EbayCancel[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCancel && permitResource.EbayCancel[this.value];
                }
            },
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCancel && permitResource.EbayCancel[this.value];
                }
            },
            batchChangeCust: {
                name: '批量修改客服',
                value: 'batchChangeCust',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCancel && permitResource.EbayCancel[this.value];
                }
            },
        }
    },

    // Ebay消息过滤
    EbayMessageFilter: {
        name: '',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessageFilter && permitResource.EbayMessageFilter[this.value];
                }
            },
            batchDel: {
                name: '批量删除',
                value: 'batchDel',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessageFilter && permitResource.EbayMessageFilter[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessageFilter && permitResource.EbayMessageFilter[this.value];
                }
            },
            del: {
                name: '删除',
                value: 'del',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessageFilter && permitResource.EbayMessageFilter[this.value];
                }
            },
        }
    },

    // 评价FeedBack
    EbayEvaluateFeedBack: {
        name: '',
        buttonList: {
            batchEditKeep: {
                name: '批量修改跟进状态',
                value: 'batchEditKeep',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            copyItemID: {
                name: '批量复制Item ID',
                value: 'copyItemID',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            copyAccount: {
                name: '批量复制账号',
                value: 'copyAccount',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            replyComment: {
                name: '回复评论',
                value: 'replyComment',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            tagDealWith: {
                name: '标记处理',
                value: 'tagDealWith',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            messageLink: {
                name: '消息联系',
                value: 'messageLink',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            mailLink: {
                name: '邮件联系',
                value: 'mailLink',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
            batchChangeCust: {
                name: '批量修改客服',
                value: 'batchChangeCust',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayEvaluateFeedBack && permitResource.EbayEvaluateFeedBack[this.value];
                }
            },
        }
    },

    // Return
    EbayReturn: {
        name: '',
        buttonList: {
            copyItemID: {
                name: '批量复制Item ID',
                value: 'copyItemID',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReturn && permitResource.EbayReturn[this.value];
                }
            },
            copyAccount: {
                name: '批量复制账号',
                value: 'copyAccount',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReturn && permitResource.EbayReturn[this.value];
                }
            },
            dealWith: {
                name: '处理',
                value: 'dealWith',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReturn && permitResource.EbayReturn[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReturn && permitResource.EbayReturn[this.value];
                }
            },
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReturn && permitResource.EbayReturn[this.value];
                }
            },
            batchChangeCust: {
                name: '批量修改客服',
                value: 'batchChangeCust',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReturn && permitResource.EbayReturn[this.value];
                }
            },
        }
    },

    // 升级退款规则
    EbayUpgradeRefundRules: {
        name: '',
        buttonList: {
            defRule: {
                name: '默认规则',
                value: 'defRule',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayUpgradeRefundRules && permitResource.EbayUpgradeRefundRules[this.value];
                }
            },
            batchOpen: {
                name: '批量启用',
                value: 'batchOpen',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayUpgradeRefundRules && permitResource.EbayUpgradeRefundRules[this.value];
                }
            },
            batchStop: {
                name: '批量停用',
                value: 'batchStop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayUpgradeRefundRules && permitResource.EbayUpgradeRefundRules[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayUpgradeRefundRules && permitResource.EbayUpgradeRefundRules[this.value];
                }
            },
            open: {
                name: '启用',
                value: 'open',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayUpgradeRefundRules && permitResource.EbayUpgradeRefundRules[this.value];
                }
            },
            stop: {
                name: '停用',
                value: 'stop',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayUpgradeRefundRules && permitResource.EbayUpgradeRefundRules[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayUpgradeRefundRules && permitResource.EbayUpgradeRefundRules[this.value];
                }
            },
        }
    },

    // 售后单列表
    EbayAfterSalesOrderManagement: {
        name: '',
        buttonList: {
            batchPass: {
                name: '批量审核通过',
                value: 'batchPass',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            batchReject: {
                name: '批量审核驳回',
                value: 'batchReject',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            tagRefund: {
                name: '批量标记退款',
                value: 'tagRefund',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            refundDataDown: {
                name: '退款数据导出',
                value: 'refundDataDown',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            returnDataDown: {
                name: '退货数据导出',
                value: 'returnDataDown',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            resendDataDown: {
                name: '重寄数据导出',
                value: 'resendDataDown',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            changeInfo: {
                name: '修改信息',
                value: 'changeInfo',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            review: {
                name: '审核',
                value: 'review',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            del: {
                name: '删除',
                value: 'del',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            signRefund: {
                name: '标记退款',
                value: 'signRefund',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            badType: {
                name: '不良类型',
                value: 'badType',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
            badReasons: {
                name: '不良原因',
                value: 'badReasons',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayAfterSalesOrderManagement && permitResource.EbayAfterSalesOrderManagement[this.value];
                }
            },
        }
    },

    // 客诉列表
    EbayCustomerComplaintList: {
        name: '',
        buttonList: {
            batchConfirm: {
                name: '批量确认',
                value: 'batchConfirm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
            confirm: {
                name: '确认',
                value: 'confirm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
            batchReject: {
                name: '批量驳回',
                value: 'batchReject',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
            del: {
                name: '删除',
                value: 'del',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
            toExamine: {
                name: '审核',
                value: 'toExamine',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
            handle: {
                name: '处理',
                value: 'handle',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
            edit: {
                name: '修改',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayCustomerComplaintList && permitResource.EbayCustomerComplaintList[this.value];
                }
            },
        }
    },

    // 登记收款列表
    EbayRegisteredPaymentList: {
        name: '',
        buttonList: {
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayRegisteredPaymentList && permitResource.EbayRegisteredPaymentList[this.value];
                }
            },
            edit: {
                name: '编辑',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayRegisteredPaymentList && permitResource.EbayRegisteredPaymentList[this.value];
                }
            },
            del: {
                name: '删除',
                value: 'del',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayRegisteredPaymentList && permitResource.EbayRegisteredPaymentList[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayRegisteredPaymentList && permitResource.EbayRegisteredPaymentList[this.value];
                }
            },
        }
    },

    // INR
    EbayINR: {
        name: '',
        buttonList: {
            copyItemID: {
                name: '批量复制Item ID',
                value: 'copyItemID',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayINR && permitResource.EbayINR[this.value];
                }
            },
            copyAccount: {
                name: '批量复制账号',
                value: 'copyAccount',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayINR && permitResource.EbayINR[this.value];
                }
            },
            dealWith: {
                name: '处理',
                value: 'dealWith',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayINR && permitResource.EbayINR[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayINR && permitResource.EbayINR[this.value];
                }
            },
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayINR && permitResource.EbayINR[this.value];
                }
            },
            batchChangeCust: {
                name: '批量修改客服',
                value: 'batchChangeCust',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayINR && permitResource.EbayINR[this.value];
                }
            },
        }
    },

    // 消息
    EbayMessage: {
        name: '',
        buttonList: {
            batchReply: {
                name: '批量回复',
                value: 'batchReply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            batchTag: {
                name: '批量标签',
                value: 'batchTag',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            batchStar: {
                name: '批量标星',
                value: 'batchStar',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            batchTagReply: {
                name: '批量标记已回复',
                value: 'batchTagReply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            batchChangeCust: {
                name: '批量修改客服',
                value: 'batchChangeCust',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            copySKU: {
                name: '批量复制SKU',
                value: 'copySKU',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            copyItemID: {
                name: '批量复制item ID',
                value: 'copyItemID',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            copyAccount: {
                name: '批量复制账号',
                value: 'copyAccount',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            reply: {
                name: '回复',
                value: 'reply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayMessage && permitResource.EbayMessage[this.value];
                }
            },
        }
    },

    //数据权限
    DataPermission: {
        name: '',
        buttonList: {
            journal: {
                name: '日志',
                value: 'journal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DataPermission && permitResource.DataPermission[this.value];
                }
            },
            edit: {
                name: '修改',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.DataPermission && permitResource.DataPermission[this.value];
                }
            },
        }
    },

    //任务权限
    TaskPermission: {
        name: '',
        buttonList: {
            journal: {
                name: '日志',
                value: 'journal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TaskPermission && permitResource.TaskPermission[this.value];
                }
            },
            edit: {
                name: '修改',
                value: 'edit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TaskPermission && permitResource.TaskPermission[this.value];
                }
            },
            batchEdit: {
                name: '批量修改',
                value: 'batchEdit',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.TaskPermission && permitResource.TaskPermission[this.value];
                }
            },
        }
    },

    //ebay发送消息记录
    EbaySendMessageRecord: {
        name: '',
        buttonList: {
            journal: {
                name: '日志',
                value: 'journal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbaySendMessageRecord && permitResource.EbaySendMessageRecord[this.value];
                }
            },
            reSend: {
                name: '重发',
                value: 'reSend',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbaySendMessageRecord && permitResource.EbaySendMessageRecord[this.value];
                }
            },
            batchReSend: {
                name: '批量重发',
                value: 'batchReSend',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbaySendMessageRecord && permitResource.EbaySendMessageRecord[this.value];
                }
            },
            exportData: {
                name: '导出数据',
                value: 'exportData',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbaySendMessageRecord && permitResource.EbaySendMessageRecord[this.value];
                }
            },
        }
    },

    //ebay自动发信记录
    AutomaticSendingRecord: {
        name: '',
        buttonList: {
            export: {
                name: '导出数据',
                value: 'export',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticSendingRecord && permitResource.AutomaticSendingRecord[this.value];
                }
            },
            interceptSend: {
                name: '拦截发送',
                value: 'interceptSend',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticSendingRecord && permitResource.AutomaticSendingRecord[this.value];
                }
            },
        }
    },

    //订单列表
    EbayOrderListManagement: {
        name: '',
        buttonList: {
            batchObsolete: {
                name: '批量作废',
                value: 'batchObsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            batchHold: {
                name: '批量暂扣',
                    value: 'batchHold',
                    method: '',
                    type: 'text',
                    action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            batchCancelHold: {
                name: '批量取消暂扣',
                value: 'batchCancelHold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            batchRemark: {
                name: '批量备注',
                value: 'batchRemark',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            obsolete: {
                name: '作废',
                value: 'obsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            cancelObsolete: {
                name: '取消作废',
                value: 'cancelObsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            hold: {
                name: '暂扣',
                value: 'hold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            cancelHold: {
                name: '取消暂扣',
                value: 'cancelHold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            receiptRequest: {
                name: '收款请求',
                value: 'receiptRequest',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            registeredPayment: {
                name: '登记收款',
                value: 'registeredPayment',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            newSalesOrder: {
                name: '新建售后单',
                value: 'newSalesOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            registerRefundForm: {
                name: '登记退款单',
                value: 'registerRefundForm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            registerComplaintList: {
                name: '登记客诉单',
                value: 'registerComplaintList',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            messageContact: {
                name: '消息联系',
                value: 'messageContact',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            commentOn: {
                name: '留评',
                value: 'commentOn',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            invoice: {
                name: '发票',
                value: 'invoice',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            // invoiceB2B: {
            //     name: 'B2B发票',
            //     value: 'invoiceB2B',
            //     method: '',
            //     type: 'text',
            //     action: function (vm, fnName) {
            //         vm[fnName]();
            //     },
            //     permit () {
            //         const permitResource = {...Store.getters.permitResource}
            //         return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
            //     }
            // },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            deal: {
                name: '处理',
                value: 'deal',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
            
            CancelClosingOrder: {
                name: '取消合单',
                value: 'CancelClosingOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOrderListManagement && permitResource.EbayOrderListManagement[this.value];
                }
            },
        },
    },

    //取消订单结果
    CancelOrderResult: {
        name: '',
        buttonList: {
            refresh: {
                name: '刷新',
                value: 'refresh',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.CancelOrderResult && permitResource.CancelOrderResult[this.value];
                }
            },
        }
    },

    // Ebay收件箱
    EbayInbox: {
        name: '',
        buttonList: {
            reply: {
                name: '回复',
                value: 'reply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },

            batchReply: {
                name: '批量回复',
                value: 'batchReply',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            batchTag: {
                name: '批量标签',
                value: 'batchTag',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            starMail: {
                name: '批量标星邮件',
                value: 'starMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            tagRead: {
                name: '批量标记已读',
                value: 'tagRead',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            batchClass: {
                name: '批量分类',
                value: 'batchClass',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            copySenderMail: {
                name: '批量复制发件邮箱',
                value: 'copySenderMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            copyAccount: {
                name: '批量复制账号',
                value: 'copyAccount',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            batchCustomerService: {
                name: '批量分配客服',
                value: 'batchCustomerService',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
            dataExport: {
                name: '数据导出',
                value: 'dataExport',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayInbox && permitResource.EbayInbox[this.value];
                }
            },
        }
    },

    // Ebay草稿箱
    EbayDraftBox: {
        name: '',
        buttonList: {
            batchSend: {
                name: '批量发送',
                value: 'batchSend',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDraftBox && permitResource.EbayDraftBox[this.value];
                }
            },
            batchModify: {
                name: '批量修改',
                value: 'batchModify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDraftBox && permitResource.EbayDraftBox[this.value];
                }
            },
            copyBuyerMail: {
                name: '复制收件邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDraftBox && permitResource.EbayDraftBox[this.value];
                }
            },
            modify: {
                name: '修改',
                value: 'modify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDraftBox && permitResource.EbayDraftBox[this.value];
                }
            },
            send: {
                name: '直接发送',
                value: 'send',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDraftBox && permitResource.EbayDraftBox[this.value];
                }
            },
        }
    },

    // Ebay发件箱
    EbayOutbox: {
        name: '',
        buttonList: {
            batchModify: {
                name: '批量重发',
                value: 'batchModify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOutbox && permitResource.EbayOutbox[this.value];
                }
            },
            forward: {
                name: '批量转发',
                value: 'forward',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOutbox && permitResource.EbayOutbox[this.value];
                }
            },
            copyBuyerMail: {
                name: '批量复制收件邮箱',
                value: 'copyBuyerMail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOutbox && permitResource.EbayOutbox[this.value];
                }
            },
            modify: {
                name: '重发',
                value: 'modify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOutbox && permitResource.EbayOutbox[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOutbox && permitResource.EbayOutbox[this.value];
                }
            },
            look: {
                name: '查看',
                value: 'look',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOutbox && permitResource.EbayOutbox[this.value];
                }
            },
        }
    },

    // Ebay收款请求列表
    EbayReceiptRequestList: {
        name: '',
        buttonList: {
            batchCancelPay: {
                name: '批量取消收款',
                value: 'batchCancelPay',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReceiptRequestList && permitResource.EbayReceiptRequestList[this.value];
                }
            },
            cancelPay: {
                name: '取消收款',
                value: 'cancelPay',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayReceiptRequestList && permitResource.EbayReceiptRequestList[this.value];
                }
            },
        }
    },

    // Ebay国内退件
    EbayDomesticRefund: {
        name: '',
        buttonList: {
            temporarilyHandle: {
                name: '暂不处理',
                value: 'temporarilyHandle',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            editInfo: {
                name: '修改信息',
                value: 'editInfo',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            newSalesOrder: {
                name: '新建售后单',
                value: 'newSalesOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            registerRefundForm: {
                name: '登记退款单',
                value: 'registerRefundForm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            messageContact: {
                name: '消息联系',
                value: 'messageContact',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            reject: {
                name: '驳回',
                value: 'reject',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            hold: {
                name: '暂扣',
                value: 'hold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            cancelHold: {
                name: '取消暂扣',
                value: 'cancelHold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            obsolete: {
                name: '作废',
                value: 'obsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            cancelObsolete: {
                name: '取消作废',
                value: 'cancelObsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            supplement: {
                name: '补款',
                value: 'supplement',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayDomesticRefund && permitResource.EbayDomesticRefund[this.value];
                }
            },
        }
    },

    //AMAZON国内退件
    AmazonDomesticRefund: {
        name: '',
        buttonList: {
            temporarilyHandle: {
                name: '暂不处理',
                value: 'temporarilyHandle',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            editInfo: {
                name: '修改信息',
                value: 'editInfo',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            newSalesOrder: {
                name: '新建售后单',
                value: 'newSalesOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            registerRefundForm: {
                name: '登记退款单',
                value: 'registerRefundForm',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            messageContact: {
                name: '邮件联系',
                value: 'messageContact',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            reject: {
                name: '驳回',
                value: 'reject',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            hold: {
                name: '暂扣',
                value: 'hold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            cancelHold: {
                name: '取消暂扣',
                value: 'cancelHold',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            obsolete: {
                name: '作废',
                value: 'obsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            cancelObsolete: {
                name: '取消作废',
                value: 'cancelObsolete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            supplement: {
                name: '补款',
                value: 'supplement',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
        }
    },

    //Ebay海外退件
    EbayOverseasRefund: {
        name: '',
        buttonList: {
            newSalesOrder: {
                name: '新建售后单',
                value: 'newSalesOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOverseasRefund && permitResource.EbayOverseasRefund[this.value];
                }
            },
            messageContact: {
                name: '消息联系',
                value: 'messageContact',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.EbayOverseasRefund && permitResource.EbayOverseasRefund[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonDomesticRefund && permitResource.AmazonDomesticRefund[this.value];
                }
            },
        }
    },

    //AMAZON海外退件
    AmazonOverseasRefund: {
        name: '',
        buttonList: {
            newSalesOrder: {
                name: '新建售后单',
                value: 'newSalesOrder',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonOverseasRefund && permitResource.AmazonOverseasRefund[this.value];
                }
            },
            contactBuyer: {
                name: '联系买家',
                value: 'contactBuyer',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonOverseasRefund && permitResource.AmazonOverseasRefund[this.value];
                }
            },
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AmazonOverseasRefund && permitResource.AmazonOverseasRefund[this.value];
                }
            },
        }
    },
    //Ebay自动留评记录
    AutomaticAssessmentRecord: {
        name: '',
        buttonList: {
            diaryLog: {
                name: '日志',
                value: 'diaryLog',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    vm[fnName]();
                },
                permit () {
                    const permitResource = {...Store.getters.permitResource}
                    return permitResource.AutomaticAssessmentRecord && permitResource.AutomaticAssessmentRecord[this.value];
                }
            },
        }
    },
};
export default config;