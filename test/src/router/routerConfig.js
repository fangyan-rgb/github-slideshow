import Store from '@/store';

const config = {
    navList:[
        {
            name: '首页',
            path: '/staging',
            icon: 'icon-shouye'
        },
        {
            name: '邮件中心',
            path: '/',
            icon: 'icon-youjianzhongxin',
            children: [
                {
                    name: 'Amazon',
                    path: '/',
                    children: [
                        {
                            name: 'AM-发邮件',
                            path: '/PostMail',
                            icon: 'icon-shouyeguanli',
                        },
                        {
                            name: 'AM-收件箱',
                            path: '/Inbox',
                            icon: 'icon-shouyeguanli',
                        },
                        {
                            name: 'AM-草稿箱',
                            path: '/DraftBox',
                            icon: 'icon-shouyeguanli',
                        },
                        {
                            name: 'AM-发件箱',
                            path: '/Outbox',
                            icon: 'icon-shouyeguanli',
                        },
                        {
                            name: 'AM-回收站',
                            path: '/RecycleBin',
                            icon: 'icon-shouyeguanli'
                        },
                    ]
                },
                {
                    name: 'Ebay',
                    path: '/',
                    children: [
                        {
                            name: 'Ebay-发邮件',
                            path: '/EbayPostMail',
                            icon: 'icon-shouyeguanli',
                        },
                        {
                            name: 'Ebay-收件箱',
                            path: '/EbayInbox',
                            icon: 'icon-shouyeguanli',
                        },
                        {
                            name: 'Ebay-草稿箱',
                            path: '/EbayDraftBox',
                            icon: 'icon-shouyeguanli',
                        },
                        {
                            name: 'Ebay-发件箱',
                            path: '/EbayOutbox',
                            icon: 'icon-shouyeguanli',
                        },
                    ]
                },
            ]
        },
        {
            name: 'Amazon',
            path: '',
            icon: 'icon-yamaxun1',
            children: [
                {
                    name: 'AM-消息',
                    path: '/MessageCenter',
                    icon: 'icon-shouyeguanli',
                },
                {
                    name: 'AM-纠纷',
                    path: '/DisputeCenter',
                    icon: 'icon-shouyeguanli',
                },
                {
                    name: 'AM-评价Review',
                    path: '/CustomerEvaluationReview',
                    icon: 'icon-shouyeguanli'
                },
                {
                    name: 'AM-评价FeedBack',
                    path: '/CustomerReviewsFeedBack',
                    icon: 'icon-shouyeguanli'
                },
            ]
        },
        //========================== Ebay模块 =============================
        {
            name: 'Ebay',
            path: '',
            icon: 'icon-ebay2',
            children: [
                {
                    name: 'Ebay-消息',
                    path: '/EbayMessage',
                    icon: 'icon-shouyeguanli',
                },
                {
                    name: 'Ebay-Cancel',
                    path: '/EbayCancel',
                    icon: 'icon-shouyeguanli',
                },
                {
                    name: 'Ebay-INR',
                    path: '/EbayINR',
                    icon: 'icon-shouyeguanli'
                },
                {
                    name: 'Ebay-Return',
                    path: '/EbayReturn',
                    icon: 'icon-shouyeguanli'
                },
                {
                    name: 'Ebay-评价FeedBack',
                    path: '/EbayEvaluateFeedBack',
                    icon: 'icon-shouyeguanli',
                },
                {
                    name: 'Ebay-升级退款规则',
                    path: '/EbayUpgradeRefundRules',
                    icon: 'icon-shouyeguanli'
                },
                {
                    name: 'Ebay-消息规则',
                    path: '/EbayMessageFilter',
                    icon: 'icon-shouyeguanli'
                },
                {
                    name: 'Ebay-纠纷退款结果',
                    path: '/EbayDisputeRefundResult',
                    icon: 'icon-shouyeguanli'
                },
            ]
        },
        {
            name: '订单中心',
            path: '/',
            icon: 'icon-dingdanxinxi',
            children: [
                //========================== Amazon订单管理 =============================
                {
                    name: 'Amazon',
                    path: '/',
                    children: [
                        {
                            name: 'AM-订单列表',
                            path: '/OrderListManagement',
                            icon: 'icon-chanpinguanli',
                        },
                        // {
                        //     name: 'AM-国内退件',
                        //     path: '/AmazonDomesticRefund',
                        //     icon: 'icon-chanpinguanli',
                        // },
                        // {
                        //     name: 'AM-海外退件',
                        //     path: '/AmazonOverseasRefund',
                        //     icon: 'icon-chanpinguanli',
                        // },
                    ]

                },
                //========================== ebay订单管理 =============================
                {
                    name: 'Ebay',
                    path: '/',
                    children: [
                        {
                            name: 'Ebay-订单列表',
                            path: '/EbayOrderListManagement',
                            icon: 'icon-chanpinguanli',
                        },
                        // {
                        //     name: 'Ebay-国内退件',
                        //     path: '/EbayDomesticRefund',
                        //     icon: 'icon-chanpinguanli',
                        // },
                        // {
                        //     name: 'Ebay-海外退件',
                        //     path: '/EbayOverseasRefund',
                        //     icon: 'icon-chanpinguanli',
                        // },
                        {
                            name: 'Ebay-取消订单结果',
                            path: '/CancelOrderResult',
                            icon: 'icon-chanpinguanli',
                        },
                    ]

                },
            ]
        },
        {
            name: '信息记录',
            path: '/',
            icon: 'icon-xinxijilu',
            children: [
                //========================== Amazon信息记录 =============================
                {
                    name: 'Amazon',
                    path: '/',
                    children: [
                        {
                            name: 'AM-自动发信记录',
                            path: '/AutomationMessage',
                            icon: 'icon-chanpinguanli',
                        },
                        {
                            name: 'AM-自动回复记录',
                            path: '/AmazonAutomaticReplyRcord',
                            icon: 'icon-chanpinguanli',
                        },
                    ]
                },
                //========================== Ebay信息记录 =============================
                {
                    name: 'Ebay',
                    path: '/',
                    children: [
                        {
                            name: 'Ebay-发送消息记录',
                            path: '/EbaySendMessageRecord',
                            icon: 'icon-chanpinguanli',
                        },
                        {
                            name: 'Ebay-自动发信记录',
                            path: '/AutomaticSendingRecord',
                            icon: 'icon-chanpinguanli',
                        },
                        {
                            name: 'Ebay-自动回复记录',
                            path: '/EbayAutomaticReplyRcord',
                            icon: 'icon-chanpinguanli',
                        },
                        {
                            name: 'Ebay-自动留评记录',
                            path: '/AutomaticAssessmentRecord',
                            icon: 'icon-chanpinguanli',
                        },
                    ]
                },
            ]
        },
        {
            name: '系统配置',
            path: '',
            icon: 'icon-xitongpeizhi',
            children: [
                {
                    name: '标签配置',
                    path: '/LabelConfiguration',
                },
                // {
                //     name: '邮件分类配置',
                //     path: '/EmailClassifyConfiguration',
                //     isHiddenChild: true,
                //     children: [
                //         {
                //             name: '新增编辑',
                //             path: '/EmailClassify_add_edit',
                //             icon: 'icon-shouyeguanli',
                //         },
                //     ]
                // },
                {
                    name: '邮件分类配置',
                    path: '/EmailClassifyConfiguration',
                },
                {
                    name: '自动发信规则',
                    path: '/AutomationSendRule',
                },
                {
                    name: '自动回复规则',
                    path: '/AutomationReplyRule',
                },
                {
                    name: '自动售后单规则',
                    path: '/AutomationAfterSaleRule',
                },
                {
                    name: '模板配置',
                    path: '/TemplateConfiguration',
                },
                {
                    name: '模板分类配置',
                    path: '/TemplateClassificationConfiguration',
                },
                {
                    name: '基础数据配置',
                    path: '/BasicDataConfiguration',
                },
                {
                    name: '发票信息配置',
                    path: '/InvoiceInfoConfiguration',
                },
                {
                    name: '自动留评规则',
                    path: '/AutomaticReviewRules',
                },
            ]
        },
        {
            name: '账号管理',
            path: '/',
            icon: 'icon-zhanghaoguanli',
            children: [
                {
                    name: '邮箱管理',
                    path: '/MailManagement',
                    icon: 'icon-chanpinguanli'
                },
                {
                    name: '用户权限管理',
                    path: '/JurisdictionManagement',
                    icon: 'icon-chanpinguanli'
                },
                {
                    name: '数据权限',
                    path: '/DataPermission',
                    icon: 'icon-chanpinguanli'
                },
                {
                    name: '任务权限',
                    path: '/TaskPermission',
                    icon: 'icon-chanpinguanli'
                },
            ]
        },
        {
            name: '售后管理',
            path: '',
            icon: 'icon-shouhouguanli',
            children: [
                //========================== Amazon售后单管理 =============================
                {
                    name: 'Amazon',
                    path: '/',
                    icon: '',
                    children: [
                        {
                            name: 'AM-售后单列表',
                            path: '/AfterSalesOrderManagement',
                            icon: 'icon-shouyeguanli'
                        },
                        {
                            name: 'AM-登记收款列表',
                            path: '/RegisteredPaymentList',
                            icon: 'icon-shouyeguanli'
                        },
                        {
                            name: 'AM-收款请求列表',
                            path: '/ReceiptRequestList',
                            icon: 'icon-shouyeguanli'
                        },
                        {
                            name: 'AM-客诉列表',
                            path: '/CustomerComplaintList',
                            icon: 'icon-shouyeguanli'
                        },
                    ]
                },
                //========================== Ebay售后单管理  =============================
                {
                    name: 'Ebay',
                    path: '/',
                    icon: '',
                    children: [
                        {
                            name: 'Ebay-售后单列表',
                            path: '/EbayAfterSalesOrderManagement',
                            icon: 'icon-shouyeguanli'
                        },
                        {
                            name: 'Ebay-登记收款列表',
                            path: '/EbayRegisteredPaymentList',
                            icon: 'icon-shouyeguanli'
                        },
                        {
                            name: 'Ebay-收款请求列表',
                            path: '/EbayReceiptRequestList',
                            icon: 'icon-shouyeguanli'
                        },
                        {
                            name: 'Ebay-客诉列表',
                            path: '/EbayCustomerComplaintList',
                            icon: 'icon-shouyeguanli'
                        },
                    ]
                }
            ]
        },
    ]
};

const configFn = {
    config,
    navJumpFn(inx) {
        const configNav = this.getRouteConfig();
        let inxArr = inx.split('-');
        let to = {};
        switch (inxArr.length) {
            case 1:
                to = configNav[inxArr[0] - 1];
                break;
            case 2:
                to = configNav[inxArr[0] - 1].children[inxArr[1] - 1];
                break;
            case 3:
                to = configNav[inxArr[0] - 1].children[inxArr[1] - 1].children[inxArr[2] - 1];
                break;
        }
        return to
    },

    getRouteIndex(path) {
        const configNav = this.getRouteConfig();
        let callBack = function(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].path === path) {
                    return {
                        isTrue: 1,
                        index: i + 1
                    }
                }

                if (arr[i].children && arr[i].children.length) {
                    let backInfo = callBack(arr[i].children);
                    if (backInfo && backInfo.isTrue) {
                        return {
                            isTrue: 1,
                            index: `${i + 1}-${backInfo.index}`
                        }
                    }
                }
            }
        };

        let backInfo = callBack(configNav);
        return backInfo && backInfo.isTrue && backInfo.index
    },
    // 获取菜单路由配置
    getRouteConfig() {
        try {
            const configNav = [ ...config.navList];
            const permit = Store.getters.permitPath;
            let callBack = (arr)=> {
                let itemList = []
                arr.forEach(item => {
                    if (item.children && item.children.length) {
                        if (callBack(item.children).length) {
                            item.children = callBack(item.children);
                            itemList.push(item)
                        }
                    } else if (permit.indexOf(item.path) > -1) {
                        itemList.push(item)
                    }
                });
                return itemList
            }
            return callBack(configNav)
        } catch (e) {
            console.log(e)
        }
    }
};

export default configFn;
