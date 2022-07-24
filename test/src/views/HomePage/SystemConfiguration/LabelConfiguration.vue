<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch" >
               <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
            <div class="ui-fn-module">
                <span class="ui-top_i" @click="showSearch = !showSearch">
                    <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
                </span>
                <el-button type="text" size="small" @click="handleNewAdd" v-if="buttonList['newAdd'].permit(thisVm)"><i class="icon-xinzeng1" style="color: #75b1fc"></i>新增</el-button>
                <el-button type="text" size="small" @click="batchDeleteData" v-if="buttonList['batchDelete'].permit(thisVm)"><i class="icon-shanchu1" style="color: #fa686c"></i>批量删除</el-button>
            </div>
            <!-- 列表/操作 -->
            <ComTableInfo
                isCheck
                :tableWidth="tableWidth"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :searchHeight="searchHeight"
                @checked="handleSelectionChange"
                :tableLoading="tableLoading">
                <template slot="operation" slot-scope="scope">
                    <el-button type="text"  size="small" @click="compile(scope.row)" v-if="buttonList['edit'].permit(thisVm)">编辑</el-button>
                    <ComDivide/>
                    <el-button type="text"  size="small" @click="deleteData(scope.row)" v-if="buttonList['delete'].permit(thisVm)">删除</el-button>
                    <ComDivide/>
                    <span v-if="scope.row.status  === '1'">
                        <el-button type="text" @click="handleDisable(scope.row, true)" v-if="buttonList['stop'].permit(thisVm)">停用</el-button>
                        <ComDivide/>
                    </span>
                    <span v-if="scope.row.status  === '0'">
                        <el-button type="text" @click="handleDisable(scope.row, false)" v-if="buttonList['start'].permit(thisVm)">启用</el-button>
                        <ComDivide/>
                    </span>
                    <el-button type="text"  size="small" @click="handleShowLog(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
                </template>
                <template slot="status" slot-scope="scope">
                    <span class="ui-state_circle greenColor" v-if="scope.row.status == 1"></span>
                    <span class="ui-state_circle redColor" v-if="scope.row.status == 0"></span>
                    <span v-html="scope.row.status==0?'停用':'启用'"></span>
                </template>
                <!-- 标签描述 -->
                <template slot="tag_describe" slot-scope="scope">
                    <el-tooltip  :disabled="String(scope.row.tag_describe).length < 35" effect="light" :content="String(scope.row.tag_describe)" placement="top-start">
                        <p v-if="String(scope.row.tag_describe) != 'null'">{{String(scope.row.tag_describe).slice(0,35)}}<span  v-if="String(scope.row.tag_describe).length > 35">...</span></p>
                        <p v-else>{{scope.row.tag_describe}}</p>
                    </el-tooltip>
                </template>
                 <!-- 标签名称 -->
                <template slot="tag_name" slot-scope="scope">
                    <el-tooltip  :disabled="String(scope.row.tag_name).length < 9" effect="light" :content="String(scope.row.tag_name)" placement="top-start">
                        <p v-if="String(scope.row.tag_name) != 'null'">{{String(scope.row.tag_name).slice(0,9)}}<span  v-if="String(scope.row.tag_name).length > 9">...</span></p>
                        <p v-else>{{scope.row.tag_name}}</p>
                    </el-tooltip>
                </template>
            </ComTableInfo>
            <!-- 点击新增/编辑弹窗 -->
            <el-dialog
                :title="isModifyShow ? '编辑' : '新增'"
                width="440px"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddShow"
                @close="cancel">
            <el-form  label-width="110px" :model="addObj" :rules="Rules" ref="addObj">
                <el-form-item label="平台：" prop="platform_code">
                    <el-select
                        filterable v-filter
                        size="small"
                        clearable
                        v-model="addObj.platform_code">
                        <el-option
                            v-for="(value,key) in platformCodeList"
                            :key="key"
                            :label="key"
                            :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称：" prop="tag_name">
                    <el-input size="small" v-model="addObj.tag_name" placeholder="请输入内容,不能超过10个字符" show-word-limit :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="标签描述：" prop="tag_describe">
                    <el-input type="textarea" :rows="3" v-model="addObj.tag_describe" class="ui-form-style" placeholder="请输入内容,不能超过100个字符" show-word-limit :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="快捷键设置：" prop="shortcut_key">
                    <el-input size="small" v-model="addObj.shortcut_key" @keydown.alt.native="handleSetShortcutKey"  placeholder="Alt+任意一个字母键" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-radio v-model="addObj.status" label="1" >启用</el-radio>
                    <el-radio v-model="addObj.status" label="0">停用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="dialogConfirm">确定</el-button>
            </div>
        </el-dialog>
        <!-- 底部分页 -->
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
        <el-dialog
            width="950px"
            class="ui-layout_edit-dialog"
            title="日志"
            :visible.sync="dialog.isShowLogShow"
            close="dialog.isShowLogShow=false">
            <ComPreviewTable
                :isAdaptiveHeight="false"
                :logKey="logTable.tableKey"
                :logProps="logTable.tableProps"
                :logWidth='logTable.tableWidth'
                :logData="dialogData.showLogTableData">
            </ComPreviewTable>
        </el-dialog>
    </div>
</template>
<script>
    import config from '@/assets/js/config';
    import {
        getLabelConfigurationListInfo,
        addLabelConfiguration,
        editLabelConfiguration,
        deleteLabelConfiguration,
        getLogData,
        getPlatformCodeData
    } from '../../../api/SystemManagement/GetLabelConfiguration'
    import{
        mapGetters,
        mapActions
    } from 'vuex';

    export default {
        name: 'LabelConfiguration',
        data () {
            return {
                searchHeight: false,
                thisVm: this,
                //搜索框数据
                queryData: {
                    mainQuery: {}
                },
                //列表数据
                tableKey: ["ID","平台","标签名称","标签描述","状态","创建人","创建时间","修改人","修改时间","操作"],
                tableData: [],
                tableProps: [],
                tableWidth:[],
                // 表格加载动画
                tableLoading: false,

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
                //是否修改显示(false是新增显示，true时编辑显示)
                isModifyShow:false,
                //控制弹窗显示隐藏
                isAddShow:false,
                //控制搜索配置弹窗显示隐藏
                isSearchShow:false,
                //勾选ID，用于批量删除
                selectId:"",
                //控制搜索框显示隐藏
                showSearch: true,
                //批量新增
                batchIsAddShow:false,
                //单选框
                radio:"true",
                //创建人
                createByList:[],
                //平台下拉数据
                platformCodeList:{},

                keyCodeList:{65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z"},
                //弹窗数据
                addObj:{
                    platform_code:"",
                    tag_name:"",
                    tag_describe:"",
                    shortcut_key:"",
                    status:"",
                    id:""
                },
                //弹窗表单验证
                Rules: {
                    platform_code: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    tag_name: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        },
                        {
                            max:10,
                            message:'不能超过最大长度'
                        }
                    ],
                    status: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        }
                    ],
                    tag_describe:[
                        {
                            max:100,
                            message:'不能超过最大长度'
                        }
                    ]
                },

                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['content', 'created_by', 'created_at' ],
                    tableWidth: []
                },
                dialog: {isShowLogShow: false},
                dialogData:{showLogTableData: []},

            }
        },
        computed: {
            // ...mapGetters([
            //     'queryParamsInfo',
            //     'labelConfigurationInfo'
            // ]),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        methods:{
            // ...mapActions([
            //     'GetLabelConfigurationListInfo',
            // ]),
            getLabelConfigurationListInfo,
            addLabelConfiguration,
            editLabelConfiguration,
            deleteLabelConfiguration,
            getPlatformCodeData,
            getLogData,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['label_configuration']);
                // }
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
                    offset: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                    limit: this.pageData.currentList
                };

                this.tableLoading = true;
                this.getLabelConfigurationListInfo(obj).then(({data}) => {
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

            //查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                // this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                //     key: 'label_configuration',
                //     value: JSON.stringify(this.queryData)
                // });
                //列表数据渲染
                this.createByList = data.data_list.values;
                this.tableData = data.data_list.values;
                this.tableProps = ["id","platform_code","tag_name","tag_describe","status","create_by","create_time","modify_by","modify_time","operation"]
                this.tableWidth = ['60', '150', '150', '470', '100 ', '100', '150', '100', '150', ''];
                //渲染分页
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;
                this.pageData.currentTotal = data.page_data.total * 1;

                // 重置表格高度
                this.searchHeight = !this.searchHeight;
            },

            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    mainQuery: {}
                }
            },

            //n条/页切换
            handleSizeChange(val) {
                this.pageData.currentPage = 1;
                this.pageData.currentList = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },

            //页数切换
            handleCurrentChange(val) {
                this.pageData.currentPage = val;
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
            },

            //取消（关闭弹窗）
            cancel(){
                this.isAddShow = false;
                this.isModifyShow = false;
                this.addObj = {
                    platform_code:"",
                    tag_name:"",
                    tag_describe:"",
                    shortcut_key:"",
                    status:"",
                    id:""
                };
                this.$refs['addObj'].resetFields();
            },

            //点击编辑按钮
            compile(row){
                this.isModifyShow = true;
                this.isAddShow = true;
                this.addObj = {
                    platform_code:row.platform_code,
                    tag_name:row.tag_name,
                    tag_describe:row.tag_describe,
                    shortcut_key:row.shortcut_key,
                    status:row.status,
                    id:row.id
                };
            },

            // 点击弹窗确认回调
            dialogConfirm() {
                //console.log("res",res); //=> 验证数据未填写完全false；反之true
                if(this.addObj.shortcut_key.indexOf("Alt+")===-1&&this.addObj.shortcut_key.length!=5&&this.addObj.shortcut_key!==''){
                    this.addObj.shortcut_key='';
                    this.$message({
                        type: 'error',
                        message: '快捷键设置不规范(Alt+任意一个字母键)，请重新设置！'
                    })
                    return;
                }
                this.$refs['addObj'].validate((res) => {
                    if(res) {
                        let newObj = {
                            platform_code: this.addObj.platform_code,
                            tag_name: this.addObj.tag_name,
                            tag_describe: this.addObj.tag_describe,
                            shortcut_key: this.addObj.shortcut_key,
                            status: this.addObj.status,
                            id: this.addObj.id,
                        }
                        if(!this.isModifyShow) {
                            this.addLabelConfiguration(newObj).then(({ data }) => {
                                this.succeedCallBack(data);
                            })
                        }else {
                            this.editLabelConfiguration(newObj).then(({ data }) => {
                                this.succeedCallBack(data);
                            })
                        }
                    }
                })
            },

            //操作成功回调
            succeedCallBack(data) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                    if (this.isAddShow) {
                        this.cancel();
                    }
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                }
            },

            //获取勾选数据(用于批量删除)
            handleSelectionChange(val) {
                let idArr = [];
                for(let i = 0; i < val.length; i++) {
                    idArr.push(val[i].id)
                }
                this.selectId = idArr.join(',')
            },

            //点击操作/删除
            deleteData(row) {
                this.deleteCallBack(row.id);
            },

            //批量删除
            batchDeleteData(){
                if(!this.selectId){
                    this.$message.warning('请勾选列表数据')
                }else{
                    this.deleteCallBack(this.selectId);
                }
            },

            //删除回调
            deleteCallBack(id) {
                this.$confirm('是否确认删除？','提示',{
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.deleteLabelConfiguration({id}).then(({ data }) => {
                        this.succeedCallBack(data);
                    })
                })
            },
            // 日志
            handleShowLog(row) {
                this.getLogData({
                    id:row.id,
                    modules:"tag"
                }).then(({data})=>{
                    //console.log('日志data', data)
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },
            //停用启用
            handleDisable(row, isDisable) {
                this.$confirm(isDisable? '确定停用？': '确定启用？', "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const params = {}
                    params.update_status =  row.status === '1'? 0: 1
                    params.id =  row.id
                    this.editLabelConfiguration(params).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess);
                            return
                        }
                        this.handleOperationCall(data);
                    });
                });
            },
            // 操作回调
            handleOperationCall(data) {
                if (data.status) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                } else {
                    this.$message({
                        type: 'error',
                        message: data.errorMess || '操作失败'
                    })
                }
            },

            //设置快捷键
            handleSetShortcutKey(e){
                if(this.keyCodeList[e.keyCode]) {
                    setTimeout(()=>{
                        this.addObj.shortcut_key = "Alt"+"+"+this.keyCodeList[e.keyCode]
                        if(this.addObj.shortcut_key.length){
                            if(this.addObj.shortcut_key.indexOf("Alt+")===-1||this.addObj.shortcut_key.length!=5){
                                this.addObj.shortcut_key='';
                                this.$message({
                                    type: 'error',
                                    message: '快捷键设置不规范(Alt+任意一个字母键)，请重新设置！'
                                })
                            }
                        }
                    }, 0) 
                };
                
            //     addEventListener("keyup",(e)=>{
            //         console.log(e.keyCode,e.ctrlKey)
            //         // if(this.keyCodeList[e.keyCode]){
            //         //     this.addObj.shortcut_key = "Alt"+"+"+this.keyCodeList[e.keyCode];
            //             e.preventDefault();
            //             return false;
            //         // }
            //    })
            },

            //点击新增
            handleNewAdd(){
                this.isAddShow = true;
                this.addObj.status = "1"
            },
        },
        created() {
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.labelConfigurationInfo) === '{}') {
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo['label_configuration']);
            //         this.handleQueryInfoCallBack(this.labelConfigurationInfo);
            //     }
            // } catch (e) {
            //     console.log(e)
            // };
            this.getPlatformCodeData().then(({data})=>{
                this.platformCodeList = data.data_list.values;
            });
        }
    }

</script>

<style lang="less" scoped >
.ui-form-style{
    width:240px;
    /deep/.el-input__count{
        line-height: 15px;
        bottom:2px;
    }
}
</style>
