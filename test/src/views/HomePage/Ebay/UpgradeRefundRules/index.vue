<style lang="less" scoped>

</style>

<template>
    <div class="EbayUpgradeRefundRuleswrap">
        <div class="EbayUpgradeRefundRulesbox">

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
                            v-if="1 || buttonList[item.button].permit(thisVm)"
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
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['edit'].permit(thisVm)" @click="handleEditFn(scope.row)" type="text" size="mini">编辑</el-button>
                        <ComDivide v-if="buttonList['edit'].permit(thisVm)"/>
                        <el-button v-if="buttonList['open'].permit(thisVm) && scope.row.status == '2'" @click="handleOpenStopFn(scope.row.id, 1)" type="text" size="mini">启用</el-button>
                        <ComDivide v-if="buttonList['open'].permit(thisVm) && scope.row.status == '2'"/>
                        <el-button v-if="buttonList['stop'].permit(thisVm) && scope.row.status == '1'" @click="handleOpenStopFn(scope.row.id, 2)" type="text" size="mini">停用</el-button>
                        <ComDivide v-if="buttonList['stop'].permit(thisVm) && scope.row.status == '1'"/>
                        <el-button v-if="buttonList['log'].permit(thisVm)" @click="handleLogFn(scope.row.id)" type="text" size="mini">日志</el-button>
                    </template>
                    <template slot-scope="scope" slot="status_text">
                        <div>
                            <span class="ui-state_circle greenColor" v-if="scope.row.status === '1'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.status === '2'"></span>
                            {{scope.row.status_text}}
                        </div>
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
                :isAdaptiveHeight="false"
                :logKey="logInfo.tableKey"
                :logProps="logInfo.tableProps"
                :logData="logInfo.tableData"
                :logWidth="logInfo.tableWidth">
            </ComPreviewTable>
        </el-dialog>

        <!-- 默认规则 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="默认规则"
            :visible.sync="defaultRuleObj.dialog"
            width="500px">
            <el-form :model="defaultRuleObj.form" :rules="formRules" ref="defaultRuleObjForm" label-width="80px" size="small">
                <el-form-item label="全球：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount">
                                <el-input v-model="defaultRuleObj.form.claim_amount" placeholder="请输入">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="英国：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount_en">
                                <el-input v-model="defaultRuleObj.form.claim_amount_en" placeholder="请输入">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="美国：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount_us">
                                <el-input v-model="defaultRuleObj.form.claim_amount_us" placeholder="请输入">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="德国：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount_de">
                                <el-input v-model="defaultRuleObj.form.claim_amount_de" placeholder="请输入">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="defaultRuleObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleDefaultRuleConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="修改规则"
            :visible.sync="editRuleObj.dialog"
            width="500px">
            <el-form :model="editRuleObj.form" :rules="formRules" ref="editRuleObjForm" label-width="80px" size="small">
                <el-form-item label="当前账号：">
                    <div>{{editRuleObj.account_name}}</div>
                </el-form-item>
                <el-form-item label="规则类型：">
                    <el-radio-group v-model="editRuleObj.form.type" @change="changeEditRuleObjtype">
                        <el-radio label="1">默认规则</el-radio>
                        <el-radio label="2">自定义规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="启用状态：">
                    <el-radio-group v-model="editRuleObj.form.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="2">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全球：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount">
                                <el-input v-model="editRuleObj.form.claim_amount" placeholder="请输入" :disabled="editRuleObj.form.type == '1'">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="英国：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount_en">
                                <el-input v-model="editRuleObj.form.claim_amount_en" placeholder="请输入" :disabled="editRuleObj.form.type == '1'">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="美国：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount_us">
                                <el-input v-model="editRuleObj.form.claim_amount_us" placeholder="请输入" :disabled="editRuleObj.form.type == '1'">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="德国：">
                    <el-row>
                        <el-col :span="8">
                            <div style="font-size: 12px; padding-left: 30px;">最大退款金额</div>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item prop="claim_amount_de">
                                <el-input v-model="editRuleObj.form.claim_amount_de" placeholder="请输入" :disabled="editRuleObj.form.type == '1'">
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editRuleObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleEditRuleConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>
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
    changeRuleStatus,
    getLogs,
    setDefaultRule,
    editRule,
    getDefaultRule,
} from '@/api/Ebay/UpgradeRefundRules';

export default {
    name: 'EbayUpgradeRefundRules',
    data () {
        var checkFloat = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('不能为空'));
            }
            if( !/^[1-9]+\d*(\.\d{0,2})?$|^0?\.\d{0,2}$|^0$/.test(value) ) {
                callback(new Error('输入整数或保留两位小数'));
            }else{
                callback();
            }
        };
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['平台账号', '账号简称', '全球', '美国', '德国', '英国', '规则类型', '启用状态', '修改人', '修改时间', '操作'],
            tableProps: ['account_name', 'account_short_name', 'claim_amount', 'claim_amount_us', 'claim_amount_de', 'claim_amount_en', 'type_text', 'status_text', 'modify_by', 'modify_time', 'operate'],
            tableWidth: ['account_name', 'account_short_name', 'claim_amount', 'claim_amount_us', 'claim_amount_de', 'claim_amount_en', 'type_text', 'status_text', 'modify_by', '140', '150'],
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
                    {id: 1, name: '默认规则', button:'defRule', iconName:"morenguize", color:'#ba86ef'},
                    {id: 2, name: '批量启用', button:'batchOpen', iconName:"piliangqiyong", color:'#ff9860'},
                    {id: 3, name: '批量停用', button:'batchStop', iconName:"piliangtingyong", color:'#ff5e5b'},
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

            formRules:{
                claim_amount: [
                    { validator: checkFloat, trigger: 'blur' }
                ],
                claim_amount_en: [
                    { validator: checkFloat, trigger: 'blur' }
                ],
                claim_amount_us: [
                    { validator: checkFloat, trigger: 'blur' }
                ],
                claim_amount_de: [
                    { validator: checkFloat, trigger: 'blur' }
                ],
            },

            // 日志相关
            logInfo: {
                tableData: [],
                tableProps: [],
                tableKey: ['操作事项', '操作人', '操作时间'],
                tableWidth: ['', '', ''],
                isShowLog: false,
            },

            // 默认规则
            defaultRuleObj: {
                dialog: false,
                form: {
                    id: '',
                    claim_amount: '',
                    claim_amount_en: '',
                    claim_amount_us: '',
                    claim_amount_de: '',
                },
            },

            // 默认规则数值
            defaultDataObj: {
                isGet: false,
                form: {
                    claim_amount: '',
                    claim_amount_en: '',
                    claim_amount_us: '',
                    claim_amount_de: '',
                },
            },

            // 编辑规则
            editRuleObj: {
                dialog: false,
                account_name: '',
                form: {
                    id: '',
                    type: '2',
                    status: '1',
                    claim_amount: '',
                    claim_amount_en: '',
                    claim_amount_us: '',
                    claim_amount_de: '',
                },
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
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_UpgradeRefundRules']);
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
                key: 'Ebay_UpgradeRefundRules',
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

        // 批量操作
        batchEditFn(id) {
            id = id || this.optionListLabel.curBatchEditId;
            switch (id) {
                case 1:
                    // 默认规则
                    this.batchDefaultRule();
                    break;
                case 2:
                    // 批量启用
                    this.batchOpen();
                    break;
                case 3:
                    // 批量停用
                    this.batchStop();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 获取默认规则数值
        getDefaultDataFn() {
            return new Promise((resolve, reject) => {
                if( !this.defaultDataObj.isGet ) {
                    this.defaultDataObj.isGet = true;
                    getDefaultRule({form: this.defaultRuleObj.form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            reject(new Error('接口请求错误！'));
                            return;
                        }
                        this.defaultDataObj.form = data.data_list.value;
                        resolve(data.data_list.value);
                    }).catch(error => {
                        reject(new Error('接口请求错误！'));
                    });
                }else{
                    reject(new Error('已获取过默认值！'));
                }
            });
        },

        // 默认规则
        batchDefaultRule() {
            this.defaultRuleObj.dialog = true;
            this.defaultRuleObj.form = {
                claim_amount: '',
                claim_amount_en: '',
                claim_amount_us: '',
                claim_amount_de: '',
            };
            this.$nextTick(() => {
                this.$refs.defaultRuleObjForm.clearValidate();
            });
            this.getDefaultDataFn().then(value => {
                this.defaultRuleObj.form = value;
            }, error => {
                this.defaultRuleObj.form = {...this.defaultDataObj.form};
            });
        },
        handleDefaultRuleConfirm() {
            this.$refs.defaultRuleObjForm.validate((valid) => {
                if (valid) {
                    setDefaultRule(this.defaultRuleObj.form).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.defaultRuleObj.dialog = false;
                        this.defaultDataObj.form = {...this.defaultRuleObj.form};
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                }
            });
        },


        // 批量启用
        batchOpen() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.$confirm('是否将所选 ' + this.saveCheckInfo.length + ' 条规则改为启用状态？', '批量启用', {
                type: 'warning'
            }).then(() => {
                this.changeRuleStatusFn({id: this.saveCheckIds.split(','), status: 1});
            }).catch(() => {

            });
        },

        // 批量停用
        batchStop() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.$confirm('是否将所选 ' + this.saveCheckInfo.length + ' 条规则改为停用状态？', '批量停用', {
                type: 'warning'
            }).then(() => {
                this.changeRuleStatusFn({id: this.saveCheckIds.split(','), status: 2});
            }).catch(() => {

            });
        },

        changeRuleStatusFn({id, status}) {
            changeRuleStatus({
                id,
                status,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.handleOperationCallBack(data);
            }).catch(err => {
                console.log(err);
            });
        },

        // 启用停用
        handleOpenStopFn(id, status) {
            let str = status == 1 ? '启用' : '停用';
            this.$confirm('是否' + str + '此规则？', str, {
                type: 'warning'
            }).then(() => {
                this.changeRuleStatusFn({id, status});
            }).catch(() => {

            });
        },

        // 日志
        handleLogFn(id) {
            getLogs({
                id,
            }).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.logInfo.isShowLog = true;
                if (data.data_list.value) {
                    this.logInfo.tableData = data.data_list.value;
                    this.logInfo.tableProps = ['action', 'operator', 'create_time'];
                }
            }).catch(error => {

            });
        },

        // 编辑
        handleEditFn(row) {
            // 编辑规则
            this.editRuleObj.dialog = true;
            this.$nextTick(() => {
                this.$refs.editRuleObjForm.clearValidate();
            });
            this.editRuleObj.account_name = row.account_name;
            this.editRuleObj.form = {
                id: row.id,
                type: row.type,
                status: row.status,
                claim_amount: row.claim_amount,
                claim_amount_en: row.claim_amount_en,
                claim_amount_us: row.claim_amount_us,
                claim_amount_de: row.claim_amount_de,
            };
            this.changeEditRuleObjtype(row.type);
        },
        handleEditRuleConfirm() {
            this.$refs.editRuleObjForm.validate((valid) => {
                if (valid) {
                    editRule({form: this.editRuleObj.form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.editRuleObj.dialog = false;
                        this.handleOperationCallBack(data);
                    }).catch(error => {

                    });
                }
            });
        },
        changeEditRuleObjtype(v) {
            if( v == '1' ){
                this.getDefaultDataFn().then(value => {
                    this.editRuleObj.form = {
                        ...this.editRuleObj.form,
                        ...value,
                    };
                }, error => {
                    this.editRuleObj.form = {
                        ...this.editRuleObj.form,
                        ...this.defaultDataObj.form,
                    };
                });
            }
        },
    },
}
</script>
