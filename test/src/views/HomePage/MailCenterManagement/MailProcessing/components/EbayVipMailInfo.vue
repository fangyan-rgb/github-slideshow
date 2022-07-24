<style lang="less">
.MailProcessingwrap {
    min-width: 1683px;
    font-size: 12px;
    .MailProcessingbox{
        .MailProcessingsubject{
            margin: 11px 15px 3px;
            padding: 8px 3px 8px 8px;
            border: 1px solid #ffe0af;
            background: #fcf7f1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .subjectremark{
                flex: auto;
                width: 0;
                margin-right: 10px;
            }
            .remarkspan{
                color: #5c9ffc;
                cursor: pointer;
            }
        }
        .MailProcessingitem{
            border: 1px solid #e5e7e6;
            background: #fff;
            margin-bottom: 9px;
            &:last-child{
                margin-bottom: 0;
            }
            .MailProcessingitemhead{
                min-height: 26px;
                padding: 5px 11px;
                border-bottom: 1px solid #e5e7e6;
                overflow: hidden;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-tag {
                    color: #343436;
                    border-color: #cde0fb;
                    background: #cde0fb;
                    border-radius: 100px;
                    /deep/ .el-icon-close{
                        width: 15px;
                        height: 15px;
                        background: transparent;
                        color: #343436;
                        border: 1px solid #343436;
                        // visibility: hidden;
                    }
                    &:hover{
                        /deep/ .el-icon-close{
                            visibility: visible;
                        }
                    }

                    & + .el-tag{
                        margin-left: 10px;
                    }
                }
                .alignselfflexend{
                    align-self: flex-end;
                }
                .itemheadorderlist{
                    flex: auto;
                    display: flex;
                    padding: 0 20px;
                    & > div{
                        width: 25%;
                        flex: none;
                        text-align: center;
                        p{
                            padding: 0 10px;
                            a{
                                word-break: break-all;
                            }
                        }
                    }
                }
            }
            .MailProcessingitembody{
                overflow-y: auto;
                padding: 8px;
                .savedraft{
                    padding-bottom: 6px;
                    .el-checkbox{
                        color: #a2a2a2;
                    }
                }
                .sendlogedit{
                    display: flex;
                    justify-content: space-between;
                    margin: 0 -8px;
                    padding: 8px 16px;
                    background: #f3f7fc;
                    .pageedit{
                        display: flex;
                        align-items: center;
                        a{
                            &:hover{
                                color: #2b85ff;
                            }
                        }
                        .nextmaila{
                            margin-left: 14px;
                        }
                    }
                }
                .sendlogeditunderline{
                    margin: 20px 0 12px;
                    border-bottom: 1px solid #e6e6e6;
                }
                /deep/ .el-form-item {
                    margin-bottom: 9px;
                }
            }
        }
    }
    .elloadingbtn{
        .el-loading-spinner{
            margin-top: -6px;
        }
    }
    .uploadleftspan{
        float: left;
        line-height: 28px;
        margin-right: 22px;
    }
}

.uploadbox {
    padding: 0 0 6px;
    color: #666;
}

.el-form {
    /deep/ .el-form-item__label, .el-form-item__content{
        font-size: 12px;
    }
}

.is-required .el-form-item__label::before{
    position: static !important;
}

.el-input__count{
    line-height: 12px;
}

// 下拉框z-index  信息弹框z-index           遮罩层
.zindexhighest, .el-message-box__wrapper, .el-loading-mask{
    z-index: 10002 !important;
}

// 消息弹框
.el-message{
    z-index: 10003 !important;
}
</style>

<template>
    <div class="MailProcessingwrap">
        <div style="background: #fff;">
            <ComMailProcessNav :list="mailProcessNavList" :curId="getNavInfo(mailDataId)" ref="ComMailProcessNav"></ComMailProcessNav>
        </div>
        <div class="MailProcessingbox">
            <el-row>
                <el-col :span="12">
                    <!-- 邮件列表 -->
                    <div class="MailProcessingitem" v-loading="mailListLoading">
                        <div class="MailProcessingitemhead">
                            <div>
                                <p style="height: 24px; line-height: 24px; margin-bottom: 3px;">
                                    买家ID：{{mailData.info.buyer_id}}&nbsp;&nbsp;&nbsp;&nbsp;<el-tag v-for="(v, i) in mailData.info.tag" size="small" closable @close="handleTagClose(v, i)" :key="i">{{(v.tag || '').substr(0,10)}}</el-tag>
                                </p>
                            </div>
                            <div>
                                <span v-if="mailData.info.star == '1'" @click="setStar(0)" class="icon-biaoxing" style="font-size: 24px; color: #ff3332; cursor: pointer;"></span>
                                <span v-else @click="setStar(1)" class="icon-biaoxing" style="font-size: 24px; color: #999; cursor: pointer;"></span>
                            </div>
                        </div>
                        <div class="MailProcessingsubject">
                            <div class="subjectremark">
                                <el-row>
                                    <el-col :span="12">
                                        订单号：<a @click="handleOrderInfo(mailData.info.order_info)" href="javascript:;" style="color: #3388ff;">{{mailData.info.order_info && mailData.info.order_info.order_id}}</a>
                                    </el-col>
                                    <el-col :span="12">
                                        平台订单号：{{mailData.info.order_info && mailData.info.order_info.platform_order_id}}
                                    </el-col>
                                </el-row>
                                <div style="height: 3px;"></div>
                                <el-row>
                                    <el-col :span="12">
                                        Item ID：<a v-if="mailData.info.order_info && mailData.info.order_info.order_detail && mailData.info.order_info.order_detail.length" target="_blank" style="color: #3388ff;" :href="'https://www.ebay.com/itm/' + mailData.info.order_info.order_detail[0].item_id">{{mailData.info.order_info.order_detail[0].item_id}}</a>
                                    </el-col>
                                    <el-col :span="12">
                                        SKU：
                                        <ProdInfoPopup v-if="mailData.info.order_info && mailData.info.order_info.order_detail.length" :list="mailData.info.order_info.order_detail">
                                            {{mailData.info.order_info.order_detail[0].sku}}
                                        </ProdInfoPopup>
                                    </el-col>
                                </el-row>
                                <p v-if="mailData.info.remark" style="margin-top: 5px; color: #f33; word-break: break-all;">备注：{{mailData.info.remark}}</p>
                            </div>
                            <div>
                                <span @click="mailSubjectRemark(mailData.info)" class="icon-bianji remarkspan"></span>
                            </div>
                        </div>
                        <div class="MailProcessingitembody" style="height: 400px;">
                            <!-- 邮件列表主体 -->
                            <mailList
                                :mailList="mailData.mail_list"
                                @goTransResFn="goTransResFn"
                                @mailRemark="mailRemark"
                                @handleClickImg="handleClickImg"
                            />
                        </div>
                    </div>
                    <!-- 订单信息 -->
                    <div class="MailProcessingitem" v-loading="orderListLoading">
                        <div class="MailProcessingitemhead">
                            <div>订单信息</div>
                            <div class="itemheadorderlist">
                                <div v-if="idx < 4" v-for="(order, idx) in mailData.parent_order">
                                    <el-popover
                                        width="200"
                                        trigger="hover"
                                        :content="order.order_type">
                                        <div slot="reference">
                                            <p><a @click="handleOrderInfo(order)" href="javascript:;" style="color: #3388ff;">{{order.order_id}}</a></p>
                                            <p>{{order.paytime}}</p>
                                        </div>
                                    </el-popover>
                                </div>
                            </div>
                            <div>
                                <el-button @click="gotoOrderList()" type="text" size="mini">更多订单 >></el-button>
                            </div>
                        </div>
                        <div class="MailProcessingitembody" :style="{height: mailData.info.remark ? '257px' : '278px'}">
                            <!-- 订单信息主体 -->
                            <orderList
                                :orderList="mailData.order"
                                :chiledOrderList="mailData.chiled_order"
                                @submitRemark="submitRemark"
                                @handleOrderInfo="handleOrderInfo"
                                @changeOperation="changeOperation"
                                @gotoAfterSalesOrderList="gotoAfterSalesOrderList"
                                @gotoCustomerComplaintList="gotoCustomerComplaintList"
                                @handleobtainReturnCode="handleobtainReturnCode"
                                @gotoFeedbackList="gotoFeedbackList"
                                @gotoReviewList="gotoReviewList"
                                @delRemarkFn="delRemarkFn"
                                @gotoCancelList="gotoCancelList"
                                @gotoInrList="gotoInrList"
                                @gotoReturnList="gotoReturnList"
                            />
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="padding-left: 9px;">
                        <div class="MailProcessingitem">
                            <div class="MailProcessingitemhead">
                                <div>
                                    <p style="margin: 4px 0 7px;">平台账号：{{mailData.info.account_name}}</p>
                                </div>
                                <div class="alignselfflexend">

                                </div>
                            </div>
                            <div class="MailProcessingitembody" style="height: 813px;">
                                <!-- 邮件编辑 -->
                                <el-form :model="sendForm" :rules="formRules" ref="sendForm" label-width="110px" size="small">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="当前客服人员：">
                                                <div v-if="!customerChangeState">
                                                    <span>{{mailData.info.user_name || '无'}}</span>&nbsp;&nbsp;
                                                    <el-button @click="openUserIdChange()" type="text">修改</el-button>
                                                </div>
                                                <el-select
                                                    v-else
                                                    v-model="sendForm.user_id"
                                                    @change="userIdChange"
                                                    clearable
                                                    filterable v-filter
                                                    remote
                                                    :remote-method='userIdChangeRemoteMethod'
                                                    size="small"
                                                    popper-class="zindexhighest"
                                                    style="width: 100%;">
                                                    <el-option
                                                        v-for="(v, i) in optionListLabel.user"
                                                        :label="v.value"
                                                        :value="v.id"
                                                        :key="i">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">

                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-row>
                                                <el-col :span="20">
                                                    <el-form-item label="模板选择：">
                                                        <el-select v-model="sendForm.template_id" @change="templateChange" size="small" filterable v-filter style="width: 100%;" popper-class="zindexhighest">
                                                            <el-option
                                                                v-for="(v, k, i) in optionListLabel.message_template"
                                                                :label="v"
                                                                :value="k"
                                                                :key="i">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="4" style="text-align: right;">
                                                    <TemplateEdit :platform="platform" @selectTemplate="templateChange" />
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="快捷参数：">
                                                <el-select v-model="sendForm.quick_parameter" @change="changeQuickParameter" size="small" filterable v-filter style="width: 100%;" popper-class="zindexhighest">
                                                    <el-option
                                                        v-for="(v, k, i) in optionListLabel.quick_parameter"
                                                        :label="v"
                                                        :value="k"
                                                        :key="i">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-form-item label="翻译后语言：">
                                        <ComSelectLanguageV2 @change="changeFnLanguage" @translate="googleFnTranslate()" :list="optionListLabel.google_lang_code" notxt></ComSelectLanguageV2>
                                    </el-form-item>
                                    <el-form-item prop="reply_content" :label="languageCodeO ? '翻译前：' : ''">
                                        <el-input v-model="sendForm.reply_content" id="maintextarea" type="textarea" :rows="languageCodeO ? '14' : '29'"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="languageCodeO" label="翻译后：">
                                        <el-input v-model="sendForm.reply_content_translate" type="textarea" rows="14"></el-input>
                                    </el-form-item>

                                    <div style="padding-left: 8px;">
                                        <div class="uploadbox">
                                            <el-upload
                                                action="/api/system_set/general_upload/upload"
                                                :file-list="fileList"
                                                :data="{
                                                    staff_code: JSON.parse(getSessionStorage('userInfo')).staff_code,
                                                    uid: JSON.parse(getSessionStorage('userInfo')).uid
                                                }"
                                                name="userfile"
                                                :on-success="UpSuccess"
                                                :on-remove="UpRemove"
                                                :beforeUpload="beforeUpload"
                                                :on-preview="UpPreview"
                                                :limit="5"
                                                :on-exceed="overLimitFn"
                                                ref="upFile"
                                                :key="uploadKey"
                                                :disabled="fileUploading">
                                                <el-button type="primary" v-loading="fileUploading" element-loading-spinner="el-icon-loading" class="elloadingbtn" size="mini">上传附件</el-button>&nbsp;&nbsp;&nbsp;
                                                <span class="uploadleftspan" slot="tip">支持gif、jpg、png、jpeg、bmp格式，大小不能超过8M</span>
                                            </el-upload>
                                        </div>
                                    </div>
                                    <div class="sendlogedit">
                                        <div>
                                            <el-button @click="sendFormFn()" type="primary" size="small">发送</el-button>
                                            <el-button @click="tagRepliedFn()" type="primary" size="small" plain>标记已回复</el-button>
                                            <el-button @click="selectTagFn()" type="primary" size="small" plain>添加标签</el-button>
                                            <el-button @click="handleOperateDaily()" type="primary" size="small" plain>日志</el-button>
                                        </div>
                                        <div class="pageedit">
                                            <a @click="resetPage('prev')"><span class="el-icon-arrow-left"></span>上一封</a>
                                            <a @click="resetPage('next')" class="nextmaila">下一封<span class="el-icon-arrow-right"></span></a>
                                        </div>
                                    </div>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 添加标签 -->
        <el-dialog
            class="ui-layout_edit-dialog zindexhighest"
            title="添加标签"
            width="430px"
            :visible.sync="selectTagObj.dialog">
            <div>
                <el-form :model="selectTagObj.form" :rules="formRules" ref="batchTagForm" size="small" label-width="100px">
                    <el-form-item prop="tag_id" label="标签：">
                        <el-select v-model="selectTagObj.form.tag_id" filterable v-filter clearable popper-class="zindexhighest">
                            <el-option
                                v-for="(v, k, i) in optionListLabel.tag_list"
                                :key="i"
                                :label="v"
                                :value="k">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectTagObj.dialog = false" size="small">取 消</el-button>
                <el-button @click="batchTagSubmitFn()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 操作日志 -->
        <el-dialog
            class="ui-layout_edit-dialog zindexhighest"
            title="日志"
            :visible.sync="logInfo.isShowLog">
            <ComPreviewTable
                :isAdaptiveHeight="false"
                :logKey="logInfo.tableKey"
                :logProps="logInfo.tableProps"
                :logData="logInfo.tableData"
                :logWidth="logInfo.tableWidth">
            </ComPreviewTable>
        </el-dialog>

        <!-- 添加备注弹窗 -->
        <el-dialog
            class="ui-layout_edit-dialog zindexhighest"
            title="编辑邮件备注"
            width="375px"
            :visible.sync="remarkObj.dialog">
            <div>
                <el-input v-model="remarkObj.remark" maxlength="250" show-word-limit placeholder="请输入" size="small" style="width: 100%;" class="showwordlimitipt"></el-input>
            </div>
            <span slot="footer">
                <el-button @click="remarkObj.dialog = false" size="small">取 消</el-button>
                <el-button @click="submitRemarkObj()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 作废弹窗 -->
        <el-dialog
            class="ui-layout_edit-dialog zindexhighest"
            :title="obsoleteObj.type == 1 ? '永久作废' : '暂时作废'"
            width="440px"
            :visible.sync="obsoleteObj.dialog">
            <div>
                <el-form :model="obsoleteObj.form" :rules="formRules" label-width="80px" ref="BatchOperation">
                    <el-form-item label="订单号：">
                        <div>{{obsoleteObj.form.id}}</div>
                    </el-form-item>
                    <el-form-item label="平台：">
                        <div>{{obsoleteObj.form.platform_code}}</div>
                    </el-form-item>
                    <el-form-item label="备注信息：" prop="remark">
                        <el-input v-model="obsoleteObj.form.remark" type="textarea" rows="4" size="small" placeholder="请输入内容，不能超过100个字符" show-word-limit maxlength="100"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="obsoleteObj.dialog = false" size="small">取 消</el-button>
                <el-button @click="submitObsoleteObj()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 发票弹窗弹窗 -->
        <OrderInvoiceInfo
            v-if="isInvoice"
            :isInvoice="isInvoice"
            :InvoiceInfo="InvoiceInfo"
            :detailsInvoiceInfo="detailsInvoiceInfo"
            :invoice="invoiceSubmission"
            @handleSubmitInvoiceInterface="handleSubmitInvoiceInterface"
            @handleIsInvoiceShow="handleIsInvoiceShow"/>

        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            @handleOperationCallBack="handleOperationCallBack({status: 1})"
        ></OrderInformation>

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
                        <div style="margin-right:100px;">{{orderStatus.complete_status | orderStatusFilter}}</div>
                        <div><el-button style="font-size:12px;" type="primary" size="mini" @click="changeOperation('4',orderStatus)"
                                        :disabled="orderStatus.complete_status==='19'||orderStatus.complete_status==='20'||orderStatus.complete_status==='40'">作废订单</el-button></div>
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

        <!-- 预览图片 -->
        <PreviewImg :show.sync="imgPopPreview.pop_preview" :src="imgPopPreview.thumb_url"></PreviewImg>
    </div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    getMailData,
    getOrderList,
    getOrderProItem,
    setMailRemark,
    delTag,
    delRemarkInfo,
    addNewBatchRemark,
    addNewShipRemark,
    batchCancelWithhold,
    toVoidInfo,
    withhold,
    getHandleInfo,
    sendMailData,
    getShortcutKey,
    journalOperation,
    getCommentHeader,
    replyBack,
    activeContactConfirm,
    collectionInformation,
    registeredReceivablesData,
    cancelTransactionList,
    cancelTransactionConfirm,
} from '@/api/MailCenterManagement/EbayMesMailProcessing';
import {
    setStar,
    setReply,
    getLogs,
    saveKefu,
    saveTag,
} from '@/api/Ebay/Message';
import {
    getGoogleTranslateV2,
    obtainReturnCode,
    invoiceDetailsInterface,
    submitInvoiceInterface,
    OrderCustomerComplaintInfo,
} from '@/api/MailCenterManagement/MailProcessing';
import {
    getTemplateDetail,
    getGoogleTranslate,
} from '@/api/MailCenterManagement/PostMail';
import {
    getkefu,
    getTag,
} from '@/api/MailCenterManagement/Inbox';
import hotkeys from 'hotkeys-js';
import routerConfig from '@/router/routerConfig';
import OrderInvoiceInfo from "@/views/HomePage/OrderManagement/component/OrderInvoice.vue";
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import mailList from "@/views/HomePage/MailCenterManagement/MailProcessing/components/mailList";
import orderList from "@/views/HomePage/MailCenterManagement/MailProcessing/components/orderList";
import ProdInfoPopup from '@/views/HomePage/Ebay/components/ProdInfoPopup';
import SendReceiptRequest from '@/views/HomePage/OrderManagement/component/SendReceiptRequest';
import RegisteredReceivables from '@/views/HomePage/OrderManagement/component/RegisteredReceivables';
import * as storage from '@/utils/storage';
import { getSessionStorage } from '@/utils/storage';

export default {
    name: 'EbayVipMailProcessing',
    data () {
        return {
            orderInfo:{},
            isOrderInfoShow:false,//订单详情弹窗

            // 邮件列表加载动画
            mailListLoading: false,
            // 订单列表加载动画
            orderListLoading: false,

            sendForm: {
                user_id: '',
                message_id: '',
                reply_content: '',
                reply_content_translate: '',
                is_draft: '',
                pictures: [],
                template_id: '',
                quick_parameter: '',
            },
            // 上传文件列表
            fileList: [],
            uploadKey: 0,
            fileUploading: false,

            selectTagObj: {
                dialog: false,
                form: {
                    tag_id: '',
                }
            },
            languageCodeO: '',
            mailDataId: {
                inbox_id: '',
                account_id: '',
                order_id: '',
                buyer_id: '',
                buyer_email: '',
                point: '',
            },
            mailData: {
                info: {},
                prev: {},
                next: {},
                order: [],
                parent_order: [],
                chiled_order: [],
                more_order: {},
                mail_list: [],
            },
            customerChangeState: false,
            formRules: {
                tag_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                reply_content: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                remark: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ]
            },

            // 平台
            platform: 'EB',

            // 日志
            logInfo: {
                tableData: [],
                tableProps: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableWidth: ['', '', ''],
                isShowLog: false,
            },

            // 查询下拉框数据
            optionListLabel: {
                google_lang_code: {},
                tag_list: {},
                message_template: {},
                quick_parameter: {},
                parameter: {},
                user: [],
            },

            // 发票相关
            isInvoice:false, //发票显示和隐藏
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

            mailProcessNavList: [],

            // 快捷键列表
            shortcutKeyArr: {},

            // 添加备注相关
            remarkObj: {
                dialog: false,
                id: '',
                remark: '',
                remark_origin: '',
                item: '',
                type: ''
            },

            // 作废相关
            obsoleteObj: {
                dialog: false,
                type: '',
                form: {
                    id: '',
                    platform_code: '',
                    remark: '',
                }
            },

            // 订单日志相关
            isShowLogShow: false,
            showLogTableData:[],

            //留评
            isTemplateChooseShow:false,//站内信
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

            //消息联系
            activeContact:{
                reply_title:'',
                reply_content:"",
                reply_content_en:"",
                ebay_order:[]
            },
            activeContactRow:{},

            //收款请求
            isReceiptRequestShow:false,//收款请求弹窗
            sendReceiptRequestInfo: { //收款请求
                company_account: '', //公司paypal账号
                customer_account: '', //客户paypal账号
                amount: '', //收款金额
                goods_name: '', //产品名称
                leave_message: '' //留言
            },
            collectionInfo: {}, //收款请求所需信息

            //登记收款
            isRegisteredReceivables:false,//登记收款弹窗
            RegisteredReceivablesInfo: {
                order: {
                    account_id: "",
                    account_name: "",
                    buyer_id: "",
                    order_id: "",
                    platform_code: ""
                }
            },

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

            //提示
            tips:{
                currentTime:"",
                paytime:"",
                intervalTime:"",
                isShow:false,
                row:{},
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

            // 图片预览相关
            imgPopPreview: {
                pop_preview: false,
                thumb_url: '',
            },

            // 保存路由数据，判断是否重置数据
            curRouterData: ''
        }
    },
    components: {ComSelectLanguageV2, OrderInvoiceInfo, OrderInformation, mailList, orderList, ProdInfoPopup, SendReceiptRequest, RegisteredReceivables},
    computed: {
        ...mapGetters([
            'queryParamsInfo'
        ])
    },
    created() {
        this.handleGetTag();
    },
    activated() {
        // 路由变化就重置数据
        if( this.curRouterData !== this.$route.fullPath ){
            this.curRouterData = this.$route.fullPath;
            this.initData();
        }else{
            this.mailProcessNavList = JSON.parse(this.queryParamsInfo[this.$route.query.queryParamsInfo]);
        }

        // 展开指定面板
        let idx = routerConfig.getRouteIndex('/' + this.$route.query.type);
        this.$store.commit('SAVE_NAV_SINGLE_INDEX', +new Date() + '&&' + idx);
    },
    beforeDestroy() {
        // 快捷键解绑
        if( Object.keys(this.shortcutKeyArr).length ){
            hotkeys.unbind(Object.keys(this.shortcutKeyArr).join(','));
        }
    },
    methods: {
        getSessionStorage,

        resetPage(f) {
            let mailLen = this.mailProcessNavList.length;
            let errStr = '';
            let str1 = '已是第一封邮件！';
            let str2 = '已是最后一封邮件！';
            let mailObj = {};
            // 当有邮件处理标签页
            if( mailLen > 1 ){
                let curIdx = this.mailProcessNavList.findIndex(e => e.inbox_id === this.mailDataId.inbox_id);
                if( f === 'prev' ){
                    if( curIdx <= 0 ){
                        mailObj = this.mailProcessNavList[mailLen-1];
                    }else{
                        mailObj = this.mailProcessNavList[curIdx-1];
                    }
                }
                if( f === 'next' ){
                    if( curIdx >= mailLen-1 ){
                        mailObj = this.mailProcessNavList[0];
                    }else{
                        mailObj = this.mailProcessNavList[curIdx+1];
                    }
                }
            }else{
                // 当没有邮件处理标签页
                if( !this.mailData[f] ){
                    if( f === 'prev' ){
                        errStr = str1;
                    }
                    if( f === 'next' ){
                        errStr = str2;
                    }
                }else{
                    mailObj = {
                        ...this.$route.query,
                        inbox_id: this.mailData[f].id,
                        account_id: this.mailData[f].account_id,
                        order_id: this.mailData[f].order_id,
                        buyer_id: this.mailData[f].buyer_id,
                        prev_next_ids: this.mailData[f].prev_next_ids,
                        transaction_id: this.mailData[f].transaction_id,
                    };
                }
            }
            if( errStr ){
                this.$nextTick(() => {
                    this.$message.warning(errStr);
                });
                return;
            }

            let path = mailObj.routerPath;
            let query = {...mailObj};
            this.$router.push({path, query});
            // 修改多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: path,
                name: mailObj.routerPathName,
                isRemove: 3,
                query
            });
        },
        initData() {
            this.mailProcessNavList = JSON.parse(this.queryParamsInfo[this.$route.query.queryParamsInfo]);
            this.mailData = {
                info: {},
                prev: {},
                next: {},
                order: [],
                parent_order: [],
                chiled_order: [],
                more_order: {},
                mail_list: [],
            };
            this.mailDataId = {
                inbox_id: '',
                account_id: '',
                order_id: '',
                buyer_id: '',
                point: ''
            };
            this.sendForm = {
                user_id: '',
                message_id: '',
                reply_content: '',
                reply_content_translate: '',
                is_draft: '',
                pictures: [],
                template_id: '',
                quick_parameter: '',
            };
            // 清空文件
            this.fileList = [];

            this.mailDataId = {...this.mailDataId, ...this.$route.query};
            this.getMailProcessing();

            getHandleInfo().then(({data})=> {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.optionListLabel = {...this.optionListLabel, ...data.data_list};
            });

            // 获取快捷键
            getShortcutKey({platform_code: this.platform}).then(({data})=> {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.shortcutKeyArr = data.data_list;
                // 快捷键绑定，先解绑再绑定
                hotkeys.unbind(Object.keys(this.shortcutKeyArr).join(','));
                let _this = this;
                hotkeys(Object.keys(_this.shortcutKeyArr).join(','), function(event, handler) {
                    event.preventDefault();
                    if( _this.mailData.info && _this.mailData.info.tag && _this.mailData.info.tag.length >= 3 ){
                        _this.$message.warning('最多三个标签！');
                        return;
                    }
                    if( _this.shortcutKeyArr[handler.key] && _this.mailData.info.buyer_id ){
                        saveTag({buyer_id: _this.mailData.info.buyer_id, tag_id: _this.shortcutKeyArr[handler.key].id}).then(({data}) => {
                            if (data.status !== 1) {
                                _this.$message.error(data.errorMess || '操作失败')
                                return;
                            }
                            _this.handleOperationCallBack(data);
                        }).catch(error => {

                        });
                    }
                });
            });
        },
        // 执行操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success('操作成功！');
                this.getMailProcessing();
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        },
        // 日志
        handleOperateDaily() {
            getLogs({
                id: this.mailDataId.inbox_id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.logInfo.isShowLog = true;
                this.logInfo.tableData = data.data_list;
                this.logInfo.tableProps = ['action', 'operator', 'create_time'];
            }).catch(error => {

            });
        },
        changeNavShowFn(path, query = {}) {
            let idx = routerConfig.getRouteIndex(path);
            storage.setSessionStorage('navActive', idx);
            let to = routerConfig.navJumpFn(idx);
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name: to.name,
                index: idx,
                query
            });
            this.$store.commit('SAVE_NAV_INDEX', idx);
        },
        changeFnLanguage(code) {
            this.languageCodeO = code;
        },
        googleFnTranslate() {
            if( !this.languageCodeO ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.sendForm.reply_content ){
                return;
            }
            getGoogleTranslate({
                content: this.sendForm.reply_content,
                after: this.languageCodeO,
                before: "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.sendForm.reply_content_translate = data.after;
            });
        },
        goTransResFn(v) {
            if( v.isTranslate && v.isTranslate == 2 ){
                return;
            }
            this.$set(v, 'isTranslate', 1);
            getGoogleTranslateV2({
                content: v.body,
                language: 'en',
                platform_code: this.platform,
            }).then(({data}) => {
                this.$set(v, 'isTranslate', 2);
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.$set(v, 'translateEn', data.data_list);
            }).catch(err => {
                this.$set(v, 'isTranslate', 2);
                console.log(err);
            });
        },
        UpSuccess(response, file, fileList) {
            this.fileUploading = false;
            if( response.status !== 1 ){
                this.$message.error(response.errorMess || '上传失败！');
                this.uploadKey++;
                return;
            }
            this.fileList.push({name: file.name, url: file.response.file_path, size: file.size});
        },
        UpRemove(file, fileList) {
            this.fileList = JSON.parse(JSON.stringify(fileList));
        },
        overLimitFn(files, fileList) {
            this.$message.error('最多上传五个附件！');
        },
        beforeUpload(file) {
            // 格式检查
            let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            let extArr = ['gif', 'jpg', 'png', 'jpeg', 'bmp'];
            if( !extArr.includes(ext) ){
                this.$message.error('文件格式不符合！');
                return false;
            }

            // 当前文件大小检查
            let maxSize = 1024 * 1024 * 8;
            if( file.size > maxSize ){
                this.$message.error('文件大小必须在8m以内！');
                return false;
            }
            // 所有文件大小检查
            let allSize = this.fileList.map(e => e.size).reduce((total, currentValue, currentIndex, arr)=>{
                return total + currentValue;
            }, 0);
            if( file.size + allSize > maxSize ) {
                this.$message.error('所有文件大小必须在8m以内！');
                return false;
            }
            this.fileUploading = true;
        },
        UpPreview(file) {
            window.open('http://crmupload.yibainetwork.com:82' + file.url);
        },

        getMailProcessing() {
            let obj = {
                id: this.mailDataId.inbox_id,
                prev_next_ids: this.mailDataId.prev_next_ids,
            };
            // 获取邮件数据
            this.mailListLoading = true;
            getMailData(obj).then(({data}) => {
                this.mailListLoading = false;
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                // 字段兼容处理
                data.data_list.message_list.forEach(e => {
                    e.isEB = true;
                    e.mail_type = e.message_type == 'send' ? '3' : '';
                    e.account_name = data.data_list.account_name;
                    e.is_replied_name = e.is_replied == '0' ? '未回复' : '已回复';
                    if( e.mail_type == '3' ) {
                        e.receiver = e.recipient_id;
                        e.receive_date = e.create_time;
                        e.body = e.reply_content;
                        e.body_en = e.reply_content_en;
                        e.reply_by = e.create_by;
                        e.attachments = e.pictures.map(j => j.picture_url).join(',');
                    }else{
                        e.receive_date = e.message_time;
                        e.cusSendTime = e.create_time;
                        e.body = e.new_message;
                        e.attachments = e.img.map(j => j.orgial_img).join(',');
                    }
                });
                this.mailData = {...this.mailData, info: data.data_list, mail_list: data.data_list.message_list, prev: data.data_list.prev_next_info.prev, next: data.data_list.prev_next_info.next};
            }).catch(err => {
                this.mailListLoading = false;
                console.log(err);
            });

            this.orderListLoading = true;
            // 获取订单列表
            getOrderList({
                ...this.mailDataId,
                platform_code: this.platform,
                email_cate_id: '1',
            }).then(({data}) => {
                this.orderListLoading = false;
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                if( !Array.isArray(data.data_list) ){
                    this.mailData = {...this.mailData, order: data.data_list.email_order || [], parent_order: data.data_list.parent_order || [], chiled_order: data.data_list.chiled_order || [], more_order: data.data_list.more_order};
                    if( this.mailData.order.length ){
                        getOrderProItem({order_id: this.mailData.order[0].order_id, platform_code: this.platform}).then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }
                            this.optionListLabel = {...this.optionListLabel, parameter: data.data_list.data};
                        });
                        this.mailData.order.forEach(e => {
                            OrderCustomerComplaintInfo({order_id: e.order_id, platform_code: this.platform, cust_account_id: this.mailDataId.account_id}).then(({data}) => {
                                if (data.status !== 1) {
                                    this.$message.error(data.errorMess || '操作失败！');
                                    return;
                                }
                                this.$set(e, 'operation', data.data_list);
                                this.$set(e, 'dispute_cancel', data.data_list.dispute_cancel);
                                this.$set(e, 'dispute_inr', data.data_list.dispute_inr);
                                this.$set(e, 'dispute_return', data.data_list.dispute_return);
                            });
                        });
                    }
                }
            }).catch(err => {
                this.orderListLoading = false;
                console.log(err);
            });
        },
        sendFormFn(is_draft) {
            this.$refs.sendForm.validate((valid) => {
                if( valid ){
                    let obj = {
                        ...this.sendForm,
                        message_id: this.mailData.info.new_message_id,
                        pictures: this.fileList.map(e => {return {picture_name: e.name, picture_url: e.url}}),
                        is_draft: is_draft || 0,
                    };
                    sendMailData(obj).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.$message.success(is_draft ? '存为草稿成功！' : '发送成功！');
                        this.$refs.sendForm.resetFields();
                        this.$refs.upFile.clearFiles();
                        // 暂存当前
                        let curstr = this.getNavInfo(this.mailDataId);
                        // 跳往下一封邮件
                        this.resetPage('next');
                        // 发送成功删除当前邮件
                        this.$refs.ComMailProcessNav.handleDelCurItem(curstr);
                    }).catch(err => {
                        console.log(err)
                    });
                }
            });
        },
        tagRepliedFn() {
            let subject_id = this.mailData.info.subject_id;
            setReply({
                subject_id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.$message.success('操作成功！');
                this.$refs.sendForm.resetFields();
                this.$refs.upFile.clearFiles();
                // 暂存当前
                let curstr = this.getNavInfo(this.mailDataId);
                // 跳往下一封邮件
                this.resetPage('next');
                // 发送成功删除当前邮件
                this.$refs.ComMailProcessNav.handleDelCurItem(curstr);
            }).catch(error => {

            });
        },
        submitRemark(v, form) {
            if( !form.remark ){
                this.$message.error('备注不能为空！')
                return;
            }
            let obj = {
                order_id: v.order_id,
                remark: form.remark
            };
            let fn = addNewBatchRemark;
            if( form.remarkType !== '1' ){
                obj = {
                    order_id: v.order_id,
                    platform_code: this.platform,
                    remark: form.remark
                },
                fn = addNewShipRemark;
            }
            fn(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                form.remark = '';
                this.handleOperationCallBack(data);
            }).catch(err => {
                console.log(err)
            });
        },
        delRemarkFn(t, v, item) {
            this.$confirm('确认删除?', '提示', {
                type: 'warning'
            }).then(() => {
                let obj = {
                    id: '',
                    order_id: item.order_id,
                    platform_code: this.platform,
                    type: '1',
                };
                if( t === '1' ){
                    obj = {
                        id: v.id,
                        order_id: item.order_id,
                        platform_code: '',
                        type: '',
                    };
                }
                delRemarkInfo(obj).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.handleOperationCallBack(data);
                }).catch(err => {
                    console.log(err)
                });
            }).catch(() => {

            });
        },
        selectTagFn() {
            if( this.mailData.info && this.mailData.info.tag && this.mailData.info.tag.length >= 3 ){
                this.$message.warning('最多三个标签！');
                return;
            }
            this.selectTagObj.dialog = true;
            this.selectTagObj.form = {
                tag_id: '',
            };
            this.$nextTick(() => {
                this.$refs.batchTagForm.clearValidate();
            });
        },
        batchTagSubmitFn() {
            this.$refs.batchTagForm.validate((valid) => {
                if( valid ){
                    let buyer_id = this.mailData.info.buyer_id;
                    saveTag({buyer_id, tag_id: this.selectTagObj.form.tag_id}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.selectTagObj.dialog = false;
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                }
            });
        },
        templateChange(id) {
            getTemplateDetail({id}).then(({data}) => {
                this.sendForm.reply_content = (this.sendForm.reply_content ? this.sendForm.reply_content + '\n\n\n' : '') + data.data_list.values[0].template_content;
            });
        },
        changeOperation(v, row) {
            switch (v) {
                case '1':
                    // 新建售后单
                    this.orderInfo = {
                        order_id: row.order_id,
                        platform_code: row.platform_code,
                        operation: 'addNewAfterSaleSingle',
                        title:'新建售后单',
                        edit:false,
                    }
                    this.isOrderInfoShow = true;
                    break;
                case '2':
                    // 登记客诉单
                    this.orderInfo = {
                        order_id: row.order_id,
                        platform_code: row.platform_code,
                        operation: 'registeredRCustomerComplaintSlip',
                        title:'登记客诉单',
                        edit:false,
                    }
                    this.isOrderInfoShow = true;
                    break;
                case '3':
                    // 登记退款单
                    this.orderInfo = {
                        order_id: row.order_id,
                        platform_code: row.platform_code,
                        operation: 'registeredRefundSlip',
                        title:'登记退款单',
                        edit:false,
                    }
                    this.isOrderInfoShow = true;
                    break;
                case '4':
                    // 作废
                    this.obsoleteObj = {
                        dialog: true,
                        type: 1,
                        form: {
                            id: row.order_id,
                            platform_code: this.platform,
                            remark: '',
                        }
                    };
                    break;
                case '5':
                    // 暂扣
                    this.obsoleteObj = {
                        dialog: true,
                        type: 2,
                        form: {
                            id: row.order_id,
                            platform_code: this.platform,
                            remark: '',
                        }
                    };
                    break;
                case '6':
                    // 取消暂扣
                    batchCancelWithhold({
                        order_id: row.order_id,
                        platform_code: this.platform,
                        type: '1',
                    }).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.handleOperationCallBack(data);
                    }).catch(err => {
                        console.log(err);
                    });
                    break;
                case '8':
                    // 取消订单
                    this.handleCancellationOrder(row);
                    break;
                case '9':
                    // 留评
                    this.handleCommentOn(row);
                    break;
                case '10':
                    // 收款请求
                    this.handleReceiptRequest(row);
                    break;
                case '11':
                    // 登记收款
                    this.handleRegisterGathering(row);
                    break;
                case '12':
                    // 日志
                    this.orderJournal(row.order_id);
                    break;
            }
        },
        //取消订单
        handleCancellationOrder(row){
            if(!row.goods_list.length){
                this.$message.warning('该订单没有产品信息!');
                return;
            };
            this.orderStatus = row;
            let obj={
                order_id: row.order_id,
                platform_order_id: row.platform_order_id,
                payment_status: row.payment_status,
                paytime: row.paytime,
                transaction_id: row.goods_list[0].transaction_id,
                account_id: row.erp_account_id,
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
        // 订单日志
        orderJournal(orderId) {
            let obj = {
                order_id: orderId
            }
            this.isShowLogShow = true
            journalOperation(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.showLogTableData = data.data_list.records;
            }).catch(err => {
                console.log(err);
            });
        },

        // 留评
        handleCommentOn(row){
            this.form.title = '留评';
            if(!row.goods_list.length){
                this.$message.warning('该订单没有产品信息!');
                return;
            }
            this.replyBack={
                item_id:row.goods_list[0].item_id,//平台item_id
                platform_order_id:row.platform_order_id,//平台订单号
                before_translate_content:"",//评价内容翻译前
                buyer_id:row.buyer_id,//买家ID
                transaction_id:row.goods_list[0].transaction_id,//交易号
                account_id:row.erp_account_id,//账号ID
                type:1,
                platform_code:row.platform_code,//平台
                currency:row.currency,//币种
                sale_price:row.goods_list[0].sale_price,//产品价格
                site_id:row.site_id,//平台ID
                comment_text:""//翻译后
            };
            getCommentHeader({
                platfrom_code:row.platfrom_code,
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
                            tag: tagIndex?this.tag[tagIndex].value:"",
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
        //获取标签下拉数据
        handleGetTag(){
            getTag({platform_code: 'EB'}).then(({data}) => {
                this.tag = data.data_list;
            });
        },

        //收款请求弹窗控制
        handleReceiptRequest(row) {
            this.sendReceiptRequestInfo = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                account_id: row.erp_account_id,
                asin: row.goods_list.length?row.goods_list[0].asinval:"",
                currency:row.currency
            }
            collectionInformation().then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.collectionInfo = data.data_list;
                this.isReceiptRequestShow = true;
                this.sendReceiptRequestInfo.buyer_id = row.buyer_id;
                // this.sendReceiptRequestInfo.merchant_email = 'gohomenow111@163.com';
                // this.sendReceiptRequestInfo.payer_email = 'paypal@vbause.eu';
                this.sendReceiptRequestInfo.product_name = row.goods_list.length?row.goods_list[0].title:"";
            })
        },

        //登记收款弹窗控制
        handleRegisterGathering(row) {
            if(!row.paytime){
                this.$message.error('该订单未付款，不能进行收款登记操作！');
                return;
            }
            let obj = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                account_id:row.erp_account_id
            }
            registeredReceivablesData(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.RegisteredReceivablesInfo=data.data_list
                this.order = row;
                this.order.account_id = row.erp_account_id;
                this.sendRegisteredReceivablesInfo.receipt_bank = this.RegisteredReceivablesInfo.receipt_bank
                this.sendRegisteredReceivablesInfo.platform_code = row.platform_code; //平台
                this.sendRegisteredReceivablesInfo.order_id = row.order_id; //订单号
                this.sendRegisteredReceivablesInfo.account_id = row.erp_account_id; //账号id
                this.sendRegisteredReceivablesInfo.buyer_id = row.buyer_id; //客户ID
                this.sendRegisteredReceivablesInfo.receipt_type = '1';
            })
            this.isRegisteredReceivables = !this.isRegisteredReceivables;
        },

        submitObsoleteObj() {
            if( this.obsoleteObj.type == 1 ){
                toVoidInfo({
                    order_id: this.obsoleteObj.form.id,
                    platform_code: this.obsoleteObj.form.platform_code,
                    remark: this.obsoleteObj.form.remark
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.obsoleteObj.dialog = false;
                    this.handleOperationCallBack(data);
                }).catch(err => {
                    console.log(err);
                });
            }
            if( this.obsoleteObj.type == 2 ) {
                withhold({
                    order_id_list: this.obsoleteObj.form.id,
                    platform_code: this.obsoleteObj.form.platform_code,
                    remark: this.obsoleteObj.form.remark
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.obsoleteObj.dialog = false;
                    this.handleOperationCallBack(data);
                }).catch(err => {
                    console.log(err);
                });
            }
        },

        changeQuickParameter(v) {
            if( !this.optionListLabel.parameter[v] ){
                this.$message.warning('快捷参数内容为空！');
                return;
            }
            this.insertText(document.getElementById('maintextarea'), this.optionListLabel.parameter[v]);
            this.moveEnd(document.getElementById('maintextarea'));
        },

        // 在textarea光标位置插入文本
        insertText(obj, str) {
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.text = str;
            } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                // obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                this.sendForm.reply_content = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                // obj.value += str;
                this.sendForm.reply_content += str;
            }
        },

        moveEnd(obj) {
            this.$nextTick(() => {
                obj.focus();
            });
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
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },

        // 邮件标星
        setStar(star) {
            let obj = {
                star,
                buyer_id: this.mailData.info.buyer_id
            };
            setStar(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.mailData.info.star = star;
            }).catch(error => {

            });
        },

        // 删除邮件标签
        handleTagClose(v, i) {
            delTag({tag_id: v.tag_id, buyer_id: this.mailData.info.buyer_id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.mailData.info.tag.splice(i, 1);
            }).catch(() => {

            });
        },

        // 更多订单
        gotoOrderList() {
            let path = '/EbayOrderListManagement';
            this.$router.push({path: path, query: {...this.mailData.more_order, _cacheType: '1'}});

            this.changeNavShowFn(path);
        },

        // 编辑备注相关
        mailSubjectRemark(item) {
            this.remarkObj = {
                dialog: true,
                id: item.subject_id,
                type: 'subject',
                remark: item.remark,
                remark_origin: item.remark,
                item,
            };
        },
        mailRemark(item) {
            this.remarkObj = {
                dialog: true,
                id: item.id,
                type: 'message',
                remark: item.remark,
                remark_origin: item.remark,
                item,
            };
        },
        submitRemarkObj(item) {
            if( this.remarkObj.remark === this.remarkObj.remark_origin ){
                return;
            }
            setMailRemark({id: this.remarkObj.id, type: this.remarkObj.type, remark: this.remarkObj.remark}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.remarkObj.dialog = false;
                this.remarkObj.item.remark = this.remarkObj.remark;
            });
        },
        handleOrderInfo(item){
            this.orderInfo={
                order_id:item.order_id,
                platform_code:item.platform_code == undefined ? this.platform : item.platform_code,
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=true;
        },

        gotoFeedbackList(id) {
            let path = '/EbayEvaluateFeedBack';
            let query = {type: 'MailProcessing', item_id: id, _cacheType: '1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoReviewList(id) {
            let path = '/CustomerEvaluationReview';
            let query = {type: 'MailProcessing', order_id: id, _cacheType: '1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoAfterSalesOrderList(id) {
            let path = '/EbayAfterSalesOrderManagement';
            let query = {after_order_number: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoCustomerComplaintList(id) {
            let path = '/EbayCustomerComplaintList';
            let query = {customer_complaint_number: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoCancelList(row) {
            // let path = '/EbayCancel';
            // let query = {order_id: row.order_id, _cacheType:'1'};
            // this.$router.push({path, query});

            // this.changeNavShowFn(path);

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
        gotoInrList(row) {
            // let path = '/EbayINR';
            // let query = {order_id: row.order_id, _cacheType:'1'};
            // this.$router.push({path, query});

            // this.changeNavShowFn(path);

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
        gotoReturnList(row) {
            // let path = '/EbayReturn';
            // let query = {order_id: row.order_id, _cacheType:'1'};
            // this.$router.push({path, query});

            // this.changeNavShowFn(path);

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

        // 提取已有邮件处理列表关键字段方法
        getNavInfo(obj) {
            return JSON.stringify({
                inbox_id: obj.inbox_id,
                account_id: obj.account_id,
                order_id: obj.order_id,
                buyer_id: obj.buyer_id,
            });
        },

        // 打开改变当前客服人员选择框
        openUserIdChange() {
            this.customerChangeState = !this.customerChangeState;
            this.sendForm.user_id = this.mailData.info.user_number == 0 ? '' : this.mailData.info.user_number;
            this.getkefuFn(this.mailData.info.user_name);
        },
        // 获取客服人员
        userIdChangeRemoteMethod(query) {
            if( query ){
                this.getkefuFn(query);
            }
        },
        getkefuFn(query) {
            getkefu({account_name: query}).then(({data})=> {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.optionListLabel = {...this.optionListLabel, user: data.data_list};
            });
        },
        // 改变当前客服人员触发
        userIdChange(v) {
            if( !v ){
                return;
            }
            let subject_id = this.mailData.info.subject_id;
            saveKefu({subject_id, user_number: v}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.$message.success('修改当前客服人员成功！');
            }).catch(error => {

            });
        },

        // 获取退货编码
        handleobtainReturnCode(v){
            obtainReturnCode({order_id: v.order_id}).then(({data})=>{
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                v.refund_code = data.data_list.refund_code;
                this.$message.success('操作成功！');
            }).catch(error => {

            });
        },

        // 点击放大图片
        handleClickImg(url) {
            if (url) {
                this.imgPopPreview.thumb_url = url;
                this.imgPopPreview.pop_preview = true;
            }
        },
    },
    watch: {
        $route(to, from) {
            // 页面内切换路由
            if( to.path == this.curRouterData.split('?')[0] && from.path == this.curRouterData.split('?')[0] ){
                // 路由变化就重置数据
                if( this.curRouterData !== to.fullPath ){
                    this.curRouterData = to.fullPath;
                    this.initData();
                }
            }
        },

    },
    filters: {
        orderStatusFilter(v) {
            let str = '';
            switch (v) {
                case 0:
                    str = '初始化';
                    break;
                case 1:
                    str = '正常订单';
                    break;
                case 5:
                    str = '异常订单';
                    break;
                case 10:
                    str = '缺货订单';
                    break;
                case 13:
                    str = '已备货订单';
                    break;
                case 15:
                    str = '待发货订单';
                    break;
                case 17:
                    str = '超期订单';
                    break;
                case 19:
                    str = '部分发货订单';
                    break;
                case 20:
                    str = '已发货订单';
                    break;
                case 25:
                    str = '暂扣订单';
                    break;
                case 40:
                    str = '已取消订单';
                    break;
                case 45:
                    str = '已完成订单';
                    break;
                case 99:
                    str = '通途系统处理订单';
                    break;
                case 90:
                    str = '借用领用单确认收货';
                    break;
                case 91:
                    str = '借用领用单已经部分归还';
                    break;
                case 92:
                    str = '借用领用单已经全部归还';
                    break;
                case 119:
                    str = '待检测paypal账号';
                    break;
            }
            return str;
        }
    },
}
</script>
