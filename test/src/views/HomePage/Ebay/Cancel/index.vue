<style lang="less" scoped>

</style>

<template>
    <div class="EbayCancelwrap">
        <div class="EbayCancelbox">

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
                            v-if="(buttonList[item.button].permit(thisVm)) && ![8, 9].find(e => e === item.id)"
                            @click="batchEditFn(item.id)"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                        <el-button
                            v-if="(buttonList[item.button].permit(thisVm)) && [8, 9].find(e => e === item.id)"
                            @click="handleCopyEmpty(saveCheckInfo.map(e => {if(item.id === 8){return e.product_info.map(e => e.item_id).join(',')};if(item.id === 9){return e.account_name};}).join(','))"
                            :data-clipboard-text="saveCheckInfo.map(e => {if(item.id === 8){return e.product_info.map(e => e.item_id).join(',')};if(item.id === 9){return e.account_name};}).join(',')"
                            class="copyBtn"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
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
                    <template slot-scope="scope" slot="accountinfo">
                        <div>Cancel ID：{{scope.row.cancel_id}}</div>
                        <div>平台账号：{{scope.row.account_name}}</div>
                        <div>刊登地点：{{scope.row.marketplace_id}}</div>
                        <div>客服人员：{{scope.row.create_by}}</div>
                        <div>是否有消息：<a v-if="scope.row.message_id" @click="gotoMessagePageFn(scope.row.order_id)" href="javascript:;" style="color: #3388ff;">有</a><span v-else>无</span></div>
                    </template>
                    <template slot-scope="scope" slot="orderinfo">
                        <div>订单号：<span style="cursor: pointer;color: #3388ff;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</span></div>
                        <div>平台订单号：{{scope.row.platform_order_id}}</div>
                        <div>订单状态：{{scope.row.complete_status}}</div>
                        <div>订单类型：{{scope.row.order_type}}</div>
                        <div>买家ID：{{scope.row.buyer}}</div>
                        <div>付款状态：{{scope.row.payment_status}}</div>
                        <div>付款时间：{{scope.row.paytime}}</div>
                    </template>
                    <template slot-scope="scope" slot="productinfo">
                        <div>
                            <div>Item ID：<a v-if="scope.row.product_info && scope.row.product_info.length" target="_blank" style="color: #3388ff;" :href="'https://www.ebay.com/itm/' + scope.row.product_info[0].item_id">{{scope.row.product_info[0].item_id}}</a></div>
                            <div>公司SKU：
                                <ProdInfoPopup v-if="scope.row.product_info && scope.row.product_info.length" :list="scope.row.product_info">
                                    {{scope.row.product_info[0].sku}}
                                </ProdInfoPopup>
                            </div>
                            <div>产品名称：{{scope.row.product_info && scope.row.product_info.length ? scope.row.product_info[0].title : ''}}</div>
                            <div>公司产品线：{{scope.row.product_info && scope.row.product_info.length ? scope.row.product_info[0].linelist_cn_name : ''}}</div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="disputeinfo">
                        <div>纠纷状况：{{scope.row.state}}</div>
                        <div>纠纷状态：{{scope.row.status}}</div>
                        <div>发起方：{{scope.row.initiator}}</div>
                        <div>退款金额：{{scope.row.refund_amount}}</div>
                        <div>处理状态：{{scope.row.is_deal}}</div>
                    </template>
                    <template slot-scope="scope" slot="timeinfo">
                        <div v-if="scope.row.remain_time">
                            <p v-if="parseInt(scope.row.remain_time) > 0">剩余时间：<span style="color: blue;">{{scope.row.remain_time}}</span></p>
                            <p v-else>剩余时间：<span style="color: red;">已超时</span></p>
                        </div>
                        <div>创建时间：{{scope.row.create_time}}</div>
                        <div>更新时间：{{scope.row.update_time}}</div>
                        <div>截止时间：{{scope.row.cancel_close_date}}</div>
                        <div>发货时间：{{scope.row.shipment_date}}</div>
                    </template>
                    <template slot-scope="scope" slot="sendinfo">
                        <div>发货仓库：{{scope.row.warehouse_name}}</div>
                        <div>发货方式：{{scope.row.real_ship_code}}</div>
                        <div>收货国家：{{scope.row.ship_country_name}}</div>
                        <div>跟踪号：<a :href="'https://t.17track.net/en#nums=' + scope.row.track_number" style="color: #3388ff;" target="_blank">{{scope.row.track_number}}</a></div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['dealWith'].permit(thisVm)" @click="handleCancel(scope.row)" type="text" size="mini">处理</el-button>
                        <ComDivide v-if="buttonList['dealWith'].permit(thisVm)"/>
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

        <!-- 批量接受弹窗 -->
        <el-dialog
            class="ui-layout_edit-dialog zindexhighest"
            title="批量接受备注"
            width="475px"
            :visible.sync="batchAcceptObj.dialog">
            <div>
                <el-input v-model="batchAcceptObj.form.explain" type="textarea" :rows="5" maxlength="1000" show-word-limit placeholder="请输入" size="small"></el-input>
            </div>
            <span slot="footer">
                <el-button @click="batchAcceptObj.dialog = false" size="small">取 消</el-button>
                <el-button @click="submitBatchAcceptObj()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>

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
            @handleReload="handleReload"
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
    approveCancel,
    saveKefu,
} from '@/api/Ebay/Cancel';
import {
    getkefu,
} from '@/api/MailCenterManagement/Inbox';
import ProdInfoPopup from '@/views/HomePage/Ebay/components/ProdInfoPopup';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import routerConfig from '@/router/routerConfig';
import * as storage from '@/utils/storage';
// 复制到剪贴板功能
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'EbayCancel',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['账号信息', '订单信息', '产品信息', '纠纷说明', '时间信息', '发货信息', '操作'],
            tableProps: ['accountinfo', 'orderinfo', 'productinfo', 'disputeinfo', 'timeinfo', 'sendinfo', 'operate'],
            tableWidth: ['accountinfo', 'orderinfo', 'productinfo', 'disputeinfo', '200', 'sendinfo', '100'],
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

            optionListLabel: {
                curBatchEditId: '',
                batchEditArr: [
                    {id: 1, name: '批量接受', button:'batchAccept', iconName:"piliangqueren", color:'#6facff'},
                    {id: 5, name: '批量修改客服', button:'batchChangeCust', iconName:"piliangfenpeikefu", color:'#72afff'},
                    {id: 8, name: '批量复制Item ID', button:'copyItemID', iconName:"fuzhi", color:'#6facff'},
                    {id: 9, name: '批量复制账号', button:'copyAccount', iconName:"fuzhi", color:'#6facff'},
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

            batchAcceptObj: {
                dialog: false,
                form: {
                    explain: '买家取消订单',
                },
            },

            // 表单验证
            formRules: {
                one: [
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
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_Cancel']);
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
                limit: this.pageData.currentList
            };

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
                key: 'Ebay_Cancel',
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

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 1:
                    // 批量接受
                    this.batchAccept();
                    break;
                case 5:
                    // 批量修改客服
                    this.batchKefu();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 批量接受
        batchAccept() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.batchAcceptObj.dialog = true;
            this.batchAcceptObj.form = {
                explain: '买家取消订单',
            };
        },
        submitBatchAcceptObj() {
            if( !this.batchAcceptObj.form.explain ){
                this.$message.warning('请填写备注！');
                return;
            }
            approveCancel({
                ids: this.saveCheckIds,
                explain: this.batchAcceptObj.form.explain,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.batchAcceptObj.dialog = false;
                this.handleOperationCallBack(data);
            }).catch(error => {

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
                    let id = this.saveCheckInfo.map(e => e.id).join(',');
                    saveKefu({id, user_number: this.batchEditObj.batchKefuForm.one}).then(({data}) => {
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

        // 日志
        handleLogFn(id) {
            getLogs({
                id,
                limit: 1000,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.logInfo.isShowLog = true;
                if (data.data_list.value) {
                    this.logInfo.tableData = data.data_list.value;
                    this.logInfo.tableProps = ['behavior', 'create_by_name', 'create_time'];
                }
            }).catch(error => {

            });
        },

        // 跳往消息页面
        gotoMessagePageFn(id) {
            let path = '/EbayMessage';
            let query = {order_id: id, message_type: 2, _cacheType:'1'};
            this.$router.push({path, query});

            this.changeNavShowFn(path);
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

        // 订单弹窗相关
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow = bool;
        },
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
        handleReload(){
            this.handleQueryInfo({}, true);
        },
        //cancel处理
        handleCancel(row){
            if(!row.order_id){
                this.$message.error('该纠纷没有订单信息！');
                return
            }
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
        }
    },
}
</script>
