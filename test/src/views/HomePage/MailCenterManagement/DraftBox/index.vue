<style lang="less" scoped>
.DraftBoxwrap {
    font-size: 12px;
    // .DraftBoxbox{

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
</style>

<template>
    <div class="DraftBoxwrap">
        <div class="DraftBoxbox">
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
                            @click="handleCopyEmpty(saveCheckInfo.map(e => {if(item.id === 8){return e.receive_email};if(item.id === 9){return e.SKU};if(item.id === 10){return e.SKU};if(item.id === 11){return e.order_id};}).join(','))"
                            :data-clipboard-text="saveCheckInfo.map(e => {if(item.id === 8){return e.receive_email};if(item.id === 9){return e.SKU};if(item.id === 10){return e.SKU};if(item.id === 11){return e.order_id};}).join(',')"
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
                    <template slot-scope="scope" slot="order_id">
                        <div>系统订单号：{{scope.row.order_id}}</div>
                        <div>平台订单号：{{scope.row.platform_order_id}}</div>
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
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['modify'].permit(thisVm)" @click="handleEdit(scope.row)" type="text" size="mini">修改</el-button>
                        <ComDivide v-if="buttonList['modify'].permit(thisVm)"/>
                        <el-button v-if="buttonList['send'].permit(thisVm)" @click="handleSendFn(scope.row)" type="text" size="mini">直接发送</el-button>
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
} from 'vuex'
import config from '@/assets/js/config';
import {
    getDropDownBoxList,
    delDraftBoxList,
    sendDraftBoxList,
} from '@/api/MailCenterManagement/DraftBox';
import routerConfig from '@/router/routerConfig';
import mailConfig from "@/assets/js/mailProcessingConfig";
// 复制到剪贴板功能
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');

export default {
    name: 'DraftBox',
    data () {
        return {
            searchHeight: false,
            thisVm: this,
            showSearch: true,

            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['销售账号', '订单号', '标题', '客户ID', '收件人邮箱', '添加时间', '操作'],
            tableProps: ['account_name', 'order_id', 'subject', 'receive_name', 'receive_email', 'create_time', 'operate'],
            tableWidth: ['120', '240', 'subject', 'receive_name', 'receive_email', '140', '155'],
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
                    {id: 13, name: '批量发送', button:'lineSend', iconName:"piliangfasong", color:'#fd996b'},
                    {id: 14, name: '批量修改', button:'batchModify', iconName:"bianjihexiugai", color:'#72afff'},
                    {id: 11, name: '批量复制订单号', button:'copyOrderNum', iconName:"fuzhi", color:'#72afff'},
                    {id: 8, name: '批量复制买家邮箱', button:'copyBuyerMail', iconName:"fuzhi", color:'#72afff'},
                    {id: 5, name: '批量删除', button:'delete', iconName:"shanchu1", color:'#fc6769'},
                    {id: 4, name: '批量转发', button:'forward', iconName:"piliangzhuanfa", color:'#72afff'},
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
                kefuList: {},
            },

            platform: 'Amazon'
        }
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
            'DraftBoxObj'
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    mounted() {
        try{
            if (this.$route.query._cacheType === '1' || JSON.stringify(this.DraftBoxObj) === '{}') {
                // this.handleQueryInfo();
            }else{
                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo['draft_box']);
                this.handleQueryInfoCallBack(this.DraftBoxObj);
            }
        }catch (e) {
            console.log(e)
        }

        // 获取搜索下拉框的值
        getDropDownBoxList().then(({data}) => {
            if (data.status !== 1) {
                this.$message.error(data.errorMess || '操作失败')
                return;
            }
            this.optionListLabel = {...this.optionListLabel, ...data.data_list};
        }).catch(err => {
            console.log(err);
        });

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
        ...mapActions([
            'GetDraftBoxList',
        ]),

        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['draft_box']);
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
            this.GetDraftBoxList(obj).then(({data}) => {
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
                key: 'draft_box',
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

        handleEdit(row) {
            if( row.inbox_id > 0 ){
                this.goMailProcessingPage(row);
            }else{
                let path = '/PostMail';
                let query = {id: row.id, type: 'DraftBox', goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
                this.$router.push({path, query});

                this.changeNavShowFn(path, query);
            }
        },

        // 进邮件处理页面之前需要处理
        beforeGoMailProcessingPage(arr, curParams) {
            // 提取列表关键字段方法
            let getInfo = (obj) => {
                return {
                    inbox_id: obj.id || '',
                    account_id: obj.account_id || '',
                    order_id: obj.order_id || '',
                    buyer_id: obj.buyer_id || '',
                };
            };

            // 提取附加信息方法
            let getDesInfo = (obj, originObj) => {
                // 处理需要发送的搜索参数
                let data = JSON.parse(this.queryParamsInfo['draft_box'] || '{}');
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
                datastr = {
                    ...datastr,
                    page: this.pageData.currentPage,
                    limit: this.pageData.currentList
                };
                return {
                    ...obj,
                    buyer_email: originObj.receive_email,
                    after_before_id_list: originObj.after_before_id_list,
                    point: 'draftbox',
                    type: 'DraftBox',
                    draft_box: obj.inbox_id,
                    email_cate_id: originObj.email_cate_id,
                    input_draftbox: JSON.stringify(datastr),
                };
            };

            // 提取已有邮件处理列表关键字段方法
            let getNavInfo = (obj) => {
                return {
                    inbox_id: obj.inbox_id,
                    account_id: obj.account_id,
                    order_id: obj.order_id,
                    buyer_id: obj.buyer_id,
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
            let intoStr = 'MailProcessingList';
            let setArr = [...new Set(arr.map(e => e.email_cate_id))];
            // 1 客户邮件  2 客户纠纷   要么全是1  要么全是2
            // 有 1 的数量
            let setArr1 = setArr.filter(e => e == '1').length;
            // 有 2 的数量
            let setArr2 = setArr.filter(e => e == '2').length;

            if( setArr1 > 0 ) {
                if( setArr1 == setArr.length ){
                    intoStr = 'MailProcessingListMessage';
                }else{
                    this.$message.error('请筛选数据，勾选相同邮件类型的邮件进行批量打开！');
                    return;
                }
            }

            if( setArr2 > 0 ) {
                if( setArr2 == setArr.length ){
                    intoStr = 'MailProcessingListDispute';
                }else{
                    this.$message.error('请筛选数据，勾选相同邮件类型的邮件进行批量打开！');
                    return;
                }
            }

            let obj = this.beforeGoMailProcessingPage(arr, intoStr);
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

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 4:
                    // 转发
                    this.batchForward();
                    break;
                case 5:
                    // 邮件删除
                    this.batchDel();
                    break;
                case 13:
                    // 直接发送
                    this.handleSendFn();
                    break;
                case 14:
                    // 修改
                    this.batchEdit();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },
        // 转发
        batchForward() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            if( this.saveCheckInfo.length !== 1 ) {
                this.$message.warning('只能选一条数据！');
                return false;
            }
            let path = '/PostMail';
            let query = {id: this.saveCheckInfo.map(e => e.id).join(','), type: 'DraftBox', goBackUrl: JSON.stringify({path: this.$route.path, query: this.$route.query})};
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
        // 批量删除
        batchDel() {
            this.handleDelItemFn();
        },
        // 批量修改
        batchEdit() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.goMailProcessingPage(this.saveCheckInfo);
        },

        handleDelItemFn() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            let ids = this.saveCheckInfo.map(e => e.id).join(',');
            this.$confirm('确认删除?', '提示', {
                type: 'warning'
            }).then(() => {
                delDraftBoxList({id: ids}).then(({data}) => {
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

        handleSendFn(row) {
            let ids;
            if( row ){
                ids = row.id;
            }else{
                if( !this.saveCheckInfo.length ) {
                    this.$message.warning('请先勾选数据！');
                    return false;
                }
                ids = this.saveCheckInfo.map(e => e.id).join(',');
            }
            this.$confirm('确认直接发送?', '提示', {
                type: 'warning'
            }).then(() => {
                sendDraftBoxList({id: ids}).then(({data}) => {
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

        // 把空格替换
        spaceConversionFn(v) {
            return v ? v.replace(/\s/g, '&nbsp;') : '';
        }
    }
}
</script>
