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
                    <el-button size="small" type="text" style='color: #333333 !important;' @click="handleResend(false)" v-if="buttonList['batchReSend'].permit(thisVm)">
                        <i class="icon-zhongxinfasong" style="color: #FF9860;font-size:12px;"></i>批量重发</el-button>
                    <el-button size="small" type="text" style='color: #333333 !important;' @click="handleExportData" v-if="buttonList['exportData'].permit(thisVm)">
                        <i class="icon-daochu" style="color: #75b1fc;font-size:12px;"></i>导出数据</el-button>
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
                    <template slot-scope="scope" slot="send_status">
                        <span class="ui-state_circle grayColor" v-if="scope.row.send_status === '等待发送'"></span>
                        <span class="ui-state_circle greenColor" v-if="scope.row.send_status === '发送成功'"></span>
                        <span class="ui-state_circle redColor" v-if="scope.row.send_status === '发送失败'"></span>
                        <span class="ui-state_circle blueColor" v-if="scope.row.send_status === '发送中'"></span>
                        {{scope.row.send_status}}
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <span>
                            <el-button style="font-size:12px;" type="text" @click="handleResend(scope.row)" :disabled="scope.row.send_status!=='发送失败'"
                                 v-if="buttonList['reSend'].permit(thisVm)">重发</el-button><ComDivide/>
                        </span>
                        <span>
                            <el-button style="font-size:12px;" type="text" @click="handleJournal(scope.row)"
                                 v-if="buttonList['journal'].permit(thisVm)">日志</el-button>
                                <!-- <ComDivide/> -->
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
                        :total="pageData.currentTotal">
                    </el-pagination>
                </div>
            </div>
            <!-- 日志弹框 -->
            <el-dialog width="950px" class="ui-layout_edit-dialog logs" title="日志" :visible.sync="isShowLogShow">
                <ComPreviewTable
                    :isAdaptiveHeight="false"
                    :logKey="['操作日志', '操作人', '操作时间']"
                    :logProps="['behavior', 'created_by_name', 'created_at']"
                    :logData="showLogTableData"
                    :logWidth="['', '180', '180']">
                    <template slot-scope="scope" slot="behavior">
                        <div v-html="scope.row.behavior"></div>
                    </template>
                </ComPreviewTable>
            </el-dialog>
            <!-- 重发 -->
            <el-dialog width="450px" class="ui-layout_edit-dialog logs" :title="titleResend" :visible.sync="isResend">
                <div style="text-align: center;padding: 30px;" v-if="titleResend=='重发'">确定重发这条记录吗？</div>
                <div style="text-align: center;padding: 30px;" v-if="titleResend=='批量重发'">确定重发选中的{{saveCheckInfo.length}}条记录吗？</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isResend=false" size="small">取 消</el-button>
                    <el-button type="primary" @click="handleResendConfirm()" size="small">确 定</el-button>
                </span>
            </el-dialog>
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
    outboxList,
    showLog,
    downloadListEbay,
    reSendBatch,
} from '../../../../api/InfoRecord/Ebay/SendMessageRecord';
import {getSessionStorage} from '@/utils/storage';

export default {
    name: 'EbaySendMessageRecord',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['序号', '平台账号', '主题', '发送内容', '客户ID', '发送消息类型', '发送状态', '发送人', '创建时间', '发送时间', '发送失败原因', '操作'],
            tableProps: ['index', 'account_name', 'subject', 'content', 'buyer_id', 'send_message_type', 'send_status', 'sender', 'create_time', 'send_time', 'send_failure_reason', 'operate'],
            tableWidth: ['80', '130', '180', '230', '100', '90', '90', '100', '140', '140', '230', '120'],
            tableData: [],
            // 表格加载动画
            tableLoading: false,

            // 分页数据
            pageSizes: config.pageDatas.pageSizes,
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

            //日志弹窗
            isShowLogShow:false,
            showLogTableData:[],

            //重发
            isResend:false,
            titleResend:'重发',
            reSendInfo:{},
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
            outboxList(obj).then(({data}) => {
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

        //日志弹窗
        handleJournal(row){
            showLog({id:row.id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return
                }
                this.isShowLogShow = true
                this.showLogTableData = data.data_list.value;
            }).catch(err => {
                console.log(err);
            });
        },

        //导出
        handleExportData(params = {}, url = '/api/emails/mail_outbox/download_list_ebay'){
            if(this.pageData.currentTotal>50000){
                this.$message.warning('最多只能导出五万条，请筛选条件后再进行操作！');
                return;
            }
            let obj = {};
            let urlTime = '';
            for (const key in this.queryData.mainQuery) {
                if (this.queryData.mainQuery[key]&&this.queryData.mainQuery[key].length!==0) {
                    if(key!='send_time'&&key!='create_time'){
                        obj[key] = this.queryData.mainQuery[key];
                    }
                }
            }
            console.log(this.queryData.mainQuery)
            params = JSON.parse(getSessionStorage('userInfo'));
            const query = Object.entries(obj).reduce((str, [key, value], idx) => {
                const next = idx === 0 ? `&${key}=${value}` : `&${key}=${value}`;
                return str + next;
            }, '')
            if(this.queryData.mainQuery['send_time']){
                urlTime += '&send_time[]='+this.queryData.mainQuery['send_time'][0]+'&send_time[]='+this.queryData.mainQuery['send_time'][1];
            }else if(this.queryData.mainQuery['create_time']){
                urlTime += '&create_time[]='+this.queryData.mainQuery['create_time'][0]+'&create_time[]='+this.queryData.mainQuery['create_time'][1];
            }
            window.location = url+'?uid='+params.uid+'&staff_code='+params.staff_code+query+urlTime;
        },

        //重发
        handleResend(row){
            if(!row){
                if (!this.saveCheckInfo.length) {
                    this.$message.warning('请勾选列表数据')
                    return;
                }
                let bool=false;
                this.saveCheckInfo.forEach(element => {
                    if(element.send_status!=='发送失败'){
                        bool=true;
                    }
                });
                if(bool){
                    this.$message.warning('只有发送状态失败的才可以重发！')
                    return;
                }
                this.titleResend = '批量重发';
            }else{
                this.reSendInfo = row;
                this.titleResend = '重发';
            }
            this.isResend = true; 
        },
        handleResendConfirm(){
            let obj ={
                ids:[]
            };
            if(this.titleResend == '重发'){
                obj.ids.push(this.reSendInfo.id);
            }else{
                this.saveCheckInfo.forEach(element => {
                    obj.ids.push(element.id);
                });
            }
            reSendBatch(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess);
                    return
                }else{
                    this.$message.success("操作成功!");
                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                    this.isResend = false;  
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }
}
</script>

<style lang="less" scoped>

</style>