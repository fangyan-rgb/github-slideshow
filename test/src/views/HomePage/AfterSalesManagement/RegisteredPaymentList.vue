<template>
    <div class="ui-main-module">
        <!-- 搜索框 -->
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button size="small" type="text" @click="handleExportData" v-if="buttonList['bacthExport'].permit(thisVm)">
                <i class="icon-daochu" style="color: #72afff;font-size:12px;"></i>导出
            </el-button>
        </div>
        <!-- 列表 -->
        <ComTableInfo
                isCheck
                @checked="handleCheck"
                :tableWidth="tableWidth"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :showSearch="showSearch"
                :searchHeight="searchHeight"
                :otherHeight="['el-tabs__header']"
                :tableLoading="tableLoading">
            <!-- 订单号 -->
            <template slot-scope="scope" slot="order_id">
                <div>订单号： <span style="cursor:pointer; color: #3388ff;" type="text" @click="handleOrderNum(scope.row)">{{scope.row.order_id}}
                </span>
                </div>
            </template>
            <template slot-scope="scope" slot="receipt_money">
                <div>
                    <span style="color: #f90; font-weight: bold;">{{scope.row.receipt_money}}</span>
                </div>
            </template>
            <template slot-scope="scope" slot="transaction_hour">
                <div>
                    {{scope.row.transaction_hour == '0000-00-00 00:00:00' ? '' : scope.row.transaction_hour}}
                </div>
            </template>
        </ComTableInfo>
        <!-- 分页 -->
        <div class="ui-main-module-page">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="pageData.currentPage" :page-sizes="pageSizes"
                           :page-size="pageData.currentList"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="pageData.currentTotal">
            </el-pagination>
        </div>
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
    import config from '@/assets/js/config';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getRegisterList,
    } from '../../../api/AfterSalesManagement/registeredPaymentList'
    import {getSessionStorage} from '@/utils/storage';
    import OrderInformation from "../OrderManagement/OrderInformation"

    export default {
        name: 'RegisteredPaymentList',
        components: {
            OrderInformation,
        },
        data () {
            return {
                thisVm:{},
                orderInfo:{},
                isOrderInfoShow:false,//订单详情弹窗
                searchHeight: false,
                //默认图片
                defaultImg: require("../../../assets/image/default_error.png"),
                // 搜索框
                showSearch: true,
                queryData: {
                    mainQuery: {}
                },
                checkList: [],
                // 数据
                tableData: [],
                tableKey: ['订单号', "销售账号", "客户ID", "收款账号", "付款账号","付款方式", "交易时间", "Paypal交易号", "金额", "状态"],
                tableProps: [],
                tableWidth: [],
                // 表格加载动画
                tableLoading: false,

                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
                //id参数
                ids: '',
                platform: 'Amazon',
                checkList:[],
            }
        },
        methods: {
            ...mapActions(["GetRegisterList"]),
            getRegisterList,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                if (isSave) {
                    this.queryData = JSON.parse(this.queryParamsInfo['registered_paymentInfo']);
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
                this.GetRegisterList(obj).then(({data}) => {
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

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    mainQuery: {}
                }
            },
            // 查询回调
            handleQueryInfoCallBack(data){

                // 获取保存的查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'registered_paymentInfo',
                    value: JSON.stringify(this.queryData)
                });
                this.optionList = data.data_list.drop_down_box;
                this.tableData = data.data_list.value;
                this.tableProps = ['order_id', 'account_name', 'buyer_id', 'paypal_account', 'payment_account', 'receipt_type', 'transaction_hour', 'transaction_id','receipt_money', 'status'],
                this.tableWidth = ['190', '', '', '', '', '', '140', '','', ''],
                    // 渲染分页
                this.pageData.currentPage = data.page_data.offset * 1;
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentTotal = data.page_data.total * 1;

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },
            // 操作回调
            handleOperationCall(data) {
                if (data.status) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.handleQueryInfo({}, true);
                } else {
                    this.$message({
                        type: 'error',
                        message: data.errorMess || '操作失败'
                    })
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
            // 列表勾选
            handleCheck(row) {
                this.checkList = row
                let idArr = [];
                this.checkList.forEach(item => {
                    idArr.push(item.id)
                });
                this.ids = idArr.join(',')
            },
            handleTabsClick(item) {
                console.log('获取点击tab值',item)
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
            //勾选数据
            handleCheck(row){
                this.checkList = row;
            },
            //数据导出
            handleExportData(params = {}, url = '/api/aftersales/after_sales_receipt/get_download'){
                if(this.pageData.currentTotal>10000){
                    this.$message.warning('最多只能导出一万条，请筛选条件后再进行操作！');
                    return;
                }
                let obj = {};
                for (const key in this.queryData.mainQuery) {
                    if (this.queryData.mainQuery[key]&&this.queryData.mainQuery[key].length!==0) {
                        obj[key] = this.queryData.mainQuery[key];
                    }
                }
                params = JSON.parse(getSessionStorage('userInfo'));
                const query = Object.entries(obj).reduce((str, [key, value], idx) => {
                    const next = idx === 0 ? `&${key}=${value}` : `&${key}=${value}`;
                    return str + next;
                }, '')
                window.location = url+'?uid='+params.uid+'&staff_code='+params.staff_code+query;
            }
        },
        created() {
            this.thisVm = this;
            try {
                if (this.$route.query._cacheType === '1' || JSON.stringify(this.RegisteredPaymentInfo) === "{}") {
                    // this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo["registered_paymentInfo"]);
                    this.handleQueryInfoCallBack(this.RegisteredPaymentInfo);
                }
            } catch (e) {}

        },
        computed: {
            ...mapGetters(['queryParamsInfo', 'RegisteredPaymentInfo']),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
    }
</script>

<style scoped lang="less">

</style>