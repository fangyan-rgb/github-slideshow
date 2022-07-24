<template>
    <el-form  label-width="110px" :model="addNewAfterSaleListParameter" ref="addNewAfterSaleListParameter"  :rules="mustFill">
        <div class="responsibilities" style="display:flex;">
            <el-form-item  label-width="96px" label="责任所属部门" prop="department_id">
                <el-select size="mini"placeholder="请选择" v-model="addNewAfterSaleListParameter.department_id" @change="twoLevelLinkage(true)">
                        <el-option
                            v-for="item in addNewAfterSalesOrder.department_id"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="详细原因" prop="reason_id">
                <el-select  size="mini" placeholder="请选择" v-model="addNewAfterSaleListParameter.reason_id">
                        <el-option
                            v-for="item in twoLevelLinkageInfo"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="refundRemark">
            <el-form-item label="备注" label-width="100">
                <el-input v-model.trim="addNewAfterSaleListParameter.remark" type="textarea" rows="3" placeholder=""></el-input>
            </el-form-item>
        </div>
        <div>
            <div style="display:flex;">
                <div>
                    <el-form-item label="售后单类型" label-width="83px" prop="type">
                        <template>
                            <el-checkbox-group v-model="addNewAfterSaleListParameter.type">
                                <el-checkbox label="1" @change="handleRefundShow" :disabled="afterSalesOrderEditInfo.edit||obtainOrderDetails.orderDetailsInfo.orderType=='拆分后的子订单'||obtainOrderDetails.orderDetailsInfo.orderType=='合并后的订单'">退款</el-checkbox>
                                <el-checkbox label="2" v-if="operationOrderSingle.refund" @change="handleReturnShow" :disabled="afterSalesOrderEditInfo.edit">退货</el-checkbox>
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
                        <el-input v-model.trim="addNewAfterSaleListParameter.refund_detail" type="textarea" rows="3" placeholder=""></el-input>
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
                        <el-input v-model.trim="addNewAfterSaleListParameter.return_remark" type="textarea" rows="3" placeholder=""></el-input>
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
                                    <el-input style="width:100%" size="mini" placeholder="" v-model.trim="item.sku" @change="handleProErpSku(item.sku,'redirect',index)"/>
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
                                        <el-select v-model="addNewAfterSaleListParameter.ship_country" size="mini" placeholder="请选择">
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
                                <el-select v-model="addNewAfterSaleListParameter.redirect_warehouse_id" size="mini" placeholder="请选择" clearable filterable v-filter>
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
                                            v-for="(item,key,index) in addNewAfterSalesOrder.ship_code"
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
                                            <el-select v-model="addNewAfterSaleListParameter.paypal_email" size="mini" placeholder="请选择">
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
</template>
<script>
import * as storage from '@/utils/storage';
import routerConfig from '@/router/routerConfig';
import {
        addNewRefundInfo,
        afterSalesOrderEditSubmission,
        proErpSku,
        proErpAftersalesSku,
        rmaObtain,
        returnCodeObtain,
        searchPaypalTransactionInfo,
        getAllowRefundAmount,
        addNewAfterSales,
        ebayAfterSalesRefund,
    } from '../../../../api/orderInfo/componentjs';
import * as math from 'mathjs';
import {getSessionStorage} from '@/utils/storage';
import http from '@/http/index.js';


export default {
    name: "NewAfterSalesOrders",
    props: {
        obtainOrderDetails: {//获取当前订单的详细信息
            type: Object,
            default: {}
        },
        afterSalesOrderEditInfo:{//售后单信息
            type:Object,
            default() {
                    return {}
                }
        },
        operationOrderSingle: {
            type: Object,
            default: {}
        },
        obtainOrderDetailsGinseng: {
            type: Object,
            default: {}
        },
        addNewAfterSaleListParameterInfo: {
            type: Object,
            default: {}
        },
        isAfterSalesOrderEditSubmission: {
            type: Boolean,
            default: false
        },
        parameter: {
            type: Object,
            default: {}
        },
        addNewAfterSalesOrderInfo:{
            type: Object,
            default: {}
        },
        isAddNewAfterSales: {
            type: Boolean,
            default: false
        },
        AfterSaleType:{
            type: Object,
            default: {}
        },
    },
    data() {
        return {
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
                exchange_rate:'',//汇率
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
            },
            afterSaleListOption:{},//新建售后单下拉选项
            addNewAfterSalesOrder:{},//新鲜售后单所需信息
            platformReasons:{
                CustomerCancel:'CustomerCancel',
                GeneralAdjustment:'GeneralAdjustment',
            },
            twoLevelLinkageInfo:[],//二级联动信息
            moneyWhayCurrency:['USD','CNY','EUR'],//货币币种
            AfterSaleTypeShow:{
                refundInformation:false,//退款信息显示隐藏
                returnInformation:false,//退货信息显示和隐藏
                reSendInformation:false,//重寄信息显示隐藏
            },
            mustFill: {
                department_id: [{required: true,message: '请选择责任所属部门',trigger: 'blur'}],
                reason_id: [{required: true,message: '请选择详细原因',trigger: 'blur'}],
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
            selection:[],//存储下标的数组

        }
    },
    methods: {
        //二级联动
        twoLevelLinkage(bool){
            if(bool)this.addNewAfterSaleListParameter.reason_id='';
            for(let i=0;i<this.addNewAfterSalesOrder.department_id.length;i++){
                if(this.addNewAfterSalesOrder.department_id[i].id==this.addNewAfterSaleListParameter.department_id){
                    this.twoLevelLinkageInfo = this.addNewAfterSalesOrder.department_id[i].child
                }
            }
        },
        //售后单修改提交
        handleafterSalesOrderEditSubmission(){
            let obj = {
                department_id:this.addNewAfterSaleListParameter.department_id,
                reason_id:this.addNewAfterSaleListParameter.reason_id,
                remark:this.addNewAfterSaleListParameter.remark,
                type:this.addNewAfterSaleListParameter.type[0],
                after_sale_id:this.afterSalesOrderEditInfo.after_sale_id
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
                    afterSalesOrderEditSubmission(obj,str).then(({data})=>{
                        if (!data.status) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }else{
                            this.$message.success('操作成功！');
                            this.$emit("handleEditAfterSaleList");
                            this.$emit("handleCancelOrderInfoPopup");
                            this.$emit("succeedCallBack",data);
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
        //sku获取产品信息接口
        handleProErpSku(sku,order, i){
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
                proErpSku(obj).then(({ data }) => {
                    if (data.status) {
                        this.skuInfo = data.data_list;
                        this.$forceUpdate();
                        this.$message.success('操作成功！');
                    } else {
                        this.$message.error(data.errorMess || '操作失败！');
                    }
                })
            }else{
                proErpAftersalesSku(obj).then(({ data }) => {
                    if (data.status) {
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
            rmaObtain(obj).then(({ data}) => {
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
        //获取退货编码
        handleReturnCodeObtain(){
            let obj={
                order_id:this.obtainOrderDetailsGinseng.order_id
            }
            returnCodeObtain(obj).then(({ data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '查询失败')
                    return;
                }
                    this.addNewAfterSaleListParameter.refund_code=data.data_list;
            }).catch(err => {})
        },
        //搜索paypal交易号
        searchPaypal(){
            let obj={
                transaction_id:this.addNewAfterSaleListParameter.paypal_id,
                platform_code:this.obtainOrderDetailsGinseng.platform_code,
            }
            searchPaypalTransactionInfo(obj).then(({ data }) => {
                if (data.status) {
                    this.addNewAfterSaleListParameter.transaction_id = data.data_list.transaction_id//交易ID
                    this.addNewAfterSaleListParameter.paytime = data.data_list.paytime//交易时间
                    this.addNewAfterSaleListParameter.amt = data.data_list.amt//交易金额
                    this.addNewAfterSaleListParameter.payment_status = data.data_list.payment_status//付款状态
                    this.addNewAfterSaleListParameter.fee_amt = data.data_list.fee_amt//交易佣金
                    this.addNewAfterSaleListParameter.payer_email = data.data_list.payer_email//付款账号
                    this.addNewAfterSaleListParameter.receiver_email = data.data_list.receiver_email//收款账号
                    this.$message.success('操作成功！');
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            })
        },
        //验证重寄金额
        handleProCost(){
            // let regular = /^[0-9]+((\.[0-9][0-9])||\.[0-9])?$/
            // if(!regular.test(this.addNewAfterSaleListParameter.pro_cost)){
            //     this.$message.warning('请输入正数，且只能保留小数点后两位！')
            //     this.addNewAfterSaleListParameter.pro_cost = ''
            // }
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
                    addNewRefundInfo(obj).then(({ data }) => {
                        if(!data.status){
                            this.addNewAfterSaleListParameter.type.splice(this.addNewAfterSaleListParameter.type.indexOf('1'),1);
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.AfterSaleTypeShow.refundInformation=true;
                        // data={};
                        // data={
                        //     "data_list": [{
                        //         asin: "B07P96S8NF",
                        //         cn_title: "500W像素高清防水红外防爆AHD半球摄像机（NTSC制式）",
                        //         en_title: "ドームカメラ ホームセキュリティ監視カメラ フルHD 5MP IPホーム 監視用CCTVカメラ 防水IP66 15個IR LED、20メーター ナイトビジョン、モーション検知、デジタルノイズリダクション",
                        //         id: 14486211,
                        //         item_currency_code: "JPY",
                        //         item_id: "67257069531142",
                        //         item_price_amount: 149220,
                        //         item_shipping_amount: 0,
                        //         item_shipping_currency_code: "",
                        //         item_tax_amount: 11940,
                        //         item_tax_currency_code: "JPY",
                        //         order_id: "AM190906025920",
                        //         promotion_discount_amount: 0,
                        //         promotion_discount_currency_code: "JPY",
                        //         promotion_id: "",
                        //         qty_ordered: 30,
                        //         qty_shipped: 0,
                        //         seller_sku: "GSMLKJ-AF01213hY5F2Pg",
                        //         shipping_discount_amount: 0,
                        //         shipping_discount_currency_code: "",
                        //         shipping_tax_amount: 0,
                        //         shipping_tax_currency_code: "",
                        //         type: 0
                        //     }]
                        // };
                        data.data_list.forEach(element => {
                            if(element.item_price_amount===''||element.item_price_amount===null||element.promotion_discount_amount===''||element.promotion_discount_amount===null||parseFloat(element.promotion_discount_amount)>parseFloat(element.item_price_amount)){
                                element.item_price = 0;
                            }else{
                                element.item_price = (element.item_price_amount*100-element.promotion_discount_amount*100)/100;
                            }
                            if(element.item_shipping_amount===''||element.item_shipping_amount===null||element.shipping_discount_amount===''||element.shipping_discount_amount===null||parseFloat(element.shipping_discount_amount)>parseFloat(element.item_shipping_amount)){
                                element.final_shipping_amount = 0;
                            }else{
                                element.final_shipping_amount = (element.item_shipping_amount*100-element.shipping_discount_amount*100)/100;
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
                    getAllowRefundAmount({order_id:this.obtainOrderDetails.orderDetailsInfo.order_id}).then(({ data }) => {
                        if(!data.status){
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.AfterSaleTypeShow.refundInformation=true;
                        this.residualRefundAmount = (parseFloat(this.obtainOrderDetails.orderDetailsInfo.total_price)*100-(parseFloat(data.data_list.amount)*100))/100;
                    });
                    this.addNewAfterSaleListParameter.refund_amount = refund_detail.refund_amount;
                    this.addNewAfterSaleListParameter.refund_ratio = refund_detail.refund_rate;
                    console.log('123',refund_detail);
                }
            }
        },
        //退货单显示隐藏
        handleReturnShow(){
            if(this.addNewAfterSaleListParameter.type.indexOf('2')===-1){
                this.AfterSaleTypeShow.returnInformation=false
            }else{
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
            }
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
                }
                for (const key in this.addNewAfterSalesOrder.ship_country) {
                    if(key==this.addNewAfterSaleListParameter.ship_country)this.addNewAfterSaleListParameter.ship_country_name = this.addNewAfterSalesOrder.ship_country[key];
                }
                this.addNewAfterSaleListParameter.order_id = this.obtainOrderDetailsGinseng.order_id;
                this.addNewAfterSaleListParameter.platform_code = this.obtainOrderDetailsGinseng.platform_code;
                this.addNewAfterSaleListParameter.buyer_mail = this.obtainOrderDetails.orderDetailsInfo.email;
                this.addNewAfterSaleListParameter.buyer_id = this.obtainOrderDetails.orderDetailsInfo.buyer_id;
                this.addNewAfterSaleListParameter.account_id = this.obtainOrderDetails.orderDetailsInfo.account_id;
                this.addNewAfterSaleListParameter.order_type = this.obtainOrderDetails.orderDetailsInfo.order_type;
                this.addNewAfterSaleListParameter.refund_type = this.addNewAfterSaleListParameter.refund_type?2:1;
                this.addNewAfterSaleListParameter.exchange_rate = this.obtainOrderDetails.profitDetailsInfo.rate||'';
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
                            this.closeRefresh = true;
                            this.$emit("succeedCallBack",data);
                            this.$emit("handleCancelOrderInfoPopup");
                            this.AfterSaleTypeShow.refundInformation=false;
                            this.AfterSaleTypeShow.returnInformation=false;
                            this.AfterSaleTypeShow.reSendInformation=false;
                        })
                    }else{
                        addNewAfterSales(obj,str).then(({ data }) => {
                            if(!data.status){
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }
                            this.closeRefresh = true;
                            this.$emit("succeedCallBack",data);                            
                            this.$emit("handleCancelOrderInfoPopup");
                            this.AfterSaleTypeShow.refundInformation=false;
                            this.AfterSaleTypeShow.returnInformation=false;
                            this.AfterSaleTypeShow.reSendInformation=false;
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleCurrentLoadOrderInfo(){
            this.addNewAfterSaleListParameter={...this.addNewAfterSaleListParameterInfo};
            this.addNewAfterSalesOrder={...this.addNewAfterSalesOrderInfo};
            this.AfterSaleTypeShow={...this.AfterSaleType};
            this.RegisteredReceivablesInfo={...this.RegisteredReceivables};
            this.order={...this.orderInfo};
            this.sendRegisteredReceivablesInfo={...this.sendRegisteredReceivables};
        },
        
        handleAfterSaleList(item){
            this.$router.push({path:'/AfterSalesOrderManagement',query:{after_order_number: item.after_sale_id, _cacheType:'1'}});
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
            this.$emit('handleAfterSaleList',item.after_sale_id);
        },
    },
    watch:{
        // addNewAfterSalesOrderInfo:{
        //     handler(o, n) {
        //         this.addNewAfterSalesOrder={...this.addNewAfterSalesOrderInfo};
        //         setTimeout(()=>{
        //             this.twoLevelLinkage();
        //         },500);
        //     },deep: true
        // },
        obtainOrderDetails(){
            this.sendRegisteredReceivablesInfo={...this.sendRegisteredReceivables};
        },
        orderInfo(){
            this.order={...this.orderInfo};
        },
        RegisteredReceivables(){
            this.RegisteredReceivablesInfo={...this.RegisteredReceivables};
        },
        addNewAfterSaleListParameterInfo:{
            handler(o, n) {
                setTimeout(()=>{
                    this.addNewAfterSalesOrder={...this.addNewAfterSalesOrder,...this.addNewAfterSalesOrderInfo};
                },1000);
                let obj = {...this.addNewAfterSaleListParameterInfo};
                if(this.afterSalesOrderEditInfo.edit){
                    this.addNewAfterSaleListParameter={...this.addNewAfterSaleListParameter,...obj};
                }else{
                    this.addNewAfterSaleListParameter={...obj,...this.addNewAfterSaleListParameter};
                }
                console.log('this.addNewAfterSaleListParameter',this.addNewAfterSaleListParameter);
                setTimeout(()=>{
                    this.twoLevelLinkage();
                },500);
            },deep: true
        },
        isAfterSalesOrderEditSubmission(){
            this.handleafterSalesOrderEditSubmission();
        },
        parameter(){
            this.handleRefundShow(this.parameter);
        },
        isAddNewAfterSales(){
            this.handleAddNewAfterSales();
        },
        // AfterSaleType(){

        //     this.AfterSaleTypeShow={...this.AfterSaleType};
        // },
        AfterSaleType:{
            handler(o, n) {
                this.AfterSaleTypeShow={...this.AfterSaleType};
            },deep: true
        },
        
    },
    created(){
        setTimeout(()=>{
            this.addNewAfterSaleListParameter={...this.addNewAfterSaleListParameter,...this.addNewAfterSaleListParameterInfo};
            this.addNewAfterSalesOrder={...this.addNewAfterSalesOrderInfo};
        },1000);
        
        this.AfterSaleTypeShow={...this.AfterSaleType};
        this.RegisteredReceivablesInfo={...this.RegisteredReceivables};
        this.order={...this.orderInfo};
        this.sendRegisteredReceivablesInfo={...this.sendRegisteredReceivables};;
    },
    
};
</script>
<style lang="less" scoped>
.el-input.el-input--small.el-input--suffix{
    line-height: 28px;
}
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
.refundRemark{
    /deep/.el-form-item{
        .el-form-item__label{
            line-height: 15px;
        }
    }
}
.afterSaleOrderInfo{
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
.el-collapse-item.headerInfoScrollTop.is-active{
    /deep/.el-collapse-item__header.is-active{
        padding: 0 0 0 10px;
    }
}
.rowSpacing{
    display: flex;
    div{
        margin-right: 10px;
    }
    /deep/.el-form-item__label{
        line-height: 28px;
    }
}
.proportion{
    margin: 0 !important;
    /deep/.el-input.el-input--mini{
        width: 130px;
    }
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
.reSendInfo{
    /deep/.el-form-item__error{
        position: static !important;
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
.country{
    /deep/.el-input.el-input--mini.el-input--suffix{
        width: 244px;
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
    }
}
</style>