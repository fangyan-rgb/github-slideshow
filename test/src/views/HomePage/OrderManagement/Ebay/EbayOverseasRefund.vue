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
                        <div>平台账号：{{scope.row.account_name}}</div>
                        <div>买家ID：{{scope.row.buyer_id}}</div>
                    </template>
                    <!-- 订单信息 -->
                    <template slot-scope="scope" slot="orderInfo">
                        
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单号：</div>
                            <div style="word-wrap:break-word;cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</div>
                        </div>
                        <div>订单状态：
                            <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '初始化'"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.order_status === '正常'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.order_status === '异常'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '缺货'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '已备货'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '待发货'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.order_status === '超期'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '部分发货'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '已发货'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.order_status === '暂扣'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '已取消'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '已完成'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '通途系统处理订单'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '待检测paypal账号'"></span>
                            {{scope.row.order_status}}
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">付款时间：</div>
                            <div style="flex:1;word-wrap:break-word;">{{scope.row.paytime}}</div>
                        </div>
                        <div style="display: flex;justify-content: flex-start;">
                            <div style="white-space:nowrap;">订单金额：</div>
                            <div style="flex:1;word-wrap:break-word;"><span style="color:#ff9900;font-weight: 700;">{{scope.row.order_price}} {{scope.row.currency}}</span></div>
                        </div>
                    </template>
                    <!-- 发货信息 -->
                    <template slot-scope="scope" slot="deliverGoodsInfo">
                        <div>发货仓库：{{scope.row.warehouse_name}}</div>
                        <div>邮寄方式：{{scope.row.shipped_name}}</div>
                        <div>跟踪号：{{scope.row.trackno}}</div>
                    </template>
                    <!-- 退货信息 -->
                    <template slot-scope="scope" slot="returnGoodsInfo">
                        <div>退件单号：{{scope.row.return_number}}</div>
                        <div>退回仓库：{{scope.row.back_warehouse_name}}</div>
                        <div>物流公司：{{scope.row.carrier}}</div>
                        <div>退货编码：{{scope.row.refund_code}}</div>
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
                                                <div style="cursor: pointer;color: #409EFF;line-heigth:16px;" @click="handleGoDispute(item)">{{item.inquiry_id||item.cancel_id||item.return_id}}</div>
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
                            <span class="ui-state_circle grayColor" v-if="!scope.row.is_replied"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.is_replied === '已回复'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.is_replied === '已回复未发送'"></span>
                            <span v-show="!scope.row.is_replied" v-html="'无消息'"></span>
                            <span v-show="scope.row.is_replied">
                                <span style="cursor: pointer;color: #409EFF;" @click="goMessagejump(scope.row)">
                                    {{scope.row.is_replied}}
                                </span>
                            </span>
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
                            <span class="ui-state_circle blueColor" v-if="scope.row.refund_status === '退款完成'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.refund_status === '退款失败'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '退款中'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.refund_status === '等待接受退款中'"></span>
                            {{scope.row.refund_status}}
                        </div>
                        <!-- <div>售后问题：{{scope.row.type}}</div> -->
                    </template>
                    <!-- 备注 -->
                    <template slot-scope="scope" slot="remarks">
                        {{scope.row.remark}}
                    </template>
                    <!-- 处理信息 -->
                    <template slot-scope="scope" slot="handleInfo">
                        <div>是否收货：{{scope.row.is_receipt}}</div>
                        <div>是否处理：{{scope.row.state}}</div>
                        <div>是否取消：{{scope.row.is_cancel}}</div>
                        <div>建单时间：{{scope.row.create_time}}</div>
                        <div>收货时间：{{scope.row.receipt_time}}</div>
                    </template>
                    <!-- 处理信息 -->
                    <template slot-scope="scope" slot="handleInfo">
                        <div>是否收货：{{scope.row.is_receipt}}</div>
                        <div>是否处理：{{scope.row.state}}</div>
                        <div>是否取消：{{scope.row.is_cancel}}</div>
                        <div>建单时间：{{scope.row.create_time}}</div>
                        <div>收货时间：{{scope.row.receipt_time}}</div>
                    </template>
                    <!-- 操作 -->
                    <template slot-scope="scope" slot="operate">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <el-button type="text">操作<div class="triangle"></div>
                                </el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <!-- 新建售后单 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" v-if="buttonList['newSalesOrder'].permit(thisVm)"
                                        @click="handleAfterSalesOrders(scope.row,'addNewAfterSaleSingle','新建售后单')">
                                            新建售后单</el-button>
                                </el-dropdown-item>
                                <!-- 消息联系 -->
                                <el-dropdown-item>
                                    <el-button style="width:100%;font-size:12px;" type="text" 
                                    v-if="buttonList['messageContact'].permit(thisVm)"
                                        @click="handleMessageContact(scope.row,true)">消息联系</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <ComDivide />
                        <el-button type="text" v-if="buttonList['diaryLog'].permit(thisVm)" @click="handleOrderLog(scope.row.id)">日志</el-button>
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
            <!-- 订单详情 -->
            <OrderInformation
                v-if="isOrderInfoShow"
                :isOrderInfoShow="isOrderInfoShow"
                :orderInfo="orderInfo"
                @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
                @handleReload="handleReload">
            </OrderInformation>

            <!-- 日志弹框 -->
            <el-dialog width="950px" class="ui-layout_edit-dialog logs" title="日志" :visible.sync="isShowLogShow">
                <ComPreviewTable
                    :isAdaptiveHeight="false"
                    :logKey="['操作日志', '操作人', '操作时间']"
                    :logProps="['content', 'created_by_name', 'created_at']"
                    :logData="showLogTableData"
                    :logWidth="['', '180', '180']">
                    <template slot-scope="scope" slot="content">
                        <div v-html="scope.row.content"></div>
                    </template>
                </ComPreviewTable>
            </el-dialog>
            <!-- 新建退款后的提示 -->
            <!-- <el-dialog
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
            </el-dialog> -->

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
                                <el-form-item label="模板选择：" label-width="80px">
                                    <el-select placeholder="请选择" size="mini" v-model="form.templateChoose" filterable v-filter @change="handleSelectionTemplate()">
                                        <el-option v-for="(value, key, index) in dataComment.template"
                                                :label="value"
                                                :value="key"
                                                :key="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <TemplateEdit :platform="'EB'" class="templateChange" @selectTemplate="templateChange" />
                        </div>
                        <div v-if="form.title!=='留评'">
                            <el-form-item label="添加标签：" label-width="120px">
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
    getEbayReturnGoodsSeasList,
    getEbayReturnGoodsSeasLog
} from '../../../../api/orderInfo/Ebay/EbayOverseasRefund';
import OrderInformation from '../OrderInformation';
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import {
    getGoogleTranslate,
    getTemplateDetail,
} from '@/api/MailCenterManagement/PostMail';
import {
    getCommentHeader,
} from '../../../../api/orderInfo/Ebay/OrderListManagement';
import routerConfig from '@/router/routerConfig';
import {getTag} from '../../../../api/MailCenterManagement/Inbox';
import * as storage from '@/utils/storage';

export default {
    name: 'EbayOverseasRefund',
    components: {
        OrderInformation,
        ComSelectLanguageV2
    },
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['基础信息', '订单信息', '发货信息', '退货信息', '关联信息', '退件备注', '处理信息', '操作'],
            tableProps: ['basicsInfo', 'orderInfo', 'deliverGoodsInfo', 'returnGoodsInfo', 'relationState', 'remarks', 'handleInfo', 'operate'],
            tableWidth: ['240', '200', '200', '200', '180', '230', '200', '200'],
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
                mainQuery: {},
            },

            //订单详情相关
            isOrderInfoShow:false,
            orderInfo:{},

            //消息联系
            isTemplateChooseShow:false,
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
            activeContactRow:{},
            activeContact:{
                reply_title:'',
                reply_content:"",
                reply_content_en:"",
                ebay_order:[]
            },

            //日志
            isShowLogShow:false,
            showLogTableData:[],

            //提示
            tips:{
                currentTime:"",
                paytime:"",
                intervalTime:"",
                isShow:false,
                row:{},
            },

            batchRules: {
                before_translate_content: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
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
                reason: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
            },
        }
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
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
                this.queryData = JSON.parse(this.queryParamsInfo['dispute_refund_result']);
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
                offset: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                limit: this.pageData.currentList
            };

            this.tableLoading = true;
            getEbayReturnGoodsSeasList(obj).then(({data}) => {
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
                key: 'dispute_refund_result',
                value: JSON.stringify(this.queryData)
            });
            this.tableData = data.data_list.value;

            // 渲染分页
            this.pageData.currentPage = data.page_data.offset * 1;
            this.pageData.currentList = data.page_data.limit * 1;
            this.pageData.currentTotal = data.page_data.total * 1;

            // 重置表格高度
            this.searchHeight = !this.searchHeight;
        },

        // 重置
        handleResetQueryInfo(){
            this.queryData = {
                fast_mail_category: '',
                fast_is_replied: '',
                fast_tag_id: '',
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
        
        //售后弹窗
        handleAfterSalesOrders(row,identification,title){
            this.tips.row=row;
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:title,
                operation:identification,
                type: 'refund'
            }
            this.isOrderInfoShow=true;
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

        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },

        handleReload(){
            this.handleQueryInfo({...this.queryData.mainQuery}, true);
        },

        //关闭按钮
        // handleCancelTips(){
        //     this.tips={
        //         currentTime:"",
        //         paytime:"",
        //         intervalTime:"",
        //         isShow:false,
        //     }
        // },

        //提示的取消订单按钮
        // handleIsCancelOrder(){
        //     this.handleCancellationOrder(this.tips.row);
        // },

        //消息联系\批量消息联系
        handleMessageContact(row,bool){
            this.form.title = '消息联系';
            this.activeContactRow=row;
                // if(!row.order_comm_detail_list.length){
                //     this.$message.warning('该订单没有产品信息!');
                //     return;
                // }
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
        //消息联系提交
        handleTemplateChooseConfirm(){
            this.replyBack.before_translate_content = this.form.before_translate_content;
            this.replyBack.comment_text = this.form.comment_text?this.form.comment_text:this.form.before_translate_content;
            let tagIndex = this.tag.findIndex((item)=>{ return this.form.tag_id == item.id});
            this.$refs['from'].validate(res => {
                if (res) {
                        this.activeContact={
                            // reply_title: this.form.template.template_title,
                            reply_content:  this.form.comment_text?this.form.comment_text:this.form.before_translate_content,
                            reply_content_en: this.form.before_translate_content,
                            tag: tagIndex>-1?this.tag[tagIndex].value:"",
                            tag_id: this.form.tag_id,
                            ebay_order:[{
                                sender: this.activeContactRow.account_name,
                                item_id: this.activeContactRow.order_comm_detail_list[0].item_id,
                                question_type: '',
                                account_id: this.activeContactRow.kefu_account_id,
                                recipient_id: this.activeContactRow.buyer_id,
                                platform_order_id: this.activeContactRow.platform_order_id,
                                platform_code: this.activeContactRow.platform_code,
                                template_id:this.form.templateChoose,
                            }]
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
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //取消消息联系提交
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
        //获取标签下拉数据
        handleGetTag(){
            getTag({platform_code: 'EB'}).then(({data}) => {
                this.tag = data.data_list;
            });
        },
        //更多按钮
        templateChange(id) {
            this.form.templateChoose = id;
            getTemplateDetail({id}).then(({data}) => {
                this.form.before_translate_content = (this.form.before_translate_content ? this.form.before_translate_content + '\n\n\n' : '') + data.data_list.values[0].template_content;
            });
        },

        //日志
        handleOrderLog(id){
            let obj = {
                id: id
            }
            this.isShowLogShow = true
            getEbayReturnGoodsSeasLog(obj).then(({data}) => {
                if (data.status !== 1) {
                    // this.$message.error(data.errorMess);
                    return
                }
                this.showLogTableData = data.data_list.value;
            }).catch(err => {
                console.log(err);
            });
        },
        //消息跳转
        goMessagejump(row){
            this.$router.push({path:'/EbayMessage',query:{type:"EbayOverseasRefund",order_id: row.order_id, message_type: 2, _cacheType:'1'}});
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
        //纠纷跳转
        handleGoDispute(item) {
            let inx='';
            if(item.type=='INR'){
                this.$router.push({path:'/EbayINR',query:{type:"EbayOverseasRefund",inquiry_id:item.inquiry_id, _cacheType:'1'}});
                inx = routerConfig.getRouteIndex('/EbayINR');
            }else if(item.type=='CANCEL'){
                this.$router.push({path:'/EbayCancel',query:{type:"EbayOverseasRefund",cancel_id:item.cancel_id, _cacheType:'1'}});
                inx = routerConfig.getRouteIndex('/EbayCancel');
            }else if(item.type=='RETURN'){
                this.$router.push({path:'/EbayReturn',query:{type:"EbayOverseasRefund",return_id:item.return_id, _cacheType:'1'}});
                inx = routerConfig.getRouteIndex('/EbayReturn');
            }
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
            this.$router.push({path:'/EbayEvaluateFeedBack',query:{type:"EbayOverseasRefund",order_id: row.order_id, _cacheType:'1'}});
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
    },
}
</script>
<style lang="less" scoped>
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
    .afterId{
        max-height: 500px;
        overflow-y: auto;
    }
    .templateChange{
        padding: 5px;
        /deep/.el-dialog{
            z-index: 2200 !important;
        }
    }
</style>