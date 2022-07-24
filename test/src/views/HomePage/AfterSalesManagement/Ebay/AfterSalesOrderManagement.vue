<style lang="less" scoped>

</style>

<template>
    <div class="EbayAfterSalesOrderManagementwrap">
        <div class="EbayAfterSalesOrderManagementbox">

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
                    <template slot-scope="scope" slot="aftersalesorderinfo">
                        <div>售后单号：{{scope.row.after_sale_id}}</div>
                        <div>订单号：<span style="cursor: pointer;color: #409EFF;" @click="handleOrderInfo(scope.row)">{{scope.row.order_id}}</span></div>
                        <div>平台订单号：{{scope.row.platform_order_id}}</div>
                    </template>
                    <template slot-scope="scope" slot="accountinfo">
                        <div>平台账号：{{scope.row.account_name}}</div>
                        <div>站点：{{scope.row.site}}</div>
                        <div>收货国家：{{scope.row.deliver_country_name}}</div>
                        <div>发货仓库：{{scope.row.warehouse_name}}</div>
                    </template>
                    <template slot-scope="scope" slot="orderinfo">
                        <div>订单状态：
                                <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '已备货' || scope.row.order_status === '待发货' || scope.row.order_status === '待检测paypal账号' || scope.row.order_status === '借用领用单已经部分归还'"></span>
                                <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '部分发货' || scope.row.order_status === '已发货' || scope.row.order_status === '已完成' || scope.row.order_status === '通途系统处理订单' || scope.row.order_status === '借用领用单确认收货'"></span>
                                <span class="ui-state_circle greenColor" v-if="scope.row.order_status === '正常' || scope.row.order_status === '借用领用单已经全部归还'"></span>
                                <span class="ui-state_circle redColor" v-if="scope.row.order_status === '异常' || scope.row.order_status === '超期' || scope.row.order_status === '暂扣'"></span>
                                <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '缺货' || scope.row.order_status === '已取消' || scope.row.order_status === '初始化'"></span>
                                {{scope.row.order_status}}
                        </div>
                        <div>订单类型：{{scope.row.order_type}}</div>
                        <div>买家邮箱：{{scope.row.buyer_mail}}</div>
                        <div>买家ID：{{scope.row.buyer_id}}</div>
                    </template>
                    <template slot-scope="scope" slot="aftersalesinfo">
                        <div>售后类型：{{scope.row.type}}</div>
                        <div>{{scope.row.create_time | typeTextFilter}}：<a v-if="buttonList['badType'].permit(thisVm)" @click="handleChangeRowDutyFn(scope.row)" href="javascript:;" style="color: #3388ff;">{{scope.row.department_id}}</a><span v-else>{{scope.row.department_id}}</span></div>
                        <div>{{scope.row.create_time | reasonTextFilter}}：<a v-if="buttonList['badReasons'].permit(thisVm)" @click="handleChangeRowDutyFn(scope.row)" href="javascript:;" style="color: #3388ff;">{{scope.row.reason_id}}</a><span v-else>{{scope.row.reason_id}}</span></div>
                    </template>
                    <template slot-scope="scope" slot="reviewinfo">
                        <div>创建人：{{scope.row.create_by}}</div>
                        <div>创建时间：{{scope.row.create_time}}</div>
                        <div>审核状态：
                            <span class="ui-state_circle orangeColor" v-if="scope.row.status === '待审核'"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.status === '审核通过'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.status === '审核驳回'"></span>
                            {{scope.row.status}}
                        </div>
                        <div>审核人：{{scope.row.approver}}</div>
                        <div>审核时间：{{scope.row.approve_time}}</div>
                    </template>
                    <template slot-scope="scope" slot="refundinfo">
                        <div>退款状态：{{scope.row.refund_status}}</div>
                        <div>退款时间：{{scope.row.refund_time == '0000-00-00 00:00:00' ? '' : scope.row.refund_time}}</div>
                        <div>退款金额：<span style="color: #f90; font-weight: bold;">{{scope.row.refund_amount ? scope.row.refund_amount + scope.row.currency + ' / ' + scope.row.currency_cny : ''}}</span></div>
                        <div>退款失败原因：{{scope.row.fail_reason}}</div>
                        <div>退款类型：{{scope.row.refund_type}}</div>
                    </template>
                    <template slot-scope="scope" slot="returninfo">
                        <div>退货售后单号:
                            <span v-for="(item,index) in scope.row.return_after_sale_id">{{item.return_after_sale_id}}<span v-if="index!==(scope.row.return_after_sale_id.length-1)">，</span></span>
                        </div>
                        <div>退货编码：{{scope.row.refund_code}}</div>
                        <div>RMA：{{scope.row.rma}}</div>
                        <div>跟踪号：<a :href="'https://t.17track.net/en#nums=' + scope.row.tracking_no" style="color: #3388ff;" target="_blank">{{scope.row.tracking_no}}</a></div>
                        <div>收货状态：{{scope.row.is_receipt}}</div>
                        <div>物流商：{{scope.row.carrier}}</div>
                    </template>
                    <template slot-scope="scope" slot="remark">
                        <div>
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover"
                                :disabled="(scope.row.remark || '').length <= 44"
                                :content="scope.row.remark">
                                <a class="ellipsis4" href="javascript:;" slot="reference">{{scope.row.remark}}</a>
                            </el-popover>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['changeInfo'].permit(thisVm) && ['待审核', '审核驳回'].includes(scope.row.status)" @click="handleOperateModifyInfo(scope.row)" type="text" size="mini">
                            修改信息
                        </el-button>
                        <ComDivide v-if="buttonList['changeInfo'].permit(thisVm) && ['待审核', '审核驳回'].includes(scope.row.status)"/>

                        <el-button v-if="buttonList['review'].permit(thisVm) && ['待审核'].includes(scope.row.status)" @click="handleReviewFn(scope.row)" type="text" size="mini">
                            审核
                        </el-button>
                        <ComDivide v-if="buttonList['review'].permit(thisVm) && ['待审核'].includes(scope.row.status)"/>

                        <el-button v-if="buttonList['del'].permit(thisVm) && ['待审核', '审核驳回'].includes(scope.row.status)" @click="handleDelFn(scope.row)" type="text" size="mini">
                            删除
                        </el-button>
                        <ComDivide v-if="buttonList['del'].permit(thisVm) && ['待审核', '审核驳回'].includes(scope.row.status)"/>

                        <el-button v-if="buttonList['signRefund'].permit(thisVm) && ['退款失败', '待退款'].includes(scope.row.refund_status) && ['审核通过'].includes(scope.row.status)" @click="handleSignRefundFn(scope.row)" type="text" size="mini">
                            标记退款
                        </el-button>
                        <ComDivide v-if="buttonList['signRefund'].permit(thisVm) && ['退款失败', '待退款'].includes(scope.row.refund_status) && ['审核通过'].includes(scope.row.status)"/>

                        <el-button v-if="buttonList['log'].permit(thisVm)" @click="handleLogFn(scope.row.after_sale_id)" type="text" size="mini">
                            日志
                        </el-button>
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

        <!-- 审核 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="审核"
            :visible.sync="reviewObj.dialog"
            width="500px">
            <el-form :model="reviewObj.form" :rules="formRules" ref="reviewObjForm" label-width="80px" size="small">
                <el-form-item prop="status" label="审核结果：">
                    <el-radio-group v-model="reviewObj.form.status">
                        <el-radio label="3">驳回</el-radio>
                        <el-radio label="2">通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="reviewObj.form.remark" :rows="4" resize="none"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="reviewObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handlereviewConfirm()" size="small">确 定</el-button>
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

        <!-- 不良类型 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="不良类型"
            :visible.sync="afterReasonObj.dialog"
            width="400px">
            <div>
                <el-form :model="afterReasonObj.form" :rules="formRules" ref="afterReasonObjForm" label-width="80px" size="small">
                    <el-form-item prop="department_id" label="不良类型：">
                        <el-select v-model="afterReasonObj.form.department_id" @change="departmentIdChange" clearable>
                            <el-option v-for="(value, index) in optionListLabel.afterReasonList" :key="index" :value="value.id" :label="value.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="reason_id" label="不良原因：">
                        <el-select v-model="afterReasonObj.form.reason_id" clearable>
                            <el-option v-for="(value, index) in ((optionListLabel.afterReasonList.find(e => e.id == afterReasonObj.form.department_id) || {}).child || [])" :key="index" :value="value.id" :label="value.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="afterReasonObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAfterReasonFn()" size="small">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            @handleReload="handleReload"
            :afterSalesOrderEditInfo="afterSalesOrderEditInfo"
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
    postReview,
    signRefund,
    dataOutput,
    getLogs,
    delItem,
    setAfterReason,
} from '@/api/AfterSalesManagement/Ebay/AfterSalesOrderManagement';
import {
    getAfterReason,
} from '@/api/Ebay/EvaluateFeedBack';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import { getSessionStorage } from '@/utils/storage';
import dayjs from 'dayjs';

export default {
    name: 'EbayAfterSalesOrderManagement',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['售后单信息', '账号信息', '订单信息', '操作类型', '售后信息', '审核信息', '退款信息', '退货信息', '备注', '操作'],
            tableProps: ['aftersalesorderinfo', 'accountinfo', 'orderinfo', 'operating_type', 'aftersalesinfo', 'reviewinfo', 'refundinfo', 'returninfo', 'remark', 'operate'],
            tableWidth: ['230', '160', '200', '100', '200', '200', '200', '160', '150', '140'],
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
                    {id: 1, name: '批量审核通过', button:'batchPass', iconName:"piliangshenhetongguo", color:'#6facff'},
                    {id: 2, name: '批量审核驳回', button:'batchReject', iconName:"piliangbohui", color:'#ff6666'},
                    {id: 3, name: '批量标记退款', button:'tagRefund', iconName:"piliangtuikuanchenggong", color:'#ff9860'},
                    {id: 5, name: '退款数据导出', button:'refundDataDown', iconName:"shujuxiazai", color:'#6facff'},
                    {id: 6, name: '退货数据导出', button:'returnDataDown', iconName:"shujuxiazai", color:'#6facff'},
                    {id: 7, name: '重寄数据导出', button:'resendDataDown', iconName:"shujuxiazai", color:'#6facff'},
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
                afterReasonList: [],
            },

            // 表单验证
            formRules: {
                status: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                department_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                reason_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },

            // 审核相关
            reviewObj: {
                dialog: false,
                form: {
                    after_sale_id: '',
                    status: '2',
                    remark: '',
                }
            },

            // 修改信息相关
            changeInfoObj: {
                dialog: false,
                form: {
                    after_sale_id: '',
                    status: '',
                }
            },

            // 日志相关
            logInfo: {
                tableData: [],
                tableProps: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableWidth: ['', '', ''],
                isShowLog: false,
            },

            // 修改不良类型相关
            afterReasonObj: {
                dialog: false,
                isbatch: false,
                form: {
                    after_sale_id: '',
                    department_id: '',
                    reason_id: '',
                },
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
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_AfterSales_OrderManagement']);
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
                key: 'Ebay_AfterSales_OrderManagement',
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
            this.saveCheckIds = [...new Set(this.saveCheckInfo.map(e => e.after_sale_id))].join(',');
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
                    // 批量审核通过
                    this.handleReviewPass();
                    break;
                case 2:
                    // 批量审核驳回
                    this.handleReviewReject();
                    break;
                case 3:
                    // 批量标记退款
                    this.handleBatchSignRefund();
                    break;
                case 5:
                    // 退款数据导出
                    this.refundDataDownloadFn();
                    break;
                case 6:
                    // 退货数据导出
                    this.returnDataDownloadFn();
                    break;
                case 7:
                    // 重寄数据导出
                    this.resendDataDownloadFn();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 批量审核通过
        handleReviewPass() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }

            let allRight = true;
            this.saveCheckInfo.forEach(item => {
                if (item.status !== "待审核") {
                    allRight = false;
                }
            });
            if (!allRight) {
                this.$message.warning('勾选的数据必须是待审核的状态！');
                return;
            }

            this.postReviewFn({id: [...new Set(this.saveCheckInfo.map(e => e.after_sale_id))].join(','), status: 2});
        },

        // 审核驳回
        handleReviewReject() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }

            let allRight = true;
            this.saveCheckInfo.forEach(item => {
                if (item.status !== "待审核") {
                    allRight = false;
                }
            });
            if (!allRight) {
                this.$message.warning('勾选的数据必须是待审核的状态！');
                return;
            }

            this.postReviewFn({id: [...new Set(this.saveCheckInfo.map(e => e.after_sale_id))].join(','), status: 3});
        },
        postReviewFn({id, status}) {
            postReview({
                after_sale_id: id,
                status,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(err => {

            });
        },

        // 标记退款
        handleBatchSignRefund() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }

            let allRight = true;
            let bool = true;
            let isType = true;
            this.saveCheckInfo.forEach((item) => {
                if(item.type !== "退款"){
                    isType = false;
                }
                if (item.refund_status != "待退款" && item.refund_status != "退款失败") {
                    allRight = false;
                }
                if(item.status !== "审核通过"){
                    bool = false;
                }
            });
            if(!isType){
                this.$message({
                    message: "勾选的数据售后类型必须为退款！",
                    type: "warning"
                });
                return;
            }
            if (!allRight) {
                this.$message({
                    message: "勾选的数据必须是待退款或退款失败的状态！",
                    type: "warning"
                });
                return;
            }
            if (!bool) {
                this.$message({
                    message: "勾选的数据必须是通过的审核状态！",
                    type: "warning"
                });
                return;
            }

            signRefund({
                after_sale_id: [...new Set(this.saveCheckInfo.map(e => e.after_sale_id))].join(','),
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(err => {

            });
        },

        // 标记退款
        handleSignRefundFn(row) {
            signRefund({
                after_sale_id: row.after_sale_id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(err => {

            });
        },

        // 数据下载
        dataDownloadFn() {
            this.$confirm('是否下载数据？', '提示', {
                type: 'warning'
            }).then(() => {
                let data = JSON.parse(this.queryParamsInfo['Ebay_AfterSales_OrderManagement'] || '{}');
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
                    ...datastr,
                    after_order_number: this.saveCheckIds
                }).then(({data}) => {

                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {

            });
        },
        refundDataDownloadFn() {
            let data = JSON.parse(this.queryParamsInfo['Ebay_AfterSales_OrderManagement'] || '{}');
            if( !data.mainQuery.after_type || data.mainQuery.after_type.join('') != 1 ){
                this.$message.warning('请筛选售后类型为退款的数据进行下载！');
                return;
            }
            this.dataDownloadFn();
        },
        returnDataDownloadFn() {
            let data = JSON.parse(this.queryParamsInfo['Ebay_AfterSales_OrderManagement'] || '{}');
            if( !data.mainQuery.after_type || data.mainQuery.after_type.join('') != 2 ){
                this.$message.warning('请筛选售后类型为退货的数据进行下载！');
                return;
            }
            this.dataDownloadFn();
        },
        resendDataDownloadFn() {
            let data = JSON.parse(this.queryParamsInfo['Ebay_AfterSales_OrderManagement'] || '{}');
            if( !data.mainQuery.after_type || data.mainQuery.after_type.join('') != 3 ){
                this.$message.warning('请筛选售后类型为重寄的数据进行下载！');
                return;
            }
            this.dataDownloadFn();
        },

        // 审核
        handleReviewFn(row) {
            this.reviewObj.dialog = true;
            this.reviewObj.form = {
                after_sale_id: row.after_sale_id,
                status: '2',
                remark: '',
            };
            this.$nextTick(() => {
                this.$refs.reviewObjForm.resetFields();
            });
        },
        handlereviewConfirm() {
            this.$refs.reviewObjForm.validate((valid) => {
                if (valid) {
                    this.postReviewFn({id: this.reviewObj.form.after_sale_id, status: this.reviewObj.form.status, remark: this.reviewObj.form.remark});
                    this.reviewObj.dialog = false;
                }
            });
        },

        // 日志
        handleLogFn(id) {
            getLogs({
                after_sale_id: id,
                limit: 1000,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败');
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

        // 删除
        handleDelFn(row) {
            this.$confirm('是否删除？', '提示', {
                type: 'warning'
            }).then(() => {
                delItem({
                    after_sale_id: row.after_sale_id,
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.handleOperationCallBack(data);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {

            });
        },

        // 列表直接修改不良类型、不良原因
        handleChangeRowDutyFn(row) {
            this.changeDutyCommonFn({isbatch: true, id: row.after_sale_id, department_id: row.department_id_id, reason_id: row.reason_id_id});
        },

        changeDutyCommonFn({isbatch, id, department_id, reason_id}) {
            this.afterReasonObj.dialog = true;
            this.afterReasonObj.isbatch = isbatch;
            this.afterReasonObj.form = {
                after_sale_id: id,
                department_id,
                reason_id,
            };
            this.$nextTick(() => {
                this.$refs.afterReasonObjForm.clearValidate();
            });
            if( !this.optionListLabel.afterReasonList.length ){
                getAfterReason().then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.optionListLabel.afterReasonList = data.data_list;
                }).catch(error => {

                });
            }
        },
        departmentIdChange() {
            this.afterReasonObj.form.reason_id = '';
        },
        submitAfterReasonFn() {
            this.$refs.afterReasonObjForm.validate((valid) => {
                if (valid) {
                    setAfterReason({...this.afterReasonObj.form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.$message.success('修改不良类型原因成功！');
                        this.afterReasonObj.dialog = false;
                        if( this.afterReasonObj.isbatch ) {
                            this.handleOperationCallBack(data);
                        }else{
                            // isbatch为false时进行处理
                        }
                    }).catch(error => {

                    });
                }
            });
        },

        // 订单弹窗相关
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow = bool;
            this.afterSalesOrderEditInfo={};
        },
        handleReload(){
            this.handleQueryInfo({}, true);
        },
        // 修改信息
        handleOperateModifyInfo(row) {
            this.orderInfo={
                order_id:row.order_id,
                platform_code:row.platform_code,
                edit:false,
                title:'售后单修改',
                operation:'addNewAfterSaleSingle'
            }
            this.afterSalesOrderEditInfo=row;
            this.afterSalesOrderEditInfo.edit=true;
            this.isOrderInfoShow=true;
        },
        //订单详情弹窗
        handleOrderInfo(row){
            console.log('222',this.afterSalesOrderEditInfo)
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
    filters: {
        typeTextFilter(v) {
            let r = '责任归属部门';
            if( v && dayjs(v).isAfter(dayjs('2019-10-31 21:00:00')) ){
                r = '不良类型';
            }
            return r;
        },
        reasonTextFilter(v) {
            let r = '售后单原因';
            if( v && dayjs(v).isAfter(dayjs('2019-10-31 21:00:00')) ){
                r = '不良原因';
            }
            return r;
        },
    },
    watch:{
        orderInfo: {
            handler(val, old){
                this.orderInfo = val;
            },
            immediate: true,
            deep: true
        }

    }
}
</script>
