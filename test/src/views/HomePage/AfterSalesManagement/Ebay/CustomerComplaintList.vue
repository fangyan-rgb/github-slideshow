<style lang="less" scoped>

</style>

<template>
    <div class="EbayCustomerComplaintListwrap">
        <div class="EbayCustomerComplaintListbox">

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
                    <template slot-scope="scope" slot="invoiceinfo">
                        <div>订单号：<span style="cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</span></div>
                        <div>客诉单号：{{scope.row.complaint_order}}</div>
                        <div>发货时间：{{scope.row.shipping_date}}</div>
                    </template>
                    <template slot-scope="scope" slot="productinfo">
                        <div v-if="scope.row.product && scope.row.product.length">
                            <div>SKU：
                                <ProdInfoPopup :list="scope.row.product">
                                    {{scope.row.product[0].sku}}
                                </ProdInfoPopup>
                            </div>
                            <div>产品名称：{{scope.row.product[0].title}}</div>
                            <div>Item ID：<a target="_blank" style="color: #3388ff;" :href="'https://www.ebay.com/itm/' + scope.row.product[0].item_id">{{scope.row.product[0].item_id}}</a></div>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="buyerinfo">
                        <div>买家邮箱：{{scope.row.buyer_mail}}</div>
                        <div>买家电话：{{scope.row.buyer_phone}}</div>
                    </template>
                    <template slot-scope="scope" slot="customerinfo">
                        <div>客诉类型：{{scope.row.complaint_type}}</div>
                        <div>详细描述：
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div v-html="spaceConversionFn(scope.row.description)" style="max-height: 400px; overflow-y: auto;"></div>
                                <a v-html="'详细描述：' + spaceConversionFn(scope.row.description)" href="javascript:;" class="ellipsis4" slot="reference"></a>
                            </el-popover>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="processinfo">
                        <div>处理次数：{{scope.row.processing_times}}</div>
                        <div>处理人：{{scope.row.processing_by}}</div>
                        <div>处理时间：{{scope.row.last_processing_time}}</div>
                        <div>处理部门：{{scope.row.department}}</div>
                    </template>
                    <template slot-scope="scope" slot="processing_result">
                        <div>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.processing_result === '未处理'"></span>
                            <span class="ui-state_circle grayColor" v-if="scope.row.processing_result === '已处理'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.processing_result === '待确认'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.processing_result === '已驳回'"></span>
                            {{scope.row.processing_result}}
                        </div>
                    </template>
                    <template slot-scope="scope" slot="check_status">
                        <div>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.check_status === '待审核'"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.check_status === '审核通过'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.check_status === '审核不通过'"></span>
                            {{scope.row.check_status}}
                        </div>
                    </template>
                    <template slot-scope="scope" slot="status">
                        <div>
                            <span class="ui-state_circle grayColor" v-if="scope.row.status === '待处理'"></span>
                            <span class="ui-state_circle blueColor" v-if="scope.row.status === '已确认'"></span>
                            <span class="ui-state_circle orangeColor" v-if="scope.row.status === '待确认'"></span>
                            {{scope.row.status}}
                        </div>
                    </template>
                    <template slot-scope="scope" slot="createinfo">
                        <div>创建人：{{scope.row.create_user}}</div>
                        <div>创建时间：{{scope.row.create_time}}</div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <span v-if="scope.row.check_status === '待审核' && buttonList['toExamine'].permit(thisVm)"><el-button type="text" @click="handleExamineCustomerComplaint(scope.row)">审核</el-button><ComDivide/></span>
                        <span v-if="scope.row.check_status === '审核通过' && buttonList['handle'].permit(thisVm)"><el-button type="text" @click="handleOperateConfirmOrReject(scope.row)" :disabled="scope.row.status=='待确认'?false:true">处理</el-button><ComDivide/></span>
                        <span v-if="(scope.row.check_status === '待审核'||scope.row.check_status === '审核不通过') && buttonList['edit'].permit(thisVm)"><el-button type="text" @click="handleEditCustomerComplaint(scope.row)">修改</el-button><ComDivide/></span>
                        <el-button v-if="buttonList['del'].permit(thisVm) && ['待审核', '审核不通过'].includes(scope.row.check_status)" @click="handleDelFn(scope.row)" type="text" size="mini">删除</el-button>
                        <ComDivide v-if="buttonList['del'].permit(thisVm) && ['待审核', '审核不通过'].includes(scope.row.check_status)"/>
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

        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            :customerComplaintId='customerComplaintId'
            @handleQueryInfo="handleQueryInfo({}, true)"
            @handleComplaintOrder="isOrderInfoShow=false; handleQueryInfo({customer_complaint_number: $event})"
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
    postConfirm,
    getLogs,
    postReject,
    postDelete,
} from '@/api/AfterSalesManagement/Ebay/CustomerComplaintList';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import ProdInfoPopup from '@/views/HomePage/Ebay/components/ProdInfoPopup';

export default {
    name: 'EbayCustomerComplaintList',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['单据信息', '产品信息', '买家信息', '客诉信息', '处理信息', '处理结果', '审核状态', '处理状态', '创建信息', '操作'],
            tableProps: ['invoiceinfo', 'productinfo', 'buyerinfo', 'customerinfo', 'processinfo', 'processing_result', 'check_status', 'status', 'createinfo', 'operate'],
            tableWidth: ['200', '200', '180', '180', '140', '180', '80', '80', '200', '200'],
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
                    {id: 1, name: '批量确认', button:'batchConfirm', iconName:"piliangqueren", color:'#6facff'},
                    {id: 2, name: '批量驳回', button:'batchReject', iconName:"piliangbohui", color:'#ff6666'},
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

            // 订单弹窗相关
            isOrderInfoShow:false,  //订单详情弹窗
            orderInfo:{},
            afterSalesOrderEditInfo:{},
            customerComplaintId:{},
        }
    },
    components: {OrderInformation, ProdInfoPopup},
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
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_CustomerComplaint_List']);
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
                key: 'Ebay_CustomerComplaint_List',
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
                    // 批量确认
                    this.confirmFn();
                    break;
                case 2:
                    // 批量驳回
                    this.rejectFn();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 批量确认
        confirmFn() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let flag = true;
            this.saveCheckInfo.forEach(item => {
                if (item.status !== "待确认") {
                    flag = false;
                }
            });
            if (!flag) {
                this.$message.warning('勾选的数据必须是待确认状态！');
                return;
            }
            postConfirm({id: this.saveCheckIds}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(err => {

            });
        },

        // 批量驳回
        rejectFn() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let flag = true;
            this.saveCheckInfo.forEach(item => {
                if (item.status !== "待确认") {
                    flag = false;
                }
            });
            if (!flag) {
                this.$message.warning('勾选的数据必须是待确认状态！');
                return;
            }
            this.$confirm('确定驳回吗？', '提示', {
                type:'warning'
            }).then(()=>{
                postReject({
                    id: this.saveCheckIds
                }).then(({data})=>{
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.handleOperationCallBack(data)
                }).catch(err => {

                });
            }).catch(err => {

            });
        },

        // 删除
        handleDelFn(row) {
            this.$confirm('是否删除？', '提示', {
                type: 'warning'
            }).then(() => {
                postDelete({id: row.id}).then(({data}) => {
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
                    this.logInfo.tableProps = ['content', 'created_by', 'created_at'];
                }
            }).catch(error => {

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

        // 把空格替换
        spaceConversionFn(v) {
            return v ? v.replace(/\s/g, '&nbsp;') : '';
        },
        //审核客诉单
        handleExamineCustomerComplaint(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                operation:'EtidCustomerComplaintSlip',
                title:'客诉单审核',
                examine:true
            }
            this.customerComplaintId={
                id:row.id
            }
            this.isOrderInfoShow=true;
            this.handleQueryInfo({}, true);
        },
        //处理客诉单（确定/驳回）
        handleOperateConfirmOrReject(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                title:'客诉单处理',
                operation:'EtidCustomerComplaintSlip'
            }
            this.customerComplaintId={
                id:row.id
            }
            this.isOrderInfoShow=!this.isOrderInfoShow;
            this.handleQueryInfo({}, true);
        },
        //修改客诉单
        handleEditCustomerComplaint(row){
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                operation:'registeredRCustomerComplaintSlip',
                title:'客诉单修改',
                edit:true
            }
            this.customerComplaintId={
                id:row.id
            }
            this.isOrderInfoShow=true;
            this.handleQueryInfo({}, true);
        },
    },
}
</script>
