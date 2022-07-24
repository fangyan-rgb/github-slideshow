<style lang="less" scoped>

</style>

<template>
    <div class="EbayReceiptRequestListwrap">
        <div class="EbayReceiptRequestListbox">

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
                    <template slot-scope="scope" slot="order_id">
                        <div>
                            <span style="cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</span>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="total_amount">
                        <div>
                            <span style="color: #f90; font-weight: bold;">{{scope.row.total_amount}}</span>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['cancelPay'].permit(thisVm) && scope.row.request_status == '请求成功'" @click="handleCancelPayFn(scope.row.id)" type="text" size="mini">取消收款</el-button>
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
    cancelEbayPaypal,
} from '@/api/AfterSalesManagement/Ebay/ReceiptRequestList';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";

export default {
    name: 'EbayReceiptRequestList',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['订单号', '平台账号', '买家ID', '收款账号', '付款账号', '金额', '请求状态', '创建时间', '创建人', '留言', '操作'],
            tableProps: ['order_id', 'account_id', 'buyer_id', 'merchant_email', 'payer_email', 'total_amount', 'request_status', 'create_time', 'create_by', 'note', 'operate'],
            tableWidth: ['order_id', 'account_id', 'buyer_id', 'merchant_email', 'payer_email', 'total_amount', 'request_status', 'create_time', 'create_by', 'note', '100'],
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
                    {id: 1, name: '批量取消收款', button:'batchCancelPay', iconName:"piliangtuikuanchenggong", color:'#ff9860'},
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

            // 订单弹窗相关
            isOrderInfoShow:false,  //订单详情弹窗
            orderInfo:{},
            afterSalesOrderEditInfo:{},
        }
    },
    components: {OrderInformation},
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
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_ReceiptRequest_List']);
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
                key: 'Ebay_ReceiptRequest_List',
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
                    // 批量回复
                    this.batchCancelPayFn();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 批量取消收款
        batchCancelPayFn() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }

            if( this.saveCheckInfo.some(e => e.request_status != '请求成功') ){
                this.$message.warning('请筛选请求状态为请求成功的数据！');
                return;
            }

            this.handleCancelPayFn(this.saveCheckIds);
        },

        // 取消收款
        handleCancelPayFn(id) {
            this.$confirm('确认取消收款？', '提示', {
                type: 'warning'
            }).then(() => {
                cancelEbayPaypal({id}).then(({data}) => {
                    if (data.status) {
                        this.$message.success(data.message);
                        this.saveCheckInfo = [];
                        this.saveCheckIds = '';
                        this.handleQueryInfo({}, true);
                    } else {
                        this.$message.error(data.errorMess || '操作失败！');
                    }
                }).catch(err => {

                });
            }).catch(() => {

            });
        },

        // 订单弹窗相关
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow = bool;
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
    },
}
</script>
