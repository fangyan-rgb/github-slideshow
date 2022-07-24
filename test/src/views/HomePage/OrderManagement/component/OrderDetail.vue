<template>
<el-collapse v-model="activeNames">
    <div>
        <div>
                <el-collapse-item title="| 订单信息" name="orderInfo" id="orderInfoAnchor" class="headerInfoScrollTop" style="margin-top: 0;">
                    <div class="orderInformationMainInfo" v-loading="obtainOrderDetails.orderDetailsLoading">
                        <div  v-if="operationOrderSingle.orderInformationMainRight==24?false:true">
                            <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.orderDetailsInfo===''?true:false">暂无数据</div>
                            <div style="padding: 10px;" v-if="obtainOrderDetails.orderDetailsInfo.order_abnormity_reason&&obtainOrderDetails.orderDetailsInfo.order_abnormity_reason.length">
                                <div style="color:#FF1B1E;">异常：</div>
                                <div v-for="item in obtainOrderDetails.orderDetailsInfo.order_abnormity_reason">
                                    <span style="color:#FF1B1E;">{{item.abnormity_superclass_txt}}</span>
                                    <span style="color:#333;">{{item.reason}}</span>
                                    <span style="color:#67C23A;">{{item.signtitle}}</span>
                                </div>
                            </div>
                            <table cellspacing="0" cellpadding="0" v-if="obtainOrderDetails.orderDetailsInfo===''?false:true">
                                <tr>
                                    <td class="tdTitle">ERP订单号</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.acct_order_id"></td>
                                    <td class="tdTitle">合并后父订单</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.parent_order_id=='0'?'无':obtainOrderDetails.orderDetailsInfo.parent_order_id"></td>
                                    <td class="tdTitle">平台订单号</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.platform_order_id"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">销售平台</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">order_number</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">{{obtainOrderDetails.orderDetailsInfo.platform_code}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">{{obtainOrderDetails.orderDetailsInfo.order_number?obtainOrderDetails.orderDetailsInfo.order_number:"无"}}</div>
                                    </td>
                                    <td class="tdTitle">店铺名称</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.store_name"></td>
                                    <td class="tdTitle">站点</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.site"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">订单类型</td>
                                    <td class="tdContent">
                                        <div style="color:red;" v-if="obtainOrderDetails.orderDetailsInfo.orderType==='合并后的订单'
                                                            ||obtainOrderDetails.orderDetailsInfo.orderType==='拆分的主订单'||obtainOrderDetails.orderDetailsInfo.orderType==='被合并的订单'
                                                            ||obtainOrderDetails.orderDetailsInfo.orderType==='拆分后的子订单'">{{obtainOrderDetails.orderDetailsInfo.orderType}}</div>
                                        <div v-else>{{obtainOrderDetails.orderDetailsInfo.orderType}}</div>
                                    </td>
                                    <td class="tdTitle">订单状态</td>
                                    <td class="tdContent">
                                        <div style="color:red !important;" v-if="obtainOrderDetails.orderDetailsInfo.complete_status=='缺货'||obtainOrderDetails.orderDetailsInfo.complete_status=='异常'||
                                                    obtainOrderDetails.orderDetailsInfo.complete_status=='暂扣'||obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?true:false"
                                            >{{obtainOrderDetails.orderDetailsInfo.complete_status}}
                                        </div>
                                        <div style="color:green !important;" v-if="obtainOrderDetails.orderDetailsInfo.complete_status=='缺货'||obtainOrderDetails.orderDetailsInfo.complete_status=='异常'||
                                                    obtainOrderDetails.orderDetailsInfo.complete_status=='暂扣'||obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?false:true"
                                            >{{obtainOrderDetails.orderDetailsInfo.complete_status}}
                                        </div>
                                    </td>
                                    <td class="tdTitle">下单时间</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.created_time"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">付款时间</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.paytime"></td>
                                    <td class="tdTitle">发货时间</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.shipped_date"></td>
                                    <td class="tdTitle">发货仓库</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.warehouse_name"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">客户ID</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.buyer_id"></td>
                                    <td class="tdTitle">客户邮箱</td>
                                    <td class="tdContent">
                                        <div @click="handleContactBuyers" style="cursor: pointer;color: #409EFF;" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">{{obtainOrderDetails.orderDetailsInfo.email}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">{{obtainOrderDetails.orderDetailsInfo.email}}</div>
                                    </td>
                                    <td class="tdTitle">产品估重</td>
                                    <td class="tdContent">{{obtainOrderDetails.orderDetailsInfo.package_weight}}（g）</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">订单金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.orderDetailsInfo.total_price}} {{obtainOrderDetails.orderDetailsInfo.currency}}</td>
                                    <td class="tdTitle">是否同步</td>
                                    <td class="tdContent">{{obtainOrderDetails.orderDetailsInfo.is_upload}}</td>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">发货类型</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">销售平台</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">{{obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">{{obtainOrderDetails.orderDetailsInfo.platform_code}}</div>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                    <td class="tdTitle">来信记录</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.reply_status=='无邮件'?true:false">{{obtainOrderDetails.orderDetailsInfo.reply_status}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.reply_status=='无邮件'?false:true" style="cursor: pointer;" @click="handleMailProcessing(obtainOrderDetails.orderDetailsInfo)">{{obtainOrderDetails.orderDetailsInfo.reply_status}}</div>
                                    </td>
                                    <td class="tdTitle">纠纷</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_status=='无纠纷'?true:false">{{obtainOrderDetails.orderDetailsInfo.dispute_status}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_status=='无纠纷'?false:true" style="cursor: pointer;color: #409EFF;" @click="handleDisputeCenter(obtainOrderDetails.orderDetailsInfo.order_id)">{{obtainOrderDetails.orderDetailsInfo.dispute_status}}</div>
                                    </td>
                                    <td class="tdTitle">FeedBack</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.feedback_status=='无评价'?true:false">{{obtainOrderDetails.orderDetailsInfo.feedback_status}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.feedback_status=='无评价'?false:true" style="cursor: pointer;color: red;" @click="handleCustomerReviewsFeedBack(obtainOrderDetails.orderDetailsInfo.order_id)">{{obtainOrderDetails.orderDetailsInfo.feedback_status}}</div>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                    <td class="tdTitle">Review</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.review_comment=='无评价'?true:false">{{obtainOrderDetails.orderDetailsInfo.review_comment}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.review_comment=='无评价'?false:true" style="cursor: pointer;color: red;" @click="handleCustomerEvaluationReview(obtainOrderDetails.orderDetailsInfo.order_id)">{{obtainOrderDetails.orderDetailsInfo.review_comment}}</div>
                                    </td>
                                    <td class="tdTitle">客诉状态</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?true:false">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                            <table cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td>序号</td>
                                                    <td>客诉状态</td>
                                                    <td>客诉单号</td>
                                                </tr>
                                                <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.cust">
                                                    <td>{{index+1}}</td>
                                                    <td>{{item.status}}</td>
                                                    <td>
                                                        <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleComplaintOrder(item)">
                                                            {{item.complaint_order}}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <div style="cursor: pointer;color: #409EFF;" slot="reference" v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?false:true">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        </el-popover>
                                    </td>
                                    <td class="tdTitle">退货编码</td>
                                    <td class="tdContent">
                                        <el-button type="primary" size="mini" v-if="!obtainOrderDetails.orderDetailsInfo.refund_code" @click="handleobtainReturnCode">获取</el-button>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.refund_code?true:false">{{obtainOrderDetails.orderDetailsInfo.refund_code}}</div>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">消息记录</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.eb_message.length">无消息</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.eb_message.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Item ID</td>
                                                        <td>消息状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.eb_message" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="goEbMessagejump(item.item_id)">{{item.item_id}}</span></td>
                                                        <td>{{item.is_replied}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.eb_message[0].is_replied}}</div>
                                            </el-popover>
                                        </div>
                                        <!-- <div v-for="item in obtainOrderDetails.orderDetailsInfo.eb_message" style="cursor: pointer;color: #409EFF;" @click="goMessagejump">{{item.item_id}}</div> -->
                                    </td>
                                    <td class="tdTitle">Return</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.dispute_return.length">无</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_return.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Return ID</td>
                                                        <td>处理状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.dispute_return" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="handlePageReturn(item)">{{item.return_id}}</span></td>
                                                        <td>{{item.is_deal}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.dispute_return[0].is_deal}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="tdTitle">INR</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.dispute_inr.length">无</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_inr.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>INR ID</td>
                                                        <td>处理状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.dispute_inr" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="handlePageINR(item)">{{item.inquiry_id}}</span></td>
                                                        <td>{{item.is_deal}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.dispute_inr[0].is_deal}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">Cancel</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.dispute_cancel.length">无</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_cancel.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Cancel ID</td>
                                                        <td>处理状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.dispute_cancel" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="handleCancel(item)">{{item.cancel_id}}</span></td>
                                                        <td>{{item.is_deal}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.dispute_cancel[0].is_deal}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="tdTitle">评价状态</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.feedback.length">无评价</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.feedback.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Item ID</td>
                                                        <td>评价级别</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.feedback" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="goFeedbackjump(item.item_id)">{{item.item_id}}</span></td>
                                                        <td>{{item.comment_type}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.feedback[0].comment_type}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="tdTitle">客诉状态</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?true:false">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                            <table cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td>序号</td>
                                                    <td>客诉状态</td>
                                                    <td>客诉单号</td>
                                                </tr>
                                                <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.cust">
                                                    <td>{{index+1}}</td>
                                                    <td>{{item.status}}</td>
                                                    <td>
                                                        <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleComplaintOrder(item)">
                                                            {{item.complaint_order}}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <div style="cursor: pointer;color: #409EFF;" slot="reference" v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?false:true">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        </el-popover>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">退货编码</td>
                                    <td class="tdContent">
                                        <el-button type="primary" size="mini" v-if="!obtainOrderDetails.orderDetailsInfo.refund_code" @click="handleobtainReturnCode">获取</el-button>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.refund_code?true:false">{{obtainOrderDetails.orderDetailsInfo.refund_code}}</div>
                                    </td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">收货地址</td>
                                    <td colspan="5">
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_name">{{obtainOrderDetails.orderDetailsInfo.ship_name}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_phone">{{obtainOrderDetails.orderDetailsInfo.ship_phone}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_street1">{{obtainOrderDetails.orderDetailsInfo.ship_street1}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_street2">{{obtainOrderDetails.orderDetailsInfo.ship_street2}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_city_name">{{obtainOrderDetails.orderDetailsInfo.ship_city_name}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_stateorprovince">{{obtainOrderDetails.orderDetailsInfo.ship_stateorprovince}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_zip">{{obtainOrderDetails.orderDetailsInfo.ship_zip}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_country_name">{{obtainOrderDetails.orderDetailsInfo.ship_country_name}}</span>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">客户留言</td>
                                    <td colspan="5"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">备注</td>
                                    <td colspan="5">
                                        <div>
                                            <div v-for="item in obtainOrderDetails.orderDetailsInfo.order_remark" class="remarkStyle" v-if="obtainOrderDetails.orderDetailsInfo.order_remark.length">
                                                <div style="width:120px;">备注人：{{item.create_user_id}}&nbsp;&nbsp;&nbsp;</div>
                                                <div style="width:200px;">备注时间：{{item.create_time}}&nbsp;&nbsp;&nbsp;</div>
                                                <div style="flex:1;">内容：{{item.remark}}&nbsp;&nbsp;</div>——订单备注
                                                <i class="el-icon-circle-close" @click="handleremoveRemark(item)"></i>
                                            </div>
                                            <div class="remarkStyle" v-if="obtainOrderDetails.orderDetailsInfo.ship_remark">
                                                出货备注：<span v-html="obtainOrderDetails.orderDetailsInfo.ship_remark==null?'暂无':obtainOrderDetails.orderDetailsInfo.ship_remark"></span>
                                                <i class="el-icon-circle-close" v-if="obtainOrderDetails.orderDetailsInfo.ship_remark==null?false:true" @click="handleremoveRemark()"></i>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div v-if="operationOrderSingle.orderInformationMainRight==24?true:false">
                            <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.orderDetailsInfo===''?true:false">暂无数据</div>
                            <div style="padding: 10px;" v-if="obtainOrderDetails.orderDetailsInfo.order_abnormity_reason&&obtainOrderDetails.orderDetailsInfo.order_abnormity_reason.length">
                                <div style="color:#FF1B1E;">异常：</div>
                                <div v-for="item in obtainOrderDetails.orderDetailsInfo.order_abnormity_reason">
                                    <span style="color:#FF1B1E;">{{item.abnormity_superclass_txt}}</span>
                                    <span style="color:#333;">{{item.reason}}</span>
                                    <span style="color:#67C23A;">{{item.signtitle}}</span>
                                </div>
                            </div>
                            <table cellspacing="0" cellpadding="0" v-if="obtainOrderDetails.orderDetailsInfo===''?false:true">
                                <tr>
                                    <td class="tdTitle">ERP订单号</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.acct_order_id"></td>
                                    <td class="tdTitle">合并后父订单</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.parent_order_id=='0'?'无':obtainOrderDetails.orderDetailsInfo.parent_order_id"></td>
                                    <td class="tdTitle">平台订单号</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.platform_order_id"></td>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">销售平台</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">order_number</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">{{obtainOrderDetails.orderDetailsInfo.platform_code}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">{{obtainOrderDetails.orderDetailsInfo.order_number?obtainOrderDetails.orderDetailsInfo.order_number:"无"}}</div>
                                    </td>
                                    <td class="tdTitle">店铺名称</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.store_name"></td>
                                    <td class="tdTitle">站点</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.site"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">订单类型</td>
                                    <td class="tdContent">
                                        <div style="color:red;" v-if="obtainOrderDetails.orderDetailsInfo.orderType==='合并后的订单'
                                                            ||obtainOrderDetails.orderDetailsInfo.orderType==='拆分的主订单'||obtainOrderDetails.orderDetailsInfo.orderType==='被合并的订单'
                                                            ||obtainOrderDetails.orderDetailsInfo.orderType==='拆分后的子订单'">{{obtainOrderDetails.orderDetailsInfo.orderType}}</div>
                                        <div v-else>{{obtainOrderDetails.orderDetailsInfo.orderType}}</div>
                                    </td>
                                    <td class="tdTitle">订单状态</td>
                                    <td class="tdContent">
                                        <div style="color:red !important;" v-if="obtainOrderDetails.orderDetailsInfo.complete_status=='缺货'||obtainOrderDetails.orderDetailsInfo.complete_status=='异常'||
                                                    obtainOrderDetails.orderDetailsInfo.complete_status=='暂扣'||obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?true:false">
                                            {{obtainOrderDetails.orderDetailsInfo.complete_status}}
                                        </div>
                                        <div style="color:green !important;" v-if="obtainOrderDetails.orderDetailsInfo.complete_status=='缺货'||obtainOrderDetails.orderDetailsInfo.complete_status=='异常'||
                                                    obtainOrderDetails.orderDetailsInfo.complete_status=='暂扣'||obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?false:true">
                                            {{obtainOrderDetails.orderDetailsInfo.complete_status}}
                                        </div>
                                    </td>
                                    <td class="tdTitle">下单时间</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.created_time"></td>
                                    <td class="tdTitle">付款时间</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.paytime"></td>
                                    <td class="tdTitle">发货时间</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.shipped_date"></td>
                                    <td class="tdTitle">发货仓库</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.warehouse_name"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">客户ID</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.orderDetailsInfo.buyer_id"></td>
                                    <td class="tdTitle">客户邮箱</td>
                                    <td class="tdContent">
                                        <div @click="handleContactBuyers" style="cursor: pointer;color: #409EFF;" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">{{obtainOrderDetails.orderDetailsInfo.email}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">{{obtainOrderDetails.orderDetailsInfo.email}}</div>
                                    </td>
                                    <td class="tdTitle">产品估重</td>
                                    <td class="tdContent">{{obtainOrderDetails.orderDetailsInfo.package_weight}}（g）</td>
                                    <td class="tdTitle">订单金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.orderDetailsInfo.total_price}} {{obtainOrderDetails.orderDetailsInfo.currency}}</td>
                                    <td class="tdTitle">是否同步</td>
                                    <td class="tdContent">{{obtainOrderDetails.orderDetailsInfo.is_upload}}</td>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">发货类型</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">销售平台</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">{{obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">{{obtainOrderDetails.orderDetailsInfo.platform_code}}</div>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                    <td class="tdTitle">来信记录</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.reply_status=='无邮件'?true:false">{{obtainOrderDetails.orderDetailsInfo.reply_status}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.reply_status=='无邮件'?false:true" style="cursor: pointer;" @click="handleMailProcessing(obtainOrderDetails.orderDetailsInfo)">{{obtainOrderDetails.orderDetailsInfo.reply_status}}</div>
                                    </td>
                                    <td class="tdTitle">纠纷</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_status=='无纠纷'?true:false">{{obtainOrderDetails.orderDetailsInfo.dispute_status}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_status=='无纠纷'?false:true" style="cursor: pointer;color: #409EFF;" @click="handleDisputeCenter(obtainOrderDetails.orderDetailsInfo.order_id)">{{obtainOrderDetails.orderDetailsInfo.dispute_status}}</div>
                                    </td>
                                    <td class="tdTitle">FeedBack</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.feedback_status=='无评价'?true:false">{{obtainOrderDetails.orderDetailsInfo.feedback_status}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.feedback_status=='无评价'?false:true" style="cursor: pointer;color: red;" @click="handleCustomerReviewsFeedBack(obtainOrderDetails.orderDetailsInfo.order_id)">{{obtainOrderDetails.orderDetailsInfo.feedback_status}}</div>
                                    </td>
                                    <td class="tdTitle">Review</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.review_comment=='无评价'?true:false">{{obtainOrderDetails.orderDetailsInfo.review_comment}}</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.review_comment=='无评价'?false:true" style="cursor: pointer;color: red;" @click="handleCustomerEvaluationReview(obtainOrderDetails.orderDetailsInfo.order_id)">{{obtainOrderDetails.orderDetailsInfo.review_comment}}</div>
                                    </td>
                                    <td class="tdTitle">客诉状态</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?true:false">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                            <table cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td>序号</td>
                                                    <td>客诉状态</td>
                                                    <td>客诉单号</td>
                                                </tr>
                                                <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.cust">
                                                    <td>{{index+1}}</td>
                                                    <td>{{item.status}}</td>
                                                    <td>
                                                        <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleComplaintOrder(item)">
                                                            {{item.complaint_order}}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <div style="cursor: pointer;color: #409EFF;" slot="reference" v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?false:true">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        </el-popover>
                                    </td>
                                    <td class="tdTitle">退货编码</td>
                                    <td class="tdContent">
                                        <el-button type="primary" size="mini" v-if="!obtainOrderDetails.orderDetailsInfo.refund_code" @click="handleobtainReturnCode">获取</el-button>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.refund_code?true:false">{{obtainOrderDetails.orderDetailsInfo.refund_code}}</div>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                   <td class="tdTitle">消息记录</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.eb_message.length">无消息</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.eb_message.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Item ID</td>
                                                        <td>消息状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.eb_message" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="goEbMessagejump(item.item_id)">{{item.item_id}}</span></td>
                                                        <td>{{item.is_replied}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.eb_message[0].is_replied}}</div>
                                            </el-popover>
                                        </div>
                                        <!-- <div v-for="item in obtainOrderDetails.orderDetailsInfo.eb_message" style="cursor: pointer;color: #409EFF;" @click="goMessagejump">{{item.item_id}}</div> -->
                                    </td>
                                    <td class="tdTitle">Return</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.dispute_return.length">无</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_return.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Return ID</td>
                                                        <td>处理状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.dispute_return" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="handlePageReturn(item)">{{item.return_id}}</span></td>
                                                        <td>{{item.is_deal}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.dispute_return[0].is_deal}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="tdTitle">INR</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.dispute_inr.length">无</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_inr.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>INR ID</td>
                                                        <td>处理状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.dispute_inr" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="handlePageINR(item)">{{item.inquiry_id}}</span></td>
                                                        <td>{{item.is_deal}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.dispute_inr[0].is_deal}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="tdTitle">Cancel</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.dispute_cancel.length">无</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.dispute_cancel.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Cancel ID</td>
                                                        <td>处理状态</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.dispute_cancel" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="handleCancel(item)">{{item.cancel_id}}</span></td>
                                                        <td>{{item.is_deal}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.dispute_cancel[0].is_deal}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="tdTitle">评价状态</td>
                                    <td class="tdContent">
                                        <div v-if="!obtainOrderDetails.orderDetailsInfo.feedback.length">无评价</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.feedback.length">
                                            <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                                <table cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td>序号</td>
                                                        <td>Item ID</td>
                                                        <td>评价级别</td>
                                                    </tr>
                                                    <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.feedback" :key="index">
                                                        <td>{{index+1}}</td>
                                                        <td><span style="cursor: pointer;color: #409EFF;" @click="goFeedbackjump(item.item_id)">{{item.item_id}}</span></td>
                                                        <td>{{item.comment_type}}</td>
                                                    </tr>
                                                </table>
                                                <div style="cursor: pointer;color: #409EFF;" slot="reference">{{obtainOrderDetails.orderDetailsInfo.feedback[0].comment_type}}</div>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="tdTitle">客诉状态</td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?true:false">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        <el-popover trigger="hover" width="300px" popper-class="CustomerComplaint">
                                            <table cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td>序号</td>
                                                    <td>客诉状态</td>
                                                    <td>客诉单号</td>
                                                </tr>
                                                <tr v-for="(item,index) in orderDetailsCustomerComplaintInfo.cust">
                                                    <td>{{index+1}}</td>
                                                    <td>{{item.status}}</td>
                                                    <td>
                                                        <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleComplaintOrder(item)">
                                                            {{item.complaint_order}}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <div style="cursor: pointer;color: #409EFF;" slot="reference" v-if="obtainOrderDetails.orderDetailsInfo.cust_status=='无客诉'?false:true">{{obtainOrderDetails.orderDetailsInfo.cust_status}}</div>
                                        </el-popover>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">退货编码</td>
                                    <td class="tdContent">
                                        <el-button type="primary" size="mini" v-if="!obtainOrderDetails.orderDetailsInfo.refund_code" @click="handleobtainReturnCode">获取</el-button>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.refund_code?true:false">{{obtainOrderDetails.orderDetailsInfo.refund_code}}</div>
                                    </td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">收货地址</td>
                                    <td colspan="11">
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_name">{{obtainOrderDetails.orderDetailsInfo.ship_name}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_phone">{{obtainOrderDetails.orderDetailsInfo.ship_phone}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_street1">{{obtainOrderDetails.orderDetailsInfo.ship_street1}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_street2">{{obtainOrderDetails.orderDetailsInfo.ship_street2}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_city_name">{{obtainOrderDetails.orderDetailsInfo.ship_city_name}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_stateorprovince">{{obtainOrderDetails.orderDetailsInfo.ship_stateorprovince}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_zip">{{obtainOrderDetails.orderDetailsInfo.ship_zip}},</span>
                                        <span v-if="obtainOrderDetails.orderDetailsInfo.ship_country_name">{{obtainOrderDetails.orderDetailsInfo.ship_country_name}}</span>
                                        <el-button type="primary" size="mini" @click="handleEditShippingAddress"
                                            v-if="obtainOrderDetails.orderDetailsInfo.complete_status!='部分发货'&&(obtainOrderDetails.orderDetailsInfo.complete_status!='已发货'||order.editInfo)
                                            &&obtainOrderDetails.orderDetailsInfo.complete_status!='已取消'" show-word-limit>编辑发货地址</el-button>
                                    </td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">客户留言</td>
                                    <td colspan="11"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">备注</td>
                                    <td colspan="11">
                                        <div>
                                            <div v-for="item in obtainOrderDetails.orderDetailsInfo.order_remark" class="remarkStyle" v-if="obtainOrderDetails.orderDetailsInfo.order_remark.length">
                                                <div style="width:120px;">备注人：{{item.create_user_id}}&nbsp;&nbsp;&nbsp;</div>
                                                <div style="width:200px;">备注时间：{{item.create_time}}&nbsp;&nbsp;&nbsp;</div>
                                                <div style="flex:1;">内容：{{item.remark}}&nbsp;&nbsp;</div>——订单备注
                                                <i class="el-icon-circle-close" @click="handleremoveRemark(item)"></i>
                                            </div>
                                            <div class="remarkStyle" v-if="obtainOrderDetails.orderDetailsInfo.ship_remark">
                                                出货备注：<span v-html="obtainOrderDetails.orderDetailsInfo.ship_remark==null?'暂无':obtainOrderDetails.orderDetailsInfo.ship_remark"></span>
                                                <i class="el-icon-circle-close" v-if="obtainOrderDetails.orderDetailsInfo.ship_remark==null?false:true" @click="handleremoveRemark()"></i>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div v-if="obtainOrderDetails.orderDetailsInfo===''?false:true">
                            <div class="orderInfoTitle">添加备注：</div>
                            <div class="addRemarksInfo">
                                <template>
                                    <el-select size="mini" v-model="orderInfo.remarkType">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </template>
                                <el-form :model="orderInfo" status-icon :rules="rules" ref="orderInfoRemarks" class="demo-ruleForm">
                                    <el-form-item prop="orderInfoRemarks">
                                        <el-input v-model.trim="orderInfo.orderInfoRemarks" type="textarea" class="addRemarks" size="mini" placeholder="请输入内容,不能超过5000个字符" maxlength="5000"/>
                                        <!-- <el-input v-model.trim="orderInfo.orderInfoRemarks" class="addRemarks" size="mini" placeholder="请输入内容,不能超过250个字符" maxlength="250" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'"/> -->
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" size="mini" @click="handleAddRemarksInfo">保存</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div v-if="isEditShippingAddress" class="orderEditInfo">
                            <el-form :model="orderEditInfo" ref="orderEditInfo" :rules="orderEditRules">
                                <div style="display:flex;width:100%;">
                                    <div>
                                        <el-form-item label="买家ID：" prop="buyer_id" label-width="100px">
                                            <el-input v-model="orderEditInfo.buyer_id" size="mini" />
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-form-item label="客户邮箱：" prop="email" label-width="100px">
                                            <template>
                                                <el-input v-model="orderEditInfo.email" size="mini" />
                                            </template>
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-form-item label="收件人：" prop="ship_name" label-width="100px">
                                            <template>
                                                <el-input v-model="orderEditInfo.ship_name" size="mini" />
                                            </template>
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-form-item label="地址1：" prop="ship_street1" label-width="100px">
                                            <template>
                                                <el-input v-model="orderEditInfo.ship_street1" size="mini" />
                                            </template>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div style="display:flex;width:100%;">
                                    <div>
                                        <el-form-item label="地址2：" prop="ship_street2" label-width="100px">
                                            <el-input v-model="orderEditInfo.ship_street2" size="mini" />
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-form-item label="城市：" prop="ship_city_name" label-width="100px">
                                            <template>
                                                <el-input v-model="orderEditInfo.ship_city_name" size="mini" />
                                            </template>
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-form-item label="省/州：" prop="ship_stateorprovince" label-width="100px">
                                            <template>
                                                <el-input v-model="orderEditInfo.ship_stateorprovince" size="mini" />
                                            </template>
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-form-item label="国家：" prop="ship_country" label-width="100px">
                                            <template>
                                                <el-select v-model="orderEditInfo.ship_country" size="small" clearable placeholder="请选择" filterable v-filter>
                                                    <el-option v-for="item in countryList" :key="item.id" :label="item.cnName"
                                                        :value="item.enAbbr">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div style="display:flex;width:100%;">
                                    <div>
                                        <el-form-item label="邮编：" prop="ship_zip" label-width="100px">
                                            <el-input v-model="orderEditInfo.ship_zip" size="mini" />
                                        </el-form-item>
                                    </div>
                                    <div>
                                        <el-form-item label="电话：" prop="ship_phone" label-width="100px">
                                            <template>
                                                <el-input v-model="orderEditInfo.ship_phone" size="mini" />
                                            </template>
                                        </el-form-item>
                                    </div>
                                </div>
                            </el-form>
                            <div>
                                <el-button size="small" @click="handleOrderEditInfoCancel">取消</el-button>
                                <el-button size="small" type="primary" @click="handleOrderEditInfoDetermine()">确定</el-button>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="| 产品信息" name="productInfo" id="productInfoAnchor" class="headerInfoScrollTop">
                    <div class="orderInformationMainInfo" v-loading="obtainOrderDetails.proDetailsLoading">
                        <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.proDetailsInfo.length===0?true:false">暂无数据</div>
                        <div v-for="(item,index) in obtainOrderDetails.proDetailsInfo" v-if="obtainOrderDetails.proDetailsInfo.length===0?false:true">
                            <table cellspacing="0" cellpadding="0" v-if="operationOrderSingle.orderInformationMainRight==24?false:true">
                                <tr>
                                    <td class="tdTitle">标题</td>
                                    <td colspan="5">
                                        <!-- <div>{{item.chinese_title}}</div> -->
                                        <div style="cursor: pointer;color: #409EFF;float:left;">
                                            <a :href="item.item_url" target="_Blank" style="line-height: 50px;">{{item.title}}</a>
                                        </div>
                                        <div>
                                            <img :src="item.uploadimgs" width="50px" style="cursor: pointer;" @click="handleClickImg(item.uploadimgs)"/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">ASIN</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">itemID</div>
                                    </td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;float:left;" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                            <a :href="item.item_url" target="_Blank">{{item.asinval}}</a>
                                        </div>
                                        <div style="cursor: pointer;color: #409EFF;float:left;" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                            <a :href="item.item_url" target="_Blank">{{item.item_id}}</a>
                                        </div>
                                    </td>
                                    <td class="tdTitle">产品名称</td>
                                    <td class="tdContent" v-html="item.chinese_title"></td>
                                    <td class="tdTitle">发货SKU</td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;float:left;">
                                            <a :href="item.sku_url" target="_Blank">{{item.sku}}</a>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">发货数量</td>
                                    <td class="tdContent" v-html="item.quantity"></td>
                                    <td class="tdTitle">平台SKU</td>
                                    <td class="tdContent">{{item.sku_old}}</td>
                                    <td class="tdTitle">平台数量</td>
                                    <td class="tdContent">{{item.quantity_old}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">产品状态</td>
                                    <td class="tdContent" style="color:red;" v-html="item.status"></td>
                                    <td class="tdTitle">库存</td>
                                    <td class="tdContent" style="color:red;" v-html="item.availablestock"></td>
                                    <td class="tdTitle">在途数</td>
                                    <td class="tdContent" style="color:red;" v-html="item.transit_qty"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">欠货数量</td>
                                    <td class="tdContent" style="color:red;" v-html="item.qs"></td>
                                    <td class="tdTitle">销售</td>
                                    <td class="tdContent" v-html="item.seller_user"></td>
                                    <td class="tdTitle">开发</td>
                                    <td class="tdContent">{{item.create_user_full_name}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">客服</td>
                                    <td class="tdContent" v-html="item.serviceer"></td>
                                    <td class="tdTitle">采购</td>
                                    <td class="tdContent" v-html="item.buyer"></td>
                                    <td class="tdTitle">文案</td>
                                    <td class="tdContent">{{item.edit_user_full_name}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">产品金额</td>
                                    <td class="tdContent">{{item.sale_price}} {{item.currency}}</td>
                                    <td class="tdTitle">产品运费</td>
                                    <td class="tdContent">{{item.ship_price}} {{item.currency}}</td>
                                    <td class="tdTitle">产品总金额</td>
                                    <td class="tdContent" style="color: #FF9900 !important">{{item.total_price}} {{item.currency}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">产品线</td>
                                    <td class="tdContent">{{item.linelist_cn_name}}</td>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">刊登地</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">{{item.site}}</div>
                                    </td>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">model</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">{{item.model_value?item.model_value:'无'}}</div>
                                    </td>
                                </tr>
                            </table>
                            <div style="width:100%;height:10px;" v-if="obtainOrderDetails.proDetailsInfo.length-1==index?false:true"></div>
                            <table cellspacing="0" cellpadding="0" v-if="operationOrderSingle.orderInformationMainRight==24?true:false">
                                <tr>
                                    <td class="tdTitle">标题</td>
                                    <td colspan="11">
                                        <!-- <div>{{item.chinese_title}}</div> -->
                                        <div style="cursor: pointer;color: #409EFF;float:left;">
                                            <a :href="item.item_url" target="_Blank" style="line-height: 50px;">{{item.title}}</a>
                                        </div>
                                        <div>
                                            <img :src="item.uploadimgs" width="50px" style="cursor: pointer;" @click="handleClickImg(item.uploadimgs)"/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">ASIN</div>
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">itemID</div>
                                    </td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;float:left;" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                            <a :href="item.item_url" target="_Blank">{{item.asinval}}</a>
                                        </div>
                                        <div style="cursor: pointer;color: #409EFF;float:left;" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                            <a :href="item.item_url" target="_Blank">{{item.item_id}}</a>
                                        </div>
                                    </td>
                                    <td class="tdTitle">产品名称</td>
                                    <td class="tdContent" v-html="item.chinese_title"></td>
                                    <td class="tdTitle">发货SKU</td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;float:left;">
                                            <a :href="item.sku_url" target="_Blank">{{item.sku}}</a>
                                        </div>
                                    </td>
                                    <td class="tdTitle">发货数量</td>
                                    <td class="tdContent" v-html="item.quantity"></td>
                                    <td class="tdTitle">平台SKU</td>
                                    <td class="tdContent">{{item.sku_old}}</td>
                                    <td class="tdTitle">平台数量</td>
                                    <td class="tdContent">{{item.quantity_old}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">产品状态</td>
                                    <td class="tdContent" style="color:red;" v-html="item.status"></td>
                                    <td class="tdTitle">库存</td>
                                    <td class="tdContent" style="color:red;" v-html="item.availablestock"></td>
                                    <td class="tdTitle">在途数</td>
                                    <td class="tdContent" style="color:red;" v-html="item.transit_qty"></td>
                                    <td class="tdTitle">欠货数量</td>
                                    <td class="tdContent" style="color:red;" v-html="item.qs"></td>
                                    <td class="tdTitle">销售</td>
                                    <td class="tdContent" v-html="item.seller_user"></td>
                                    <td class="tdTitle">开发</td>
                                    <td class="tdContent">{{item.create_user_full_name}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">客服</td>
                                    <td class="tdContent" v-html="item.serviceer"></td>
                                    <td class="tdTitle">采购</td>
                                    <td class="tdContent" v-html="item.buyer"></td>
                                    <td class="tdTitle">文案</td>
                                    <td class="tdContent">{{item.edit_user_full_name}}</td>
                                    <td class="tdTitle">产品金额</td>
                                    <td class="tdContent">{{item.sale_price}} {{item.currency}}</td>
                                    <td class="tdTitle">产品运费</td>
                                    <td class="tdContent">{{item.ship_price}} {{item.currency}}</td>
                                    <td class="tdTitle">产品总金额</td>
                                    <td class="tdContent" style="color: #FF9900 !important">{{item.total_price}} {{item.currency}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">产品线</td>
                                    <td class="tdContent">{{item.linelist_cn_name}}</td>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">刊登地</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">{{item.site}}</div>
                                    </td>
                                    <td class="tdTitle">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">model</div>
                                    </td>
                                    <td class="tdContent">
                                        <div v-if="obtainOrderDetails.orderDetailsInfo.platform_code=='EB'">{{item.model_value?item.model_value:'无'}}</div>
                                    </td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                            </table>
                            <div style="width:100%;height:10px;" v-if="obtainOrderDetails.proDetailsInfo.length-1==index?false:true"></div>
                        </div>
                        <div v-if="obtainOrderDetails.proDetailsInfo.length===0?false:true">
                            <div v-if="operationOrderSingle.orderInformationMainRight==24?true:false">
                                <div>
                                    <el-button type="primary" :model="product" size="mini" @click="handleEditProductShow">编辑产品</el-button>
                                </div>
                                <div v-if="editProduct">
                                    <el-form :model="product" ref="productInfo" class="demo-dynamic">
                                        <table cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="200" class="headerColor">标题</td>
                                                <td width="200" class="headerColor">SKU</td>
                                                <td width="100" class="headerColor">数量</td>
                                                <td width="100" class="headerColor">平台卖价</td>
                                                <td width="100" class="headerColor">总运费</td>
                                                <td width="100" class="headerColor">欠货数量</td>
                                                <td width="100" class="headerColor">库存</td>
                                                <td width="100" class="headerColor">在途数量</td>
                                                <td width="100" class="headerColor">总计</td>
                                                <td width="100" class="headerColor">操作</td>
                                            </tr>
                                            <tr v-for="(item,index) in product.info" v-if="item.bool">
                                                <td>
                                                    <el-form-item label-width="0" :prop="'info.'+index+'.chinese_title'" :rules="productInfo.chinese_title">
                                                        <el-input size="mini" placeholder v-model.trim="item.chinese_title"/>
                                                    </el-form-item>
                                                </td>
                                                <td>
                                                    <el-form-item label-width="0" :prop="'info.'+index+'.sku'" :rules="productInfo.sku">
                                                        <el-input size="mini" placeholder v-model.trim="item.sku" @change="handleProErpSku(item,index)"/>
                                                    </el-form-item>
                                                </td>
                                                <td>
                                                    <el-form-item label-width="0" :prop="'info.'+index+'.quantity'" :rules="productInfo.quantity">
                                                        <el-input size="mini" placeholder v-model.trim="item.quantity" @change="HandleCalculationTotalAmount(item,index)"/>
                                                    </el-form-item>
                                                </td>
                                                <td>
                                                    <el-form-item label-width="0" :prop="'info.'+index+'.sale_price'" :rules="productInfo.sale_price">
                                                        <el-input size="mini" placeholder v-model.trim="item.sale_price" @change="HandleCalculationTotalAmount(item,index)"/>
                                                    </el-form-item>
                                                </td>
                                                <td>
                                                    <el-form-item label-width="0" :prop="'info.'+index+'.ship_price'" :rules="productInfo.ship_price">
                                                        <el-input size="mini" placeholder v-model.trim="item.ship_price" @change="HandleCalculationTotalAmount(item,index)"/>
                                                    </el-form-item>
                                                </td>
                                                <td v-html="item.qs"></td>
                                                <td v-html="item.availablestock"></td>
                                                <td v-html="item.transit_qty"></td>
                                                <td>{{item.total_price}}</td>
                                                <td style="font-size:20px;">
                                                    <i style="cursor: pointer;" @click="elCirclePlusOutline()" class="el-icon-circle-plus-outline"></i>&nbsp;
                                                    <i style="cursor: pointer;" @click="elCircleRemoveOutline(item,index)" v-if="product.number==1?false:true" class="el-icon-remove-outline"></i>
                                                </td>
                                            </tr>
                                        </table>
                                    </el-form>
                                    <div>
                                        <el-button size="small" @click="handleCancel">取消</el-button>
                                        <el-button size="small" type="primary" @click="handleDetermine()">确定</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="| 交易记录" name="transactionRecord" id="transactionRecordAnchor" class="headerInfoScrollTop">
                    <div class="orderInformationMainInfo" v-loading="obtainOrderDetails.transactionDetailsLoading">
                        <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.transactionDetailsInfo.length===0?true:false">暂无数据</div>
                        <div v-if="obtainOrderDetails.transactionDetailsInfo.length===0?false:true">
                            <table
                                cellspacing="0"
                                cellpadding="0"
                                v-if="operationOrderSingle.orderInformationMainRight==24?false:true"
                                v-for="item in obtainOrderDetails.transactionDetailsInfo"
                                style="margin-bottom:10px;">
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                    <td class="tdTitle">交易号</td>
                                    <td class="tdContent" v-html="item.transaction_id"></td>
                                    <td class="tdTitle">交易类型</td>
                                    <td class="tdContent" v-html="item.receive_type=='1'?'接收':'发起'"></td>
                                    <td class="tdTitle">交易状态</td>
                                    <td class="tdContent" v-html="item.payment_status"></td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                    <td class="tdTitle">交易金额</td>
                                    <td class="tdContent">{{item.amt}} ({{item.currency}})</td>
                                    <td class="tdTitle">交易时间</td>
                                    <td class="tdContent" v-html="item.order_pay_time"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>

                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">交易号</td>
                                    <td class="tdContent" v-html="item.transaction_id"></td>
                                    <td class="tdTitle">付款账号</td>
                                    <td class="tdContent" v-html="item.payer_email"></td>
                                    <td class="tdTitle">收款账号</td>
                                    <td class="tdContent" v-html="item.receiver_email"></td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">交易类型</td>
                                    <td class="tdContent" v-html="item.receive_type=='1'?'接收':'发起'"></td>
                                    <td class="tdTitle">交易状态</td>
                                    <td class="tdContent" v-html="item.payment_status"></td>
                                    <td class="tdTitle">交易金额</td>
                                    <td class="tdContent">{{item.amt}} ({{item.currency}})</td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">交易时间</td>
                                    <td class="tdContent" v-html="item.order_pay_time"></td>
                                    <td class="tdTitle">手续费</td>
                                    <td class="tdContent">{{item.fee_amt}} ({{item.currency}})</td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                            </table>
                            <table
                                cellspacing="0"
                                cellpadding="0"
                                v-if="operationOrderSingle.orderInformationMainRight==24?true:false"
                                v-for="item in obtainOrderDetails.transactionDetailsInfo"
                                style="margin-bottom:10px;">
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">
                                    <td class="tdTitle">交易号</td>
                                    <td class="tdContent" v-html="item.transaction_id"></td>
                                    <td class="tdTitle">交易类型</td>
                                    <td class="tdContent" v-html="item.receive_type=='1'?'接收':'发起'"></td>
                                    <td class="tdTitle">交易状态</td>
                                    <td class="tdContent" v-html="item.payment_status"></td>
                                    <td class="tdTitle">交易金额</td>
                                    <td class="tdContent">{{item.amt}} ({{item.currency}})</td>
                                    <td class="tdTitle">交易时间</td>
                                    <td class="tdContent" v-html="item.order_pay_time"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">交易号</td>
                                    <td class="tdContent" v-html="item.transaction_id"></td>
                                    <td class="tdTitle">付款账号</td>
                                    <td class="tdContent" v-html="item.payer_email"></td>
                                    <td class="tdTitle">收款账号</td>
                                    <td class="tdContent" v-html="item.receiver_email"></td>
                                    <td class="tdTitle">交易类型</td>
                                    <td class="tdContent" v-html="item.receive_type=='1'?'接收':'发起'"></td>
                                    <td class="tdTitle">交易状态</td>
                                    <td class="tdContent" v-html="item.payment_status"></td>
                                    <td class="tdTitle">交易金额</td>
                                    <td class="tdContent">{{item.amt}} ({{item.currency}})</td>
                                </tr>
                                <tr v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'">
                                    <td class="tdTitle">交易时间</td>
                                    <td class="tdContent" v-html="item.order_pay_time"></td>
                                    <td class="tdTitle">手续费</td>
                                    <td class="tdContent">{{item.fee_amt}} ({{item.currency}})</td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="| 包裹信息" name="packageInfo" id="packageInfoAnchor" class="headerInfoScrollTop" >
                    <div class="orderInformationMainInfo" name="packageInfo" v-loading="obtainOrderDetails.packageDetailsLoading">
                        <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.packageDetailsInfo.length===0?true:false">暂无数据</div>
                        <div v-if="obtainOrderDetails.packageDetailsInfo.length===0?false:true">
                            <table
                                cellspacing="0"
                                cellpadding="0"
                                v-if="operationOrderSingle.orderInformationMainRight==24?false:true"
                                v-for="(item,index) in obtainOrderDetails.packageDetailsInfo"
                                style="margin-bottom:10px;">
                                <tr>
                                    <td class="tdTitle">发货仓库</td>
                                    <td class="tdContent" v-html="item.warehouse_name"></td>
                                    <td class="tdTitle">运输方式</td>
                                    <td class="tdContent" v-html="item.ship_name"></td>
                                    <td class="tdTitle">物流单号</td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;">
                                            <a :href="item.track_url" target="_Blank">{{item.tracking_number1}}</a>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">包裹号</td>
                                    <td class="tdContent" v-html="item.package_id"></td>
                                    <td class="tdTitle">出货重量</td>
                                    <td class="tdContent" v-html="item.package_weight"></td>
                                    <td class="tdTitle">运费成本</td>
                                    <td class="tdContent">{{item.shipping_fee}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">出货时间</td>
                                    <td colspan="3" v-html="item.shipped_date"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                            </table>
                            <table
                                cellspacing="0"
                                cellpadding="0"
                                v-if="operationOrderSingle.orderInformationMainRight==24?true:false"
                                v-for="(item,index) in obtainOrderDetails.packageDetailsInfo"
                                style="margin-bottom:10px;">
                                <tr>
                                    <td class="tdTitle">发货仓库</td>
                                    <td class="tdContent" v-html="item.warehouse_name"></td>
                                    <td class="tdTitle">运输方式</td>
                                    <td class="tdContent" v-html="item.ship_name"></td>
                                    <td class="tdTitle">物流单号</td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;">
                                            <a :href="item.track_url" target="_Blank">{{item.tracking_number1}}</a>
                                        </div>
                                    </td>
                                    <td class="tdTitle">包裹号</td>
                                    <td class="tdContent" v-html="item.package_id"></td>
                                    <td class="tdTitle">出货重量</td>
                                    <td class="tdContent" v-html="item.package_weight"></td>
                                    <td class="tdTitle">运费成本</td>
                                    <td class="tdContent">{{item.shipping_fee}}</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">出货时间</td>
                                    <td colspan="3" v-html="item.shipped_date"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="| 利润信息" name="profitInfo" id="profitInfoAnchor" class="headerInfoScrollTop">
                    <div class="orderInformationMainInfo" v-loading="obtainOrderDetails.profitDetailsLoading">
                        <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.profitDetailsInfo===''?true:false">暂无数据</div>
                        <div v-if="obtainOrderDetails.profitDetailsInfo===''?false:true">
                            <table
                                cellspacing="0"
                                cellpadding="0"
                                v-if="operationOrderSingle.orderInformationMainRight==24?false:true">
                                <tr>
                                    <td class="tdTitle">产品金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.productPrice}}&nbsp;&nbsp;CNY</td>
                                    <td class="tdTitle">平台运费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.shippingPrice}} CNY</td>
                                    <td class="tdTitle">调整金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.adjustAmount}} CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">总收入</td>
                                    <td class="tdContent" colspan="5" style="color: #FF9900">{{obtainOrderDetails.profitDetailsInfo.totalPrice}} CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">平均成本</td>
                                    <td class="tdContent" style="color:red;">{{obtainOrderDetails.profitDetailsInfo.purchaseCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">运费成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.shippingCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">平均采购成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.purchaseLastPrice1}}&nbsp;CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">平均采购运费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.purchaseShipCost1}}&nbsp;CNY</td>
                                    <td class="tdTitle">最新采购价</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.purchaseCostNew1}}&nbsp;CNY</td>
                                    <td class="tdTitle">包材成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.packingCost}}&nbsp;CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">库存折扣成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.stockPrice}}&nbsp;CNY</td>
                                    <td class="tdTitle">汇总损失成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.exchangePrice}}&nbsp;CNY</td>
                                    <td class="tdTitle">包装成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.packageCost}}&nbsp;CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">偏远附加费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.extraPrice}}&nbsp;CNY</td>
                                    <td class="tdTitle">超尺寸附加费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.exceedprice}}&nbsp;CNY</td>
                                    <td class="tdTitle">海外仓处理费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.processing}}&nbsp;CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">复合打包费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.pack}}&nbsp;CNY</td>
                                    <td class="tdTitle">交易佣金</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.payCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">平台佣金</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.finalValueFee}}&nbsp;CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">成本/支出</td>
                                    <td class="tdContent" colspan="5" style="color: #FF9900"><strong>{{obtainOrderDetails.profitDetailsInfo.totalCast}}&nbsp;CNY</strong>&nbsp;&nbsp;&nbsp;<span>备注：此处的成本/支出的平均成本为最新采购价</span></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">重寄费用</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.redirectCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">退款金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.drawPrice}}&nbsp;CNY</td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">利润/利润率</td>
                                    <td colspan="5" style="color: #FF9900">
                                        <strong>{{obtainOrderDetails.profitDetailsInfo.newProfit}}&nbsp;CNY/{{obtainOrderDetails.profitDetailsInfo.newProfitRate}}%</strong>&nbsp;&nbsp;&nbsp;<span>利润计算公式：（收入-成本/支出）-退款-重寄费用</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">汇率值</td>
                                    <td colspan="5"><strong>{{obtainOrderDetails.profitDetailsInfo.currencyRate}}</strong>&nbsp;&nbsp;&nbsp;<span>({{obtainOrderDetails.orderDetailsInfo.created_time}}&nbsp;&nbsp;{{obtainOrderDetails.orderDetailsInfo.currency}}->CNY)</span></td>
                                </tr>
                            </table>
                            <table
                                cellspacing="0"
                                cellpadding="0"
                                v-if="operationOrderSingle.orderInformationMainRight==24?true:false">
                                <tr>
                                    <td class="tdTitle">产品金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.productPrice}}&nbsp;&nbsp;CNY</td>
                                    <td class="tdTitle">平台运费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.shippingPrice}} CNY</td>
                                    <td class="tdTitle">调整金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.adjustAmount}} CNY</td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">总收入</td>
                                    <td class="tdContent" colspan="11" style="color: #FF9900">{{obtainOrderDetails.profitDetailsInfo.totalPrice}} CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">平均成本</td>
                                    <td class="tdContent" style="color:red;">{{obtainOrderDetails.profitDetailsInfo.purchaseCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">运费成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.shippingCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">平均采购成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.purchaseLastPrice1}}&nbsp;CNY</td>
                                    <td class="tdTitle">平均采购运费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.purchaseShipCost1}}&nbsp;CNY</td>
                                    <td class="tdTitle">最新采购价</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.purchaseCostNew1}}&nbsp;CNY</td>
                                    <td class="tdTitle">包材成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.packingCost}}&nbsp;CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">库存折扣成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.stockPrice}}&nbsp;CNY</td>
                                    <td class="tdTitle">汇总损失成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.exchangePrice}}&nbsp;CNY</td>
                                    <td class="tdTitle">包装成本</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.packageCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">偏远附加费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.extraPrice}}&nbsp;CNY</td>
                                    <td class="tdTitle">超尺寸附加费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.exceedprice}}&nbsp;CNY</td>
                                    <td class="tdTitle">海外仓处理费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.processing}}&nbsp;CNY</td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">复合打包费</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.pack}}&nbsp;CNY</td>
                                    <td class="tdTitle">交易佣金</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.payCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">平台佣金</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.finalValueFee}}&nbsp;CNY</td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">成本/支出</td>
                                    <td class="tdContent" colspan="11" style="color: #FF9900"><strong>{{obtainOrderDetails.profitDetailsInfo.totalCast}}&nbsp;CNY</strong>&nbsp;&nbsp;&nbsp;<span>备注：此处的成本/支出的平均成本为最新采购价</span></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">重寄费用</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.redirectCost}}&nbsp;CNY</td>
                                    <td class="tdTitle">退款金额</td>
                                    <td class="tdContent">{{obtainOrderDetails.profitDetailsInfo.drawPrice}}&nbsp;CNY</td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">利润/利润率</td>
                                    <td colspan="11" style="color: #FF9900">
                                        <strong>{{obtainOrderDetails.profitDetailsInfo.newProfit}}&nbsp;CNY/{{obtainOrderDetails.profitDetailsInfo.newProfitRate}}%</strong>&nbsp;&nbsp;&nbsp;<span>利润计算公式：（收入-成本/支出）-退款-重寄费用</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">汇率值</td>
                                    <td colspan="11"><strong>{{obtainOrderDetails.profitDetailsInfo.currencyRate}}</strong>&nbsp;&nbsp;&nbsp;<span>({{obtainOrderDetails.orderDetailsInfo.created_time}}&nbsp;&nbsp;{{obtainOrderDetails.orderDetailsInfo.currency}}->CNY)</span></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="| 仓储/物流" name="packageInfo" id="packageInfoAnchor" class="headerInfoScrollTop">
                    <div class="orderInformationMainInfo" name="packageInfo">
                        <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.logisticsDetailsInfo.length===0?true:false">暂无数据</div>
                        <div v-if="obtainOrderDetails.logisticsDetailsInfo.length===0?false:true">
                            <table cellspacing="0" cellpadding="0" v-if="operationOrderSingle.orderInformationMainRight==24?false:true" style="margin-bottom:10px;">
                                <tr>
                                    <!-- <td class="tdTitle">物流单号</td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;">
                                            <a :href="item.track_url" target="_Blank">{{item.tracking_number1}}</a>
                                        </div>buyer_option_logistics
                                    </td> -->
                                    <td class="tdTitle">发货仓库</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.logisticsDetailsInfo.warehouse_name"></td>
                                    <td class="tdTitle">邮寄方式</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.logisticsDetailsInfo.ship_name"></td>
                                    <td class="tdTitle">买家选择物流</td>
                                    <td class="tdContent" v-html="obtainOrderDetails.logisticsDetailsInfo.buyer_option_logistics"></td>
                                </tr>
                                <!-- <tr>
                                    <td class="tdTitle">最新物流信息</td>
                                    <td colspan="5" v-html="item.tracks_content==null?'无':item.tracks_content[0].event_thing"></td>
                                </tr> -->
                            </table>
                            <div v-if="operationOrderSingle.orderInformationMainRight==24?true:false">
                                <table cellspacing="0" cellpadding="0" style="margin-bottom:10px;">
                                    <tr>
                                        <!-- <td class="tdTitle">物流单号</td>
                                        <td class="tdContent">
                                            <div style="cursor: pointer;color: #409EFF;">
                                                <a :href="item.track_url" target="_Blank">{{item.tracking_number1}}</a>
                                            </div>
                                        </td> -->
                                        <td class="tdTitle">发货仓库</td>
                                        <td class="tdContent" v-html="obtainOrderDetails.logisticsDetailsInfo.warehouse_name"></td>
                                        <td class="tdTitle">邮寄方式</td>
                                        <td class="tdContent" v-html="obtainOrderDetails.logisticsDetailsInfo.ship_name"></td>
                                        <td class="tdTitle">买家选择物流</td>
                                        <td class="tdContent" v-html="obtainOrderDetails.logisticsDetailsInfo.buyer_option_logistics"></td>
                                        <!-- <td class="tdTitle">最新物流信息</td>
                                        <td style="width:620px;" v-html="item.tracks_content==null?'无':item.tracks_content[0].event_thing"></td> -->
                                    </tr>
                                </table>
                                <div v-if="obtainOrderDetails.orderDetailsInfo!=''">
                                    <el-button type="primary" :model="product" size="mini" @click="handleEditlogisticsDetails"
                                        v-if="obtainOrderDetails.orderDetailsInfo.complete_status!='部分发货'&&(obtainOrderDetails.orderDetailsInfo.complete_status!='已发货'||order.editInfo)
                                        &&obtainOrderDetails.orderDetailsInfo.complete_status!='已取消'">编辑仓储物流</el-button>
                                </div>
                            </div>
                            <div v-if="isLogisticsDetailsInfo">
                                <el-form :model="logisticsDetailsInfo" ref="logisticsDetailsInfo" class="demo-dynamic"  :rules="logisticsDetailsRules">
                                    <div style="display:flex;">
                                        <div>
                                            <el-form-item label="发货仓库：" prop="warehouse_name" label-width="100px">
                                                <template>
                                                    <el-select v-model="logisticsDetailsInfo.warehouse_name" size="small" @change="handleGetShipCode(logisticsDetailsInfo.warehouse_name,true)" clearable placeholder="请选择" filterable v-filter>
                                                        <el-option v-for="(item,key) in obtainOrderDetails.warehouse_id" :key="key" :label="item"
                                                            :value="key">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label="邮寄方式：" prop="ship_name" label-width="100px">
                                                <template>
                                                    <el-select v-model="logisticsDetailsInfo.ship_name" size="small" clearable placeholder="请选择" filterable v-filter>
                                                        <el-option v-for="(item,key) in ship_code" :key="key" :label="item"
                                                            :value="key">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-form-item>
                                        </div>
                                    </div>
                                </el-form>
                                <div>
                                    <el-button size="small" @click="handlelogisticsDetailsCancel">取消</el-button>
                                    <el-button size="small" type="primary" @click="handlelogisticsDetailsDetermine()">确定</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="| 售后信息" name="afterSaleInfo" id="afterSaleInfoAnchor" class="headerInfoScrollTop">
                    <div class="orderInformationMainInfo" v-loading="obtainOrderDetails.salesAfterDetailsLoading">
                        <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.salesAfterDetailsInfo.length===0?true:false">暂无数据</div>
                        <div v-if="obtainOrderDetails.salesAfterDetailsInfo.length===0?false:true">
                            <table cellspacing="0" cellpadding="0" style="margin-bottom:10px;" v-if="operationOrderSingle.orderInformationMainRight==24?false:true"  v-for="item in obtainOrderDetails.salesAfterDetailsInfo">
                                <tr>
                                    <td class="tdTitle">售后类型</td>
                                    <td class="tdContent" style="color:red;" v-html="item.type"></td>
                                    <td class="tdTitle">售后单号</td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleAfterSaleList(item)">{{item.after_sale_id}}</div>
                                    </td>
                                    <td class="tdTitle">退款金额</td>
                                    <td class="tdContent" v-html="item.refund_redirect_price"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">退款状态</td>
                                    <td class="tdContent">
                                        <div style="color:red;" v-if="item.refund_status=='1'">{{item.refund_status=='1'?'待退款':'————————————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='2'">{{item.refund_status=='2'?'退款中':'————————————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='3'">{{item.refund_status=='3'?'退款完成':'————————————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='4'">{{item.refund_status=='4'?'退款失败':'————————————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='5'">{{item.refund_status=='5'?'等待接受退款中':'————————————'}}</div>
                                        <div v-if="!item.refund_status"  style="text-align:center;">————————————</div>
                                    </td>
                                    <td class="tdTitle">审核状态</td>
                                    <td class="tdContent">{{item.status}}</td>
                                    <td class="tdTitle">重寄加钱金额</td>
                                    <td class="tdContent" v-html="item.order_amount"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">创建人</td>
                                    <td class="tdContent" v-html="item.create_by"></td>
                                    <td class="tdTitle">创建时间</td>
                                    <td class="tdContent" v-html="item.create_time"></td>
                                    <td class="tdTitle"></td>
                                    <td class="tdContent"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">原因</td>
                                    <td colspan="5" v-html="item.refund_redirect_reason"></td>
                                </tr>
                            </table>
                            <table cellspacing="0" cellpadding="0" style="margin-bottom:10px;" v-if="operationOrderSingle.orderInformationMainRight==24?true:false" v-for="item in obtainOrderDetails.salesAfterDetailsInfo" >
                                <tr>
                                    <td class="tdTitle">售后类型</td>
                                    <td class="tdContent" style="color:red;" v-html="item.type"></td>
                                    <td class="tdTitle">售后单号</td>
                                    <td class="tdContent">
                                        <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleAfterSaleList(item)">{{item.after_sale_id}}</div>
                                    </td>
                                    <td class="tdTitle">退款金额</td>
                                    <td class="tdContent" v-html="item.refund_redirect_price"></td>
                                    <td class="tdTitle">退款状态</td>
                                    <td class="tdContent">
                                        <div style="color:red;" v-if="item.refund_status=='1'">{{item.refund_status=='1'?'待退款':'——————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='2'">{{item.refund_status=='2'?'退款中':'——————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='3'">{{item.refund_status=='3'?'退款完成':'——————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='4'">{{item.refund_status=='4'?'退款失败':'——————'}}</div>
                                        <div style="color:red;" v-if="item.refund_status=='5'">{{item.refund_status=='5'?'等待接受退款中':'——————'}}</div>
                                        <div v-if="!item.refund_status">——————</div>
                                    </td>
                                    <td class="tdTitle">审核状态</td>
                                    <td class="tdContent">{{item.status}}</td>
                                    <td class="tdTitle">重寄加钱金额</td>
                                    <td class="tdContent" v-html="item.order_amount"></td>
                                </tr>
                                <tr>
                                    <td class="tdTitle">创建人</td>
                                    <td class="tdContent" v-html="item.create_by"></td>
                                    <td class="tdTitle">创建时间</td>
                                    <td class="tdContent" colspan="3" v-html="item.create_time"></td>
                                    <td class="tdTitle">原因</td>
                                    <td colspan="5" v-html="item.refund_redirect_reason"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="| 操作日志" name="operationJournal" id="operationJournalAnchor" class="headerInfoScrollTop">
                    <div class="orderInformationMainInfo" v-loading="obtainOrderDetails.logsLoading">
                        <div style="color: #333;padding: 30px 0px;text-align: center;" v-if="obtainOrderDetails.logsInfo.length===0?true:false">暂无数据</div>
                        <div v-if="obtainOrderDetails.logsInfo.length===0?false:true">
                            <table cellspacing="0" cellpadding="0" v-if="operationOrderSingle.orderInformationMainRight==24?false:true" v-for="item in obtainOrderDetails.logsInfo" style="margin-bottom:10px;">
                                <tr>
                                    <td class="tdTitle">操作事项</td>
                                    <td class="tdContent" v-html="item.updateContent"></td>
                                    <td class="tdTitle">操作人</td>
                                    <td class="tdContent" v-html="item.operatorName"></td>
                                    <td class="tdTitle">操作时间</td>
                                    <td class="tdContent" v-html="item.createTime"></td>
                                </tr>
                            </table>
                            <table cellspacing="0" cellpadding="0" v-if="operationOrderSingle.orderInformationMainRight==24?true:false" v-for="item in obtainOrderDetails.logsInfo" style="margin-bottom:10px;">
                                <tr>
                                    <td class="tdTitle">操作事项</td>
                                    <td width="900" v-html="item.updateContent"></td>
                                    <td class="tdTitle">操作人</td>
                                    <td class="tdContent" v-html="item.operatorName"></td>
                                    <td class="tdTitle">操作时间</td>
                                    <td width="170" v-html="item.createTime"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </el-collapse-item>
        </div>
    </div>
  </el-collapse>

</template>
<script>
import * as storage from '@/utils/storage';
import routerConfig from '@/router/routerConfig';
import {
        updateOrderWarehouse,
        getCountryList,
        updateOrderAddr,
        whetherShip,
    } from '../../../../api/orderDetail/index';
import {getLogisticsListNew,} from '../../../../api/orderInfo/componentjs';
export default {
    name: "OrderDetail",
    props: {
      operationOrderSingle: {//控制当前组件显示和隐藏
        type: Object,
        default: {}
      },
      obtainOrderDetails: {//获取当前订单的详细信息
        type: Object,
        default: {}
      },
      skuInfo:{//通过sku来获取产品信息
        type: Object,
        default: {}
      },
      deleteTips:{//用来用来清除备注提示
        type:Boolean
      },
      orderDetailsCustomerComplaintInfo:{//用来展示的多条客诉信息
          type:Object,
          default: {}
      },
      order:{//用来展示的多条客诉信息
          type:Object,
          default: {}
      }
    },
    data() {
      return {
        isEditShippingAddress:false,
        isLogisticsDetailsInfo:false,
        orderInfo: {
            remarkType: '订单备注',
            orderInfoRemarks:'',//订单备注信息
        },
        rules:{
            // orderInfoRemarks: [
            //     { required: true,message: "备注填写不能为空",trigger: 'blur' },
            //     { max: 100, message: '不能超过100个字符!' }
            // ],
        },
        options: [{
          value: '订单备注',
          label: '订单备注'
        }, {
          value: '出货备注',
          label: '出货备注'
        }],
        productInfo:{
            chinese_title:[{required: true,message: '产品标题不能为空',trigger: 'blur'}],
            sku:[{required: true,message: '产品SKU不能为空',trigger: 'blur'}],
            quantity:[
                {required: true,message: '产品数量不能为空',trigger: 'blur'},
                {pattern: /^\+?[1-9][0-9]*$/,message: '产品数量只能为正整数'}
            ],
            sale_price:[{required: true,message: '平台卖价不能为空',trigger: 'blur'},{pattern: /^(([0-9][0-9]+)||[0-9])((\.[0-9][0-9])||\.[0-9])?$/,message: '平台卖价只能为数字，且只能保留小数点后两位！'}],
            ship_price:[{required: true,message: '总运费不能为空',trigger: 'blur'},{pattern: /^[0-9]+((\.[0-9][0-9])||\.[0-9])?$/,message: '总运费只能为非负数，且只能保留小数点后两位！'}],
        },
        activeNames: ['orderInfo','productInfo','transactionRecord','packageInfo','profitInfo','storageLogistics','afterSaleInfo','operationJournal','refundInfo','returnGoodsInfo','reSendInfo','reSendProductInfo','reSendReceivingAddressInfo','reSendWarehouseLogisticsInfo','reSendOrderDeliverGoodsInfo'],
        editProduct:false,
        product:{
            info:[],
            number:0,
        },
        logisticsDetailsRules:{
            warehouse_name:[{required: true,message: '发货仓库不能为空',trigger: 'blur'}],
            ship_name:[{required: true,message: '邮寄方式不能为空',trigger: 'blur'}],
        },
        logisticsDetailsInfo:{
            warehouse_name:'',
            ship_name:""
        },
        orderEditRules:{
            buyer_id:[{required: true,message: '买家ID不能为空',trigger: 'blur'}],
            email:[{required: true,message: '客户邮箱不能为空',trigger: 'blur'}],
            ship_name:[{required: true,message: '收件人不能为空',trigger: 'blur'}],
            ship_street1:[{required: true,message: '地址1不能为空',trigger: 'blur'}],
            ship_city_name:[{required: true,message: '城市不能为空',trigger: 'blur'}],
            ship_country:[{required: true,message: '国家不能为空',trigger: 'blur'}],
            ship_zip:[{required: true,message: '邮编不能为空',trigger: 'blur'}],
        },
        orderEditInfo:{
            order_id:"",
            platform_code:"",
            ship_city_name:"",
            ship_country:"",
            ship_name:"",
            ship_phone:"",
            ship_stateorprovince:"",
            ship_street1:"",
            ship_street2:"",
            ship_zip:"",
            buyer_id:"",
            email:""
        },
        countryList:[],
        //联动物流方式
        ship_code:{},
      }
    },
    methods: {
        updateOrderWarehouse,
        getCountryList,
        updateOrderAddr,
      handleAddRemarksInfo() {
        this.$refs.orderInfoRemarks.validate((valid) => {
            if (valid) {
                this.$emit('handleSaveRemark', this.orderInfo,'orderInfoRemarks',this.obtainOrderDetails.orderDetailsInfo.platform_code)
                this.$refs['orderInfoRemarks'].resetFields();
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      //订单详细信息删除备注
      handleremoveRemark(data){
        //   console.log(data)
          let obj={}
          if(data){
              obj={
                  id:data.id,
                  order_id:this.obtainOrderDetails.orderInfo.order_id,
              }
          }else{
              obj={
                  order_id:this.obtainOrderDetails.orderInfo.order_id,
                  platform_code:this.obtainOrderDetails.orderInfo.platform_code,
                  type:1
              }
          }
        this.$emit('handleOrderDeleteRemark', obj)
      },
      //删除产品信息
      elCircleRemoveOutline(product,index){
                    this.product.info[index].is_delete=1;
                    this.product.info[index].is_erp=1;
                    this.product.info[index].bool = false;
                    this.product.number=0
                    this.product.info.forEach(element => {
                        if(element.bool)this.product.number++;
                    });
      },
      //新增产品信息
      elCirclePlusOutline(){
          let obj={
                asinval: "",
                availablestock: '',
                item_id: "",
                qs: '',
                quantity: '',
                ship_price: '',
                sku: "",
                status: '',
                title: "",
                chinese_title:'',
                total_price: '',
                transit_qty: '',
                editsku:'',
                sale_price:'',
                product_id:'',
                is_delete:'',
                is_erp:'',
                bool:true,
          }
          this.product.info.push(obj)
          this.product.number=0
            this.product.info.forEach((element,index) => {
                if(index<this.obtainOrderDetails.proDetailsInfo.length&&!element.product_id)element.product_id = this.obtainOrderDetails.proDetailsInfo[index].order_detail_id;
                if(element.bool)this.product.number++;
            });
      },
      //确定保存产品信息
      handleDetermine(){
            this.$refs.productInfo.validate((valid) => {
                if (valid) {
                    this.product.info.forEach(element => {
                        if(!element.editsku)element.editsku = element.sku
                    });
                    this.$emit('handleProductInfoAddDeleteEdit',this.product.info)
                    this.handleCancel()

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
      },
      //根据sku获取产品信息
      handleProErpSku(item, i){
          for (let index = 0; index < this.product.info.length; index++) {
              if((item.sku == this.product.info[index].sku)&&(index!=i)&&(this.product.info[index].is_delete=='')){
                    item.sku='';
                    this.$message.warning('存在重复SKU！');
                    return false;
                }
          }
            if(item.sku==''){
                return false;
            }else{
                this.$emit('handleProErpSku',item.sku)
            }
      },
      //取消按钮
      handleCancel(){
            this.product.info.forEach((element,index) => {
                if(element.is_delete==1)this.product.info.splice(index,1);
            });
          this.editProduct=false;
          this.$refs.productInfo.resetFields();
          this.product.info=[];
          for(let index=0;index<this.obtainOrderDetails.proDetailsInfo.length;index++){
            this.product.info[index]={
                chinese_title:this.obtainOrderDetails.proDetailsInfo[index].chinese_title,
                sku:this.obtainOrderDetails.proDetailsInfo[index].sku,
                quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,
                sale_price:this.obtainOrderDetails.proDetailsInfo[index].sale_price,
                ship_price:this.obtainOrderDetails.proDetailsInfo[index].ship_price,
                qs:this.obtainOrderDetails.proDetailsInfo[index].qs,
                availablestock:this.obtainOrderDetails.proDetailsInfo[index].availablestock,
                transit_qty:this.obtainOrderDetails.proDetailsInfo[index].transit_qty,
                total_price:this.obtainOrderDetails.proDetailsInfo[index].total_price,
                item_id:this.obtainOrderDetails.proDetailsInfo[index].item_id,
                is_delete:'',
                is_erp:'',
                product_id:this.obtainOrderDetails.proDetailsInfo[index].order_detail_id,
                bool:true,
            }
        }
        this.product.number=0
        this.product.info.forEach(element => {
            if(element.bool)this.product.number++;
        });
      },
      //计算当前商品的总金额
      HandleCalculationTotalAmount(item,index){
          item.total_price = parseFloat(item.quantity*item.sale_price)+parseFloat(item.ship_price)
          this.$forceUpdate()
      },
      handleEditProductShow(){
            if(this.order.editInfo){
                if(!this.handleWhetherShip()){
                    return
                }
            }
          this.editProduct=true;
          this.$refs['orderInfoRemarks'].resetFields();
            if(this.obtainOrderDetails.proDetailsInfo.length>0){
                for(let index=0;index<this.obtainOrderDetails.proDetailsInfo.length;index++){
                    this.$set(this.product.info, index, {
                        chinese_title:this.obtainOrderDetails.proDetailsInfo[index].chinese_title||this.obtainOrderDetails.proDetailsInfo[index].title,
                        sku:this.obtainOrderDetails.proDetailsInfo[index].sku,
                        editsku:this.obtainOrderDetails.proDetailsInfo[index].product_bind_code,
                        quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,
                        sale_price:this.obtainOrderDetails.proDetailsInfo[index].sale_price,
                        ship_price:this.obtainOrderDetails.proDetailsInfo[index].ship_price,
                        qs:this.obtainOrderDetails.proDetailsInfo[index].qs,
                        availablestock:this.obtainOrderDetails.proDetailsInfo[index].availablestock,
                        transit_qty:this.obtainOrderDetails.proDetailsInfo[index].transit_qty,
                        total_price:this.obtainOrderDetails.proDetailsInfo[index].total_price,
                        item_id:this.obtainOrderDetails.proDetailsInfo[index].item_id,
                        asinval:this.obtainOrderDetails.proDetailsInfo[index].asinval,
                        product_id:this.obtainOrderDetails.proDetailsInfo[index].order_detail_id,
                        is_delete:'',
                        is_erp:'1',
                        bool:true,
                    })
                }
                this.product.number=0
                this.product.info.forEach(element => {
                    if(element.bool)this.product.number++;
                });
            }
      },
      handleCustomerReviewsFeedBack(id){

            this.$router.push({path:'/CustomerReviewsFeedBack',query:{type: "OrderInformation", order_id: id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/CustomerReviewsFeedBack')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        this.$emit('handleFeedBackEvent',id);
      },
      handleCustomerEvaluationReview(id){
            this.$router.push({path:'/CustomerEvaluationReview',query:{type:"OrderInformation",order_id: id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/CustomerEvaluationReview')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        this.$emit('handleReviewEvent',id);
      },
      handleSkuInfo(data){

      },
      //联系买家
        handleContactBuyers(){
            let orderId= this.obtainOrderDetails.orderDetailsInfo.order_id;
            let acctEmail= this.obtainOrderDetails.orderDetailsInfo.acct_email;
            let emailCustomer= this.obtainOrderDetails.orderDetailsInfo.email;
            let path = '/PostMail';
            let query = {type: "OrderInformation", order_id: orderId, acct_email: acctEmail, email: emailCustomer, goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
            this.$router.push({path, query});
            this.changeNavShowFn(path, query);
        },
        changeNavShowFn(path, query = {}) {
            query = query || {};
            let idx = routerConfig.getRouteIndex(path);
            let to = routerConfig.navJumpFn(idx);
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name: to.name,
                index: idx,
                query
            });
            this.$store.commit('SAVE_NAV_INDEX', idx);
        },
        //售后单跳转
        handleAfterSaleList(item){
            let string='';
            if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'){
                string='/AfterSalesOrderManagement';
            }else if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='EB'){
                string='/EbayAfterSalesOrderManagement';
            }
            this.$router.push({path:string,query:{after_order_number: item.after_sale_id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex(string)
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
                // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
            this.$emit('handleAfterSaleList',item);
        },
        handleClickImg(url){
            this.$emit("handleClickImg",url);
        },
        handleobtainReturnCode(){
            this.$emit('handleobtainReturnCode');
        },
        //纠纷跳转
        handleDisputeCenter(id){
            this.$router.push({path:'/DisputeCenter',query:{type:"OrderInformation",order_id: id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/DisputeCenter')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
            this.$emit('handleDisputeEvent',id);
        },
        //跳转邮件处理
        handleMailProcessing(){
            console.log(this.$router.history.current.path)
        },
        //跳客诉列表
        handleComplaintOrder(item){
            let string='';
            if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'){
                string='/CustomerComplaintList';
            }else if(this.obtainOrderDetails.orderDetailsInfo.platform_code==='EB'){
                string='/EbayCustomerComplaintList';
            }
            this.$router.push({path:string,query:{customer_complaint_number: item.complaint_order, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex(string)
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
            this.$emit('handleComplaintOrder',item.complaint_order);
        },
        //物流信息编辑
        handleEditlogisticsDetails(){
            if(this.order.editInfo){
                if(!this.handleWhetherShip()){
                    return
                }
            }
            this.logisticsDetailsInfo={
                warehouse_name: String(this.obtainOrderDetails.logisticsDetailsInfo.warehouse_id),
                ship_name: String(this.obtainOrderDetails.logisticsDetailsInfo.ship_code),
            }
            this.handleGetShipCode(this.logisticsDetailsInfo.warehouse_name,false);
            this.isLogisticsDetailsInfo = true;
        },
        //关闭物流信息编辑
        handlelogisticsDetailsCancel(){
            this.isLogisticsDetailsInfo = false;
            this.logisticsDetailsInfo={
                warehouse_name:'',
                ship_name:""
            }
            this.$refs['logisticsDetailsInfo'].resetFields();
        },
        //提交编辑后物流信息
        handlelogisticsDetailsDetermine(){
            this.$refs.logisticsDetailsInfo.validate((valid) => {
                if (valid) {
                    let obj = {
                        order_id: this.obtainOrderDetails.orderInfo.order_id,
                        platform_code: this.obtainOrderDetails.orderInfo.platform_code,
                        warehouse_id: this.logisticsDetailsInfo.warehouse_name,
                        ship_code: this.logisticsDetailsInfo.ship_name,
                        repair:""
                    }
                    let str="";
                    if(this.obtainOrderDetails.orderDetailsInfo.platform_code=='AMAZON'){
                        str="order_details";
                    }else if(this.obtainOrderDetails.orderDetailsInfo.platform_code=='EB'){
                        str="ebay_order_details";
                    }
                    this.updateOrderWarehouse(obj,str).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess);
                            return
                        }else{
                            this.$message.success('操作成功！');
                            this.handlelogisticsDetailsCancel();
                            this.$emit('handlelogisticsDetailsDetermine');
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // filterMethod(query) {
        //     if (query !== '') {
        //             let number = 0;
        //             this.optionsListShow = this.optionList.account_list.filter(item => {
        //                 if(number>=100){
        //                     return false;
        //                 }else{
        //                     if(item.label.indexOf(query)>-1){
        //                         number++;
        //                     }
        //                     return item.label.indexOf(query)>-1;
        //                 }
        //             });
        //     } else {
        //         this.optionsListShow = [];
        //     }
        //     this.$forceUpdate();
        // },

        //编辑发货地址
        handleEditShippingAddress(){
            if(this.order.editInfo){
                if(!this.handleWhetherShip()){
                    return
                }
            }
            this.orderEditInfo={
                order_id: this.obtainOrderDetails.orderInfo.order_id,
                platform_code: this.obtainOrderDetails.orderInfo.platform_code,
                ship_city_name: this.obtainOrderDetails.orderDetailsInfo.ship_city_name,
                ship_country: this.obtainOrderDetails.orderDetailsInfo.ship_country,
                ship_name: this.obtainOrderDetails.orderDetailsInfo.ship_name,
                ship_phone: this.obtainOrderDetails.orderDetailsInfo.ship_phone,
                ship_stateorprovince: this.obtainOrderDetails.orderDetailsInfo.ship_stateorprovince,
                ship_street1: this.obtainOrderDetails.orderDetailsInfo.ship_street1,
                ship_street2: this.obtainOrderDetails.orderDetailsInfo.ship_street2,
                ship_zip: this.obtainOrderDetails.orderDetailsInfo.ship_zip,
                buyer_id: this.obtainOrderDetails.orderDetailsInfo.buyer_id,
                email: this.obtainOrderDetails.orderDetailsInfo.email,
            }
            this.isEditShippingAddress = true;
        },

        //发货地址取消编辑
        handleOrderEditInfoCancel(){
            this.isEditShippingAddress = false;
            this.$refs['orderEditInfo'].resetFields();
        },

        //发货地址编辑提交
        handleOrderEditInfoDetermine(){
            this.$refs.orderEditInfo.validate((valid) => {
                if (valid) {
                    let str="";
                    if(this.obtainOrderDetails.orderDetailsInfo.platform_code=='AMAZON'){
                        str="order_details";
                    }else if(this.obtainOrderDetails.orderDetailsInfo.platform_code=='EB'){
                        str="ebay_order_details";
                    }
                    this.updateOrderAddr(this.orderEditInfo,str).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess);
                            return
                        }else{
                            this.$message.success('操作成功！');
                            this.handleOrderEditInfoCancel();
                            this.$emit('handlelogisticsDetailsDetermine');
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //消息跳转
        goMessagejump(){
            this.$router.push({path:'/EbayMessage',query:{type:"OrderInformation",order_id: this.obtainOrderDetails.orderInfo.order_id, message_type: 2, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/EbayMessage')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        },
        // //return跳转
        // goReturnjump(id){
        //     this.$router.push({path:'/EbayReturn',query:{type:"OrderInformation",return_id: id, _cacheType:'1'}});
        //     let inx = routerConfig.getRouteIndex('/EbayReturn')
        //     storage.setSessionStorage('navActive', inx);
        //     let to = routerConfig.navJumpFn(inx);
        //     this.$store.commit('SAVE_NAV_INDEX', inx);
        //     // 保存到多页签
        //     this.$store.commit('SAVE_TAB_LABELS', {
        //         path: to.path,
        //         name:  to.name,
        //         index: inx
        //     });
        // },
        // //inr跳转
        // goINRjump(id){
        //     this.$router.push({path:'/EbayINR',query:{type:"OrderInformation",inquiry_id: id, _cacheType:'1'}});
        //     let inx = routerConfig.getRouteIndex('/EbayINR')
        //     storage.setSessionStorage('navActive', inx);
        //     let to = routerConfig.navJumpFn(inx);
        //     this.$store.commit('SAVE_NAV_INDEX', inx);
        //     // 保存到多页签
        //     this.$store.commit('SAVE_TAB_LABELS', {
        //         path: to.path,
        //         name:  to.name,
        //         index: inx
        //     });
        // },
        // //cancel跳转
        // goCanceljump(id){
        //     this.$router.push({path:'/EbayCancel',query:{type:"OrderInformation",cancel_id: id, _cacheType:'1'}});
        //     let inx = routerConfig.getRouteIndex('/EbayCancel')
        //     storage.setSessionStorage('navActive', inx);
        //     let to = routerConfig.navJumpFn(inx);
        //     this.$store.commit('SAVE_NAV_INDEX', inx);
        //     // 保存到多页签
        //     this.$store.commit('SAVE_TAB_LABELS', {
        //         path: to.path,
        //         name:  to.name,
        //         index: inx
        //     });
        // },
        //评价跳转
        goFeedbackjump(id){
            this.$router.push({path:'/EbayEvaluateFeedBack',query:{type:"OrderInformation",item_id:id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/EbayEvaluateFeedBack')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        },
        //EB消息跳转
        goEbMessagejump(id){
            this.$router.push({path:'/EbayMessage',query:{type:"OrderInformation", item_id:id, order_id: this.obtainOrderDetails.orderInfo.order_id, message_type: 2, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/EbayMessage')
            storage.setSessionStorage('navActive', inx);
            let to = routerConfig.navJumpFn(inx);
            this.$store.commit('SAVE_NAV_INDEX', inx);
            // 保存到多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name:  to.name,
                index: inx
            });
        },
        //国内退件修改信息 whetherShip
        handleWhetherShip(){
            let obj = {
                order_id: this.order.order_id,
                platform_code: this.order.platform_code,
                track_no: this.order.editInfo.trackno,
            };
            whetherShip(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return
                }else{
                    return data.status
                }
            });
        },
        //物流方式二级联动
        handleGetShipCode(id,bool){
            if(bool)this.logisticsDetailsInfo.ship_name = '';
            getLogisticsListNew({ship_warehouse:id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return
                }
                this.ship_code = data.data_list.ship_code;
            });
        },
        handlePageINR(row){
            if(this.orderInfo.operation==='handlePageINR')return;
            this.orderInfo={
                order_id:this.obtainOrderDetails.orderInfo.order_id,
                platform_code:'EB',
                edit:false,
                dispute:true,
                row:row,
                title:'INR处理',
                operation:'handlePageINR'
            }
            this.isOrderInfoShow=true;
            this.$emit('handleGoDispute',this.orderInfo,this.isOrderInfoShow)
        },
        handlePageReturn(row){
            if(this.orderInfo.operation==='handlePageReturn')return;
            this.orderInfo={
                order_id:this.obtainOrderDetails.orderInfo.order_id,
                platform_code:'EB',
                edit:false,
                dispute:true,
                row:row,
                title:'Return处理',
                operation:'handlePageReturn'
            }
            this.isOrderInfoShow=true;
            this.$emit('handleGoDispute',this.orderInfo,this.isOrderInfoShow)
        },
        handleCancel(row){
            if(this.orderInfo.operation==='handlePageCancel')return;
            this.orderInfo={
                order_id:this.obtainOrderDetails.orderInfo.order_id,
                platform_code:'EB',
                edit:false,
                dispute:true,
                row:row,
                title:'Cancel处理',
                operation:'handlePageCancel'
            }
            this.isOrderInfoShow=true;
            this.$emit('handleGoDispute',this.orderInfo,this.isOrderInfoShow)
        }
    },
    watch:{
        skuInfo(val, old){
            for(let index=0;index<this.product.info.length;index++){
                if(val.sku == this.product.info[index].sku&&this.product.info[index].bool){
                    this.product.info[index].chinese_title = val.title
                    this.product.info[index].sale_price = 0
                    this.product.info[index].ship_price = 0
                    this.product.info[index].total_price = val.total_price
                    this.product.info[index].editsku = this.product.info[0].sku
                    this.product.info[index].product_id = ''
                    this.product.info[index].quantity = val.quantity
                    this.product.info[index].sku = val.sku
                    this.product.info[index].qs = val.qs?val.qs:0
                    this.product.info[index].availablestock = val.availablestock?val.availablestock:0
                    this.product.info[index].asinval = val.asinval?val.asinval:0
                    this.product.info[index].item_id = val.item_id?val.item_id:0
                    this.product.info[index].transit_qty = val.transit_qty?val.transit_qty:0
                    this.product.info[index].is_delete='',
                    this.product.info[index].is_erp='',
                    this.product.info[index].bool = true
                    // this.product.number=0
                    if(this.product.info[index].bool)this.product.number++;
                }
                if(index<this.obtainOrderDetails.proDetailsInfo.length&&!this.product.info[index].product_id)this.product.info[index].product_id = this.obtainOrderDetails.proDetailsInfo[index].order_detail_id;
            }

            this.$forceUpdate();
        },
        operationOrderSingle(val, old){
            this.$refs['orderInfoRemarks'].resetFields();
        },
        deleteTips(val, old){
            this.$refs['orderInfoRemarks'].resetFields();
        },
    },

    created(){
        this.getCountryList().then(({data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess);
                return
            }else{
                this.countryList = data.data_list.values;
            }
        })
        
    }
};
</script>
<style lang="less" scoped>
    .el-collapse-item.headerInfoScrollTop.is-active{
        /deep/.el-collapse-item__header.is-active{
                padding: 0 0 0 10px;
            }
    }
    /deep/.el-collapse{
        border-top:0 none;
        .el-collapse-item__header{
            background-color: #FAFAFA;
            border: 1px solid #E6E6E6;
            padding-left: 20px;
            font-family: "Microsoft YaHei","微软雅黑";
            font-weight: 700;
            font-style: normal;
            margin-top:10px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
        }
        .el-collapse-item__arrow.el-icon-arrow-right{
            height: 30px;
            line-height: 30px;
        }
        .el-collapse-item__wrap{
            border-bottom: 0 none;
        }
        .el-collapse-item__content{
            padding-bottom: 0;
            font-size: 12px;
        }
    }
    .orderInformationMain{
        background-color: white;
        border: 1px solid #e6e6e6;
        border-top: 0 none;
        margin-bottom: 10px;
        padding: 20px 20px 20px 20px;
        font-size: 12px;
        .orderInformationMainLeft{
            border: 1px solid #EFEFEF;
            padding: 10px;
            margin-top: 10px;
            margin-right: 10px;
            overflow: auto;
        }
        .orderInformationMainRight{
            border: 1px solid #EFEFEF;
            padding: 10px;
            overflow: auto;
        }
        .orderInformationMainInfo{
            border: 1px solid #e6e6e6;
            border-top: 0 none;
            padding: 10px 10px;
        }
        table{
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
            word-wrap:break-word;
            word-break:break-all;
            font-weight: 100;
            color: #333333;
            td{
                border-top: 1px solid #e6e6e6;
                border-left: 1px solid #e6e6e6;
                padding: 7px 5px;
                /deep/.el-form-item__content{
                    line-height: 28px;
                }
            }
            .tdTitle{
                width: 80px !important;
                background-color: #FAFAFA !important;
                height: auto !important;
                color: #333333;
            }
            .tdContent{
                width: 160px !important;
                height: auto !important;
                color: #333333;
            }
        }
        .orderInfoTitle{
            line-height: 35px;
            font-family: "Microsoft YaHei","微软雅黑";
            font-style: normal;
        }

        .addRemarks.el-textarea.el-input--mini{
            width: 600px;
        }
        .el-button.el-button--primary.el-button--mini,.el-button--small{
            margin: 5px 0;
        }
        .remarks{
            color: #FF9804;
        }
        /deep/.is-required .el-form-item__label::before{
            position: static;
        }
        .el-form-item__content{
            position: static;
        }
        .el-form{
            display: flex;
        }
        .el-textarea{
            width: 100%;
            max-width:1100px;
        }
        .rowSpacing{
            padding-bottom: 10px;
            display: flex;
            div{
                margin-right: 20px;
            }
        }
        .rowSpacingObtain{
            div{
                width: 50%;
                .el-input{
                    width: 100%;
                    max-width:200px;
                }
            }
        }
        .returnGoods{
            width: 100%;
            max-width:1100px;
            justify-content: space-between;
            .el-input{
                width: 100%;
                max-width:200px;
            }
            .el-select.el-select--small{
                width: 100%;
                max-width:200px;
            }
        }
        .reSendInfo{
            display: block;
            .el-input{
                width: 100%;
                max-width:1000px;
            }
        }
        .bottom{
            text-align: center;
        }
    }
    /deep/.el-form-item__label{
        font-size: 12px !important;
    }
    .addRemarksInfo{
        /deep/.el-form-item__content{
            line-height: 28px;
            .addRemarks.el-input.el-input--mini{
                line-height: 28px;
            }
        }
        /deep/.el-form-item__error{
            margin-left: 10px;
            padding-top: 3px;
        }
        .el-button.el-button--primary.el-button--mini{
            margin: 0;
        }
        .el-select.el-select--mini{
            width: 100px;
            /deep/.el-input.el-input--mini.el-input--suffix{
                width: 100px;
            }
        }
        .addRemarks{

            margin: 0 10px;
        }
        display: flex;
    }
    .headerColor{
      background-color: #FAFAFA;
    }
    .remarkStyle{
        border: 1px transparent;
        display: flex;
        position: relative;
        padding-right: 25px;
        i{
            font-size: 18px;
            position: absolute;
            right: 5px;
            display: none;
            cursor: pointer;
        }
    }
    .remarkStyle:hover{
        background-color: #FCF8EC;
    }
    .remarkStyle:hover i{
        display: inline;
    }
    /deep/#el-collapse-head-7126{
        margin-top: 0;
    }
    #orderInfoAnchor{
        /deep/.el-collapse-item__header.is-active{
            margin-top: 0;
        }
    }
    table{
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
            word-wrap:break-word;
            word-break:break-all;
            font-weight: 100;
            color: #333333;
            td{
                border-top: 1px solid #e6e6e6;
                border-left: 1px solid #e6e6e6;
                padding: 7px 5px;
            }
    }
    .orderEditInfo{
        border-top:1px solid #C9C9C9;
        .el-form{
            display: block;
        }
    }
</style>
<style>
.CustomerComplaint{
    max-height: 300px;
    overflow-y: auto;
}
</style>