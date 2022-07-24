<style lang="less" scoped>
.MessageCenterwrap {
    font-size: 12px;
    // .MessageCenterbox{

    // }
    .savetimeselecta{
        color: #3388ff;
        margin: 0 8px;
        padding: 0 0 1px;
        border-bottom: 2px solid transparent;
        &:hover{
            color: #3388ff;
        }
        &.active{
            color: #3388ff;
            border-color: #3388ff;
        }
    }

    .ui-fn-module{
        padding: 5px 0 1px;
        .el-button--primary {
            color: #fff !important;
            border-color: #409EFF !important;
            background: #409EFF !important;
            &:hover{
                background: #74abfe !important;
            }
        }
    }

    /deep/ .el-table{
        .table-row-isread td .cell{
            color: #999;
        }
    }

    .ui-main-module{
        /deep/ .ui-main-module-table{
            .el-table{
                .el-table__body{
                    .el-table__row{
                        td:nth-child(5){
                            position: relative;
                            overflow: hidden;
                            padding-top: 28px;
                            padding-left: 13px;
                        }
                    }
                }
            }
        }
    }
    .lbadge{
        position: absolute;
        left: -3px;
        top: 0;
        cursor: pointer;
        color: #999;
        span{
            font-size: 24px;
            margin-right: 0;
        }
        &.redbadge{
            color: #ff3332;
        }
        &.bluebadge{
            color: #5196fe;
        }
    }

    .badgeitem{
        span{
            margin-right: 0;
        }
    }
}
</style>

<template>
    <div class="MessageCenterwrap">
        <div class="MessageCenterbox">
            <div class="ui-main-module">
                <!-- 查询参数 -->
                <transition name="slide-fade">
                    <div class="ui-search-area" v-show="showSearch">
                        <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo($event, false, true)' @handleResetQueryInfo='handleResetQueryInfo' @handleLoadOk='searchHeight = !searchHeight'>
                            <div class="quickparamswrap" v-loading="quickParamsLoading">
                                <li style="width: 505px;">
                                    <SearchRequirement label="其他筛选">
                                        <a
                                            v-for="(v, i) in optionListLabel.fast_is_reply"
                                            @click="queryData.fast_is_replied === i ? queryData.fast_is_replied = '' : queryData.fast_is_replied = i, handleQueryInfo(queryData.mainQuery)"
                                            :class="{active: queryData.fast_is_replied === i}"
                                            href="javascript:;"
                                            :key="i"
                                            class="savetimeselecta">{{v}}</a>
                                    </SearchRequirement>
                                </li>
                                <li style="width: 505px;">
                                    <SearchRequirement label="邮件分类">
                                        <a
                                            v-for="(v, k, i) in optionListLabel.fast_mail_category"
                                            @click="queryData.fast_mail_category === k ? queryData.fast_mail_category = '' : queryData.fast_mail_category = k, handleQueryInfo(queryData.mainQuery)"
                                            :class="{active: queryData.fast_mail_category === k}"
                                            href="javascript:;"
                                            :key="i"
                                            class="savetimeselecta">{{v}}</a>
                                    </SearchRequirement>
                                </li>
                                <li style="width: 1521px; height: auto; min-height: 32px;">
                                    <SearchRequirement label="邮件标签">
                                        <a
                                            v-for="(v, k, i) in optionListLabel.fast_tag_id"
                                            @click="queryData.fast_tag_id === k ? queryData.fast_tag_id = '' : queryData.fast_tag_id = k, handleQueryInfo(queryData.mainQuery)"
                                            :class="{active: queryData.fast_tag_id === k}"
                                            href="javascript:;"
                                            :key="i"
                                            class="savetimeselecta">{{v}}</a>
                                    </SearchRequirement>
                                </li>
                            </div>
                        </ComSearchCondition>
                    </div>
                </transition>

                <!-- 操作按钮 -->
                <div class="ui-fn-module">
                    <span class="ui-top_i" @click="showSearch = !showSearch">
                        <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
                    </span>
                    <span v-for="item in optionListLabel.batchEditArr">
                        <el-button
                            v-if="buttonList[item.button].permit(thisVm) && ![8, 9, 10, 11].find(e => e === item.id)"
                            @click="batchEditFn(item.id)"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                        <el-button
                            v-if="buttonList[item.button].permit(thisVm) && [8, 9, 10, 11].find(e => e === item.id)"
                            @click="handleCopyEmpty(saveCheckInfo.map(e => {if(item.id === 8){return e.sender_email};if(item.id === 9){return e.sku};if(item.id === 10){return e.asin};if(item.id === 11){return e.order_id};}).join(','))"
                            :data-clipboard-text="saveCheckInfo.map(e => {if(item.id === 8){return e.sender_email};if(item.id === 9){return e.sku};if(item.id === 10){return e.asin};if(item.id === 11){return e.order_id};}).join(',')"
                            class="copyBtn"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                    </span>
                    <!-- <el-select v-model="optionListLabel.curBatchEditId" size="small">
                        <el-option
                            v-for="(v, i) in optionListLabel.batchEditArr"
                            :key="i"
                            v-if="v.button ? buttonList[v.button].permit(thisVm) : true"
                            :label="v.name"
                            :value="v.id">
                        </el-option>
                    </el-select> -->
                    <!-- &nbsp;
                    <el-button
                        v-show="![8, 9, 10, 11].find(e => e === optionListLabel.curBatchEditId)"
                        @click="batchEditFn()"
                        size="small"
                        type="primary">
                        批量操作
                    </el-button>
                    <el-button
                        v-show="[8, 9, 10, 11].find(e => e === optionListLabel.curBatchEditId)"
                        @click="handleCopyEmpty(saveCheckInfo.map(e => {if(optionListLabel.curBatchEditId === 8){return e.sender_email};if(optionListLabel.curBatchEditId === 9){return e.sku};if(optionListLabel.curBatchEditId === 10){return e.asin};if(optionListLabel.curBatchEditId === 11){return e.order_id};}).join(','))"
                        :data-clipboard-text="saveCheckInfo.map(e => {if(optionListLabel.curBatchEditId === 8){return e.sender_email};if(optionListLabel.curBatchEditId === 9){return e.sku};if(optionListLabel.curBatchEditId === 10){return e.asin};if(optionListLabel.curBatchEditId === 11){return e.order_id};}).join(',')"
                        size="small"
                        type="primary">
                        批量操作
                    </el-button> -->
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
                    :tableRowClassName="tableRowClassName"
                    :tableLoading="tableLoading">
                    <template slot-scope="scope" slot="is_read">
                        <div style="padding: 10px 20px;">
                            <div v-if="scope.row.email_status == 1">
                                <span class="icon-yizhuanfa" style="font-size: 26px; color: #3388ff;"></span>
                            </div>
                            <div v-if="scope.row.email_status == 2">
                                <span class="icon-yihuifu" style="font-size: 26px; color: #3388ff;"></span>
                            </div>
                            <div v-if="scope.row.email_status == 3">
                                <span class="icon-yiduyouxiang" style="font-size: 26px; color: #ccc;"></span>
                            </div>
                            <div v-if="scope.row.email_status == 4">
                                <el-badge :value="scope.row.number" class="badgeitem"><span class="icon-weiduyouxiang" style="font-size: 26px; color: #fec02d;"></span></el-badge>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="orderInfo">
                        <div>平台订单号：{{scope.row.platform_order_id}}</div>
                        <div>系统订单号： <span style="cursor:pointer; color: #3388ff;" type="text" @click="handleOrderNum(scope.row)">{{scope.row.order_id}}</span></div>
                    </template>
                    <template slot-scope="scope" slot="time">
                        <!-- <div v-if="scope.row.timediff <= 0">剩余时间：<span style="color: #0099cc;">{{scope.row.timediff == -864000 ? '' : Math.abs(scope.row.timediff) + '分钟'}}</span></div>
                        <div v-else>超时时间：<span style="color: #f00;">{{scope.row.timediff}}小时</span></div> -->
                        <div v-html="scope.row.timediff"></div>
                        <div>截止时间：{{scope.row.cutoff_time}}</div>
                        <div>收取时间：{{scope.row.receive_date}}</div>
                    </template>
                    <template slot-scope="scope" slot="subject">
                        <div @click="singleStar(scope.row.sender_email, scope.row.color == '2' ? 1 : 2)" :class="{redbadge: scope.row.color == '2'}" class="lbadge"><span class="icon-biaoxing"></span></div>
                        <div v-if="scope.row.is_attached" class="lbadge bluebadge" style="left: 28px; cursor: default;"><span class="icon-fujian"></span></div>
                        <div>
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div v-html="spaceConversionFn(scope.row.subject)"></div>
                                <a @click="goMailProcessingPage(scope.row)" v-html="spaceConversionFn(scope.row.subject)" style="color: #3388ff;" href="javascript:;" class="ellipsis4" slot="reference"></a>
                            </el-popover>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="account">
                        <div>账号：{{scope.row.account_name}}</div>
                        <div>站点：{{scope.row.site}}</div>
                    </template>
                    <template slot-scope="scope" slot="buyer">
                        <div>邮箱：{{scope.row.sender_email}}</div>
                        <div>客户ID：{{scope.row.sender}}</div>
                    </template>
                    <template slot-scope="scope" slot="product">
                        <div>Asin：{{scope.row.asin}}</div>
                        <div>产品线：{{scope.row.product_line}}</div>
                        <div>
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover"
                                :content="scope.row.product_name">
                                <a class="ellipsis2" href="javascript:;" slot="reference">商品名称：{{scope.row.product_name}}</a>
                            </el-popover>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="status">
                        <div>邮件状态：
                            <span class="ui-state_circle orangeColor" v-if="scope.row.is_replied === '未回复'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.is_replied === '无邮件'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.is_replied === '已回复'"></span>
                            {{scope.row.is_replied}}
                        </div>
                        <div>纠纷状态：
                            <span class="ui-state_circle orangeColor" v-if="scope.row.dispute_status === '未处理'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.dispute_status === '无纠纷'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.dispute_status === '已处理'"></span>
                            {{scope.row.dispute_status}}
                        </div>
                        <div>Review差评：{{scope.row.review_status}}</div>
                        <div>Feedback差评：{{scope.row.feedback_status}}</div>
                    </template>
                    <template slot-scope="scope" slot="tag">
                        <div>邮件分类：{{scope.row.mail_category}}</div>
                        <div>标签：{{scope.row.tag}}</div>
                    </template>
                    <template slot-scope="scope" slot="mantime">
                        <div>{{scope.row.processing}}</div>
                        <div>{{scope.row.processing_time}}</div>
                        <div>客服人员：{{scope.row.user_name}}</div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['deal'].permit(thisVm)" @click="goMailProcessingPage(scope.row)" type="text" size="mini">处理</el-button>
                        <ComDivide v-if="buttonList['deal'].permit(thisVm)"/>
                        <el-button v-if="buttonList['diaryLog'].permit(thisVm)" @click="handleOperateDaily(scope.row.id)" type="text" size="mini">日志</el-button>
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

        </div>

        <!-- 操作日志 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="日志"
            :visible.sync="logInfo.isShowLog">
            <ComPreviewTable
                :isAdaptiveHeight="true"
                :logKey="logInfo.tableKey"
                :logProps="logInfo.tableProps"
                :logData="logInfo.tableData"
                :logWidth="logInfo.tableWidth">
            </ComPreviewTable>
        </el-dialog>

        <!-- 批量分类 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="批量分类"
            width="430px"
            :visible.sync="batchEditObj.batchSortDialog"
            @close="batchSortCloseFn">
            <div>
                <el-form :model="batchEditObj.batchSortForm" :rules="formRules" ref="batchSortForm" size="small" label-width="100px">
                    <el-form-item prop="one" label="一级分类：">
                        <el-select v-model="batchEditObj.batchSortForm.one" @change="changeclassListFn">
                            <el-option
                                v-for="(v, i) in optionListLabel.classList"
                                :key="i"
                                :label="v.name"
                                :value="v.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="two" label="二级分类：">
                        <el-select v-model="batchEditObj.batchSortForm.two">
                            <el-option
                                v-for="(v, i) in optionListLabel.classListChild"
                                :key="i"
                                :label="v.name"
                                :value="v.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchEditObj.batchSortDialog = false" size="small">取 消</el-button>
                <el-button @click="batchSortsubmitFn()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 批量标签 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="批量标签"
            width="430px"
            :visible.sync="batchEditObj.batchTagDialog"
            @close="batchTagCloseFn">
            <div>
                <el-form :model="batchEditObj.batchTagForm" :rules="formRules" ref="batchTagForm" size="small" label-width="100px">
                    <el-form-item prop="tag" label="批量标签：">
                        <el-select v-model="batchEditObj.batchTagForm.tag" filterable v-filter clearable>
                            <el-option
                                v-for="(v, i) in optionListLabel.tagList"
                                :key="i"
                                :label="v.value"
                                :value="v.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchEditObj.batchTagDialog = false" size="small">取 消</el-button>
                <el-button @click="batchTagsubmitFn()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 批量客服 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="批量客服"
            width="430px"
            :visible.sync="batchEditObj.batchKefuDialog">
            <div>
                <el-form :model="batchEditObj.batchKefuForm" :rules="formRules" ref="batchKefuForm" size="small" label-width="100px">
                    <el-form-item prop="one" label="批量客服：">
                        <el-select
                            v-model="batchEditObj.batchKefuForm.one"
                            clearable
                            filterable
                            v-filter
                            remote
                            :remote-method="userIdChangeRemoteMethod"
                            placeholder="请输入搜索"
                            size="small">
                            <el-option
                                v-for="(v, i) in optionListLabel.kefuList"
                                :label="v.value"
                                :value="v.id"
                                :key="i">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchEditObj.batchKefuDialog = false" size="small">取 消</el-button>
                <el-button @click="batchKefusubmitFn()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
        ></OrderInformation>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import {
    getLogs,
    addRead,
    tagReply,
    addClass,
    addkefu,
    dataOutput,
    logOutput,
    getHeaderSelect,
} from '@/api/Amazon/MessageCenter';
import {
    delMails,
    addStar,
    getClass,
    getTag,
    addTag,
    getkefu,
} from '@/api/MailCenterManagement/Inbox';
import config from '@/assets/js/config';
import { getSessionStorage } from '@/utils/storage';
import routerConfig from '@/router/routerConfig';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import mailConfig from "@/assets/js/mailProcessingConfig";
import dayjs from 'dayjs';
// 复制到剪贴板功能
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'MessageCenter',
    data () {
        return {
            searchHeight: false,
            thisVm: this,
            showSearch: true,

            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['', '订单信息', '剩余时间', '邮件主题', '账号信息', '买家信息', '商品信息', '处理状态', '标签分类', '处理人/时间', '操作'],
            tableProps: ['is_read', 'orderInfo', 'time', 'subject', 'account', 'buyer', 'product', 'status', 'tag', 'mantime', 'operate'],
            tableWidth: ['86', '230', '200', 'subject', '170', 'buyer', 'product', '150', '140', '140', '130'],
            tableData: [],
            // 表格加载动画
            tableLoading: false,
            quickParamsLoading: false,

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
                fast_mail_category: '',
                fast_is_replied: '',
                fast_tag_id: '',
                mainQuery: {},
            },

            // 查询下拉框数据
            optionList: {

            },
            optionListLabel: {
                curBatchEditId: '',
                batchEditArr: [
                    {id: 1, name: '批量处理', button:'batchDeal', iconName:"piliangchuli", color:'#72afff'},
                    {id: 3, name: '批量标签', button:'batchTag', iconName:"piliangbiaoqian", color:'#bc8cef'},
                    {id: 6, name: '批量标星邮件', button:'starMail', iconName:"piliangbiaoxing", color:'#fc6769'},
                    {id: 15, name: '批量标记已回复', button:'tagReply', iconName:"pilianghuifu", color:'#72afff'},
                    {id: 2, name: '批量分类', button:'batchClass', iconName:"piliangfenlei", color:'#fd996b'},
                    {id: 7, name: '批量标记已读', button:'tagRead', iconName:"piliangbiaojiyidu", color:'#72afff'},
                    {id: 8, name: '批量复制买家邮箱', button:'copyBuyerMail', iconName:"fuzhi", color:'#72afff'},
                    {id: 9, name: '批量复制SKU', button:'copySku', iconName:"fuzhi", color:'#72afff'},
                    {id: 10, name: '批量复制Asin', button:'copyAsin', iconName:"fuzhi", color:'#72afff'},
                    {id: 11, name: '批量复制订单号', button:'copyOrderNum', iconName:"fuzhi", color:'#72afff'},
                    {id: 13, name: '数据导出', button:'dataExport', iconName:"daochu", color:'#72afff'},
                    {id: 14, name: '日志导出', button:'logExport', iconName:"daochu", color:'#fd996b'},
                    {id: 12, name: '批量修改客服人员', button:'batchCustomerService', iconName:"piliangfenpeikefu", color:'#72afff'},
                ],
                fast_mail_category: {},
                fast_is_reply: {},
                fast_tag_id: {},
                is_star: [],
                is_read: [],
                mail_category: {},
                receive_date: {},
                account_id: {},
                email: {},
                tag_id: {},
                classList: [],
                classListChild: {},
                tagList: [],
                kefuList: [],
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

            // 批量处理
            batchEditObj: {
                batchSortDialog: false,
                batchSortForm: {
                    one: '',
                    two: ''
                },
                batchTagDialog: false,
                batchTagForm: {
                    one: ''
                },
                batchKefuDialog: false,
                batchKefuForm: {
                    one: ''
                }
            },

            // 表单验证
            formRules: {
                one: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                two: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                tag: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },

            orderInfo:{},
            isOrderInfoShow:false,//订单详情弹窗
        }
    },
    components: {
        OrderInformation,
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
            'MessageCenterObj'
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    activated() {
        // 重置快捷搜索
        if( this.$route.query._cacheType ){
            this.queryData.fast_mail_category = '';
            this.queryData.fast_is_replied = '';
            this.queryData.fast_tag_id = '';
        }
    },
    mounted() {
        try{
            if (this.$route.query._cacheType === '1' || JSON.stringify(this.MessageCenterObj) === '{}') {
                // this.handleQueryInfo({is_replied: 0});
            }else{
                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo['message_center']);
                this.handleQueryInfoCallBack(this.MessageCenterObj);
            }
        }catch (e) {
            console.log(e)
        }

        // 获取分类
        getClass({platform_code: this.platform}).then(({data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }
            this.optionListLabel = {...this.optionListLabel, ...{classList: data.data_list}};
        }).catch(err => {
            console.log(err);
        });

        // 获取标签
        getTag().then(({data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }
            this.optionListLabel = {...this.optionListLabel, ...{tagList: data.data_list}};
        }).catch(err => {
            console.log(err);
        });

        // 复制到剪贴板功能
        clipboard.on('success', e => {
            // this.$message.success('复制成功！');
            e.clearSelection();
        });

        clipboard.on('error', e => {
            this.$message.error('复制失败！');
        });
    },
    methods: {
        ...mapActions([
            'GetMessageCenterList',
        ]),

        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['message_center']);
            }
            let obj = {
                fast_mail_category: this.queryData.fast_mail_category,
                fast_is_replied: this.queryData.fast_is_replied,
                fast_tag_id: this.queryData.fast_tag_id,
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
                limit: this.pageData.currentList
            };

            this.tableLoading = true;
            this.GetMessageCenterList(obj).then(({data}) => {
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

            // 取缓存就不加载快捷搜索
            if( !isSave ){
                this.quickParamsLoading = true;
                getHeaderSelect({...obj, quickparamstype: 'category'}).then(({data}) => {
                    this.quickParamsLoading = false;
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    // 获取下拉框
                    this.optionListLabel = {...this.optionListLabel, fast_mail_category: data.data_list.fast_mail_category};

                    // 重置表格高度
                    this.searchHeight = !this.searchHeight;
                }).catch(err => {
                    this.quickParamsLoading = false;
                    console.log(err);
                });
                getHeaderSelect({...obj, quickparamstype: 'tag'}).then(({data}) => {
                    this.quickParamsLoading = false;
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    // 获取下拉框
                    this.optionListLabel = {...this.optionListLabel, fast_tag_id: data.data_list.fast_tag_id};

                    // 重置表格高度
                    this.searchHeight = !this.searchHeight;
                }).catch(err => {
                    this.quickParamsLoading = false;
                    console.log(err);
                });
                getHeaderSelect({...obj, quickparamstype: 'reply'}).then(({data}) => {
                    this.quickParamsLoading = false;
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    // 获取下拉框
                    this.optionListLabel = {...this.optionListLabel, fast_is_reply: data.data_list.fast_is_reply};

                    // 重置表格高度
                    this.searchHeight = !this.searchHeight;
                }).catch(err => {
                    this.quickParamsLoading = false;
                    console.log(err);
                });
            }
        },

        // 查询回调
        handleQueryInfoCallBack(data){
            // 保存查询参数
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: 'message_center',
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

        // 执行操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success('操作成功！');
                this.saveCheckInfo = [];
                this.saveCheckIds = '';
                this.handleQueryInfo({}, true);
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        },

        // 处理复制数据为空的时候
        handleCopyEmpty(str) {
            if( !this.saveCheckInfo.length ){
                this.$message.warning('请先勾选数据！');
                return false;
            }
            if( !str ){
                this.$message.warning('数据为空，无法复制！');
                return false;
            }
            this.$message.success('复制成功！');
        },

        // 进邮件处理页面之前需要处理
        beforeGoMailProcessingPage(arr, curParams) {
            // 提取列表关键字段方法
            let getInfo = (obj) => {
                return {
                    inbox_id: obj.id || '',
                    account_id: obj.account_id || '',
                    order_id: obj.order_id || '',
                    buyer_id: obj.buyer_id || '',
                };
            };

            // 提取附加信息方法
            let getDesInfo = (obj, originObj) => {
                // 处理需要发送的搜索参数
                let data = JSON.parse(this.queryParamsInfo['message_center'] || '{}');
                let datastr = {};
                Object.keys(data).forEach(e => {
                    if( e == 'mainQuery' ){
                        Object.keys(data[e]).forEach(j => {
                            datastr[j] = data[e][j];
                        });
                    }else{
                        datastr[e] = data[e];
                    }
                });
                datastr = {
                    ...datastr,
                    page: this.pageData.currentPage,
                    limit: this.pageData.currentList
                };
                return {
                    ...obj,
                    buyer_email: originObj.sender_email,
                    after_before_id_list: originObj.after_before_id_list,
                    point: 'inbox',
                    type: 'MessageCenter',
                    email_cate_id: originObj.email_cate_id,
                    input_messagecenter: JSON.stringify(datastr)
                };
            };

            // 提取已有邮件处理列表关键字段方法
            let getNavInfo = (obj) => {
                return {
                    inbox_id: obj.inbox_id,
                    account_id: obj.account_id,
                    order_id: obj.order_id,
                    buyer_id: obj.buyer_id,
                };
            };

            // queryParamsInfo存储参数和路由对应关系
            let paramsRouterObj = JSON.parse(JSON.stringify(mailConfig.paramsRouterObj));

            // 定义queryParamsInfo存储参数
            let paramsInfoName = curParams;

            // 定义邮件处理页用到的路由、页签名
            let mailProcessRouter = paramsRouterObj[paramsInfoName].routerList;
            let mailProcessRouterName = paramsRouterObj[paramsInfoName].pathName;

            // 获取已有的邮件处理列表
            let mailProcessNavList = JSON.parse(this.queryParamsInfo[paramsInfoName]);

            // 可用的路由列表
            let canUseRouter = mailProcessRouter.filter(e => !mailProcessNavList.map(e => e.routerPath).includes(e));

            // 需要进入的第一封邮件
            let openMail = {};
            // 新增的邮件处理列表
            let marr = [];
            arr.forEach((e, i) => {
                // 提取关键信息
                let n = getInfo(e);
                // 对比关键信息
                let idx = mailProcessNavList.findIndex(e => JSON.stringify(getNavInfo(e)) === JSON.stringify(n));
                // 加入附加信息
                n = getDesInfo(n, e);
                // 如果不存在就加入
                if( idx < 0 ){
                    // 把新加入的给个路由、标签名和queryParamsInfo存储参数
                    n = {...n, routerPath: canUseRouter.shift(), routerPathName: mailProcessRouterName, queryParamsInfo: paramsInfoName};
                    marr.push(n);
                }else{
                    // 如果存在就替换成最新的
                    let deln = mailProcessNavList.splice(idx, 1);
                    n = {...deln[0], ...n};
                    mailProcessNavList.splice(idx, 0, n);
                }
                if( i === 0 ) {
                    openMail = {...n};
                }
            });

            // 合并
            let mergeMailProcessNavList = [...mailProcessNavList, ...marr];

            // 需要打开的邮件数量大于可用路由数量就提示错误
            if( mergeMailProcessNavList.length > mailProcessRouter.length ) {
                this.$message.error(`最多打开 ${mailProcessRouter.length} 封邮件！${mailProcessRouterName} 已有 ${mailProcessNavList.length} 封邮件。`);
                return false;
            }

            // 保存邮件处理列表
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: paramsInfoName,
                value: JSON.stringify(mergeMailProcessNavList)
            });

            // 进邮件处理之前先移除已有的邮件处理标签
            this.$store.commit('SAVE_TAB_LABELS', {
                name: mailProcessRouterName,
                isRemove: 1
            });

            return openMail;
        },
        // 邮件处理页面
        goMailProcessingPage(arr) {
            if( !Array.isArray(arr) ){
                arr = [arr];
            }
            // 处理
            let obj = this.beforeGoMailProcessingPage(arr, 'MailProcessingListMessage');
            if(!obj) {
                return;
            }
            // 跳转
            this.$router.push({path: obj.routerPath, query: obj});

            // 添加tab标签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: obj.routerPath,
                name: obj.routerPathName,
                index: obj.routerPath,
                query: obj
            });
            this.$store.commit('SAVE_NAV_INDEX', obj.routerPath);
        },

        // 日志
        handleOperateDaily(id){
            getLogs({
                id,
                limit: 1000,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
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

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 1:
                    // 批量回复
                    this.batchReply();
                    break;
                case 2:
                    // 批量分类
                    this.batchSort();
                    break;
                case 3:
                    // 批量标签
                    this.batchTag();
                    break;
                case 6:
                    // 标星邮件
                    this.batchStar();
                    break;
                case 7:
                    // 标记已读
                    this.batchRead();
                    break;
                case 12:
                    // 批量分配客服
                    this.batchKefu();
                    break;
                case 13:
                    // 数据导出
                    this.dataExportFn();
                    break;
                case 14:
                    // 日志导出
                    this.logExportFn();
                    break;
                case 15:
                    // 标记已回复
                    this.batchTagReply();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },
        // 批量回复
        batchReply() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.goMailProcessingPage(this.saveCheckInfo);
        },
        // 批量分类
        batchSort() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.batchEditObj.batchSortDialog = true;
        },
        batchSortCloseFn() {
            this.batchEditObj.batchSortForm = {
                one: '',
                two: ''
            };
            this.$refs.batchSortForm.resetFields();
        },
        changeclassListFn(v) {
            this.batchEditObj.batchSortForm.two = '';
            this.optionListLabel.classListChild = this.optionListLabel.classList.find(e => e.id === v).chileden;
        },
        batchSortsubmitFn() {
            this.$refs.batchSortForm.validate((valid) => {
                if (valid) {
                    let buyer_email = this.saveCheckInfo.map(e => e.sender_email).join(',');
                    let account_id = this.saveCheckInfo.map(e => e.account_id).join(',');
                    addClass({buyer_email, account_id, mail_category: this.batchEditObj.batchSortForm.two, first_mail_category: this.batchEditObj.batchSortForm.one}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                    this.batchEditObj.batchSortDialog = false;
                }
            });
        },
        // 批量标签
        batchTag() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.batchEditObj.batchTagDialog = true;
        },
        batchTagCloseFn() {
            this.batchEditObj.batchTagForm = {
                tag: '',
            };
            this.$refs.batchTagForm.resetFields();
        },
        batchTagsubmitFn() {
            this.$refs.batchTagForm.validate((valid) => {
                if (valid) {
                    let id = this.saveCheckInfo.map(e => e.sender_email).join(',');
                    addTag({buyer_email: id, tag_id: this.batchEditObj.batchTagForm.tag, platform_code: this.platform, point: 'message'}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.handleOperationCallBack(data);
                        this.batchEditObj.batchTagDialog = false;
                    }).catch(error => {

                    });
                }
            });
        },
        // 批量标星
        batchStar() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let id = this.saveCheckInfo.map(e => e.sender_email).join(',');
            addStar({
                is_star: 2,
                sender_email: id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(error => {

            });
        },
        // 单个标星或取消标星
        singleStar(id, type) {
            let obj = {
                is_star: type,
                sender_email: id,
            };
            addStar(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(error => {

            });
        },
        // 批量已读
        batchRead() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let buyer_email = this.saveCheckInfo.map(e => e.sender_email).join(',');
            let account_id = this.saveCheckInfo.map(e => e.account_id).join(',');
            addRead({
                buyer_email,
                account_id
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(error => {

            });
        },
        // 标记已回复
        batchTagReply() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let buyer_email = this.saveCheckInfo.map(e => e.sender_email).join(',');
            let account_id = this.saveCheckInfo.map(e => e.account_id).join(',');
            tagReply({
                buyer_email,
                account_id
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(error => {

            });
        },
        // 批量客服
        batchKefu() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.batchEditObj.batchKefuDialog = true;
            this.$nextTick(() => {
                this.$refs.batchKefuForm.resetFields();
            });
        },
        batchKefusubmitFn() {
            this.$refs.batchKefuForm.validate((valid) => {
                if (valid) {
                    let buyer_email = this.saveCheckInfo.map(e => e.sender_email).join(',');
                    let account_id = this.saveCheckInfo.map(e => e.account_id).join(',');
                    addkefu({buyer_email, account_id, user_id: this.batchEditObj.batchKefuForm.one, point: 'message'}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.handleOperationCallBack(data);
                        this.batchEditObj.batchKefuDialog = false;
                    }).catch(error => {

                    });
                }
            });
        },
        // 获取客服人员
        userIdChangeRemoteMethod(query) {
            if( query ){
                getkefu({account_name: query}).then(({data})=> {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败！');
                        return;
                    }
                    this.optionListLabel = {...this.optionListLabel, kefuList: data.data_list};
                });
            }
        },

        // 表格行样式
        tableRowClassName({row, rowIndex}) {
            if (row.is_read == 1 || row.is_read == 2) {
                return 'table-row-isread';
            }
            return '';
        },

        // 数据导出
        dataExportFn() {
            this.$confirm('是否导出数据?', '提示', {
                type: 'warning'
            }).then(() => {
                let data = JSON.parse(this.queryParamsInfo['message_center'] || '{}');
                let datastr = {};
                Object.keys(data).forEach(e => {
                    if( e == 'mainQuery' ){
                        Object.keys(data[e]).forEach(j => {
                            datastr[j] = data[e][j];
                        });
                    }else{
                        datastr[e] = data[e];
                    }
                });
                dataOutput({
                    ...datastr
                }).then(({data}) => {

                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {

            });
        },
        // 日志导出
        logExportFn() {
            this.$confirm('是否导出日志?', '提示', {
                type: 'warning'
            }).then(() => {
                let data = JSON.parse(this.queryParamsInfo['message_center'] || '{}');
                let datastr = {};
                Object.keys(data).forEach(e => {
                    if( e == 'mainQuery' ){
                        Object.keys(data[e]).forEach(j => {
                            datastr[j] = data[e][j];
                        });
                    }else{
                        datastr[e] = data[e];
                    }
                });
                logOutput({
                    ...datastr,
                    staff_code: JSON.parse(getSessionStorage('userInfo')).staff_code
                }).then(({data}) => {

                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {

            });
        },
        // 订单号
        handleOrderNum(row){
            // this.$router.push({path:'OrderInformation', query:{order_id: row.order_id, platform_code: row.platform_code, operation:'handleOrder'}})
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=!this.isOrderInfoShow;
        },
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },

        // 把空格替换
        spaceConversionFn(v) {
            return v ? v.replace(/\s/g, '&nbsp;') : '';
        }
    },
}
</script>
