<template>
    <div class="TemplatePagewrap">
        <div class="TemplatePagebox">

            <div class="ui-main-module">
                <!-- 查询参数 -->
                <transition name="slide-fade">
                    <div class="ui-search-area" v-show="showSearch">
                        <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo($event, false, true)' @handleResetQueryInfo='handleResetQueryInfo' @handleLoadOk='searchHeight = !searchHeight'>
                        </ComSearchCondition>
                    </div>
                </transition>

                <!-- 操作按钮 -->
                <div class="ui-fn-module">
                    <span class="ui-top_i" @click="showSearch = !showSearch">
                        <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
                    </span>
                    <el-button size="small" type="text" @click="batchOrderToVoid" v-if="buttonList['batchObsolete'].permit(thisVm)" style='color: #333333 !important;'>
                        <i class="icon-piliangzuofei" style="color: #bb8fec;font-size:12px;"></i>批量作废</el-button>
                    <el-button size="small" type="text" @click="batchOrderWithhold" v-if="buttonList['batchHold'].permit(thisVm)" style='color: #333333 !important;'>
                        <i class="icon-piliangzankou1" style="color: #fa686c;font-size:12px;"></i>批量暂扣</el-button>
                    <el-button size="small" type="text" @click="batchCancelOrderWithhold" v-if="buttonList['batchCancelHold'].permit(thisVm)" style='color: #333333 !important;'>
                        <i class="icon-piliangquxiaozankou1" style="color: orange;font-size:12px;"></i>批量取消暂扣</el-button>
                    <el-button size="small" type="text" @click="handleBatchRemarks" v-if="buttonList['batchRemark'].permit(thisVm)" style='color: #333333 !important;'>
                        <i class="icon-piliangbeizhu1" style="color: #75b1fc;font-size:12px;"></i>批量备注</el-button>
                    <!-- <el-button type="text" size="small"><i class="icon-shujuxiazai" style="color: #72afff;font-size:12px;"></i>下载指定数据</el-button> -->
                    <el-button type="text" size="small" @click="handleMessageContact('',false)"><i class="icon-lianxi" style="color: #75b1fc;font-size:12px;"></i>批量消息联系</el-button>
                </div>

                <!-- 主体表格 -->
                <ComTableInfo
                    isCheck
                    :tableKey="tableKey"
                    :tableProps="tableProps"
                    :tableWidth="tableWidth"
                    :tableData="tableData"
                    :showSearch="showSearch"
                    :searchHeight="searchHeight"
                    @checked="handleSaveCheckInfo"
                    :tableLoading="tableLoading">
                    <!-- 基础信息 -->
                    <template slot-scope="scope" slot="basicsInfo">
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单号：</div>
                            <div style="word-wrap:break-word;cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">平台订单号：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.platform_order_id}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">order_number：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.order_number?scope.row.order_number:"无"}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">平台账号：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.account_name}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">客服人员：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.user_name}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单备注：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.remark}}</div>
                        </div>
                        <!-- <div>订单号：{{scope.row.order_id}}</div>
                        <div>平台订单号：{{scope.row.platform_order_id}}</div>
                        <div>平台账号：{{scope.row.account_name}}</div>
                        <div>订单备注：{{scope.row.order_remark}}</div> -->
                    </template>
                    <!-- 订单信息 -->
                    <template slot-scope="scope" slot="orderInfo">
                        <div>订单状态：
                            <span class="ui-state_circle grayColor" v-if="scope.row.complete_status === '初始化'"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.complete_status === '正常'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.complete_status === '异常'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.complete_status === '缺货'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.complete_status === '已备货'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.complete_status === '待发货'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.complete_status === '超期'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.complete_status === '部分发货'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.complete_status === '已发货'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.complete_status === '暂扣'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.complete_status === '已取消'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.complete_status === '已完成'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.complete_status === '通途系统处理订单'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.complete_status === '待检测paypal账号'"></span>
                            {{scope.row.complete_status}}
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单类型：</div>
                            <div style="flex:1;word-wrap:break-word;color:red;" v-if="scope.row.order_type==='合并后的订单'||scope.row.order_type==='拆分的主订单'||scope.row.order_type==='被合并的订单'||scope.row.order_type==='拆分后的子订单'">{{scope.row.order_type}}</div>
                            <div style="flex:1;word-wrap:break-word;" v-else>{{scope.row.order_type}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单金额：</div>
                            <div style="flex:1;word-wrap:break-word;"><span style="color:#ff9900;font-weight: 700;">{{scope.row.total_price}} {{scope.row.currency}}</span></div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">下单时间：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.created_time}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">付款时间：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.paytime}}</div>
                        </div>
                        <!-- <div>订单状态：{{scope.row.order_status}}</div>
                        <div>订单类型：{{scope.row.order_type}}</div>
                        <div>订单金额：{{scope.row.total_price}}</div>
                        <div>下单时间：{{scope.row.created_time}}</div>
                        <div>付款时间：{{scope.row.paytime}}</div> -->
                    </template>
                    <!-- 产品信息 -->
                    <template slot-scope="scope" slot="productInfo">
                        <div>Item ID：
                            <span style="cursor: pointer;color: #409EFF;" v-if="scope.row.order_comm_detail_list.length">
                                <a :href="scope.row.order_comm_detail_list[0].item_url" target="_Blank">{{scope.row.order_comm_detail_list[0]&&scope.row.order_comm_detail_list[0].item_id}}</a>
                            </span>
                        </div>
                        <div style="display: flex;">
                            <div style="width:60px;line-height: 15px;flex-shrink:0;white-space:nowrap;">公司SKU：</div>
                            <div v-if="scope.row.order_comm_detail_list.length">
                                <el-popover placement="right" width="400px" trigger="hover">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td width="30">序号</td>
                                            <td width="50">SKU</td>
                                            <td width="220">产品名称</td>
                                            <td width="30">数量</td>
                                        </tr>
                                        <tr v-for="(item,index) in scope.row.order_comm_detail_list">
                                            <td>{{index+1}}</td>
                                            <td>
                                                <div style="cursor: pointer;color: #409EFF;">
                                                    <a :href="item.sku_url" target="_Blank">{{item.sku}}</a>
                                                </div>
                                            </td>
                                            <td>{{item.title}}</td>
                                            <td>{{item.quantity}}</td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;flex:1;display: block;" slot="reference">
                                        {{scope.row.order_comm_detail_list[0]&&scope.row.order_comm_detail_list[0].sku}}
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                        <!-- <div>公司SKU：{{scope.row.order_comm_detail_list[0]&&scope.row.order_comm_detail_list[0].sku}}</div> -->
                        <div>产品名称：<span v-if="scope.row.order_comm_detail_list.length">{{scope.row.order_comm_detail_list[0].title}}</span></div>
                        <div>公司产品线：<span v-if="scope.row.order_comm_detail_list.length">{{scope.row.order_comm_detail_list[0].linelist_cn_name}}</span></div>
                    </template>
                    <!-- 物流信息 -->
                    <template slot-scope="scope" slot="logisticsInfo">
                        <div>发货时间：{{scope.row.shipped_date}}</div>
                        <div>发货仓库：{{scope.row.warehouse_name}}</div>
                        <div>仓库类型：{{scope.row.warehouse_type}}</div>
                        <div>虚拟仓类型：{{scope.row.warehouse_second_category}}</div>
                        <div>发货方式：{{scope.row.real_ship_code}}</div>
                        <div>跟踪号：<a :href="'https://t.17track.net/en#nums=' + scope.row.track_number" style="color: #3388ff;" target="_blank">{{scope.row.track_number}}</a></div>
                        <div>收货国家：{{scope.row.ship_country}}</div>
                    </template>
                    <!-- 关联信息 -->
                    <template slot-scope="scope" slot="relationState">
                        <div style="display:flex;">
                            <div>纠纷状态：</div>
                            <div style="margin-left:4px;">
                                <span class="ui-state_circle grayColor" v-if="!scope.row.disput_list.length"></span>
                                <span  v-if="scope.row.disput_list.length">
                                    <span class="ui-state_circle orangeColor" v-if="scope.row.disput_list[0].is_deal === '未处理'"></span>
                                    <span class="ui-state_circle blueColor" v-if="scope.row.disput_list[0].is_deal === '处理中'"></span>
                                    <span class="ui-state_circle greenColor" v-if="scope.row.disput_list[0].is_deal === '已处理'"></span>
                                </span>
                            </div>
                            <div style="margin-left:3px;" v-if="!scope.row.disput_list.length" v-html="'无纠纷'"></div>
                            <div v-if="scope.row.disput_list.length">
                                <el-popover placement="right" trigger="hover" width="300px" popper-class="afterId">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>ID</td>
                                            <td>纠纷类型</td>
                                            <td>处理状态</td>
                                        </tr>
                                        <tr v-for="(item,index) in scope.row.disput_list">
                                            <td>
                                                <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleGoDispute(item,scope.row)">{{item.inquiry_id||item.cancel_id||item.return_id}}</div>
                                            </td>
                                            <td>{{item.type}}</td>
                                            <td>
                                                {{item.is_deal}}
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference">{{scope.row.disput_list[0].is_deal}}</div>
                                </el-popover>
                            </div>
                        </div>
                        <div>消息状态：
                            <span class="ui-state_circle orangeColor" v-if="scope.row.is_replied === '未回复'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.is_replied === '标记已回复'"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.is_replied === '已回复'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.is_replied === '已回复未发送'"></span>
                            <span class="ui-state_circle grayColor" v-if="!scope.row.is_replied"></span>
                            <span v-show="!scope.row.is_replied" v-html="'无消息'"></span>
                            <span v-show="scope.row.is_replied">
                                <span style="cursor: pointer;color: #409EFF;" @click="goMessagejump(scope.row)">
                                    {{scope.row.is_replied}}
                                </span>
                            </span>
                        </div>
                        <div style="display:flex;"><div>评价状态： </div>
                            <div style="margin-left:4px;">
                                <span class="ui-state_circle grayColor" v-if="!scope.row.feedback_list.length"></span>
                                <span v-else>
                                    <span class="ui-state_circle orangeColor" v-if="scope.row.feedback_list[0].status === '未回复'"></span>
                                    <span class="ui-state_circle greenColor" v-if="scope.row.feedback_list[0].status === '已回复'"></span>
                                    <span class="ui-state_circle blueColor" v-if="scope.row.feedback_list[0].status === '标记回复'"></span>
                                </span>
                            </div>
                            <div v-if="!scope.row.feedback_list.length" style="margin-left:3px;">无评价</div>
                            <div v-else>
                                <el-popover placement="right" trigger="hover" width="300px" popper-class="afterId">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>评价ID</td>
                                            <td>评价状态</td>
                                            <td>评价级别</td>
                                        </tr>
                                        <tr v-for="(item,index) in scope.row.feedback_list">
                                            <td>{{item.id}}</td>
                                            <td><div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="goFeedBackjump(item)">{{item.status}}</div></td>
                                            <td>{{item.comment_type}}</td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference" v-show="scope.row.feedback_list.length">{{scope.row.feedback_list&&scope.row.feedback_list[0].status}}
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                        <div>退款状态：
                            <span class="ui-state_circle grayColor" v-if="scope.row.refund_status === '未发起退款'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.refund_status === '待退款'"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.refund_status === '退款完成'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.refund_status === '标记退款'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.refund_status === '退款失败'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '退款中'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '等待接受退款中'"></span>
                            {{scope.row.refund_status}}
                        </div>
                        <div style="display:flex;"><div>售后问题： </div>
                            <div style="margin-left:4px;">
                                <span class="ui-state_circle grayColor" v-if="scope.row.aftersales[0].aftersales"></span>
                                <span v-else>
                                    <span class="ui-state_circle orangeColor" v-if="scope.row.aftersales[0].type === '退货'"></span>
                                    <span class="ui-state_circle blueColor" v-if="scope.row.aftersales[0].type === '重寄'"></span>
                                    <span class="ui-state_circle redColor" v-if="scope.row.aftersales[0].type === '退款'"></span>
                                </span>
                            </div>
                            <div style="margin-left:3px;" v-if="scope.row.aftersales[0].aftersales">无售后</div>
                            <div v-if="!scope.row.aftersales[0].aftersales">
                                <el-popover placement="right" trigger="hover" width="300px" popper-class="afterId">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>序号</td>
                                            <td>售后类型</td>
                                            <td>售后单号</td>
                                        </tr>
                                        <tr v-for="(item,index) in scope.row.aftersales">
                                            <td>{{index+1}}</td>
                                            <td>{{item.type}}</td>
                                            <td>
                                                <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleAfterSaleList(item)">{{item.after_sale_id}}</div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference" v-show="!scope.row.aftersales[0].aftersales">
                                        {{scope.row.aftersales[0].type}}
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                        <div>退货编码：{{scope.row.auto_send}}</div>
                        <div>主动发信：
                            <span class="ui-state_circle grayColor" v-if="scope.row.auto_send === '有发信'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.auto_send === '无发信'"></span>
                            {{scope.row.auto_send}}
                        </div>
                        <!-- <div>售后问题：{{scope.row.type}}</div> -->
                    </template>
                    <!-- 买家信息 -->
                    <template slot-scope="scope" slot="buyerInfo">
                        <div>买家邮箱：{{scope.row.email}}</div>
                        <div>买家ID：{{scope.row.buyer_id}}</div>
                        <div>付款PP：{{scope.row.payer_email}}</div>
                    </template>
                    <!-- 操作 -->
                    <template slot-scope="scope" slot="operate">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <el-button type="text">操作<div class="triangle"></div>
                                </el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <span v-show="scope.row.complete_status=='已取消'?false:true">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="orderToVoid(scope.row)"
                                            v-if="buttonList['obsolete'].permit(thisVm)"
                                            :disabled="scope.row.complete_status==='部分发货'||scope.row.complete_status==='已发货'"
                                            >作废</el-button>
                                    </span>
                                    <span v-show="scope.row.complete_status=='已取消'?true:false">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="cancelOrderWithhold(scope.row,'2')"
                                            v-if="buttonList['cancelObsolete'].permit(thisVm)">取消作废</el-button>
                                    </span>
                                </el-dropdown-item>
                                <el-dropdown-item v-show="scope.row.complete_status==='已取消'||scope.row.complete_status==='已完成'?false:true">
                                    <span v-show="scope.row.complete_status=='暂扣'?false:true">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="orderWithhold(scope.row)"
                                            v-if="buttonList['hold'].permit(thisVm)"
                                            :disabled="scope.row.complete_status==='部分发货'||scope.row.complete_status==='已发货'"
                                            >暂扣</el-button>
                                    </span>
                                    <span v-show="scope.row.complete_status=='暂扣'?true:false">
                                        <el-button style="width:100%;font-size:12px;" type="text" @click="cancelOrderWithhold(scope.row,'1')"
                                            v-if="buttonList['cancelHold'].permit(thisVm)">取消暂扣</el-button>
                                    </span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="handleCancellationOrder(scope.row)"
                                        >取消订单</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="handleReceiptRequest(scope.row)"
                                        v-if="buttonList['receiptRequest'].permit(thisVm)">收款请求</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="handleRegisterGathering(scope.row)"
                                        v-if="buttonList['registeredPayment'].permit(thisVm)">登记收款</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" v-if="buttonList['newSalesOrder'].permit(thisVm)"
                                        @click="handleAfterSalesOrders(scope.row,'addNewAfterSaleSingle','新建售后单')">
                                            新建售后单</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" v-if="buttonList['registerRefundForm'].permit(thisVm)"
                                            @click="handleAfterSalesOrders(scope.row,'registeredRefundSlip','登记退款单')">
                                            登记退款单</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" v-if="buttonList['registerComplaintList'].permit(thisVm)"
                                        @click="handleAfterSalesOrders(scope.row,'registeredRCustomerComplaintSlip','登记客诉单')">
                                            登记客诉单</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" v-if="buttonList['messageContact'].permit(thisVm)&&scope.row.order_type!='合并后的订单'&&scope.row.order_type!='拆分后的子订单'&&scope.row.order_type!='重寄后的订单'"
                                        @click="handleMessageContact(scope.row,true)">消息联系</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="handleCommentOn(scope.row)"
                                        v-if="buttonList['commentOn'].permit(thisVm)&&scope.row.order_type!='合并后的订单'&&scope.row.order_type!='拆分后的子订单'&&scope.row.order_type!='重寄后的订单'">留评</el-button>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="orderInvoice(scope.row,false)"
                                        v-if="buttonList['invoice'].permit(thisVm)">发票</el-button>
                                </el-dropdown-item> -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="handleCancelClosingOrder(scope.row)"
                                        :disabled="((scope.row.complete_status==='部分发货'||scope.row.complete_status==='已发货')&&scope.row.order_type==='合并后的订单')||scope.row.order_type!=='合并后的订单'"
                                        v-if="buttonList['CancelClosingOrder'].permit(thisVm)">取消合单</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" @click="orderJournal(scope.row.order_id)"
                                        v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <ComDivide />
                        <el-button type="text" v-if="buttonList['deal'].permit(thisVm)" @click="handleOrderInfo(scope.row)">处理</el-button>
                    </template>
                </ComTableInfo>

                <!-- 分页 -->
                <div class="ui-main-module-page">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageData.currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageData.currentList"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageData.currentTotal">
                    </el-pagination>
                </div>
            </div>
            <!-- 点击暂扣、作废、批量暂扣、批量作废、批量备注弹窗 -->
            <el-dialog :title="isBatchOperation" width="440px" class="ui-layout_edit-dialog" :visible.sync="isBatchShow" @close="batchOperationCancel">
                <el-form label-width="80px" :model="BatchOperation" ref="BatchOperation" :rules="batchRules" v-if="!result.isShowResult">
                    <el-form-item label="订单号：" prop="batchOrderId">
                        <div style="width:320px;max-height:300px;overflow-y:auto;white-space:normal;word-break:break-all;word-wrap:break-word;"
                            v-html="BatchOperation.batchOrderId">
                            {{BatchOperation.batchOrderId}}</div>
                    </el-form-item>
                    <el-form-item label="平台：" prop="batchPlatform">
                        <div>{{BatchOperation.batchPlatform}}</div>
                    </el-form-item>
                    <el-form-item label="备注信息：" prop="batchRemark">
                        <el-input size="small" type="textarea" class="batchRemark" v-model="BatchOperation.batchRemark" placeholder="请输入内容,不能超过5000个字符" show-word-limit maxlength="5000"></el-input>
                    </el-form-item>
                </el-form>
                <div v-if="result.isShowResult">
                    <div style="color:red;text-align:center;" v-if="result.failure.length">注意：{{result.resultType}}失败的订单请联系订单组进行截单！</div>
                    <div>
                        <div>{{result.resultType}}成功订单:</div>
                        <div style="margin-left:30px;max-height: 100px;overflow-y: auto;">{{result.success}}</div>
                    </div>
                    <div v-if="result.failure.length">
                        <div>{{result.resultType}}失败订单:</div>
                        <div style="margin-left:30px;max-height: 100px;overflow-y: auto;">{{result.failure}}</div>
                    </div>
                </div>
                <div slot="footer">
                    <el-button size="small" @click="batchOperationCancel" v-if="!result.isShowResult">取消</el-button>
                    <el-button size="small" type="primary" @click="handleBatchOperation()" v-if="!result.isShowResult">确定</el-button>
                    <el-button size="small" type="primary" v-if="result.isShowResult" @click="batchOperationCancel">确定</el-button>
                </div>
            </el-dialog>
            <!-- 订单详情 -->
            <OrderInformation
                v-if="isOrderInfoShow"
                :isOrderInfoShow="isOrderInfoShow"
                :orderInfo="orderInfo"
                @handleCancelOrder="handleCancelOrder"
                @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
                @handleReload="handleReload">
            </OrderInformation>
            <!-- 点击收款请求弹窗 -->
            <SendReceiptRequest
                v-if="isReceiptRequestShow"
                :ReceiptRequestShow="isReceiptRequestShow"
                :sendReceiptRequest="sendReceiptRequestInfo"
                @sendReceiptRequestCancel="isReceiptRequestShow=false"
                :collection="collectionInfo">
            </SendReceiptRequest>
            <!-- 登记收款 -->
            <RegisteredReceivables
                v-if="isRegisteredReceivables"
                :showRegisteredReceivables="isRegisteredReceivables"
                :orderInfo="order"
                :RegisteredReceivables="RegisteredReceivablesInfo"
                :sendRegisteredReceivables="sendRegisteredReceivablesInfo"
                @handlesendRegisteredReceivablesCancel="isRegisteredReceivables=false">
            </RegisteredReceivables>
            <!-- 发票弹窗弹窗 -->
            <OrderInvoiceInfo :isInvoice="isInvoice" v-if="isInvoice" :InvoiceInfo="InvoiceInfo"
                :detailsInvoiceInfo="detailsInvoiceInfo" :invoice="invoiceSubmission"
                @handleSubmitInvoiceInterface="handleSubmitInvoiceInterface" @handleIsInvoiceShow="handleIsInvoiceShow" />
            <!-- 日志弹框 -->
            <el-dialog width="950px" class="ui-layout_edit-dialog logs" title="日志" :visible.sync="isShowLogShow">
                <ComPreviewTable
                    :isAdaptiveHeight="false"
                    :logKey="['操作日志', '操作人', '操作时间']"
                    :logProps="['updateContent', 'operatorName', 'createTime']"
                    :logData="showLogTableData"
                    :logWidth="['', '180', '180']">
                    <template slot-scope="scope" slot="updateContent">
                        <div v-html="scope.row.updateContent"></div>
                    </template>
                </ComPreviewTable>
            </el-dialog>
            <!-- 留评\消息联系\批量消息联系 -->
            <el-dialog
                class="ui-layout_edit-dialog"
                :title="form.title"
                width="800px"
                :visible.sync="isTemplateChooseShow"
                @close="handleOperateCancel()">
                <el-form border style="width: 100%" ref="from" :rules="batchRules" :model="form">
                    <div style="display:flex;">
                        <div style="display:flex;">
                            <div>
                                <el-form-item label="模板选择：" label-width="80px" prop="">
                                    <el-select placeholder="请选择" size="mini" v-model="form.templateChoose" filterable v-filter @change="handleSelectionTemplate()">
                                        <el-option v-for="(value, key, index) in dataComment.template"
                                                :label="value"
                                                :value="key"
                                                :key="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div style="padding: 4px 0 0 10px;" v-if="form.title!=='留评'">
                                <TemplateEdit :platform="'EB'" class="templateChange" @selectTemplate="templateChange" />
                            </div>
                        </div>
                        <div v-if="form.title!=='留评'">
                            <el-form-item label="添加标签：" label-width="120px" prop="">
                                <el-select placeholder="请选择" size="mini" v-model="form.tag_id">
                                    <el-option v-for="value in tag"
                                            :label="value.value"
                                            :value="value.id"
                                            :key="value.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                        <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" class="translateButton" :list="dataComment.google_lang_code"></ComSelectLanguageV2>
                    <el-form-item :label="isTranslate?'翻译前':'正文'" prop="before_translate_content">
                        <el-input size="small" type="textarea" v-model="form.before_translate_content" :rows="isTranslate?8:16" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="翻译后" v-if="isTranslate">
                        <el-input size="small" type="textarea" v-model="form.comment_text" rows="8" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
                    <el-button type="primary" @click="handleTemplateChooseConfirm()" size="small">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 取消订单 -->
            <el-dialog
                class="ui-layout_edit-dialog"
                :title="'取消订单'"
                width="450px"
                :visible.sync="isCancelTransaction"
                @close="handleTransactionWindowCancel()">
                <el-form border style="width: 100%" ref="cancelTransaction" :rules="batchRules" :model="cancelTransaction">
                    <el-form-item label="系统订单号：">
                        <div>{{cancelTransaction.order_id}}</div>
                    </el-form-item>
                    <el-form-item label="平台订单号：">
                        <div>{{cancelTransaction.platform_order_id}}</div>
                    </el-form-item>
                    <el-form-item label="付款状态：">
                        <div>{{cancelTransaction.buyerPaid?'已付款':'未付款'}}</div>
                    </el-form-item>
                    <el-form-item label="订单状态：">
                        <div style="display:flex;">
                            <div style="margin-right:100px;">{{orderStatus.complete_status}}</div>
                            <div><el-button style="font-size:12px;" type="primary" size="mini" @click="orderToVoid(orderStatus)"
                                            v-if="buttonList['obsolete'].permit(thisVm)"
                                            :disabled="orderStatus.complete_status==='部分发货'||orderStatus.complete_status==='已发货'||orderStatus.complete_status==='已取消'">作废订单</el-button></div>
                        </div>
                    </el-form-item>
                    <div style="color:red;font-size:12px;margin-top:10px;">提示:可以作废的订单请先作废订单!</div>
                    <el-form-item label="取消原因：" prop="cancel_reason">
                        <el-select placeholder="请选择" size="mini" clearable v-model="cancelTransaction.cancel_reason">
                            <el-option v-for="(value, key, index) in orderDetails.cancel_reason"
                                    :label="value"
                                    :value="key"
                                    :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="handleTransactionWindowCancel()" size="small">取 消</el-button>
                <el-button type="primary" @click="handleTransactionCancelConfirm()" size="small">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 新建退款后的提示 -->
            <el-dialog
                class="ui-layout_edit-dialog"
                :title="'提示'"
                width="400px"
                :visible.sync="tips.isShow"
                @close="handleCancelTips()">
                <div style="margin: 30px 0px 30px 79px">
                    <div>付款时间：{{tips.paytime}}</div>
                    <div>当前时间：{{tips.currentTime}}</div>
                    <div>间隔时间：{{tips.intervalTime}}</div>
                    <div style="color:red;font-size:12px;margin-top:10px;">当前订单可以取消订单，请取消订单！</div>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancelTips()" size="small">关 闭</el-button>
                <el-button type="primary" @click="handleIsCancelOrder()" size="small">取消订单</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import config from '@/assets/js/config';
import {
  orderList,//列表
  batchRemarkInfo,
  toVoidInfo,
  withhold,
  batchToVoid,
  batchWithhold,
  batchCancelWithhold,
  collectionInformation,
  registeredReceivablesData,
  invoiceDetailsInterface,
  submitInvoiceInterface,
  journalOperation,
  getCommentHeader,
  replyBack,
  cancelTransactionList,
  cancelTransactionConfirm,
  activeContactConfirm,
  cancelMergeOrder,
} from '../../../../api/orderInfo/Ebay/OrderListManagement';
import {
    getItemTemplate,
    getGoogleTranslate,
    getTemplateDetail,
} from '@/api/MailCenterManagement/PostMail';
import * as storage from '@/utils/storage';
import OrderInvoiceInfo from '../component/OrderInvoice';
import OrderInformation from '../OrderInformation';
import routerConfig from '@/router/routerConfig';
import SendReceiptRequest from '../component/SendReceiptRequest';
import RegisteredReceivables from '../component/RegisteredReceivables';
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import {
    getTag,
} from '../../../../api/MailCenterManagement/Inbox';

export default {
    name: 'EbayOrderListManagement',
    components: {
        OrderInvoiceInfo,
        OrderInformation,
        SendReceiptRequest,
        RegisteredReceivables,
        ComSelectLanguageV2,
    },
    data () {
        return {
            isTemplateChooseShow:false,//站内信
            isShowLogShow:false,//日志
            isInvoice:false,//发票
            isRegisteredReceivables:false,//登记收款弹窗
            isReceiptRequestShow:false,//收款请求弹窗
            isOrderInfoShow:false,//订单详情弹窗
            orderInfo:{},
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['基础信息', '订单信息', '产品信息', '物流信息', '关联状态', '买家信息', '操作'],
            tableProps: ['basicsInfo', 'orderInfo', 'productInfo', 'logisticsInfo', 'relationState', 'buyerInfo', 'operate'],
            tableWidth: ["280", "240", "240", "240", "200", "280", "150"],
            tableData: [],
            // 表格加载动画
            tableLoading: false,

            // 分页数据
            pageSizes: config.pageData.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 10,
                currentTotal: 0
            },

            // 保存选中项信息
            saveCheckInfo: [],
            // 选中的ids
            saveCheckIds: '',

            // 查询数据
            queryData: {
                account_id: '',
                buyer_id: '',
                warehouse_type: '',
                order_status: '',
                order_id: '',
                platform_order_id: '',
                receipt_paypal_account: '',
                paypal_transaction_number: '',
                warehouse: '',
                logistics: '',
                pay_paypal_account: '',
                tracking_no: '',
                receiving_country: '',
                mainQuery: {},
            },

            isBatchOperation:"",
            isBatchShow:false,
            BatchOperation: {
                batchOrderId: '',
                batchPlatform: '',
                batchRemark: '',
                batchUserId: '',
            },
            result:{
                isShowResult:false,
                resultType:'暂扣',
                failure:"",
                success:""
            },
            batchRules: {
                batchOrderId: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchPlatform: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchRemark: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchUserId: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                templateChoose: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                before_translate_content: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                cancel_reason: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
            },

            //收款请求
            sendReceiptRequestInfo: { //收款请求
                company_account: '', //公司paypal账号
                customer_account: '', //客户paypal账号
                amount: '', //收款金额
                goods_name: '', //产品名称
                leave_message: '' //留言
            },
            collectionInfo: {}, //收款请求所需信息

            //登记收款
            RegisteredReceivablesInfo: {
                order: {
                    account_id: "",
                    account_name: "",
                    buyer_id: "",
                    order_id: "",
                    platform_code: ""
                }
            },
            order:{},
            sendRegisteredReceivablesInfo: { //登记收款
                receipt_type: '', //收款方式
                receipt_money: '', //交易金额
                receipt_currency: '', //交易金额单位
                receipt_reason_type: '', //原因
                paypal_account_id: '', //paypal账号id
                paypal_account: '', //paypal账号
                transaction_id: '', //交易号
                transaction_hour: '', //交易时间
                status: '', //状态
                payment_account: '', //	付款账号
                receipt_bank: '', //收款银行
                receipt_bank_sn: '', //交易流水号
                receipt_bank_account: '', //银行账号
            },

            //发票
            InvoiceInfo: {},
            detailsInvoiceInfo: {}, //发票信息
            invoiceSubmission: { //提交发票
                order_id: '', //订单号
                platform_code: '', //平台
                country: '', //站点
                customer_company: '', //客户公司名或名字
                customer_addr: '', //客户地址
                total_price: 0, //发票总金额
                order_time: '', //下单时间
                product: [], //产品信息
                registered_company: '', //注册公司、
                tracking_number: '', //物流单号
                currency: '', //币种
                sale_account: '', //销售账号
            },

            //日志
            showLogTableData:[],

            //留评
            replyBack:{
                item_id:'',//平台item_id
                platform_order_id:"",//平台订单号
                before_translate_content:"",//评价内容
                buyer_id:"",//买家ID
                transaction_id:"",//交易号
                account_id:"",//账号ID
                type:"",
                platform_code:"",//平台
                currency:"",//币种
                sale_price:"",//产品价格
                site_id:"",//平台ID
            },
            dataComment:{
                google_lang_code:{},
                quick_parameter:{},
                template:[]
            },
            tag:[],
            form: {
                template:{},
                templateChoose:"",
                quickParameter:"",
                before_translate_content:"",
                comment_text:"",
                title:'',
                tag_id:"",
            },
            languageCode:'',
            isTranslate:false,

            //取消订单
            cancelTransaction:{
                order_id:"",
                platform_order_id:"",
                buyerPaid:"",
                paytime:"",
                cancel_reason:"",
                account_id:"",
                platform_code:"",
            },
            isCancelTransaction:false,
            orderDetails:{},
            orderStatus:{},

            //消息联系
            activeContact:{
                reply_title:'',
                reply_content:"",
                reply_content_en:"",
                ebay_order:[]
            },
            activeContactRow:{},

            //提示
            tips:{
                currentTime:"",
                paytime:"",
                intervalTime:"",
                isShow:false,
                row:{},
            }
        }
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList'];
        },
    },
    mounted() {
        // this.handleQueryInfo();
    },
    methods: {
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['EB_order_list']);
            }
            let obj = {};

            // 分离头部搜索和快捷搜索两种条件
            if( !isComSearch ){
                obj = {...this.queryData.mainQuery, ...obj};
            }else{
                obj = {...this.queryData.mainQuery, ...obj};
            }

            // 组合分页数据
            obj = {
                ...obj,
                page: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                limit: this.pageData.currentList
            };
            for (const key in obj) {
                if (!obj[key] && obj[key] !== 0) {
                    delete obj[key];
                }
            }
            this.tableLoading = true;
            orderList(obj).then(({data}) => {
                this.tableLoading = false;
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleQueryInfoCallBack(data);
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },

        // 查询回调
        handleQueryInfoCallBack(data){
            // 保存查询参数
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: 'EB_order_list',
                value: JSON.stringify(this.queryData)
            });
            this.tableData = data.data_list.data_list.value;
            // 渲染分页
            this.pageData.currentPage = data.data_list.page_data.page * 1;
            this.pageData.currentList = data.data_list.page_data.limit * 1;
            this.pageData.currentTotal = (data.data_list.page_data.total * 1)||0;

            // 重置表格高度
            this.searchHeight = !this.searchHeight;
        },

        // 重置
        handleResetQueryInfo(){
            this.queryData = {
                account_id: '',
                buyer_id: '',
                warehouse_type: '',
                order_status: '',
                order_id: '',
                platform_order_id: '',
                receipt_paypal_account: '',
                paypal_transaction_number: '',
                warehouse: '',
                logistics: '',
                pay_paypal_account: '',
                tracking_no: '',
                receiving_country: '',
                mainQuery: {},
            }
        },

        // 分页条数切换
        handleSizeChange(val) {
            this.pageData.currentPage = 1;
            this.pageData.currentList = val;
            this.handleQueryInfo({}, true);
        },
        // 跳转页数切换
        handleCurrentChange(val) {
            this.pageData.currentPage = val;
            this.handleQueryInfo({}, true);
        },

        // 保存勾选信息
        handleSaveCheckInfo(val) {
            this.saveCheckInfo = val;
            this.saveCheckIds = [...new Set(this.saveCheckInfo.map(e => e.id))].join(',');
        },

        // 执行操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success('操作成功！');
                this.batchOperationCancel();
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        },
        handleReload(){
            this.handleQueryInfo({...this.queryData.mainQuery}, true);
        },
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },
        //订单详情弹窗
        handleOrderInfo(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=true;
        },
        //作废
        orderToVoid(row) {
            if(this.isCancelTransaction)this.isCancelTransaction=false;
            this.isBatchOperation = '作废';
            this.isBatchShow = true;
            this.BatchOperation.batchOrderId = row.order_id;
            this.BatchOperation.batchPlatform = row.platform_code;
            this.BatchOperation.batchUserId = row.batchUserId;
        },
        //暂扣
        orderWithhold(row) {
            this.isBatchOperation = '暂扣';
            this.isBatchShow = true;
            this.BatchOperation.batchOrderId = row.order_id;
            this.BatchOperation.batchPlatform = row.platform_code;
            this.BatchOperation.batchUserId = row.batchUserId;
        },
        //暂扣、作废、批量弹窗关闭
        batchOperationCancel() {
            this.BatchOperation.batchRemark = '';
            this.isBatchShow = false
            this.result = {
                isShowResult:false,
                resultType:'暂扣',
                failure:"",
                success:""
            }
        },
        //批量备注
        handleBatchRemarks() {
            this.isBatchOperation = '批量备注';
            if (!this.saveCheckInfo.length) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            var order_id = '';
            for (let i = 0; i < this.saveCheckInfo.length; i++) {
                order_id += this.saveCheckInfo[i].order_id + ","
                // if ((i + 1) % 2 == 0 && i != this.saveCheckInfo.length - 1) {
                //     order_id += "\n"
                // }
            }
            this.isBatchShow = true;
            order_id = order_id.substring(0, order_id.length - 1)
            this.BatchOperation.batchOrderId = order_id;
            this.BatchOperation.batchPlatform = this.saveCheckInfo[0].platform_code;
        },
        //批量作废
        batchOrderToVoid() {
            this.isBatchOperation = '批量作废';
            if (!this.saveCheckInfo.length) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            var order_id = '';
            for (let i = 0; i < this.saveCheckInfo.length; i++) {
                if(this.saveCheckInfo[i].complete_status=='已取消'){
                    this.$message.warning('“已取消”状态的订单不能进行作废操作！');
                    return;
                }
                order_id += this.saveCheckInfo[i].order_id + ","
                // if ((i + 1) % 2 == 0 && i != this.saveCheckInfo.length - 1) {
                //     order_id += "\n"
                // }
            }
            this.isBatchShow = true;
            order_id = order_id.substring(0, order_id.length - 1)
            this.BatchOperation.batchOrderId = order_id;
            this.BatchOperation.batchPlatform = this.saveCheckInfo[0].platform_code;
        },
        //批量暂扣
        batchOrderWithhold() {
            this.isBatchOperation = '批量暂扣';
            if (!this.saveCheckInfo.length) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            var order_id_list = '';
            for (let i = 0; i < this.saveCheckInfo.length; i++) {
                if(this.saveCheckInfo[i].complete_status=='已完成'||this.saveCheckInfo[i].complete_status=='已取消'){
                    this.$message.warning('“已取消”或“已完成”状态的订单不能进行暂扣操作！');
                    return;
                }
                order_id_list += this.saveCheckInfo[i].order_id + ","
                // if ((i + 1) % 2 == 0 && i != this.saveCheckInfo.length - 1) {
                //     order_id_list += "\n"
                // }
            }
            this.isBatchShow = true;
            order_id_list = order_id_list.substring(0, order_id_list.length - 1)
            this.BatchOperation.batchOrderId = order_id_list;
            this.BatchOperation.batchPlatform = this.saveCheckInfo[0].platform_code;
        },
        //批量取消暂扣
        batchCancelOrderWithhold() {
            if (!this.saveCheckInfo.length) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            var order_id = '';
            for (let i = 0; i < this.saveCheckInfo.length; i++) {
                if(this.saveCheckInfo[i].complete_status!='暂扣'){
                    this.$message.warning('只能对“暂扣”状态的订单进行取消暂扣操作！');
                    return;
                }
                order_id += this.saveCheckInfo[i].order_id + ","
            }
            order_id = order_id.substring(0, order_id.length - 1)
            let cancelWithhold = {
                order_id: order_id,
                platform_code: this.saveCheckInfo[0].platform_code,
            }
            batchCancelWithhold(cancelWithhold).then(({data}) => {
                this.handleOperationCallBack(data);
            })

        },
        //暂扣、作废、批量暂扣、批量作废、批量备注
        handleBatchOperation() {
            let obj = {}
            if (this.isBatchOperation == "暂扣" || this.isBatchOperation == "批量暂扣") {
                obj = {
                    order_id_list: this.BatchOperation.batchOrderId,
                    remark: this.BatchOperation.batchRemark,
                    platform_code: this.BatchOperation.batchPlatform
                }
            } else {
                obj = {
                    order_id: this.BatchOperation.batchOrderId,
                    remark: this.BatchOperation.batchRemark,
                    platform_code: this.BatchOperation.batchPlatform
                }
            }
            this.$refs["BatchOperation"].validate(res => {
                if (res) {
                    switch (this.isBatchOperation) {
                        case "作废":
                            toVoidInfo(obj).then(({data}) => {
                                this.handleOperationCallBack(data);
                            })
                            break;
                        case "暂扣":
                            withhold(obj).then(({data}) => {
                                this.handleOperationCallBack(data);
                            })
                            break;
                        case "批量作废":
                            batchToVoid(obj).then(({data}) => {
                                if (data.status !== 1) {
                                    this.$message.error(data.errorMess);
                                    return
                                }else{
                                    this.isBatchOperation = '批量作废订单结果';
                                    this.result.resultType = '作废';
                                    this.result.failure = data.data_list.failureList.join(",");
                                    this.result.success = data.data_list.successList.join(",");
                                    this.result.isShowResult = true;
                                    this.$message.success('操作成功！');
                                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                                }
                            })
                            break;
                        case "批量暂扣":
                            batchWithhold(obj).then(({data}) => {
                                if (data.status !== 1) {
                                    this.$message.error(data.errorMess);
                                    return
                                }else{
                                    this.result.resultType = '暂扣';
                                    this.isBatchOperation = '批量暂扣订单结果';
                                    this.result.failure = data.data_list.failureList.join(",");
                                    this.result.success = data.data_list.successList.join(",");
                                    this.result.isShowResult = true;
                                    this.$message.success('操作成功！');
                                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                                }
                            })
                            break;
                        case "批量备注":
                            batchRemarkInfo(obj).then(({data}) => {
                                this.handleOperationCallBack(data);
                            })
                            break;
                    }
                }
            });
        },
        //取消暂扣
        cancelOrderWithhold(row,num) {
            let cancelWithhold = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                type: num
            }
            batchCancelWithhold(cancelWithhold).then(({data}) => {
                this.handleOperationCallBack(data);
            })
        },
        //收款请求弹窗控制
        handleReceiptRequest(row) {
            this.sendReceiptRequestInfo = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                account_id: row.account_id,
                asin: row.order_comm_detail_list.length?row.order_comm_detail_list[0].asinval:"",
                currency:row.currency,
            }
            collectionInformation({sku:  row.order_comm_detail_list.length?row.order_comm_detail_list[0].sku:""}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.collectionInfo = data.data_list;
                this.isReceiptRequestShow = true;
                this.sendReceiptRequestInfo.buyer_id = row.buyer_id;
                this.sendReceiptRequestInfo.merchant_email = row.receiver_email;
                this.sendReceiptRequestInfo.payer_email = row.payer_email;
                this.sendReceiptRequestInfo.product_name = this.collectionInfo.product_name_en;
            })
        },
        //登记收款弹窗控制
        handleRegisterGathering(row) {
            if(row.payment_status=='0'||row.payment_status==''){
                this.$message.error('该订单未付款，不能进行收款登记操作！');
                return;
            }
            let obj = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                account_id:row.account_id
            }
            registeredReceivablesData(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.RegisteredReceivablesInfo=data.data_list
                this.order = row;
                this.sendRegisteredReceivablesInfo.receipt_bank = this.RegisteredReceivablesInfo.receipt_bank
                this.sendRegisteredReceivablesInfo.platform_code = row.platform_code; //平台
                this.sendRegisteredReceivablesInfo.order_id = row.order_id; //订单号
                this.sendRegisteredReceivablesInfo.account_id = row.account_id; //账号id
                this.sendRegisteredReceivablesInfo.buyer_id = row.buyer_id; //客户ID
                this.sendRegisteredReceivablesInfo.receipt_type = '1';
            })
            this.isRegisteredReceivables = !this.isRegisteredReceivables;
        },
        //售后弹窗
        handleAfterSalesOrders(row,identification,title){
            this.tips.row=row;
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:title,
                operation:identification
            }
            this.isOrderInfoShow=true;
        },
        //提交发票
        handleSubmitInvoiceInterface(obj) {
            submitInvoiceInterface(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error('操作失败');
                    return;
                }else{
                    this.$message.success('操作成功');
                }
            }).catch(err => {console.log(err);});
        },
        handleIsInvoiceShow(bol) {
            this.isInvoice = bol
        },
        //发票
        orderInvoice(row,bol) {
            if(row.payment_status=='0'){
                this.$message.warning('该订单未付款，不能开具发票！')
                return;
            }
            this.InvoiceInfo = row;
            this.InvoiceInfo.B2B = bol;
            // this.invoiceSubmission.order_id = row.order_id;
            this.invoiceSubmission.platform_code = row.platform_code;
            this.invoiceSubmission.site = row.site;
            this.invoiceSubmission.order_time = ''
            let date = new Date();
            this.invoiceSubmission.invoice_time = date.toLocaleDateString();
            let obj = {};
            if(bol){
                obj = {
                    order_id: row.order_id,
                    country: row.site,
                    platform_code: row.platform_code,
                    site:row.site,
                    invoiceB2B:1
                }
            }else{
                obj = {
                    order_id: row.order_id,
                    country: row.site,
                    platform_code: row.platform_code,
                    site:row.site,
                }
            }
            invoiceDetailsInterface(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '发票信息查询失败')
                    return;
                }
                this.isInvoice = true;
                setTimeout(()=>{
                    this.detailsInvoiceInfo = data.data_list.value
                    // this.invoiceSubmission.cust_addr = this.detailsInvoiceInfo.cust_addr
                    this.invoiceSubmission.customer_company = this.detailsInvoiceInfo.company_name
                    this.invoiceSubmission.customer_addr = this.detailsInvoiceInfo.company_addr
                    //计算总价
                    let totalAmount = this.detailsInvoiceInfo.product_info_list
                    let product = 0
                    totalAmount.forEach(element => {
                        product += element.sale_price * element.quantity
                    });
                    this.invoiceSubmission.pro_pric = product
                    this.invoiceSubmission.total_price = product;
                    this.$forceUpdate();
                },0)
            }).catch(err => {
                console.log(err);
            });
        },
        //日志
        orderJournal(orderId) {
            let obj = {
                order_id: orderId
            }
            this.isShowLogShow = true
            journalOperation(obj).then(({data}) => {
                if (data.status !== 1) {
                    // this.$message.error(data.errorMess);
                    return
                }
                this.showLogTableData = data.data_list.records;
            }).catch(err => {
                console.log(err);
            });
        },
        //留评
        handleCommentOn(row){
            this.form.title = '留评';
            if(!row.order_comm_detail_list.length){
                this.$message.warning('该订单没有产品信息!');
                return;
            }
            this.replyBack={
                item_id:row.order_comm_detail_list[0].item_id,//平台item_id
                platform_order_id:row.platform_order_id,//平台订单号
                before_translate_content:"",//评价内容翻译前
                buyer_id:row.buyer_id,//买家ID
                transaction_id:row.order_comm_detail_list[0].transaction_id,//交易号
                account_id:row.account_id,//账号ID
                type:1,
                platform_code:row.platform_code,//平台
                currency:row.currency,//币种
                sale_price:row.order_comm_detail_list[0].sale_price,//产品价格
                site_id:row.site_id,//平台ID
                comment_text:""//翻译后
            };
            getCommentHeader({
                platform_code:row.platform_code,
                type:'1'
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return;
                }
                this.dataComment = data.data_list;
                this.isTemplateChooseShow = true;
            }).catch(err => {
                console.log(err);
            });
        },
        //模板渲染
        handleSelectionTemplate(){
            // this.form.before_translate_content = this.dataComment.template[this.form.templateChoose];
            getTemplateDetail({id:this.form.templateChoose}).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.before_translate_content += data.data_list.values[0].template_content;
                this.form.template = data.data_list.values[0];
            });
        },
        //常用语言翻译
        changeLanguage(code) {
            if( !this.form.before_translate_content){
                return;
            }
            this.languageCode = code;
            // getGoogleTranslate({
            //     content: this.form.before_translate_content,
            //     after : this.languageCode,
            //     before : "auto"
            // }).then(({data}) => {
            //     if( !data.status ){
            //         this.$message.error(data.errorMess || '操作失败！');
            //         return;
            //     }
            //     this.form.comment_text = data.after;
            //     this.isTranslate=true;
            // });
        },
        //选择语言翻译
        googleTranslate() {
            if( !this.languageCode ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.form.before_translate_content){
                return;
            }
            getGoogleTranslate({
                content: this.form.before_translate_content,
                after : this.languageCode,
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.comment_text = data.after;
                this.isTranslate=true;
            });
        },
        //取消站内信发送
        handleOperateCancel(){
            this.isTemplateChooseShow=false;
            this.form= {
                templateChoose:"",
                quickParameter:"",
                before_translate_content:"",
                comment_text:"",
                tag_id:"",
                title:''
            }
            this.activeContact={
                reply_title:'',
                reply_content:"",
                reply_content_en:"",
                ebay_order:[]
            }
            this.replyBack={};
            this.isTranslate=false;
            this.languageCode=false;
            this.$refs['from'].resetFields();
        },
        //确定站内信发送
        handleTemplateChooseConfirm(){
            this.replyBack.before_translate_content = this.form.before_translate_content;
            this.replyBack.comment_text = this.form.comment_text?this.form.comment_text:this.form.before_translate_content;
            let tagIndex = this.tag.findIndex((item)=>{ return this.form.tag_id == item.id});
            this.$refs['from'].validate(res => {
                if (res) {
                    if(this.form.title == '留评'){
                        replyBack(this.replyBack).then(({data}) => {
                            if( !data.status ){
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }else{
                                this.$message.success('操作成功！');
                                this.handleOperateCancel();
                            };
                        });
                    }else{
                        this.activeContact={
                            // reply_title: this.form.template.template_title,
                            reply_content:  this.form.comment_text?this.form.comment_text:this.form.before_translate_content,
                            reply_content_en: this.form.before_translate_content,
                            tag: tagIndex>-1?this.tag[tagIndex].value:"",
                            tag_id: this.form.tag_id,
                            ebay_order:[]
                        }
                        if(this.form.title == '消息联系'){
                            this.activeContact.ebay_order=[{
                                sender: this.activeContactRow.account_name,
                                item_id: this.activeContactRow.order_comm_detail_list[0].item_id,
                                question_type: '',
                                account_id: this.activeContactRow.kefu_account_id,
                                recipient_id: this.activeContactRow.buyer_id,
                                platform_order_id: this.activeContactRow.platform_order_id,
                                platform_code: this.activeContactRow.platform_code,
                                template_id:this.form.templateChoose,
                            }]
                        }else{
                            this.saveCheckInfo.forEach(element => {
                                let obj={
                                    sender: element.account_name,
                                    item_id: element.order_comm_detail_list[0].item_id,
                                    question_type: '',
                                    account_id: element.kefu_account_id,
                                    recipient_id: element.buyer_id,
                                    platform_order_id: element.platform_order_id,
                                    platform_code: element.platform_code,
                                    template_id:this.form.templateChoose,
                                }
                                this.activeContact.ebay_order.push(obj);
                            });
                        }
                        activeContactConfirm(this.activeContact).then(({data}) => {
                            if( !data.status ){
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }else{
                                this.$message.success('操作成功！');
                                this.handleOperateCancel();
                            };
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //取消订单
        handleCancellationOrder(row){
            if(!row.order_comm_detail_list.length){
                this.$message.warning('该订单没有产品信息!');
                return;
            };
            this.orderStatus = row;
            let obj={
                order_id: row.order_id,
                platform_order_id: row.platform_order_id,
                payment_status: row.payment_status,
                paytime: row.paytime,
                transaction_id: row.order_comm_detail_list[0].transaction_id,
                account_id: row.account_id,
                platform_code: row.platform_code,
                // user_name: row.user_name,
            };
            cancelTransactionList(obj).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.handleCancelTips();
                this.cancelTransaction={
                    order_id: data.data_list.order_id,
                    platform_order_id: data.data_list.platform_order_id,
                    buyerPaid: data.data_list.buyerPaid,
                    paytime: data.data_list.paytime,
                    cancel_reason:1,
                    account_id: data.data_list.account_id,
                    platform_code: data.data_list.platform_code,
                }
                this.orderDetails = data.data_list;
                this.isCancelTransaction = true;
            });
        },
        //关闭取消订单的窗口
        handleTransactionWindowCancel(){
            this.isCancelTransaction = false;
            this.cancelTransaction={
                order_id:"",
                platform_order_id:"",
                buyerPaid:"",
                paytime:"",
                cancel_reason:"",
                account_id:"",
                platform_code:"",
            }
            this.orderDetails=[];
            this.$refs['cancelTransaction'].resetFields();
        },
        //取消订单提交
        handleTransactionCancelConfirm(){
            this.$refs['cancelTransaction'].validate(res => {
                if (res) {
                    cancelTransactionConfirm(this.cancelTransaction).then(({data}) => {
                        if( !data.status ){
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }else{
                            this.$message.success(data.errorMess || '操作成功！');
                            this.handleTransactionWindowCancel();
                        };
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //消息联系\批量消息联系
        handleMessageContact(row,bool){
            if(bool){
                this.form.title = '消息联系';
                this.activeContactRow=row;
                if(!row.order_comm_detail_list.length){
                    this.$message.warning('该订单没有产品信息!');
                    return;
                }
            }else{
                if (!this.saveCheckInfo.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                let option=true,bool=true;
                this.saveCheckInfo.forEach(element => {
                    if(!element.order_comm_detail_list.length){
                        option = false;
                    }
                    if(element.order_type=='合并后的订单'||element.order_type=='拆分后的子订单'||element.order_type=='重寄后的订单'){
                        bool=false;
                    }
                });
                if(!option){
                    this.$message.warning('勾选的订单中包含没有产品信息的订单!');
                    return;
                }
                if(!bool){
                    this.$message.warning('勾选的订单中不能包含‘合并后的订单’、‘拆分后的子订单’和‘重寄后的订单’类型的订单!');
                    return;
                }
                this.form.title = '批量消息联系';
            }
            getCommentHeader({
                platfrom_code:'EB',
                type:'2'
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return;
                }
                this.dataComment = data.data_list;
                this.isTemplateChooseShow = true;
            }).catch(err => {
                console.log(err);
            });
        },
        //售后单跳转
        handleAfterSaleList(item){
            this.$router.push({path:'/EbayAfterSalesOrderManagement',query:{after_order_number: item.after_sale_id, _cacheType:'1'}});
            let inx = routerConfig.getRouteIndex('/EbayAfterSalesOrderManagement')
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

        //纠纷跳转
        handleGoDispute(item,row) {
            let inx='';
            if(item.type=='INR'){
                let obj = {...item,...row};
                this.handlePageINR(obj);
            }else if(item.type=='CANCEL'){
                let obj = {...item,...row};
                this.handlePageReturn(obj);
            }else if(item.type=='RETURN'){
                let obj = {...item,...row};
                this.handleCancel(obj);
            }
        },
        //消息跳转
        goMessagejump(row){
            this.$router.push({path:'/EbayMessage',query:{type:"EbayOrderListManagement",order_id: row.order_id, message_type: 2, _cacheType:'1'}});
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
        //评价跳转
        goFeedBackjump(row){
            this.$router.push({path:'/EbayEvaluateFeedBack',query:{type:"EbayOrderListManagement",order_id: row.order_id, _cacheType:'1'}});
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
        //新建退款单后判断三十天
        handleCancelOrder(data){
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hh = date.getHours();
            let mm = date.getMinutes();
            let ss = date.getSeconds();
            month = month < 10 ? '0'+ month : month;
            day = day < 10 ? '0'+ day : day;
            this.tips.currentTime = year +'-'+ month +'-'+ day + ' '+ hh + ':' + mm + ':' + ss;
            this.tips.paytime = data.paytime;
            let usedTime = date-new Date(data.paytime); // 相差的毫秒数
            let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
            let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
            let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
            console.log('days:',days,'         hours:',hours)
            if(days<30){
                this.tips.intervalTime = days+"天"+hours+"小时";
                this.tips.isShow = true;
            }
        },
        //关闭按钮
        handleCancelTips(){
            this.tips={
                currentTime:"",
                paytime:"",
                intervalTime:"",
                isShow:false,
            }
        },
        //提示的取消订单按钮
        handleIsCancelOrder(){
            this.handleCancellationOrder(this.tips.row);
        },
        //获取标签下拉数据
        handleGetTag(){
            getTag({platform_code: 'EB'}).then(({data}) => {
                this.tag = data.data_list;
            });
        },
        templateChange(id) {
            this.form.templateChoose = id;
            getTemplateDetail({id}).then(({data}) => {
                this.form.before_translate_content = (this.form.before_translate_content ? this.form.before_translate_content + '\n\n\n' : '') + data.data_list.values[0].template_content;
            });
        },
        handlePageINR(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:'EB',
                edit:false,
                dispute:true,
                row:row,
                title:'INR处理',
                operation:'handlePageINR'
            }
            this.isOrderInfoShow=true;
        },
        handlePageReturn(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:'EB',
                edit:false,
                dispute:true,
                row:row,
                title:'Return处理',
                operation:'handlePageReturn'
            }
            this.isOrderInfoShow=true;
        },
        handleCancel(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:'EB',
                edit:false,
                dispute:true,
                row:row,
                title:'Cancel处理',
                operation:'handlePageCancel'
            }
            this.isOrderInfoShow=true;
        },
        //取消合单
        handleCancelClosingOrder(row){
            this.$confirm('确认取消合单吗？', '取消合单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                cancelMergeOrder({
                        order_id: row.order_id,
                        platform_code: row.platform_code,
                    }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }else{
                        this.$message.success('操作成功')
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        }
    },
    created(){
        this.handleGetTag();
    }
}
</script>

<style lang="less" scoped>
    // .translateButton{
    //     /deep/.el-button{
    //         display: none;
    //     }
    // }
    table {
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        font-size: 12px;

        td {
            border-top: 1px solid #e6e6e6;
            border-left: 1px solid #e6e6e6;
            padding: 5px 10px;
        }
    }
    .triangle {
        display: inline-block;
        border-top: 5px solid #5196fe;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        position: relative;
        top: 3px;
    }
</style>
<style  lang="less">
    .orderRemark{
        word-wrap:break-word;
    }
    .afterId{
        max-height: 500px;
        overflow-y: auto;
    }
    .templateChange{
        /deep/.el-dialog{
            z-index: 2200 !important;
        }
    }
</style>
