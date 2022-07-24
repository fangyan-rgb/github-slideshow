<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight' />
            </div>
        </transition>
        <div class="orderInfoButton">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button size="small" type="text" @click="batchOrderToVoid"
                v-if="buttonList['batchObsolete'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangzuofei" style="color: #bb8fec;font-size:12px;"></i>批量作废</el-button>
            <el-button size="small" type="text" @click="batchOrderWithhold"
                v-if="buttonList['batchHold'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangzankou1" style="color: #fa686c;font-size:12px;"></i>批量暂扣</el-button>
            <el-button size="small" type="text" @click="batchCancelOrderWithhold"
                v-if="buttonList['batchCancelHold'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangquxiaozankou1" style="color: orange;font-size:12px;"></i>批量取消暂扣</el-button>
            <el-button size="small" type="text" @click="handleBatchRemarks"
                v-if="buttonList['batchRemark'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangbeizhu1" style="color: #75b1fc;font-size:12px;"></i>批量备注</el-button>
            <el-button size="small" type="text" @click="handleContactBuyers"
                v-if="buttonList['batchContactBuyers'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-lianxi" style="color: #75b1fc;font-size:12px;"></i>批量联系买家</el-button>
        </div>
        <ComTableInfo :isCheck="true" :tableKey="tableKey" :tableProps="tableProps" :tableData="tableData"
            :showSearch="showSearch" :tableWidth="tableWidth" :searchHeight="searchHeight" :otherHeight="otherHeight"
            @checked="handleCheck" :tableLoading="tableLoading">
            <!-- 基本信息 -->
            <template slot-scope="scope" slot="basicInfo">
                <div v-if="scope.row.amazon_fulfill_channel" :class="{rbadgea: scope.row.amazon_fulfill_channel === 'FBA'}" class="rbadge">
                    {{scope.row.amazon_fulfill_channel}}</div>
                <div>平台：{{scope.row.platform_code}}</div>
                <div style="display:flex;">
                    <div style="width:50px;white-space:nowrap;">订单号：</div>
                    <div style="cursor: pointer;color: #409EFF;line-heigth:16px;word-wrap:break-word;" @click="handleOrderInfo(scope.row)">
                        <!-- <router-link :to="{path:'OrderInformation',query:{order_id: scope.row.order_id, platform_code: scope.row.platform_code,operation:'handleOrder',currentRouting:'OrderInformation'}}">
                            {{scope.row.order_id}}</router-link> -->
                            {{scope.row.order_id}}
                    </div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:75px !important;white-space:nowrap;">平台订单号：</div>
                    <div style="flex:1;word-wrap:break-word;">{{scope.row.platform_order_id}}</div>
                </div>
                <div>销售账号：{{scope.row.account_name}}</div>
            </template>
            <!-- 订单信息 -->
            <template slot-scope="scope" slot="orderInfo">
                <div v-if="scope.row.order_comm_detail_list.length">
                    <div :class="{advancea: scope.row.order_comm_detail_list[0].restock_time==''||scope.row.order_comm_detail_list[0].restock_time==null}" class="advance">
                        <span v-html="scope.row.order_comm_detail_list[0].restock_time?'预售':'非预售'"></span>
                    </div>
                </div>
                <div :class="{B2BS: scope.row.is_business_order!='1'}" class="B2B">
                    <span>B2B</span>
                </div>
                <div style="padding-top:24px;">订单状态：
                    <span class="ui-state_circle grayColor" v-if="scope.row.complete_status_text === '初始化'"></span>
                    <span class="ui-state_circle greenColor" v-if="scope.row.complete_status_text === '正常'"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.complete_status_text === '异常'"></span>
                    <span class="ui-state_circle grayColor" v-if="scope.row.complete_status_text === '缺货'"></span>
                    <span class="ui-state_circle orangeColor" v-if="scope.row.complete_status_text === '已备货'"></span>
                    <span class="ui-state_circle orangeColor" v-if="scope.row.complete_status_text === '待发货'"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.complete_status_text === '超期'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.complete_status_text === '部分发货'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.complete_status_text === '已发货'"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.complete_status_text === '暂扣'"></span>
                    <span class="ui-state_circle grayColor" v-if="scope.row.complete_status_text === '已取消'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.complete_status_text === '已完成'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.complete_status_text === '通途系统处理订单'"></span>
                    <span class="ui-state_circle orangeColor" v-if="scope.row.complete_status_text === '待检测paypal账号'"></span>
                    {{scope.row.complete_status_text}}
                </div>
                <div>订单金额：<span style="color:#ff9900;font-weight: 700;">{{scope.row.subtotal_price}} {{scope.row.currency}}</span></div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="white-space:nowrap;">订单类型：</div>
                    <div style="flex:1;word-wrap:break-word;color:red;" v-if="scope.row.orderType==='合并后的订单'||scope.row.orderType==='拆分的主订单'||scope.row.orderType==='被合并的订单'||scope.row.orderType==='拆分后的子订单'">{{scope.row.orderType}}</div>
                    <div style="flex:1;word-wrap:break-word;" v-else>{{scope.row.orderType}}</div>
                </div>
            </template>
            <!-- 产品信息 -->
            <template slot-scope="scope" slot="productInfo">
                <div style="display: flex;">
                    <div style="width:40px;line-height: 15px;flex-shrink:0;white-space:nowrap;">SKU：</div>
                    <div>
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
                                            <a :href="item.pro_url" target="_Blank">{{item.sku}}</a>
                                        </div>
                                    </td>
                                    <td>{{item.cn_title}}</td>
                                    <td>{{item.quantity}}</td>
                                </tr>
                            </table>
                            <div style="cursor: pointer;color: #409EFF;flex:1;display: block;" slot="reference">
                                <div v-for="(item, index) in scope.row.order_comm_detail_list" :key='index'
                                    style="line-height: 15px;word-wrap:break-word;"><a :href="item.pro_url" target="_Blank" v-show="index<1">{{item.sku}}</a>
                                    <span v-show="scope.row.order_comm_detail_list.length>1&index==1">...</span>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:40px;line-height: 15px;white-space:nowrap;">Asin：</div>
                    <div>
                        <el-popover placement="right" width="300px" trigger="hover">
                            <table cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="30">序号</td>
                                    <td width="270">Asin</td>
                                </tr>
                                <tr v-for="(item,index) in scope.row.order_comm_detail_list">
                                    <td>{{index+1}}</td>
                                    <td>
                                        <div style="cursor: pointer;color: #409EFF;">
                                            <a :href="item.asin_item_url" target="_Blank">{{item.asinval}}</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div style="cursor: pointer;color: #409EFF;flex:1;display: block;" slot="reference">
                                <div v-for="(item, index) in scope.row.order_comm_detail_list" :key='index'
                                    style="line-height: 18px;word-wrap:break-word;"><a :href="item.asin_item_url" target="_Blank" v-show="index<1">{{item.asinval}}</a>
                                    <span v-show="scope.row.order_comm_detail_list.length>1&index==1">...</span>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </div>
            </template>
            <!-- 物流信息 -->
            <template slot-scope="scope" slot="logisticsInfo">
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px !important;">发货类型：</div>
                    <div>{{scope.row.amazon_fulfill_channel}}</div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px;">发货方式：</div>
                    <div style="flex:1;">{{scope.row.ship_name}}</div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px;">物流单号：</div>
                    <div  style="cursor: pointer;color: #409EFF;flex:1;"><a :href="scope.row.track_url" target="_Blank">{{scope.row.tracking_number1}}</a></div>
                </div>
                <!-- <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px;">发货方式：</div>
                    <div>
                        <el-popover placement="right" width="300px" trigger="hover">
                            <table cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="30">序号</td>
                                    <td width="270">发货方式</td>
                                </tr>
                                <tr v-for="(item,index) in scope.row.ship_message">
                                    <td>{{index+1}}</td>
                                    <td>{{item.ship_name}}</td>
                                </tr>
                            </table>
                            <div class="ellipsis1" slot="reference">
                                <div v-for="(item, index) in scope.row.ship_message" :key='index'
                                    style="line-height: 18px;cursor: pointer;" v-show="index==0">{{item.ship_name.length>7?item.ship_name.substring(0,7)+'...':item.ship_name}}
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </div> -->
                <!-- <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px;white-space:nowrap;">物流单号：</div>
                    <div>
                        <el-popover placement="right" width="300px" trigger="hover">
                            <table cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="30">序号</td>
                                    <td width="270">物流单号</td>
                                </tr>
                                <tr v-for="(item,index) in scope.row.ship_message">
                                    <td>{{index+1}}</td>
                                    <td>
                                        <div style="cursor: pointer;color: #409EFF;">
                                            <a :href="item.track_url" target="_Blank">{{item.tracking_number1}}</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div style="cursor: pointer;color: #409EFF;flex:1;display: block;" slot="reference">
                                <div v-for="(item, index) in scope.row.ship_message" :key='index'
                                    style="line-height: 18px;word-wrap:break-word;"><a :href="item.track_url" target="_Blank" v-show="index<1">{{item.tracking_number1}}</a>
                                    <span v-show="scope.row.ship_message.length>1&index==1">...</span>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </div> -->
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px !important;">收货国家：</div>
                    <div>{{scope.row.ship_cn_country}}</div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px !important;white-space:nowrap;">发货仓库：</div>
                    <div>{{scope.row.warehouse_name}}</div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px !important;white-space:nowrap;">仓库类型：</div>
                    <div>{{scope.row.warehouse_type}}</div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px !important;white-space:nowrap;">虚拟仓类型：</div>
                    <div>{{scope.row.warehouse_second_category}}</div>
                </div>
            </template>
            <!-- 物流时间 -->
            <template slot-scope="scope" slot="logisticsTime">
                <div>
                    <div>平台发货时间：</div>
                    <div>{{scope.row.delivery_time}}</div>
                </div>
                <div>
                    <div>预计妥投时间：</div>
                    <div>{{scope.row.estimated_arrival_date}}</div>
                </div>
            </template>
            <!-- 关联状态 -->
            <template slot-scope="scope" slot="associatedState">
                <div>纠纷状态：
                    <span class="ui-state_circle orangeColor" v-if="scope.row.issue_status === '未处理'"></span>
                    <span class="ui-state_circle grayColor" v-if="scope.row.issue_status === '无'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.issue_status === '已处理'"></span>
                    <span v-show="scope.row.issue_status=='无'" v-html="'无纠纷'"></span>
                    <span v-show="scope.row.issue_status!='无'">
                        <span style="cursor: pointer;color: #409EFF;" @click="goDisputeCenterPage(scope.row)">
                            {{scope.row.issue_status}}
                        </span>
                    </span>
                </div>
                <div>邮件状态：
                    <span class="ui-state_circle orangeColor" v-if="scope.row.is_replay === '未回复'"></span>
                    <span class="ui-state_circle grayColor" v-if="scope.row.is_replay === '无'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.is_replay === '已回复'"></span>
                    <span v-show="scope.row.is_replay=='无'">无邮件</span>
                    <span v-show="scope.row.is_replay!='无'">
                        <span style="cursor: pointer;color: #409EFF;" @click="goInboxPage(scope.row)">
                            {{scope.row.is_replay}}
                        </span>
                    </span>
                </div>
                <div>退款状态：
                    <span class="ui-state_circle grayColor" v-if="scope.row.refund_status === '未发起退款'"></span>
                    <span class="ui-state_circle grayColor" v-if="scope.row.refund_status === '待退款'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.refund_status === '退款完成'"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.refund_status === '退款失败'"></span>
                    <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '退款中'"></span>
                    <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '等待接受退款中'"></span>
                    {{scope.row.refund_status}}
                </div>
                <div style="display:flex;"><div>售后问题：</div>
                        <div style="margin-left:4px;">
                            <span class="ui-state_circle orangeColor" v-if="scope.row.aftersales_status[0].aftersales_status === '退货'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.aftersales_status[0].aftersales_status === '重寄'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.aftersales_status[0].aftersales_status === '无'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.aftersales_status[0].aftersales_status === '退款'"></span>
                        </div>
                    <el-popover placement="right" trigger="hover" width="300px" popper-class="afterId">
                        <table cellspacing="0" cellpadding="0">
                            <tr>
                                <td>序号</td>
                                <td>售后类型</td>
                                <td>售后单号</td>
                            </tr>
                            <tr v-for="(item,index) in scope.row.aftersales_status">
                                <td>{{index+1}}</td>
                                <td><a href="">{{item.aftersales_status}}</a></td>
                                <td>
                                    <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleAfterSaleList(item)">
                                        <router-link :to="{path:'AfterSalesOrderManagement',query:item.after_id}">{{item.after_id}}</router-link>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference" v-show="scope.row.aftersales_status[0].aftersales_status=='无'?false:true">
                            {{scope.row.aftersales_status[0].aftersales_status}}
                        </div>
                    </el-popover>
                    <div style="margin-left:3px;" v-show="scope.row.aftersales_status[0].aftersales_status=='无'?true:false"
                        v-html="scope.row.aftersales_status[0].aftersales_status=='无'?'无售后':scope.row.aftersales_status[0].aftersales_status">
                    </div>
                </div>
                <div>退货编码：{{scope.row.refund_code}}</div>
                <div>退款金额：<span style="color:red;">{{scope.row.refund_amount}}</span></div>
            </template>
            <!-- 客户信息 -->
            <template slot-scope="scope" slot="customerInfo">
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px;">客户邮箱：</div>
                    <div style="flex:1;">{{scope.row.email}}</div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px;">客户电话：</div>
                    <div style="flex:1;">{{scope.row.ship_phone}}</div>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                    <div style="width:70px;white-space:nowrap;">客户ID：</div>
                    <div style="flex:1;word-wrap:break-word;" v-html="spaceConversionFn(scope.row.buyer_id)"></div>
                </div>
            </template>
            <!-- 时间信息 -->
            <template slot-scope="scope" slot="timeInfo">
                <div>付款时间：{{scope.row.paytime}}</div>
                <div>下单时间：{{scope.row.created_time}}</div>
                <div>发货时间：{{scope.row.shipped_date}}</div>
            </template>
            <!-- 备注 -->
            <template slot-scope="scope" slot="order_remark">
                <el-popover class="ui-content-overflow"
                    placement="top"
                    width="260"
                    trigger="hover"
                    popper-class="orderRemark"
                    :disabled="String(scope.row.order_remark).length<28"
                    :content="scope.row.order_remark">
                    <div class="ellipsis4" slot="reference" >{{scope.row.order_remark}}</div>
                </el-popover>
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
                            <span v-show="scope.row.complete_status==40?false:true">
                                <el-button style="width:100%;" type="text" @click="orderToVoid(scope.row)"
                                    v-if="buttonList['obsolete'].permit(thisVm)"
                                    :disabled="scope.row.amazon_fulfill_channel=='FBA'||(scope.row.amazon_fulfill_channel=='FBM'&&(scope.row.complete_status_text==='部分发货'||scope.row.complete_status_text==='已发货'))"
                                    >作废</el-button>
                            </span>
                            <span v-show="scope.row.complete_status==40?true:false">
                                <el-button style="width:100%;" type="text" @click="cancelOrderWithhold(scope.row,'2')"
                                    v-if="buttonList['cancelObsolete'].permit(thisVm)">取消作废</el-button>
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item v-show="scope.row.complete_status_text==='已取消'||scope.row.complete_status_text==='已完成'?false:true">
                            <span v-show="scope.row.complete_status==25?false:true">
                                <el-button style="width:100%;" type="text" @click="orderWithhold(scope.row)"
                                    v-if="buttonList['hold'].permit(thisVm)"
                                    :disabled="scope.row.amazon_fulfill_channel=='FBA'||(scope.row.amazon_fulfill_channel=='FBM'&&(scope.row.complete_status_text==='部分发货'||scope.row.complete_status_text==='已发货'))"
                                    >暂扣</el-button>
                            </span>
                            <span v-show="scope.row.complete_status==25?true:false">
                                <el-button style="width:100%;" type="text" @click="cancelOrderWithhold(scope.row,'1')"
                                    v-if="buttonList['cancelHold'].permit(thisVm)">取消暂扣</el-button>
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" @click="handleReceiptRequest(scope.row)"
                                v-if="buttonList['receiptRequest'].permit(thisVm)">收款请求</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" @click="handleRegisterGathering(scope.row)"
                                v-if="buttonList['registeredPayment'].permit(thisVm)">登记收款</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text"
                                v-if="buttonList['newSalesOrder'].permit(thisVm)" @click="handleAfterSalesOrders(scope.row,'addNewAfterSaleSingle','新建售后单')">
                                    <!-- <router-link
                                        :to="{path:'OrderInformation',query:{order_id: scope.row.order_id, platform_code: scope.row.platform_code,operation:'addNewAfterSaleSingle',currentRouting:'OrderInformation'}}">
                                        新建售后单</router-link> -->
                                    新建售后单
                            </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" v-if="buttonList['registerRefundForm'].permit(thisVm)" @click="handleAfterSalesOrders(scope.row,'registeredRefundSlip','登记退款单')">
                                    <!-- <router-link
                                        :to="{path:'OrderInformation',query:{order_id: scope.row.order_id, platform_code: scope.row.platform_code,operation:'registeredRefundSlip',currentRouting:'OrderInformation'}}">
                                        登记退款单</router-link> -->
                                        登记退款单
                            </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text"
                                v-if="buttonList['registerComplaintList'].permit(thisVm)" @click="handleAfterSalesOrders(scope.row,'registeredRCustomerComplaintSlip','登记客诉单')">
                                    <!-- <router-link
                                        :to="{path:'OrderInformation',query:{order_id: scope.row.order_id, platform_code: scope.row.platform_code,operation:'registeredRCustomerComplaintSlip',currentRouting:'OrderInformation'}}">
                                        登记客诉单</router-link> -->
                                        登记客诉单
                            </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" v-if="buttonList['contactBuyer'].permit(thisVm)"
                                @click="handleContactBuyers(scope.row)">联系买家</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" @click="orderInvoice(scope.row,false)"
                                v-if="buttonList['invoice'].permit(thisVm)">发票</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" @click="orderInvoice(scope.row,true)"
                                v-if="buttonList['invoiceB2B'].permit(thisVm)" :disabled="scope.row.is_business_order!='1'||(scope.row.site.toUpperCase()!='DE'&&
                                scope.row.site.toUpperCase()!='IT'&&scope.row.site.toUpperCase()!='FR'&&scope.row.site.toUpperCase()!='SP'&&scope.row.site.toUpperCase()!='UK')">B2B发票</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" @click="handleCancelClosingOrder(scope.row)"
                                :disabled="((scope.row.complete_status_text==='部分发货'||scope.row.complete_status_text==='已发货')&&scope.row.orderType==='合并后的订单')||scope.row.orderType!=='合并后的订单'"
                                v-if="buttonList['CancelClosingOrder'].permit(thisVm)">取消合单</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button style="width:100%;" type="text" @click="orderJournal(scope.row.order_id)"
                                v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <ComDivide />
                <el-button type="text" v-if="buttonList['deal'].permit(thisVm)" @click="handleOrderInfo(scope.row)">
                        <!-- <router-link :to="{path:'OrderInformation',query:{order_id:scope.row.order_id,platform_code:scope.row.platform_code,operation:'handleOrder',currentRouting:'OrderInformation'}}">处理
                        </router-link> -->处理
                </el-button>
            </template>
        </ComTableInfo>
        <!-- 分页 -->
        <div class="ui-main-module-page">
            <el-pagination @size-change="sizeChange" @current-change="currentChange"
                :current-page="pageData.currentPage" :page-sizes="pageSizes" :page-size="pageData.currentList"
                layout="total, sizes, prev, pager, next, jumper" :total="pageData.currentTotal">
            </el-pagination>
        </div>
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
            <!-- <template>
                <el-table :data="showLogTableData" style="width: 100%" size="mini" border max-height="700">
                    <el-table-column prop="updateContent" label="操作日志"></el-table-column>
                    <el-table-column prop="operatorName" label="操作人" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
                </el-table>
            </template> -->
        </el-dialog>
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
                    <el-input size="small" type="textarea" class="batchRemark" v-model.trim="BatchOperation.batchRemark" placeholder="请输入内容,不能超过5000个字符" show-word-limit maxlength="5000"></el-input>
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
        <!-- 点击收款请求弹窗 -->
        <SendReceiptRequest
            v-if="isReceiptRequestShow"
            :ReceiptRequestShow="isReceiptRequestShow"
            :sendReceiptRequest="sendReceiptRequestInfo"
            :collection="collectionInfo"
            @sendReceiptRequestCancel="isReceiptRequestShow=false"
            ></SendReceiptRequest>
        <!-- 登记收款 -->
        <RegisteredReceivables
            v-if="isRegisteredReceivables"
            :showRegisteredReceivables="isRegisteredReceivables"
            :orderInfo="order"
            :RegisteredReceivables="RegisteredReceivablesInfo"
            :sendRegisteredReceivables="sendRegisteredReceivablesInfo"
            @handlesendRegisteredReceivablesCancel="isRegisteredReceivables=false"
            ></RegisteredReceivables>
        <!-- 发票弹窗弹窗 -->
        <OrderInvoiceInfo :isInvoice="isInvoice" v-if="isInvoice" :InvoiceInfo="InvoiceInfo"
            :detailsInvoiceInfo="detailsInvoiceInfo" :invoice="invoiceSubmission"
            @handleSubmitInvoiceInterface="handleSubmitInvoiceInterface" @handleIsInvoiceShow="handleIsInvoiceShow" />
        <OrderInformation
            v-if="isOrderInfoShow"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            @handleReload="handleReload"
        ></OrderInformation>
    </div>
</template>

<script>
    import {
        mapGetters,
        // mapActions
    } from "vuex";
    import config from "@/assets/js/config";
    import {
        orderList, //订单列表信息
        withhold, //暂扣
        journalOperation, //日志
        toVoidInfo, //作废
        batchToVoid, //批量作废
        batchWithhold, //批量暂扣
        batchCancelWithhold, //批量取消暂扣
        batchRemarkInfo, //批量备注
        companyPaypalAccount, //获取公司paypal账号
        receiptRequestInterface, //收款请求
        invoiceDetailsInterface, //发票详情接口
        registeredReceivablesData, //获取登记收款弹窗数据
        collectionInformation, //收款请求弹窗信息
        submitInvoiceInterface, //提交发票
        obtainProDetailsInfo, //获取当前订单产品信息
        // cancelWithhold,
        cancelMergeOrder,//取消合单
    } from "../../../api/orderInfo/order_list_management";
    import OrderInvoiceInfo from "../OrderManagement/component/OrderInvoice.vue";
    import OrderInformation from "../OrderManagement/OrderInformation";
    import RegisteredReceivables from '../OrderManagement/component/RegisteredReceivables';
    import SendReceiptRequest from '../OrderManagement/component/SendReceiptRequest';
    import * as storage from '@/utils/storage';
    import routerConfig from '@/router/routerConfig';

    export default {
        name: 'OrderListManagement',
        components: {
            OrderInvoiceInfo,
            OrderInformation,
            RegisteredReceivables,
            SendReceiptRequest,
        },
        data() {
            return {
                isRegisteredReceivables:false,
                result:{
                    isShowResult:false,
                    resultType:'暂扣',
                    failure:"",
                    success:""
                },
                orderInfo:{},
                isOrderInfoShow:false,//订单详情弹窗
                otherHeight: ['orderInfoButton'],
                searchHeight: false,
                isInvoice: false, //发票显示和隐藏
                orderListSearch: { //订单列表搜索项
                    orderStateOption: {} //订单状态
                },
                thisVm: this,
                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['updateContent', 'operatorName', 'createTime'],
                    tableWidth: []
                },
                isShowLogShow: false,
                showLogTableData:[],
                showSearch: true,
                isBatchShow: false,
                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 10,
                    currentTotal: 0
                },
                areaTableRules: {},
                queryData: {
                    mainQuery: {}
                },
                tableKey: ["基础信息", "订单信息", "产品信息", "物流信息", "物流时间", "关联状态", "客户信息", "时间信息", "订单备注", "操作"],
                tableWidth: [],
                tableData: [],
                tableProps: [],
                // 表格加载动画
                tableLoading: false,

                journaltableData: [], //操作日志信息
                journalInfo: false, //日志弹框显示和隐藏
                checkList: [], //勾选的订单
                isBatchOperation: '', //操作弹框标题
                RegisteredReceivablesInfo: {
                    order: {
                        account_id: "",
                        account_name: "",
                        buyer_id: "",
                        order_id: "",
                        platform_code: ""
                    }
                },
                BatchOperation: {
                    batchOrderId: '',
                    batchPlatform: '',
                    batchRemark: '',
                    batchUserId: '',
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
                },
                isBatchShow: false,
                isReceiptRequestShow: false,
                companyPaypalAccountInfo: [], //公司paypal账号下拉信息
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
                transactionInfo: { //交易信息
                    transaction_id: '',
                },
                sendReceiptRequestInfo: { //收款请求
                    company_account: '', //公司paypal账号
                    customer_account: '', //客户paypal账号
                    amount: '', //收款金额
                    goods_name: '', //产品名称
                    leave_message: '' //留言
                },
                collectionInfo: {}, //收款请求所需信息
                // invoiceCurrency: { //发票货币币种
                //     USD: 'USD',
                //     EUR: 'EUR'
                // },
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
                productDetails: [], //产品详情
                order:{},
            }
        },
        computed: {
            ...mapGetters(["queryParamsInfo"/* , "orderListManagementInfo", "searchConfig" */]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        methods: {
            orderList,
            withhold,
            journalOperation,
            toVoidInfo,
            batchToVoid,
            batchWithhold,
            batchCancelWithhold,
            batchRemarkInfo,
            companyPaypalAccount, //获取公司paypal账号
            registeredReceivablesData, //获取登记收款弹窗数据
            collectionInformation, //收款请求弹窗信息
            invoiceDetailsInterface, //发票详情接口
            submitInvoiceInterface, //提交发票
            obtainProDetailsInfo, //获取当前订单产品信息
            // ...mapActions(["orderList"]),
            // 查询
            //联系买家/批量联系买家
            handleContactBuyers(row) {
                let orderId='',emailCustomer='',account_id='';
                if(row.order_id){
                    orderId=row.order_id
                    emailCustomer=row.email
                    account_id = row.account_id;
                }else{
                    if(this.checkList.length==0){
                        this.$message.warning('请勾选列表数据!')
                        return;
                    }else{
                        let isAccount = false;
                        account_id = this.checkList[0].account_id;
                        this.checkList.forEach(element => {
                            if(this.checkList[0].account_id != element.account_id){
                                isAccount = true;
                            }
                                if(element.email){
                                    orderId += element.order_id+",";
                                    emailCustomer += element.email+",";
                                }
                        });
                        if(isAccount){
                            this.$message.warning('请勾选相同销售账号，再进行批量联系买家！')
                            return;
                        }
                        if(emailCustomer.length==0){
                            this.$message.warning('所选订单中均没有客户邮箱，不能发送邮件！')
                            return;
                        }
                        orderId = orderId.substring(0, orderId.length - 1)
                        emailCustomer = emailCustomer.substring(0, emailCustomer.length - 1)
                    }
                }
                let path = '/PostMail';
                let query = {type: "OrderListManagement", order_id: orderId, account_id: account_id, email: emailCustomer, goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
                this.$router.push({path, query});

                this.changeNavShowFn(path, query);
            },

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                if (isSave) {
                    this.queryData = JSON.parse(this.queryParamsInfo['order_list_management']);
                }
                let obj = {

                };

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
                    page_size: this.pageData.currentList
                };

                this.tableLoading = true;
                this.orderList(obj).then(({data}) => {
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

            //查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
                    key: "order_list_management",
                    value: JSON.stringify(this.queryData)
                });
                //数据渲染
                let orderData = data.data_list.value;
                orderData.forEach(element => {
                    if (element.order_type == '1') {
                        element.orderType = '普通订单';
                    } else if (element.order_type == '2') {
                        element.orderType = '合并后的订单';
                    } else if (element.order_type == '3') {
                        element.orderType = '被合并的订单';
                    } else if (element.order_type == '4') {
                        element.orderType = '拆分的主订单';
                    } else if (element.order_type == '5') {
                        element.orderType = '拆分后的子订单';
                    }else if (element.order_type == '6') {
                        element.orderType = '被重寄的订单';
                    }else if (element.order_type == '7') {
                        element.orderType = '重寄后的订单';
                    }else if (element.order_type == '8') {
                        element.orderType = '客户补款的订单';
                    }
                    // if (element.refund_status == 0) {
                    //     element.refundStatus = '无'
                    // } else if (element.refund_status == 1) {
                    //     element.refundStatus = '部分退款'
                    // } else if (element.refund_status == 2) {
                    //     element.refundStatus = '全部退款'
                    // }
                });
                this.tableData = orderData;
                this.tableProps = ["basicInfo", "orderInfo", "productInfo", "logisticsInfo", "logisticsTime","associatedState", "customerInfo", "timeInfo", "order_remark", "operate"];
                this.tableWidth = ["220", "150", "160", "170", "140", "140", "220", "200", "110", "130"];
                //渲染分页
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.page * 1;
                this.pageData.currentTotal = data.page_data.total * 1 ||0;

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },
            //作废
            orderToVoid(row) {
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
                this.invoiceDetailsInterface(obj).then(({data}) => {
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
            //提交发票
            handleSubmitInvoiceInterface(obj) {
                this.submitInvoiceInterface(obj).then(({
                    data
                }) => {
                    if (data.status !== 1) {
                        this.$message.error('操作失败');
                        return;
                    }else{
                        this.$message.success('操作成功');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 列表勾选
            handleCheck(row) {
                this.checkList = row;
            },
            //批量勾选
            batchOrderInfo() {
                if (!this.checkList.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
            },
            //批量备注
            handleBatchRemarks() {
                this.isBatchOperation = '批量备注';
                if (!this.checkList.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                var order_id = '';
                for (let i = 0; i < this.checkList.length; i++) {
                    order_id += this.checkList[i].order_id + ","
                    // if ((i + 1) % 2 == 0 && i != this.checkList.length - 1) {
                    //     order_id += "\n"
                    // }
                }
                this.isBatchShow = true;
                order_id = order_id.substring(0, order_id.length - 1)
                this.BatchOperation.batchOrderId = order_id;
                this.BatchOperation.batchPlatform = this.checkList[0].platform_code;
            },
            //批量作废
            batchOrderToVoid() {
                this.isBatchOperation = '批量作废';
                if (!this.checkList.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                var order_id = '';
                for (let i = 0; i < this.checkList.length; i++) {
                    if(this.checkList[i].complete_status_text=='已取消'){
                        this.$message.warning('“已取消”状态的订单不能进行作废操作！');
                        return;
                    }
                    order_id += this.checkList[i].order_id + ","
                    // if ((i + 1) % 2 == 0 && i != this.checkList.length - 1) {
                    //     order_id += "\n"
                    // }
                }
                this.isBatchShow = true;
                order_id = order_id.substring(0, order_id.length - 1)
                this.BatchOperation.batchOrderId = order_id;
                this.BatchOperation.batchPlatform = this.checkList[0].platform_code;
            },
            //批量暂扣
            batchOrderWithhold() {
                this.isBatchOperation = '批量暂扣';
                if (!this.checkList.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                var order_id_list = '';
                for (let i = 0; i < this.checkList.length; i++) {
                    if(this.checkList[i].complete_status_text=='已完成'||this.checkList[i].complete_status_text=='已取消'){
                        this.$message.warning('“已取消”或“已完成”状态的订单不能进行暂扣操作！');
                        return;
                    }
                    order_id_list += this.checkList[i].order_id + ","
                    // if ((i + 1) % 2 == 0 && i != this.checkList.length - 1) {
                    //     order_id_list += "\n"
                    // }
                }
                this.isBatchShow = true;
                order_id_list = order_id_list.substring(0, order_id_list.length - 1)
                this.BatchOperation.batchOrderId = order_id_list;
                this.BatchOperation.batchPlatform = this.checkList[0].platform_code;
            },
            //批量取消暂扣
            batchCancelOrderWithhold() {
                if (!this.checkList.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                var order_id = '';
                for (let i = 0; i < this.checkList.length; i++) {
                    if(this.checkList[i].complete_status_text!='暂扣'){
                        this.$message.warning('只能对“暂扣”状态的订单进行取消暂扣操作！');
                        return;
                    }
                    order_id += this.checkList[i].order_id + ","
                }
                order_id = order_id.substring(0, order_id.length - 1)
                let cancelWithhold = {
                    order_id: order_id,
                    platform_code: this.checkList[0].platform_code,
                }
                this.batchCancelWithhold(cancelWithhold).then(({
                    data
                }) => {
                    this.succeedCallBack(data);
                })

            },
            //取消暂扣
            cancelOrderWithhold(row,num) {
                let cancelWithhold = {
                    order_id: row.order_id,
                    platform_code: row.platform_code,
                    type: num
                }
                // console.log(cancelWithhold)
                this.batchCancelWithhold(cancelWithhold).then(({
                    data
                }) => {
                    this.succeedCallBack(data);
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
                                this.toVoidInfo(obj).then(({
                                    data
                                }) => {
                                    this.succeedCallBack(data);
                                })
                                break;
                            case "暂扣":
                                this.withhold(obj).then(({
                                    data
                                }) => {
                                    this.succeedCallBack(data);
                                })
                                break;
                            case "批量作废":
                                this.batchToVoid(obj).then(({data}) => {
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
                                this.batchWithhold(obj).then(({data}) => {
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
                                this.batchRemarkInfo(obj).then(({
                                    data
                                }) => {
                                    this.succeedCallBack(data);
                                })
                                break;
                        }
                    }
                });
            },
            //日志
            orderJournal(orderId) {
                let obj = {
                    order_id: orderId
                }
                this.isShowLogShow = true
                this.journalOperation(obj).then(({data}) => {
                    if (data.status !== 1) {
                        // this.$message.error(data.errorMess);
                        return
                    }
                    this.showLogTableData = data.data_list.records;
                }).catch(err => {
                    console.log(err);
                });
            },
            //操作成功回调
            succeedCallBack(data) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    if (this.isBatchShow || this.isReceiptRequestShow || this.isInvoice) {
                        if(this.isBatchShow){
                            this.batchOperationCancel()
                        }
                        this.RegisteredReceivablesInfo.receipt_reason_type = '';
                        this.RegisteredReceivablesInfo.receipt_type = '';
                    }
                    setTimeout(() => {
                        this.handleQueryInfo({...this.queryData.mainQuery}, true);
                    }, 1000);
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            },
            // 分页条数切换
            sizeChange(val) {
                this.pageData.currentPage = 1;
                this.pageData.currentList = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },
            // 跳转页数切换
            currentChange(val) {
                this.pageData.currentPage = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
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
                this.registeredReceivablesData(obj).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.RegisteredReceivablesInfo=data.data_list
                    this.order = row
                    // console.log(this.RegisteredReceivablesInfo)
                    this.sendRegisteredReceivablesInfo.receipt_bank = this.RegisteredReceivablesInfo.receipt_bank
                    this.sendRegisteredReceivablesInfo.platform_code = row.platform_code; //平台
                    this.sendRegisteredReceivablesInfo.order_id = row.order_id; //订单号
                    this.sendRegisteredReceivablesInfo.account_id = row.account_id; //账号id
                    this.sendRegisteredReceivablesInfo.buyer_id = row.buyer_id; //客户ID
                })
                this.isRegisteredReceivables = !this.isRegisteredReceivables;
            },
            //收款请求弹窗控制
            handleReceiptRequest(row) {
                if(!row.order_comm_detail_list.length){
                    this.$message.error('该订单没有产品信息！');
                    return;
                }
                this.sendReceiptRequestInfo = {
                    order_id: row.order_id,
                    platform_code: row.platform_code,
                    account_id: row.account_id,
                    asin: row.order_comm_detail_list[0].asinval,
                    currency: row.currency,
                    buyer_id: row.buyer_id
                }
                this.collectionInformation().then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.collectionInfo = data.data_list;
                    this.isReceiptRequestShow = true;
                })
            },
            //取消（关闭弹窗）
            cancel(){
                this.isInvoice = false
                this.isShowLogShow = false
            },
            //暂扣、作废、批量弹窗
            batchOperationCancel() {
                this.BatchOperation.batchRemark = '';
                this.isBatchShow = false
                this.result = {
                    isShowResult:false,
                    resultType:'暂扣',
                    failure:"",
                    success:""
                }
                // if(this.isBatchShow){
                //     this.isBatchShow = false
                //     this.$refs.BatchOperation.resetFields();
                // }
            },
            handleIsInvoiceShow(bol) {
                this.isInvoice = bol
            },
            //售后单跳转
            handleAfterSaleList(item){
                this.$router.push({path:'/AfterSalesOrderManagement',query:{after_order_number: item.after_id, _cacheType:'1'}});
                let inx = routerConfig.getRouteIndex('/AfterSalesOrderManagement')
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

            goDisputeCenterPage(row) {
                this.$router.push({path:'/DisputeCenter',query:{type:"OrderListManagement",order_id: row.order_id, _cacheType:'1'}});
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
            },
            //发件箱页面
            goInboxPage(row){
                this.$router.push({path:'/MessageCenter',query:{type:"OrderListManagement",order_id: row.order_id, _cacheType:'1'}});
                let inx = routerConfig.getRouteIndex('/MessageCenter')
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
            // //清除登记收款信息
            // handlePaymentMethod(){
            //     this.$refs.sendRegisteredReceivablesInfo.resetFields();
            // },
            //订单详情弹窗
            handleOrderInfo(row){
                this.orderInfo={
                    order_id:row.order_id,
                    platform_code:row.platform_code,
                    edit:false,
                    title:"订单信息",
                    operation:'handleOrder'
                }
                this.isOrderInfoShow=true;
            },
            //售后弹窗
            handleAfterSalesOrders(row,identification,title){
                this.orderInfo={
                    order_id:row.order_id,
                    platform_code:row.platform_code,
                    edit:false,
                    title:title,
                    operation:identification
                }
                this.isOrderInfoShow=true;
                // console.log('isOrderInfoShow',this.isOrderInfoShow)
            },
            handleCancelOrderInfoPopup(bool){
                this.isOrderInfoShow=bool
            },
            handleReload(){
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },
            // 把空格替换
            spaceConversionFn(v) {
                return v.replace(/\s/g, '&nbsp;');
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
        created() {
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.orderListManagementInfo) === "{}") {
            //         // 需要查询客户
            //         // let obj = {};
            //         // if( this.$route.query.customer_name ){
            //         //     obj = {
            //         //         customer_name: this.$route.query.customer_name
            //         //     };
            //         // }
            //         // this.handleQueryInfo(obj);
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo['order_list_management']);
            //         this.handleQueryInfoCallBack(this.orderListManagementInfo);
            //     }
            // } catch (e) {
            //     console.log(e);
            // }
            this.companyPaypalAccount().then(({data}) => {
                this.companyPaypalAccountInfo = data.data_list
            })
            let inx = routerConfig.getRouteIndex(this.$route.path);
            this.$store.commit('SAVE_NAV_INDEX', inx);
        },
    };
</script>

<style lang="less" scoped>
    .orderInfoButton {
        position: relative;

        .el-button.el-button--text.el-button--small {
            font-weight: 600;
            color: #333;
        }

        .ui-top_i {
            position: absolute;
            display: block;
            left: 50%;
            margin-left: -50px;
            cursor: pointer;
            height: 8px;
            line-height: 8px;
            top: -1px;
        }
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
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

    .el-button.el-button--text {
        font-size: 12px !important;
    }

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

    /deep/.underLineReceivables,
    .onLineReceivables {
        border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        padding: 10px 0;
        margin: 10px 0;
        font-size: 12px;

        .el-input.el-input--small {
            width: 250px;
        }

        .receivablesQuota {
            .el-input.el-input--small {
                width: 140px;
            }

            .company {
                margin-left: 10px;

                .el-select.el-select--small {
                    width: 100px;

                    .el-input.el-input--small.el-input--suffix {
                        width: 100%;
                        line-height: 42px;
                    }
                }
            }
        }
    }


    .ui-main-module {
        /deep/ .ui-main-module-table {
            .el-table {
                .el-table__body {
                    .el-table__row {
                        td:nth-child(2) {
                            position: relative;
                            overflow: hidden;
                        }
                    }
                }
            }
        }
    }

    .rbadge {
        position: absolute;
        right: -27px;
        top: -27px;
        width: 54px;
        height: 54px;
        color: #fff;
        background: #74b0fc;
        transform: rotate(45deg);
        display: flex;
        align-items: flex-end;
        justify-content: center;

        &.rbadgea {
            background: #fdcc51;
        }
    }

    .advance {
        background-color: #FAA52F;
        color: white;
        border-radius: 3px;
        display: inline-block;
        padding: 2px 3px;
        font-size: 10px;
        position: absolute;
        top: 5px;
        &.advancea {
            background-color: #cccccc;
        }
    }
    .B2B {
        background-color: #FAA52F;
        color: white;
        border-radius: 3px;
        display: inline-block;
        padding: 2px 3px;
        font-size: 10px;
        position: absolute;
        top: 5px;
        left: 60px;
        &.B2BS {
            background-color: #cccccc;
        }
    }
    //气泡
    .el-popover{
        font-size: 12px !important;
        line-height: 1.8 !important;
        color: #333333 !important;
    }
    .batchRemark{
        /deep/.el-input__count{
            line-height: 15px;
            bottom: 2px;
        }
    }
    .logs{
        /deep/.el-table{
            height: auto;
        }
        /deep/.el-table__body-wrapper{
            max-height: 500px;
            overflow-y: auto;
        }
    }
</style>

<style>
    .orderRemark{
        word-wrap:break-word;
    }
    .afterId{
        max-height: 500px;
        overflow-y: auto;
    }
</style>