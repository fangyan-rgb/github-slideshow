<style lang="less" scoped>
.ui-layout_edit-dialog{
    .el-select{
        /deep/ .el-input{
            width: 100%;
        }
    }
}
</style>

<template>
    <div class="EbayMessageFilterwrap">
        <div class="EbayMessageFilterbox">

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
                            v-if="buttonList[item.button].permit(thisVm)"
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
                    <template slot-scope="scope" slot="condition">
                        <div v-if="scope.row.condition && scope.row.condition.buyer_id">
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div v-html="scope.row.condition.buyer_id" style="max-height: 400px; overflow-y: auto;"></div>
                                <a v-html="'客户ID：' + scope.row.condition.buyer_id" href="javascript:;" class="ellipsis2" slot="reference"></a>
                            </el-popover>
                        </div>
                        <div v-if="scope.row.condition && scope.row.condition.subject">
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div v-html="scope.row.condition.subject" style="max-height: 400px; overflow-y: auto;"></div>
                                <a v-html="'主题：' + scope.row.condition.subject" href="javascript:;" class="ellipsis2" slot="reference"></a>
                            </el-popover>
                        </div>
                        <div v-if="scope.row.condition && scope.row.condition.content">
                            <el-popover
                                placement="top"
                                width="260"
                                trigger="hover">
                                <div v-html="scope.row.condition.content" style="max-height: 400px; overflow-y: auto;"></div>
                                <a v-html="'正文：' + scope.row.condition.content" href="javascript:;" class="ellipsis2" slot="reference"></a>
                            </el-popover>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="result_option_list">
                        <div>
                            <p v-if="v.checked" v-for="v in scope.row.result_option_list">
                                {{v.name}}
                                <span v-if="v.children && v.children.length">
                                    ：{{v.children.filter(e => e.checked).map(e => e.name).join('、')}}
                                </span>
                            </p>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="status_text">
                        <div>
                            <span class="ui-state_circle greenColor" v-if="scope.row.status === '1'"></span>
                            <span class="ui-state_circle redColor" v-if="scope.row.status === '2'"></span>
                            {{scope.row.status_text}}
                        </div>
                    </template>
                    <template slot-scope="scope" slot="operate">
                        <el-button v-if="buttonList['edit'].permit(thisVm)" @click="handleEditFn(scope.row)" type="text" size="mini">编辑</el-button>
                        <ComDivide v-if="buttonList['edit'].permit(thisVm)"/>
                        <el-button v-if="buttonList['del'].permit(thisVm)" @click="handleDel(scope.row.id)" type="text" size="mini">删除</el-button>
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

        <!-- 新增、编辑 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            title="过滤规则"
            :visible.sync="addItemObj.dialog"
            width="630px">
            <el-form :model="addItemObj.form" :rules="formRules" ref="addItemObjForm" label-width="80px" size="small">
                <el-form-item prop="rule_name" label="规则名称：">
                    <el-input v-model="addItemObj.form.rule_name" placeholder="请输入" maxlength="50" show-word-limit class="showwordlimitipt" style="width: 390px;"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="启用状态：">
                    <el-radio-group v-model="addItemObj.form.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="2">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="客户ID：">
                    <el-row>
                        <el-col :span="19">
                            <el-form-item>
                                <el-input v-model="addItemObj.form.condition.buyer_id" placeholder="请输入，多个请用英文逗号 ',' 隔开" maxlength="20" show-word-limit class="showwordlimitipt" style="width: 390px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-select v-model="addItemObj.form.condition.buyer_id_include" placeholder="请选择" style="width: 90px;">
                                <el-option label="包含" value="1"></el-option>
                                <el-option label="不包含" value="2"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="主题：">
                    <el-row>
                        <el-col :span="19">
                            <el-form-item>
                                <el-input v-model="addItemObj.form.condition.subject" type="textarea" :rows="5" placeholder="请输入，多个请用英文逗号 ',' 隔开" maxlength="10000" show-word-limit style="width: 390px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-select v-model="addItemObj.form.condition.subject_include" placeholder="请选择" style="width: 90px;">
                                <el-option label="包含" value="1"></el-option>
                                <el-option label="不包含" value="2"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="正文：">
                    <el-row>
                        <el-col :span="19">
                            <el-form-item>
                                <el-input v-model="addItemObj.form.condition.content" type="textarea" :rows="5" placeholder="请输入，多个请用英文逗号 ',' 隔开" maxlength="10000" show-word-limit style="width: 390px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-select v-model="addItemObj.form.condition.content_include" placeholder="请选择" style="width: 90px;">
                                <el-option label="包含" value="1"></el-option>
                                <el-option label="不包含" value="2"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item prop="result" label="执行结果：">
                    <el-row>
                        <el-col :span="15">
                            <el-checkbox v-model="addItemObj.form.result[0].id" :label="1">标记已读</el-checkbox>
                            <el-checkbox v-model="addItemObj.form.result[1].id" :label="2">标记已回复</el-checkbox>
                            <el-checkbox v-model="addItemObj.form.result[2].id" :label="3">自动分类</el-checkbox>
                        </el-col>
                        <el-col :span="9">
                            <el-select v-model="addItemObj.form.category" placeholder="请选择" clearable style="width: 150px;">
                                <el-option v-for="(v, k, i) in optionListLabel.categoryList" :value="k" :label="v" :key="i"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addItemObj.dialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleAddItemConfirm()" size="small">确 定</el-button>
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
    delItem,
    addItem,
    updateItem,
    getCategoryOptionList,
} from '@/api/Ebay/EbayMessageFilter';

export default {
    name: 'EbayMessageFilter',
    data () {
        return {
            thisVm: this,
            showSearch: true,
            searchHeight: false,
            // 时间搜索框宽度设置
            searchDateWidth: config.SEARCH_DATE_WIDTH,

            // 表格数据
            tableKey: ['规则名称', '条件值', '结果值', '启用状态', '创建人', '创建时间', '修改人', '修改时间', '操作'],
            tableProps: ['rule_name', 'condition', 'result_option_list', 'status_text', 'create_by', 'create_time', 'modify_by', 'modify_time', 'operate'],
            tableWidth: ['rule_name', 'condition', 'result_option_list', 'status_text', 'create_by', 'create_time', 'modify_by', 'modify_time', '100'],
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
                    {id: 1, name: '新增', button:'add', iconName:"xinzeng1", color:'#72afff'},
                    {id: 2, name: '批量删除', button:'batchDel', iconName:"shanchu1", color:'#ff6562'},
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
                categoryList: {},
            },

            formRules:{
                rule_name: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                result: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },

            // 新增、编辑相关
            addItemObj: {
                dialog: false,
                form: {
                    id: '',
                    status: '1',
                    rule_name: '',
                    condition: {
                        buyer_id: '',
                        buyer_id_include: '1',
                        subject: '',
                        subject_include: '1',
                        content: '',
                        content_include: '1',
                    },
                    result: {
                        0: {
                            id: [],
                            checked: '',
                        },
                        1: {
                            id: [],
                            checked: '',
                        },
                        2: {
                            id: [],
                            checked: '',
                        },
                    },
                    category: '',
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
                this.queryData = JSON.parse(this.queryParamsInfo['Ebay_MessageFilter']);
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
                key: 'Ebay_MessageFilter',
                value: JSON.stringify(this.queryData)
            });

            data.data_list.value.forEach(e => {
                e.condition = JSON.parse(e.condition);
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
                    // 新增
                    this.batchAdd();
                    break;
                case 2:
                    // 批量删除
                    this.batchDel();
                    break;
                default:
                    this.$message.warning('未选中操作！');
                    break;
            }
        },

        // 新增
        batchAdd() {
            this.addItemObj.dialog = true;
            this.$nextTick(() => {
                this.$refs.addItemObjForm.clearValidate();
            });
            this.addItemObj.form = {
                id: '',
                status: '1',
                rule_name: '',
                condition: {
                    buyer_id: '',
                    buyer_id_include: '1',
                    subject: '',
                    subject_include: '1',
                    content: '',
                    content_include: '1',
                },
                result: {
                    0: {
                        id: [],
                        checked: '',
                    },
                    1: {
                        id: [],
                        checked: '',
                    },
                    2: {
                        id: [],
                        checked: '',
                    },
                },
                category: '',
            };
            this.handleGetCategoryOptionList();
        },
        handleAddItemConfirm() {
            this.$refs.addItemObjForm.validate((valid) => {
                if (valid) {
                    // 数据处理
                    let form = JSON.parse(JSON.stringify(this.addItemObj.form));
                    // 执行结果必选一项
                    if( !form.result[0].id.length && !form.result[1].id.length && !form.result[2].id.length ){
                        this.$message.warning('请选择执行结果！');
                        return;
                    }
                    if( form.result[0].id.length ){
                        form.result[0].id = form.result[0].id[0];
                        form.result[0].checked = form.result[0].id;
                    }else{
                        delete form.result[0];
                    }

                    if( form.result[1].id.length ){
                        form.result[1].id = form.result[1].id[0];
                        form.result[1].checked = form.result[1].id;
                    }else{
                        delete form.result[1];
                    }

                    if( form.result[2].id.length ){
                        if( !form.category ){
                            this.$message.warning('请选择分类！');
                            return;
                        }
                        form.result[2].id = form.result[2].id[0];
                        form.result[2].checked = form.category;
                    }else{
                        delete form.result[2];
                    }

                    let fn = addItem;
                    if( form.id ){
                        fn = updateItem;
                    }
                    fn({form}).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.addItemObj.dialog = false;
                        this.handleOperationCallBack(data);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        },
        handleGetCategoryOptionList() {
            if( !Object.keys(this.optionListLabel.categoryList).length ){
                getCategoryOptionList().then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.optionListLabel.categoryList = data.data_list.value;
                }).catch(err => {

                });
            }
        },

        // 批量删除
        batchDel() {
            if( !this.saveCheckInfo.length ) {
                this.$message.warning('请先勾选数据！');
                return false;
            }
            this.$confirm('是否将所选 ' + this.saveCheckInfo.length + ' 条规则进行删除？', '批量删除', {
                type: 'warning'
            }).then(() => {
                this.delFn({id: this.saveCheckIds.split(',')});
            }).catch(() => {

            });
        },

        delFn({id}) {
            delItem({
                id,
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

        // 删除
        handleDel(id) {
            this.$confirm('是否删除此规则？', '删除', {
                type: 'warning'
            }).then(() => {
                this.delFn({id});
            }).catch(() => {

            });
        },

        // 编辑
        handleEditFn(row) {
            this.addItemObj.dialog = true;
            this.$nextTick(() => {
                this.$refs.addItemObjForm.clearValidate();
            });
            this.addItemObj.form = {
                id: row.id,
                status: row.status,
                rule_name: row.rule_name,
                condition: {
                    buyer_id: row.condition.buyer_id,
                    buyer_id_include: row.condition.buyer_id_include,
                    subject: row.condition.subject,
                    subject_include: row.condition.subject_include,
                    content: row.condition.content,
                    content_include: row.condition.content_include,
                },
                result: {
                    0: {
                        id: row.result_option_list[0].checked ? [row.result_option_list[0].id] : [],
                        checked: '',
                    },
                    1: {
                        id: row.result_option_list[1].checked ? [row.result_option_list[1].id] : [],
                        checked: '',
                    },
                    2: {
                        id: row.result_option_list[2].checked ? [row.result_option_list[2].id] : [],
                        checked: '',
                    },
                },
                category: row.result_option_list[2].checked && row.result_option_list[2].children.find(e => e.checked) ? row.result_option_list[2].children.find(e => e.checked).id+'' : '',
            };

            this.handleGetCategoryOptionList();
        },
    },
}
</script>
