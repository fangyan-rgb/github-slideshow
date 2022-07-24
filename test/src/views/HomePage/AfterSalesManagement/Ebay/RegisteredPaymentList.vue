<style lang="less" scoped>

</style>

<template>
    <div class="EbayRegisteredPaymentListwrap">
        <div class="EbayRegisteredPaymentListbox">

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
                            v-if="buttonList[item.button].permit(thisVm)"
                            @click="batchEditFn(item.id)"
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
                    <template slot-scope="scope" slot="operateInfo">
                        <div>{{scope.row.modifier}}</div>
                        <div>{{scope.row.modified_time}}</div>
                    </template>
                    <template slot-scope="scope" slot="order_id">
                        <div>
                            <span style="cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</span>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="receipt_money">
                        <div>
                            <span style="color: #f90; font-weight: bold;">{{scope.row.receipt_money}}</span>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['edit'].permit(thisVm)" @click="handleEditFn(scope.row)" type="text" size="mini">编辑</el-button>
                        <ComDivide v-if="buttonList['edit'].permit(thisVm)"/>
                        <el-button v-if="buttonList['del'].permit(thisVm)" @click="handleDelFn(scope.row)" type="text" size="mini">删除</el-button>
                        <ComDivide v-if="buttonList['del'].permit(thisVm)"/>
                        <el-button v-if="buttonList['log'].permit(thisVm)" @click="handleLogFn(scope.row.after_sale_receipt_id)" type="text" size="mini">日志</el-button>
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

        <!-- 登记收款 -->
        <RegisteredReceivables
            v-if="isRegisteredReceivables"
            :showRegisteredReceivables="isRegisteredReceivables"
            :orderInfo="order"
            :RegisteredReceivables="RegisteredReceivablesInfo"
            :sendRegisteredReceivables="sendRegisteredReceivablesInfo"
            @RegisteredReceivablesReceiptRequest="handleQueryInfo({}, true);"
            @handlesendRegisteredReceivablesCancel="isRegisteredReceivables=false"
            ></RegisteredReceivables>

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
    dataOutput,
    delItem,
    registeredReceivablesData,
    getShowEdit,
    getLogs,
} from '@/api/AfterSalesManagement/Ebay/RegisteredPaymentList';
import { getSessionStorage } from '@/utils/storage';
import RegisteredReceivables from '../../OrderManagement/component/RegisteredReceivables';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";

export default {
    name: 'EbayRegisteredPaymentList',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['订单号', '平台账号', '买家ID', '收款账号', '付款账号', '收款方式', '收款原因', '交易时间', 'Paypal交易号', '金额', '状态', '操作信息', '操作'],
            tableProps: ['order_id', 'account_name', 'buyer_id', 'paypal_account', 'payment_account', 'receipt_type', 'receipt_reason_type', 'transaction_hour', 'transaction_id', 'receipt_money', 'status', 'operateInfo', 'operate'],
            tableWidth: ['order_id', 'account_name', 'buyer_id', 'paypal_account', 'payment_account', 'receipt_type', 'receipt_reason_type', 'transaction_hour', 'transaction_id', 'receipt_money', 'status', 'operateInfo', '120'],
            tableData: [],
            // 表格加载动画
            tableLoading: false,

            // 分页数据
            pageSizes: config.pageData.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 20,
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
                    {id: 1, name: '数据导出', button:'dataExport', iconName:"daochu", color:'#72afff'},
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

            // 日志相关
            logInfo: {
                tableData: [],
                tableProps: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableWidth: ['', '', ''],
                isShowLog: false,
            },

            isRegisteredReceivables:false,
            order:{},
            RegisteredReceivablesInfo: {
                order: {
                    account_id: "",
                    account_name: "",
                    buyer_id: "",
                    order_id: "",
                    platform_code: ""
                },
            },
            sendRegisteredReceivablesInfo: { //登记收款
                account_id:"",
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

            // 订单弹窗相关
            isOrderInfoShow:false,  //订单详情弹窗
            orderInfo:{},
            afterSalesOrderEditInfo:{},
        }
    },
    components: {
        RegisteredReceivables,
        OrderInformation,
    },
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
    },
    methods: {
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_RegisteredPayment_List']);
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
                key: 'Ebay_RegisteredPayment_List',
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

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 1:
                    // 数据导出
                    this.dataExportFn();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 数据导出
        dataExportFn() {
            this.$confirm('是否导出数据？', '提示', {
                type: 'warning'
            }).then(() => {
                let data = JSON.parse(this.queryParamsInfo['Ebay_RegisteredPayment_List'] || '{}');
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

        // 删除
        handleDelFn(row) {
            this.$confirm('是否删除？', '提示', {
                type: 'warning'
            }).then(() => {
                delItem({after_sale_receipt_id: row.after_sale_receipt_id}).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.handleOperationCallBack(data);
                }).catch(err => {

                });
            }).catch(() => {

            });
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

        // 编辑
        handleEditFn(row) {
            // if(row.payment_status=='0'||row.payment_status==''){
            //         this.$message.error('该订单未付款，不能进行收款登记操作！');
            //         return;
            // }
            let obj = {
                order_id: row.order_id,
                platform_code: row.platform_code,
                account_id:row.account_id
            }
            registeredReceivablesData(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.RegisteredReceivablesInfo=data.data_list;
                // console.log(this.RegisteredReceivablesInfo)
                this.RegisteredReceivablesInfo.order.account_name = row.account_name;
                this.RegisteredReceivablesInfo.edit=true;
            })
            getShowEdit({after_sale_receipt_id:row.after_sale_receipt_id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.sendRegisteredReceivablesInfo.receipt_reason_type= data.data_list.value.receipt_reason_type, //原因
                this.order = data.data_list.value;
                if(row.receipt_type=='paypal收款'){
                    this.sendRegisteredReceivablesInfo.receipt_type='1';
                }else if(row.receipt_type=='线下收款'){
                    this.sendRegisteredReceivablesInfo.receipt_type='2';
                }
                this.sendRegisteredReceivablesInfo.receipt_bank = this.RegisteredReceivablesInfo.receipt_bank
                this.sendRegisteredReceivablesInfo.platform_code = row.platform_code; //平台
                this.sendRegisteredReceivablesInfo.order_id = row.order_id; //订单号
                this.sendRegisteredReceivablesInfo.account_id = row.account_id; //账号id
                this.sendRegisteredReceivablesInfo.buyer_id = row.buyer_id; //客户ID
                this.sendRegisteredReceivablesInfo.receipt_money= row.receipt_money, //交易金额
                this.sendRegisteredReceivablesInfo.receipt_currency= '', //交易金额单位
                this.sendRegisteredReceivablesInfo.paypal_account_id= row.paypal_account, //paypal账号id
                this.sendRegisteredReceivablesInfo.paypal_account= row.paypal_account, //paypal账号
                this.sendRegisteredReceivablesInfo.transaction_id= row.transaction_id, //交易号
                this.sendRegisteredReceivablesInfo.transaction_hour= row.transaction_hour, //交易时间
                this.sendRegisteredReceivablesInfo.status= row.status, //状态
                this.sendRegisteredReceivablesInfo.payment_account= row.payment_account, //	付款账号
                this.sendRegisteredReceivablesInfo.receipt_bank= '', //收款银行
                this.sendRegisteredReceivablesInfo.receipt_bank_sn= '', //交易流水号
                this.sendRegisteredReceivablesInfo.receipt_bank_account= '', //银行账号

                this.isRegisteredReceivables = !this.isRegisteredReceivables;
            });
        },

        // 订单弹窗相关
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow = bool;
        },
        // // 修改信息
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
                platform_code:row.platform_code,
                edit:false,
                title:'订单信息',
                operation:'handleOrder'
            }
            this.isOrderInfoShow=true;
        },
    },
}
</script>
