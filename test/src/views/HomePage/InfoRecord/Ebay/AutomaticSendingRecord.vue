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
                    <el-button size="small" type="text" style='color: #333333 !important;' @click="handleExportData()" v-if="buttonList['export'].permit(thisVm)">
                        <i class="icon-daochu" style="color: #75b1fc;font-size:12px;"></i>导出数据</el-button>
                    <el-button size="small" type="text" style='color: #333333 !important;' @click="open" v-if="buttonList['interceptSend'].permit(thisVm)">
                        <i class="icon-youjianshanchu" style="color: rgb(255, 101, 98);font-size:12px;"></i>拦截发送</el-button>
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
    getListEbay,
    interceptEbay,
} from '../../../../api/InfoRecord/Ebay/AutomaticSendingRecord';
import {getSessionStorage} from '@/utils/storage';

export default {
    name: 'AutomaticSendingRecord',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['序号', '规则名称', '平台账号', '订单号', '触发条件', '关联模板', '发送状态', '订单付款时间', '触发时间', '计划发送时间', '实际发送时间', '发送失败原因'],
            tableProps: ['index', 'rule_name', 'account_name', 'order_id', 'execute_id', 'template_name', 'send_status', 'paytime', 'create_time', 'plan_send_time', 'send_time', 'send_failure_reason'],
            tableWidth: ['80', '', '', '', '', '', '', '', '', '', '', ''],
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
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['automatic_sending_record']);
            }
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
                offset: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                limit: this.pageData.currentList
            };

            this.tableLoading = true;
            getListEbay(obj).then(({data}) => {
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
                key: 'automatic_sending_record',
                value: JSON.stringify(this.queryData)
            });
            this.tableData = data.data_list.values;

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
            this.saveCheckIds = [...new Set(this.saveCheckInfo.map(e => e.id))];
        },
        open() {
            if (!this.saveCheckInfo.length) {
                this.$message.warning('请勾选列表数据')
                return;
            }
            this.$confirm('确认拦截该'+this.saveCheckInfo.length+'条信息吗？', '拦截发送', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.handleInterceptEbay();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消拦截'
                });
            });
        },
        //拦截发送
        handleInterceptEbay(){
            interceptEbay({ids:[...this.saveCheckIds]}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }else{
                    this.$message.success('操作成功')
                    this.handleQueryInfo({}, true);
                }
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },

        //导出
        handleExportData(params = {}, url = '/api/system_set/email_send_record/get_list_ebay?export=1'){
            if(this.pageData.currentTotal>50000){
                this.$message.warning('最多只能导出五万条，请筛选条件后再进行操作！');
                return;
            }
            let obj = {};
            let urlTime = '';
            for (const key in this.queryData.mainQuery) {
                if (this.queryData.mainQuery[key]&&this.queryData.mainQuery[key].length!==0) {
                    if(key!='send_time'&&key!='create_time'&&key!='paytime'&&key!='plan_send_time'){
                        obj[key] = this.queryData.mainQuery[key];
                    }
                }
            }
            params = JSON.parse(getSessionStorage('userInfo'));
            const query = Object.entries(obj).reduce((str, [key, value], idx) => {
                const next = idx === 0 ? `&${key}=${value}` : `&${key}=${value}`;
                return str + next;
            }, '')
            if(this.queryData.mainQuery['paytime']){
                urlTime += '&paytime[]='+this.queryData.mainQuery['paytime'][0]+'&paytime[]='+this.queryData.mainQuery['paytime'][1];
            }else if(this.queryData.mainQuery['create_time']){
                urlTime += '&create_time[]='+this.queryData.mainQuery['create_time'][0]+'&create_time[]='+this.queryData.mainQuery['create_time'][1];
            }else if(this.queryData.mainQuery['plan_send_time']){
                urlTime += '&plan_send_time[]='+this.queryData.mainQuery['plan_send_time'][0]+'&plan_send_time[]='+this.queryData.mainQuery['plan_send_time'][1];
            }else if(this.queryData.mainQuery['create_time']){
                urlTime += '&send_time[]='+this.queryData.mainQuery['send_time'][0]+'&send_time[]='+this.queryData.mainQuery['send_time'][1];
            }
            window.location = url+'&uid='+params.uid+'&staff_code='+params.staff_code+query+urlTime;
        },

    },
}
</script>
