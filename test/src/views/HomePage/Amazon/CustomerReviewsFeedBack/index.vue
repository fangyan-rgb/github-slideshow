<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button size="small" type="text" @click="batchEditFn(1)"
                v-if="buttonList['batchContactBuyer'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-lianxi" style="color: #72afff;font-size:12px;"></i>批量联系买家</el-button>
            <el-button size="small" type="text" @click="batchEditFn(5)"
                v-if="buttonList['followUpStatus'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-genjinzhuangtai" style="color: #fd996b;font-size:12px;"></i>批量跟进状态</el-button>
            <el-button size="small" type="text" @click="batchEditFn(6)"
                v-if="buttonList['badReviewReason'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-chapingyuanyin" style="color: #fc6769;font-size:12px;"></i>批量差评原因</el-button>
            <el-button size="small" type="text" class="copyBtn"
                @click="handleCopyEmpty(checkList.map(e => {return e.customer_email}).join(','))"
                :data-clipboard-text="checkList.map(e => {return e.customer_email}).join(',')"
                v-if="buttonList['copyBuyerMail'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-fuzhi" style="color: #72afff;font-size:12px;"></i>批量复制买家邮箱</el-button>
            <el-button size="small" type="text" class="copyBtn"
                @click="handleCopyEmpty(checkList.map(e => {return e.order_id}).join(','))"
                :data-clipboard-text="checkList.map(e => {return e.order_id}).join(',')"
                v-if="buttonList['copyOrderNum'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-fuzhi" style="color: #72afff;font-size:12px;"></i>批量复制订单号</el-button>
            <el-button size="small" type="text" @click="batchEditFn(7)"
                v-if="buttonList['export'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-daochu" style="color: #72afff;font-size:12px;"></i>导出</el-button>
            <!-- <el-select v-model="curBatchEditId" size="small">
                <el-option v-if="buttonList['batchContactBuyer'].permit(thisVm)" label="批量联系买家" :value="1"></el-option>
                <el-option v-if="buttonList['copyBuyerMail'].permit(thisVm)" label="复制买家邮箱" :value="2"></el-option>
                <el-option v-if="buttonList['copyOrderNum'].permit(thisVm)" label="复制订单号" :value="4"></el-option>
                <el-option v-if="buttonList['followUpStatus'].permit(thisVm)" label="跟进状态" :value="5"></el-option>
                <el-option v-if="buttonList['badReviewReason'].permit(thisVm)" label="差评原因" :value="6"></el-option>
                <el-option v-if="buttonList['export'].permit(thisVm)" label="导出" :value="7"></el-option>
            </el-select>
            &nbsp;
            <el-button
                v-show="![2, 3, 4].find(e => e === curBatchEditId)"
                @click="batchEditFn()"
                size="small"
                type="primary">
                批量操作
            </el-button>
            <el-button
                v-show="[2, 3, 4].find(e => e === curBatchEditId)"
                @click="handleCopyEmpty(checkList.map(e => {if(curBatchEditId === 2){return e.customer_email};if(curBatchEditId === 3){return e.asin};if(curBatchEditId === 4){return e.order_id};}).join(','))"
                class="copyBtn"
                :data-clipboard-text="checkList.map(e => {if(curBatchEditId === 2){return e.customer_email};if(curBatchEditId === 3){return e.asin};if(curBatchEditId === 4){return e.order_id};}).join(',')"
                size="small"
                type="primary">
                批量操作
            </el-button> -->
        </div>
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
            <!-- 订单信息 -->
            <template slot-scope="scope" slot="orderInfo">
                <div v-if="scope.row.amazon_fulfill_channel" :class="{rbadgea: scope.row.amazon_fulfill_channel === 'FBA'}" class="rbadge">{{scope.row.amazon_fulfill_channel}}</div>
                <div style="display:flex;">
                    <div style="white-space:nowrap;">平台订单号：</div>
                    <div style="flex:1;word-wrap:break-word;">{{scope.row.platform_order_id}}</div>
                </div>
                <div style="display:flex;">
                    <div style="white-space:nowrap;">订单号：</div>
                    <div style="cursor:pointer; color: #3388ff;word-wrap:break-word;" type="text" @click="handleOrderNum(scope.row)">{{scope.row.order_id}}</div>
                </div>
            </template>
            <!-- 账号信息 -->
            <template slot-scope="scope" slot="accountInfo">
                <div>平台：{{scope.row.platform_code}}</div>
                <div>账号：{{scope.row.account_name}}</div>
                <div>站点：{{scope.row.site}}</div>
                <!-- <div>发货国家：{{scope.row.ship_cn_country_name}}</div> -->
                <div>仓库：{{scope.row.warehouse}}</div>
            </template>
            <!-- 客户信息 -->
            <template slot-scope="scope" slot="customerInfo">
                <div>客户ID：{{scope.row.customer_name}}</div>
                <div>客户Email：{{scope.row.customer_email}}</div>
                <div>电话号码：{{scope.row.customer_tel}}</div>
                <div>FeedBack时间：{{scope.row.feedback_date}}</div>
            </template>
            <!-- 差评原因 -->
            <template slot-scope="scope" slot="review_status">
                <div style="cursor: pointer;color: #3388ff;" @click="handleReviewComment(scope.row)">{{scope.row.review_status}}</div>
            </template>
            <!-- 跟进状态 -->
            <template slot-scope="scope" slot="follow_status">
                <div style="cursor: pointer;color: #3388ff;" @click="handleFollowStatus(scope.row)">{{scope.row.follow_status}}</div>
            </template>
            <!-- 详细信息 -->
            <template slot-scope="scope" slot="detailInfo">
                <div :class="{rbadgeb: scope.row.is_stamp == '1'}" class="rbadge">{{scope.row.is_stamp === '1' ? '未移除' : '已移除'}}</div>
                <el-popover class="ui-content-overflow" ref="popover"
                            placement="top-start"
                            trigger="hover"
                            width="300"
                            :content="scope.row.review_content">
                    <span slot="reference" class="ui-tooltip">评价内容：{{scope.row.review_content}}</span>
                </el-popover>
                <div>FeedBack星级：
                    <el-rate :value="Number(scope.row.customer_star)" disabled></el-rate>
                </div>

            </template>
            <!-- 回复详情 -->
            <template slot-scope="scope" slot="back_content">
                <el-popover class="ui-content-overflow" ref="popover"
                            placement="top-start"
                            trigger="hover"
                            width="300"
                            :content="scope.row.back_content">
                    <span slot="reference" class="ui-tooltip">{{scope.row.back_content}}</span>
                </el-popover>
            </template>
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <p style="margin-bottom: 7px;">
                    <el-button v-if="buttonList['tagRemoval'].permit(thisVm) && scope.row.is_stamp === '1'" @click="handletagRemoval(scope.row)" type="text">标记移除</el-button>
                    <ComDivide v-if="scope.row.is_stamp === '1'" />
                    <el-button type="text" @click="handleOperateContactBuyer(scope.row)" v-if="buttonList['contactBuyer'].permit(thisVm)">联系买家</el-button>
                </p>
                <p>
                    <el-button type="text" @click="handleOperateReplyReview(scope.row)" v-if="buttonList['reply'].permit(thisVm)">回复评论</el-button>
                    <ComDivide/>
                    <el-button type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
                </p>
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
                @close="dialog.isShowOrderLogShow=false">
            <ComPreviewTable
                    :isAdaptiveHeight="false"
                    :logWidth="pop__tableData.tableWidth"
                    :logKey="pop__tableData.tableKey"
                    :logProps="pop__tableData.tableProps"
                    :logData="pop__tableData.tableData"
                    :showSearch="pop__tableData.showSearch">
            </ComPreviewTable>
        </el-dialog>

        <!-- 跟进状态-->
        <el-dialog
                class="ui-layout_edit-dialog"
                title="跟进状态"
                width="500px"
                :visible.sync="dialog.isFollowUpStatusShow"
                @close="optionFollowStatus = true">
            <el-form border style="width: 100%" ref="form" :model="form">
                <el-form-item prop="reason" label="跟进状态：">
                    <el-select placeholder="请选择" size="mini" clearable v-model="form.followUpStatus">
                        <el-option v-for="(value,index) in requestData.followUpStatus" :key="index" :value="value.id"
                                   :label="value.name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
               <el-button type="primary" @click="handleFollowUpConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 差评原因-->
        <el-dialog
                class="ui-layout_edit-dialog"
                title="差评原因"
                width="500px"
                :visible.sync="dialog.isBadReviewReasonShow"
                @close="optionReviewComment = true">
            <el-form border style="width: 100%" ref="form" :model="form">
                <el-form-item prop="reason" label="差评原因：">
                    <el-select placeholder="请选择" size="mini" clearable v-model="form.badReviewReason">
                        <el-option v-for="(value,index) in requestData.badReviewReason" :key="index" :value="value.id"
                                   :label="value.name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
               <el-button type="primary" @click="handleBadReasonConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 回复评论-->
        <el-dialog
                class="ui-layout_edit-dialog"
                title="回复评论"
                width="500px"
                :visible.sync="dialog.isTemplateChooseShow"
                @close="handleOperateCancel">
            <el-form border style="width: 100%" ref="form" :model="form">
                <el-form-item label="模板选择：">
                    <el-select placeholder="请选择" size="mini" clearable v-model="form.templateChoose" @change="templateChange">
                        <el-option v-for="(v, k, i) in requestData.templateChoose" :label="v"
                                   :value="k"
                                   :key="i">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="快捷参数：">
                    <el-select placeholder="请选择" size="mini" clearable v-model="form.quickParameter" @change="changeQuickParameter">
                        <el-option v-for="(v, k, i) in requestData.quickParameter" :label="v"
                                   :value="k"
                                   :key="i">
                        </el-option>
                    </el-select>
                    <ComSelectLanguage @change="changeLanguage" :list="itemTemplateObj"></ComSelectLanguage>
                </el-form-item> -->
                <el-form-item>
                    <el-input id="maintextarea" type="textarea" v-model="form.remarks" :rows="languageCode ? 10 : 20" resize="none"></el-input>
                </el-form-item>
                <div v-if="languageCode">
                    <el-button type="text" @click="changeRetranslation" style="padding:5px 0;">重新翻译</el-button>
                    <el-form-item>
                        <el-input type="textarea" v-model="form.retranslation" :rows="10" resize="none" :key="retranslationkey"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
               <el-button type="primary" @click="handleTemplateChooseConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            @handleFeedBackEvent="isOrderInfoShow = false; handleQueryInfo({order_id: $event})"
        ></OrderInformation>
    </div>
</template>


<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import {
    feedbackList,
    batchDelete,
    getFeedbackLogs,
    followReview,
    reviewReason,
    replyDetail,
    replyDetailConfirm,
    tagRemoval,
    dataOutput,
} from '@/api/Amazon/customerReviewsFeedBack';
import {
    getForParent,
    detailDropDown,
} from '@/api/Amazon/customerEvaluationReview';
import {
    getItemTemplate,
    getGoogleTranslate,
    getTemplateDetail,
} from '@/api/MailCenterManagement/PostMail';
import config from '@/assets/js/config';
import { getSessionStorage } from '@/utils/storage';
import ComSelectLanguage from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguage";
import routerConfig from '@/router/routerConfig';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import * as storage from '@/utils/storage';
// 复制到剪贴板
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'CustomerReviewsFeedBack',
    data () {
        return {
            orderInfo:{},
            isOrderInfoShow:false,//订单详情弹窗
            searchHeight: false,
            classObject: {
                active: true,
            },
            show:true,
            thisVm: this,
            form: {
                id: '',
                followUpStatus: '',
                badReviewReason: '',
                templateChoose: '',
                quickParameter: '',
                remarks: '',
                retranslation: '',
            },
            requestData: {
                followUpStatus: [],
                badReviewReason: [],
                templateChoose: [],
                quickParameter: {},
                orderValue: {},
            },
            dialog: {
                isShowOrderLogShow: false,
                isFollowUpStatusShow: false,
                isBadReviewReasonShow: false,
                isTemplateChooseShow: false,

            },
            pop__tableData: {
                showSearch: false,
            },
            //操作日志
            pop__tableData: {
                tableWidth: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableProps: [],
                tableData: []
            },
            showSearch: true,
            queryData: {
                mainQuery: {},
                platform_code: 'AMAZON'
            },
            // 属性
            optionList: {
                isBadReviewList: [],
                badReviewReasonList: [],
                followUpStatusList: []
            },

            pageSizes: config.pageData.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 10,
                currentTotal: 0,
            },
            checkList: [],
            ids: '',
            tableKey: ['订单信息', '账号信息', '客户信息', '差评原因', '跟进状态', '详细信息', '回复详情', '操作'],
            tableWidth: ['240', '', '', '', '', '240', '200', '145'],
            tableData: [],
            tableProps: [],
            // 表格加载动画
            tableLoading: false,

            platform: 'Amazon',

            languageCode: '',
            itemTemplateObj: {},
            retranslationkey: 0,

            curBatchEditId: '',
            optionReviewComment:true,
            optionFollowStatus:true,
        }
    },
    mounted() {
        // 复制事件
        clipboard.on('success', e => {
            // this.$message.success('复制成功！');
            e.clearSelection();
        });

        clipboard.on('error', e => {
            this.$message.error('复制失败！');
        });
    },
    components: {ComSelectLanguage, OrderInformation},
    methods: {
        ...mapActions(['GetFeedBackList']),
        feedbackList,
        batchDelete,
        getFeedbackLogs,
        getForParent,
        followReview,
        reviewReason,
        detailDropDown,
        replyDetail,
        replyDetailConfirm,
        // 列表勾选
        handleCheck(row) {
            this.checkList = row
            let idArr = [];
            this.checkList.forEach(item => {
                idArr.push(item.id)
            });
            this.ids = idArr.join(',')
        },

        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['feedback_list']);
            }
            let obj = {
                platform_code: this.queryData.platform_code
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
            this.GetFeedBackList(obj).then(({data}) => {
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

            // 获取保存的查询参数
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: 'feedback_list',
                value: JSON.stringify(this.queryData)
            });
            this.optionList.isBadReviewList = data.data_list.drop_dowm_box.is_review;
            this.tableData = data.data_list.value;
            this.tableProps = ['orderInfo', 'accountInfo', 'customerInfo', 'review_status', 'follow_status', 'detailInfo', 'back_content', 'operate'];
            // 渲染分页
            this.pageData.currentPage = data.page_data.page * 1;
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
        // 重置
        handleResetQueryInfo(){
            this.queryData = {
                mainQuery: {},
                platform_code: 'Amazon'
            }
        },
        // 批量联系买家
        handleBatchContactBuyer(){
            if (!this.checkList.length) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            let allRight = true;
            let all = this.checkList[0].account_id;
            let customerEmail = '';
            let orderId = '';
            this.checkList.forEach(item => {
                if (all!== item.account_id) {
                    allRight = false;
                }
                if( !customerEmail.includes(item.customer_email) && item.customer_email ){
                    customerEmail += item.customer_email + ',';
                }
                if( !orderId.includes(item.order_id) && item.order_id ){
                    orderId += item.order_id + ',';
                }
            });
            if (!allRight) {
                this.$message({
                    message: "勾选的数据必须是同一个销售账号",
                    type: "warning"
                });
                return;
            }

            // 去掉最后,号
            customerEmail = customerEmail.substr(0, customerEmail.length-1);
            orderId = orderId.substr(0, orderId.length-1);

            let path = '/PostMail';
            let query = {inbox_id: this.ids, account_id: all, customer_email: customerEmail, order_id: orderId, type:'CustomerReviewsFeedBack', goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
            this.$router.push({path, query});

            this.changeNavShowFn(path, query);
        },

        // 处理复制数据为空的时候
        handleCopyEmpty(str) {
            if( !this.checkList.length ){
                this.$message.warning('请先勾选数据！');
                return false;
            }
            if( !str ){
                this.$message.warning('数据为空，无法复制！');
                return false;
            }
            this.$message.success('复制成功！');
        },

        // 操作联系买家
        handleOperateContactBuyer(row){
            let path = '/PostMail';
            let query = {inbox_id: row.id, account_id: row.account_id, customer_email: row.customer_email, order_id: row.order_id, type:'CustomerReviewsFeedBack', goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
            this.$router.push({path, query});

            this.changeNavShowFn(path, query);
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
        // 回复评论
        handleOperateReplyReview(row){
            this.replyDetail({
                order_id:row.order_id,
                platform_code:row.platform_code
            }).then(({data})=>{
                this.requestData.templateChoose = data.data_list.item
                this.requestData.quickParameter = data.data_list.order.key
                this.requestData.orderValue = data.data_list.order.value

                if (data.status !== 1) {
                    this.$message.warning(data.errorMess || '操作失败')
                    return;
                }
            });
            this.form.id = row.id;
            this.form.remarks = row.back_content;
            this.dialog.isTemplateChooseShow = true

        },
        // 回复评论确定
        handleTemplateChooseConfirm(){
            this.$refs['form'].validate((res) => {
                if (res) {
                    let obj = {
                        id: this.form.id,
                        your_response:this.form.remarks,
                        translation_content:this.form.retranslation
                    };
                    this.replyDetailConfirm(obj).then(({data}) => {
                        this.handleOperationCall(data)
                    });
                    this.dialog.isTemplateChooseShow = false
                }
            })
        },
        changeLanguage(code) {
            this.languageCode = code;
            getGoogleTranslate({
                content: this.form.remarks,
                after : this.languageCode,
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.retranslation = data.after;
                this.retranslationkey += 1;
            });
        },
        changeRetranslation() {
            this.languageCode = '';
            if( !this.form.remarks ){
                return;
            }
        },
        // 日志
        handleOperateDiary(row){
            this.getFeedbackLogs({
                id: row.id,
            }).then(({data}) => {
                this.dialog.isShowOrderLogShow = true;
                if (data.status !== 1) {
                    this.pop__tableData.tableData = [];
                    return;
                }
                if (data.data_list.value) {
                    this.pop__tableData.tableData = data.data_list.value;
                    this.pop__tableData.tableProps = ['operation', 'operation_name', 'createt']
                }

            }).catch(error => {
            })
        },
        // 跟进原因
        handleFollowUpStatus(){
            if (!this.checkList.length && this.optionFollowStatus) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            this.getForParent({
                parent_id: '19',
                platform_code: 'AMAZON',
            }).then(({data}) => {
                this.requestData.followUpStatus = data.data_list.values
            })
            this.dialog.isFollowUpStatusShow = true
        },
        // 跟进原因确定
        handleFollowUpConfirm(){
            this.followReview({
                id: this.ids,
                follow_status: this.form.followUpStatus
            }).then(({data}) => {
                this.form.followUpStatus = '';
                this.handleOperationCall(data)
            }).catch(error => {

            })
            this.dialog.isFollowUpStatusShow = false

        },

        // 差评原因
        handleBadReviewReason(){
            if (!this.checkList.length&&this.optionReviewComment) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            this.getForParent({
                parent_id: '18',
                platform_code: 'AMAZON',
            }).then(({data}) => {
                this.requestData.badReviewReason = data.data_list.values
            })
            this.dialog.isBadReviewReasonShow = true
        },
        // 差评原因确定
        handleBadReasonConfirm(){
            this.reviewReason({
                id: this.ids,
                review_comment: this.form.badReviewReason
            }).then(({data}) => {
                this.handleOperationCall(data)
                this.form.badReviewReason = '';
            }).catch(error => {

            })
            this.dialog.isBadReviewReasonShow = false
        },
        // 取消
        handleOperateCancel(){
            this.form = {
                id: '',
                followUpStatus: '',
                badReviewReason: '',
                templateChoose: '',
                quickParameter: '',
                remarks: '',
                retranslation: '',
            }
            this.dialog.isFollowUpStatusShow = false
            this.dialog.isBadReviewReasonShow = false
            this.dialog.isTemplateChooseShow = false
            this.$refs["form"].resetFields();
        },
        // 数据导出
        dataExportFn() {
            this.$confirm('是否导出数据？', '提示', {
                type: 'warning'
            }).then(() => {
                let data = JSON.parse(this.queryParamsInfo['feedback_list'] || '{}');
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

        // 批量操作
        batchEditFn(id) {
            // let id = this.curBatchEditId;
            switch (id) {
                case 1:
                    // 批量处理
                    this.handleBatchContactBuyer();
                    break;
                case 5:
                    // 跟进状态
                    this.handleFollowUpStatus();
                    break;
                case 6:
                    // 差评原因
                    this.handleBadReviewReason();
                    break;
                case 7:
                    // 数据导出
                    this.dataExportFn();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        changeQuickParameter(v) {
            if( !this.requestData.orderValue[v] ){
                this.$message.warning('快捷参数内容为空！');
                return;
            }
            this.insertText(document.getElementById('maintextarea'), this.requestData.orderValue[v]);
            this.moveEnd(document.getElementById('maintextarea'));
        },

        // 在textarea光标位置插入文本
        insertText(obj, str) {
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.text = str;
            } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                // obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                this.form.remarks = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                // obj.value += str;
                this.form.remarks += str;
            }
        },

        moveEnd(obj) {
            this.$nextTick(() => {
                obj.focus();
                var len = obj.value.length;
                if (document.selection) {
                    var sel = obj.createTextRange();
                    sel.moveStart('character', len);
                    sel.collapse();
                    sel.select();
                } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                    obj.selectionStart = obj.selectionEnd = len;
                }
            });
        },

        templateChange(id) {
            getTemplateDetail({id}).then(({data}) => {
                this.form.remarks = data.data_list.values[0].template_content;
            });
        },
        handleCancelOrderInfoPopup(bool){
            this.isOrderInfoShow=bool
        },

        //差评原因
        handleReviewComment(row){
            this.dialog.isBadReviewReasonShow = true;
            this.optionReviewComment = false;
            this.ids = row.id;
            this.handleBadReviewReason();
        },

        //跟进状态
        handleFollowStatus(row){
            this.dialog.isFollowUpStatusShow = true;
            this.optionFollowStatus = false;
            this.ids = row.id;
            this.handleFollowUpStatus();
        },

        // 标记移除
        handletagRemoval(row) {
            this.$confirm('是否标记移除？', '提示', {
                type: 'warning'
            }).then(() => {
                tagRemoval({
                    id: row.id
                }).then(({data}) => {
                    this.handleOperationCall(data);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {

            });
        },
    },

    created() {
        try {
            if (this.$route.query._cacheType === '1' || JSON.stringify(this.CustomerFeedbackInfo) === '{}') {
                // 需要查询订单号
                // let obj = {};
                // if( this.$route.query.order_id ){
                //     obj = {
                //         order_id: this.$route.query.order_id
                //     };
                // }
                // this.handleQueryInfo(obj);
            } else {
                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo["feedback_list"]);
                this.handleQueryInfoCallBack(this.CustomerFeedbackInfo);
            }
        } catch (e) {
        }

        this.detailDropDown({
            platform_code: 'AMAZON',
        }).then(({data}) => {
            this.optionList.badReviewReasonList = data.data_list['18']
            this.optionList.followUpStatusList = data.data_list['19']
        })

        getItemTemplate().then(({data})=> {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }
            this.itemTemplateObj = data.data_list.google_lang_code;
        });
    },
    computed: {
        ...mapGetters(['queryParamsInfo', 'CustomerFeedbackInfo']),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
}
</script>

<style lang="less" scoped>
    /deep/ .el-rate {
        display: inline;
    }
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
                        td:nth-child(2), td:nth-child(7){
                            position: relative;
                            overflow: hidden;
                            padding-top: 20px;
                            padding-right: 20px;
                        }
                        td:nth-child(7){
                            .rbadge{
                                right: -30px;
                                top: -30px;
                                width: 61px;
                                height: 61px;
                            }
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
        &.rbadgeb{
            background: #f00;
        }
    }
</style>