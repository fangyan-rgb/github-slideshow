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
                v-if="buttonList['batchDeal'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-piliangchuli" style="color: #72afff;font-size:12px;"></i>批量处理</el-button>
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
                @click="handleCopyEmpty(checkList.map(e => {return e.asin}).join(','))"
                :data-clipboard-text="checkList.map(e => {return e.asin}).join(',')"
                v-if="buttonList['copyAsin'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-fuzhi" style="color: #72afff;font-size:12px;"></i>批量复制Asin</el-button>
            <el-button size="small" type="text" class="copyBtn"
                @click="handleCopyEmpty(checkList.map(e => {return e.order_id}).join(','))"
                :data-clipboard-text="checkList.map(e => {return e.order_id}).join(',')"
                v-if="buttonList['copyOrderNum'].permit(thisVm)" style='color: #333333 !important;'>
                <i class="icon-fuzhi" style="color: #72afff;font-size:12px;"></i>批量复制订单号</el-button>
            <!-- <el-select v-model="curBatchEditId" size="small">
                <el-option v-if="buttonList['batchDeal'].permit(thisVm)" label="批量处理" :value="1"></el-option>
                <el-option v-if="buttonList['copyBuyerMail'].permit(thisVm)" label="复制买家邮箱" :value="2"></el-option>
                <el-option v-if="buttonList['copyAsin'].permit(thisVm)" label="复制Asin" :value="3"></el-option>
                <el-option v-if="buttonList['copyOrderNum'].permit(thisVm)" label="复制订单号" :value="4"></el-option>
                <el-option v-if="buttonList['followUpStatus'].permit(thisVm)" label="跟进状态" :value="5"></el-option>
                <el-option v-if="buttonList['badReviewReason'].permit(thisVm)" label="差评原因" :value="6"></el-option>
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
                <div>平台订单号：{{scope.row.platform_order_id}}</div>
                <div>订单号： <span style="cursor:pointer; color: #3388ff;" type="text" @click="handleOrderNum(scope.row)">{{scope.row.order_id}}</span></div>
            </template>
            <!-- 账号信息 -->
            <template slot-scope="scope" slot="accountInfo">
                <div>平台：{{scope.row.platform_code}}</div>
                <div>账号：{{scope.row.account_name}}</div>
                <div>站点：{{scope.row.site}}</div>
                <!-- <div>发货国家：{{scope.row.ship_cn_country_name}}</div> -->
                <div>仓库：{{scope.row.warehouse}}</div>
            </template>
            <!-- 产品图片 -->
            <template slot-scope="scope" slot="productImg">
                <div><img class="ui-img-style" @click="handleClickImg(scope.row['img_url'])"
                          :src="scope.row['img_url']?scope.row['img_url']:defaultImg"/>
                </div>
                <div>Asin：<span style="cursor:pointer; color: #3388ff;" type="text" @click="handleJumpSkuUrl(scope.row.asinurl)">
                {{scope.row.asin}}</span>
                </div>
            </template>
            <!-- 客户信息 -->
            <template slot-scope="scope" slot="customerInfo">
                <div>客户ID：{{scope.row.customer_name}}</div>
                <div>客户Email：{{scope.row.customer_email}}</div>
                <div>电话号码：{{scope.row.customer_tel}}</div>
                <div>Review时间：{{scope.row.review_date}}</div>
            </template>
            <!-- 差评原因 -->
            <template slot-scope="scope" slot="review_comment">
                <div style="cursor: pointer;color: #3388ff;" @click="handleReviewComment(scope.row)">{{scope.row.review_comment}}</div>
            </template>
            <!-- 跟进状态 -->
            <template slot-scope="scope" slot="follow_status">
                <div style="cursor: pointer;color: #3388ff;" @click="handleFollowStatus(scope.row)">{{scope.row.follow_status}}</div>
            </template>
            <!-- 详细信息 -->
            <template slot-scope="scope" slot="detailInfo">
                <el-popover class="ui-content-overflow" ref="popover"
                            placement="top-start"
                            trigger="hover"
                            width="300"
                            :content="scope.row.review_content">
                    <span slot="reference" class="ui-tooltip">评价内容：{{scope.row.review_content}}</span>
                </el-popover>
                <div>Review星级：<el-rate :value="Number(scope.row.customer_star)" disabled></el-rate></div>
            </template>
            <template slot-scope="scope" slot="is_reply">
                <div>
                    <span class="ui-state_circle blueColor" v-if="scope.row.is_reply === '已回复邮件'"></span>
                    <span class="ui-state_circle grayColor" v-else></span>
                    {{scope.row.is_reply}}
                </div>
            </template>
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <el-button type="text" @click='handleOperateDeal(scope.row)' v-if="buttonList['deal'].permit(thisVm)">处理</el-button>
                <ComDivide/>
                <el-button type="text" @click='handleOperateDaily(scope.row)' v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
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

        <el-dialog :visible.sync="imageDialogVisible" width="500px" :before-close="handleImageClose">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <!-- 跟进状态-->
        <el-dialog
                class="ui-layout_edit-dialog"
                title="跟进状态"
                width="500px"
                :visible.sync="dialog.isFollowUpStatusShow"
                @close="optionFollowStatus = true">
            <el-form border style="width: 100%" ref="form" :model="form">
                <el-form-item label="跟进状态：">
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
        <!-- 订单详情弹窗 -->
        <OrderInformation
            v-if="isOrderInfoShow"
            @handleCancelOrderInfoPopup="handleCancelOrderInfoPopup"
            :isOrderInfoShow="isOrderInfoShow"
            :orderInfo="orderInfo"
            @handleReviewEvent="isOrderInfoShow = false; handleQueryInfo({order_id: $event})"
        ></OrderInformation>
    </div>
</template>


<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import {
    reviewList,
    batchDealMail,
    getLogs,
    getForParent,
    followReview,
    reviewReason,
    detailDropDown,
} from '@/api/Amazon/customerEvaluationReview';
import config from '@/assets/js/config';
import routerConfig from '@/router/routerConfig';
import OrderInformation from "@/views/HomePage/OrderManagement/OrderInformation";
import * as storage from '@/utils/storage';
// 复制到剪贴板
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'CustomerEvaluationReview',
    components: {
        OrderInformation,
    },
    data () {
        return {
            orderInfo:{},
            isOrderInfoShow:false,//订单详情弹窗
            searchHeight: false,
            thisVm: this,
            form:{
                followUpStatus:'',
                badReviewReason:'',
            },
            requestData: {
                followUpStatus: [],
                badReviewReason:[],
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
            },

            pageData: {
                currentPage: 1,
                currentList: 10,
                currentTotal: 0,
            },
            pageSizes: config.pageData.pageSizes,
            checkList: [],
            ids: '',
            customer_email: '',
            tableKey: ['订单信息', '账号信息', '产品图片', '客户信息', '差评原因', '跟进状态', '详细信息', '回复状态', '操作'],
            tableWidth: ['260', '', '170', '', '', '', '240', '120', '130'],
            tableData: [],
            tableProps: [],
            // 表格加载动画
            tableLoading: false,

            dialogImageUrl: false,
            imageDialogVisible: false,
            dialog: {
                isShowOrderLogShow: false,
                isFollowUpStatusShow:false,
                isBadReviewReasonShow:false,
            },

            defaultImg: require('../../../../assets/image/default_error.png'),
            platform: 'Amazon',

            curBatchEditId: '',
            inbox_id:'',
            optionReviewComment:true,
            optionFollowStatus:true,
        }
    },
    methods: {
        ...mapActions(['GetReviewList']),
        reviewList,
        batchDealMail,
        getLogs,
        getForParent,
        followReview,
        reviewReason,
        detailDropDown,
        // 列表勾选
        handleCheck(row) {
            this.checkList = row
            let idArr = [];
            let customerEmailArr = []
            let inbox_id = []
            this.checkList.forEach(item => {
                idArr.push(item.id)
                customerEmailArr.push(item.customer_email)
                inbox_id.push(item.inbox_id)
            });
            this.ids = idArr.join(',')
            this.customer_email = customerEmailArr.join(',')
            this.inbox_id = inbox_id.join(',')
        },

        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['review_list']);
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
            this.GetReviewList(obj).then(({data}) => {
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
                key: 'review_list',
                value: JSON.stringify(this.queryData)
            });
            this.optionList.isBadReviewList = data.data_list.drop_dowm_box.is_review;
            this.tableData = data.data_list.value;
            this.tableProps = ['orderInfo', 'accountInfo', 'productImg', 'customerInfo', 'review_comment', 'follow_status', 'detailInfo', 'is_reply', 'operate'];
            // 渲染分页
            this.pageData.currentTotal = data.page_data.total * 1;
            this.pageData.currentList = data.page_data.limit * 1;
            this.pageData.currentPage = data.page_data.page * 1;

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
        // 批量处理
        handleBatchDeal(){
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
            let query = {inbox_id: this.ids, account_id: all, customer_email: customerEmail, order_id: orderId, type:'CustomerEvaluationReview', goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
            this.$router.push({path, query});

            this.changeNavShowFn(path, query);
        },
        // 操作处理
        handleOperateDeal(row){
            let path = '/PostMail';
            let query = {inbox_id: row.id, account_id: row.account_id, customer_email: row.customer_email, order_id: row.order_id, type:'CustomerEvaluationReview', goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
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
        // 操作日志
        handleOperateDaily(row){

            this.getLogs({
                id: row.id
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

        // 跟进状态
        handleFollowUpStatus(){
            if (!this.checkList.length&&this.optionFollowStatus) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            this.getForParent({
                parent_id:'19',
                platform_code:'Amazon',
            }).then(({data})=>{
                this.requestData.followUpStatus = data.data_list.values
            })
            this.dialog.isFollowUpStatusShow = true
        },
        // 跟进状态确定
        handleFollowUpConfirm(){
            if( !this.form.followUpStatus&&this.optionFollowStatus ){
                this.$message.warning('请选择！');
                return;
            }
            this.followReview({
                id:this.ids,
                follow_status:this.form.followUpStatus
            }).then(({data})=>{
                this.form = {
                    followUpStatus: '',
                }
                this.handleOperationCall(data)
            }).catch(error=>{})
            this.dialog.isFollowUpStatusShow = false
        },

        // 差评原因
        handleBadReviewReason(){
            if (!this.checkList.length&&this.optionReviewComment) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            this.getForParent({
                parent_id:'18',
                platform_code:'Amazon',
            }).then(({data})=>{
                this.requestData.badReviewReason = data.data_list.values
            })

            this.dialog.isBadReviewReasonShow = true
        },
        // 差评原因确定
        handleBadReasonConfirm(){
            if( !this.form.badReviewReason&&this.optionReviewComment ){
                this.$message.warning('请选择！');
                return;
            }
            this.reviewReason({
                id:this.ids,
                review_comment:this.form.badReviewReason
            }).then(({data})=>{
                this.form = {
                    badReviewReason: '',
                }
                this.handleOperationCall(data)
            }).catch(error=>{})
            this.dialog.isBadReviewReasonShow = false
        },
        // 取消
        handleOperateCancel(){
            this.form = {
                badReviewReason:'',
                followUpStatus:''
            }
            this.dialog.isFollowUpStatusShow = false
            this.dialog.isBadReviewReasonShow = false
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
        // 点击放大图片
        handleClickImg(url) {
            if (url) {
                this.dialogImageUrl = url;
                this.imageDialogVisible = true
            }
        },
        handleImageClose() {
            this.imageDialogVisible = false;
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

        // 批量操作
        batchEditFn(id) {
            // let id = this.curBatchEditId;
            switch (id) {
                case 1:
                    // 批量处理
                    this.handleBatchDeal();
                    break;
                case 5:
                    // 跟进状态
                    this.handleFollowUpStatus();
                    break;
                case 6:
                    // 差评原因
                    this.handleBadReviewReason();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
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
            this.handleFollowUpStatus()
        }
    },

    created() {
        try{
            if (this.$route.query._cacheType === '1' || JSON.stringify(this.CustomerReviewInfo) === '{}') {
                // 需要查询订单号
                // let obj = {};
                // if( this.$route.query.order_id ){
                //     obj = {
                //         order_id: this.$route.query.order_id
                //     };
                // }
                // this.handleQueryInfo(obj);
            }else{
                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo['review_list']);
                this.handleQueryInfoCallBack(this.CustomerReviewInfo);
            }
        }catch (e) {}

        this.detailDropDown({
            platform_code:'AMAZON',
        }).then(({data})=>{
            this.optionList.badReviewReasonList = data.data_list['18']
        })

    },
    computed: {
        ...mapGetters(['queryParamsInfo', 'CustomerReviewInfo']),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
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
}
</script>

<style lang="less" scoped>
    .ui-img-style {
        width: 50px;
        height: 50px;
        cursor: pointer;
        vertical-align: middle;
        border: 1px solid #ebeef5;
    }
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
</style>