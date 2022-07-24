<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px" :rules="disputeRules">
            <!-- INR -->
            <div v-if="orderInfo.operation==='handlePageINR'">
                <table cellspacing="0" cellpadding="0" class="disputeInfo">
                    <tr>
                        <td colspan="6">
                            <div style="display:flex;line-height: 24px;">
                                <div style="font-weight: 700;">纠纷信息</div>
                                <!-- <div style="color: white;position: relative;padding:0 5px;margin-right:50px;">
                                    <div style="z-index: 1;position: relative;left:15px;line-height: 24px;">过去一年</div>
                                    <div class="timePast"></div>
                                </div> -->
                                <div style="display:flex;color:#FD3F40;">
                                    <div style="margin-left:10px;">未解决纠纷比例：<span>{{disputeInfo.unresolved_rate}}</span></div>
                                    <div style="margin-left:10px;">回复剩余时间：<span>{{disputeInfo.remaining_time}}</span></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Inquiry ID</td>
                        <td>{{disputeInfo.inquiry_id}}</td>
                        <td>状态</td>
                        <td>{{disputeInfo.status}}</td>
                        <td>创建时间</td>
                        <td>{{disputeInfo.creation_date}}</td>
                    </tr>
                    <tr>
                        <td>售后单号</td>
                        <td>{{disputeInfo.after_sale_id}}</td>
                        <td>买家最初期望退款金额</td>
                        <td><span style="color: #f90; font-weight: bold;">{{disputeInfo.buyer_init_expect_refund_amt}} ({{disputeInfo.currency}})</span></td>
                        <td>卖家发放退款金额</td>
                        <td><span style="color: #f90; font-weight: bold;">{{disputeInfo.refund_amount}} ({{disputeInfo.currency}})</span></td>
                    </tr>
                    <tr>
                        <td>买家期望</td>
                        <td colspan="5">{{disputeInfo.buyer_initial_expected_resolution}}</td>
                    </tr>
                </table>
                <el-form-item label="自动退款:" prop="auto_refund" >
                    <el-radio label="0" v-model="form.auto_refund" @change="handleInquirySetAutoRefund">是</el-radio>
                    <el-radio label="1" v-model="form.auto_refund" @change="handleInquirySetAutoRefund">否</el-radio>
                </el-form-item>
                <div>
                    <span style="font-weight: 700;">互动记录</span>&nbsp;&nbsp;&nbsp;
                    <span v-if="disputeInfo.message_id"><el-button style="font-size:12px;" type="text" @click="goEbMessagejump(disputeInfo.order_id)">查看站内信记录</el-button></span>
                    <span v-else>无</span>
                </div>
                <div style="font-weight: 700;">沟通记录：</div>
                <div class="overflowProcessing">
                    <table cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="100" style="background: #FAFAFA;width:139px;">处理人</td>
                            <td width="200" style="background: #FAFAFA;width:256px;">处理时间</td>
                            <td width="300" style="background: #FAFAFA;width:379px;">处理内容</td>
                        </tr>
                        <tr>
                            <td style="border:none;padding:0;" colspan="3">
                                <table cellspacing="0" cellpadding="0" style="width:100%" v-for="(item,index) in disputeInfo.process_list">
                                    <tr :style="item.actor=='SYSTEM'?'background: rgba(255, 153, 0, 0.4);':item.actor=='BUYER'?'background: rgba(112, 182, 251, .4);':'background: rgba(82, 198, 137, .4);'">                                
                                        <td style="width:139px;"><div v-html="item.actor"></div></td>
                                        <td style="width:256px;"><div v-html="item.date"></div></td>
                                        <td style="width:379px;"><div v-html="item.action"></div></td>
                                    </tr>
                                    <tr v-if="item.description">
                                        <td>留言</td>
                                        <td colspan="2"><span v-html="item.description"></span><span style="cursor: pointer;color: #409EFF;" @click="handelTranslate(index,'description')" v-if="!item.translate">点击翻译</span></td>
                                    </tr>
                                    <tr v-if="item.translate">
                                        <td>英文</td>
                                        <td colspan="2"><span v-html="item.translate"></span></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="font-weight: 700;margin:10px 0px 0px;">问题产品:</div>
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="50" style="background: #FAFAFA;">操作</td>
                        <td width="300" style="background: #FAFAFA;">SKU</td>
                        <td width="200" style="background: #FAFAFA;">数量</td>
                    </tr>
                    <tr v-for="item in disputeInfo.product_list">
                        <td style="text-align:center;">
                            <el-checkbox checked @change="(bool)=>handleProDetailsOption(bool,item)"></el-checkbox>
                        </td>
                        <td>{{item.sku}}</td>
                        <td>
                            <el-input-number v-model="item.inquiry_quantity" @change="handleProDetailsOption(true,item)" size="mini" :min="1" :precision="0"></el-input-number>
                        </td>
                    </tr>
                </table>
                <el-form-item label="操作:" prop="option">
                    <el-radio-group v-model="form.option">
                        <el-radio label="2" @change="handleRefund">全额退款</el-radio>
                        <el-radio label="提供发货信息"></el-radio>
                        <el-radio label="升级" @change="handleGetEscalateReasonInfo"></el-radio>
                        <el-radio label="发送留言" @change="handleSendMessage"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="option" v-if="form.option">
                    <!-- 全额退款 -->
                    <div class="refund" v-if="form.option=='2'">
                        <div style="font-weight:700px;line-height:30px;border-bottom:1px solid #e6e6e6;font-size:14px;">全额退款</div>
                        <div style="display:flex;">
                            <div>
                                <!-- <el-form-item label="责任归属部门:" label-width="95px" prop="department_id"> -->
                                <el-form-item label="不良类型:" label-width="95px" prop="department_id">
                                    <el-select size="mini" v-model="form.department_id" @change="twoLevelLinkage">
                                        <el-option
                                            v-for="item in refundInfo.department_id"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <!-- <el-form-item label="退款原因:" prop="reason_id"> -->
                                <el-form-item label="不良原因:" prop="reason_id">
                                    <el-select size="mini" v-model="form.reason_id" @change="reasonChange">
                                        <el-option
                                            v-for="item in twoLevelLinkageInfo"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div>
                            <el-form-item label="不良原因说明" label-width="95px">
                                <el-input v-model="form.descriptionAdverseCauses" style="width:576px;" type="textarea" rows="2" disabled></el-input>
                            </el-form-item>
                        </div>
                        <div style="display:flex;">
                            <div style="margin-right:20px;">
                                <el-form-item prop="" label="退款金额：">
                                    <!-- <el-input-number size="mini" controls-position="right" style="width:240px;" :min="0" :precision="2"
                                            v-model="addNewAfterSaleListParameter.refund_amount" @change="handleRefundAmount"/> -->
                                    <div>{{refundAmountMax}}</div>
                                </el-form-item>
                            </div>
                            <div style="margin-right:20px;">
                                <el-form-item label="退款比例：">
                                    <!-- <el-input-number size="mini" controls-position="right" style="width:240px;" :min="0" :max="100" :precision="2"
                                            v-model="addNewAfterSaleListParameter.refund_ratio" @change="handleRefundRatio"/>% -->
                                        <div>100%</div>
                                </el-form-item>
                            </div>
                            <el-form-item label="最大退款金额：" label-width="100px">
                                <!-- <div style="font-size:12px;color:#333;">{{residualRefundAmount}} {{obtainOrderDetails.orderDetailsInfo.currency}}</div> -->
                                <div>{{refundAmountMax}}</div>
                            </el-form-item>
                        </div>
                        <el-form-item label="原因备注：">
                            <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入内容,不能超过5000个字符" maxlength="5000" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    <!-- 提供发货信息 -->
                    <div class="deliverGoodsInfo" v-if="form.option=='提供发货信息'">
                        <div style="font-weight:700px;line-height:30px;border-bottom:1px solid #e6e6e6;font-size:14px;">提供发货信息</div>
                        <div style="display:flex;">
                            <div>
                                <el-form-item label="承运人:" prop="shipping_carrier_name">
                                    <el-input type="text" size="mini" placeholder="请输入内容" v-model="form.shipping_carrier_name"></el-input>
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="发货时间:" prop="shipping_date">
                                    <el-date-picker v-model="form.shipping_date" type="datetime" size="mini" placeholder="选择日期时间"></el-date-picker>
                                </el-form-item>
                            </div>
                        </div>
                        <el-form-item label="跟踪号:" prop="tracking_number">
                            <el-input type="text" size="mini" placeholder="请输入内容" v-model="form.tracking_number"></el-input>
                        </el-form-item>
                    </div>
                    <!-- 升级 -->
                    <div class="upgrade" v-if="form.option=='升级'">
                        <el-form-item label="原因:" prop="escalation_reason">
                            <el-select size="mini" v-model="form.escalation_reason">
                                <el-option
                                    v-for="(value,key) in escalateReasonInfo"
                                    :key="key"
                                    :label="value"
                                    :value="key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <!-- 发送留言 -->
                    <div class="sendMessage" v-if="form.option=='发送留言'">
                        <div style="display:flex;">
                            <div>
                                <el-form-item label="模板选择：" prop="">
                                    <el-select placeholder="请选择" size="mini" clearable v-model="form.templateChoose" filterable v-filter @change="handleSelectionTemplate()">
                                        <el-option v-for="(value, key, index) in dataComment.template"
                                                :label="value"
                                                :value="key"
                                                :key="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <div style="padding: 4px 0 0 10px;">
                                    <TemplateEdit :platform="'EB'" class="templateChange" @selectTemplate="templateChange" />
                                </div>
                            </div>
                        </div>
                        <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" :list="dataComment.google_lang_code"></ComSelectLanguageV2>
                        <el-form-item :label="isTranslate?'翻译前':'正文'" prop="content">
                            <el-input size="small" type="textarea" v-model="form.content" :rows="isTranslate?8:16" placeholder="请输入内容,不能超过5000个字符" maxlength="5000" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="翻译后" v-if="isTranslate">
                            <el-input size="small" type="textarea" v-model="form.content_en" rows="8" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="留言：" v-if="form.option!='发送留言'">
                        <el-input type="textarea" :rows="3" v-model="form.leavingMessage" placeholder="请输入内容,不能超过5000个字符" maxlength="5000" show-word-limit></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- Cancel -->
            <div v-if="orderInfo.operation==='handlePageCancel'">
                <table cellspacing="0" cellpadding="0" class="disputeInfo">
                    <tr>
                        <td colspan="6">
                            <div style="display:flex;line-height: 24px;">
                                <div style="font-weight: 700;">纠纷信息</div>
                                <div style="margin-left:10px;color:#FD3F40;">回复剩余时间：<span>{{disputeInfo.remain_time?disputeInfo.remain_time.substring(0,1)=='-'?'已超时':disputeInfo.remain_time:''}}</span></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Cancel ID</td>
                        <td>{{disputeInfo.cancel_id}}</td>
                        <td>状况</td>
                        <td>{{disputeInfo.cancel_state}}</td>
                        <td>原因</td>
                        <td>{{disputeInfo.cancel_reason}}</td>
                    </tr>
                    <tr>
                        <td>售后单号</td>
                        <td>
                            <div v-if="!disputeInfo.after_sales_id||!disputeInfo.after_sales_id.length">无售后</div>
                            <div v-if="disputeInfo.after_sales_id&&disputeInfo.after_sales_id.length">
                                <el-popover placement="right" trigger="hover" width="auto" popper-class="afterId">
                                    <table cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>序号</td>
                                            <td>售后单号</td>
                                        </tr>
                                        <tr v-for="(item,index) in disputeInfo.after_sales_id">
                                            <td>{{index+1}}</td>
                                            <td>
                                                <div v-for="item in disputeInfo.after_sales_id"
                                                    style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleAfterSaleList(item)">{{item}}
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="cursor: pointer;color: #409EFF;margin-left:3px;" slot="reference" v-if="disputeInfo.after_sales_id.length">
                                        {{disputeInfo.after_sales_id[0]}}
                                    </div>
                                </el-popover>
                            </div>
                        </td>
                        <td>发起时间</td>
                        <td>{{disputeInfo.cancel_request_date}}</td>
                        <td>是否有站内信</td>
                        <td>
                            <div v-if="disputeInfo.is_message" style="cursor: pointer;color: #409EFF;" @click="goEbMessagejump(disputeInfo.order_id)">查看站内信记录</div>
                            <div v-else>无</div>
                        </td>
                    </tr>
                </table>
                <div style="font-weight: 700;margin:10px 0;">处理过程：</div>
                <div class="overflowProcessing">
                    <table cellspacing="0" cellpadding="0" class="overflowProcessing">
                        <tr>
                            <td width="100" style="background: #FAFAFA;">处理人</td>
                            <td width="200" style="background: #FAFAFA;">处理时间</td>
                            <td width="300" style="background: #FAFAFA;">处理内容</td>
                        </tr>
                        <tr v-for="item in disputeInfo.response">
                            <td><div v-html="item.create_by"></div></td>
                            <td><div v-html="item.create_time"></div></td>
                            <td><div v-html="item.type"></div></td>
                        </tr>
                    </table>
                </div>
                <el-form-item label="操作:" prop="option">
                        <el-radio label="接受"  v-model="form.option" :disabled="disputeInfo.initiator==='SELLER'||(disputeInfo.status==='CANCEL_CLOSED_FOR_COMMITMENT'||disputeInfo.status==='CANCEL_CLOSED_NO_REFUND'||disputeInfo.status==='CANCEL_CLOSED_UNKNOWN_REFUND'||disputeInfo.status==='CANCEL_REJECTED'||disputeInfo.status==='CANCEL_CLOSED_WITH_REFUND')"></el-radio>
                        <el-radio label="拒绝"  v-model="form.option" :disabled="disputeInfo.initiator==='SELLER'||(disputeInfo.status==='CANCEL_CLOSED_FOR_COMMITMENT'||disputeInfo.status==='CANCEL_CLOSED_NO_REFUND'||disputeInfo.status==='CANCEL_CLOSED_UNKNOWN_REFUND'||disputeInfo.status==='CANCEL_REJECTED'||disputeInfo.status==='CANCEL_CLOSED_WITH_REFUND')"></el-radio>
                </el-form-item>
                <div v-if="form.option">
                    <div v-if="form.option==='接受'">
                        <el-form-item label="备注：" prop="leavingMessage">
                            <el-input type="textarea" :rows="3" v-model="form.leavingMessage" placeholder="请输入内容,不能超过500个字符" maxlength="500" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    <div style="display:flex;" v-if="form.option==='拒绝'">
                        <div>
                            <el-form-item label="发货时间:" prop="shipping_date">
                                <el-date-picker v-model="form.shipping_date" type="datetime" size="mini" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label="跟踪号:" prop="tracking_number">
                                <el-input type="text" size="mini" placeholder="请输入内容" v-model="form.tracking_number"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Return -->
            <div v-if="orderInfo.operation==='handlePageReturn'">
                <table cellspacing="0" cellpadding="0" class="disputeInfo">
                    <tr>
                        <td colspan="6">
                            <div style="display:flex;line-height: 24px;">
                                <div style="font-weight: 700;">纠纷信息</div>
                                <!-- <div style="color: white;position: relative;padding:0 5px;margin-right:50px;">
                                    <div style="z-index: 1;position: relative;left:15px;line-height: 24px;">过去一年</div>
                                    <div class="timePast"></div>
                                </div> -->
                                <div style="display:flex;color:#FD3F40;">
                                    <div style="margin-left:10px;">未解决纠纷比例：<span>{{disputeInfo.unresolved_rate}}</span></div>
                                    <div style="margin-left:10px;">回复剩余时间：<span>{{disputeInfo.remaining_time}}</span></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Return ID</td>
                        <td>{{disputeInfo.return_id}}</td>
                        <td>状态</td>
                        <td>{{disputeInfo.status}}</td>
                        <td>原因</td>
                        <td>{{disputeInfo.return_reason}}</td>
                    </tr>
                    <tr>
                        <td>创建时间</td>
                        <td>{{disputeInfo.return_creation_date}}</td>
                        <td>买家估计退款金额</td>
                        <td><span style="color: #f90; font-weight: bold;">{{disputeInfo.buyer_estimated_refund_amount}} ({{disputeInfo.currency}})</span></td>
                        <td>实际退款金额</td>
                        <td><span style="color: #f90; font-weight: bold;">{{disputeInfo.actual_refund_amount}} ({{disputeInfo.currency}})</span></td>
                    </tr>
                    <tr>
                        <td>买家期望</td>
                        <td colspan="5">{{disputeInfo.current_type}}</td>
                    </tr>
                    <tr>
                        <td>留言</td>
                        <td colspan="5">{{disputeInfo.return_comments}}</td>
                    </tr>
                    <tr>
                        <td>卖家地址</td></td>
                        <td colspan="5">{{disputeInfo.seller_address}}</td>
                    </tr>
                </table>
                <el-form-item label="自动退款:" prop="auto_refund" >
                        <el-radio label="0" v-model="form.auto_refund" @change="handleReturnSetAutoRefund">是</el-radio>
                        <el-radio label="1" v-model="form.auto_refund" @change="handleReturnSetAutoRefund">否</el-radio>
                </el-form-item>
                <div style="font-weight: 700;">沟通记录：</div>
                <div class="overflowProcessing">
                    <table cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="100" style="background: #FAFAFA;width:139px;">处理人</td>
                            <td width="200" style="background: #FAFAFA;width:256px;">处理时间</td>
                            <td width="300" style="background: #FAFAFA;width:379px;">处理内容</td>
                        </tr>
                        <tr>
                            <td style="border:none;padding:0;" colspan="3">
                                <table cellspacing="0" cellpadding="0" style="width:100%" v-for="(item,index) in disputeInfo.process_list">
                                    <tr :style="item.author=='SYSTEM'?'background:  rgba(255, 153, 0, 0.4);':item.author=='BUYER'?'background: rgba(112, 182, 251, .4);':'background: rgba(82, 198, 137, .4);'">
                                        <td style="width:139px;"><div v-html="item.author"></div></td>
                                        <td style="width:256px;"><div v-html="item.creation_date_value"></div></td>
                                        <td style="width:379px;"><div v-html="item.activity"></div></td>
                                    </tr>
                                    <tr v-if="item.notes">
                                        <td>留言</td>
                                        <td colspan="2"><span v-html="item.notes"></span><span style="cursor: pointer;color: #409EFF;" @click="handelTranslate(index,'notes')" v-if="!item.translate">点击翻译</span></td>
                                    </tr>
                                    <tr v-if="item.translate">
                                        <td>英文</td>
                                        <td colspan="2"><span v-html="item.translate"></span></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr v-for="item in disputeInfo.img_list">
                            <td colspan="3">
                                <div>
                                    <span>图片上传方：</span> &nbsp;
                                    <span>{{item.uploader}}</span> &nbsp;&nbsp;
                                    <span>{{item.upload_time}}</span>
                                    <div>
                                        <img :src="item.small_img" @click="handleClickImg(item.big_img)" width="100px"/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="font-weight: 700;margin:10px 0px 0px;">问题产品:</div>
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="50" style="background: #FAFAFA;">操作</td>
                        <td width="300" style="background: #FAFAFA;">SKU</td>
                        <td width="200" style="background: #FAFAFA;">数量</td>
                    </tr>
                    <tr v-for="item in disputeInfo.product_list">
                        <td style="text-align:center;">
                            <el-checkbox checked  @change="(bool)=>handleProDetailsOption(bool,item)"></el-checkbox>
                        </td>
                        <td>{{item.sku}}</td>
                        <td>
                            <el-input-number v-model="item.return_quantity" @change="handleProDetailsOption(true,item)" size="mini" :min="1" :precision="0"></el-input-number>
                        </td>
                    </tr>
                </table>
                <el-form-item label="操作:" prop="option" label-width="50px">
                    <el-radio-group v-model="form.option">
                        <el-radio label="2" @change="handleRefund">全部退款</el-radio>
                        <el-radio label="3" @change="handleRefund">部分退款</el-radio>
                        <el-radio label="发送留言" @change="handleSendMessage"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="option" v-if="form.option">
                    
                    <!-- 全额退款 -->
                    <div class="refund" v-if="form.option==='2'||form.option==='3'">
                        <div style="font-weight:700px;line-height:30px;border-bottom:1px solid #e6e6e6;font-size:14px;">{{form.option==='2'?'全额退款':'部分退款'}}</div>
                        <div style="display:flex;">
                            <div>
                                <!-- <el-form-item label="责任归属部门:" label-width="95px" prop="department_id"> -->
                                <el-form-item label="不良类型:" label-width="95px" prop="department_id">
                                    <el-select size="mini" v-model="form.department_id" @change="twoLevelLinkage">
                                        <el-option
                                            v-for="item in refundInfo.department_id"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <!-- <el-form-item label="退款原因:" prop="reason_id"> -->
                                <el-form-item label="不良原因:" prop="reason_id">
                                    <el-select size="mini" v-model="form.reason_id" @change="reasonChange">
                                        <el-option
                                            v-for="item in twoLevelLinkageInfo"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div>
                            <el-form-item label="不良原因说明" label-width="95px">
                                <el-input v-model="form.descriptionAdverseCauses" style="width:576px;" type="textarea" rows="2" disabled></el-input>
                            </el-form-item>
                        </div>
                        <div style="display:flex;">
                            <div style="margin-right:20px;">
                                <el-form-item :prop="form.option==='2'?'':'refund_amount'" label="退款金额：">
                                    <el-input-number size="mini" controls-position="right" style="width:240px;" :min="0" :precision="2"
                                            v-model="form.refund_amount" @change="handleRefundAmount" v-if="form.option=='3'"/>
                                    <span v-if="form.option=='2'">{{refundAmountMax}}</span> {{obtainOrderDetails.orderDetailsInfo.currency}}
                                </el-form-item>
                            </div>
                            <div style="margin-right:20px;">
                                <el-form-item label="退款比例：">
                                    <el-input-number size="mini" controls-position="right" style="width:240px;" :min="0" :max="100" :precision="2"
                                            v-model="form.refund_ratio" @change="handleRefundRatio" v-if="form.option=='3'"/>
                                    <span v-if="form.option=='2'">100</span>%
                                </el-form-item>
                            </div>
                            <el-form-item label="最大退款金额：" label-width="100px">
                                <div>{{refundAmountMax}} {{obtainOrderDetails.orderDetailsInfo.currency}}</div>
                            </el-form-item>
                        </div>
                        <el-form-item label="原因备注：">
                            <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入内容,不能超过5000个字符" maxlength="5000" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    <!-- 发送留言 -->
                    <div class="sendMessage" v-if="form.option=='发送留言'">
                        <div style="font-weight:700px;line-height:30px;border-bottom:1px solid #e6e6e6;font-size:14px;">发送留言</div>
                        <div style="display:flex;">
                            <div>
                                <el-form-item label="模板选择：" prop="">
                                    <el-select placeholder="请选择" size="mini" clearable v-model="form.templateChoose" filterable v-filter @change="handleSelectionTemplate()">
                                        <el-option v-for="(value, key, index) in dataComment.template"
                                                :label="value"
                                                :value="key"
                                                :key="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div>
                                <div style="padding: 4px 0 0 10px;">
                                    <TemplateEdit :platform="'EB'" class="templateChange" @selectTemplate="templateChange" />
                                </div>
                            </div>
                        </div>
                        <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" :list="dataComment.google_lang_code"></ComSelectLanguageV2>
                        <el-form-item :label="isTranslate?'翻译前':'正文'" prop="content">
                            <el-input size="small" type="textarea" v-model="form.content" :rows="isTranslate?8:16" placeholder="请输入内容,不能超过5000个字符" maxlength="5000" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="翻译后" v-if="isTranslate">
                            <el-input size="small" type="textarea" v-model="form.content_en" rows="8" show-word-limit></el-input>
                        </el-form-item>
                    </div>
                    
                    <el-form-item label="留言：" v-if="form.option!='发送留言'">
                        <el-input type="textarea" :rows="3" v-model="form.leavingMessage" placeholder="请输入内容,不能超过5000个字符" maxlength="5000" show-word-limit></el-input>
                    </el-form-item>
                    <!-- 上传凭证 -->
                    <div style="margin:10px 0px;">
                        <el-upload
                            class="upload-demo"
                            action="api/system_set/general_upload/upload"
                            name="userfile"
                            :data="userInfo"
                            :limit="5"
                            :beforeUpload="beforeUpload"
                            :on-exceed="handleExceed"
                            :on-error="handleError"
                            :on-remove="handleRemove"
                            :on-success="handleAddress">
                            <el-button size="small" type="primary">上传凭证</el-button>
                            <div slot="tip">支持jpg、png、jpeg，格式大小不能超过2M,数量不超过5个</div>
                        </el-upload>
                    </div>
                </div>
            </div>
        </el-form>
        <!-- 预览图片 -->
        <PreviewImg :show.sync="pop_preview" :src="thumb_url"></PreviewImg>
    </div>
</template>
<script>
import * as storage from '@/utils/storage';
import routerConfig from '@/router/routerConfig';
import {
        getInquiry,
        getCommentHeader,
        getEscalateReasonInfo,
        getAllowRefundAmount,
        issueRefundSubmission,
        provideShipmentInfoSubmission,
        escalateSubmission,
        sendMessageSubmission,
        getCancelDisputeInfo,
        getReturnInfo,
        issueReturnRefund,
        sendReturnMessage,
        uploadCertReturn,
        approveCancel,
        rejectCancel,
        returnSetAutoRefund,
        inquirySetAutoRefund,
    } from '../../../../api/orderInfo/componentjs';
import {
    getItemTemplate,
    getGoogleTranslate,
    getTemplateDetail,
} from '@/api/MailCenterManagement/PostMail';
import {getSessionStorage} from '@/utils/storage';
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";


export default {
    name: "Dispute",
    props: {
        orderInfo:{
            type: Object,
            default:{}
        },
        refundInfo:{
            type: Object,
            default:{}
        },
        obtainOrderDetails:{
            type: Object,
            default:{}
        },
        isINR:{
            type: Boolean,
            default:false
        },
        isReturn:{
            type: Boolean,
            default:false
        },
        isCancel:{
            type: Boolean,
            default:false
        },
    },
    components:{
        ComSelectLanguageV2
    },
    data() {
        return {
            // 图片预览相关
            pop_preview: false,
            thumb_url: '',
            userInfo:{
                uid:JSON.parse(getSessionStorage('userInfo')).uid,
                staff_code:JSON.parse(getSessionStorage('userInfo')).staff_code,
            },
            disputeRules:{
                auto_refund: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                option: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                department_id: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                reason_id: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                shipping_carrier_name: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                shipping_date: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                tracking_number: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                escalation_reason: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                content: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                leavingMessage: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                refund_amount: [{required: true,message: "带*号为必填项",trigger: "blur"}],
                refund_ratio: [{required: true,message: "带*号为必填项",trigger: "blur"}],
            },
            disputeInfo:{
                after_sales_id:[],
                // account_id: "",
                // actual_refund_amount: "",
                // auto_refund: "",
                // current_type: "",
                // item_id: "",
                // order_id: "",
                // process_list: [],
                // product_list: [],
                // remaining_time: "",
                // return_comments: "",
                // return_creation_date: "",
                // return_id: "",
                // return_quantity: "",
                // return_reason: "",
                // seller_address: "",
                // seller_response_date: "",
                // status: "",
                // unresolved_rate:"",
            },
            form:{
                auto_refund:"",
                department_id:'',
                reason_id:'',
                option:'',
                templateChoose:'',
                remark:"",
                shipping_carrier_name:'',
                shipping_date:"",
                tracking_number:"",
                escalation_reason:"",
                content:'',
                content_en:"",
                refund_amount:"",
                refund_ratio:'',
                leavingMessage:"",
                flie:[],
                sku:[],
                descriptionAdverseCauses:'',
                purchase_cost: 0,
                exchange_rate: 0
            },
            twoLevelLinkageInfo:[],
            dataComment:{},
            isTranslate:false,
            languageCode:'',
            escalateReasonInfo:{},
            refundAmountMax:"",
        }
    },
    methods: {
        // 点击放大图片
        handleClickImg(url) {
            if (url) {
                this.thumb_url = url;
                this.pop_preview = true
            }
        },
        //二级联动
        twoLevelLinkage(){
            if(this.refundInfo.department_id.length){
                this.form.reason_id='';
                for(let i=0;i<this.refundInfo.department_id.length;i++){
                    if(this.refundInfo.department_id[i].id==this.form.department_id){
                        this.twoLevelLinkageInfo = this.refundInfo.department_id[i].child;
                    }
                }
            }
        },
        //退款金额
        handleRefund(){
            if(!this.obtainOrderDetails.orderDetailsInfo.total_price){
                this.$message.error('操作失败！');
                return;
            }
            getAllowRefundAmount({order_id:this.disputeInfo.order_id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return;
                }
                this.refundAmountMax = ((parseFloat(this.obtainOrderDetails.orderDetailsInfo.total_price)*100-(parseFloat(data.data_list.amount)*100))/100).toFixed(2);
            }).catch(err => {
                console.log(err);
            });
        },
        //升级下拉数据
        handleGetEscalateReasonInfo(){
            getEscalateReasonInfo().then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return;
                }
                this.escalateReasonInfo = data.data_list;
            }).catch(err => {
                console.log(err);
            });
        },
        //模板
        handleSendMessage(){
            getCommentHeader({
                platfrom_code:'EB',
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return;
                }
                this.dataComment = data.data_list;
            }).catch(err => {
                console.log(err);
            });
        },
        //模板渲染
        handleSelectionTemplate(){
            if(!this.form.templateChoose)return;
            getTemplateDetail({id:this.form.templateChoose}).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.content += data.data_list.values[0].template_content;
                this.form.template = data.data_list.values[0];
            });
        },
        //选择语言翻译
        googleTranslate() {
            if( !this.languageCode ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.form.content){
                return;
            }
            getGoogleTranslate({
                content: this.form.content,
                after : this.languageCode,
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.content_en = data.after;
                this.isTranslate=true;
            });
        },
        //常用语言翻译
        changeLanguage(code) {
            if( !this.form.content){
                this.$message.warning('请输入要翻译的内容后再选择语言进行翻译！');
                return;
            }
            this.languageCode = code;
            // getGoogleTranslate({
            //     content: this.form.content,
            //     after : this.languageCode,
            //     before : "auto"
            // }).then(({data}) => {
            //     if( !data.status ){
            //         this.$message.error(data.errorMess || '操作失败！');
            //         return;
            //     }
            //     this.form.content_en = data.after;
            //     this.isTranslate=true;
            // });
        },
        handleAddress(response, file, fileList){
            if( !response.status ){
                this.$message.error(data.errorMess || '上传失败！');
                return;
            }
            this.form.file = [];
            fileList.forEach(element => {
                this.form.file.push(element.response.file_path);
            });
            this.$message.success('上传成功！');
            this.$store.commit("SAVE_LOADING_STATE",false);
        },
        handleError(){
            this.$store.commit("SAVE_LOADING_STATE",false);
            this.$message.error('上传失败！');
        },
        beforeUpload(file) {
            let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            let extArr = ['jpg', 'png', 'jpeg'];
            let size = file.size / 1024 / 1024 < 2;
            if( !size ){
                this.$message.error('文件大小必须在2m以内！');
                return false;
            }
            if( !extArr.includes(ext) ){
                this.$message.error('文件格式不符合！');
                return false;
            }
            this.$store.commit("SAVE_LOADING_STATE",true);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        //删除图片
        handleRemove(file, fileList) {
            this.form.file = [];
            fileList.forEach(element => {
                this.form.file.push(element.response.file_path);
            });
        },
        handleRefundAmount(){
            if(this.form.refund_amount>this.refundAmountMax){
                this.form.refund_amount = this.refundAmountMax;
            }
            this.form.refund_ratio = Math.round(parseFloat(this.form.refund_amount)/parseFloat(this.refundAmountMax)*10000)/100;
        },
        handleRefundRatio(){
            this.form.refund_amount = Math.round((this.form.refund_ratio/100)*parseFloat(this.refundAmountMax)*100)/100;
        },
        handleProDetailsOption(bool,item){
            if(bool){
                let arr=[];
                arr.push(item.sku);
                let judge=true;
                this.form.sku.forEach(element => {
                    if(element[0]===item.sku){
                        if(item.return_quantity)element[1] = item.return_quantity;
                        if(item.inquiry_quantity)element[1] = item.inquiry_quantity;
                        judge=false;
                    }
                });
                if(judge){
                    if(item.return_quantity)arr.push(item.return_quantity);
                    if(item.inquiry_quantity)arr.push(item.inquiry_quantity);
                    this.form.sku.push(arr);
                }
            }else{
                this.form.sku.forEach((element,index) => {
                    element.forEach(e => {
                        if(e==item.sku)this.form.sku.splice(index,1);
                    });
                });
            }
        },
        //INR提交
        handleINRSubmission(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if(this.form.option==='2'){
                        if(!this.form.sku.length){
                            this.$message.error('请勾选SKU再进行退款操作!');
                            return;
                        }
                        if(this.refundAmountMax<=0){
                            this.$message.error('退款金额只能是大于0的数！');
                            return;
                        }
                        let obj={
                            form:{
                                id:this.orderInfo.row.inquiry_id,
                                ship_cost:this.obtainOrderDetails.orderDetailsInfo.ship_cost,
                                department_id:this.form.department_id,
                                reason_code:this.form.reason_id,
                                remark:this.form.remark,
                                refund_amount:this.refundAmountMax,
                                content:this.form.leavingMessage,
                                auto_refund:this.form.auto_refund,
                                sku: this.form.sku,
                                purchase_cost:this.obtainOrderDetails.profitDetailsInfo?this.obtainOrderDetails.profitDetailsInfo.purchaseCost:0,
                                exchange_rate:this.obtainOrderDetails.profitDetailsInfo?this.obtainOrderDetails.profitDetailsInfo.currencyRate:0,
                            }
                        }
                        issueRefundSubmission(obj).then(({data}) => {
                            this.$emit("succeedCallBack",data);
                        });
                    }else if(this.form.option==='提供发货信息'){
                        let obj={
                            form:{
                                id:this.orderInfo.row.inquiry_id,
                                tracking_number:this.form.tracking_number,
                                shipping_carrier_name:this.form.shipping_carrier_name,
                                shipping_date:this.form.shipping_date,
                                content:this.form.leavingMessage,
                                auto_refund:this.form.auto_refund,
                            }
                        }
                        provideShipmentInfoSubmission(obj).then(({data}) => {
                            this.$emit("succeedCallBack",data);
                        });
                    }else if(this.form.option==='升级'){
                        let obj={
                            form:{
                                id:this.orderInfo.row.inquiry_id,
                                escalation_reason:this.form.escalation_reason,
                                content:this.form.leavingMessage,
                                auto_refund:this.form.auto_refund,
                            }
                        }
                        escalateSubmission(obj).then(({data}) => {
                            this.$emit("succeedCallBack",data);
                        });
                    }else if(this.form.option==='发送留言'){
                        let obj={
                            form:{
                                id:this.orderInfo.row.inquiry_id,
                                content_en:this.form.content_en,
                                content:this.form.content,
                                auto_refund:this.form.auto_refund,
                            }
                        }
                        sendMessageSubmission(obj).then(({data}) => {
                            this.$emit("succeedCallBack",data);
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //Cancel提交
        handleCancelSubmission(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if(this.form.option==='接受'){
                        let obj={
                            ids:this.orderInfo.row.id,
                            explain:this.form.leavingMessage,
                        }
                        approveCancel(obj).then(({data}) => {
                            this.$emit("succeedCallBack",data);
                        });
                    }else if(this.form.option==='拒绝'){
                        let obj={
                            id:this.orderInfo.row.id,
                            shipment_date:this.form.shipping_date,
                            tracking_number:this.form.tracking_number,
                        }
                        rejectCancel(obj).then(({data}) => {
                            this.$emit("succeedCallBack",data);
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //Return提交
        handleReturnSubmission(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if(this.form.flie.length){
                        uploadCertReturn({
                            form:{
                                id:this.orderInfo.row.return_id,
                                file:this.form.flie
                            }
                        }).then(({data}) => {
                            if (!data.status) {
                                this.$message.error(data.errorMess || '操作失败');
                                return;
                            }else{
                                this.handleReturn();
                            }
                        });
                    }else{
                        this.handleReturn();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleReturn(){
            if(this.form.option==='2'||this.form.option==='3'){
                if(!this.form.sku.length){
                    this.$message.error('请勾选SKU再进行退款操作!');
                    return;
                }
                if(this.form.refund_amount<=0&&this.form.option=='3'){
                    this.$message.error('退款金额只能是大于0的数!');
                    return;
                }
                
                if(this.refundAmountMax<=0&&this.form.option=='2'){
                    this.$message.error('退款金额只能是大于0的数！');
                    return;
                }
                if(parseFloat(this.refundAmountMax)<parseFloat(this.form.refund_amount)){
                    this.$message.error('退款金额不能大于最大退款金额！');
                    return;
                }
                let obj={
                    form:{
                        id:this.disputeInfo.return_id,
                        sku:this.form.sku,
                        ship_cost:this.obtainOrderDetails.orderDetailsInfo.ship_cost,
                        subtotal_price:this.obtainOrderDetails.orderDetailsInfo.subtotal_price,
                        type:this.form.option,
                        department_id:this.form.department_id,
                        reason_code:this.form.reason_id,
                        remark:this.form.remark,
                        refund_amount:this.form.option=='2'?this.refundAmountMax:this.form.refund_amount,
                        content:this.form.leavingMessage,
                        auto_refund:this.form.auto_refund,
                        purchase_cost:this.obtainOrderDetails.profitDetailsInfo?this.obtainOrderDetails.profitDetailsInfo.purchaseCost:0,
                        exchange_rate:this.obtainOrderDetails.profitDetailsInfo?this.obtainOrderDetails.profitDetailsInfo.currencyRate:0,
                    }
                }
                console.log(obj)
                issueReturnRefund(obj).then(({data}) => {
                    this.$emit("succeedCallBack",data);
                });
            }else if(this.form.option==='发送留言'){
                let obj={
                    form:{
                        id:this.disputeInfo.return_id,
                        content_en:this.form.content_en,
                        content:this.form.content,
                        auto_refund:this.form.auto_refund,
                    }
                }
                sendReturnMessage(obj).then(({data}) => {
                    this.$emit("succeedCallBack",data);
                });
            }
        },
        //售后单跳转
        handleAfterSaleList(item){
            this.$router.push({path:'/EbayAfterSalesOrderManagement',query:{after_order_number: item.after_id, _cacheType:'1'}});
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
        //点击翻译功能
        handelTranslate(i,s){
            getGoogleTranslate({
                content: this.disputeInfo.process_list[i][s],
                after : 'en',
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.disputeInfo.process_list[i].translate = data.after;
            });
        },
        // //EB消息跳转
        goEbMessagejump(id){
            this.$router.push({path:'/EbayMessage',query:{type:"OrderInformation", message_type: 2, order_id: id, _cacheType:'1'}});
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
        templateChange(id) {
            this.form.templateChoose = id;
            getTemplateDetail({id}).then(({data}) => {
                this.form.content = (this.form.content ? this.form.content + '\n\n\n' : '') + data.data_list.values[0].template_content;
            });
        },
        //不良原因说明
        reasonChange(){
            let obj = this.twoLevelLinkageInfo.filter(item=>{
                if(item.id===this.form.reason_id){
                    return item
                }
            });
            this.form.descriptionAdverseCauses = obj[0]?obj[0].text:'';
        },
        //inr自动退款
        handleInquirySetAutoRefund(){
            let obj={
                id: this.orderInfo.row.inquiry_id,
                auto_refund: this.form.auto_refund,
            };
            inquirySetAutoRefund(obj).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }else{
                    this.$message.success('操作成功！');
                }
            });
        },
        //return自动退款
        handleReturnSetAutoRefund(){

            let obj={
                id: this.disputeInfo.return_id,
                auto_refund: this.form.auto_refund,
            };
            returnSetAutoRefund(obj).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }else{
                    this.$message.success('操作成功！');
                }
            });
        },
        handle(){
            if(this.orderInfo.operation==='handlePageINR'){
                getInquiry({id:this.orderInfo.row.inquiry_id}).then(({data})=>{
                    if (!data.status) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    data.data_list.value.process_list.forEach(element => {
                        element.translate='';
                    });
                    this.disputeInfo = data.data_list.value;
                    this.disputeInfo.product_list.forEach(element => {
                        element.isChoice=true;
                        this.handleProDetailsOption(true,element);
                    });
                    this.form.auto_refund = this.disputeInfo.auto_refund;
                    this.form.escalation_reason = '7';
                }).catch(error=>{})
                
            }else if(this.orderInfo.operation==='handlePageCancel'){
                getCancelDisputeInfo({id:this.orderInfo.row.cancel_id}).then(({data})=>{
                    if (!data.status) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.disputeInfo = data.data_list.value;
                    this.form.leavingMessage = "买家取消订单";
                }).catch(error=>{})
            }else if(this.orderInfo.operation==='handlePageReturn'){
                getReturnInfo({id:this.orderInfo.row.return_id}).then(({data})=>{
                    if (!data.status) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    data.data_list.value.process_list.forEach(element => {
                        element.translate='';
                    });
                    this.disputeInfo = data.data_list.value;
                    this.form.auto_refund = this.disputeInfo.auto_refund;
                    this.disputeInfo.product_list.forEach(element => {
                        element.isChoice=true;
                        this.handleProDetailsOption(true,element);
                    });
                }).catch(error=>{})
            }
        }
    },
    watch:{
        isINR(){
            console.log('INR');
            this.handleINRSubmission();
        },
        isReturn(){
            console.log('Return');
            this.handleReturnSubmission();
        },
        isCancel(){
            console.log('Cancel');
            this.handleCancelSubmission();
        },
        orderInfo:{
            handler(newVal,oldVal){
                this.handle();
    　　　　},
    　　　　deep:true
        }
    },
    created(){
        this.handle();
    }
};
</script>
<style lang="less" scoped>
table{
    width: 100%;
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    word-wrap:break-word;
    word-break:break-all;
    font-weight: 100;
    td{
        border-top: 1px solid #e6e6e6;
        border-left: 1px solid #e6e6e6;
        padding: 5px 5px;
        line-height: 19px;
        /deep/.el-input.el-input--mini{
            width: 130px;
        }
    }
}
.timePast{
    width: 100%;
    border:13px solid #FE9900;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    top: -0px;
    z-index: 0;
}
.disputeInfo{
    tr{
        td:nth-child(2n+1){
            width: 80px;
            background: #FAFAFA;
        }
        td:nth-child(2n){
            width: 160px;
            background: #FAFAFA;
        }
    }
}
.option{
    border: 1px solid #e6e6e6;
    padding: 10px;
    .refund{
        // .el-select.el-select--mini{
        //     width: 180px;
        //     /deep/.el-input.el-input--mini.el-input--suffix{
        //         width: 180px;
        //     }
        // }
        .el-input-number.el-input-number--mini.is-controls-right{
            width: 160px !important;
            /deep/.el-input.el-input--mini{
                width: 160px;
            }
        }
    }
}
.overflowProcessing{
    max-height: 300px;
    overflow: auto;
}
</style>
<style>
    .afterId{
        max-height: 300px;
        overflow-y: auto;
    }
</style>