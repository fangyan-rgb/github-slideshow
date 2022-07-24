<template>
    <div class="ui-main-module">
        <!-- 搜索框 -->
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <!-- 平台 -->
                     <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button type="text" @click="handleBatchConfirm()" v-if="buttonList['bacthConfirm'].permit(thisVm)">
                <i class="icon-piliangqueren" style="color: #75b1fc" ></i>批量确认</el-button>
            <el-button type="text" @click="handleBatchReject()"
                       v-if="buttonList['batchReject'].permit(thisVm)"><i class="icon-piliangbohui" style="color: #ff6666" ></i>批量驳回</el-button>
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
            <!-- 单据信息 -->
            <template slot-scope="scope" slot="receiptInfo">
                <div>订单号： <span style="cursor:pointer; color: #3388ff;" type="text" @click="handleOrderNum(scope.row)">
                    {{scope.row.order_id}}</span>
                </div>
                <div>客诉单号：{{scope.row.complaint_order}}</div>
                <div>发货时间：{{scope.row.shipping_date == '0000-00-00 00:00:00' ? '' : scope.row.shipping_date}}</div>
            </template>
            <!-- 产品信息 -->
            <template slot-scope="scope" slot="productInfo">
                <!--SKU:<div v-for="(item, index) in str2arr(scope.row.sku, ',')" :key="index">{{item}}</div>-->
                <div style="display:flex;">
                    <div style="width:40px;flex:none;">SKU:</div>
                    <div>
                        <el-popover
                            placement="right"
                            width="400"
                            trigger="hover">
                            <table class="commontablestyle" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="55">SKU</td>
                                    <td>产品名称</td>
                                    <td width="30">数量</td>
                                    <td width="90">Asin</td>
                                </tr>
                                <tr v-for="v in scope.row.product">
                                    <td>{{v.sku}}</td>
                                    <td>{{v.title}}</td>
                                    <td>{{v.qty}}</td>
                                    <td>
                                        <a style="color: #3388ff;" :href="v.asin_url" target="_blank">{{v.asin}}</a>
                                    </td>
                                </tr>
                            </table>
                            <a style="color: #3388ff;" href="javascript:;" slot="reference">
                                <div v-if="i < 2" v-for="(v, i) in scope.row.product">{{v.sku}}</div>
                                <div v-if="scope.row.product.length > 2">...</div>
                            </a>
                        </el-popover>
                    </div>
                </div>
            </template>
            <!-- 客户信息 -->
            <template slot-scope="scope" slot="customerInfo">
                <div>客户邮箱：{{scope.row.buyer_mail}}</div>
                <div>客户电话：{{scope.row.buyer_phone}}</div>
            </template>
            <!-- 客户ID -->
            <template slot-scope="scope" slot="customerId">
                <div>客诉类型：{{scope.row.complaint_type}}</div>
                <div>
                    <el-popover
                        placement="top"
                        width="260"
                        trigger="hover"
                        :content="scope.row.description">
                        <a href="javascript:;" class="ellipsis2" slot="reference">详细描述：{{scope.row.description}}</a>
                    </el-popover>
                </div>
            </template>
            <!-- 处理信息 -->
            <template slot-scope="scope" slot="dealInfo">
                <div>处理次数：{{scope.row.processing_times}}</div>
                <div>处理人：{{scope.row.processing_by}}</div>
                <div>处理时间：{{scope.row.last_processing_time}}</div>
                <div>处理部门：{{scope.row.department}}</div>
            </template>
            <!-- 创建信息 -->
            <template slot-scope="scope" slot="createInfo">
                <div>创建人：{{scope.row.create_user}}</div>
                <div>创建时间：{{scope.row.create_time}}</div>
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
            <!--处理状态 -->
            <template slot-scope="scope" slot="status">
                <div>
                <!-- <span class="ui-state_circle orangeColor" v-if="scope.row.status === '已确认'"></span> -->
                <span class="ui-state_circle grayColor" v-if="scope.row.status === '待处理'"></span>
                <span class="ui-state_circle blueColor" v-if="scope.row.status === '已确认'"></span>
                <span class="ui-state_circle orangeColor" v-if="scope.row.status === '待确认'"></span>
                <!-- <span class="ui-state_circle redColor" v-if="scope.row.status === '已驳回'"></span> -->
                {{scope.row.status}}
                </div>
            </template>
            <!-- 审核状态 -->
            <template slot-scope="scope" slot="check_status">
                <div>
                    <span class="ui-state_circle orangeColor" v-if="scope.row.check_status === '待审核'"></span>
                    <span class="ui-state_circle greenColor" v-if="scope.row.check_status === '审核通过'"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.check_status === '审核不通过'"></span>
                    {{scope.row.check_status}}
                </div>
            </template>
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <!-- <span><el-button type="text" @click="handleOperateConfirm(scope.row)" v-if="buttonList['confirm'].permit(thisVm) && scope.row.status === '待确认'">确认<ComDivide/></el-button></span>
                <span><el-button type="text" @click="handleOperateReject(scope.row)" v-if="buttonList['reject'].permit(thisVm) && scope.row.status === '待确认'">驳回<ComDivide/></el-button></span> -->
                <span v-if="scope.row.check_status === '待审核' && buttonList['toExamine'].permit(thisVm)"><el-button type="text" @click="handleExamineCustomerComplaint(scope.row)">审核</el-button><ComDivide/></span>
                <span v-if="scope.row.check_status === '审核通过' && buttonList['handle'].permit(thisVm)"><el-button type="text" @click="handleOperateConfirmOrReject(scope.row)" :disabled="scope.row.status=='待确认'?false:true">处理</el-button><ComDivide/></span>
                <span v-if="(scope.row.check_status === '待审核'||scope.row.check_status === '审核不通过') && buttonList['edit'].permit(thisVm)"><el-button type="text" @click="handleEditCustomerComplaint(scope.row)">修改</el-button><ComDivide/></span>
                <span v-if="(scope.row.check_status === '待审核'||scope.row.check_status === '审核不通过') && buttonList['del'].permit(thisVm)"><el-button type="text" @click="handleDeleteCustomerComplaint(scope.row)">删除</el-button><ComDivide/></span>
                <el-button type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
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

        <!-- 操作日志 -->
        <el-dialog
                class="ui-layout_edit-dialog"
                title="日志类型"
                :visible.sync="dialog.isShowOrderLogShow"
                close="dialog.isShowOrderLogShow=false">
            <ComPreviewTable
                    :isAdaptiveHeight="false"
                    :logWidth="pop__tableData.tableWidth"
                    :logKey="pop__tableData.tableKey"
                    :logProps="pop__tableData.tableProps"
                    :logData="pop__tableData.tableData"
                    :showSearch="pop__tableData.showSearch">
            </ComPreviewTable>
        </el-dialog>
        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            @handleQueryInfo="handleQueryInfo({}, true)"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            :customerComplaintId='customerComplaintId'
            @handleComplaintOrder="isOrderInfoShow=false; handleQueryInfo({customer_complaint_number: $event})"
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
        getComplaintList,
        getShowLog,
        complaintConfirm,
        complaintReject,
        deleteCustomerComplaint,//删除客诉单
    } from '../../../api/AfterSalesManagement/customerComplaintList'
    import {getSessionStorage} from '@/utils/storage';
    import OrderInformation from "../OrderManagement/OrderInformation"

    export default {
        name: 'CustomerComplaintList',
        components: {
            OrderInformation,
        },
        data () {
            return {
                orderInfo:{},
                isOrderInfoShow:false,//订单详情弹窗
                searchHeight: false,
                thisVm: this,
                dialog: {
                    isShowOrderLogShow: false,
                },
                pop__tableData: {
                    showSearch: false,
                },
                //操作日志
                pop__tableData: {
                    tableWidth: [],
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: [],
                    tableData: []
                },
                //默认图片
                defaultImg: require("../../../assets/image/default_error.png"),
                // 搜索框
                showSearch: true,
                queryData: {
                    mainQuery: {}
                },
                optionList:{
                    dealManList:[],
                    dealDepartmentList:[],
                },
                checkList: [],
                // 数据
                tableData: [],
                tableKey: ['单据信息', "产品信息", "客户信息", "客诉信息", "处理信息","处理结果", '审核状态', "处理状态", "创建信息","操作"],
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
                customerComplaintId:{}
            }
        },
        methods: {
            // str2arr 换行分隔符
            str2arr(str, pid) {
                return str.split(pid);
            },
            ...mapActions(["GetComplaintList"]),
            getComplaintList,
            getShowLog,
            complaintConfirm,
            complaintReject,
            deleteCustomerComplaint,//删除客诉单


            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                if (isSave) {
                    this.queryData = JSON.parse(this.queryParamsInfo['customer_complaint']);
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
                this.GetComplaintList(obj).then(({data}) => {
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
            // 批量确认
            handleBatchConfirm(){
                if(!this.checkList.length){
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                let allRight = true;
                this.checkList.forEach(item => {
                    if (item.status !== "待确认") {
                        allRight = false;
                    }
                });
                if (!allRight) {
                    this.$message({
                        message: "勾选的数据必须是待确认状态",
                        type: "warning"
                    });
                    return;
                }
                this.complaintConfirm({
                    id:this.ids,
                }).then(({data})=>{
                    this.handleOperationCall(data)
                }).catch(error=>{})
            },

            // 操作确认
            handleOperateConfirm(row){
                this.complaintConfirm({
                    id:row.id,
                }).then(({data})=>{
                    this.handleOperationCall(data)
                }).catch(error=>{})
            },
            // 批量驳回
            handleBatchReject(){
                if(!this.checkList.length){
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                let allRight = true;
                this.checkList.forEach(item => {
                    if (item.status !== "待确认") {
                        allRight = false;
                    }
                });
                if (!allRight) {
                    this.$message({
                        message: "勾选的数据必须是待确认状态",
                        type: "warning"
                    });
                    return;
                }
                this.$confirm('确定驳回吗？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.complaintReject({
                        id:this.ids
                    }).then(({data})=>{
                        this.handleOperationCall(data)
                    }).catch(error=>{})
                }).catch(error=>{})
            },
            // 操作 驳回
            handleOperateReject(row){
                this.$confirm('确定驳回吗？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.complaintReject({
                        id:row.id
                    }).then(({data})=>{
                        this.handleOperationCall(data)
                    }).catch(error=>{})
                }).catch(error=>{})
            },
            // 操作日志
            handleOperateDiary(row){
                this.getShowLog({
                    id:row.id,
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.warning(data.errorMess || '操作失败')
                        return;
                    }
                    if (data.data_list.value) {
                        this.pop__tableData.tableData = data.data_list.value;
                        this.pop__tableData.tableProps = ['content', 'created_by', 'created_at']
                    }
                    this.dialog.isShowOrderLogShow = true;
                }).catch(error => {
                })
            },
            // 查询回调
            handleQueryInfoCallBack(data){

                // 获取保存的查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'customer_complaint',
                    value: JSON.stringify(this.queryData)
                });
                // this.optionList.dealDepartmentList = data.data_list.drop_down_box.department;
                // this.optionList.dealList = data.data_list.drop_down_box.processing_by;
                this.tableData = data.data_list.value;
                this.tableProps = ['receiptInfo', 'productInfo', 'customerInfo', 'customerId', 'dealInfo', 'processing_result','check_status',
                    'status', 'createInfo','operate'];
                this.tableWidth = ['200','120','','','200', '', '100','100','200','200']
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
            // asin
            handleJumpSkuUrl(url){
                if (url) {
                    window.open(url)
                }
            },
            handleCancelOrderInfoPopup(bool){
                this.isOrderInfoShow=bool;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
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
            //删除客诉单
            handleDeleteCustomerComplaint(row){
                this.$confirm('确定删除吗？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.deleteCustomerComplaint({id:row.id}).then(({data})=>{
                        if(!data.status){
                            this.$message.error(data.errorMess || '操作失败！');
                            return;
                        }
                        this.handleOperationCall(data)
                    })
                }).catch(error=>{})
            }
        },
        created() {
            try {
                if (this.$route.query._cacheType === '1' || JSON.stringify(this.CustomerComplaintInfo) === "{}") {
                    // this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo["customer_complaint"]);
                    this.handleQueryInfoCallBack(this.CustomerComplaintInfo);
                }
            } catch (e) {}

        },
        computed: {
            ...mapGetters(['queryParamsInfo', 'CustomerComplaintInfo']),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
    }
</script>

<style scoped lang="less">

</style>