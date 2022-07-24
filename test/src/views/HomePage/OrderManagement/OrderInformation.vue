<template>
    <el-dialog
        :title="title"
        width="1700px"
        top="2vh"
        class="ui-layout_edit-dialog"
        id="orderInformationPopup"
        :visible.sync="isOrderInfo"
        :modal-append-to-body="false"
        @close="handleCancelOrderInfoPopup">
            <div class="ui-main-module">
                <div class="ui-search-area search">
                    <el-form  label-width="70px">
                        <el-form-item label="系统进度" class="cuslabelheight66">
                            <el-steps :active="systemProgressSteps" align-center finish-status="finish">
                                <el-step
                                    v-if="!item.isShow"
                                    class="systemProgressNodeInfo"
                                    :title="item.name"
                                    :description="item.time"
                                    :status="item.time?item.process_status:'wait'"
                                    :key="item.name"
                                    v-for="item in systemProgressNodeInfo">
                                </el-step>
                            </el-steps>
                        </el-form-item>
                        <el-form-item label="平台进度" class="cuslabelheight66 cuslabelheightPlatform">
                            <el-steps :active="platformProgressSteps" align-center finish-status="finish">
                                <el-step title="平台付款时间" :description="platformProgressTime.pay_time"></el-step>
                                <el-step title="发货开始时间" :description="platformProgressTime.daearliest_ship_date"></el-step>
                                <el-step title="发货结束时间" :description="platformProgressTime.latest_ship_date"></el-step>
                                <el-step title="预计妥投时间" :description="platformProgressTime.scheduled_delivery_start_date"></el-step>
                                <el-step title="妥投结束时间" :description="platformProgressTime.scheduled_delivery_end_date"></el-step>
                            </el-steps>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="orderInfoButton" v-if="operationOrderSingle.orderInfoButton&&obtainOrderDetails.orderDetailsInfo">
                    <el-button type="primary" size="small" @click="handleToVoid('作废')" v-show="obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?false:true"
                        :disabled="(obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel=='FBA'||(obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel=='FBM'
                                    &&(obtainOrderDetails.orderDetailsInfo.complete_status==='部分发货'||obtainOrderDetails.orderDetailsInfo.complete_status==='已发货'))
                                    &&obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON')||(obtainOrderDetails.orderDetailsInfo.platform_code==='EB'
                                    &&(obtainOrderDetails.orderDetailsInfo.complete_status==='部分发货'||obtainOrderDetails.orderDetailsInfo.complete_status==='已发货'))"
                    >作废</el-button>

                    <!-- <el-button type="primary" size="small" @click="handleCancelOperation()" v-show="obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?true:false">取消作废 </el-button> -->
                    <el-button type="primary" size="small" @click="HandleWithhold('暂扣')" v-show="iswithholdShow"
                        v-if="obtainOrderDetails.orderDetailsInfo.complete_status=='已完成'||obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?false:true"
                        :disabled="(obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel=='FBA'||(obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel=='FBM'
                                    &&(obtainOrderDetails.orderDetailsInfo.complete_status==='部分发货'||obtainOrderDetails.orderDetailsInfo.complete_status==='已发货'))
                                    &&obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON')||(obtainOrderDetails.orderDetailsInfo.platform_code==='EB'
                                    &&(obtainOrderDetails.orderDetailsInfo.complete_status==='部分发货'||obtainOrderDetails.orderDetailsInfo.complete_status==='已发货'))"
                        >暂扣</el-button>

                    <el-button type="primary" size="small" @click="handleCancelOperation()" v-show="!iswithholdShow&&orderInfo.operation!='handlePageINR'&&orderInfo.operation!='handlePageReturn'&&orderInfo.operation!='handlePageCancel'"
                        v-if="obtainOrderDetails.orderDetailsInfo.complete_status=='已完成'||obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'?false:true"
                        :disabled="(obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel=='FBA'||(obtainOrderDetails.orderDetailsInfo.amazon_fulfill_channel=='FBM'
                                    &&(obtainOrderDetails.orderDetailsInfo.complete_status==='部分发货'||obtainOrderDetails.orderDetailsInfo.complete_status==='已发货'))
                                    &&obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON')||(obtainOrderDetails.orderDetailsInfo.platform_code==='EB'
                                    &&(obtainOrderDetails.orderDetailsInfo.complete_status==='部分发货'||obtainOrderDetails.orderDetailsInfo.complete_status==='已发货'))"
                        >取消暂扣</el-button>

                    <el-button type="primary" size="small" id="operationOrderButton" @click="operationOrder('登记退款单')" v-if="orderInfo.operation!='handlePageINR'&&orderInfo.operation!='handlePageReturn'&&orderInfo.operation!='handlePageCancel'">登记退款单</el-button>
                   
                    <el-button type="primary" size="small" @click="operationOrder('登记客诉单')" v-if="orderInfo.operation!='handlePageINR'&&orderInfo.operation!='handlePageReturn'&&orderInfo.operation!='handlePageCancel'">登记客诉单</el-button>
                   
                    <el-button type="primary" size="small" @click="operationOrder('新建售后单')">新建售后单</el-button>

                    <el-button type="primary" size="small" @click="handleContactBuyers" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">联系买家</el-button>

                    <el-button type="primary" size="small" @click="orderInvoice" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'">发票</el-button>

                    <el-button type="primary" size="small"  v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='EB'"
                                        @click="handleMessageContact(obtainOrderDetails,'消息联系')">消息联系</el-button>

                    <el-button type="primary" size="small" v-if="obtainOrderDetails.orderDetailsInfo.platform_code==='AMAZON'" @click="orderInvoice(obtainOrderDetails.orderDetailsInfo,true)"
                                :disabled="obtainOrderDetails.orderDetailsInfo.is_business_order!='1'||(obtainOrderDetails.orderDetailsInfo.site.toUpperCase()!='DE'&& obtainOrderDetails.orderDetailsInfo.site.toUpperCase()!='IT'
                                &&obtainOrderDetails.orderDetailsInfo.site.toUpperCase()!='FR'&&obtainOrderDetails.orderDetailsInfo.site.toUpperCase()!='SP'
                                &&obtainOrderDetails.orderDetailsInfo.site.toUpperCase()!='UK')">B2B发票</el-button>

                    <el-button type="primary" size="small" @click="handleCancelClosingOrder(obtainOrderDetails.orderDetailsInfo)"
                                :disabled="((obtainOrderDetails.orderDetailsInfo.complete_status==='部分发货'||obtainOrderDetails.orderDetailsInfo.complete_status==='已发货')
                                &&obtainOrderDetails.orderDetailsInfo.orderType==='合并后的订单')||obtainOrderDetails.orderDetailsInfo.orderType!=='合并后的订单'">取消合单</el-button>

                </div>
                <div v-if="!operationOrderSingle.orderInfoButton" style="padding:5px 0;"></div>
                <el-collapse v-model="activeNames" @change="handleChange">
                <div class="orderInformationMain">
                    <!-- 退款、退货、重寄 -->
                    <el-row id="mainPart">
                        <el-col :span="operationOrderSingle.orderInformationMainRight">
                            <div class="orderInformationMainRight" ref="orderInformationMainRight">
                                <OrderDetailsInfo
                                    :operationOrderSingle='operationOrderSingle'
                                    :obtainOrderDetails='obtainOrderDetails'
                                    :skuInfo='skuInfo'
                                    :deleteTips='deleteTips'
                                    :order='orderInfo'
                                    :orderDetailsCustomerComplaintInfo="orderDetailsCustomerComplaintInfo"
                                    @handleGoDispute="goDispute"
                                    @handleClickImg="handleClickImg"
                                    @handleSaveRemark='handleChildSaveRemark'
                                    @handleOrderDeleteRemark='handleOrderDeleteRemarkInfo'
                                    @handleProductInfoAddDeleteEdit='handleProductInfoAddDeleteEditInfo'
                                    @handleProErpSku='handleProErpSku'
                                    @handleFeedBackEvent='handleFeedBackEvent'
                                    @handleReviewEvent="handleReviewEvent"
                                    @handleobtainReturnCode="handleobtainReturnCode"
                                    @handleAfterSaleList="handleAfterSaleList"
                                    @handleDisputeEvent="handleDisputeEvent"
                                    @handleComplaintOrder="handleComplaintOrder"
                                    @handlelogisticsDetailsDetermine="currentLoadOrderInfo()"
                                    />
                                <!-- <div style="text-align: right;font-size: 18px;">
                                    <el-button size="medium" @click="handleReturn" type="primary" style="margin:10px 30px 10px 0;">返回</el-button>
                                </div> -->
                            </div>
                        </el-col>
                        <el-col :span="operationOrderSingle.orderInformationMainLeft">
                            <div class="orderInformationMainLeft" ref="orderInformationMainLeft">
                                <div v-if="operationOrderSingle.afterSale">
                                    <el-form  label-width="110px" :model="addNewAfterSaleListParameter" ref="addNewAfterSaleListParameter"  :rules="mustFill">
                                        <div class="responsibilities" style="display:flex;">
                                            <el-form-item  label-width="96px" label="不良类型" prop="department_id">
                                            <!-- <el-form-item  label-width="96px" label="责任所属部门" prop="department_id"> -->
                                                <el-select size="small"placeholder="请选择" v-model="addNewAfterSaleListParameter.department_id" @change="twoLevelLinkage">
                                                        <el-option
                                                            v-for="item in addNewAfterSalesOrder.department_id"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id">
                                                        </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="不良原因" prop="reason_id">
                                            <!-- <el-form-item label="详细原因" prop="reason_id">     -->
                                                <el-select  size="small" placeholder="请选择" v-model="addNewAfterSaleListParameter.reason_id" @change="reasonChange">
                                                        <el-option
                                                            v-for="item in twoLevelLinkageInfo"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id">
                                                        </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                        <div style="margin:15px 0;">
                                            <el-form-item label="不良原因说明">
                                                <el-input v-model="addNewAfterSaleListParameter.descriptionAdverseCauses" style="width:576px;" type="textarea" rows="2" disabled></el-input>
                                            </el-form-item>
                                        </div>
                                        <div class="refundRemark">
                                            <el-form-item label="备注" label-width="100">
                                                <el-input v-model="addNewAfterSaleListParameter.remark" type="textarea" rows="3" placeholder="请输入内容,不能超过250个字符" maxlength="250" show-word-limit></el-input>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <div v-if="obtainOrderDetailsGinseng.platform_code==='EB'">
                                                <div style="font-weight: 700;margin:10px 0px 0px;">问题产品:</div>
                                                <table cellspacing="0" cellpadding="0" style="width: 100%;">
                                                    <tr>
                                                        <td width="50" style="background: #FAFAFA;">操作</td>
                                                        <td width="300" style="background: #FAFAFA;">SKU</td>
                                                        <td width="200" style="background: #FAFAFA;">数量</td>
                                                    </tr>
                                                    <tr v-for="item in issue">
                                                        <td style="text-align:center;">
                                                            <el-checkbox v-model="item.bool"  @change="(b)=>handleIssueOption(b,item)"></el-checkbox>
                                                        </td>
                                                        <td>{{item.sku}}</td>
                                                        <td>
                                                            <el-input-number style="width: 240px;" @change="handleIssueOption(item.bool,item)" v-model="item.issue_quantity" size="mini" :min="1" :precision="0"></el-input-number>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div style="display:flex;">
                                                <div>
                                                    <el-form-item label="售后单类型" label-width="83px" prop="type">
                                                        <template>
                                                            <el-checkbox-group v-model="addNewAfterSaleListParameter.type">
                                                                <el-checkbox label="1" @change="handleRefundShow" :disabled="afterSalesOrderEditInfo.edit||obtainOrderDetails.orderDetailsInfo.orderType=='拆分后的子订单'||obtainOrderDetails.orderDetailsInfo.orderType=='合并后的订单'">退款</el-checkbox>
                                                                <el-checkbox label="2" v-if="operationOrderSingle.refund" @change="handleReturnShow" :disabled="afterSalesOrderEditInfo.edit||orderInfo.type==='refund'">退货</el-checkbox>
                                                                <el-checkbox label="3" v-if="operationOrderSingle.refund" @change="handleReSendShow" :disabled="afterSalesOrderEditInfo.edit||obtainOrderDetails.orderDetailsInfo.complete_status==='已取消'||obtainOrderDetails.orderDetailsInfo.orderType=='拆分的主订单'||obtainOrderDetails.orderDetailsInfo.orderType=='被合并的订单'">重寄</el-checkbox>
                                                            </el-checkbox-group>
                                                        </template>
                                                    </el-form-item>
                                                </div>
                                                <div style="color:red;line-height: 40px;margin-left: 30px;">
                                                    <div v-if="obtainOrderDetails.orderDetailsInfo.orderType=='拆分后的子订单'">拆分订单只能在拆分主订单上登记退款单！</div>
                                                    <div v-if="obtainOrderDetails.orderDetailsInfo.orderType=='被合并的订单'">合并订单只能在合并后的订单上新建重寄单！</div>
                                                    <div v-if="obtainOrderDetails.orderDetailsInfo.orderType=='拆分的主订单'">拆分订单只能在拆分子订单上新建重寄单！</div>
                                                    <div v-if="obtainOrderDetails.orderDetailsInfo.orderType=='合并后的订单'">合并订单只能在被合并的订单上登记退款单！</div>
                                                    <div v-if="obtainOrderDetails.orderDetailsInfo.complete_status=='已取消'">该订单已作废，不能创建重寄单！</div>
                                                </div>
                                            </div>

                                        </div>
                                        <div v-show="obtainOrderDetails.salesAfterDetailsInfo.length===0?false:true" style="display:flex;line-heigth:16px;width:100%;">
                                            <div style="color:red;font-size:12px;white-space:nowrap;">当前订单已有售后单：</div>
                                            <div style="word-wrap:break-word;flex:1;">
                                                <el-row>
                                                    <span v-for="(item,index) in obtainOrderDetails.salesAfterDetailsInfo">
                                                        <el-col :span="8">
                                                            <span v-if="item.type=='退款'" :key="item.after_sale_id">退款<span style="cursor: pointer;color: #409EFF;" @click="handleAfterSaleList(item)">{{item.after_sale_id}}</span><span v-show="index!=obtainOrderDetails.salesAfterDetailsInfo.length-1">，</span></span>
                                                            <span v-if="item.type=='退货'" :key="item.after_sale_id">退货<span style="cursor: pointer;color: #409EFF;" @click="handleAfterSaleList(item)">{{item.after_sale_id}}</span><span v-show="index!=obtainOrderDetails.salesAfterDetailsInfo.length-1">，</span></span>
                                                            <span v-if="item.type=='重寄'" :key="item.after_sale_id">重寄<span style="cursor: pointer;color: #409EFF;" @click="handleAfterSaleList(item)">{{item.after_sale_id}}</span><span v-show="index!=obtainOrderDetails.salesAfterDetailsInfo.length-1">，</span></span>
                                                        </el-col>
                                                    </span>
                                                </el-row>
                                            </div>
                                        </div>
                                    <div>
                                        <div class="afterSaleOrderInfo" v-if="AfterSaleTypeShow.refundInformation">
                                            <el-collapse-item title="| 退款信息" name="refundInfo" id="storageLogisticsAnchor" class="headerInfoScrollTop">
                                                <div class="orderInformationMainInfo">
                                                    <div style="border-bottom:1px solid #e6e6e6;padding:0 0 20px 0;" v-for="(value,index) in addNewAfterSaleListParameter.refund" v-if="obtainOrderDetailsGinseng.platform_code!=='EB'">
                                                        <el-checkbox v-model="value.isSubmission" @change="handleRefundSelection(index)"></el-checkbox>
                                                        <div class="rowSpacing"><div style="width:100px;margin-right: 0;flex-shrink:0;">退款商品名称：</div><span>{{value.cn_title?value.cn_title:value.en_title}}</span></div>
                                                        <div class="rowSpacing">
                                                            <el-form-item label="平台退款原因" label-width="96px" :prop="'refund.'+index+'.reason_code'" :rules="[{required: true,message: '退款原因不能为空',trigger: 'blur'}]">
                                                                <template>
                                                                    <el-select v-model="value.reason_code" size="mini" placeholder="请选择">
                                                                        <el-option
                                                                        v-for="(item,key) in platformReasons"
                                                                        :key="key"
                                                                        :label="item"
                                                                        :value="key">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </el-form-item>
                                                        </div>
                                                        <div class="rowSpacing refundInput">
                                                            <table cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td style="width:160px;">金额类型</td>
                                                                    <td style="width:160px;">金额</td>
                                                                    <td style="width:160px;">退款金额</td>
                                                                    <td style="width:160px;">退款比例(%)</td>
                                                                    <td style="width:160px;">
                                                                        <el-checkbox v-model="value.isWholeRefund" @change="(bool)=>handleFullAmount(bool,value,index)" >是否全额退款</el-checkbox>
                                                                    </td>
                                                                </tr>
                                                                <!-- product -->
                                                                <tr>
                                                                    <td>product</td>
                                                                    <td>{{value.item_price}}</td>
                                                                    <td>
                                                                        <el-form-item style="margin-right :0;" label-width="0" :prop="'refund.'+index+'.item_price_amount_refund'" :rules="[{required: true,message: '退款金额不能为空',trigger: 'blur'},
                                                                        {pattern: /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/,message: '不能为负数，且只能保留小数点后两位！'}]">
                                                                            <el-input type="text" size="mini" v-if="!value.isSubmission" placeholder="" style="width:200px;margin:0;height:28px;" v-model.trim="value.item_price_amount_refund" @change="handleClick(value,'item_price_amount',index)"/>
                                                                            <el-input type="text" size="mini" placeholder="" v-if="value.isSubmission" style="width:200px;margin:0;height:28px;" v-model.trim="value.item_price_amount_refund" @change="handleClick(value,'item_price_amount',index)"/>
                                                                        </el-form-item>
                                                                        <!-- <el-form-item style="margin-right :0;" label-width="0" v-if="value.isSubmission&&!value.item_price" :prop="'refund.'+index+'.item_price_amount_refund'" :rules="[{required: true,message: '退款金额不能为空',trigger: 'blur'},
                                                                        {pattern: /^0?$/,message: '不符合规范！'}]">
                                                                            <el-input type="text" size="mini" placeholder="" style="width:240px;margin:0;" v-model.trim="value.item_price_amount_refund" @change="handleClick(value,'item_price_amount',index)"/>
                                                                        </el-form-item> -->
                                                                    </td>
                                                                    <td>
                                                                        <el-input-number size="mini" v-model="value.item_price_amount_proportion" controls-position="right"  class="proportion"
                                                                            :min="0" :max="100" :precision="2" @change="handleProportionCalculation(value,'item_price_amount',index)"></el-input-number>%
                                                                    </td>
                                                                    <td>MAX:{{value.item_price}} {{value.item_currency_code}}</td>
                                                                </tr>
                                                                <!-- product tax -->
                                                                <tr v-if="value.item_tax_amount">
                                                                    <td>product tax</td>
                                                                    <td>{{value.item_tax_amount}}</td>
                                                                    <td>
                                                                        <el-form-item label-width="0" :prop="'refund.'+index+'.item_tax_amount_refund'" :rules="[{required: true,message: '退款金额不能为空',trigger: 'blur'},
                                                                        {pattern: /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/,message: '不能为负数，且只能保留小数点后两位！'}]">
                                                                            <el-input type="text" size="mini" v-if="!value.isSubmission" placeholder="" style="width:200px;margin:0;height:28px;" v-model.trim="value.item_tax_amount_refund" @change="handleClick(value,'item_tax_amount',index)"/>
                                                                            <el-input type="text" size="mini"  v-if="value.isSubmission" placeholder="" style="width:200px;margin:0;height:28px;" v-model.trim="value.item_tax_amount_refund" @change="handleClick(value,'item_tax_amount',index)"/>
                                                                        </el-form-item>
                                                                    </td>
                                                                    <td>
                                                                        <el-input-number size="mini" v-model="value.item_tax_amount_proportion" controls-position="right" class="proportion"
                                                                            :min="0" :max="100" :precision="2" @change="handleProportionCalculation(value,'item_tax_amount',index)"></el-input-number>%
                                                                    </td>
                                                                    <td>MAX:{{value.item_tax_amount}} {{value.item_tax_currency_code}}</td>
                                                                </tr>
                                                                <!-- Shipping Price -->
                                                                <tr v-if="value.final_shipping_amount">
                                                                    <td>Shipping Price</td>
                                                                    <td>{{value.final_shipping_amount}}</td>
                                                                    <td>
                                                                        <el-form-item label-width="0" :prop="'refund.'+index+'.shipping_discount_amount_refund'" :rules="[{required: true,message: '退款金额不能为空',trigger: 'blur'},
                                                                        {pattern: /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/,message: '不能为负数，且只能保留小数点后两位！'}]">
                                                                            <el-input type="text" size="mini" v-if="!value.isSubmission" placeholder="" style="width:200px;margin:0;height:28px;" v-model.trim="value.shipping_discount_amount_refund" @change="handleClick(value,'shipping_discount_amount',index)"/>
                                                                            <el-input type="text" size="mini" v-if="value.isSubmission" placeholder="" style="width:200px;margin:0;height:28px;" v-model.trim="value.shipping_discount_amount_refund" @change="handleClick(value,'shipping_discount_amount',index)"/>
                                                                        </el-form-item>
                                                                    </td>
                                                                    <td>
                                                                        <el-input-number size="mini" v-model="value.shipping_discount_amount_proportion" controls-position="right" class="proportion"
                                                                            :min="0" :max="100" :precision="2" @change="handleProportionCalculation(value,'shipping_discount_amount',index)"></el-input-number>%
                                                                    </td>
                                                                    <td>MAX:{{value.final_shipping_amount}} {{value.shipping_discount_currency_code}}</td>
                                                                </tr>
                                                                <!-- Shipping Tax -->
                                                                <tr v-if="value.shipping_tax_amount">
                                                                    <td>Shipping Tax</td>
                                                                    <td>{{value.shipping_tax_amount}}</td>
                                                                    <td>
                                                                        <el-form-item label-width="0" :prop="'refund.'+index+'.shipping_tax_amount_refund'" :rules="[{required: true,message: '退款金额不能为空',trigger: 'blur'},
                                                                        {pattern: /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/,message: '不能为负数，且只能保留小数点后两位！'}]">
                                                                            <el-input type="text" size="mini" v-if="!value.isSubmission" placeholder="" style="width:200px;margin:0;height:28px;" v-model.trim="value.shipping_tax_amount_refund" @change="handleClick(value,'shipping_tax_amount',index)"/>
                                                                            <el-input type="text" size="mini" v-if="value.isSubmission" placeholder="" style="width:200px;margin:0;height:28px;" v-model.trim="value.shipping_tax_amount_refund" @change="handleClick(value,'shipping_tax_amount',index)"/>
                                                                        </el-form-item>
                                                                    </td>
                                                                    <td>
                                                                        <el-input-number size="mini" v-model="value.shipping_tax_amount_proportion" controls-position="right" class="proportion"
                                                                            :min="0" :max="100" :precision="2" @change="handleProportionCalculation(value,'shipping_tax_amount',index)"></el-input-number>%
                                                                    </td>
                                                                    <td>MAX:{{value.shipping_tax_amount}} {{value.shipping_tax_currency_code}}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div v-if="obtainOrderDetailsGinseng.platform_code==='EB'">
                                                        <div style="display:flex;">
                                                            <div style="margin-right:20px;">
                                                                <el-form-item label-width="none" prop="refund_amount" label="退款金额：">
                                                                    <el-input-number size="mini" controls-position="right" style="width:240px;" :min="0" :precision="2"
                                                                          v-model="addNewAfterSaleListParameter.refund_amount" @change="handleRefundAmount"/>
                                                                </el-form-item>
                                                            </div>
                                                            <div style="margin-right:20px;">
                                                                <el-form-item label-width="none"label="退款比例：">
                                                                    <el-input-number size="mini" controls-position="right" style="width:240px;" :min="0" :max="100" :precision="2"
                                                                         v-model="addNewAfterSaleListParameter.refund_ratio" @change="handleRefundRatio"/>%
                                                                </el-form-item>
                                                            </div>
                                                            <el-form-item label-width="none" label="最大退款金额：">
                                                                <div style="font-size:12px;color:#333;">{{residualRefundAmount}} {{obtainOrderDetails.orderDetailsInfo.currency}}</div>
                                                            </el-form-item>
                                                        </div>
                                                    </div>
                                                    <el-form-item label="订单留言" label-width="100" prop="refund_detail">
                                                        <el-input v-model="addNewAfterSaleListParameter.refund_detail" type="textarea" rows="3"  placeholder="请输入内容,不能超过250个字符" maxlength="250" show-word-limit></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-collapse-item>
                                        </div>
                                        <div class="afterSaleOrderInfo" v-if="AfterSaleTypeShow.returnInformation">
                                            <el-collapse-item title="| 退货信息" name="returnGoodsInfo" id="storageLogisticsAnchor" class="headerInfoScrollTop">
                                            <div class="orderInformationMainInfo">
                                                <div class="rowSpacing">
                                                    <table cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td width="300">产品名称</td>
                                                            <td width="150">SKU</td>
                                                            <td width="50">数量</td>
                                                            <td width="150">产品线</td>
                                                            <td width="15"></td>
                                                        </tr>
                                                        <tr v-for="(item,index) in addNewAfterSaleListParameter.return">
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'return.'+index+'.product_title'" :rules="productFormVerification.product_title">
                                                                    <el-input size="mini" placeholder v-model.trim="item.product_title"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'return.'+index+'.sku'" :rules="productFormVerification.sku">
                                                                    <el-input size="mini" placeholder v-model.trim="item.sku" @change="handleProErpSku(item.sku,'return',index)"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'return.'+index+'.issue_quantity'" :rules="productFormVerification.issue_quantity">
                                                                    <el-input size="mini" placeholder v-model.trim="item.issue_quantity" @change="handleChangeQuantity('return',index)"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'return.'+index+'.linelist_cn_name'" :rules="productFormVerification.linelist_cn_name">
                                                                    <el-input size="mini" placeholder v-model.trim="item.linelist_cn_name"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <i class="el-icon-circle-plus-outline" style="cursor: pointer;" @click="handleAddProductInfo('退货')"></i>
                                                                <i class="el-icon-remove-outline" style="cursor: pointer;" @click="handleDeleteProductInfo('退货',index)" v-show='addNewAfterSaleListParameter.return.length==1?false:true'></i>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div class="rowSpacing returnGoods">
                                                    <div >
                                                        <el-form-item label="退回仓库" label-width="90"  prop="warehouse_id">
                                                                <el-select v-model="addNewAfterSaleListParameter.warehouse_id" filterable v-filter size="mini" clearable placeholder="请选择">
                                                                    <el-option v-for="(item,key,index) in addNewAfterSalesOrder.warehouse" :key="key" :label="item" :value="key"></el-option>
                                                                </el-select>
                                                        </el-form-item>
                                                    </div>
                                                    <div style="margin-left:30px;">
                                                        <el-form-item label="运输方式" label-width="90"  prop="carrier">
                                                            <el-input v-model.trim="addNewAfterSaleListParameter.carrier" placeholder="" size="mini"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                    <div style="margin-left:40px;">
                                                        <el-form-item label="跟踪号" label-width="90"  prop="tracking_no">
                                                            <el-input v-model.trim="addNewAfterSaleListParameter.tracking_no" placeholder="" size="mini"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                                <div class="rowSpacing rowSpacingObtain">
                                                    <div>
                                                        <el-form-item label="RMA" label-width="90" prop="rma">
                                                            <div style="width:100%;display:flex;heigth:28px;">
                                                                <el-input v-model.trim="addNewAfterSaleListParameter.rma" placeholder="" size="mini"></el-input>
                                                                <el-button type="primary" size="mini" @click="handleRmaObtain">获取RMA</el-button>
                                                            </div>
                                                        </el-form-item>
                                                    </div>
                                                    <div>
                                                        <el-form-item label="退货编码" label-width="90" prop="refund_code">
                                                            <div style="width:100%;display:flex;">
                                                                <el-input v-model.trim="addNewAfterSaleListParameter.refund_code" placeholder="" size="mini"></el-input>
                                                                <el-button type="primary" size="mini" @click="handleReturnCodeObtain">获取退货编码</el-button>
                                                            </div>
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                                <div class="refundRemark">
                                                    <el-form-item label="备注" label-width="100" prop="return_remark">
                                                        <el-input v-model="addNewAfterSaleListParameter.return_remark" type="textarea" rows="3" placeholder="请输入内容,不能超过250个字符" maxlength="250" show-word-limit></el-input>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                            </el-collapse-item>
                                        </div>
                                        <div class="afterSaleOrderInfo" v-if="AfterSaleTypeShow.reSendInformation">
                                            <el-collapse-item title="| 重寄信息" name="reSendInfo" id="storageLogisticsAnchor" class="headerInfoScrollTop">
                                            <div class="orderInformationMainInfo">
                                                <el-collapse-item title="产品信息" name="reSendProductInfo" id="packageInfoAnchor" class="headerInfoScrollTop reSendInfo">
                                                    <table cellspacing="0" cellpadding="0" style="margin-top:10px;">
                                                        <tr>
                                                            <td width="300">产品名称</td>
                                                            <td width="150">SKU</td>
                                                            <td width="50">数量</td>
                                                            <td width="150">产品线</td>
                                                            <td width="15"></td>
                                                        </tr>
                                                        <tr v-for="(item,index) in addNewAfterSaleListParameter.redirect">
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'redirect.'+index+'.product_title'" :rules="productReSend.product_title">
                                                                    <el-input style="width:100%" size="mini" placeholder="" v-model.trim="item.product_title"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'redirect.'+index+'.sku'" :rules="productReSend.sku">
                                                                    <el-input style="width:100%" size="mini" placeholder="" v-model.trim="item.sku" @change="handleProErpSku(item.sku,'redirect',index,'重寄')"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'redirect.'+index+'.issue_quantity'" :rules="productReSend.issue_quantity">
                                                                    <el-input style="width:100%" size="mini" placeholder="" v-model.trim="item.issue_quantity" @change="handleChangeQuantity('redirect',index)"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <el-form-item label-width="0" :prop="'redirect.'+index+'.linelist_cn_name'" :rules="productReSend.linelist_cn_name">
                                                                    <el-input style="width:100%" size="mini" placeholder="" v-model.trim="item.linelist_cn_name"/>
                                                                </el-form-item>
                                                            </td>
                                                            <td>
                                                                <i class="el-icon-circle-plus-outline" style="cursor: pointer;" @click="handleAddProductInfo('重寄')"></i>
                                                                <i class="el-icon-remove-outline" style="cursor: pointer;" @click="handleDeleteProductInfo('重寄',index)" v-show='addNewAfterSaleListParameter.redirect.length==1?false:true'></i>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </el-collapse-item>
                                                <el-collapse-item title="收货地址信息" name="reSendReceivingAddressInfo" id="packageInfoAnchor" class="headerInfoScrollTop reSendInfo">
                                                    <div class="receivingAddressInfo">
                                                        <div style="display:flex;height:40px;">
                                                            <div  style="width:50%;padding:0 20px 0 0;">
                                                                <el-form-item label="收件人" prop="ship_name"  label-width="70px">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.ship_name" type="text"  size="mini" placeholder=""></el-input>
                                                                </el-form-item>
                                                            </div>
                                                            <div  style="width:50%;padding-right:20px;">
                                                                <el-form-item label="收货街道地址1" prop="ship_street1">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.ship_street1" size="mini" type="text" placeholder=""></el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </div>
                                                        <div style="display:flex;height:40px;">
                                                            <div  style="width:50%;padding-right:20px;">
                                                                <el-form-item label="电话" prop="ship_phone" label-width="70px">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.ship_phone" type="text" size="mini" placeholder=""></el-input>
                                                                </el-form-item>
                                                            </div>
                                                            <div  style="width:50%;padding-right:20px;">
                                                                <el-form-item label="收货街道地址2" prop="ship_street2">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.ship_street2" type="text" size="mini" placeholder=""></el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </div>
                                                        <div style="display:flex;">
                                                            <div class="country" style="width:50%;padding-right:20px;height:40px;">
                                                                <el-form-item label="国家" filterable v-filter prop="ship_country" label-width="70px">
                                                                    <template>
                                                                        <el-select v-model="addNewAfterSaleListParameter.ship_country" filterable v-filter  size="mini" placeholder="请选择">
                                                                            <el-option
                                                                            v-for="(item,key,index) in addNewAfterSalesOrder.ship_country"
                                                                            :key="key"
                                                                            :label="item"
                                                                            :value="key">
                                                                            </el-option>
                                                                        </el-select>
                                                                    </template>
                                                                </el-form-item>
                                                            </div>
                                                            <div  style="width:50%;padding-right:20px;height:40px;">
                                                                <el-form-item label="省/州" prop="ship_stateorprovince">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.ship_stateorprovince" type="text" size="mini" placeholder=""></el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </div>
                                                        <div style="display:flex;">
                                                            <div  style="width:50%;padding-right:20px;height:40px;">
                                                                <el-form-item label="邮编" prop="ship_zip" label-width="70px">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.ship_zip" type="text" size="mini" placeholder=""></el-input>
                                                                </el-form-item>
                                                            </div>
                                                            <div  style="width:50%;padding-right:20px;height:40px;">
                                                                <el-form-item label="城市" prop="ship_city_name">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.ship_city_name" type="text" size="mini" placeholder=""></el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </el-collapse-item>
                                                <el-collapse-item title="仓库物流信息" name="reSendWarehouseLogisticsInfo" id="packageInfoAnchor" class="headerInfoScrollTop reSendInfo">
                                                    <div class="logisticsInfo">
                                                        <div  style="width:50%;height:40px;padding:10px 20px 0 0;">
                                                            <el-form-item label="发货仓库"  prop="redirect_warehouse_id" label-width="70px">
                                                                <el-select v-model="addNewAfterSaleListParameter.redirect_warehouse_id" size="mini" @change="handleGetShipCode(addNewAfterSaleListParameter.redirect_warehouse_id,true)" placeholder="请选择" clearable filterable v-filter>
                                                                    <el-option
                                                                            v-for="(item,key,index) in addNewAfterSalesOrder.warehouse"
                                                                            :key="key"
                                                                            :label="item"
                                                                            :value="key">
                                                                            </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </div>
                                                        <div  style="width:50%;height:40px;padding:10px 20px 0 0;">
                                                            <el-form-item label="邮寄方式" prop="ship_code">
                                                                <template>
                                                                        <el-select v-model="addNewAfterSaleListParameter.ship_code" filterable v-filter size="mini" clearable placeholder="请选择">
                                                                            <el-option
                                                                                v-for="(item,key,index) in ship_code_info"
                                                                                :key="key"
                                                                                :label="item"
                                                                                :value="key">
                                                                            </el-option>
                                                                        </el-select>
                                                                </template>
                                                            </el-form-item>
                                                        </div>
                                                    </div>
                                                </el-collapse-item>
                                                <el-collapse-item title="订单发货备注" name="reSendOrderDeliverGoodsInfo" id="packageInfoAnchor" class="headerInfoScrollTop reSendInfo">
                                                        <div class="orderDeliverRemarks">
                                                            <el-form-item label="订单备注" prop="order_remark" label-width="70px">
                                                                <el-input v-model="addNewAfterSaleListParameter.order_remark" type="text" size="mini" placeholder="" show-word-limit maxlength="100"></el-input>
                                                            </el-form-item>
                                                            <el-form-item label="发货备注" prop="print_remark" label-width="70px">
                                                                <el-input v-model="addNewAfterSaleListParameter.print_remark" type="text" size="mini" placeholder="" show-word-limit maxlength="100"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                </el-collapse-item>
                                                <el-collapse-item title="加钱重寄金额" name="reSendAddMoneyInfo" id="packageInfoAnchor" class="headerInfoScrollTop reSendInfo">
                                                        <div class="addMoneyReSend">
                                                            <div class="rowSpacing" style="padding: 0 0 0 10px;">
                                                                <div>重寄亏损：<span>{{addNewAfterSaleListParameter.refund_loss}}</span></div>&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </div>
                                                            <div class="paypal" style="display:flex;">
                                                                <div  style="width:50%;padding-right:20px;">
                                                                <el-form-item label="paypal账号" label-width="95px" prop="paypal_email">
                                                                    <template>
                                                                            <el-select v-model="addNewAfterSaleListParameter.paypal_email" filterable v-filter  size="mini" placeholder="请选择">
                                                                                <el-option
                                                                                v-for="(item,key,index) in addNewAfterSalesOrder.paypal_email"
                                                                                :key="key"
                                                                                :label="item"
                                                                                :value="key">
                                                                                </el-option>
                                                                            </el-select>
                                                                        </template>
                                                                </el-form-item>
                                                            </div>
                                                            <div  style="width:50%;padding-right:20px;display:flex;">
                                                                <el-form-item label="paypal交易号" label-width="88px" prop="paypal_id">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.paypal_id" type="text" size="mini" placeholder="请输入"></el-input>
                                                                </el-form-item>&nbsp;&nbsp;&nbsp;
                                                                <el-button type="primary" size="mini" @click="searchPaypal">搜索</el-button>
                                                            </div>
                                                            </div>
                                                            <div class="moneyWhay" style="height:38px;">
                                                                <el-form-item label="加钱重寄金额" label-width="95px" prop="order_amount">
                                                                    <el-input v-model.trim="addNewAfterSaleListParameter.order_amount"  @keyup.native="handleProCost()" type="text" size="mini" placeholder=""></el-input>
                                                                    <template>
                                                                        <el-select v-model="addNewAfterSaleListParameter.currency" size="mini" placeholder="请选择">
                                                                            <el-option
                                                                            v-for="item in moneyWhayCurrency"
                                                                            :key="item"
                                                                            :label="item"
                                                                            :value="item">
                                                                            </el-option>
                                                                        </el-select>
                                                                    </template>
                                                                </el-form-item>
                                                            </div>
                                                            <table cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td class="tdTitle" width="120">PayPal交易号</td>
                                                                    <td width="220">{{addNewAfterSaleListParameter.transaction_id}}</td>
                                                                    <td class="tdTitle" width="120">交易时间</td>
                                                                    <td width="220">{{addNewAfterSaleListParameter.paytime}}</td>
                                                                    <td class="tdTitle" width="120">交易金额</td>
                                                                    <td width="220">{{addNewAfterSaleListParameter.amt}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="tdTitle">付款状态</td>
                                                                    <td>{{addNewAfterSaleListParameter.payment_status}}</td>
                                                                    <td class="tdTitle">交易佣金</td>
                                                                    <td>{{addNewAfterSaleListParameter.fee_amt}}</td>
                                                                    <td class="tdTitle">付款账号</td>
                                                                    <td>{{addNewAfterSaleListParameter.payer_email}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="tdTitle">收款账号</td>
                                                                    <td colspan="6">{{addNewAfterSaleListParameter.receiver_email}}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                </el-collapse-item>
                                            </div>
                                            </el-collapse-item>
                                        </div>
                                    </div>
                                    </el-form>
                                </div>
                                <!-- 客诉单 -->
                                <div v-if="operationOrderSingle.customerComplaint">
                                    <el-form  label-width="80px" :model="registeredCustomerComplaint" ref="registeredCustomerComplaint" :rules="mustFill" class="reSendInfo">
                                        <div class="customerComplaintHandle">
                                            <div>
                                                <el-form-item label="加急：" prop="is_expedited">
                                                    <template>
                                                        <el-radio v-model="registeredCustomerComplaint.is_expedited" label="1">加急</el-radio>
                                                        <el-radio v-model="registeredCustomerComplaint.is_expedited" label="0">不加急</el-radio>
                                                    </template>
                                                </el-form-item>
                                            </div>
                                            <div v-if="registeredCustomerComplaint.department">
                                                <el-form-item label="客诉部门：" :prop="registeredCustomerComplaint.department?'department':'genre'">
                                                    <template>
                                                        <el-radio v-model="registeredCustomerComplaint.department" @change="registeredCustomerComplaint.complaint_type=''" label="1">仓库部门</el-radio>
                                                        <el-radio v-model="registeredCustomerComplaint.department" @change="registeredCustomerComplaint.complaint_type=''" label="2">物流部门</el-radio>
                                                    </template>
                                                </el-form-item>
                                            </div>
                                            <div v-else>
                                                <el-form-item label="客诉部门：" :prop="registeredCustomerComplaint.department?'department':'genre'">
                                                    <template>
                                                        <el-radio v-model="registeredCustomerComplaint.genre" @change="registeredCustomerComplaint.complaint_type=''" label="1">仓库部门</el-radio>
                                                        <el-radio v-model="registeredCustomerComplaint.genre" @change="registeredCustomerComplaint.complaint_type=''" label="2">物流部门</el-radio>
                                                    </template>
                                                </el-form-item>
                                            </div>
                                            <div>
                                                <el-form-item label="客诉类型：" prop="complaint_type">
                                                    <el-select v-model="registeredCustomerComplaint.complaint_type" size="small" placeholder="请选择">
                                                        <div v-for="item in customerComplaintFormInfo">
                                                            <el-option
                                                                v-if="(registeredCustomerComplaint.department||registeredCustomerComplaint.genre)==item.id"
                                                                v-for="(value,key) in item.child"
                                                                :key="key"
                                                                :label="value"
                                                                :value="key">
                                                            </el-option>
                                                        </div>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <el-form-item label="详情描述" label-width="90" prop="description">
                                            <el-input v-model="registeredCustomerComplaint.description" type="textarea" rows="10" placeholder=""></el-input>
                                        </el-form-item>
                                        <div class="rowSpacingTable">
                                            <table cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td width="30">操作</td>
                                                    <td width="30">产品名称</td>
                                                    <td width="80">SKU</td>
                                                    <td width="50">产品线</td>
                                                    <td width="30">数量</td>
                                                    <td width="30">附件</td>
                                                </tr>
                                                <tr v-for="(item,index) in (registeredCustomerComplaint.detail?registeredCustomerComplaint.detail:obtainOrderDetails.proDetailsInfo)">
                                                    <td style="text-align:center;">
                                                        <el-checkbox v-model="item.product" @change="(bool)=>handleProDetailsOption(bool,item)"></el-checkbox>
                                                    </td>
                                                    <td>{{item.chinese_title?item.chinese_title:item.title}}</td>
                                                    <td>{{item.sku}}</td>
                                                    <td>{{item.linelist_cn_name?item.linelist_cn_name:item.product_line}}</td>
                                                    <td>{{item.quantity?item.quantity:item.qty}}</td>
                                                    <td>
                                                        <el-upload
                                                            v-if="!orderInfo.edit"
                                                            class="upload-demo"
                                                            action="api/system_set/general_upload/upload"
                                                            name="userfile"
                                                            :data="userInfo"
                                                            :ref="'file'+index"
                                                            :limit="5"
                                                            :beforeUpload="beforeUpload"
                                                            :on-exceed="handleExceed"
                                                            :on-error="handleError"
                                                            :on-remove="(file, fileList) => handleRemove(file, fileList ,item)"
                                                            :on-success="(response, file, fileList) => handleAddress(response, file, fileList, item)">
                                                            <el-button size="small" type="primary">上传</el-button>
                                                            <div slot="tip">支持gif、jpg、png、jpeg、bmp，格式大小不能超过10M,数量不超过5个</div>
                                                        </el-upload>
                                                        <el-upload
                                                            v-if="orderInfo.edit"
                                                            class="upload-demo"
                                                            action="api/system_set/general_upload/upload"
                                                            :data="userInfo"
                                                            name="userfile"
                                                            :ref="'file'+index"
                                                            :limit="5"
                                                            :beforeUpload="beforeUpload"
                                                            :on-exceed="handleExceed"
                                                            :on-error="handleError"
                                                            :file-list="item.img_url"
                                                            :on-remove="(file, fileList) => handleRemove(file, fileList ,item)"
                                                            :on-success="(response, file, fileList) => handleAddress(response, file, fileList, item)">
                                                            <el-button size="small" type="primary">上传</el-button>
                                                            <div slot="tip">支持gif、jpg、png、jpeg、bmp，格式大小不能超过10M,数量不超过5个</div>
                                                        </el-upload>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </el-form>
                                </div>
                                <!-- 处理客诉 -->
                                <div v-if="operationOrderSingle.CustomerComplaintInfo">
                                    <el-collapse-item title="| 客诉信息" name="customerComplaintrefundInfo" id="storageLogisticsAnchor" class="headerInfoScrollTop">
                                        <div class="orderInformationMainInfo">
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">客诉单号:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.complaint_order}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">处理状态:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.status}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">是否加急:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.is_expedited=='1'?'加急':'不加急'}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">客诉部门:</div>
                                                <div style="flex:1;word-wrap:break-word;" v-if="!infoCustomerComplaint.genre">{{infoCustomerComplaint.genre}}</div>
                                                <div style="flex:1;word-wrap:break-word;" v-if="infoCustomerComplaint.genre">{{infoCustomerComplaint.genre=='1'?'仓库部门':'物流部门'}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">客诉类型:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.type}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">详细描述:</div>
                                                <div style="word-wrap:break-word;width:665px;heigth:auto;">{{infoCustomerComplaint.description}}</div>
                                            </div>
                                            <table cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td width="200">产品名称</td>
                                                    <td width="200">SKU</td>
                                                    <td width="200">产品线</td>
                                                    <td width="200">数量</td>
                                                    <td width="200">附件</td>
                                                </tr>
                                                <tr v-for="item in infoCustomerComplaint.detail">
                                                    <td>{{item.title}}</td>
                                                    <td>{{item.sku}}</td>
                                                    <td>{{item.product_line}}</td>
                                                    <td>{{item.qty}}</td>
                                                    <td>
                                                        <!-- <img :src="'http://dp.yibai-it.com:10083'+img" width="100px"/> -->
                                                        <div v-for="img in item.imgArr"
                                                             v-show="img"
                                                             @click="handleClickImg(item.imgArr)">
                                                             <img :src="img" width="100px"/>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </el-collapse-item>
                                    <el-collapse-item title="| 处理信息" name="customerComplaintHandleInfo" id="storageLogisticsAnchor" class="headerInfoScrollTop" v-if="!orderInfo.examine">
                                        <div class="orderInformationMainInfo">
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">处理次数:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.processing_times}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">处理人:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.processing_by}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">处理时间:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.processing_time}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">处理部门:</div>
                                                <div style="flex:1;word-wrap:break-word;" v-if="!infoCustomerComplaint.genre">{{infoCustomerComplaint.genre}}</div>
                                                <div style="flex:1;word-wrap:break-word;" v-if="infoCustomerComplaint.genre">{{infoCustomerComplaint.genre=='1'?'仓库部门':'物流部门'}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">处理结果:</div>
                                                <div style="flex:1;word-wrap:break-word;">{{infoCustomerComplaint.processing_result}}</div>
                                            </div>
                                            <div style="font-size:12px;color: #333;font-weight: 700;display:flex;">
                                                <div style="width:100px;white-space:nowrap;">图片:</div>
                                                <div style="flex:1;word-wrap:break-word;" v-if="infoCustomerComplaint.img_info=='null'||infoCustomerComplaint.img_info==''?false:true">
                                                    <img :src="item"
                                                         @click="handleClickImg(infoCustomerComplaint.img_info)"
                                                         width="100px"
                                                         v-for="item in infoCustomerComplaint.img_info"/>
                                                </div>
                                            </div>
                                        </div>
                                    </el-collapse-item>
                                </div>
                                <!-- 纠纷INR、Cancel、return -->
                                <Dispute
                                    v-if="orderInfo.dispute&&!operationOrderSingle.afterSale"
                                    :isINR="isINR"
                                    :isReturn="isReturn"
                                    :isCancel="isCancel"
                                    :orderInfo="orderInfo"
                                    :refundInfo="addNewAfterSalesOrder"
                                    :obtainOrderDetails='obtainOrderDetails'
                                    @succeedCallBack="succeedCallBack"></Dispute>
                                <!-- 预览图片 -->
                                <PreviewImg :show.sync="pop_preview" :src="thumb_url"></PreviewImg>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                </el-collapse>
                <!-- 暂扣订单、作废订单弹窗 -->
                <el-dialog
                    :title="isBatchOperation"
                    width="440px"
                    :append-to-body='true'
                    class="ui-layout_edit-dialog obtainOrderDetailsGinseng"
                    :visible.sync="isBatchShow">
                    <el-form label-width="80px" :model="obtainOrderDetailsGinseng" ref="obtainOrderDetailsGinseng" :rules="mustFill">
                        <el-form-item label="订单号：">
                        <div style="width:100%;heigth:auto;">{{obtainOrderDetailsGinseng.order_id}}</div>
                        </el-form-item>
                        <el-form-item label="平台：">
                        <div>{{obtainOrderDetailsGinseng.platform_code}}</div>
                        </el-form-item>
                        <el-form-item label="备注信息：" prop="remark">
                        <el-input size="small" type="textarea" v-model.trim="obtainOrderDetailsGinseng.remark" class="batchRemark" placeholder="请输入内容,不能超过100个字符" maxlength="100"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button size="small" @click="cancel">取消</el-button>
                        <el-button size="small" type="primary" @click="handleBatchOperation()">确定</el-button>
                    </div>
                </el-dialog>
                <!-- 消息联系 -->
                <TemplateChooseShow :isTemplateChoose='isTemplateChooseShow'
                                    v-if="isTemplateChooseShow"
                                    :activeInfo="activeContactRow"
                                    @handleOperateCancel="isTemplateChooseShow=false;"></TemplateChooseShow>
                <!-- 发票弹窗弹窗 -->
                    <OrderInvoiceInfo
                    :isInvoice="isInvoice"
                    v-if="isInvoice"
                    :InvoiceInfo="InvoiceInfo"
                    :detailsInvoiceInfo="detailsInvoiceInfo"
                    :invoice="invoiceSubmission"
                    @handleSubmitInvoiceInterface="handleSubmitInvoiceInterface"
                    @handleIsInvoiceShow="handleIsInvoiceShow"
                    />
            </div>
        <div slot="footer">
            <!-- 客诉单的按钮 -->
            <el-button size="small" @click="isOrderInfo=false" v-if="operationOrderSingle.customerComplaint">取消</el-button>
            <el-button size="small" type="primary" v-if="operationOrderSingle.customerComplaint" @click="handleCustomerComplaintSubmission">确定</el-button>
            <!-- 售后单的按钮 -->
            <el-button size="small" @click="isOrderInfo=false" v-if="operationOrderSingle.afterSale">取消</el-button>
            <span v-if="!afterSalesOrderEditInfo.edit"><el-button size="small" type="primary" @click="handleAddNewAfterSales" v-if="operationOrderSingle.afterSale">确定</el-button></span>
            <el-button size="small" type="primary" @click="handleafterSalesOrderEditSubmission" v-if="afterSalesOrderEditInfo.edit">确定</el-button>
            <!-- 客诉单处理的按钮 -->
            <el-button size="small" @click="isOrderInfo=false" v-if="operationOrderSingle.CustomerComplaintInfo&&!orderInfo.examine">取消</el-button>
            <el-button size="small" @click="handleOperateConfirm()" type="primary" v-if="operationOrderSingle.CustomerComplaintInfo&&!orderInfo.examine">确定</el-button>
            <el-button size="small" @click="handleOperateReject()" type="danger" v-if="operationOrderSingle.CustomerComplaintInfo&&!orderInfo.examine">驳回</el-button>
            <!-- 客诉单审核的按钮 -->
            <el-button size="small" @click="isOrderInfo=false" v-if="operationOrderSingle.CustomerComplaintInfo&&orderInfo.examine">取消</el-button>
            <el-button size="small" @click="handleExamine(2)" type="primary" v-if="operationOrderSingle.CustomerComplaintInfo&&orderInfo.examine">审核通过</el-button>
            <el-button size="small" @click="handleExamine(3)" type="danger" v-if="operationOrderSingle.CustomerComplaintInfo&&orderInfo.examine">审核不通过</el-button>
            <!-- 纠纷INR、Cancel、return的按钮 -->
            <span v-if="!operationOrderSingle.afterSale&&(orderInfo.operation==='handlePageINR'||orderInfo.operation==='handlePageReturn'||orderInfo.operation==='handlePageCancel')">
                <el-button size="small" @click="isOrderInfo=false" v-if="orderInfo.operation==='handlePageINR'||orderInfo.operation==='handlePageReturn'||orderInfo.operation==='handlePageCancel'">返回</el-button>
                <el-button size="small" @click="isINR=!isINR" type="primary" v-if="orderInfo.operation==='handlePageINR'">提交</el-button>
                <el-button size="small" @click="isReturn=!isReturn" type="primary" v-if="orderInfo.operation==='handlePageReturn'">提交</el-button>
                <el-button size="small" @click="isCancel=!isCancel" type="primary" v-if="orderInfo.operation==='handlePageCancel'">提交</el-button>
            </span>
        </div>
    </el-dialog>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';
    import {
        systemProgress,//获取当前订单系统进度信息
        obtainOrderDetailsInfo,//获取当前订单详情信息
        obtainProDetailsInfo,//获取当前产品详情信息
        obtainTransactionDetailsInfo,//获取当前订单交易记录信息
        obtainPackageDetailsInfo,//获取当前订单包裹信息
        obtainLogisticsDetailsInfo,//获取当前订单物流信息
        obtainProfitDetailsInfo,//获取当前订单利润信息
        obtainSalesAfterDetailsInfo,//获取当前订单售后信息
        obtainLogsInfo,//获取当前订单操作日志信息
        toVoidInfo,//作废订单
        withhold,//暂扣
        orderPlatformProgress,//平台进度
        addNewAfterSales,//新建售后单
        addNewBatchRemark,//添加订单备注
        addNewShipRemark,//添加出货备注
        delRemarkInfo,//删除订单详细信息备注
        afterSalesOrderCreateInfo,//新建售后单所需信息
        productInfoAddDeleteEdit,//产品信息增删改
        searchPaypalTransactionInfo,//新建售后单搜索paypal交易号信息
        returnCodeObtain,//获取退货编码
        rmaObtain,//获取RMA
        customerComplaintSubmission,//提交客诉单
        invoiceDetailsInterface,//发票详情接口
        submitInvoiceInterface,//提交发票
        batchCancelWithhold,//取消暂扣
        customerComplaintInfoInterface,//客诉单所需信息
        proErpSku,//sku获取产品信息接口
        proErpAftersalesSku,//售后单通过sku获取产品信息
        customerComplaintInfo,//获取客诉单的详细信息
        addNewRefundInfo,//获取新建退款单所需信息
        complaintConfirm,//确定客诉单
        complaintReject,//驳回客诉单
        complaintEditInfo,//客诉单修改的数据
        complaintDoEdit,//修改客诉单
        complaintExamine,//审核客诉单
        obtainReturnCode,//获取退货编码
        afterSalesOrderShowEdit,//获取售后单修改信息
        OrderCustomerComplaintInfo,//获取多条客诉信息
        afterSalesOrderEditSubmission,//售后单修改提交
        afterSalesOrderCreateCrmInfo,//售后单下拉数据crm
        ebayAfterSalesRefund,//eb登记退款单
        getAllowRefundAmount,//eb获取退款金额
        cancelMergeOrder,//取消订单
    } from '../../../api/orderInfo/order_information'
    import {
        addNewAfterSaleSingle,//新建售后单
        registeredRefundSlip,//登记退款单
        registeredRCustomerComplaintSlip,//登记客诉单
        handleOrder,//处理操作
        EtidCustomerComplaintSlip,//客诉详情
        handlePageINR,//INR处理页面
        handlePageCancel,//Cancel处理页面
        handlePageReturn,//Return处理页面
    }from '@/assets/js/orderOperation';
    import OrderDetailsInfo from './component/OrderDetail.vue'
    import OrderInvoiceInfo from "../OrderManagement/component/OrderInvoice.vue"
    import * as storage from '@/utils/storage';
    import routerConfig from '@/router/routerConfig';
    import http from '@/http/index.js';
    import * as math from 'mathjs';
    import {getSessionStorage} from '@/utils/storage';
    import Dispute from '../OrderManagement/component/Dispute';
    import TemplateChooseShow from '../OrderManagement/component/TemplateChooseShow';
    import {getLogisticsListNew,} from '../../../api/orderInfo/componentjs';

export default {
    name: "OrderInformation",
    components: {
        OrderDetailsInfo,
        OrderInvoiceInfo,
        Dispute,
        TemplateChooseShow,
    },
    props: {
        isOrderInfoShow: {//控制当前组件显示和隐藏
            type: Boolean,
            default: false
        },
        orderInfo:{//获取要查看详情的订单
            type:Object,
            default() {
                    return {}
                }
        },
        customerComplaintId:{//客诉单id
            type:Object,
            default() {
                    return {}
                }
        },
        afterSalesOrderEditInfo:{//售后单信息
            type:Object,
            default() {
                    return {}
                }
        }
    },
  data() {
    return {
        title:'订单信息',
        isINR:false,
        isReturn:false,
        isCancel:false,
        userInfo:{
            uid:JSON.parse(getSessionStorage('userInfo')).uid,
            staff_code:JSON.parse(getSessionStorage('userInfo')).staff_code,
        },
        // 图片预览相关
        pop_preview: false,
        thumb_url: '',

        returnCode:'',
        fileList:[],
        isOrderInfo:false,
        deleteTips:true,
        isInvoice:false,//发票显示和隐藏
        systemProgressSteps:-1,//系统进度
        platformProgressSteps:-1, //平台进度
        orderId:'',//订单ID
        activeNames: ['orderInfo','productInfo','transactionRecord','packageInfo','profitInfo','storageLogistics','afterSaleInfo','operationJournal','refundInfo','returnGoodsInfo','reSendInfo','reSendProductInfo','reSendReceivingAddressInfo','reSendWarehouseLogisticsInfo','reSendOrderDeliverGoodsInfo','reSendAddMoneyInfo','customerComplaintrefundInfo','customerComplaintHandleInfo'],
        mustFill: {
            department_id: [{required: true,message: '请选择不良类型',trigger: 'blur'}],
            reason_id: [{required: true,message: '请选择不良原因',trigger: 'blur'}],
            type: [{required: true,message: '请选择售后单类型',trigger: 'blur'}],
            remark:[{required: true,message: '请填写备注信息',trigger: 'blur'}],
            ship_name:[{required: true,message: '收件人不能为空',trigger: 'blur'}],
            ship_street1:[{required: true,message: '收件街道地址不能为空',trigger: 'blur'}],
            ship_country:[{required: true,message: '国家不能为空',trigger: 'blur'}],
            ship_zip:[{required: true,message: '邮编不能为空',trigger: 'blur'}],
            ship_city_name:[{required: true,message: '城市不能为空',trigger: 'blur'}],
            warehouse_id:[{required: true,message: '退回仓库不能为空',trigger: 'blur'}],
            redirect_warehouse_id:[{required: true,message: '发货仓库不能为空',trigger: 'blur'}],
            refund_redirect_way:[{required: true,message: '邮寄方式不能为空',trigger: 'blur'}],
            is_expedited:[{required: true,message: '是否加急处理',trigger: 'blur'}],
            department:[{required: true,message: '请选择是否加急处理',trigger: 'blur'}],
            complaint_type:[{required: true,message: '请选择客诉类型',trigger: 'blur'}],
            genre:[{required: true,message: '请选择客诉类型',trigger: 'blur'}],
            ship_code:[{required: true,message: '请选择邮寄方式',trigger: 'blur'}],
            order_amount:[{pattern: /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/,message: '只能为正数，且只能保留小数点后两位！'}],
            tracking_no:[{required: true,message: '跟踪号不能为空',trigger: 'blur'}],
            carrier:[{required: true,message: '运输方式不能为空',trigger: 'blur'}],
            refund_amount:[{required: true,message: '退款金额不能为空',trigger: 'blur'}],
        },
        productFormVerification:{
            product_title:[{required: true,message: '产品标题不能为空',trigger: 'blur'}],
            sku:[{required: true,message: '产品SKU不能为空',trigger: 'blur'}],
            issue_quantity:[
                {required: true,message: '产品数量不能为空',trigger: 'blur'},
                {pattern: /^\+?[1-9][0-9]*$/,message: '产品数量只能为正整数'}
            ],
            linelist_cn_name:[{required: true,message: '产品线不能为空',trigger: 'blur'}],
        },
        productReSend:{
            product_title:[{required: true,message: '产品标题不能为空',trigger: 'blur'}],
            sku:[{required: true,message: '产品SKU不能为空',trigger: 'blur'}],
            issue_quantity:[
                {required: true,message: '产品数量不能为空',trigger: 'blur'},
                {pattern: /^\+?[1-9][0-9]*$/,message: '产品数量只能为正整数'}
            ],
            linelist_cn_name:[{required: true,message: '产品线不能为空',trigger: 'blur'}],
        },
        operationOrderSingle:{},//订单操作控制
        //重新开始
        obtainOrderDetails:{
            orderDetailsInfo:'',//当前订单详情
            proDetailsInfo:[],//当前产品详情信息
            transactionDetailsInfo:[],//当前订单交易记录信息
            packageDetailsInfo:[],//当前订单包裹信息
            logisticsDetailsInfo:{},//当前订单物流信息
            profitDetailsInfo:'',//当前订单利润信息
            salesAfterDetailsInfo:[],//当前订单售后信息
            logsInfo:[],//当前订单操作日志信息
            orderDetailsLoading:true,//当前订单详情
            proDetailsLoading:true,//当前产品详情信息
            transactionDetailsLoading:true,//当前订单交易记录信息
            packageDetailsLoading:true,//当前订单包裹信息
            logisticsDetailsLoading:true,//当前订单物流信息
            profitDetailsLoading:true,//当前订单利润信息
            salesAfterDetailsLoading:true,//当前订单售后信息
            logsLoading:true,//当前订单操作日志信息
            ship_code:{},
            warehouse_id:{}
        },
        obtainOrderDetailsGinseng:{//获取当前订单信息需要传的参
            order_id:'',//'AM170823000013',
            platform_code:'',
            remark:'',
        },
        isBatchShow:false,//弹框显示隐藏
        isBatchOperation:'',//操作弹框标题
        systemProgressNodeInfo:[//系统进度时间
            {name:'订单生成',time:'',process_status:'process'},
            {name:'付款时间',time:'',process_status:'process'},
            {name:'订单检查',time:'',process_status:'process'},
            {name:'异常',time:'',process_status:'error'},
            {name:'推送到仓库',time:'',process_status:'process'},
            {name:'订单已配货',time:'',process_status:'process',isShow:false},
            {name:'订单缺货',time:'',process_status:'error'},
            {name:'上传到物流商',time:'',process_status:'process'},
            {name:'仓库拉取订单',time:'',process_status:'process'},
            {name:'仓库扫描打包',time:'',process_status:'process'},
            {name:'仓库扫描出库',time:'',process_status:'process'},
            {name:'物流商交运',time:'',process_status:'process'},
            {name:'物流商发货',time:'',process_status:'process'},
            {name:'运输中',time:'',process_status:'process'},
            {name:'客户签收',time:'',process_status:'process'},
        ],
        platformProgressTime:[//平台进度
            {name:'平台付款时间',time:'',process_status:'process'},
            {name:'发货开始时间',time:'',process_status:'process'},
            {name:'发货结束时间',time:'',process_status:'process'},
            {name:'预计妥投时间',time:'',process_status:'process'},
            {name:'妥投结束时间',time:'',process_status:'process'},
        ],
        // {//平台进度时间
        //     pay_time:'',
        //     daearliest_ship_date:'',
        //     latest_ship_date:'',
        //     scheduled_delivery_start_date:'',
        //     scheduled_delivery_end_date:''
        // },
        addNewAfterSaleListParameter:{//新建售后单所传参数信息
            order_id:'',
            refund_code:'',//退货编码
            transaction_id:'',//交易ID
            operating_type:'',//操作类型(1.新建售后单，2登记退款单)
            type:[],//售后类型(1=退款，2=退货，3=重寄) 多选用英文逗号隔开
            platform_code:'',
            department_id:'',//售后责任归属部门id
            reason_id:'',//售后单原因
            buyer_mail:'',//买家邮箱
            buyer_id:'',//客户ID
            remark:"",//备注
            return_remark:'',//退货备注
            // refund_redirect_way:'',//退款/重寄方式 1,仅退款 2,退款退货 3,仅重寄 4,重寄退货
            // refund_redirect_status:'',//退款重寄方式修改状态 1.已修改
            // refund_redirect_reason:'',//退款/重寄原因
            // account_name:'',//发货账号
            account_id:'',//账号id
            // order_amount:'',//原订单金额
            // order_amount_rmb:'',//原订单金额(RMB)
            currency:'',//货币代码
            order_currency:'',
            exchange_rate:0,//汇率
            order_amount:'',//重寄产品成本(RMB)
            site:'',//站点
            shipping_country:'',//发货国家
            warehouse_name:'',//发货仓库名
            order_status:'',//订单状态
            order_type:'',//订单类型
            buyer_mail:'',//买家邮箱
            refund_amount:'',//退款金额
            // message:'',//给买家的留言
            reason_code:'',//退款原因代码
            refund_ratio:"",
            refund_type:'',//	退款类型（1=部分退款，2=全部退款）
            // refund_time:'',//退款时间
            refund_detail:'',//退款详情
            platform_order_id:'',//平台订单号
            warehouse_id:'',//仓库id
            redirect_warehouse_id:'',
            carrier:'',//物流商
            tracking_no:'',//物流追踪号
            // receiving_by:'',//收货人
            rma:'',//..
            // receiving_time:'',//收货时间
            // redirect_order_id:'',//重寄单号
            ship_name:'',//收货人姓名
            ship_street1:'',//收货人地址一
            ship_street2:'',//收货人地址二
            ship_zip:'',//收货邮编
            ship_city_name:'',//收获人城市
            ship_stateorprovince:'',//收货人州/省
            ship_country:'',//收货人国家代码
            ship_country_name:'',//收货人国家名称
            ship_phone:'',//收货人电话
            ship_code:'',//发货方式
            ship_code_name:'',//物流方式名
            order_remark:'',//	订单备注
            print_remark:'',//发货备注
            paypal_id:'',//paypal交易号
            paypal_email:'',//paypal交易账号
            return:[],
            refund:[],
            redirect:[],
            descriptionAdverseCauses:'',
            issue:[],
            purchase_cost:0,
        },
        afterSaleListOption:{},//新建售后单下拉选项
        addNewAfterSalesOrder:{},//新鲜售后单所需信息
        platformReasons:{
            CustomerCancel:'CustomerCancel',
            GeneralAdjustment:'GeneralAdjustment',
        },
        twoLevelLinkageInfo:[],//二级联动信息
        moneyWhayCurrency:['USD','CNY','EUR','GBP','AUD','CAD','HKD'],//货币币种
        AfterSaleTypeShow:{
            refundInformation:false,//退款信息显示隐藏
            returnInformation:false,//退货信息显示和隐藏
            reSendInformation:false,//重寄信息显示隐藏
        },
        registeredCustomerComplaint:{//提交登记客诉单
            is_expedited:'',//是否加急
            department:'',//客诉部门
            complaint_type:'',//客诉类型
            description:'',//详情描述
            account_id:'',
            warehouse_code:'',
            platform_code:'',
            warehouse_id:'',
            order_id:'',
            platform_order_id:'',
            shipping_date:'',
            buyer_phone:'',
            buyer_id:'',
            buyer_mail:'',
            detail:'',
            genre:'',
        },
        InvoiceInfo:{},
        detailsInvoiceInfo:{},//发票信息
        invoiceSubmission:{//提交发票
            order_id:'',//订单号
            platform_code:'',//平台
            country:'',//站点
            customer_company:'',//客户公司名或名字
            customer_addr:'',//客户地址
            total_price:0,//发票总金额
            order_time:'',//下单时间
            ship_fee:0,//运费
            product:[],//产品信息
            registered_company:'',//注册公司、
            tracking_number:'',//物流单号
            currency:'',//币种
            sale_account:'',//销售账号
        },
        customerComplaintFormInfo:[],//客诉单所需信息
        iswithholdShow:false,//暂扣
        changeCustomerComplaint:false,//是否勾选了要进行客诉的商品
        skuInfo:{},//通过sku来获取产品信息
        selection:[],//存储下标的数组
        infoCustomerComplaint:{},//客诉信息
        orderDetailsCustomerComplaintInfo:{},//订单详情展示多条信息
        afterSalesOrderShowEditInfo:{},//售后单修改显示的信息
        closeRefresh:false,
        residualRefundAmount:'',
        //纠纷
        InquiryInfo:{},
        //问题产品
        issue:[],
        //消息联系
        isTemplateChooseShow:false,
        activeContactRow:{title:""},
        //物流方式联动
        ship_code_info:{},
    };
  },
  methods: {
    systemProgress,//系统进度
    obtainOrderDetailsInfo,//获取当前订单详情
    obtainProDetailsInfo,//获取当前产品详情信息
    obtainTransactionDetailsInfo,//获取当前订单交易记录信息
    obtainPackageDetailsInfo,//获取当前订单包裹信息
    obtainLogisticsDetailsInfo,//获取当前订单物流信息
    obtainProfitDetailsInfo,//获取当前订单利润信息
    obtainSalesAfterDetailsInfo,//获取当前订单售后信息
    obtainLogsInfo,//获取当前订单操作日志信息
    toVoidInfo,//作废
    withhold,//暂扣
    orderPlatformProgress,//平台进度
    addNewAfterSales,//新建售后单
    addNewBatchRemark,//添加订单备注
    addNewShipRemark,//添加出货备注
    delRemarkInfo,//删除订单详细信息备注
    afterSalesOrderCreateInfo,//新建售后单所需信息
    productInfoAddDeleteEdit,//产品信息增删改
    searchPaypalTransactionInfo,//新建售后单搜索paypal交易号信息
    returnCodeObtain,//获取退货编码
    rmaObtain,//获取RMA
    customerComplaintSubmission,//提交客诉单
    invoiceDetailsInterface,//发票详情接口
    submitInvoiceInterface,//提交发票
    batchCancelWithhold,//取消暂扣
    customerComplaintInfoInterface,//客诉单所需信息
    proErpSku,//sku获取产品信息接口
    proErpAftersalesSku,//售后单通过sku获取产品信息
    customerComplaintInfo,//获取客诉单的详细信息
    addNewRefundInfo,//获取新建退款单所需信息
    complaintConfirm,//确定客诉单
    complaintReject,//驳回客诉单
    complaintEditInfo,//客诉单修改的数据
    complaintDoEdit,//修改客诉单
    complaintExamine,//审核客诉单
    obtainReturnCode,//获取退货编码
    OrderCustomerComplaintInfo,//获取多条客诉信息
    afterSalesOrderShowEdit,//获取售后单修改信息
    afterSalesOrderEditSubmission,//售后单修改提交
    afterSalesOrderCreateCrmInfo,
    // cancelWithhold,//取消暂扣
    //系统进度信息
    systemProgressInfo(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.systemProgress(this.obtainOrderDetailsGinseng,str).then(({data}) => {
                if (data.status !== 1) {
                    return;
                }
                // data.data_list.value=[];
                // data.data_list.value = [
                //     {id: 265308073, order_id: "AM190504019565", node_name: "订单生成", node_time: "2019-03-12 15:34:34"},
                //     {id: 265308074, order_id: "AM190504019565", node_name: "付款时间", node_time: "2019-03-13 15:34:34"},
                //     {id: 265308077, order_id: "AM190504019565", node_name: "订单检查", node_time: "2019-03-14 15:34:34"},
                //     // {id: 265308077, order_id: "AM190504019565", node_name: "异常", node_time: "2019-03-14 15:35:34"},
                //     {id: 265308078, order_id: "AM190504019565", node_name: "推送到仓库", node_time: "2019-03-15 15:34:34"},
                //     {id: 265308079, order_id: "AM190504019565", node_name: "订单已配货", node_time: "2019-03-16 15:34:34"},
                //     {id: 265308080, order_id: "AM190504019565", node_name: "上传到物流商", node_time: "2019-03-17 15:34:34"},
                //     {id: 265308081, order_id: "AM190504019565", node_name: "仓库拉取订单", node_time: "2019-03-18 15:34:34"},
                //     {id: 265308082, order_id: "AM190504019565", node_name: "仓库扫描打包", node_time: "2019-03-19 15:34:34"},
                //     {id: 265308083, order_id: "AM190504019565", node_name: "仓库扫描出库", node_time: "2019-03-20 15:34:34"},
                //     {id: 265308084, order_id: "AM190504019565", node_name: "物流商发货", node_time: "2019-03-21 15:34:34"},
                //     {id: 265308085, order_id: "AM190504019565", node_name: "客户签收", node_time: "2019-03-23 15:34:34"}
                // ]
                let systemProgressLine = document.getElementsByClassName("el-step__line")
                let systemProgressBg = document.getElementsByClassName("el-step__icon is-text")
                this.systemProgressNodeInfo.forEach((element,index) => {
                    let bool = true;
                    for(let i = 0; i<data.data_list.value.length;i++){
                        if(data.data_list.value[i].node_name==element.name){
                            if(element.name==='异常'||element.name==='订单缺货'||element.name==='订单已配货')bool = false;
                            element.time = data.data_list.value[i].node_time;
                            if(element.time){
                                if(element.name==='异常'||element.name==='订单缺货'){
                                    systemProgressBg[index].setAttribute("style","background-color: #F56C6C;border-color: #F56C6C;")
                                }else{
                                    systemProgressBg[index].setAttribute("style","background-color: #409EFF;border-color: #409EFF;")
                                }
                            }
                        }
                    }
                    if(bool){
                        if(element.name=='异常'){
                            element.isShow = true;
                        }else if(element.name=='订单已配货'){
                            element.isShow = true;
                        }else if(element.name=='订单缺货'){
                            element.isShow = true;
                        }
                    }
                });
                for (let i = this.systemProgressNodeInfo.length-1; i >= 0; i--) {
                    if(this.systemProgressNodeInfo[i].time){
                        this.systemProgressSteps = i+1;
                        break;
                    }
                }
                for (let i = 0; i < this.systemProgressSteps; i++) {
                    if(i>0){
                        systemProgressLine[i-1].setAttribute("style","border-top:2px solid #409EFF;");
                    }
                    if(i==this.systemProgressSteps-1)break;
                    systemProgressLine[i].setAttribute("style","border-top:2px solid #409EFF;");
                }
        }).catch(err => {})
    },
    //平台进度信息
    platformProgressInfo(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_list';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_list';
        }
        this.orderPlatformProgress(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
                if (data.status !== 1) {
                    return;
                }
                this.platformProgressTime = data.data_list.value;
                let systemProgressLine = document.getElementsByClassName("el-step__line");
                let systemProgressBg = document.getElementsByClassName("el-step__icon is-text");
                this.platformProgressSteps=0;
                for (const key in this.platformProgressTime) {
                    if(key=="scheduled_delivery_end_date"&&this.platformProgressTime[key]){
                        this.platformProgressSteps++
                        systemProgressBg[systemProgressBg.length-1].setAttribute("style","background-color: #409EFF;border-color: #409EFF;");
                        systemProgressLine[systemProgressLine.length-2].setAttribute("style","border-top:2px solid #409EFF;");
                    }else if(key=="scheduled_delivery_start_date"&&this.platformProgressTime[key]){
                        this.platformProgressSteps++
                        systemProgressBg[systemProgressBg.length-2].setAttribute("style","background-color: #409EFF;border-color: #409EFF;");
                        systemProgressLine[systemProgressLine.length-3].setAttribute("style","border-top:2px solid #409EFF;");
                    }else if(key=="latest_ship_date"&&this.platformProgressTime[key]){
                        this.platformProgressSteps++
                        systemProgressBg[systemProgressBg.length-3].setAttribute("style","background-color: #409EFF;border-color: #409EFF;");
                        systemProgressLine[systemProgressLine.length-4].setAttribute("style","border-top:2px solid #409EFF;");
                    }else if(key=="daearliest_ship_date"&&this.platformProgressTime[key]){
                        this.platformProgressSteps++
                        systemProgressBg[systemProgressBg.length-4].setAttribute("style","background-color: #409EFF;border-color: #409EFF;");
                        systemProgressLine[systemProgressLine.length-5].setAttribute("style","border-top:2px solid #409EFF;");
                    }else if(key=="pay_time"&&this.platformProgressTime[key]){
                        this.platformProgressSteps++
                        systemProgressBg[systemProgressBg.length-5].setAttribute("style","background-color: #409EFF;border-color: #409EFF;");
                    }
                }

        }).catch(err => {})
    },
    //订单详情
    orderDetailsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.obtainOrderDetailsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
            this.obtainOrderDetails.orderDetailsLoading = false;
            if (data.status !== 1) {
                return;
            }
                this.obtainOrderDetails.orderDetailsInfo=data.data_list.value;
                let obj={
                    order_id:this.obtainOrderDetails.orderDetailsInfo.order_id,
                    platform_order_id:this.obtainOrderDetails.orderDetailsInfo.platform_order_id,
                    account_id:this.obtainOrderDetails.orderDetailsInfo.account_id,
                    platform_code:this.obtainOrderDetailsGinseng.platform_code,
                    cust_account_id:this.obtainOrderDetails.orderDetailsInfo.cust_account_id,
                }
                this.addNewAfterSaleListParameter.order_currency = data.data_list.value.currency;
                this.handleOrderCustomerComplaintInfo(obj);
                // this.addNewAfterSaleListParameter.order_amount = data.data_list.value.total_price
                this.addNewAfterSaleListParameter.order_status = data.data_list.value.complete_status;
                this.addNewAfterSaleListParameter.site = data.data_list.value.site;
                this.addNewAfterSaleListParameter.redirect_warehouse_id = String(data.data_list.value.warehouse_id);
                this.addNewAfterSaleListParameter.ship_code = data.data_list.value.ship_code;
                this.handleGetShipCode(this.addNewAfterSaleListParameter.redirect_warehouse_id,false)
                if(this.obtainOrderDetails.orderDetailsInfo.complete_status=="暂扣"){
                    this.iswithholdShow = false
                }else{
                    this.iswithholdShow = true
                }
                if (this.obtainOrderDetails.orderDetailsInfo.order_type == '1') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '普通订单';
                } else if (this.obtainOrderDetails.orderDetailsInfo.order_type == '2') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '合并后的订单';
                } else if (this.obtainOrderDetails.orderDetailsInfo.order_type == '3') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '被合并的订单';
                } else if (this.obtainOrderDetails.orderDetailsInfo.order_type == '4') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '拆分的主订单';
                } else if (this.obtainOrderDetails.orderDetailsInfo.order_type == '5') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '拆分后的子订单';
                }else if (this.obtainOrderDetails.orderDetailsInfo.order_type == '6') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '被重寄的订单';
                }else if (this.obtainOrderDetails.orderDetailsInfo.order_type == '7') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '重寄后的订单';
                }else if (this.obtainOrderDetails.orderDetailsInfo.order_type == '8') {
                    this.obtainOrderDetails.orderDetailsInfo.orderType = '客户补款的订单';
                }
        }).catch(err => {
            this.obtainOrderDetails.orderDetailsLoading = false;
        })
    },
    //获取当前产品详情信息
    ProDetailsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.obtainProDetailsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
            this.obtainOrderDetails.proDetailsLoading = false;
            if (data.status !== 1) {
                return;
            }
                // this.addNewAfterSaleListParameter.refund = [];
                this.obtainOrderDetails.proDetailsInfo=data.data_list.value
                this.obtainOrderDetails.proDetailsInfo.product=0;
                this.addNewAfterSaleListParameter.product_name=this.obtainOrderDetails.proDetailsInfo[0].chinese_title
                if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                    this.obtainOrderDetails.proDetailsInfo.forEach((element,index) => {
                        let issue = {
                            bool: true,
                            product_price: element.sale_price,
                            sku: element.sku,
                            item_id: element.item_id,
                            product_title: element.chinese_title,
                            quantity: element.quantity,
                            linelist_cn_name: element.linelist_cn_name,
                            issue_quantity: element.quantity,
                        };
                        this.issue.push(issue);
                        if(!this.afterSalesOrderEditInfo.edit)this.handleIssueOption(true,issue);
                    });

                }
                if(!this.afterSalesOrderEditInfo.edit){
                    this.addNewAfterSaleListParameter.return = [];
                    this.addNewAfterSaleListParameter.refund = [];
                    this.addNewAfterSaleListParameter.redirect = [];
                    for (var index=0,len=this.obtainOrderDetails.proDetailsInfo.length;index<len;index++) {
                        let returnObj={
                            platform_code:this.obtainOrderDetailsGinseng.platform_code,
                            order_id:this.obtainOrderDetailsGinseng.order_id,
                            sku:this.obtainOrderDetails.proDetailsInfo[index].sku,//sku编号
                            product_title:this.obtainOrderDetails.proDetailsInfo[index].chinese_title,//产品标题
                            issue_quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,//数量
                            linelist_cn_name:this.obtainOrderDetails.proDetailsInfo[index].linelist_cn_name,//产品线
                            product_price:this.obtainOrderDetails.proDetailsInfo[index].sale_price,//产品金额
                            currency:this.obtainOrderDetails.proDetailsInfo[index].currency,//币种
                            refund_redirect_price:0,//重寄/退款金额 没有传0
                            item_id:this.obtainOrderDetails.proDetailsInfo[index].item_id,
                            asin:this.obtainOrderDetails.proDetailsInfo[index].asinval,
                            quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,//数量
                        }
                        let refundObj={
                            platform_code:this.obtainOrderDetailsGinseng.platform_code,
                            order_id:this.obtainOrderDetailsGinseng.order_id,
                            sku:this.obtainOrderDetails.proDetailsInfo[index].sku,//sku编号
                            product_title:this.obtainOrderDetails.proDetailsInfo[index].chinese_title,//产品标题
                            issue_quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,//数量
                            linelist_cn_name:this.obtainOrderDetails.proDetailsInfo[index].linelist_cn_name,//产品线
                            product_price:this.obtainOrderDetails.proDetailsInfo[index].sale_price,//产品金额
                            currency:this.obtainOrderDetails.proDetailsInfo[index].currency,//币种
                            refund_redirect_price:0,//重寄/退款金额 没有传0
                            item_id:this.obtainOrderDetails.proDetailsInfo[index].item_id,
                            asin:this.obtainOrderDetails.proDetailsInfo[index].asinval,
                            quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,//数量
                        }
                        let redirectObj = {
                            platform_code:this.obtainOrderDetailsGinseng.platform_code,
                            order_id:this.obtainOrderDetailsGinseng.order_id,
                            sku:this.obtainOrderDetails.proDetailsInfo[index].sku,//sku编号
                            product_title:this.obtainOrderDetails.proDetailsInfo[index].chinese_title,//产品标题
                            issue_quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,//数量
                            linelist_cn_name:this.obtainOrderDetails.proDetailsInfo[index].linelist_cn_name,//产品线
                            product_price:this.obtainOrderDetails.proDetailsInfo[index].sale_price,//产品金额
                            currency:this.obtainOrderDetails.proDetailsInfo[index].currency,//币种
                            refund_redirect_price:0,//重寄/退款金额 没有传0
                            item_id:this.obtainOrderDetails.proDetailsInfo[index].item_id,
                            asin:this.obtainOrderDetails.proDetailsInfo[index].asinval,
                            quantity:this.obtainOrderDetails.proDetailsInfo[index].quantity,//数量
                        }
                        this.addNewAfterSaleListParameter.return.push(returnObj);
                        this.addNewAfterSaleListParameter.refund.push(refundObj)
                        this.addNewAfterSaleListParameter.redirect.push(redirectObj);
                    }
                }
        }).catch(err => {this.obtainOrderDetails.proDetailsLoading = false;})
    },
    //获取当前订单交易记录信息
    transactionDetailsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.obtainTransactionDetailsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
            this.obtainOrderDetails.transactionDetailsLoading = false;
            if (data.status !== 1) {
                return;
            }
                this.obtainOrderDetails.transactionDetailsInfo=data.data_list.value?data.data_list.value:[];
        }).catch(err => {this.obtainOrderDetails.transactionDetailsLoading = false;})
    },
    //获取当前订单包裹信息
    packageDetailsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.obtainPackageDetailsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
                this.obtainOrderDetails.packageDetailsLoading = false;
            if (data.status !== 1) {
                return;
            }
                this.obtainOrderDetails.packageDetailsInfo=data.data_list.value;
        }).catch(err => {this.obtainOrderDetails.packageDetailsLoading = false;})
    },
    //获取当前订单物流信息
    logisticsDetailsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.obtainLogisticsDetailsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
                this.obtainOrderDetails.logisticsDetailsLoading = false;
            if (data.status !== 1) {
                return;
            }
                this.obtainOrderDetails.logisticsDetailsInfo=data.data_list.value;
        }).catch(err => {this.obtainOrderDetails.logisticsDetailsLoading = false;})
    },
    //获取当前订单利润信息
    profitDetailsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.obtainProfitDetailsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
                this.obtainOrderDetails.profitDetailsLoading = false;
            if (data.status !== 1) {
                return;
            }
                this.obtainOrderDetails.profitDetailsInfo=data.data_list.value;
                this.addNewAfterSaleListParameter.purchase_cost = this.obtainOrderDetails.profitDetailsInfo?this.obtainOrderDetails.profitDetailsInfo.purchaseCost:0;
                this.addNewAfterSaleListParameter.exchange_rate = this.obtainOrderDetails.profitDetailsInfo?this.obtainOrderDetails.profitDetailsInfo.currencyRate:0;
        }).catch(err => {this.obtainOrderDetails.profitDetailsLoading = false;})
    },
    //获取当前订单售后信息
    salesAfterDetailsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.obtainSalesAfterDetailsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
                this.obtainOrderDetails.salesAfterDetailsLoading = false;
            if (data.status !== 1) {
                return;
            }
                this.obtainOrderDetails.salesAfterDetailsInfo=data.data_list.value;
        }).catch(err => {this.obtainOrderDetails.salesAfterDetailsLoading = false;})
    },
    //获取当前订单操作日志信息
    logsInfoMethod(){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_list';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_list';
        }
        this.obtainLogsInfo(this.obtainOrderDetailsGinseng,str).then(({ data}) => {
                this.obtainOrderDetails.logsLoading = false;
            if (data.status !== 1) {
                return;
            }
                this.obtainOrderDetails.logsInfo=data.data_list.records;
        }).catch(err => {this.obtainOrderDetails.logsLoading = false;})
    },
    //获取退货编码
    handleReturnCodeObtain(){
        let obj={
            order_id:this.obtainOrderDetailsGinseng.order_id
        }
        this.returnCodeObtain(obj).then(({ data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '查询失败')
                return;
            }
                this.addNewAfterSaleListParameter.refund_code=data.data_list;
        }).catch(err => {})
    },
    //获取RMA
    handleRmaObtain(){
        if(!this.addNewAfterSaleListParameter.tracking_no){
            this.$message.warning('获取RMA需要先填写跟踪号')
            return;
        }
        let obj={
            order_id:this.obtainOrderDetailsGinseng.order_id,
            warehouse_id:this.obtainOrderDetails.orderDetailsInfo.warehouse_id,
            tracking_no:this.addNewAfterSaleListParameter.tracking_no
        }

        this.rmaObtain(obj).then(({ data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '查询失败');
                return;
            }
            if(!data.data_list.rma){
                this.$message.warning('获取不到RMA编号，请核对跟踪单号！');
            }
            this.addNewAfterSaleListParameter.rma = data.data_list.rma||'';
        }).catch(err => {})
    },
    //操作售后
    operationOrder(str){
        switch(str){
            case '新建售后单':
                this.operationOrderSingle=addNewAfterSaleSingle
                this.addNewAfterSaleListParameter.operating_type = "1"
            break;
            case '登记退款单':
                this.operationOrderSingle=registeredRefundSlip
                this.addNewAfterSaleListParameter.operating_type = "2"
            break;
            case '登记客诉单':
                this.operationOrderSingle=registeredRCustomerComplaintSlip;
                if(this.orderInfo.platform_code=='EB'&&!this.orderInfo.edit){
                    this.registeredCustomerComplaint.is_expedited='0';
                    this.registeredCustomerComplaint.genre = '1';
                }
                this.handleCustomerComplaintInfo()
            break;
        }
        // this.handelHeight();
    },
    //作废
    handleToVoid(str){
        this.deleteTips=!this.deleteTips
        this.isBatchOperation = str
        this.isBatchShow=true
    },
    //暂扣
    HandleWithhold(str){
        this.deleteTips=!this.deleteTips
        this.isBatchOperation = str
        this.isBatchShow=true
    },
    //暂扣、作废订单
    handleBatchOperation(){
        this.$refs['obtainOrderDetailsGinseng'].validate((valid) => {
            if (valid) {
                let str = '';
                if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                    str = 'order_list';
                }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                    str = 'ebay_order_list';
                }
                switch(this.isBatchOperation){
                    case "作废":
                    this.toVoidInfo(this.obtainOrderDetailsGinseng,str).then(({ data }) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败');
                            return;
                        }else{
                            this.orderDetailsInfoMethod();
                            this.isBatchShow=false;
                            this.closeRefresh = true;
                            this.$refs.obtainOrderDetailsGinseng.resetFields();
                            this.$message.success('操作成功！');
                        }
                    })
                    break;
                    case "暂扣":
                        let obj = {
                            order_id_list:this.obtainOrderDetailsGinseng.order_id,
                            platform_code:this.obtainOrderDetailsGinseng.platform_code,
                            remark:this.obtainOrderDetailsGinseng.remark
                        }
                    this.withhold(obj,str).then(({ data }) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败');
                            return;
                        }else{
                            this.orderDetailsInfoMethod();
                            this.isBatchShow=false;
                            this.closeRefresh = true;
                            this.$refs.obtainOrderDetailsGinseng.resetFields();
                            this.$message.success('操作成功！');
                        }
                    })
                    break;
                }
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    //操作成功回调
    succeedCallBack(data) {
        if (data.status) {
            this.isBatchShow=false;
            this.$message.success('操作成功！');
            this.$emit("handleReload");
            this.$emit("handleCancelOrderInfoPopup");
            if(this.closeRefresh){
                this.$emit("handleOperationCallBack");
            }
        } else {
            this.$message.error(data.errorMess || '操作失败！');
        }
        // this.obtainOrderDetails.proDetailsInfo.forEach(element => {
        //     if(element.product){
                // this.changeCustomerComplaint = false;
        //     }
        // });
    },
    //新建售后单
    handleAddNewAfterSales(){
            let bool = false;
            let obj = {};
            let arr = [];
            let refund = false;
            this.addNewAfterSaleListParameter.type.forEach(element => {
                if(element==1)refund = true;
            });
            if(this.obtainOrderDetailsGinseng.platform_code!=='EB'){
                this.addNewAfterSaleListParameter.type.forEach(element => {
                    if(element==1&&this.selection.length==0){
                        this.$message.error('请勾选退款商品!');
                        bool = true;
                    }
                });
                if(bool)return;
                this.selection.forEach(element => {
                    arr.push(this.addNewAfterSaleListParameter.refund[element]);
                });
                let num = 0;
                arr.forEach(element => {
                    if(element.item_price_amount_refund) num+= parseFloat(element.item_price_amount_refund*100);
                    if(element.item_tax_amount_refund) num+= parseFloat(element.item_tax_amount_refund*100);
                    if(element.shipping_discount_amount_refund) num+= parseFloat(element.shipping_discount_amount_refund*100);
                    if(element.shipping_tax_amount_refund) num+= parseFloat(element.shipping_tax_amount_refund*100);
                });
                if(!num&&refund){
                    this.$message.error('退款金额不能为0!');
                    return;
                }
            }else{
                if(!this.addNewAfterSaleListParameter.refund_amount&&refund){
                    this.$message.error('退款金额不能为0!');
                    return;
                }
                if(!this.addNewAfterSaleListParameter.issue.length){
                    this.$message.error('请选择问题商品再进行售后操作!');
                    return;
                }
            }
            for (const key in this.addNewAfterSalesOrder.ship_country) {
                if(key==this.addNewAfterSaleListParameter.ship_country)this.addNewAfterSaleListParameter.ship_country_name = this.addNewAfterSalesOrder.ship_country[key];
            }
            this.addNewAfterSaleListParameter.shipping_country = this.obtainOrderDetails.orderDetailsInfo.ship_cn_country_name;
            this.addNewAfterSaleListParameter.order_id = this.obtainOrderDetailsGinseng.order_id;
            this.addNewAfterSaleListParameter.platform_code = this.obtainOrderDetailsGinseng.platform_code;
            this.addNewAfterSaleListParameter.buyer_mail = this.obtainOrderDetails.orderDetailsInfo.email;
            this.addNewAfterSaleListParameter.buyer_id = this.obtainOrderDetails.orderDetailsInfo.buyer_id;
            this.addNewAfterSaleListParameter.account_id = this.obtainOrderDetails.orderDetailsInfo.account_id;
            this.addNewAfterSaleListParameter.order_type = this.obtainOrderDetails.orderDetailsInfo.order_type;
            this.addNewAfterSaleListParameter.refund_type = this.addNewAfterSaleListParameter.refund_type?2:1;
            this.addNewAfterSaleListParameter.platform_order_id = this.obtainOrderDetails.orderDetailsInfo.platform_order_id;
            this.addNewAfterSaleListParameter.ship_code_name = this.addNewAfterSalesOrder.ship_code[this.addNewAfterSaleListParameter.ship_code];
            this.addNewAfterSaleListParameter.warehouse_name = this.addNewAfterSalesOrder.warehouse_id[this.addNewAfterSaleListParameter.warehouse_id];
            this.addNewAfterSaleListParameter.shipping_warehouse_name = this.obtainOrderDetails.orderDetailsInfo.warehouse_name;
            this.addNewAfterSaleListParameter.shipping_warehouse_id = this.obtainOrderDetails.orderDetailsInfo.warehouse_id;
            this.addNewAfterSaleListParameter.redirect_warehouse_name = this.addNewAfterSalesOrder.warehouse_id[this.addNewAfterSaleListParameter.redirect_warehouse_id];
            this.addNewAfterSaleListParameter.country_code = this.obtainOrderDetails.orderDetailsInfo.ship_country;
            this.addNewAfterSaleListParameter.shipping_country_name = this.obtainOrderDetails.orderDetailsInfo.ship_cn_country_name;
            this.addNewAfterSaleListParameter.shipping_country_code = this.obtainOrderDetails.orderDetailsInfo.ship_country;
            // this.addNewAfterSaleListParameter.order_total_amount = parseFloat(this.obtainOrderDetails.orderDetailsInfo.ship_cost)+parseFloat(this.obtainOrderDetails.orderDetailsInfo.total_price);
            this.addNewAfterSaleListParameter.order_total_amount = parseFloat(this.obtainOrderDetails.orderDetailsInfo.total_price);
        this.$refs['addNewAfterSaleListParameter'].validate((valid) => {
            if (valid) {
                for (const key in this.addNewAfterSaleListParameter) {
                    obj[key] = this.addNewAfterSaleListParameter[key];
                    if(this.obtainOrderDetailsGinseng.platform_code==='EB'&&(key=='return'||key=='refund'||key=='redirect')){
                        let objPro = {};
                        obj[key]=[];
                        this.addNewAfterSaleListParameter[key].forEach(element => {
                            objPro = {
                                platform_code: element.platform_code,
                                order_id: element.order_id,
                                sku: element.sku,
                                item_id: element.item_id,
                                asin: element.asin,
                                product_title: element.product_title,
                                quantity: element.quantity,
                                linelist_cn_name: element.linelist_cn_name,
                                issue_quantity: element.issue_quantity,
                            };
                            obj[key].push(objPro);
                        });
                    }
                }
                let str = "";
                if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                    str = 'after_sales_order';
                    obj.refund = arr;
                }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                    str = 'ebay_after_sales_order';
                }
                if(this.addNewAfterSaleListParameter.operating_type=="2"&&this.obtainOrderDetailsGinseng.platform_code==='EB'){
                    ebayAfterSalesRefund(obj).then(({ data }) => {
                        if(!data.status){
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.salesAfterDetailsInfoMethod();
                        this.closeRefresh = true;
                        this.succeedCallBack(data);
                        this.handleCancelOrderInfoPopup();
                        this.AfterSaleTypeShow.refundInformation=false;
                        this.AfterSaleTypeShow.returnInformation=false;
                        this.AfterSaleTypeShow.reSendInformation=false;
                    })
                }else{
                    this.addNewAfterSales(obj,str).then(({ data }) => {
                        if(!data.status){
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        if(this.orderInfo.operation==='handlePageINR'||this.orderInfo.operation==='handlePageReturn'||this.orderInfo.operation==='handlePageCancel'){
                            if(this.orderInfo.operation==='handlePageINR'){
                                this.operationOrderSingle=handlePageINR;
                            }else if(this.orderInfo.operation==='handlePageReturn'){
                                this.operationOrderSingle=handlePageCancel;
                            }else if(this.orderInfo.operation==='handlePageCancel'){
                                this.operationOrderSingle=handlePageReturn;
                            }
                        }else{
                            if(refund&&this.obtainOrderDetailsGinseng.platform_code==='EB'&&this.addNewAfterSaleListParameter.operating_type=="1"
                                &&this.addNewAfterSaleListParameter.refund_amount == this.residualRefundAmount){
                                this.$emit("handleCancelOrder",this.obtainOrderDetails.orderDetailsInfo)
                            };
                            this.salesAfterDetailsInfoMethod();
                            // this.handleReturnButton(true);
                            this.closeRefresh = true;
                            this.succeedCallBack(data);
                            this.handleCancelOrderInfoPopup();
                            this.AfterSaleTypeShow.refundInformation=false;
                            this.AfterSaleTypeShow.returnInformation=false;
                            this.AfterSaleTypeShow.reSendInformation=false;
                        }
                    })
                }
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    obtainAfterSalesOrderCreateCrmInfo(){
            let str = '';
            if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                str = 'after_sales_order';
            }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                str = 'ebay_after_sales_order';
            }
        this.afterSalesOrderCreateCrmInfo('',str).then(({ data }) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '查询失败')
                return;
            }
            this.addNewAfterSalesOrder.department_id = data.data_list.department_id;
            this.addNewAfterSalesOrder.paypal_email = data.data_list.paypal_email;
            if(this.afterSalesOrderEditInfo.edit){
                setTimeout(()=>{
                    this.afterSalesOrderShowEdit({after_sale_id:this.afterSalesOrderEditInfo.after_sale_id},str).then(({ data }) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        if(data.data_list.value){
                            this.addNewAfterSaleListParameter.department_id = data.data_list.value.department_id;
                            this.twoLevelLinkage();
                            this.addNewAfterSaleListParameter.reason_id = data.data_list.value.reason_id;
                            this.reasonChange();
                            this.addNewAfterSaleListParameter.remark = data.data_list.value.remark;
                            this.addNewAfterSaleListParameter.type = [...data.data_list.value.type];
                            if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                                this.issue.forEach(item=>{
                                    item.bool = false;
                                    data.data_list.value.product_issue.forEach(element => {
                                        if(element.sku===item.sku){
                                            item.issue_quantity = element.issue_quantity;
                                            item.id = element.id;
                                            item.bool = true;
                                            this.handleIssueOption(true,item);
                                        }
                                    });
                                });
                            }
                        }else{
                            console.log("售后单修改信息获取错误!")
                        }
                        if(this.afterSalesOrderEditInfo.type==='退款'){
                            let parameter={}
                            if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                                parameter = data.data_list.value.refund_detail;
                            }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                                parameter = data.data_list.value;
                            }
                            this.handleRefundShow(parameter);
                            this.addNewAfterSaleListParameter.refund_detail = data.data_list.value.refund_remark;
                            // this.AfterSaleTypeShow.refundInformation=true;
                        }else if(this.afterSalesOrderEditInfo.type==='退货'){
                            // //填充修改界面
                            // data.data_list.value.product.forEach(element => {
                            //     element.issue_quantity = element.quantity;
                            //     delete element.quantity;
                            // });
                            this.addNewAfterSaleListParameter.return = data.data_list.value.product;
                            this.addNewAfterSaleListParameter.warehouse_id = data.data_list.value.warehouse_id;
                            this.addNewAfterSaleListParameter.carrier = data.data_list.value.carrier;
                            this.addNewAfterSaleListParameter.tracking_no = data.data_list.value.tracking_no;
                            this.addNewAfterSaleListParameter.rma = data.data_list.value.rma;
                            this.addNewAfterSaleListParameter.refund_code = data.data_list.value.refund_code;
                            this.addNewAfterSaleListParameter.return_remark = data.data_list.value.return_remark;
                            this.AfterSaleTypeShow.returnInformation=true;
                        }else if(this.afterSalesOrderEditInfo.type==='重寄'){
                            // //填充修改界面
                            // data.data_list.value.product.forEach(element => {
                            //     element.issue_quantity = element.quantity;
                            //     delete element.quantity;
                            // });
                            this.addNewAfterSaleListParameter.redirect = data.data_list.value.product;
                            this.addNewAfterSaleListParameter.redirect_warehouse_id = data.data_list.value.warehouse_name;
                            this.addNewAfterSaleListParameter.ship_code = data.data_list.value.ship_code;
                            this.addNewAfterSaleListParameter.order_remark = data.data_list.value.order_remark;
                            this.addNewAfterSaleListParameter.print_remark = data.data_list.value.print_remark;
                            this.addNewAfterSaleListParameter.paypal_email = data.data_list.value.paypal_email;
                            this.addNewAfterSaleListParameter.paypal_id = data.data_list.value.paypal_id;
                            this.addNewAfterSaleListParameter.order_amount = data.data_list.value.order_amount;
                            this.addNewAfterSaleListParameter.currency = data.data_list.value.currency;
                            this.addNewAfterSaleListParameter.ship_name = data.data_list.value.ship_name;
                            this.addNewAfterSaleListParameter.ship_street1 = data.data_list.value.ship_street1;
                            this.addNewAfterSaleListParameter.ship_phone = data.data_list.value.ship_phone;
                            this.addNewAfterSaleListParameter.ship_street2 = data.data_list.value.ship_street2;
                            this.addNewAfterSaleListParameter.ship_country = data.data_list.value.ship_country_name;
                            this.addNewAfterSaleListParameter.ship_stateorprovince = data.data_list.value.ship_stateorprovince;
                            this.addNewAfterSaleListParameter.ship_zip = data.data_list.value.ship_zip;
                            this.addNewAfterSaleListParameter.ship_city_name = data.data_list.value.ship_city_name;
                            // this.addNewAfterSaleListParameter.transaction_id = data.data_list.value.paypal_id;
                            // this.addNewAfterSaleListParameter.paytime =
                            this.AfterSaleTypeShow.reSendInformation=true;
                            console.log(this.addNewAfterSaleListParameter);
                        }
                        this.$forceUpdate();
                    });
                },500)
            }
        })
    },
    //获取新建售后单所需信息
    obtainAfterSalesOrderCreateJavaInfo(){
        this.afterSalesOrderCreateInfo().then(({ data }) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '查询失败')
                return;
            }
            this.obtainOrderDetails.ship_code = data.data_list.ship_code;
            this.obtainOrderDetails.warehouse_id = data.data_list.warehouse_id;
            this.addNewAfterSalesOrder.warehouse_id = data.data_list.warehouse_id;
            this.addNewAfterSalesOrder.warehouse = data.data_list.warehouse_id;
            this.addNewAfterSalesOrder.ship_code = data.data_list.ship_code;
            this.addNewAfterSalesOrder.ship_country = data.data_list.ship_country;
        })
    },
    //二级联动
    twoLevelLinkage(){
        this.addNewAfterSaleListParameter.reason_id='';
        this.addNewAfterSaleListParameter.descriptionAdverseCauses = '';
        for(let i=0;i<this.addNewAfterSalesOrder.department_id.length;i++){
            if(this.addNewAfterSalesOrder.department_id[i].id==this.addNewAfterSaleListParameter.department_id){
                this.twoLevelLinkageInfo = this.addNewAfterSalesOrder.department_id[i].child
            }
        }
    //     // console.log(this.addNewAfterSalesOrder.department_id.length)
    },
    //不良原因说明
    reasonChange(){
        let obj = this.twoLevelLinkageInfo.filter(item=>{
            if(item.id===this.addNewAfterSaleListParameter.reason_id){
                return item
            }
        });
        this.addNewAfterSaleListParameter.descriptionAdverseCauses = obj[0]?obj[0].text:'';
    },
    //提交客诉单
    handleCustomerComplaintSubmission(){
        let bool = true;
        this.changeCustomerComplaint = false;
        if(this.orderInfo.edit){
            this.registeredCustomerComplaint.detail.forEach(element => {
                if(element.product)bool = false;
            });
        }else{
            this.obtainOrderDetails.proDetailsInfo.forEach(element => {
                if(element.product)bool = false;
            });
        }
        if(bool)this.changeCustomerComplaint = true;
        this.$refs['registeredCustomerComplaint'].validate((valid) => {
            if (valid) {
                if(this.changeCustomerComplaint){
                    this.$message.error('请勾选需要进行客诉的产品信息！');
                    return;
                }
                if(this.orderInfo.edit){
                    let objEdit = {
                        type:this.registeredCustomerComplaint.complaint_type,
                        description:this.registeredCustomerComplaint.description,
                        genre:this.registeredCustomerComplaint.genre,
                        id:this.registeredCustomerComplaint.id,
                        is_expedited:this.registeredCustomerComplaint.is_expedited,
                        detail:[]
                    };

                    this.registeredCustomerComplaint.detail.forEach(element => {
                        let url = '';
                        let name = '';
                        // element.img_url.forEach((e,i) => {
                        //     if(i==0){
                        //         if(e.url){
                        //             url = e.url;
                        //             name = e.name;
                        //         }
                        //     }else{
                        //         if(e.url){
                        //             url += ','+e.url;
                        //             name += '<@>'+element.img_name;
                        //         }
                        //     }
                        // });
                        // if(url){
                        //     url += ','+element.url;
                        //     name += '<@>'+element.img_name;
                        // }else{
                        //     url = element.url;
                        //     name = element.img_name;
                        // }
                        let obj={
                            checks:element.checks,
                            img_url:element.url,
                            id:element.id,
                            product_line:element.product_line,
                            qty:element.qty,
                            sku:element.sku,
                            title:element.title,
                            img_name:element.img_name
                        };
                        objEdit.detail.push(obj);
                    });
                    let str="";
                    if(this.orderInfo.platform_code=='AMAZON'){
                        str="customer_complaint";
                    }else if(this.orderInfo.platform_code=='EB'){
                        str="ebay_customer_complaint";
                    }
                    this.complaintDoEdit(objEdit,str).then(({ data}) => {
                        if(!data.status){
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.isOrderInfo=false;
                        this.$emit("handleOperationCallBack");
                        this.$message.success('操作成功！');
                        this.$emit('handleQueryInfo');
                    })
                }else{
                    this.registeredCustomerComplaint.platform_code = this.obtainOrderDetails.orderDetailsInfo.platform_code
                    this.registeredCustomerComplaint.warehouse_id = this.obtainOrderDetails.orderDetailsInfo.warehouse_id
                    this.registeredCustomerComplaint.order_id = this.obtainOrderDetails.orderDetailsInfo.order_id
                    this.registeredCustomerComplaint.platform_order_id = this.obtainOrderDetails.orderDetailsInfo.platform_order_id
                    this.registeredCustomerComplaint.buyer_phone = this.obtainOrderDetails.orderDetailsInfo.ship_phone
                    this.registeredCustomerComplaint.buyer_id = this.obtainOrderDetails.orderDetailsInfo.buyer_id
                    this.registeredCustomerComplaint.account_id = this.obtainOrderDetails.orderDetailsInfo.account_id
                    this.registeredCustomerComplaint.buyer_mail = this.obtainOrderDetails.orderDetailsInfo.email
                    this.registeredCustomerComplaint.shipping_date = this.obtainOrderDetails.orderDetailsInfo.shipped_date
                    this.registeredCustomerComplaint.warehouse_code = this.obtainOrderDetails.orderDetailsInfo.warehouse_code
                    this.registeredCustomerComplaint.detail = [];
                    this.obtainOrderDetails.proDetailsInfo.forEach(element => {
                        let obj={};
                        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                            obj={
                                sku:element.sku,
                                asin:element.asinval,
                                title:element.chinese_title,
                                product_line:element.linelist_cn_name,
                                qty:element.quantity,
                                img_url:element.product&&element.url?element.url:'',
                                checks:element.product?1:0,
                                img_name:element.product&&element.img_name?element.img_name:'',
                            }
                        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                            obj={
                                sku:element.sku,
                                item_id:element.item_id,
                                title:element.chinese_title,
                                product_line:element.linelist_cn_name,
                                qty:element.quantity,
                                img_url:element.product&&element.url?element.url:'',
                                checks:element.product?1:0,
                                img_name:element.product&&element.img_name?element.img_name:'',
                            }
                        }
                            this.registeredCustomerComplaint.detail.push(obj);
                    });
                    if(this.obtainOrderDetails.orderDetailsInfo==""){
                        this.$message.error("订单信息获取失败！");
                    }else{
                        let str='';
                        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                            str='customer_complaint';
                        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                            str='ebay_customer_complaint';
                        }
                        this.customerComplaintSubmission(this.registeredCustomerComplaint,str).then(({ data}) => {
                            if(!data.status){
                                this.registeredCustomerComplaint.detail = [];
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }
                            this.isOrderInfo=false;
                            this.$emit("handleOperationCallBack");
                            this.$message.success('操作成功！');
                        })
                    }
                }
            } else {
                    console.log('error submit!!');
                    return false;
                }
            });
    },
    //登记客诉单上传附件
    handleAddress(response, file, fileList,item){
        if( !response.status ){
            this.$message.error(data.errorMess || '上传失败！');
            return;
        }
        if(item.url){
            item.img_name += "<@>"+file.name;
            item.url += ","+response.file_path;
        }else{
            item.img_name = file.name;
            item.url = response.file_path;
        }
        // if(item.img_url){
        //     item.img_url.push({
        //         uid: 0,
        //         url: response.file_path,
        //         name: file.name,
        //         status: 'success'
        //     });
        // }
        this.$message.success('上传成功！');
        this.$store.commit("SAVE_LOADING_STATE",false);
    },
    handleError(){
        this.$store.commit("SAVE_LOADING_STATE",false);
        this.$message.error('上传失败！');
    },
    beforeUpload(file) {
        let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        let extArr = ['gif', 'jpg', 'png', 'jpeg', 'bmp'];
        let size = file.size / 1024 / 1024 < 10;
        if( !size ){
            this.$message.error('文件大小必须在10m以内！');
            return false;
        }
        if( !extArr.includes(ext) ){
            this.$message.error('文件格式不符合！');
            return false;
        }
        this.$store.commit("SAVE_LOADING_STATE",true);
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //删除图片
    handleRemove(file, fileList, item) {
        if(fileList.length){
            fileList.forEach((element,index) => {
                if(!index){
                    if(element.url){
                        item.url = element.url;
                        item.img_url = [];
                        item.img_url.push(element);
                    }else{
                        item.url = element.response.file_path;
                        item.img_url = [];
                        item.img_url.push(element.response.file_path);
                    }
                    item.img_name = element.name;
                }else{
                    if(element.url){
                        item.url += ","+element.url;
                        item.img_url.push(element);
                    }else{
                        item.url += ","+element.response.file_path;
                        item.img_url.push(element.response.file_path);
                    }
                    item.img_name += "<@>"+element.name;
                }
            });
        }else{
            item.url = '';
            // item.img_url = [];
            item.img_name = '';
        }
    },
    //勾选需要进行客诉的产品
    handleProDetailsOption(bool,item){
        this.$forceUpdate();
        if(bool){
            item.checks = 1;
        }else{
            item.checks = 0;
        }
        // if(bool){
        //     this.changeCustomerComplaint = false;
        // }else{
        //     this.changeCustomerComplaint = true;
        // }
        // if(item.product)this.changeCustomerComplaint = false;
    },
    handleChange(val) {
        console.log(val);
    },
    // //取消按钮
    // handleReturnButton(str){
    //     if(str){
    //         this.AfterSaleTypeShow.refundInformation=false
    //         this.AfterSaleTypeShow.returnInformation=false
    //         this.AfterSaleTypeShow.reSendInformation=false
    //         this.twoLevelLinkageInfo = []
    //         this.$refs['addNewAfterSaleListParameter'].resetFields();//清空售后单类型选择表单
    //     }else{
    //         this.registeredCustomerComplaint.detail=[]
    //         this.$refs['registeredCustomerComplaint'].resetFields();//清空客诉单表单
    //     }
    //     this.operationOrderSingle=handleOrder
    // },
    //保存备注
    handleChildSaveRemark (addRemark,addRemarkRef,platform_code) {
        let obj ={
            order_id:this.obtainOrderDetailsGinseng.order_id,
            remark:addRemark.orderInfoRemarks,
            platform_code:this.obtainOrderDetailsGinseng.platform_code
        }
        let strOrder='',strShip='';
        if(platform_code=='AMAZON'){
            strOrder='order_list';
            strShip='order_details';
        }else if(platform_code=='EB'){
            strOrder='ebay_order_list';
            strShip='ebay_order_details';
        }
        switch(addRemark.remarkType){
            case '订单备注':
                this.addNewBatchRemark(obj,strOrder).then(({ data }) => {
                    if (data.status) {
                        this.orderDetailsInfoMethod();
                        this.$message.success('成功新增订单备注！');
                    } else {
                        this.$message.error(data.errorMess || '新增订单备注失败！');
                    }
                })
            break;
            case '出货备注':
                this.addNewShipRemark(obj,strShip).then(({ data }) => {
                    if (data.status) {
                        this.orderDetailsInfoMethod();
                        this.$message.success('成功新增出货备注！');
                    } else {
                        this.$message.error(data.errorMess || '新增出货备注失败！');
                    }
                })
            break;
        }
    },
    //删除备注
    handleOrderDeleteRemarkInfo(obj){
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.delRemarkInfo(obj,str).then(({ data }) => {
            if (data.status) {
                this.orderDetailsInfoMethod();
                this.logsInfoMethod()
                this.$message.success('删除备注成功！');
            } else {
                this.$message.error(data.errorMess || '删除备注失败！');
            }
        })
    },
    //产品信息的增删改
    handleProductInfoAddDeleteEditInfo(productInfo){
        let productArr={
            order_id:this.obtainOrderDetailsGinseng.order_id,
            platform_code:this.obtainOrderDetailsGinseng.platform_code,
            product:[]
        }
        for(let key in productInfo){
            let productObj={
                title:productInfo[key].chinese_title,
                sale_price:productInfo[key].sale_price,
                ship_price:productInfo[key].ship_price,
                total_price:productInfo[key].total_price,
                item_id:productInfo[key].item_id,
                editsku:productInfo[key].editsku,
                id:productInfo[key].product_id,
                // number:productInfo[key].qs,
                number:productInfo[key].quantity,
                sku:productInfo[key].sku,
                is_delete:productInfo[key].is_delete,
                is_erp:productInfo[key].is_erp,
                // asinval:productInfo[i].asinval,
                // availablestock:productInfo[i].availablestock,
                // transit_qty:productInfo[i].transit_qty,
            }
            if(productInfo[key].is_delete){
                productObj.is_delete = productInfo[key].is_delete
                productObj.is_erp = productInfo[key].is_erp
            }
            productArr.product.push(productObj)
        }
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        this.productInfoAddDeleteEdit(productArr,str).then(({ data }) => {
            if(data.status=='1'){
                this.$message.success('操作成功！');
                this.ProDetailsInfoMethod()
            }else{
                this.$message.error(data.errorMess || '操作失败！');
            }
        })
    },
    //sku获取产品信息接口
    handleProErpSku(sku,order, i, string){
        let obj={sku:sku}
        if(order){
            for (let index = 0; index < this.addNewAfterSaleListParameter[order].length; index++) {
                if(sku == this.addNewAfterSaleListParameter[order][index].sku&&index!=i){
                    this.$message.warning('存在重复SKU！');
                    return
                }
            }
        }
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_details';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_details';
        }
        if(!order){
            this.proErpSku(obj,str).then(({ data }) => {
                if (data.status) {
                    if(data.data_list.product_is_multi=='2'){
                        this.$message.error('该SKU为产品主SKU，请输入子SKU！');
                        return;
                    }
                    this.skuInfo = data.data_list;
                    this.$forceUpdate();
                    this.$message.success('操作成功！');
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            })
        }else{
            this.proErpAftersalesSku(obj).then(({ data }) => {
                if (data.status) {
                        if(data.data_list.product_is_multi=='2'&&string=='重寄'){
                            this.$message.warning('该SKU为产品主SKU，请输入子SKU进行发货！');
                            return;
                        }
                        this.$set(this.addNewAfterSaleListParameter[order], i, {
                            platform_code:this.obtainOrderDetailsGinseng.platform_code,
                            order_id:this.obtainOrderDetailsGinseng.order_id,
                            sku:data.data_list.sku,//sku编号
                            product_title:data.data_list.chinese_title,//产品标题
                            issue_quantity:0,
                            linelist_cn_name:data.data_list.linelist_cn_name,//产品线
                            product_price:data.data_list.price,//产品金额
                            currency:data.data_list.currency,//币种
                            refund_redirect_price:0,//重寄/退款金额 没有传0
                            item_id:data.data_list.item_id||'',
                            asin:data.data_list.asin||"",
                            quantity:0,//数量
                        })
                        this.$message.success('操作成功！');
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            });
        }
    },
    //搜索paypal交易号
    searchPaypal(){
        let obj={
            transaction_id:this.addNewAfterSaleListParameter.paypal_id,
            platform_code:this.obtainOrderDetailsGinseng.platform_code,
        }
        let str = '';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'after_sales_receipt';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_after_sales_receipt';
        }
        this.searchPaypalTransactionInfo(obj,str).then(({ data }) => {
            if (data.status) {
                this.addNewAfterSaleListParameter.transaction_id = data.data_list.transaction_id//交易ID
                this.addNewAfterSaleListParameter.paytime = data.data_list.paytime//交易时间
                this.addNewAfterSaleListParameter.amt = data.data_list.amt//交易金额
                this.addNewAfterSaleListParameter.payment_status = data.data_list.payment_status//付款状态
                this.addNewAfterSaleListParameter.fee_amt = data.data_list.fee_amt//交易佣金
                this.addNewAfterSaleListParameter.payer_email = data.data_list.payer_email//付款账号
                this.addNewAfterSaleListParameter.receiver_email = data.data_list.receiver_email//收款账号

                this.addNewAfterSaleListParameter.paypal_email = data.data_list.receiver_email;
                this.addNewAfterSaleListParameter.currency = data.data_list.currency;
                this.addNewAfterSaleListParameter.order_amount = data.data_list.amt;

                this.$message.success('操作成功！');
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        })
    },
    //退款单显示隐藏
    handleRefundShow(refund_detail){
        // refund_detail=[
        //     {item_id: 18974255242187,
        //     item_price_amount: "390.00",
        //     item_shipping_amount: "40",
        //     item_tax_amount: "",
        //     product_title: "12种共600pcs小螺丝盒 M1/1.2/1.4/1.6",
        //     reason_code: "CustomerCancel",
        //     shipping_tax_amount: "",}
        // ]
        if(this.addNewAfterSaleListParameter.type.indexOf('1')===-1){
            this.AfterSaleTypeShow.refundInformation=false;
            this.addNewAfterSaleListParameter.refund = [];
        }else{
            this.AfterSaleTypeShow.refundInformation=true;
            if(this.obtainOrderDetailsGinseng.platform_code!=='EB'){
                let obj = {};
                if(this.afterSalesOrderEditInfo.edit){
                    obj={
                        // order_id:'AM190610004572',
                        order_id:this.afterSalesOrderEditInfo.order_id,
                        account_id:this.afterSalesOrderEditInfo.old_account_id,
                        platform_order_id:this.afterSalesOrderEditInfo.platform_order_id
                    }
                }else{
                    obj={
                        // order_id:'AM190629024609',
                        order_id:this.obtainOrderDetails.orderDetailsInfo.order_id,
                        account_id:this.obtainOrderDetails.orderDetailsInfo.account_id,
                        platform_order_id:this.obtainOrderDetails.orderDetailsInfo.platform_order_id
                    }
                }
                this.addNewRefundInfo(obj).then(({ data }) => {
                    if(!data.status){
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    // data={};
                    // data={
                    //     "data_list": [{
                    //         asin: "B07QCXQQZW",
                    //         cn_title: "(已授权） PEACEFAIR   PZEM-051数显电压/电流/放电电阻/电池测试仪 (100A分流器)",
                    //         en_title: "Digital LCD Voltmeter [DC 6.5-100V 100A], Current Voltage Power Energy Watt Meter Multimeter Ammeter, with 100A Shunt(100A)",
                    //         id: 7651612,
                    //         item_currency_code: "GBP",
                    //         item_id: "04851201784843",
                    //         item_price_amount: 8.54,
                    //         item_shipping_amount: 0,
                    //         item_shipping_currency_code: "",
                    //         item_tax_amount: 0,
                    //         item_tax_currency_code: "GBP",
                    //         order_id: "AM190911000058",
                    //         promotion_discount_amount: 0.85,
                    //         promotion_discount_currency_code: "GBP",
                    //         promotion_id: "",
                    //         qty_ordered: 1,
                    //         qty_shipped: 0,
                    //         seller_sku: "WJ1-ISE-GS06002-4,Bn--02",
                    //         shipping_discount_amount: 0,
                    //         shipping_discount_currency_code: "",
                    //         shipping_tax_amount: 0,
                    //         shipping_tax_currency_code: "",
                    //         type: 0,
                    //     }]
                    // };
                    data.data_list.forEach(element => {
                        if(element.item_price_amount===''||element.item_price_amount===null||element.promotion_discount_amount===''||element.promotion_discount_amount===null||parseFloat(element.promotion_discount_amount)>parseFloat(element.item_price_amount)){
                            element.item_price = 0;
                        }else{
                            element.item_price = ((element.item_price_amount*100-element.promotion_discount_amount*100)/100).toFixed(2);
                        }
                        if(element.item_shipping_amount===''||element.item_shipping_amount===null||element.shipping_discount_amount===''||element.shipping_discount_amount===null||parseFloat(element.shipping_discount_amount)>parseFloat(element.item_shipping_amount)){
                            element.final_shipping_amount = 0;
                        }else{
                            element.final_shipping_amount = ((element.item_shipping_amount*100-element.shipping_discount_amount*100)/100).toFixed(2);
                        }
                        // if(this.afterSalesOrderEditInfo.type!=='退款'){
                            element.final_shipping_amount = parseFloat(element.final_shipping_amount);
                            element.reason_code='CustomerCancel';
                            element.item_price_amount_refund = 0;
                            element.item_price_amount_proportion = 0;
                            element.item_tax_amount_refund = 0;
                            element.item_tax_amount_proportion = 0;
                            element.shipping_discount_amount_refund = 0;
                            element.shipping_discount_amount_proportion = 0;
                            element.shipping_tax_amount_refund = 0;
                            element.shipping_tax_amount_proportion = 0;
                            element.isSubmission = false;
                            element.isWholeRefund = false;
                        // }
                    });
                    this.addNewAfterSaleListParameter.refund = data.data_list;
                    if(typeof refund_detail!='boolean'){
                        this.addNewAfterSaleListParameter.refund.forEach((element,index) => {
                            refund_detail.forEach(detail => {
                                if( parseInt(element.item_id)==parseInt(detail.item_id)){
                                    element.reason_code = detail.reason_code;
                                    if(detail.item_price_amount) {
                                        if(parseFloat(element.item_price)<parseFloat(detail.item_price_amount)){
                                            element.item_price_amount_refund = element.item_price;
                                        }else{
                                            element.item_price_amount_refund = detail.item_price_amount;
                                        }
                                        element.item_price_amount_proportion = Math.round(parseFloat(detail.item_price_amount)/parseFloat(element.item_price)*10000)/100;
                                    }else {
                                        detail.item_price_amount=0;
                                        element.item_price_amount_refund = 0;
                                        element.item_price_amount_proportion = 0;
                                    }
                                    if(detail.item_tax_amount){
                                        if(parseFloat(element.item_tax_amount)<parseFloat(detail.item_tax_amount)){
                                            element.item_tax_amount_refund = element.item_tax_amount;
                                        }else{
                                            element.item_tax_amount_refund = detail.item_tax_amount;
                                        }
                                        // element.item_tax_amount_refund = detail.item_tax_amount;
                                        element.item_tax_amount_proportion = Math.round(parseFloat(detail.item_tax_amount)/parseFloat(element.item_tax_amount)*10000)/100;
                                    }else{
                                        detail.item_tax_amount=0;
                                        element.item_tax_amount_refund = 0;
                                        element.item_tax_amount_proportion = 0;
                                    }
                                    if(detail.item_shipping_amount){
                                        if(parseFloat(element.final_shipping_amount)<parseFloat(detail.item_shipping_amount)){
                                            element.shipping_discount_amount_refund = element.final_shipping_amount;
                                        }else{
                                            element.shipping_discount_amount_refund = detail.item_shipping_amount;
                                        }
                                        // element.shipping_discount_amount_refund = detail.item_shipping_amount;
                                        element.shipping_discount_amount_proportion = Math.round(parseFloat(detail.item_shipping_amount)/parseFloat(element.final_shipping_amount)*10000)/100;
                                    }else{
                                        detail.item_shipping_amount = 0;
                                        element.shipping_discount_amount_refund = 0;
                                        element.shipping_discount_amount_proportion = 0;
                                    }
                                    if(detail.shipping_tax_amount){
                                        if(parseFloat(element.shipping_tax_amount)<parseFloat(detail.shipping_tax_amount)){
                                            element.shipping_tax_amount_refund = element.shipping_tax_amount;
                                        }else{
                                            element.shipping_tax_amount_refund = detail.shipping_tax_amount;
                                        }
                                        // element.shipping_tax_amount_refund = detail.shipping_tax_amount;
                                        element.shipping_tax_amount_proportion = Math.round(parseFloat(detail.shipping_tax_amount)/parseFloat(element.shipping_tax_amount)*10000)/100;
                                    }else{
                                        detail.shipping_tax_amount = 0;
                                        element.shipping_tax_amount_refund = 0;
                                        element.shipping_tax_amount_proportion = 0;
                                    }
                                    element.isSubmission = true;
                                    this.handleRefundSelection(index);
                                    if(!element.item_price)element.item_price=0;
                                    if(!element.item_tax_amount)element.item_tax_amount=0;
                                    if(!element.final_shipping_amount)element.final_shipping_amount=0;
                                    if(!element.shipping_tax_amount)element.shipping_tax_amount=0;
                                    if(parseFloat(element.item_price_amount_refund)==parseFloat(element.item_price)
                                        &&parseFloat(element.item_tax_amount_refund)==parseFloat(element.item_tax_amount)
                                        &&parseFloat(element.shipping_discount_amount_refund)==parseFloat(element.final_shipping_amount)
                                        &&parseFloat(element.shipping_tax_amount_refund)==parseFloat(element.shipping_tax_amount)){
                                        element.isWholeRefund = true;
                                    }else{
                                        element.isWholeRefund = false;
                                    }
                                }
                            });
                        });
                    }
                });
            }else if(this.obtainOrderDetailsGinseng.platform_code=='EB'){
                if(!this.obtainOrderDetails.orderDetailsInfo.total_price){
                    this.$message.error('获取不到订单金额，请稍后重试！');
                    return;
                }
                getAllowRefundAmount({order_id:this.obtainOrderDetails.orderDetailsInfo.order_id}).then(({ data }) => {
                    if(!data.status){
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.residualRefundAmount = ((parseFloat(this.obtainOrderDetails.orderDetailsInfo.total_price)*100-(parseFloat(data.data_list.amount)*100))/100).toFixed(2);
                    if(parseFloat(this.residualRefundAmount)<0)this.residualRefundAmount = 0;
                    this.addNewAfterSaleListParameter.refund_amount = refund_detail.refund_amount?refund_detail.refund_amount:this.residualRefundAmount;
                    this.handleRefundAmount();
                });
            }
        }
    },
    //退货单显示隐藏
    handleReturnShow(){
        if(this.addNewAfterSaleListParameter.type.indexOf('2')===-1){
            this.AfterSaleTypeShow.returnInformation=false
        }else{
            this.addNewAfterSaleListParameter.warehouse_id = this.obtainOrderDetails.orderDetailsInfo.warehouse_id+'';
            this.AfterSaleTypeShow.returnInformation=true
        }
    },
    //重寄单显示隐藏
    handleReSendShow(){
        if(this.addNewAfterSaleListParameter.type.indexOf('3')===-1){
            this.AfterSaleTypeShow.reSendInformation=false
        }else{
            this.AfterSaleTypeShow.reSendInformation=true
            this.addNewAfterSaleListParameter.ship_name=this.obtainOrderDetails.orderDetailsInfo.ship_name;//收货人姓名
            this.addNewAfterSaleListParameter.ship_street1=this.obtainOrderDetails.orderDetailsInfo.ship_street1;//收货人地址一
            this.addNewAfterSaleListParameter.ship_street2=this.obtainOrderDetails.orderDetailsInfo.ship_street2;//收货人地址二
            this.addNewAfterSaleListParameter.ship_zip=this.obtainOrderDetails.orderDetailsInfo.ship_zip;//收货邮编
            this.addNewAfterSaleListParameter.ship_city_name=this.obtainOrderDetails.orderDetailsInfo.ship_city_name;//收获人城市
            this.addNewAfterSaleListParameter.ship_stateorprovince=this.obtainOrderDetails.orderDetailsInfo.ship_stateorprovince;//收货人州/省
            this.addNewAfterSaleListParameter.ship_country=this.obtainOrderDetails.orderDetailsInfo.ship_country_name;//收货人国家代码
            this.addNewAfterSaleListParameter.ship_country_name=this.obtainOrderDetails.orderDetailsInfo.ship_country_name;//收货人国家名称
            this.addNewAfterSaleListParameter.ship_phone=this.obtainOrderDetails.orderDetailsInfo.ship_phone;//收货人电话
            if(!this.addNewAfterSalesOrder.ship_code.hasOwnProperty(this.addNewAfterSaleListParameter.ship_code))this.addNewAfterSaleListParameter.ship_code = '';
        }
    },
    //加载当前订单默认信息
    currentLoadOrderInfo(){
        this.systemProgressInfo()//系统进度
        this.platformProgressInfo()//平台进度
        this.orderDetailsInfoMethod()//订单详情
        this.obtainAfterSalesOrderCreateCrmInfo();//拆分后的售后单下拉数据 crm数据库
        this.ProDetailsInfoMethod()//产品详情
        this.transactionDetailsInfoMethod()//交易记录
        this.packageDetailsInfoMethod()//订单包裹
        this.logisticsDetailsInfoMethod()//物流信息
        this.profitDetailsInfoMethod()//利润信息
        this.salesAfterDetailsInfoMethod()//售后信息
        this.logsInfoMethod()//日志信息
        this.obtainAfterSalesOrderCreateJavaInfo()//获取新建售后单信息
    },
    //新增产品信息
    handleAddProductInfo(str){
        let obj={
            platform_code:this.obtainOrderDetailsGinseng.platform_code,
            order_id:this.obtainOrderDetailsGinseng.order_id,
            sku:'',//sku编号
            product_title:'',//产品标题
            issue_quantity:0,
            linelist_cn_name:'',//产品线
            product_price:'',//产品金额
            currency:'',//币种
            refund_redirect_price:0,//重寄/退款金额 没有传0
            item_id:'',
            asin:'',
            quantity:0,//数量
        }
        if(str=='重寄'){
            this.addNewAfterSaleListParameter.redirect.push(obj)
        }else{
            this.addNewAfterSaleListParameter.return.push(obj)
        }
    },
    //删除产品信息
    handleDeleteProductInfo(str,index){
        if(str=='重寄'){
            this.addNewAfterSaleListParameter.redirect.splice(index,1)
        }else{
            this.addNewAfterSaleListParameter.return.splice(index,1)
        }
    },
    //发票
    orderInvoice(row,bol){
        if(this.obtainOrderDetails.orderDetailsInfo.paytime==''||this.obtainOrderDetails.orderDetailsInfo.paytime==null){
            this.$message.warning('该订单未付款，不能开具发票！')
            return;
        }
      this.InvoiceInfo = this.obtainOrderDetails.orderDetailsInfo
      this.InvoiceInfo.B2B = bol;
        // this.invoiceSubmission.order_id = this.obtainOrderDetails.orderDetailsInfo.order_id;
        this.invoiceSubmission.platform_code = this.obtainOrderDetails.orderDetailsInfo.platform_code;
        this.invoiceSubmission.site = this.obtainOrderDetails.orderDetailsInfo.site;
        this.invoiceSubmission.order_time = ''
      let date = new Date();
      this.invoiceSubmission.invoice_time=date.toLocaleDateString();
      let obj = {};
            if(bol){
                obj = {
                    order_id: this.obtainOrderDetails.orderDetailsInfo.order_id,
                    country: this.obtainOrderDetails.orderDetailsInfo.site,
                    platform_code: this.obtainOrderDetails.orderDetailsInfo.platform_code,
                    site:this.obtainOrderDetails.orderDetailsInfo.site,
                    invoiceB2B:1
                }
            }else{
                obj = {
                    order_id: this.obtainOrderDetails.orderDetailsInfo.order_id,
                    country: this.obtainOrderDetails.orderDetailsInfo.site,
                    platform_code: this.obtainOrderDetails.orderDetailsInfo.platform_code,
                    site:this.obtainOrderDetails.orderDetailsInfo.site,
                }
            }
        this.invoiceDetailsInterface(obj).then(({data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '发票信息查询失败')
                return;
            }
            this.isInvoice=true;
            setTimeout(()=>{
                this.detailsInvoiceInfo = data.data_list.value
                this.invoiceSubmission.cust_addr = this.detailsInvoiceInfo.cust_addr
                this.invoiceSubmission.customer_company = this.detailsInvoiceInfo.company_name
                this.invoiceSubmission.customer_addr = this.detailsInvoiceInfo.company_addr
                //计算总价
                let totalAmount = this.detailsInvoiceInfo.product_info_list
                let product = 0
                totalAmount.forEach(element => {
                    product += element.sale_price*element.quantity+element.vat
                });
                this.invoiceSubmission.pro_pric = product
                this.invoiceSubmission.total_price = product+parseFloat(this.invoiceSubmission.ship_fee)
            },0)
        }) .catch(err => {
         console.log(err);
        });
    },
    //提交发票
    handleSubmitInvoiceInterface(obj){
        this.submitInvoiceInterface(obj).then(({data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }else{
                this.$message.success('操作成功')
                return;
            }
        }) .catch(err => {
            console.log(err);
        });
    },
    //取消暂扣/取消作废（应业务方要求，订单详情弹窗不做取消作废处理）
    handleCancelOperation(){
        this.deleteTips=!this.deleteTips
        let cancelWithhold = {
            order_id:this.obtainOrderDetails.orderInfo.order_id,
            platform_code:this.obtainOrderDetails.orderInfo.platform_code,
            type:'1'
        }
        let str='';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str = 'order_list';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str = 'ebay_order_list';
        }
        this.batchCancelWithhold(cancelWithhold,str).then(({ data }) => {
            this.orderDetailsInfoMethod()//订单详情
            this.closeRefresh = true;
            this.succeedCallBack(data);
        })
    },
    //取消（关闭弹窗）
    cancel() {
        this.isInvoice=false
        if(this.isBatchShow){
            this.$refs['obtainOrderDetailsGinseng'].resetFields();
            this.isBatchShow=false
        }
    },
    handleIsInvoiceShow(bol){
      this.isInvoice=bol
    },
    handleCustomerComplaintInfo(){
        this.fileList={}
        let str="";
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
           str='Customer_complaint';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str="ebay_Customer_complaint";
        }
        this.customerComplaintInfoInterface('',str).then(({ data }) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }
            this.customerComplaintFormInfo = data.data_list
            // this.obtainOrderDetails.proDetailsInfo.forEach((element,index) => {
            //     this.fileList[index]=[]
            // });
            // console.log(this.fileList)
        })
    },
    //联系买家
    handleContactBuyers(){
        let orderId= this.obtainOrderDetails.orderDetailsInfo.order_id;
        let account_id= this.obtainOrderDetails.orderDetailsInfo.account_id;
        let emailCustomer= this.obtainOrderDetails.orderDetailsInfo.email;
        let path = '/PostMail';
        let query = {type: "OrderInformation", order_id: orderId, account_id: account_id, email: emailCustomer, goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
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
    //新建退款单需要验证退款金额
    handleClick(value,str,index){
        value.isSubmission = true;
        this.handleRefundSelection(index);
        if(str=='item_price_amount'){
            if(parseFloat(value[str+'_refund'])>=value.item_price){
                value[str+'_refund']=value.item_price;
                value[str+'_proportion'] = 100;
                if(parseFloat(value[str+'_refund'])==value.item_price){
                    value.isWholeRefund = true;
                }else{
                    this.$message.warning('不能超过当前最大金额，请重新输入正确的退款金额！');
                }
            }else if(parseFloat(value[str+'_refund'])<value.item_price){
                value[str+'_proportion'] = Math.round(parseFloat(value[str+'_refund'])/parseFloat(value.item_price)*10000)/100;
                value.isWholeRefund = false;
            }
        }else if(str=='shipping_discount_amount'){
            if(parseFloat(value[str+'_refund'])>=value.final_shipping_amount){
                value[str+'_refund']=value.final_shipping_amount;
                value[str+'_proportion'] = 100;
                if(parseFloat(value[str+'_refund'])==value.final_shipping_amount){
                    value.isWholeRefund = true;
                }else{
                    this.$message.warning('不能超过当前最大金额，请重新输入正确的退款金额！');
                }
            }else if(parseFloat(value[str+'_refund'])<value.final_shipping_amount){
                value[str+'_proportion'] = Math.round(parseFloat(value[str+'_refund'])/parseFloat(value.final_shipping_amount)*10000)/100;
                value.isWholeRefund = false;
            }
        }else{
            if(parseFloat(value[str+'_refund'])>=value[str]){
                value[str+'_refund']=value[str];
                value[str+'_proportion'] = 100;
                if(parseFloat(value[str+'_refund'])==value[str]){
                    value.isWholeRefund = true;
                }else{
                    this.$message.warning('不能超过当前最大金额，请重新输入正确的退款金额！');
                }
            }else if(parseFloat(value[str+'_refund'])<value[str]){
                value[str+'_proportion'] = Math.round(parseFloat(value[str+'_refund'])/parseFloat(value[str])*10000)/100;
                value.isWholeRefund = false;
            }
        }
        if(parseFloat(value.item_price_amount_refund)==parseFloat(value.item_price)
            &&parseFloat(value.item_tax_amount_refund)==parseFloat(value.item_tax_amount)
            &&parseFloat(value.shipping_discount_amount_refund)==parseFloat(value.final_shipping_amount)
            &&parseFloat(value.shipping_tax_amount_refund)==parseFloat(value.shipping_tax_amount)){
            value.isWholeRefund = true;
        }else{
            value.isWholeRefund = false;
        }
    },
    // 退款比例
    handleProportionCalculation(value,str,index){
        value.isSubmission = true;
        this.handleRefundSelection(index);
        if(str=='item_price_amount'){
            if(parseFloat(value[str+'_proportion'])>100){
                value[str+'_refund']=value.item_price;
                // // value[str+'_proportion'] = 100;
                // console.log(value)
                // this.$message.warning('退款金额不能超过当前最大金额，请重新输入正确的退款比例！');
            }else if(parseFloat(value[str+'_proportion'])<=100){
                value[str+'_refund'] = Math.round((parseFloat(value[str+'_proportion'])*100)*(parseFloat(value.item_price)*100)/10000)/100;
                value.isWholeRefund = false;
            }
        }else if(str=='shipping_discount_amount'){
            if(parseFloat(value[str+'_proportion'])>100){
                value[str+'_refund']=value.final_shipping_amount;
                // value[str+'_proportion'] = 100;
                // this.$message.warning('退款金额不能超过当前最大金额，请重新输入正确的退款金额！');
            }else if(parseFloat(value[str+'_proportion'])<=100){
                value[str+'_refund'] = Math.round((parseFloat(value[str+'_proportion'])*100)*(parseFloat(value.final_shipping_amount)*100)/10000)/100;
                value.isWholeRefund = false;
            }
        }else{
            if(parseFloat(value[str+'_proportion'])>100){
                value[str+'_refund']=value[str];
                // value[str+'_proportion'] = 100;
                // this.$message.warning('退款金额不能超过当前最大金额，请重新输入正确的退款金额！');
            }else if(parseFloat(value[str+'_proportion'])<=100){
                value[str+'_refund'] = Math.round((parseFloat(value[str+'_proportion'])*100)*(parseFloat(value[str])*100)/10000)/100;
                value.isWholeRefund = false;
            }
        }
        if(parseFloat(value.item_price_amount_refund)==parseFloat(value.item_price)
            &&parseFloat(value.item_tax_amount_refund)==parseFloat(value.item_tax_amount)
            &&parseFloat(value.shipping_discount_amount_refund)==parseFloat(value.final_shipping_amount)
            &&parseFloat(value.shipping_tax_amount_refund)==parseFloat(value.shipping_tax_amount)){
            value.isWholeRefund = true;
        }else{
            value.isWholeRefund = false;
        }
        this.$forceUpdate();
    },
    //全额退款按钮
    handleFullAmount(bool,value,index){
        value.isSubmission = true;
        this.handleRefundSelection(index);
        if(bool){
            value.item_price_amount_refund = value.item_price;
            value.item_tax_amount_refund = value.item_tax_amount;
            value.shipping_discount_amount_refund = value.final_shipping_amount;
            value.shipping_tax_amount_refund = value.shipping_tax_amount;
            value.item_price_amount_proportion = 100;
            value.item_tax_amount_proportion = 100;
            value.shipping_discount_amount_proportion = 100;
            value.shipping_tax_amount_proportion = 100;
        }else{
            value.item_price_amount_refund = 0;
            value.item_tax_amount_refund = 0;
            value.shipping_discount_amount_refund = 0;
            value.shipping_tax_amount_refund = 0;
            value.item_price_amount_proportion = 0;
            value.item_tax_amount_proportion = 0;
            value.shipping_discount_amount_proportion = 0;
            value.shipping_tax_amount_proportion = 0;
        }
    },
    //验证退货单和重寄单的数量
    handleChangeQuantity(str,index){
        let regular = /^\+?[1-9][0-9]*$/
        if(this.addNewAfterSaleListParameter[str][index].issue_quantity==""){
            this.addNewAfterSaleListParameter[str][index].issue_quantity = this.obtainOrderDetails.proDetailsInfo[index].quantity
        }else{
            if(!regular.test(this.addNewAfterSaleListParameter[str][index].issue_quantity)){
                // this.$message.warning('您输入的不符合规则，请输入一个正整数！')
                this.addNewAfterSaleListParameter[str][index].issue_quantity = this.obtainOrderDetails.proDetailsInfo[index].quantity
            }
        }
    },
    //验证重寄金额
    handleProCost(){
        // let regular = /^[0-9]+((\.[0-9][0-9])||\.[0-9])?$/
        // if(!regular.test(this.addNewAfterSaleListParameter.pro_cost)){
        //     this.$message.warning('请输入正数，且只能保留小数点后两位！')
        //     this.addNewAfterSaleListParameter.pro_cost = ''
        // }
    },
    //关闭订单详情大弹窗
    handleCancelOrderInfoPopup(str){
        switch(str){
            case '售后':
                this.AfterSaleTypeShow={
                    refundInformation:false,//退款信息显示隐藏
                    returnInformation:false,//退货信息显示和隐藏
                    reSendInformation:false,//重寄信息显示隐藏
                }
                this.twoLevelLinkageInfo = []
                this.$refs['addNewAfterSaleListParameter'].resetFields();//清空售后单类型选择表单
                break;
            case '客诉':
                if(this.orderInfo.edit){
                    this.isOrderInfo=false;
                    // this.$emit("handleOperationCallBack");
                    return;
                }
                this.registeredCustomerComplaint.detail=[]
                // for (let index = 0; index < this.obtainOrderDetails.proDetailsInfo.length; index++) {
                //     // console.log(this.$refs['file'+index])
                //     this.$refs['file'+index].upload.clearFiles();
                // }
                this.$emit("handleReload");
                this.$refs['registeredCustomerComplaint'].resetFields();//清空客诉单表单
                break;
        }
        this.isOrderInfo=false;
        // this.$emit("handleOperationCallBack");
        this.$emit('handleCancelOrderInfoPopup',false)
    },
    //判断选择弹窗打开时的布局
    handleLoadInfo(val){
        switch(val.operation){
                case 'addNewAfterSaleSingle':
                        this.addNewAfterSaleListParameter.operating_type = "1";
                        this.operationOrderSingle=addNewAfterSaleSingle;
                    break;
                case 'registeredRefundSlip':
                        this.addNewAfterSaleListParameter.operating_type = "2";
                        this.operationOrderSingle=registeredRefundSlip;
                    break;
                case 'registeredRCustomerComplaintSlip':
                        this.operationOrderSingle=registeredRCustomerComplaintSlip;
                        if(this.orderInfo.platform_code=='EB'&&!val.edit){
                            this.registeredCustomerComplaint.is_expedited='0';
                            this.registeredCustomerComplaint.genre = '1';
                        }
                        if(val.edit){
                            let str="";
                            if(this.orderInfo.platform_code=='AMAZON'){
                                str="customer_complaint";
                            }else if(this.orderInfo.platform_code=='EB'){
                                str="ebay_customer_complaint";
                            }
                            this.complaintEditInfo(this.customerComplaintId,str).then(({ data }) => {
                                if (data.status !== 1) {
                                    this.$message.error(data.errorMess || '操作失败')
                                    return;
                                }
                                // if(data.data_list.value.detail.length==0){
                                //     this.registeredCustomerComplaint.detail
                                // }
                                data.data_list.value.complaint_type = data.data_list.value.type;
                                this.registeredCustomerComplaint = data.data_list.value;

                                this.registeredCustomerComplaint.detail.forEach((element,index) => {
                                    if(element.checks=='1'){
                                        element.product = true;
                                    }else{
                                        element.product = false;
                                    }
                                    if(element.img_url==''){
                                        element.img_url = [];
                                    }else{
                                        let files = element.img_url.split(',');
                                        let name = element.img_name.split('<@>');
                                        let arr = [];
                                        files.forEach((e, i) => {
                                            if (i) {
                                                element.img_name += "<@>"+name[i];
                                                element.url += ","+e;
                                            }else{
                                                element.img_name = name[i];
                                                element.url = e;
                                            }
                                            arr.push({
                                                name: name[i],
                                                url: e
                                            });
                                        });
                                        element.img_url = arr;
                                    }
                                });
                            });
                        }
                        console.log(this.registeredCustomerComplaint)
                            this.handleCustomerComplaintInfo();//加载客诉单所需信息
                    break;
                case 'handleOrder':
                        this.operationOrderSingle=handleOrder;
                    break;
                case 'EtidCustomerComplaintSlip':
                        this.operationOrderSingle=EtidCustomerComplaintSlip;
                        let str='';
                        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                            str='customer_complaint';
                        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                            str='ebay_customer_complaint';
                        }
                        this.customerComplaintInfo(this.customerComplaintId,str).then(({ data }) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败')
                                return;
                            }
                            data.data_list.value.detail.forEach((element,index) => {
                                if(element.img_url==''){
                                    element.imgArr = [];
                                }else{
                                    element.img_url = element.img_url.split(',');
                                    element.imgArr = element.img_url.map(e=>data.data_list.value.host+e);
                                }
                            });
                            this.infoCustomerComplaint = data.data_list.value;
                            if(this.infoCustomerComplaint.img_info==''||this.infoCustomerComplaint.img_info=='null'){
                                this.infoCustomerComplaint.img_info = [];
                            }
                            // }else{
                            //     this.infoCustomerComplaint.img_info = this.infoCustomerComplaint.img_info.split(',');
                            // }
                        });
                    break;
                case 'handlePageINR':
                        this.operationOrderSingle=handlePageINR;
                    break;
                case 'handlePageCancel':
                        this.operationOrderSingle=handlePageCancel;
                    break;
                case 'handlePageReturn':
                        this.operationOrderSingle=handlePageReturn;
                    break;
            }
            this.obtainOrderDetails.orderInfo=val;
    },
    handleFeedBackEvent(){
        this.$emit('handleFeedBackEvent',this.obtainOrderDetailsGinseng.order_id);
    },
    handleReviewEvent(){
        this.$emit('handleReviewEvent',this.obtainOrderDetailsGinseng.order_id);
    },
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
        this.$emit('handleAfterSaleList',item.after_sale_id);
    },
    handleDisputeEvent(id){
        this.$emit('handleDisputeEvent',id);
    },
    handleComplaintOrder(id){
        this.$emit('handleComplaintOrder',id);
    },
    handleRefundSelection(index){
        if(this.addNewAfterSaleListParameter.refund[index].isSubmission){
            if(this.selection.indexOf(index)!=-1)return;
            this.selection.push(index);
        }else{
            this.selection.splice(this.selection.indexOf(index),1);
        }
        // this.selection.push(index);
    },
    //客诉单确定
    handleOperateConfirm(){
        let str='';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str='customer_complaint';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str='ebay_customer_complaint';
        }
        this.complaintConfirm({id:this.infoCustomerComplaint.id,},str).then(({data})=>{
            if (!data.status) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }else{
                this.isOrderInfo=false;
                this.$emit("handleOperationCallBack");
                this.$message.success('操作成功！');
                this.$emit('handleQueryInfo');
            }
        }).catch(error=>{})
    },
    //客诉单驳回
    handleOperateReject(){
        let str='';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str='customer_complaint';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str='ebay_customer_complaint';
        }
        this.complaintReject({id:this.infoCustomerComplaint.id},str).then(({data})=>{
            if (!data.status) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }else{
                this.isOrderInfo=false;
                this.$emit("handleOperationCallBack");
                this.$message.success('操作成功！');
                this.$emit('handleQueryInfo');
            }
        }).catch(error=>{})
    },
    //客诉单审核
    handleExamine(num){
        let obj={
            type:num,
            id:this.customerComplaintId.id
        }
        let str='';
        if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
            str='customer_complaint';
        }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
            str='ebay_customer_complaint';
        }
        this.complaintExamine(obj,str).then(({data})=>{
            if (!data.status) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }else{
                this.isOrderInfo=false;
                this.$emit("handleOperationCallBack");
                this.$message.success('操作成功！');
                this.$emit('handleQueryInfo');
            }
        }).catch(error=>{})
    },
    // 点击放大图片
    handleClickImg(url) {
        if (url) {
            this.thumb_url = url;
            this.pop_preview = true
        }
    },
    //获取退货编码
    handleobtainReturnCode(){
        this.obtainReturnCode({order_id:this.obtainOrderDetailsGinseng.order_id}).then(({data})=>{
            if (!data.status) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }else{
                this.obtainOrderDetails.orderDetailsInfo.refund_code = data.data_list.refund_code;
                this.$message.success('操作成功！');
            }
        }).catch(error=>{})
    },
    //获取多条客诉信息
    handleOrderCustomerComplaintInfo(obj){
        this.OrderCustomerComplaintInfo(obj).then(({data})=>{
            if (!data.status) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }
            this.orderDetailsCustomerComplaintInfo = data.data_list==""?{}:data.data_list;
        }).catch(error=>{})
    },
    //售后单修改提交
    handleafterSalesOrderEditSubmission(){
        let obj = {
            department_id:this.addNewAfterSaleListParameter.department_id,
            reason_id:this.addNewAfterSaleListParameter.reason_id,
            remark:this.addNewAfterSaleListParameter.remark,
            type:this.addNewAfterSaleListParameter.type[0],
            after_sale_id:this.afterSalesOrderEditInfo.after_sale_id,
            product_issue: this.addNewAfterSaleListParameter.issue
        };
        if(this.addNewAfterSaleListParameter.type[0]=='1'){
            let commodity = {};
            obj.refund_detail = [];
            let num = 0;
            if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                this.addNewAfterSaleListParameter.refund.forEach(element => {
                    if(element.isSubmission){
                        commodity = {
                            item_id:element.item_id,
                            item_price_amount:element.item_price_amount_refund,
                            item_shipping_amount:element.shipping_discount_amount_refund,
                            item_tax_amount:element.item_tax_amount_refund,
                            reason_code:element.reason_code,
                            shipping_tax_amount:element.shipping_tax_amount_refund||0,
                        }
                        obj.refund_detail.push(commodity);
                    }
                });
                this.addNewAfterSaleListParameter.refund.forEach(element => {
                    if(element.item_price_amount_refund) num+= parseFloat(element.item_price_amount_refund*100);
                    if(element.item_tax_amount_refund) num+= parseFloat(element.item_tax_amount_refund*100);
                    if(element.shipping_discount_amount_refund) num+= parseFloat(element.shipping_discount_amount_refund*100);
                    if(element.shipping_tax_amount_refund) num+= parseFloat(element.shipping_tax_amount_refund*100);
                });
            }else{
                num = this.addNewAfterSaleListParameter.refund_amount;
                if(this.residualRefundAmount<this.addNewAfterSaleListParameter.refund_amount){
                    this.$message.error('退款金额不能超过最大退款金额!');
                    return;
                }
                if(!this.addNewAfterSaleListParameter.issue.length){
                    this.$message.error('请选择问题商品再进行售后操作!');
                    return;
                }
            }
            if(!num){
                this.$message.error('退款金额不能为0!');
                return;
            }
            obj.refund_amount = num;
            obj.refund_remark = this.addNewAfterSaleListParameter.refund_detail;
        }else if(this.addNewAfterSaleListParameter.type[0]=='2'){
            obj.product = this.addNewAfterSaleListParameter.return;
            obj.warehouse_id = this.addNewAfterSaleListParameter.warehouse_id;
            obj.carrier = this.addNewAfterSaleListParameter.carrier;
            obj.tracking_no = this.addNewAfterSaleListParameter.tracking_no;
            obj.rma = this.addNewAfterSaleListParameter.rma;
            obj.refund_code = this.addNewAfterSaleListParameter.refund_code;
            obj.return_remark = this.addNewAfterSaleListParameter.return_remark;
        }else if(this.addNewAfterSaleListParameter.type[0]=='3'){
            obj.product = this.addNewAfterSaleListParameter.redirect;
            obj.redirect_warehouse_id = this.addNewAfterSaleListParameter.redirect_warehouse_id;
            obj.ship_code = this.addNewAfterSaleListParameter.ship_code;
            obj.order_remark = this.addNewAfterSaleListParameter.order_remark;
            obj.print_remark = this.addNewAfterSaleListParameter.print_remark;
            obj.paypal_email = this.addNewAfterSaleListParameter.paypal_email;
            obj.paypal_id = this.addNewAfterSaleListParameter.paypal_id;
            obj.order_amount = this.addNewAfterSaleListParameter.order_amount;
            obj.currency = this.addNewAfterSaleListParameter.currency;
            obj.ship_name = this.addNewAfterSaleListParameter.ship_name;
            obj.ship_street1 = this.addNewAfterSaleListParameter.ship_street1;
            obj.ship_phone = this.addNewAfterSaleListParameter.ship_phone;
            obj.ship_street2 = this.addNewAfterSaleListParameter.ship_street2;
            obj.ship_country = this.addNewAfterSaleListParameter.ship_country;
            obj.ship_stateorprovince = this.addNewAfterSaleListParameter.ship_stateorprovince;
            obj.ship_zip = this.addNewAfterSaleListParameter.ship_zip;
            obj.ship_city_name = this.addNewAfterSaleListParameter.ship_city_name;
        }
         this.$refs['addNewAfterSaleListParameter'].validate((valid) => {
            if (valid) {
                let str='';
                if(this.obtainOrderDetailsGinseng.platform_code==='AMAZON'){
                    str = 'after_sales_order';
                }else if(this.obtainOrderDetailsGinseng.platform_code==='EB'){
                    str = 'ebay_after_sales_order';
                }
                this.afterSalesOrderEditSubmission(obj,str).then(({data})=>{
                    if (!data.status) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }else{
                        this.isOrderInfo=false;
                        this.$emit("handleOperationCallBack");
                        this.$message.success('操作成功');
                        this.$emit("handleEditAfterSaleList")
                    }
                }).catch(error=>{})
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    //eb退款金额计算退款比例
    handleRefundAmount(){
        if(this.addNewAfterSaleListParameter.refund_amount>this.residualRefundAmount){
            this.addNewAfterSaleListParameter.refund_amount = this.residualRefundAmount;
        }
        this.addNewAfterSaleListParameter.refund_ratio = Math.round(parseFloat(this.addNewAfterSaleListParameter.refund_amount)/parseFloat(this.residualRefundAmount)*10000)/100;
    },
    handleRefundRatio(){
        this.addNewAfterSaleListParameter.refund_amount = Math.round((this.addNewAfterSaleListParameter.refund_ratio/100)*parseFloat(this.residualRefundAmount)*100)/100;
    },
    handleIssueOption(bool,item){
        if(bool){
            let judge=true;
            this.addNewAfterSaleListParameter.issue.forEach(element => {
                if(element.sku===item.sku){
                    element.issue_quantity = item.issue_quantity;
                    judge=false;
                }
            });
            if(judge){
                let obj={
                    product_price: item.product_price,
                    sku: item.sku,
                    item_id: item.item_id,
                    product_title: item.product_title,
                    quantity: item.quantity,
                    linelist_cn_name: item.linelist_cn_name,
                    issue_quantity: item.issue_quantity,
                }
                if(item.id)obj.id = item.id;
                this.addNewAfterSaleListParameter.issue.push(obj);
            }
        }else{
            this.addNewAfterSaleListParameter.issue.forEach((element,index) => {
                if(element.sku==item.sku) this.addNewAfterSaleListParameter.issue.splice(index,1);
            });
        }
    },
    //消息联系\批量消息联系
    handleMessageContact(row,str){
        this.activeContactRow=row;
        this.activeContactRow.title = str;
        this.isTemplateChooseShow = true;
    },
    //物流方式二级联动
    handleGetShipCode(id,bool){
        if(bool)this.addNewAfterSaleListParameter.ship_code = '';
        getLogisticsListNew({ship_warehouse:id}).then(({data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess);
                return
            }
            this.ship_code_info = data.data_list.ship_code;
        });
    },
    handle(){
        this.title = this.orderInfo.title;
        this.obtainOrderDetailsGinseng.order_id = this.orderInfo.order_id;
        this.obtainOrderDetailsGinseng.platform_code =  this.orderInfo.platform_code;
        this.currentLoadOrderInfo();//加载当前订单默认信息
        this.handleLoadInfo(this.orderInfo);
        this.isOrderInfo = this.isOrderInfoShow;
    },
    goDispute(obj, bool){
        this.orderInfo = {...obj};
        this.isOrderInfoShow = bool;
        this.handle();
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
      this.handle();
  },
  mounted(){
        //获取当前系统高度，让当前窗口自适应
        let documentHeight = document.body.clientHeight;
        this.$nextTick(()=>{
            this.$refs['orderInformationMainRight'].setAttribute('style','height:'+(documentHeight-290)+'px');
            this.$refs['orderInformationMainLeft'].setAttribute('style','height:'+(documentHeight-290)+'px');
            if(this.orderInfo.operation==='handlePageINR'||this.orderInfo.operation==='handlePageCancel'||this.orderInfo.operation==='handlePageReturn'){
                this.$refs['orderInformationMainRight'].setAttribute('style','height:'+(documentHeight-320)+'px');
                this.$refs['orderInformationMainLeft'].setAttribute('style','height:'+(documentHeight-320)+'px');
            }
        });

  },
  watch:{
        orderInfo: {
            handler(val, old){
                this.orderInfo = val;
            },
            immediate: true,
            deep: true
        },
        isBatchShow(val, old){
            if(!val&&this.closeRefresh){
                this.$emit("handleOperationCallBack");
            }
        },
  }
};
</script>

<style lang="less" scoped>
    .el-collapse-item.headerInfoScrollTop.is-active{
        /deep/.el-collapse-item__header.is-active{
            padding: 0 0 0 10px;
        }
    }
    .reSendInfo{
        /deep/.el-collapse-item__header.is-active{
            padding: 0 0 0 5px;
            font-weight: 400;
            color: #333333;
        }
    }
    /deep/.el-dialog{
            margin-bottom: 0;
    }
    #orderInformationPopup{
        .el-dialog{
            margin-bottom: 0;
            .el-dialog__body{
                background-color: white;
                padding: 0;
                .ui-search-area{
                    .el-form{
                        /deep/.el-form-item.cuslabelheight66 {
                            font-weight: 700;
                            .el-step__title{
                                font-size: 12px;
                            }
                            .el-form-item__label{
                                color: #333333;
                            }
                            .el-step__line{
                                background-color: transparent;
                                border-top:1px dashed #cccccc;
                            }
                            .el-step__line-inner{
                                border:transparent;
                            }
                            /deep/.el-form-item__content{
                                width: 100%;
                                .el-steps.el-steps--horizontal{
                                    .el-step.is-horizontal.is-center{
                                        .el-step__head{
                                            height: 20px;
                                        }
                                    }
                                }
                            }
                            /deep/.el-step.is-center .el-step__description{
                                width: 74px;
                                // padding-left: 20px;
                                // padding-right: 20px;
                                padding: 0;
                                position: absolute;
                                left: 50%;
                                transform: translate(-50%, 0);
                            }
                            /deep/.is-process{
                                color: #409EFF;
                            }
                            /deep/.is-success{
                                color: #409EFF;
                            }
                            /deep/.is-error{
                                color: #F56C6C;
                            }
                        }
                        .cuslabelheightPlatform{
                            /deep/.is-finish{
                                color: #409EFF;
                            }
                            /deep/.is-process{
                                color: #C0C4CC !important;
                            }
                            /deep/.el-step.is-horizontal.is-center{
                                .el-step__main{
                                    .el-step__description{
                                        width: 174px;
                                    }
                                }
                            }
                        }
                    }
                }
                .ui-main-module{
                    // /deep/.ui-search-area{
                    //     border: 1px solid #e6e6e6;
                    // }
                    /deep/.search{
                        border:none;
                        padding: 0;
                    }
                }
            }
        }
    }

    .operationButton{
        margin: 10px 20px;
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

            line-height: 15px;
        }
    }

    .orderInformationMain{
        background-color: white;
        // border: 1px solid #e6e6e6;
        padding: 5px 0px 0px 0px;
        font-size: 12px;
        .orderInformationMainLeft{
            border: 1px solid #EFEFEF;
            padding: 0 0 0 10px;
            margin-right: 10px;
            // height: 572px;
            overflow: auto;
            /deep/.el-input.el-input--small.el-input--suffix{
                line-height: 28px;
            }
            // /deep/.el-form-item.is-error.is-required{
            //         .el-form-item__label{
            //             line-height: 28px;
            //         }
            // }
            .responsibilities{
                /deep/.el-form-item.is-error.is-required{
                    margin-bottom: 0px;
                    .el-form-item__label{
                        line-height: 28px;
                    }
                    .el-form-item__content{
                        line-height: 28px;
                        height: 30px;
                    }
                }
            }
            .refundRemark{
                /deep/.el-form-item{
                    margin-bottom: 0;
                    .el-form-item__label{
                        line-height: 20px;
                    }
                }
            }
            .el-form-item.is-success.is-required{
                margin-bottom: 0;
                line-height: 28px;
                height: 35px;
            }
            .refundInput{
                /deep/.el-form-item.is-success.is-required{
                    height: 28px;
                }
            }
        }
        .orderInformationMainRight{
            border: 1px solid #EFEFEF;
            // height: 600px;
            overflow: auto;
        }
        .orderInformationMainInfo{
            border: 1px solid #e6e6e6;
            border-top: 0 none;
            padding: 10px 10px;
            /deep/.el-input.el-input--mini.el-input--suffix{
                line-height: 28px;
                height: 28px;
            }
            /deep/.el-form-item__content{
                line-height: 28px;
            }
        }
        table{
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
            tr{
                td{
                    border-top: 1px solid #e6e6e6;
                    border-left: 1px solid #e6e6e6;
                    padding: 5px 5px;
                    color: #333333;
                    .el-form-item.is-required{
                        margin: 0;
                        .el-form-item__content{
                            line-height: 28px;
                            height: 28px;
                            .el-input.el-input--mini{
                                width: 100%;
                                margin: 0;
                            }
                        }
                    }
                }
                .tdTitle{
                    background-color: #FAFAFA !important;
                    padding: 5px 5px 5px 10px;
                }
            }
        }
        .orderInfoTitle{
            line-height: 35px;
            font-family: "Microsoft YaHei","微软雅黑";
            font-style: normal;
        }

        .addRemarks{
            width: 500px;
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
        .el-textarea{
            width: 100%;
            max-width:1100px;
        }
        .rowSpacing{
            // padding-bottom: 10px;
            display: flex;
            div{
                margin-right: 10px;
            }
            /deep/.el-form-item__label{
                line-height: 28px;
            }

        }
        .refundRemark{
            /deep/.el-form-item{
                .el-form-item__label{
                    line-height: 15px;
                }
            }
        }
        .rowSpacingObtain{
            /deep/.el-form-item__label{
                line-height: 18px;
            }
            /deep/.el-input.el-input--mini{
                margin-right: 10px;
            }
            .el-form-item__content{
                height: 28px;
            }
            .el-input{
                width: 100%;
                max-width:200px;
            }
            .el-button.el-button--primary.el-button--mini{
                margin: 0;
            }
            padding-bottom:0;
        }
        .returnGoods{
            width: 100%;
            max-width:1100px;
            padding-bottom: 10px;
            justify-content: space-between;
            /deep/.el-form-item__label{
                line-height: 18px;
            }
            /deep/.el-input.el-input--mini {
                width: 188px;
            }
        }
        .reSendInfo{
        //     display: block;
        //     .el-input{
        //         width: 100%;
        //         max-width:1000px;
        //     }
            /deep/.el-form-item__error{
                position: static !important;
            }
        }
        .bottom{
            text-align: center;
            .el-button.el-button--default.el-button--small{
                margin-right: 50px;
            }
        }
    }
    /deep/.afterSaleOrderInfo{
        width: 100%;
        height: auto;
        margin-bottom: 10px;
        font-size: 12px;
        .afterSaleOrderInfoTitle{
            width: 100%;
            height: 30px;
            background-color: #FAFAFA;
            border: 1px solid #E6E6E6;
            text-indent: 2em;
            line-height: 30px;
            font-family: "Microsoft YaHei","微软雅黑";
            font-weight: 700;
            font-style: normal;
            box-sizing: border-box;
        }
    }
    /deep/.el-form-item__label{
        font-size: 12px !important;
    }
    .rollingNavigation{
        width: 73px;
        font-size: 12px;
        font-weight: 700;
        position: absolute;
        top:380px;
        left:230px;
        li{
            padding: 10px;
            // border-right: 1px dashed #A1AAB8;
            cursor: pointer;
        }
        li:hover{
            background-color: #C0C4CC;
        }
    }
    .orderInfoButton{
        padding: 5px 0;
        /deep/#operationOrderButton{
            margin-left: 10px;
        }
    }
    .receivingAddressInfo{
        padding-top: 10px;
        /deep/.el-form-item__content,.el-input.el-input--mini.el-input--suffix{
            line-height: 28px;
            height: 28px;
        }
        /deep/.el-form-item{
            margin: 0;
            .el-form-item__label{
                line-height: 28px;
            }
            .el-select.el-select--mini{
                width:244px !important;
            }
        }
    }
    .logisticsInfo{
        display: flex;
        .el-form-item{
            margin: 0;
            /deep/.el-select.el-select--mini{
                width:100%;
            }
        }
        /deep/.el-form-item__content{
            height:28px;
        }
    }
    .orderDeliverRemarks{
        padding-top: 10px;
        /deep/.el-form-item{
            margin: 0;
            .el-form-item__label{
                line-height: 28px;
            }
            .el-form-item__content{
                .el-input.el-input--mini{
                    width: 100%;
                }
            }
        }
        /deep/.el-form-item:first-child{
            margin-bottom: 10px;
        }
    }
    .addMoneyReSend{
        /deep/.el-form-item{
            margin-bottom: 10px;
            .el-form-item__label{
                line-height: 28px;
            }
        }
        .paypal{
            .el-input.el-input--mini{
                width: 230px;
            }
        }
        .el-button.el-button--primary.el-button--mini{
            margin: 0;
            height: 28px;
        }
        /deep/.moneyWhay{
            width: 100%;
            display: flex;
            .el-form-item{
                width: 100%;
            }
            .el-input.el-input--mini{
                max-width: 193px;
            }
            .el-select.el-select--mini{
                width: 90px;
            }
            .el-input.el-input--mini.el-input--suffix{
                width: 90px;
            }
        }
    }
    .addRemarksInfo{
        /deep/.el-select.el-select--mini{
            width: 100px;
        }
        .addRemarks{
            margin: 0 10px;
        }
        display: flex;
        line-height: 38px;
    }

    /deep/.ui-search-area{
        height:120px;
        .el-form-item__content,.el-step__head.is-process,.el-step__head.is-wait{
            line-height: 32px;
        }
        /deep/.el-step__title,.el-step__description.is-finish{
            line-height: 16px;
            font-size: 12px;
            font-weight: 400;
            padding-bottom: 5px;
        }
        .el-step__icon-inner{
            font-size: 12px;
            display: none;
        }
        .el-step__icon.is-text{
            width: 13px;
            height: 13px;
            bottom: 3px;
            border-color: #C0C4CC;
        }
        /deep/.el-step__title,.el-step__description.is-process{
            color: #C0C4CC;
        }
        .el-form-item.cuslabelheight66{
            height: 70px;
            max-width:1600px;
            margin-bottom: 0;
        }
    }
    /deep/#mainPart{
        overflow: auto;
    }
    .el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition{
        font-size: 12px;
        line-height: 12px;
        .upload-demo{
            margin: 0;
            div{
                margin: 0;
            }
        }
    }
    /deep/.el-step__title{
        font-weight: 400;
    }
    .el-collapse{
        border-bottom: none;
    }
    #operationOrderButton{
        margin-left: 10px;
    }
    .obtainOrderDetailsGinseng{
        /deep/.el-dialog__body{
            height: auto !important;
            background-color: white !important;
            padding: 20px 20px !important;
        }
        // z-index: 5000 !important;
    }
    .country{
        /deep/.el-input.el-input--mini.el-input--suffix{
            width: 244px;
        }
    }
    .customerComplaintHandle{
        .el-form-item.is-required{
            /deep/.el-form-item__label{
                line-height: 35px !important;
            }
        }
    }
    .rowSpacingTable{
        table{
            width: 100%;
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
            tr{
                td{
                    border-top: 1px solid #e6e6e6;
                    border-left: 1px solid #e6e6e6;
                    padding: 5px 5px;
                    color: #333333;
                    /deep/.el-upload-list__item-name{
                        max-width: 300px;
                    }
                }
            }
        }
    }
    .batchRemark{
        /deep/.el-input__count{
            line-height: 15px;
            bottom: 2px;
        }
    }
    .proportion{
        margin: 0 !important;
        /deep/.el-input.el-input--mini{
            width: 130px;
        }
    }
    .el-dialog__wrapper.ui-layout_edit-dialog{
        /deep/.el-dialog__body{
            padding: 5px 20px;
        }
    }
</style>
