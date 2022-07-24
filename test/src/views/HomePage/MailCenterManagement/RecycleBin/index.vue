<style lang="less" scoped>
.RecycleBinwrap {
    font-size: 12px;
    // .RecycleBinbox{

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
}
</style>

<template>
    <div class="RecycleBinwrap">
        <div class="RecycleBinbox">
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
                    <el-button v-if="buttonList['batchRestore'].permit(thisVm)" size="small" type="text" @click="handelResetItemFn()"><i class="icon-huifu" style="color: #75b1fc"></i>批量恢复</el-button>
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
                    <template slot-scope="scope" slot="receive_name">
                        <div>{{scope.row.receive_name}}</div>
                        <div>{{scope.row.receive_email}}</div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['restore'].permit(thisVm)" @click="handelResetItemFn(scope.row)" type="text" size="mini">恢复</el-button>
                        <ComDivide v-if="buttonList['restore'].permit(thisVm)"/>
                        <el-button v-if="buttonList['diaryLog'].permit(thisVm)" @click="handleOperateDaily(scope.row.id, scope.row.point)" type="text" size="mini">日志</el-button>
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
    resetRecycleBinList,
    getLogs,
} from '@/api/MailCenterManagement/RecycleBin';

export default {
    name: 'RecycleBin',
    data () {
        return {
            searchHeight: false,
            thisVm: this,
            showSearch: true,

            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['销售账号', '订单号', '标题', '客户ID/邮箱', '删除前位置', '删除时间', '操作'],
            tableProps: ['account_name', 'order_id', 'subject', 'receive_name', 'point_name', 'deleted_time', 'operate'],
            tableWidth: ['120', '240', 'subject', 'receive_name', '120', '140', '130'],
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
                point: {},
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
        }
    },
    computed: {
        ...mapGetters([
            'queryParamsInfo',
            'RecycleBinObj'
        ]),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    mounted() {
        try{
            if (this.$route.query._cacheType === '1' || JSON.stringify(this.RecycleBinObj) === '{}') {
                // this.handleQueryInfo();
            }else{
                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo['recycle_bin']);
                this.handleQueryInfoCallBack(this.RecycleBinObj);
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
    },
    methods: {
        ...mapActions([
            'GetRecycleBinList',
        ]),

        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            if (isSave) {
                this.queryData = JSON.parse(this.queryParamsInfo['recycle_bin']);
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
            this.GetRecycleBinList(obj).then(({data}) => {
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
                key: 'recycle_bin',
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

        // 点击平台触发
        handleTabsClick(item) {
            console.log('切换平台',item)
        },

        // 日志
        handleOperateDaily(id, point){
            getLogs({
                id,
                limit: 1000,
                point,
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

        handelResetItemFn(row) {
            let ids;
            let points;
            if( row ){
                ids = row.id;
                points = row.point;
            }else{
                if( !this.saveCheckInfo.length ) {
                    this.$message.warning('请先勾选数据！');
                    return false;
                }
                ids = this.saveCheckInfo.map(e => e.id).join(',');
                points = this.saveCheckInfo.map(e => e.point).join(',');
            }
            this.$confirm('确认恢复邮件?', '提示', {
                type: 'warning'
            }).then(() => {
                resetRecycleBinList({id: ids, point: points}).then(({data}) => {
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
    },
}
</script>
