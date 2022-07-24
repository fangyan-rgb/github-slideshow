<style lang="less" scoped>
.EbayMessagewrap{
    .ui-main-module{
        /deep/ .ui-main-module-table{
            .el-table{
                .el-table__body{
                    .el-table__row{
                        td:nth-child(4){
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

.ui-fn-module{
    &:after{
        content: ' ';
        display: block;
        clear: both;
    }
    .ui-fn-module-right{
        float: right;
    }
}
</style>

<template>
    <div class="EbayMessagewrap">
        <div class="EbayMessagebox">

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
                    <span v-for="item in optionListLabel.batchEditArr">
                        <el-button
                            v-if="(buttonList[item.button].permit(thisVm)) && ![7, 8, 9].find(e => e === item.id)"
                            @click="batchEditFn(item.id)"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                        <el-button
                            v-if="(buttonList[item.button].permit(thisVm)) && [7, 8, 9].find(e => e === item.id)"
                            @click="handleCopyEmpty(saveCheckInfo.map(e => {if(item.id === 7){return e.sku};if(item.id === 8){return e.item_id};if(item.id === 9){return e.account_name};}).join(','))"
                            :data-clipboard-text="saveCheckInfo.map(e => {if(item.id === 7){return e.sku};if(item.id === 8){return e.item_id};if(item.id === 9){return e.account_name};}).join(',')"
                            class="copyBtn"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                    </span>

                    <div class="ui-fn-module-right">
                        <el-button @click="toggleReceiveDateOrder()" type="text" size="small">客户发送时间 <i class="el-icon-sort-down" :style="{color: queryData.receive_date_order == 'desc' ? '#00f' : '#aaa'}" style="font-size: 13px; font-weight: bold;"></i><i class="el-icon-sort-up" :style="{color: queryData.receive_date_order == 'asc' ? '#00f' : '#aaa'}" style="position: relative; left: -9px; font-size: 13px; font-weight: bold;"></i></el-button>
                    </div>
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
                                <el-badge is-dot class="badgeitem"><span class="icon-weiduyouxiang" style="font-size: 26px; color: #fec02d;"></span></el-badge>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="remainingTime">
                        <div v-if="scope.row.timediff && scope.row.email_status != 2">
                            <p v-if="parseInt(scope.row.timediff) > 0">剩余时间：<span style="color: blue;">{{scope.row.timediff}}</span></p>
                            <p v-else>超时时间：<span style="color: red;">{{scope.row.timediff.slice(1)}}</span></p>
                        </div>
                        <div v-else>
                            <p>剩余时间：</p>
                        </div>
                        <div>截止时间：{{scope.row.cutoff_time}}</div>
                        <div>客户发送时间：{{scope.row.receive_date}}</div>
                    </template>
                    <template slot-scope="scope" slot="title">
                        <div @click="singleStar(scope.row.buyer_id, scope.row.star == '1' ? 0 : 1)" :class="{redbadge: scope.row.star == '1'}" class="lbadge"><span class="icon-biaoxing"></span></div>
                        <div v-if="scope.row.img_exists" class="lbadge bluebadge" style="left: 28px; cursor: default;"><span class="icon-fujian"></span></div>
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
                    <template slot-scope="scope" slot="orderinfo">
                        <div>订单状态：{{scope.row.complete_status}}</div>
                        <div>订单号：<span style="cursor: pointer;color: #3388ff;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</span></div>
                        <div>平台订单号：{{scope.row.platform_order_id}}</div>
                        <div>收货国家：{{scope.row.ship_country_name}}</div>
                        <div>买家ID：{{scope.row.buyer_id}}</div>
                        <div>付款时间：{{scope.row.paytime}}</div>
                    </template>
                    <template slot-scope="scope" slot="accountinfo">
                        <div>平台账号：{{scope.row.account_name}}</div>
                        <div>发货仓库：{{scope.row.warehouse_name}}</div>
                        <div>刊登地点：{{scope.row.site}}</div>
                        <div>INR：</div>
                        <div>SNAD：</div>
                    </template>
                    <template slot-scope="scope" slot="productinfo">
                        <div>
                            <div>Item ID：<a target="_blank" style="color: #3388ff;" :href="'https://www.ebay.com/itm/' + scope.row.item_id">{{scope.row.item_id}}</a></div>
                            <div>公司SKU：{{scope.row.sku}}</div>
                            <div>产品名称：{{scope.row.sku_title}}</div>
                            <div>公司产品线：{{scope.row.product_line}}</div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="status">
                        <div>读取状态：{{scope.row.is_read}}</div>
                        <div>回复状态：{{scope.row.is_replied}}</div>
                        <div>售后问题：
                            <el-popover
                                placement="right"
                                width="270"
                                trigger="hover"
                                :disabled="!scope.row.after_sale_list.length">
                                <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td>售后单号</td>
                                        <td width="40">类型</td>
                                        <td width="50">处理状态</td>
                                    </tr>
                                    <tr v-for="v in scope.row.after_sale_list">
                                        <td>
                                            <a @click="gotoAfterSalesOrderList(v.after_sale_id)" href="javascript:;" style="color: #3388ff;">
                                                {{v.after_sale_id}}
                                            </a>
                                        </td>
                                        <td>{{v.type}}</td>
                                        <td>{{v.status}}</td>
                                    </tr>
                                </table>
                                <a style="color: #3388ff;" href="javascript:;" slot="reference">
                                    {{scope.row.after_sale_list.length ? scope.row.after_sale_list[0].type : ''}}
                                </a>
                            </el-popover>
                        </div>
                        <div>纠纷状态：
                            <el-popover
                                v-if="scope.row.dispute_list"
                                placement="right"
                                width="270"
                                trigger="hover"
                                :disabled="!scope.row.dispute_list.length">
                                <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td>纠纷ID</td>
                                        <td width="40">类型</td>
                                        <td width="50">处理状态</td>
                                    </tr>
                                    <tr v-for="v in scope.row.dispute_list">
                                        <td>
                                            <a @click="gotoDisputeCenterList(v)" href="javascript:;" style="color: #3388ff;">
                                                {{v.return_id || v.inquiry_id || v.cancel_id}}
                                            </a>
                                        </td>
                                        <td>{{v.dispute_type}}</td>
                                        <td>{{v.status}}</td>
                                    </tr>
                                </table>
                                <a style="color: #3388ff;" href="javascript:;" slot="reference">
                                    {{scope.row.dispute_list.length ? scope.row.dispute_list[0].status : ''}}
                                </a>
                            </el-popover>
                        </div>
                        <div>评价级别：{{scope.row.comment_type}}</div>
                    </template>
                    <template slot-scope="scope" slot="tagcus">
                        <div>消息分类：{{scope.row.category_name}}</div>
                        <div>标签：{{scope.row.tag.join('、')}}</div>
                        <div>客服人员：{{scope.row.user_name}}</div>
                    </template>
                    <template slot-scope="scope" slot="mantime">
                        <div v-if="!['eBay', 'csfeedback@go.ebay.com'].includes(scope.row.buyer_id)">
                            <div>{{scope.row.reply_by}}</div>
                            <div>{{scope.row.reply_time == '0000-00-00 00:00:00' ? '' : scope.row.reply_time}}</div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['reply'].permit(thisVm)" @click="goMailProcessingPage(scope.row)" type="text" size="mini">回复</el-button>
                        <ComDivide v-if="buttonList['reply'].permit(thisVm)"/>
                        <el-button v-if="buttonList['log'].permit(thisVm)" @click="handleLogFn(scope.row.id)" type="text" size="mini">日志</el-button>
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
                :isAdaptiveHeight="false"
                :logKey="logInfo.tableKey"
                :logProps="logInfo.tableProps"
                :logData="logInfo.tableData"
                :logWidth="logInfo.tableWidth">
            </ComPreviewTable>
        </el-dialog>

        <!-- 批量标签 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="批量标签"
            width="430px"
            :visible.sync="batchEditObj.batchTagDialog">
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
            :afterSalesOrderEdit="afterSalesOrderEditInfo"
            @handleEditAfterSaleList="handleQueryInfo({}, true);"
            @handleAfterSaleList="isOrderInfoShow=false; handleQueryInfo({after_order_number: $event})"
        ></OrderInformation>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import config from '@/assets/js/config';
import {
    getMainList,
    getLogs,
    saveTag,
    saveKefu,
    setStar,
    setReply,
    dataOutput,
} from '@/api/Ebay/Message';
import {
    getTag,
    getkefu,
} from '@/api/MailCenterManagement/Inbox';
import ProdInfoPopup from '@/views/HomePage/Ebay/components/ProdInfoPopup';
import mailConfig from "@/assets/js/mailProcessingConfig";
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import routerConfig from '@/router/routerConfig';
import * as storage from '@/utils/storage';
// 复制到剪贴板功能
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'EbayMessage',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['', '剩余时间', '消息主题', '订单信息', '账号信息', '产品信息', '处理状态', '标签/客服人员', '处理人/时间', '操作'],
            tableProps: ['is_read', 'remainingTime', 'title', 'orderinfo', 'accountinfo', 'productinfo', 'status', 'tagcus', 'mantime', 'operate'],
            tableWidth: ['86', '220', '300', '200', '160', '170', '120', '120', '140', '100'],
            tableData: [],
            // 表格加载动画
            tableLoading: false,

            // 分页数据
            pageSizes: config.pageData.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 10,
                currentTotal: 0,
                prev_next_ids: '',
            },

            // 保存选中项信息
            saveCheckInfo: [],
            // 选中的ids
            saveCheckIds: '',

            // 查询数据
            queryData: {
                mainQuery: {},
                receive_date_order: 'asc',
            },

            optionListLabel: {
                curBatchEditId: '',
                batchEditArr: [
                    {id: 1, name: '批量回复', button:'batchReply', iconName:"pilianghuifu", color:'#6facff'},
                    {id: 2, name: '批量标签', button:'batchTag', iconName:"piliangbiaoqian", color:'#bc88f1'},
                    {id: 3, name: '批量标星', button:'batchStar', iconName:"piliangbiaoxing", color:'#ff6562'},
                    {id: 4, name: '批量标记已回复', button:'batchTagReply', iconName:"pilianghuifu", color:'#6facff'},
                    {id: 5, name: '批量修改客服', button:'batchChangeCust', iconName:"piliangfenpeikefu", color:'#72afff'},
                    {id: 7, name: '批量复制SKU', button:'copySKU', iconName:"fuzhi", color:'#6facff'},
                    {id: 8, name: '批量复制item ID', button:'copyItemID', iconName:"fuzhi", color:'#6facff'},
                    {id: 9, name: '批量复制账号', button:'copyAccount', iconName:"fuzhi", color:'#6facff'},
                    {id: 6, name: '数据导出', button:'dataExport', iconName:"daochu", color:'#72afff'},
                ],
                tagList: [],
                kefuList: [],
            },

            formRules: {
                one: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                tag: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },

            // 日志相关
            logInfo: {
                tableData: [],
                tableProps: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableWidth: ['', '', ''],
                isShowLog: false,
            },

            // 批量处理
            batchEditObj: {
                batchTagDialog: false,
                batchTagForm: {
                    tag: ''
                },
                batchKefuDialog: false,
                batchKefuForm: {
                    one: ''
                }
            },

            // 订单弹窗相关
            isOrderInfoShow:false,  //订单详情弹窗
            orderInfo:{},
            afterSalesOrderEditInfo:{},
        }
    },
    components: {ProdInfoPopup, OrderInformation},
    computed: {
        ...mapGetters([
            'queryParamsInfo',
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    activated() {

    },
    mounted() {
        // this.handleQueryInfo();
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
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_Message']);
            }
            let obj = {
                receive_date_order: this.queryData.receive_date_order,
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
                offset: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                limit: this.pageData.currentList
            };

            // 过滤为空的参数
            for (let key in obj) {
                if (!obj[key] && obj[key] !== 0) {
                    delete obj[key];
                }
            }

            this.tableLoading = true;
            getMainList(obj).then(({data}) => {
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
                key: 'Ebay_Message',
                value: JSON.stringify(this.queryData)
            });
            this.tableData = data.data_list;

            // 渲染分页
            this.pageData.currentPage = data.page_data.offset * 1;
            this.pageData.currentList = data.page_data.limit * 1;
            this.pageData.currentTotal = data.page_data.total * 1;
            this.pageData.prev_next_ids = data.page_data.prev_next_ids;

            // 重置表格高度
            this.searchHeight = !this.searchHeight;
        },

        // 重置
        handleResetQueryInfo(){
            this.queryData = {
                mainQuery: {},
                receive_date_order: 'asc',
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

        // 客户发送时间切换排序
        toggleReceiveDateOrder() {
            if( this.queryData.receive_date_order == 'asc' ){
                this.queryData.receive_date_order = 'desc';
            }else{
                this.queryData.receive_date_order = 'asc';
            }
            this.handleQueryInfo({...JSON.parse(this.queryParamsInfo['Ebay_Message']).mainQuery}, false);
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

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 1:
                    // 批量回复
                    this.batchReply();
                    break;
                case 2:
                    // 批量标签
                    this.batchTag();
                    break;
                case 3:
                    // 批量标星
                    this.batchStar();
                    break;
                case 4:
                    // 批量标记已回复
                    this.batchTagReply();
                    break;
                case 5:
                    // 批量修改客服
                    this.batchKefu();
                    break;
                case 6:
                    // 数据导出
                    this.dataDownloadFn();
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
                return {
                    ...obj,
                    type: 'EbayMessage',
                    prev_next_ids: this.pageData.prev_next_ids,
                    transaction_id: originObj.transaction_id,
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
            let intoStr = 'MailProcessingEbayMessage';
            let setArr = [...new Set(arr.map(e => e.buyer_id))];
            // buyer_id = 'eBay' 或者 'csfeedback@go.ebay.com' 就是eBay消息
            // 过滤不是eBay消息之后的数组长度
            let setArr1 = setArr.filter(e => !['eBay', 'csfeedback@go.ebay.com'].includes(e)).length;

            if( setArr1 > 0 ) {
                if( setArr1 == setArr.length ){
                    intoStr = 'MailProcessingEbayVipMessage';
                }else{
                    this.$message.error('请筛选数据，勾选相同消息类型的数据进行批量打开！');
                    return;
                }
            }

            let obj = this.beforeGoMailProcessingPage(arr, intoStr);
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

        // 批量标签
        batchTag() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.batchEditObj.batchTagDialog = true;
            this.batchEditObj.batchTagForm = {
                tag: '',
            };
            this.$nextTick(() => {
                this.$refs.batchTagForm.clearValidate();
            });
            if( !this.optionListLabel.tagList.length ){
                getTag({platform_code: 'EB'}).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.optionListLabel.tagList = data.data_list;
                }).catch(err => {

                });
            }
        },
        batchTagsubmitFn() {
            this.$refs.batchTagForm.validate((valid) => {
                if (valid) {
                    let buyer_id = this.saveCheckInfo.map(e => e.buyer_id).join(',');
                    saveTag({buyer_id, tag_id: this.batchEditObj.batchTagForm.tag}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.batchEditObj.batchTagDialog = false;
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                }
            });
        },

        // 批量修改客服
        batchKefu() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.batchEditObj.batchKefuDialog = true;
            this.batchEditObj.batchKefuForm = {
                one: ''
            };
            this.$nextTick(() => {
                this.$refs.batchKefuForm.clearValidate();
            });
        },
        batchKefusubmitFn() {
            this.$refs.batchKefuForm.validate((valid) => {
                if (valid) {
                    let subject_id = this.saveCheckInfo.map(e => e.inbox_subject_id).join(',');
                    saveKefu({subject_id, user_number: this.batchEditObj.batchKefuForm.one}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.batchEditObj.batchKefuDialog = false;
                        this.handleOperationCallBack(data);
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
                    this.optionListLabel.kefuList = data.data_list;
                });
            }
        },

        // 批量标星
        batchStar() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let buyer_id = this.saveCheckInfo.map(e => e.buyer_id).join(',');
            this.singleStar(buyer_id, 1);
        },
        // 单个标星或取消标星
        singleStar(buyer_id, star) {
            setStar({
                star,
                buyer_id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(error => {

            });
        },

        // 批量标记已回复
        batchTagReply() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let subject_id = this.saveCheckInfo.map(e => e.inbox_subject_id).join(',');
            setReply({
                subject_id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(error => {

            });
        },

        // 数据导出
        dataDownloadFn() {
            this.$confirm('是否导出数据？', '提示', {
                type: 'warning'
            }).then(() => {
                let data = JSON.parse(this.queryParamsInfo['Ebay_Message'] || '{}');
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

        // 日志
        handleLogFn(id) {
            getLogs({
                id,
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

        // 订单弹窗相关
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow = bool;
        },
        // 修改信息
        // handleOperateModifyInfo(row) {
        //     this.orderInfo={
        //         order_id:row.order_id,
        //         platform_code:row.platform_code,
        //         edit:false,
        //         operation:'addNewAfterSaleSingle'
        //     }
        //     this.afterSalesOrderEditInfo=row;
        //     this.afterSalesOrderEditInfo.edit=true;
        //     this.isOrderInfoShow=true;
        // },
        //订单详情弹窗
        handleOrderInfo(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:'EB',
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=true;
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

        gotoAfterSalesOrderList(id) {
            let path = '/EbayAfterSalesOrderManagement';
            let query = {after_order_number: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },

        gotoDisputeCenterList(v) {
            if( v.dispute_type == 'return' ) {
                this.gotoReturnList(v.return_id);
            }
            if( v.dispute_type == 'inquiry' ) {
                this.gotoInrList(v.inquiry_id);
            }
            if( v.dispute_type == 'cancel' ) {
                this.gotoCancelList(v.cancel_id);
            }
        },

        gotoCancelList(id) {
            let path = '/EbayCancel';
            let query = {cancel_id: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoInrList(id) {
            let path = '/EbayINR';
            let query = {inquiry_id: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },
        gotoReturnList(id) {
            let path = '/EbayReturn';
            let query = {return_id: id, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
        },

        // 把空格替换
        spaceConversionFn(v) {
            return v ? v.replace(/\s/g, '&nbsp;') : '';
        }
    },
}
</script>
