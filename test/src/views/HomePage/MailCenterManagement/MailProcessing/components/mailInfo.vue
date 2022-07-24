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
                                    客户ID：{{mailDataId.buyer_id == 'null' ? '' : mailDataId.buyer_id}}&nbsp;&nbsp;&nbsp;&nbsp;<el-tag v-for="(v, k, i) in mailData.info.tag" size="small" closable @close="handleTagClose(k)" :key="i">{{(v || '').substr(0,10)}}</el-tag>
                                </p>
                                <p>买家邮箱：{{mailData.info.buyer_email}}</p>
                            </div>
                            <div>
                                <span v-if="mailData.info.is_star == '2'" @click="setStar(1)" class="icon-biaoxing" style="font-size: 24px; color: #ff3332; cursor: pointer;"></span>
                                <span v-else @click="setStar(2)" class="icon-biaoxing" style="font-size: 24px; color: #999; cursor: pointer;"></span>
                            </div>
                        </div>
                        <div class="MailProcessingsubject">
                            <div class="subjectremark">
                                <p>最新主题：{{mailData.info.subject}}</p>
                                <p style="margin-top: 5px;">最新收取时间：{{mailData.mail_list.length ? mailData.mail_list[0].receive_date : ''}}</p>
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
                                @gotoDisputeCenterList="gotoDisputeCenterList"
                                @gotoAfterSalesOrderList="gotoAfterSalesOrderList"
                                @gotoCustomerComplaintList="gotoCustomerComplaintList"
                                @handleobtainReturnCode="handleobtainReturnCode"
                                @gotoFeedbackList="gotoFeedbackList"
                                @gotoReviewList="gotoReviewList"
                                @delRemarkFn="delRemarkFn"
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
                                    <p>发件邮箱：{{mailData.info.sender_email}}</p>
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
                                            <el-form-item label="邮件分类：">
                                                <el-cascader
                                                    v-model="sendForm.mail_category"
                                                    @change="mailCategoryChange"
                                                    :options="optionListLabel.mail_category"
                                                    :show-all-levels="false"
                                                    clearable
                                                    popper-class="zindexhighest"
                                                    style="width: 100%;">
                                                </el-cascader>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-row>
                                                <el-col :span="20">
                                                    <el-form-item label="模板选择：">
                                                        <el-select v-model="sendForm.template_id" @change="templateChange" size="small" filterable v-filter style="width: 100%;" popper-class="zindexhighest">
                                                            <el-option
                                                                v-for="(v, k, i) in optionListLabel.template"
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
                                    <el-form-item label="邮件主题：">
                                        <el-select v-model="sendForm.inbox_id" @change="changeSubjectList" size="small" filterable v-filter style="width: 100%;" popper-class="zindexhighest">
                                            <el-option
                                            v-for="(v, k) in mailData.subject_list"
                                            :key="k"
                                            :label="v.value"
                                            :value="v.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="reply_title" label="回复主题：">
                                        <el-input v-model="sendForm.reply_title" placeholder="请输入"></el-input>
                                    </el-form-item>
                                    <el-form-item label="翻译后语言：">
                                        <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" :list="optionListLabel.google_lang_code" notxt></ComSelectLanguageV2>
                                    </el-form-item>
                                    <el-form-item prop="reply_content" :label="languageCode ? '翻译前：' : ''">
                                        <el-input v-model="sendForm.reply_content" id="maintextarea" type="textarea" :rows="languageCode ? '12' : '25'"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="languageCode" label="翻译后：">
                                        <el-input v-model="sendForm.reply_content_en" type="textarea" rows="12"></el-input>
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
                                                <span class="uploadleftspan" slot="tip">支持gif、jpg、png、jpeg、bmp、pdf、docx、xlsx、doc、xls、zip、rar格式，大小不能超过8M</span>
                                            </el-upload>
                                        </div>
                                    </div>
                                    <div class="sendlogedit">
                                        <div>
                                            <el-button @click="sendFormFn()" type="primary" size="small">发送</el-button>
                                            <el-button @click="selectTagFn()" type="primary" size="small" plain>选择标签</el-button>
                                            <el-button @click="batchForward()" type="primary" size="small" plain>转发</el-button>
                                            <el-button @click="handleOperateDaily()" type="primary" size="small" plain>日志</el-button>
                                            <el-button @click="saveAsDraftFn()" type="primary" size="small" plain>存为草稿</el-button>
                                            <el-button @click="tagRepliedFn()" type="primary" size="small" plain>标记已回复</el-button>
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

        <!-- 批量标签 -->
        <el-dialog
            class="ui-layout_edit-dialog zindexhighest"
            title="批量标签"
            width="430px"
            :visible.sync="selectTagObj.dialog">
            <div>
                <el-form :model="selectTagObj.form" :rules="formRules" ref="batchTagForm" size="small" label-width="100px">
                    <el-form-item prop="tag_id" label="批量标签：">
                        <el-select v-model="selectTagObj.form.tag_id" filterable v-filter clearable popper-class="zindexhighest">
                            <el-option
                                v-for="(v, k, i) in optionListLabel.tag_id"
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
                <el-input v-model="remarkObj.remark" maxlength="100" show-word-limit placeholder="请输入" size="small" style="width: 100%;" class="showwordlimitipt"></el-input>
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
    </div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    getMailData,
    sendMailData,
    confirmMailData,
    getGoogleTranslateV2,
    setMailRemark,
    setMailSubjectRemark,
    delTag,
    getShortcutKey,
    getOrderList,
    getPrevNext,
    addkefu,
    obtainReturnCode,
    addNewBatchRemark,
    addNewShipRemark,
    delRemarkInfo,
    toVoidInfo,
    withhold,
    batchCancelWithhold,
    invoiceDetailsInterface,
    submitInvoiceInterface,
    OrderCustomerComplaintInfo,
} from '@/api/MailCenterManagement/MailProcessing';
import {
    getTemplateDetail,
    getGoogleTranslate,
    getItemTemplate,
    getOrderProItem,
    getDraftBoxMail,
    getOutBoxMail,
} from '@/api/MailCenterManagement/PostMail';
import {
    getLogs,
    addStar,
    addTag,
    addClass,
    getkefu,
} from '@/api/MailCenterManagement/Inbox';
import {
    tagReply,
} from '@/api/Amazon/MessageCenter';
import hotkeys from 'hotkeys-js';
import routerConfig from '@/router/routerConfig';
import OrderInvoiceInfo from "@/views/HomePage/OrderManagement/component/OrderInvoice.vue";
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import mailList from "@/views/HomePage/MailCenterManagement/MailProcessing/components/mailList";
import orderList from "@/views/HomePage/MailCenterManagement/MailProcessing/components/orderList";
import * as storage from '@/utils/storage';
import { getSessionStorage } from '@/utils/storage';

export default {
    name: 'MailProcessing',
    data () {
        return {
            orderInfo:{},
            isOrderInfoShow:false,//订单详情弹窗

            // 邮件列表加载动画
            mailListLoading: false,
            // 订单列表加载动画
            orderListLoading: false,

            sendForm: {
                platform_code: '',
                inbox_id: '',
                reply_content: '',
                reply_content_en: '',
                reply_title: '',
                template_id: '',
                order_id: '',
                platform_order_id: '',
                sender_email: '',
                sender_name: '',
                receive_name: '',
                receive_email: '',
                account_id: '',
                attachments: '',
                attachments_name: '',
                mail_category: [],
                user_id: '',
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
            languageCode: '',
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
                subject_list: [],
            },
            customerChangeState: false,
            formRules: {
                reply_title: [
                    {required: true, message: '请输入', trigger: 'blur'},
                ],
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
            platform: 'Amazon',

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
                tag_id: {},
                template: {},
                quick_parameter: {},
                parameter: {},
                mail_category: [],
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

            // 保存路由数据，判断是否重置数据
            curRouterData: ''
        }
    },
    components: {ComSelectLanguageV2, OrderInvoiceInfo, OrderInformation, mailList, orderList},
    computed: {
        ...mapGetters([
            'queryParamsInfo'
        ])
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
                if( !this.mailData[f].id ){
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
                        buyer_email: this.mailData[f].buyer_email,
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
                subject_list: [],
            };
            this.mailDataId = {
                inbox_id: '',
                account_id: '',
                order_id: '',
                buyer_id: '',
                point: ''
            };
            this.sendForm = {
                platform_code: '',
                inbox_id: '',
                reply_content: '',
                reply_content_en: '',
                reply_title: '',
                template_id: '',
                order_id: '',
                platform_order_id: '',
                sender_email: '',
                sender_name: '',
                receive_name: '',
                receive_email: '',
                account_id: '',
                attachments: '',
                attachments_name: '',
                mail_category: [],
                user_id: '',
            };
            // 清空文件
            this.fileList = [];

            this.mailDataId = {...this.mailDataId, ...this.$route.query};
            this.getMailProcessing();

            getItemTemplate().then(({data})=> {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                // 处理分类字段
                let arr = [];
                data.data_list.mail_category.forEach(e => {
                    let obj = {
                        value: e.id + '',
                        label: e.name
                    };
                    if( e.chileden && e.chileden.length ){
                        let arr2 = [];
                        e.chileden.forEach(j => {
                            arr2.push({
                                value: j.id + '',
                                label: j.name
                            });
                        });
                        obj.children = arr2;
                    }
                    arr.push(obj);
                });
                this.optionListLabel = {...this.optionListLabel, ...data.data_list, mail_category: arr};
            });

            // 获取快捷键
            getShortcutKey().then(({data})=> {
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
                    if( _this.mailData.info && _this.mailData.info.tag && Object.keys(_this.mailData.info.tag).length >= 3 ){
                        _this.$message.warning('最多三个标签！');
                        return;
                    }
                    if( _this.shortcutKeyArr[handler.key] && _this.mailDataId.inbox_id ){
                        addTag({buyer_email: _this.mailData.info.buyer_email, tag_id: _this.shortcutKeyArr[handler.key].id, platform_code: _this.platform}).then(({data}) => {
                            if (data.status !== 1) {
                                _this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }
                            _this.$set(_this.mailData.info, 'tag', {
                                ...(_this.mailData.info.tag || {}),
                                [data.data_list[0][0]]: _this.shortcutKeyArr[handler.key].name
                            });
                        }).catch(error => {

                        });
                    }
                });
            });

            // 草稿箱修改进来的
            if( this.$route.query.draft_box ){
                getDraftBoxMail({id: this.$route.query.draft_box}).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.sendForm = {
                        ...this.sendForm,
                        ...data.data_list,
                        reply_content: data.data_list.content,
                        reply_title: data.data_list.subject,
                        template_id: data.data_list.template_id === '0' ? '' : data.data_list.template_id
                    };
                    // 填充已传文件列表
                    let files = (this.sendForm.attachments || '').split(',');
                    if( this.sendForm.attachments && files.length ){
                        files.forEach((e, i) => {
                            let name = '附件' + (i+1);
                            if( this.sendForm.attachments_name && this.sendForm.attachments_name.split(',')[i] ){
                                name = this.sendForm.attachments_name.split(',')[i];
                            }
                            this.fileList.push({
                                name: name,
                                url: e
                            });
                        });
                    }
                });
            }

            // 发件箱修改进来的
            if( this.$route.query.out_box ){
                getOutBoxMail({id: this.$route.query.out_box}).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.sendForm = {
                        ...this.sendForm,
                        ...data.data_list,
                        reply_content: data.data_list.content,
                        reply_title: data.data_list.subject,
                        template_id: data.data_list.template_id === '0' ? '' : data.data_list.template_id
                    };
                    // 填充已传文件列表
                    let files = (this.sendForm.attachments || '').split(',');
                    if( this.sendForm.attachments && files.length ){
                        files.forEach((e, i) => {
                            let name = '附件' + (i+1);
                            if( this.sendForm.attachments_name && this.sendForm.attachments_name.split(',')[i] ){
                                name = this.sendForm.attachments_name.split(',')[i];
                            }
                            this.fileList.push({
                                name: name,
                                url: e
                            });
                        });
                    }
                });
            }
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
                limit: 1000,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                if (data.data_list.value) {
                    this.logInfo.tableData = data.data_list.value;
                    this.logInfo.tableProps = ['behavior', 'created_by_name', 'created_at'];
                }
                this.logInfo.isShowLog = true;
            }).catch(error => {

            });
        },
        // 转发
        batchForward() {
            let type = 'Inbox';
            if( ['DraftBox', 'Outbox'].includes(this.$route.query.type) ){
                type = this.$route.query.type;
            }
            let path = '/PostMail';
            let query = {id: this.mailDataId.inbox_id, type: type, goBackUrl: JSON.stringify({path: this.$route.path, pathName: this.$route.query.routerPathName, query: this.$route.query})};
            this.$router.push({path, query});

            this.changeNavShowFn(path, query);
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
        changeLanguage(code) {
            this.languageCode = code;
        },
        googleTranslate() {
            if( !this.languageCode ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.sendForm.reply_content ){
                return;
            }
            getGoogleTranslate({
                content: this.sendForm.reply_content,
                after: this.languageCode,
                before: "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.sendForm.reply_content_en = data.after;
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
            let extArr = ['gif', 'jpg', 'png', 'jpeg', 'bmp', 'pdf', 'docx', 'xlsx', 'doc', 'xls', 'zip', 'rar'];
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
                ...this.mailDataId,
                buyer_id: encodeURIComponent(this.mailDataId.buyer_id || ''),
            };
            // 获取邮件数据
            this.mailListLoading = true;
            getMailData({...obj, after_before_id_list: ''}).then(({data}) => {
                this.mailListLoading = false;
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                let subject_list = [];
                if( data.data_list.subject_list ){
                    Object.keys(data.data_list.subject_list).forEach(e => {
                        subject_list.push({
                            id: e,
                            value: data.data_list.subject_list[e]
                        });
                    });
                }
                this.mailData = {...this.mailData, ...data.data_list, subject_list: subject_list};
                // 赋值邮件分类下拉框
                this.sendForm.mail_category = this.mailData.info.mail_category;

                // 主题输入框填充最新的一条
                if( this.mailData.subject_list.length ){
                    let titObj = this.mailData.subject_list[this.mailData.subject_list.length - 1]
                    this.sendForm.inbox_id = titObj.id;
                    this.sendForm.reply_title = 'Re：' + titObj.value;
                }

                // 添加系统订单号
                this.sendForm = {
                    ...this.sendForm,
                    platform_order_id: this.mailData.info.platform_order_id
                };
            }).catch(err => {
                this.mailListLoading = false;
                console.log(err);
            });

            this.orderListLoading = true;
            // 获取订单列表
            getOrderList({...obj, buyer_email: this.mailDataId.buyer_email, after_before_id_list: ''}).then(({data}) => {
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
                            OrderCustomerComplaintInfo({order_id: e.order_id, platform_order_id: e.platform_order_id}).then(({data}) => {
                                if (data.status !== 1) {
                                    this.$message.error(data.errorMess || '操作失败！');
                                    return;
                                }
                                this.$set(e, 'operation', data.data_list);
                            });
                        });
                    }
                }
            }).catch(err => {
                this.orderListLoading = false;
                console.log(err);
            });

            // 获取上一页下一页
            getPrevNext({...obj}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.mailData = {...this.mailData, next: data.data_list.next, prev: data.data_list.prev};
            });
        },
        sendFormFn() {
            this.$refs.sendForm.validate((valid) => {
                if( valid ){
                    let obj = {
                        ...this.sendForm,
                        attachments: this.fileList.map(e => e.url).join(','),
                        attachments_name: this.fileList.map(e => e.name).join(','),
                        platform_code: this.platform,
                        inbox_id: this.sendForm.inbox_id || this.mailDataId.inbox_id,
                        order_id: this.mailDataId.order_id,
                        sender_email: this.sendForm.sender_email || this.mailData.info.sender_email,
                        receive_email: this.sendForm.receive_email || this.mailData.info.buyer_email,
                        account_id: this.mailDataId.account_id,
                        point: this.mailDataId.point,
                        buyer_id: this.mailData.info.buyer_id,
                        email_cate_id: this.mailDataId.email_cate_id,
                    };
                    sendMailData(obj).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.$message.success('发送成功！');
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
        saveAsDraftFn() {
            this.$refs.sendForm.validate((valid) => {
                if( valid ){
                    let obj = {
                        mail_category: this.sendForm.mail_category.length ? this.sendForm.mail_category[this.sendForm.mail_category.length-1] : '',
                        ...this.sendForm,
                        attachments: this.fileList.map(e => e.url).join(','),
                        attachments_name: this.fileList.map(e => e.name).join(','),
                        platform_code: this.platform,
                        inbox_id: this.sendForm.inbox_id || this.mailDataId.inbox_id,
                        order_id: this.mailDataId.order_id,
                        sender_email: this.sendForm.sender_email || this.mailData.info.sender_email,
                        receive_email: this.sendForm.receive_email || this.mailData.info.buyer_email,
                        account_id: this.mailDataId.account_id,
                        is_draft: true,
                        point: this.mailDataId.point,
                        buyer_id: this.mailData.info.buyer_id,
                        email_cate_id: this.mailDataId.email_cate_id,
                    };
                    confirmMailData(obj).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.$message.success('保存成功！');
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
            let buyer_email = this.mailData.info.buyer_email;
            if( !buyer_email ){
                this.$message.warning('请等待邮件加载完毕再进行操作！');
                return;
            }
            let account_id = this.mailDataId.account_id;
            tagReply({buyer_email, account_id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
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
            }).catch(err => {
                console.log(err)
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
            if( this.mailData.info && this.mailData.info.tag && Object.keys(this.mailData.info.tag).length >= 3 ){
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
                    addTag({buyer_email: this.mailData.info.buyer_email, tag_id: this.selectTagObj.form.tag_id, platform_code: this.platform}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.$set(this.mailData.info, 'tag', {
                            ...(this.mailData.info.tag || {}),
                            [data.data_list[0][0]]: this.optionListLabel.tag_id[this.selectTagObj.form.tag_id]
                        });
                        this.selectTagObj.dialog = false;
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
                case '7':
                    // 登记发票
                    this.orderInvoice(row, false);
                case '8':
                    // B2B发票
                    this.orderInvoice(row, true);
                    break;

            }
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

        //发票
        orderInvoice(row,bol){
            if(row.paytime==''||row.paytime==null){
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
        //提交发票
        handleSubmitInvoiceInterface(obj){
            submitInvoiceInterface(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }else{
                    this.$message.success('操作成功！');
                }
                // this.handleOperationCallBack(data);
            }).catch(err => {
                console.log(err);
            });
        },
        handleIsInvoiceShow(bol){
            this.isInvoice = bol;
        },

        // 邮件标星
        setStar(flag) {
            let obj = {
                is_star: flag,
                sender_email: this.mailData.info.buyer_email
            };
            addStar(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.mailData.info.is_star = flag;
            }).catch(error => {

            });
        },

        // 删除邮件标签
        handleTagClose(k) {
            delTag({id: k}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                delete this.mailData.info.tag[k];
                this.$forceUpdate();
            }).catch(() => {

            });
        },

        gotoOrderList() {
            let path = '/OrderListManagement';
            this.$router.push({path: path, query: {...this.mailData.more_order, _cacheType: '1'}});

            this.changeNavShowFn(path);
        },
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },
        changeSubjectList(val) {
            this.sendForm.reply_title = 'Re：' + this.mailData.subject_list.find(e => e.id === val).value;
        },

        // 编辑备注相关
        mailSubjectRemark(item) {
            this.remarkObj = {
                dialog: true,
                id: item.subject_id,
                remark: item.remark,
                remark_origin: item.remark,
                item,
                type: '1'
            };
        },
        mailRemark(item) {
            this.remarkObj = {
                dialog: true,
                id: item.id,
                remark: item.remark,
                remark_origin: item.remark,
                item,
                type: '2'
            };
        },
        submitRemarkObj(item) {
            if( this.remarkObj.remark === this.remarkObj.remark_origin ){
                return;
            }
            let url = setMailSubjectRemark;
            let params = {subject_id: this.remarkObj.id, remark: this.remarkObj.remark};
            if( this.remarkObj.type === '1' ){
                // 不处理 默认是'1'
            }
            if( this.remarkObj.type === '2' ){
                url = setMailRemark;
                params = {inbox_id: this.remarkObj.id, remark: this.remarkObj.remark};
            }
            url(params).then(({data}) => {
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
                platform_code:item.platform_code == 'undefined' ? this.platform : item.platform_code,
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=true;
        },

        gotoFeedbackList(id) {
            let path = '/CustomerReviewsFeedBack';
            let query = {type: 'MailProcessing', order_id: id, _cacheType: '1'};
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
            let path = '/AfterSalesOrderManagement';
            let query = {after_order_number: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoCustomerComplaintList(id) {
            let path = '/CustomerComplaintList';
            let query = {customer_complaint_number: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoDisputeCenterList(id) {
            let path = '/DisputeCenter';
            let query = {order_id: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
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

        // 改变邮件分类触发
        mailCategoryChange(v) {
            addClass({inbox_id: this.sendForm.inbox_id || this.mailDataId.inbox_id, mail_category: v[1], first_mail_category: v[0]}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.$message.success('修改邮件分类成功！');
            }).catch(error => {

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
            addkefu({account_id: this.mailDataId.account_id, platform_order_id: this.mailData.info.platform_order_id, buyer_email: this.mailData.info.buyer_email, inbox_id: this.mailDataId.inbox_id, email_cate_id: this.mailDataId.email_cate_id, user_id: v}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
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

    }
}
</script>
