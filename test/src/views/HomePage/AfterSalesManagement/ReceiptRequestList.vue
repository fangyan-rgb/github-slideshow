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
                <div>订单号： <span style="cursor:pointer; color: #3388ff;" type="text" @click="handleOrderNum(scope.row)">
                    {{scope.row.order_id}}</span>
                </div>
            </template>
            <!-- 产品asin -->
            <template slot-scope="scope" slot="asin">
                <div v-for="(value,key) in scope.row.asin" >
                    <span style="cursor:pointer; color: #3388ff;" href='' @click="handleJumpSkuUrl(value)">{{key}}</span>
                </div>
            </template>
            <template slot-scope="scope" slot="total_amount">
                <div>
                    <span style="color: #f90; font-weight: bold;">{{scope.row.total_amount}}</span>
                </div>
            </template>
            <template slot-scope="scope" slot="note">
                <div>
                    <el-popover
                        placement="top"
                        width="260"
                        trigger="hover"
                        :content="scope.row.note">
                        <a href="javascript:;" class="ellipsis1" slot="reference">{{scope.row.note}}</a>
                    </el-popover>
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
        getRequestList,
    } from '../../../api/AfterSalesManagement/receiptRequestList'
    import {getSessionStorage} from '@/utils/storage';
    import OrderInformation from "../OrderManagement/OrderInformation"

    export default {
        name: 'ReceiptRequestList',
        components: {
            OrderInformation,
        },
        data () {
            return {
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
                tableKey: ['订单号', "产品Asin", "销售账号", "客户ID", "收款账号","客户账号", "金额", "留言"],
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
            }
        },
        methods: {
            ...mapActions(["GetRequestList"]),
            getRequestList,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                if (isSave) {
                    this.queryData = JSON.parse(this.queryParamsInfo['receipt_requestInfo']);
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
                this.GetRequestList(obj).then(({data}) => {
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
                    key: 'receipt_requestInfo',
                    value: JSON.stringify(this.queryData)
                });
                this.optionList = data.data_list.drop_down_box;
                this.tableData = data.data_list.value;
                this.tableProps = ['order_id', 'asin', 'account_id', 'buyer_id', 'merchant_email', 'payer_email', 'total_amount','note'],
                this.tableWidth = ['190', '135', 'account_id', 'buyer_id', 'merchant_email', 'payer_email', '135','note'],
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
            // 产品asin
            handleJumpSkuUrl(url) {
                if (url) {
                    window.open(url)
                }
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
            }
        },
        created() {
            this.thisVm = this;
            try {
                if (this.$route.query._cacheType === '1' || JSON.stringify(this.ReceiptRequestInfo) === "{}") {
                    // this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo["receipt_requestInfo"]);
                    this.handleQueryInfoCallBack(this.ReceiptRequestInfo);
                }
            } catch (e) {}

        },
        computed: {
            ...mapGetters(['queryParamsInfo', 'ReceiptRequestInfo']),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
    }
</script>

<style scoped lang="less">

</style>