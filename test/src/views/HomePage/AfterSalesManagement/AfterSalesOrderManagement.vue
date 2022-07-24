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
            <el-button size="small" type="text" @click="handleReviewPass"
                v-if="buttonList['reviewPass'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangshenhetongguo" style="color: #72afff;font-size:12px;"></i>批量审核通过</el-button>
            <el-button size="small" type="text" @click="handleReviewReject"
                v-if="buttonList['reviewReject'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangbohui" style="color: #fc6769;font-size:12px;"></i>批量审核驳回</el-button>
            <el-button size="small" type="text" @click="handleTagRefund(false)"
                v-if="buttonList['tagRefund'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangtuikuanchenggong" style="color: #fd996b;font-size:12px;"></i>批量标记退款</el-button>
            <el-button size="small" type="text" @click="handleDownLoad('1')"
                v-if="buttonList['refundDownLoad'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-shujuxiazai" style="color: #72afff;font-size:12px;"></i>退款数据下载</el-button>
            <!-- <el-button size="small" type="text" @click="handleDownLoad('2')"
                v-if="buttonList['returnDownLoad'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-shujuxiazai" style="color: #72afff;font-size:12px;"></i>退货数据下载</el-button> -->
            <el-button size="small" type="text" @click="handleDownLoad('3')"
                v-if="buttonList['resendDownLoad'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-shujuxiazai" style="color: #72afff;font-size:12px;"></i>重寄数据下载</el-button>
            <!-- <el-select v-model="curBatchEditId" size="small">
                <el-option v-if="buttonList['reviewPass'].permit(thisVm)" label="审核通过" :value="1"></el-option>
                <el-option v-if="buttonList['reviewReject'].permit(thisVm)" label="审核驳回" :value="2"></el-option>
                <el-option v-if="buttonList['tagRefund'].permit(thisVm)" label="标记退款" :value="3"></el-option>
                <el-option v-if="buttonList['downLoad'].permit(thisVm)" label="数据下载" :value="4"></el-option>
                <el-option v-if="buttonList['modifyInfo'].permit(thisVm)" label="批量修改信息" :value="5"></el-option>
            </el-select> -->
            <!-- &nbsp;
            <el-button
                @click="batchEditFn()"
                size="small"
                type="primary">
                批量操作
            </el-button> -->
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
            <!-- 售后单信息 -->
            <template slot-scope="scope" slot="afterSalesOrderInfo">
                <div v-if="scope.row.amazon_fulfill_channel" :class="{rbadgea: scope.row.amazon_fulfill_channel === 'FBA'}" class="rbadge">{{scope.row.amazon_fulfill_channel}}</div>
                <div>平台订单号：{{scope.row.platform_order_id}}</div>
                <div>售后单号：{{scope.row.after_sale_id}}</div>
                <div>订单号： <span style="cursor:pointer; color: #3388ff;" type="text" @click="handleOrderNum(scope.row)">
                    {{scope.row.order_id}}</span>
                </div>
            </template>
            <!-- 账号信息 -->
            <template slot-scope="scope" slot="accountInfo">
                <div>平台：{{scope.row.platform_code}}</div>
                <div>账号：{{scope.row.account_name}}</div>
                <div>站点：{{scope.row.site}}</div>
                <div>仓库：{{scope.row.warehouse_name}}</div>
            </template>
            <!-- 订单信息 -->
            <template slot-scope="scope" slot="orderInfo">
                <div>订单状态：
                    <span class="ui-state_circle orangeColor" v-if="scope.row.order_status === '已备货' || scope.row.order_status === '待发货' || scope.row.order_status === '待检测PayPal账号' || scope.row.order_status === '借用领用单已经部分归还'"></span>
                    <span class="ui-state_circle blueColor" v-if="scope.row.order_status === '部分发货' || scope.row.order_status === '已发货' || scope.row.order_status === '已完成' || scope.row.order_status === '通途系统处理订单' || scope.row.order_status === '借用领用单确认收货'"></span>
                    <span class="ui-state_circle greenColor" v-if="scope.row.order_status === '正常' || scope.row.order_status === '借用领用单已经全部归还'"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.order_status === '异常' || scope.row.order_status === '超期' || scope.row.order_status === '暂扣'"></span>
                    <span class="ui-state_circle grayColor" v-if="scope.row.order_status === '缺货' || scope.row.order_status === '已取消' || scope.row.order_status === '初始化'"></span>
                    {{scope.row.order_status}}
                </div>
                <div>订单类型：{{scope.row.order_type}}</div>
                <div>买家邮箱：{{scope.row.buyer_mail}}</div>
                <div>客户ID：{{scope.row.buyer_id}}</div>
            </template>
            <!-- 备注 -->
            <template slot-scope="scope" slot="remark">
                <el-popover class="ui-content-overflow" ref="popover"
                            placement="top-start"
                            trigger="hover"
                            width="300"
                            v-if="scope.row.remark" :disabled="scope.row.remark.length <=13"
                            :content="scope.row.remark">
                    <span slot="reference" class="ui-tooltip">{{scope.row.remark}}</span>
                </el-popover>
            </template>
            <!-- 售后信息 -->
            <template slot-scope="scope" slot="afterInfo">
                <div>售后类型：{{scope.row.type}}</div>
                <div>{{scope.row.create_time | typeTextFilter}}：<a v-if="buttonList['badType'].permit(thisVm)" @click="handleChangeRowDutyFn(scope.row)" href="javascript:;" style="color: #3388ff;">{{scope.row.department_id}}</a><span v-else>{{scope.row.department_id}}</span></div>
                <div>{{scope.row.create_time | reasonTextFilter}}：<a v-if="buttonList['badReasons'].permit(thisVm)" @click="handleChangeRowDutyFn(scope.row)" href="javascript:;" style="color: #3388ff;">{{scope.row.reason_id}}</a><span v-else>{{scope.row.reason_id}}</span></div>
                <div>平台退款原因：{{scope.row.reason_code}}</div>
            </template>
            <!-- 审核信息 -->
            <template slot-scope="scope" slot="reviewInfo">
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
            <!-- 处理结果 -->
            <template slot-scope="scope" slot="dealResult">
                <div>退款状态：
                    <span class="ui-state_circle blueColor" v-if="scope.row.status === '已退款'"></span>
                    <span class="ui-state_circle orangeColor" v-if="scope.row.status === '未退款'"></span>
                    {{scope.row.refund_status}}
                </div>
                <div>退款时间：{{scope.row.refund_time}}</div>
                <div>退款金额：<span style="color: #f90; font-weight: bold;">{{scope.row.refund_amount ? parseFloat(scope.row.refund_amount).toFixed(2) + scope.row.currency + ' / ' + scope.row.currency_cny : ''}}</span></div>
                <div>退款失败原因：{{scope.row.fail_reason}}</div>
                <div>退款类型：{{scope.row.refund_type}}</div>
            </template>
            <!-- 退货信息 -->
            <template slot-scope="scope" slot="returnInfo">
                <!-- <div>退货售后单号: {{scope.row.return_after_sale_id?scope.row.return_after_sale_id:'无数据'}}</div> -->
                <div>退货售后单号:
                    <span v-for="(item,index) in scope.row.return_after_sale_id">{{item.return_after_sale_id}}<span v-if="index!==(scope.row.return_after_sale_id.length-1)">，</span></span>
                </div>
                <div>退货编码：{{scope.row.refund_code}}</div>
                <div>RMA：{{scope.row.rma}}</div>
                <div>跟踪号：<a :href="scope.row.tracking_no_url" style="color: #3388ff;" target="_blank">{{scope.row.tracking_no}}</a></div>
                <div>收货状态：{{scope.row.is_receipt}}</div>
                <div>物流商：{{scope.row.carrier}}</div>
                <div v-show="scope.row.type==='退货'">退回仓库：{{scope.row.return_warehouse_name}}</div>
            </template>
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <!--<div>-->
                    <!--<el-badge :value="scope.row.number" class="badgeitem" type="warning"></el-badge>-->
                <!--</div>-->
                <el-button size="small" type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
                <span>
                    <el-button size="small" type="text" @click="handleOperateReview(scope.row)" v-if="buttonList['review'].permit(thisVm) && scope.row.status === '待审核'"><ComDivide/>审核</el-button>
                </span>
                <span>
                    <el-button size="small" type="text" @click="handleOperateModifyInfo(scope.row)" v-if="buttonList['changeInfo'].permit(thisVm) && scope.row.status === '待审核' || scope.row.status === '审核驳回'"><ComDivide/>修改信息</el-button>
                </span>
                <span>
                    <el-button size="small" type="text" @click="handleOperateDelete(scope.row)" v-if="buttonList['delete'].permit(thisVm) && scope.row.status === '待审核' || scope.row.status === '审核驳回'"><ComDivide/>删除</el-button>
                </span>
                <span>
                    <el-button size="small" type="text" @click="handleTagRefund(scope.row)" v-if="buttonList['tagRefund'].permit(thisVm) && scope.row.status === '审核通过'&&(scope.row.refund_status === '待退款' || scope.row.refund_status === '退款失败')"><ComDivide/>标记退款</el-button>
                </span>
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
                    :total="pageData.currentTotal"
            ></el-pagination>
        </div>

        <!-- 审核通过弹框弹框-->
        <el-dialog
                class="ui-layout_edit-dialog"
                title="审核"
                :visible.sync="isShow"
                width="500px"
                @close="isShow=false">
                <el-form :model="form" :rules="form" ref="form" label-width="80px">
                    <el-form-item prop="checkResult" label="审核结果：">
                        <el-radio-group v-model="form.reviewResult">
                            <el-radio label="3">驳回</el-radio>
                            <el-radio label="2">通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea" v-model="form.remarks" :rows="4" resize="none"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
                    <el-button type="primary" @click="handleAuditConfirm()" size="small">确 定</el-button>
                </span>
        </el-dialog>

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
                    :showSearch="pop__tableData.showSearch"
            ></ComPreviewTable>
        </el-dialog>

        <!-- 修改信息-->
        <!-- <el-dialog
                class="ui-layout_edit-dialog"
                title="修改信息"
                width="500px"
                :visible.sync="dialog.isModifyInfoShow"
                close="dialog.isModifyInfoShow=false">
            <el-form border style="width: 100%" ref="form" :model="form" :rules="formRule">
                <el-form-item prop="responsibleDepartment" label="责任部门：">
                    <el-select
                            @change="handleClickShow"
                            placeholder="请选择"
                            size="mini"
                            clearable
                            v-model="form.responsibleDepartment"
                    >
                        <el-option
                                :key="key"
                                :value="value.id"
                                :label="value.name"
                                v-for="(value, key) in requestData.responsibleDepartment"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.responsibleDepartment" prop="reasonType" label="原因类型：">
                    <el-select placeholder="请选择" size="mini" clearable v-model="form.reasonType">
                        <el-option
                                :label="value.name"
                                :value="value.id"
                                :key="key"
                                v-for="(value, key) in requestData.reasonType"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="afterSalesType" label="售后类型：">
                    <el-select placeholder="请选择" size="mini" clearable v-model="form.afterSalesType">
                        <el-option
                                :label="label"
                                :value="value"
                                :key="value"
                                v-for="(label, value) in requestData.afterSalesType"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
                <el-button type="primary" @click="handleModifyInfoConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog> -->

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
            :afterSalesOrderEditInfo="afterSalesOrderEditInfo"
            @handleEditAfterSaleList="handleQueryInfo({}, true);"
            @handleAfterSaleList="isOrderInfoShow=false; handleQueryInfo({after_order_number: $event})"
        ></OrderInformation>
    </div>
</template>
<script>
    import config from "@/assets/js/config";
    import {mapActions, mapGetters} from "vuex";
    import {
        getList,
        afterSalesOrderReviewPass,
        afterSalesOrderDestroy,
        afterSalesOrderShowlog,
        afterSalesOrderReviewReject,
        // afterSalesOrderDropDown,
        // afterSalesOrderEdit,
        afterSalesOrderReview,
        signRefund,
        downloadExport,
        setAfterReason,
    } from "../../../api/AfterSalesManagement/afterSalesOrderManagement";
    import {
        getAfterReason,
    } from '@/api/Ebay/EvaluateFeedBack';
    import {getSessionStorage} from "@/utils/storage";
    import OrderInformation from "../OrderManagement/OrderInformation";
    import dayjs from 'dayjs';

    export default {
        name: 'AfterSalesOrderManagement',
        components: {
            OrderInformation,
        },
        data() {
            return {
                afterSalesOrderEditInfo:{},
                orderInfo:{},
                isOrderInfoShow:false,//订单详情弹窗
                searchHeight: false,
                thisVm: this,
                dialog: {
                    isShowOrderLogShow: false,
                    isModifyInfoShow: false
                },
                pop__tableData: {
                    showSearch: false
                },
                //操作日志
                pop__tableData: {
                    tableWidth: [],
                    tableKey: ["操作日志", "操作人", "操作时间"],
                    tableProps: [],
                    tableData: []
                },
                isShow: false,
                form: {
                    remarks: "",
                    reviewResult: "",
                    checkResult: "",
                    responsibleDepartment: "",
                    reasonType: "",
                    afterSalesType: ""
                },
                requestData: {
                    afterSalesType: [],
                    responsibleDepartment: [],
                    reasonType: []
                },
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
                tableKey: [
                    "售后单信息",
                    "账号信息",
                    "订单信息",
                    '操作类型',
                    "售后信息",
                    "审核信息",
                    "处理结果",
                    "退货信息",
                    "备注",
                    "操作"
                ],
                tableProps: [],
                tableWidth: ['240', '140', '200','80', '200','200','150', '150', '200','210'],
                // 表格加载动画
                tableLoading: false,

                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0
                },
                // 校验选项
                formRule: {
                    checkResult: [
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ]
                },
                //id参数
                ids: "",
                platform: "Amazon",
                currentId: "",
                after_sale_id: "",

                curBatchEditId: '',

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

                optionListLabel: {
                    afterReasonList: [],
                },

                // 表单验证
                formRules: {
                    department_id: [
                        { required: true, message: '请选择', trigger: 'change' },
                    ],
                    reason_id: [
                        { required: true, message: '请选择', trigger: 'change' },
                    ],
                },
            };
        },
        methods: {
            ...mapActions(["AfterSaleOrderManagementList"]),
            getList,
            afterSalesOrderDestroy,
            afterSalesOrderShowlog,
            afterSalesOrderReviewPass,
            afterSalesOrderReviewReject,
            // afterSalesOrderDropDown,
            // afterSalesOrderEdit,
            afterSalesOrderReview,
            signRefund,
            downloadExport,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                if (isSave) {
                    this.queryData = JSON.parse(this.queryParamsInfo['after_sale']);
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
                this.AfterSaleOrderManagementList(obj).then(({data}) => {
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
                };
            },
            // 查询回调
            handleQueryInfoCallBack(data) {
                // 获取保存的查询参数
                this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
                    key: "after_sale",
                    value: JSON.stringify(this.queryData)
                });
                //                this.optionList = data.data_list.drop_down_box;
                this.tableData = data.data_list.value;
                this.tableProps = [
                    "afterSalesOrderInfo",
                    "accountInfo",
                    "orderInfo",
                    'operating_type',
                    "afterInfo",
                    "reviewInfo",
                    "dealResult",
                    'returnInfo',
                    "remark",
                    "operate"
                ],
                // 渲染分页
                this.pageData.currentTotal = data.page_data.total * 1;
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },
            // 操作回调
            handleOperationCall(data) {
                if (data.status) {
                    this.$message({
                        type: "success",
                        message: "操作成功"
                    });
                    this.handleQueryInfo({}, true);
                } else {
                    this.$message({
                        type: "error",
                        message: data.errorMess || "操作失败"
                    });
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
                this.checkList = row;
                let idArr = [];
                let saleIdArr = [];
                this.checkList.forEach(item => {
                    idArr.push(item.id);
                    saleIdArr.push(item.after_sale_id);
                });
                this.ids = idArr.join(",");
                this.after_sale_id = saleIdArr.join(",");
            },
            handleTabsClick(item) {
                console.log("获取点击tab值", item);
            },
            // 审核通过
            handleReviewPass() {
                if (!this.checkList.length) {
                    this.$message.warning("请勾选列表数据");
                    return;
                }
                let allRight = true;
                this.checkList.forEach(item => {
                    if (item.status !== "待审核") {
                        allRight = false;
                    }
                });
                if (!allRight) {
                    this.$message({
                        message: "勾选的数据必须是待审核的状态",
                        type: "warning"
                    });
                    return;
                }
                //                let idArr = [];
                //                for (let i = 0; i < this.checkList.length; i++) {
                //                    idArr.push(this.checkList[i].id);
                //                }
                this.$store.commit("SAVE_LOADING_STATE",true);
                this.afterSalesOrderReviewPass({
                    after_sale_id: this.after_sale_id
                }).then(({data}) => {
                    this.$store.commit("SAVE_LOADING_STATE",false);
                    this.handleOperationCall(data);
                })
                .catch(error => {
                    this.$store.commit("SAVE_LOADING_STATE",false);
                });
            },
            // 审核驳回
            handleReviewReject() {
                if (!this.checkList.length) {
                    this.$message.warning("请勾选列表数据");
                    return;
                }
                let allRight = true;
                this.checkList.forEach(item => {
                    if (item.status !== "待审核") {
                        allRight = false;
                    }
                });
                if (!allRight) {
                    this.$message({
                        message: "勾选的数据必须是待审核的状态",
                        type: "warning"
                    });
                    return;
                }
                //                let idArr = [];
                //                for (let i = 0; i < this.checkList.length; i++) {
                //                    idArr.push(this.checkList[i].id);
                //                }
                this.$store.commit("SAVE_LOADING_STATE",true);
                this.afterSalesOrderReviewReject({
                    after_sale_id: this.after_sale_id
                }).then(({data}) => {
                    this.handleOperationCall(data);
                    this.$store.commit("SAVE_LOADING_STATE",false);
                }).catch(error => {
                        this.$store.commit("SAVE_LOADING_STATE",false);
                    });
            },
            // 标记退款
            handleTagRefund(row) {
                if(!row){
                    if (!this.checkList.length) {
                        this.$message.warning("请勾选列表数据");
                        return;
                    }
                    let allRight = true;
                    let bool = true;
                    let isType = true;
                    this.checkList.forEach((item) => {
                        if(item.type !== "退款"){
                            isType = false;
                        }
                        if (item.refund_status != "待退款"&&item.refund_status != "退款失败") {
                            allRight = false;
                        }
                        if(item.status !== "审核通过")bool = false;
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
                }
                this.$store.commit("SAVE_LOADING_STATE",true);
                this.signRefund({
                    after_sale_id: row.after_sale_id||this.after_sale_id
                })
                    .then(({data}) => {
                        this.$store.commit("SAVE_LOADING_STATE",false);
                        this.handleOperationCall(data);
                    })
                    .catch(error => {
                        this.$store.commit("SAVE_LOADING_STATE",false);
                    });
            },
            // 数据下载
            handleDownLoad(num) {
                if(num=='1'&&this.queryData.mainQuery.after_type!=num){
                    this.$message.warning('请筛选售后类型为退款的数据进行下载！');
                    return;
                }else if(num=='2'&&this.queryData.mainQuery.after_type!=num){
                    this.$message.warning('请筛选售后类型为退货的数据进行下载！');
                    return;
                }else if(num=='3'&&this.queryData.mainQuery.after_type!=num){
                    this.$message.warning('请筛选售后类型为重寄的数据进行下载！');
                    return;
                }
                this.$confirm("是否确认下载？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.downloadExport({
                        ...this.queryData.mainQuery,
                        staff_code: JSON.parse(getSessionStorage('userInfo')).staff_code,
                        after_type:num,
                        after_order_number: this.after_sale_id
                    }).catch(error => {
                        if (data.status !== 1) {
                            this.$message.warning(data.errorMess || "操作失败");
                            return;
                        }
                    });
                }).catch(error => {

                });
            },
            // 操作日志
            handleOperateDiary(row) {
                this.afterSalesOrderShowlog({
                    after_sale_id: row.after_sale_id
                }).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.warning(data.errorMess || "操作失败");
                            return;
                        }
                        if (data.data_list.value) {
                            this.pop__tableData.tableData = data.data_list.value;
                            this.pop__tableData.tableProps = [
                                "content",
                                "created_by",
                                "created_at"
                            ];
                        }
                        this.dialog.isShowOrderLogShow = true;
                    })
                    .catch(error => {
                    });
            },
            // 审核
            handleOperateReview(row) {
                this.isShow = true;
                this.after_sale_id = row.after_sale_id;
            },
            // 审核弹框取消
            handleOperateCancel() {
                this.isShow = false;
                this.dialog.isModifyInfoShow = false;
                this.form = {
                    remarks: "",
                    reviewResult: "",
                    checkResult: "",
                    responsibleDepartment: "",
                    reasonType: "",
                    afterSalesType: ""
                };
            },
            // 审核弹框确定
            handleAuditConfirm() {
                if (!this.form.reviewResult) {
                    this.$message.error("审核结果为必填");
                    return;
                }
                //                let idArr = [];
                //                for (let i = 0; i < this.checkList.length; i++) {
                //                    idArr.push(this.checkList[i].after_sale_id);
                //                }
                let obj = {
                    after_sale_id: this.after_sale_id,
                    status: this.form.reviewResult,
                    remark: this.form.remarks,
                };
                obj = Object.assign(obj);
                this.$store.commit("SAVE_LOADING_STATE",true);
                this.afterSalesOrderReview(obj)
                    .then(({data}) => {
                        this.handleOperationCall(data);
                        this.$refs["form"].resetFields();
                        this.form = {
                            remarks: "",
                            reviewResult: "",
                            checkResult: "",
                            responsibleDepartment: "",
                            reasonType: "",
                            afterSalesType: ""
                        };
                        this.isShow = false;
                    })
                    .catch(error => {
                    });
            },
            // 批量修改信息
            // handleBatchModifyInfo() {
            //     if (!this.checkList.length) {
            //         this.$message.warning("请勾选列表数据");
            //         return;
            //     }
            //     if( this.checkList.find(e => e.status === '审核通过') ){
            //         this.$message.warning("选中项包含审核通过状态，无法修改信息！");
            //         return;
            //     }
                // this.form.responsibleDepartment = this.tableData[0].department_id_id;
                // this.form.afterSalesType = this.tableData[0].type_id;
                // this.form.reasonType = this.tableData[0].reason_id_id;
                // this.afterSalesOrderDropDown({
                //     after_sale_id: this.after_sale_id
                // }).then(({data}) => {
                //     this.requestData.responsibleDepartment = data.data_list.department_id;
                //     this.requestData.afterSalesType = data.data_list.type;
                //     this.dialog.isModifyInfoShow = true;
                //     this.handleClickShow(this.form.responsibleDepartment, true);
                // }).catch(error => {

                // });
            // },

            // 操作修改信息
            handleOperateModifyInfo(row) {
                // this.form.responsibleDepartment = row.department_id_id;
                // this.form.afterSalesType = row.type_id;
                // this.form.reasonType = row.reason_id_id;
                // this.after_sale_id = row.after_sale_id;
                // this.afterSalesOrderDropDown({after_sale_id: row.after_sale_id,}).then(({data}) => {
                //     this.requestData.responsibleDepartment = data.data_list.department_id;
                //     this.requestData.afterSalesType = data.data_list.type;
                //     this.dialog.isModifyInfoShow = true;
                //     this.handleClickShow(this.form.responsibleDepartment, true);
                // }).catch(error => {});

                this.orderInfo={
                    order_id:row.order_id,
                    platform_code:row.platform_code,
                    edit:false,
                    title:'修改售后单',
                    operation:'addNewAfterSaleSingle'
                }
                this.afterSalesOrderEditInfo=row;
                this.afterSalesOrderEditInfo.edit=true;
                this.isOrderInfoShow=true;
            },
            handleClickShow(value, noClear) {
                if( !noClear ){
                    this.form.reasonType = '';
                }
                if( !value ){
                    return;
                }
                this.requestData.reasonType = this.requestData.responsibleDepartment.find(e => e.id === value).child;
            },
            // 修改信息确定
            // handleModifyInfoConfirm() {
            //     let obj = {
            //         after_sale_id: this.after_sale_id,
            //         department_id: this.form.responsibleDepartment,
            //         reason_id: this.form.reasonType,
            //         type: ''// this.form.afterSalesType
            //     };
            //     obj = Object.assign(obj);
            //     this.afterSalesOrderEdit(obj)
            //         .then(({data}) => {
            //             this.dialog.isModifyInfoShow = false;
            //             this.handleOperationCall(data);
            //             this.$refs["form"].resetFields();
            //         })
            //         .catch(error => {
            //         });
            // },
            // 删除
            handleOperateDelete(row) {
                this.$confirm("是否确认删除？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.afterSalesOrderDestroy({
                            after_sale_id: row.after_sale_id,
                            user_name: "Super"
                        })
                            .then(({data}) => {
                                this.handleOperationCall(data);
                            })
                            .catch(error => {
                            });
                    })
                    .catch(error => {
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
                this.afterSalesOrderEditInfo.edit=false;
                this.isOrderInfoShow=!this.isOrderInfoShow;
            },

            // 批量操作
            // batchEditFn() {
            //     let id = this.curBatchEditId;
            //     switch (id) {
            //         case 1:
            //             // 审核通过
            //             this.$store.commit("SAVE_LOADING_STATE",true);
            //             this.handleReviewPass();
            //             break;
            //         case 2:
            //             // 审核驳回
            //             this.$store.commit("SAVE_LOADING_STATE",true);
            //             this.handleReviewReject();
            //             break;
            //         case 3:
            //             // 标记退款
            //             this.$store.commit("SAVE_LOADING_STATE",true);
            //             this.handleTagRefund();
            //             break;
            //         case 4:
            //             // 数据下载
            //             this.handleDownLoad();
            //             break;
            //         // case 5:
            //         //     // 批量修改信息
            //         //     this.handleBatchModifyInfo();
            //         //     break;
            //         default:
            //             this.$message.warning('未选中操作！');
            //             break;
            //     }
            // },
            handleCancelOrderInfoPopup(bool){
                this.isOrderInfoShow=bool;
                this.afterSalesOrderEditInfo={};
                // this.handleQueryInfo({...this.queryData.mainQuery}, true);
            }
        },
        created() {
            try {
                if (this.$route.query._cacheType === '1' || JSON.stringify(this.AfterSaleInfo) === "{}") {
                    // 需要查询售后单号
                    // if( this.$route.query){
                    //     this.handleQueryInfo(this.$route.query);
                    // }
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo["after_sale"]);
                    this.handleQueryInfoCallBack(this.AfterSaleInfo);
                }
            } catch (e) {
            }
            this.uid = {uid: JSON.parse(getSessionStorage("userInfo")).uid};
        },
        computed: {
            ...mapGetters(["queryParamsInfo", "AfterSaleInfo",]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
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
    };
</script>

<style scoped lang="less">
    .el-dropdown-menu{
        margin-right:-45px;
    }
    .ui-fn-module{
        padding: 5px 0 1px;
        .el-button--primary {
            color: #fff !important;
            border-color: #409EFF !important;
            background: #409EFF !important;
            &:hover{
                background: #74abfe !important;
            }
        }
    }
    .ui-main-module{
        /deep/ .ui-main-module-table{
            .el-table{
                .el-table__body{
                    .el-table__row{
                        td:nth-child(2){
                            position: relative;
                            overflow: hidden;
                            padding-top: 20px;
                            padding-right: 20px;
                        }
                    }
                }
            }
        }
    }
    .rbadge{
        position: absolute;
        right: -27px;
        top: -27px;
        width: 54px;
        height: 54px;
        color: #fff;
        background: #74b0fc;
        transform: rotate(45deg);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        &.rbadgea{
            background: #fdcc51;
        }
    }

    .badgeitem{
        span{
            margin-right: 0;
        }
    }
</style>