<style lang="less" scoped>

</style>

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
                    <!-- <span v-for="item in optionListLabel.batchEditArr">
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
                    </span> -->
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
                        <div style="word-wrap:break-word;cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['refresh'].permit(thisVm)" type="text" @click="handleRefresh(scope.row)" size="mini">刷新</el-button>
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
        </div>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import config from '@/assets/js/config';
import OrderInformation from '../OrderInformation';
import {getEbayCancelOrderList, cancelOrderFlush} from '../../../../api/orderInfo/Ebay/CancelOrderResult';

export default {
    name: 'CancelOrderResult',
    components: {
        OrderInformation,
    },
    data () {
        return {
            //订单详情相关
            isOrderInfoShow: false,
            orderInfo:{},

            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['账号', '订单号', '平台订单号', '状态', '失败原因', '操作人', '操作时间', '操作'],
            tableProps: ['account_name', 'order_id', 'platform_order_id', 'status', 'error_info', 'creater', 'created_time', 'operate'],
            tableWidth: ['', '', '', '', '', '', '', '', '', ''],
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
            // // 判断是否取缓存参数
            //     console.log('this.queryData',this.queryParamsInfo['cancel_order_result'])
            // if (isSave) {
            //     this.queryData = JSON.parse(this.queryParamsInfo['cancel_order_result']);
            // }
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
                page: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                limit: this.pageData.currentList
            };
            this.tableLoading = true;
            getEbayCancelOrderList(obj).then(({data}) => {
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

        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },

        //刷新
        handleRefresh(row){
            cancelOrderFlush({id: row.id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
                    return;
                }else{
                    this.handleQueryInfo({}, true);
                    this.$message.success('操作成功!');
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
}
</script>
