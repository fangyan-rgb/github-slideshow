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
                    <template slot-scope="scope" slot="sender">
                        <div>客户ID：{{scope.row.sender}}</div>
                        <div>电话：{{scope.row.customer_phone}}</div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <!-- <el-button v-if="1 || buttonList['aaa'].permit(thisVm)" @click="fn(scope.row)" type="text" size="mini">操作</el-button>
                        <ComDivide v-if="1 || buttonList['aaa'].permit(thisVm)"/> -->
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
} from '@/api/TemplatePage';

export default {
    name: 'TemplatePage',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['', '标题', '客户', '销售账号', '发件人邮箱', '订单号', '邮件类型/是否分类', '客服人员', '状态信息', '回复时间', '操作'],
            tableProps: ['is_read', 'subject', 'sender', 'account_name', 'sender_email', 'order_id', 'email_cate', 'user_name', 'payment_status', 'receive_date', 'operate'],
            tableWidth: ['is_read', 'subject', 'sender', 'account_name', 'sender_email', 'order_id', 'email_cate', 'user_name', 'payment_status', 'receive_date', 'operate'],
            tableData: [],
            // 表格加载动画
            tableLoading: false,

            // 分页数据
            pageSizes: config.pageData.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 10,
                currentTotal: 0
            },

            // 保存选中项信息
            saveCheckInfo: [],
            // 选中的ids
            saveCheckIds: '',

            // 查询数据
            queryData: {
                fast_mail_category: '',
                fast_is_replied: '',
                fast_tag_id: '',
                mainQuery: {},
            },

            optionListLabel: {
                curBatchEditId: '',
                batchEditArr: [
                    {id: 1, name: '批量回复', button:'batchReply', iconName:"pilianghuifu", color:'#72afff'},
                    {id: 3, name: '批量标签', button:'batchTag', iconName:"piliangbiaoqian", color:'#bc8cef'},
                    {id: 6, name: '批量标星邮件', button:'starMail', iconName:"piliangbiaoxing", color:'#fc6769'},
                    {id: 15, name: '批量标记已回复', button:'tagReply', iconName:"pilianghuifu", color:'#72afff'},
                    {id: 2, name: '批量分类', button:'batchClass', iconName:"piliangfenlei", color:'#fd996b'},
                    {id: 7, name: '批量标记已读', button:'tagRead', iconName:"piliangbiaojiyidu", color:'#72afff'},
                    {id: 4, name: '批量转发', button:'forward', iconName:"piliangzhuanfa", color:'#72afff'},
                    {id: 5, name: '批量邮件删除', button:'mailDelete', iconName:"shanchu1", color:'#fc6769'},
                    {id: 8, name: '批量复制买家邮箱', button:'copyBuyerMail', iconName:"fuzhi", color:'#72afff'},
                    {id: 9, name: '批量复制SKU', button:'copySku', iconName:"fuzhi", color:'#72afff'},
                    {id: 10, name: '批量复制Asin', button:'copyAsin', iconName:"fuzhi", color:'#72afff'},
                    {id: 11, name: '批量复制订单号', button:'copyOrderNum', iconName:"fuzhi", color:'#72afff'},
                    {id: 12, name: '批量分配客服', button:'batchCustomerService', iconName:"piliangfenpeikefu", color:'#72afff'},
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
    activated() {
        // 重置快捷搜索
        if( this.$route.query._cacheType ){
            this.queryData.fast_mail_category = '';
            this.queryData.fast_is_replied = '';
            this.queryData.fast_tag_id = '';
        }
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
                this.queryData = JSON.parse(this.queryParamsInfo['in_box']);
            }
            let obj = {
                fast_mail_category: this.queryData.fast_mail_category,
                fast_is_replied: this.queryData.fast_is_replied,
                fast_tag_id: this.queryData.fast_tag_id,
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
                key: 'in_box',
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

        // 处理复制数据为空的时候
        handleCopyEmpty(str) {
            if( !this.saveCheckInfo.length ){
                this.$message.warning('请先勾选数据！');
                return false;
            }
            if( !str ){
                this.$message.warning('数据为空，无法复制！');
                return false;
            }
            this.$message.success('复制成功！');
        },

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 1:
                    // 批量回复
                    this.batchReply();
                    break;
                case 2:
                    // 批量分类
                    this.batchSort();
                    break;
                case 3:
                    // 批量标签
                    this.batchTag();
                    break;
                case 4:
                    // 转发
                    this.batchForward();
                    break;
                case 5:
                    // 邮件删除
                    this.batchDel();
                    break;
                case 6:
                    // 标星邮件
                    this.batchStar();
                    break;
                case 7:
                    // 标记已读
                    this.batchRead();
                    break;
                case 8:
                    // 复制买家邮箱
                    break;
                case 9:
                    // 复制SKU
                    break;
                case 10:
                    // 复制Asin
                    break;
                case 11:
                    // 复制订单号
                    break;
                case 12:
                    // 批量分配客服
                    this.batchKefu();
                    break;
                case 15:
                    // 标记已回复
                    this.batchTagReply();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 批量回复
        batchReply() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            //
        },

    },
}
</script>
