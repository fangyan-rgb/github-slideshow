<style lang="less" scoped>
.EbayOutboxwrap {
    font-size: 12px;
    // .Outboxbox{

    // }
    .savetimeselecta{
        color: #3388ff;
        margin: 0 8px;
        padding: 0 0 1px;
        border-bottom: 2px solid transparent;
        &:hover{
            color: #3388ff;
        }
        &.active{
            color: #3388ff;
            border-color: #3388ff;
        }
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
}

.viewmailwrap{
    font-size: 12px;
    padding-right: 88px;
    max-height: 660px;
    overflow-y: scroll;
    .mailcontitem{
        display: flex;
        margin-bottom: 20px;
        .mailcontiteml{
            color: #71b7fc;
            width: 42px;
            flex: none;
            padding-top: 7px;
            span{
                font-size: 32px;
            }
        }
        .mailcontitemr{
            flex: auto;
            padding-right: 130px;
        }
        .mailcontitemrhead{
            color: #fff;
            padding:  8px 8px 8px 10px;
            background: #71b7fc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .mailcontitemrheadl{
                // height: 40px;
                flex: auto;
                width: 0;
                margin-right: 10px;
                p{
                    /* overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap; */
                    &:first-child{
                        font-size: 14px;
                    }
                }
            }
            .mailcontitemrheadr{
                flex: none;
                span{
                    cursor: pointer;
                }
            }
            .mailcontitemrheadlcen{
                margin: 3px 0;
                .receivespan{
                    display: inline-block;
                    height: 22px;
                    line-height: 22px;
                    padding: 0 10px;
                    background: #fff;
                    border-radius: 3px;
                }
            }
        }
        .mailcontitemrbody{
            border: 1px solid #e6e6e6;
            padding: 5px 9px 0;
            .mailcontitemrbodycont{
                line-height: 1.8;
            }
            .mailcontitemrbodyedit{
                height: 32px;
                display: flex;
                align-items: center;
                a{
                    color: #4a94ff;
                }
                .translate{
                    margin-left: 17px;
                }
                .time{
                    flex: auto;
                    color: #b6b6b6;
                    text-align: right;
                }
            }
        }

        &.myself{
            .mailcontiteml{
                color: #53c68b;
                text-align: right;
                span{
                    margin-right: 0;
                }
            }
            .mailcontitemr{
                order: -1;
                padding-right: 0;
                padding-left: 130px;
            }
            .mailcontitemrhead{
                background: #53c68b;
                .mailcontitemrheadr{
                    span{
                        display: none;
                    }
                }
            }
            .mailcontitemrbody{
                .mailcontitemrbodyedit{
                    .time{
                        order: -1;
                        text-align: left;
                    }
                }
            }
        }
    }
}
</style>

<template>
    <div class="EbayOutboxwrap">
        <div class="Outboxbox">
            <!-- 查询参数 -->
            <div class="ui-main-module">
                <transition name="slide-fade">
                    <div class="ui-search-area" v-show="showSearch">
                        <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo($event, false, true)' @handleResetQueryInfo='handleResetQueryInfo' @handleLoadOk='searchHeight = !searchHeight'></ComSearchCondition>
                    </div>
                </transition>

                <!-- 操作按钮 -->
                <div class="ui-fn-module">
                    <span class="ui-top_i" @click="showSearch = !showSearch">
                        <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
                    </span>
                    <span v-for="item in optionListLabel.batchEditArr">
                        <el-button
                            v-if="buttonList[item.button].permit(thisVm) && ![8].find(e => e === item.id)"
                            @click="batchEditFn(item.id)"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                        <el-button
                            v-if="buttonList[item.button].permit(thisVm) && [8].find(e => e === item.id)"
                            @click="handleCopyEmpty(saveCheckInfo.map(e => {if(item.id === 8){return e.receive_email};}).join(','))"
                            :data-clipboard-text="saveCheckInfo.map(e => {if(item.id === 8){return e.receive_email};}).join(',')"
                            class="copyBtn"
                            size="small"
                            type="text"
                            style='color: #333 !important;'
                            :key="item.id">
                            <i :class="'icon-' + item.iconName" :style="{color: item.color, fontSize: '12px'}"></i>{{item.name}}
                        </el-button>
                    </span>
                    <!-- <el-select v-model="optionListLabel.curBatchEditId" size="small">
                        <el-option
                            v-for="(v, i) in optionListLabel.batchEditArr"
                            :key="i"
                            :label="v.name"
                            v-if="v.button ? buttonList[v.button].permit(thisVm) : true"
                            :value="v.id">
                        </el-option>
                    </el-select>
                    &nbsp;
                    <el-button
                        v-show="![8, 9, 10, 11].find(e => e === optionListLabel.curBatchEditId)"
                        @click="batchEditFn()"
                        size="small"
                        type="primary">
                        批量操作
                    </el-button>
                    <el-button
                        v-show="[8, 9, 10, 11].find(e => e === optionListLabel.curBatchEditId)"
                        @click="handleCopyEmpty(saveCheckInfo.map(e => {if(optionListLabel.curBatchEditId === 8){return e.receive_email};if(optionListLabel.curBatchEditId === 9){return e.SKU};if(optionListLabel.curBatchEditId === 10){return e.SKU};if(optionListLabel.curBatchEditId === 11){return e.order_id};}).join(','))"
                        class="copyBtn"
                        :data-clipboard-text="saveCheckInfo.map(e => {if(optionListLabel.curBatchEditId === 8){return e.receive_email};if(optionListLabel.curBatchEditId === 9){return e.SKU};if(optionListLabel.curBatchEditId === 10){return e.SKU};if(optionListLabel.curBatchEditId === 11){return e.order_id};}).join(',')"
                        size="small"
                        type="primary">
                        批量操作
                    </el-button> -->
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
                        <div v-if="scope.row.send_status === '发送失败'">
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div>{{scope.row.send_failure_reason}}</div>
                                <a href="javascript:;" slot="reference">
                                    <span class="ui-state_circle redColor"></span>
                                    {{scope.row.send_status}}
                                </a>
                            </el-popover>
                        </div>
                        <div v-else>
                            <span class="ui-state_circle orangeColor" v-if="['发送中', '等待发送'].includes(scope.row.send_status)"></span>
                            <span class="ui-state_circle greenColor" v-if="scope.row.send_status === '发送成功'"></span>
                            {{scope.row.send_status}}
                        </div>
                    </template>
                    <template slot-scope="scope" slot="subject">
                        <div>
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div v-html="spaceConversionFn(scope.row.subject)"></div>
                                <a v-html="spaceConversionFn(scope.row.subject)" href="javascript:;" class="ellipsis2" slot="reference"></a>
                            </el-popover>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="send_time">
                        <div>发送时间：{{scope.row.send_time}}</div>
                        <div>创建时间：{{scope.row.create_time}}</div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['modify'].permit(thisVm)" @click="goMailProcessingPage(scope.row)" type="text" size="mini">重发</el-button>
                        <ComDivide v-if="buttonList['modify'].permit(thisVm)"/>
                        <el-button v-if="buttonList['look'].permit(thisVm)" @click="handleViewMail(scope.row)" type="text" size="mini">查看</el-button>
                        <ComDivide v-if="buttonList['look'].permit(thisVm)"/>
                        <el-button v-if="buttonList['diaryLog'].permit(thisVm)" @click="handleOperateDaily(scope.row.id)" type="text" size="mini">日志</el-button>
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
                :isAdaptiveHeight="true"
                :logKey="logInfo.tableKey"
                :logProps="logInfo.tableProps"
                :logData="logInfo.tableData"
                :logWidth="logInfo.tableWidth">
            </ComPreviewTable>
        </el-dialog>

        <!-- 查看邮件 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="查看邮件"
            width="1000px"
            :visible.sync="viewMailObj.dialog">
            <div class="viewmailwrap">
                <div class="mailcontitem myself">
                    <div class="mailcontiteml">

                    </div>
                    <div class="mailcontitemr">
                        <div class="mailcontitemrhead">
                            <div class="mailcontitemrheadl">
                                <p>主题：{{viewMailObj.form.subject}}</p>
                                <div class="mailcontitemrheadlcen">
                                    <div>
                                        {{viewMailObj.form.sender_name}} <span class="el-icon-right"></span> {{viewMailObj.form.receive_name}}　　　发送时间：{{viewMailObj.form.send_time}}
                                    </div>
                                </div>
                            </div>
                            <div class="mailcontitemrheadr">

                            </div>
                        </div>
                        <div class="mailcontitemrbody">
                            <div class="mailcontitemrbodycont">
                                <p v-if="viewMailObj.form.content">翻译前内容：</p>
                                <iframe id="iframea" :srcdoc="viewMailObj.form.content_before" @load="iframeOnload('iframea', viewMailObj.form.content_before)" width="100%" frameborder="0"></iframe>
                                <p v-if="viewMailObj.form.content">翻译后内容：</p>
                                <iframe v-if="viewMailObj.form.content" id="iframeb" :srcdoc="viewMailObj.form.content" @load="iframeOnload('iframeb', viewMailObj.form.content)" width="100%" frameborder="0"></iframe>
                            </div>
                            <div class="mailcontitemrbodyedit">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <el-button @click="viewMailObj.dialog = false" size="small">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import config from '@/assets/js/config';
import {
    getOutboxList,
    getViewMail,
    getLogs,
} from '@/api/MailCenterManagement/Ebay/Outbox';
import routerConfig from '@/router/routerConfig';
import mailConfig from "@/assets/js/mailProcessingConfig";
// 复制到剪贴板功能
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'EbayOutbox',
    data () {
        return {
            searchHeight: false,
            thisVm: this,
            showSearch: true,

            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['平台账号', '发送状态', '邮件主题', '收件人', '收件邮箱', '发送人', '发件邮箱', '发送时间', '操作'],
            tableProps: ['account_name', 'send_status', 'subject', 'receive_name', 'receive_email', 'sender_name', 'sender_email', 'send_time', 'operate'],
            tableWidth: ['120', '120', 'subject', 'receive_name', 'receive_email', 'sender_name', 'sender_email', '210', '150'],
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
                mail_category: '',
                is_replied: '',
                time_type: '',
                mainQuery: {},
            },

            // 查询下拉框数据
            optionList: {

            },
            optionListLabel: {
                curBatchEditId: '',
                batchEditArr: [
                    {id: 14, name: '批量重发',button:'batchModify', iconName:"zhongxinfasong", color:'#fd996b'},
                    {id: 4, name: '批量转发',button:'forward', iconName:"piliangzhuanfa", color:'#72afff'},
                    {id: 8, name: '批量复制收件邮箱',button:'copyBuyerMail', iconName:"fuzhi", color:'#72afff'},
                ],
                fast_mail_category: {},
                is_reply: [],
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
                statusArr: [
                    {key: '-1', name: '失败'},
                    {key: '0', name: '等待发送'},
                    {key: '1', name: '发送中'},
                    {key: '2', name: '成功'},
                ],
            },

            // 平台
            platform: 'Amazon',

            // 日志
            logInfo: {
                tableData: [],
                tableProps: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableWidth: ['', '', ''],
                isShowLog: false,
            },

            // 查看邮件相关
            viewMailObj: {
                dialog: false,
                form: {
                    content: '',
                    content_before: '',
                    receive_name: '',
                    send_time: '',
                    sender_name: '',
                    subject: '',
                },
            },
        }
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
            'OutboxObj'
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    mounted() {
        try{
            if (this.$route.query._cacheType === '1' || JSON.stringify(this.OutboxObj) === '{}') {
                // this.handleQueryInfo();
            }else{
                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo['ebay_out_box']);
                this.handleQueryInfoCallBack(this.OutboxObj);
            }
        }catch (e) {
            console.log(e)
        }

        // 复制到剪贴板功能
        clipboard.on('success', e => {
            // this.$message.success('复制成功！');
            e.clearSelection();
        });

        clipboard.on('error', e => {
            this.$message.error('复制失败！');
        });
    },
    methods: {
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['ebay_out_box']);
            }
            let obj = {
                mail_category: this.queryData.mail_category,
                is_replied: this.queryData.is_replied,
                time_type: this.queryData.time_type,
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
            getOutboxList(obj).then(({data}) => {
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
                key: 'ebay_out_box',
                value: JSON.stringify(this.queryData)
            });
            this.optionList = data.data_list.drop_down_box;
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
                mail_category: '',
                is_replied: '',
                time_type: '',
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

        // 点击平台触发
        handleTabsClick(item) {
            console.log('切换平台',item)
        },

        // 进邮件处理页面之前需要处理
        beforeGoMailProcessingPage(arr, curParams) {
            // 提取列表关键字段方法
            let getInfo = (obj) => {
                return {
                    id: obj.id || '',
                    inbox_id: obj.inbox_id || '',
                    type: 'EbayOutbox',
                };
            };

            // 提取附加信息方法
            let getDesInfo = (obj, originObj) => {
                return {
                    ...obj,
                    out_box: obj.id,
                    after_before_id_list: originObj.after_before_id_list,
                };
            };

            // 提取已有邮件处理列表关键字段方法
            let getNavInfo = (obj) => {
                return {
                    id: obj.id,
                    inbox_id: obj.inbox_id,
                    type: obj.type,
                };
            };

            // queryParamsInfo存储参数和路由对应关系
            let paramsRouterObj = JSON.parse(JSON.stringify(mailConfig.paramsRouterObj));

            // 定义queryParamsInfo存储参数
            let paramsInfoName = curParams;

            // 定义邮件处理页用到的路由、页签名
            let mailProcessRouter = paramsRouterObj[paramsInfoName].routerList;
            let mailProcessRouterName = paramsRouterObj[paramsInfoName].pathName;

            // 获取已有的邮件处理列表
            let mailProcessNavList = JSON.parse(this.queryParamsInfo[paramsInfoName]);

            // 可用的路由列表
            let canUseRouter = mailProcessRouter.filter(e => !mailProcessNavList.map(e => e.routerPath).includes(e));

            // 需要进入的第一封邮件
            let openMail = {};
            // 新增的邮件处理列表
            let marr = [];
            arr.forEach((e, i) => {
                // 提取关键信息
                let n = getInfo(e);
                // 对比关键信息
                let idx = mailProcessNavList.findIndex(e => JSON.stringify(getNavInfo(e)) === JSON.stringify(n));
                // 加入附加信息
                n = getDesInfo(n, e);
                // 如果不存在就加入
                if( idx < 0 ){
                    // 把新加入的给个路由、标签名和queryParamsInfo存储参数
                    n = {...n, routerPath: canUseRouter.shift(), routerPathName: mailProcessRouterName, queryParamsInfo: paramsInfoName};
                    marr.push(n);
                }else{
                    // 如果存在就替换成最新的
                    let deln = mailProcessNavList.splice(idx, 1);
                    n = {...deln[0], ...n};
                    mailProcessNavList.splice(idx, 0, n);
                }
                if( i === 0 ) {
                    openMail = {...n};
                }
            });

            // 合并
            let mergeMailProcessNavList = [...mailProcessNavList, ...marr];

            // 需要打开的邮件数量大于可用路由数量就提示错误
            if( mergeMailProcessNavList.length > mailProcessRouter.length ) {
                this.$message.error(`最多打开 ${mailProcessRouter.length} 封邮件！${mailProcessRouterName} 已有 ${mailProcessNavList.length} 封邮件。`);
                return false;
            }

            // 保存邮件处理列表
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: paramsInfoName,
                value: JSON.stringify(mergeMailProcessNavList)
            });

            // 进邮件处理之前先移除已有的邮件处理标签
            this.$store.commit('SAVE_TAB_LABELS', {
                name: mailProcessRouterName,
                isRemove: 1
            });

            return openMail;
        },
        // 邮件处理页面
        goMailProcessingPage(arr) {
            if( !Array.isArray(arr) ){
                arr = [arr];
            }
            // 处理
            let obj = this.beforeGoMailProcessingPage(arr, 'MailProcessingEbayMail');
            if(!obj) {
                return;
            }
            // 跳转
            this.$router.push({path: obj.routerPath, query: obj});

            // 添加tab标签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: obj.routerPath,
                name: obj.routerPathName,
                index: obj.routerPath,
                query: obj
            });
            this.$store.commit('SAVE_NAV_INDEX', obj.routerPath);
        },

        // 日志
        handleOperateDaily(id){
            getLogs({
                id,
                limit: 1000,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                if (data.data_list.value) {
                    this.logInfo.tableData = data.data_list.value;
                    this.logInfo.tableProps = ['behavior', 'created_by_name', 'created_at'];
                }
                this.logInfo.isShowLog = true;
            }).catch(error => {

            });
        },

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 4:
                    // 批量转发
                    this.batchForward();
                    break;
                case 14:
                    // 批量重发
                    this.batchEdit();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },
        // 批量转发
        batchForward() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            if( this.saveCheckInfo.length !== 1 ) {
                this.$message.warning('只能选一条数据！');
                return false;
            }
            let path = '/EbayPostMail';
            let query = {id: this.saveCheckInfo.map(e => e.id).join(','), type: 'EbayOutbox', goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
            this.$router.push({path, query});

            this.changeNavShowFn(path, query);
        },
        changeNavShowFn(path, query = {}) {
            query = query || {};
            let idx = routerConfig.getRouteIndex(path);
            let to = routerConfig.navJumpFn(idx);
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name: to.name,
                index: idx,
                query
            });
            this.$store.commit('SAVE_NAV_INDEX', idx);
        },
        // 批量重发
        batchEdit() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.goMailProcessingPage(this.saveCheckInfo);
        },

        handleViewMail(row) {
            this.viewMailObj.dialog = true;
            getViewMail({id: row.id}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.viewMailObj.form = {...data.data_list.value};
            }).catch(err => {
                console.log(err);
            });
        },

        // iframe自适应内容高度
        iframeOnload(id, v) {
            if( !/^\s*<\/?[^>]*>/g.test(v) ){
                document.getElementById(id).contentWindow.document.body.style.whiteSpace = 'pre-wrap';
            }
            document.getElementById(id).contentWindow.document.body.style.fontSize = '14px';
            document.getElementById(id).height = 0;
            document.getElementById(id).height = document.getElementById(id).contentWindow.document.body.scrollHeight + 33;
        },

        // 把空格替换
        spaceConversionFn(v) {
            return v ? v.replace(/\s/g, '&nbsp;') : '';
        }
    },
}
</script>
