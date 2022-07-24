<template>
    <div class="ui-main-module">
        <!-- 搜索框 -->
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo' @handleLoadOk='searchHeight = !searchHeight'/>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button type="text" @click="handleNewAdd" v-if="buttonList['newAdd'].permit(thisVm)"><i class="icon-xinzeng1" style="color: #75b1fc" ></i>新增</el-button>
        </div>
        <!-- 列表 -->
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
            <!--  转换 -->
            <template slot-scope="scope" slot="status">
                <span class="ui-state_circle greenColor" v-if="scope.row.status == 1"></span>
                <span class="ui-state_circle redColor" v-if="scope.row.status == 0"></span>
                <span>{{optionList.status? optionList.status[scope.row.status]: ''}}</span>
            </template>
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <el-button type="text" @click="handleOperateEdit(scope.row)" v-if="buttonList['edit'].permit(thisVm)">编辑</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDelete(scope.row)" v-if="buttonList['delete'].permit(thisVm)">删除</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
            </template>
            <!-- 备注 -->
            <template slot="text" slot-scope="scope">
                <el-tooltip  :disabled="String(scope.row.text).length < 26" effect="light" :content="String(scope.row.text)" placement="top-start">
                    <p v-if="String(scope.row.text) != 'null'">{{String(scope.row.text).slice(0,26)}}<span  v-if="String(scope.row.text).length > 26">...</span></p>
                    <p v-else>{{scope.row.text}}</p>
                </el-tooltip>
            </template>
            <!-- 类型值 -->
            <template slot="name" slot-scope="scope">
                <el-tooltip  :disabled="String(scope.row.name).length < 14" effect="light" :content="String(scope.row.name)" placement="top-start">
                    <p v-if="String(scope.row.name) != 'null'">{{String(scope.row.name).slice(0,14)}}<span  v-if="String(scope.row.name).length > 14">...</span></p>
                    <p v-else>{{scope.row.name}}</p>
                </el-tooltip>
            </template>
        </ComTableInfo>
        <!-- 分页 -->
        <div class="ui-main-module-page">
            <el-pagination
                @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageData.currentPage" :page-sizes="pageSizes"
                :page-size="pageData.currentList"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.currentTotal">
            </el-pagination>
        </div>
        <!-- 基础数据新增编辑-->
        <el-dialog
            width="440px"
            class="ui-layout_edit-dialog"
            :title="isModifyShow ? '新增' : '编辑'"
            :visible.sync="dialog.isBasicDataShow"
            @close="handleAddEditCancel">
            <el-form :model="form" :rules="formRule" ref="form" label-width="110px">
                <el-form-item prop="platform" label="平台：">
                    <el-select placeholder="请选择" size="small" clearable v-model="form.platform" @change="handlePlatformChange(form.platform)">
                        <el-option
                            :label="value"
                            :value="value"
                            :key="value"
                            v-for="(label, value) in requestData.platform">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type" label="一级类型：">
                    <el-select placeholder="请选择" size="small" clearable v-model="form.type" @change="handleFirstTypeChange(form.type)">
                        <el-option
                            :label="item"
                            :value="key"
                            :key="key"
                            v-for="(item, key) in requestData.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 二级类型，默认 -->
                <el-form-item prop='twotype' label="二级类型值：" v-if="!classType">
                    <el-input size="small" v-model="form.twotype" placeholder="请输入内容,不能超过100个字符" class="twotype" maxlength="100" show-word-limit></el-input>
                </el-form-item>
                <!-- 二级类型，当选择一级类型为售后责任部门时显示 -->
                <el-form-item label="二级类型值："   v-if="classType" prop='twotype'>
                    <el-select placeholder="请选择" size="small" clearable v-model="form.twotype" @change="form.typeValue='';">
                        <el-option
                            :label="item.name"
                            :value="item.id"
                            :key="item.id"
                            v-for="(item, i) in requestData.twotype">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 三级类型，当选择一级类型为售后责任部门时显示 -->
                <el-form-item :prop="form.type==1||form.type==38||form.type==21||form.type==39?'typeValue':''" label="三级类型值：" v-if="classType">
                    <el-input size="small" v-model="form.typeValue" placeholder="请输入内容,不能超过100个字符" class="typeValue" maxlength="100" show-word-limit></el-input>
                </el-form-item>
                <el-form-item prop="isEnable" label="是否启用：">
                    <el-radio-group v-model="form.isEnable">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="form.remarks" :rows="5" resize="none" class="ui-form-style" placeholder="请输入内容,不能超过100个字符" maxlength="100" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button @click="handleAddEditCancel" size="small">取 消</el-button>
               <el-button type="primary" @click="handleAddEditConfirm" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 日志 -->
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
    // import {
    //     mapActions,
    //     mapGetters
    // } from "vuex";
    import {
        getBasicDataList,
        getBasicDataDelete,
        getPlatformDropDown,
        getCategoryDropDown,
        basicConfigEdit,
        basicConfigAdd,
        getLog,
        getChildType,
        getCategoryList,
    } from '../../../api/SystemManagement/basicDataConfiguration.js'
    import {getSessionStorage} from '@/utils/storage';
    export default {
        name: 'BasicDataConfiguration',
        data () {
            return {
                searchHeight: false,
                thisVm: this,
                //默认图片
                defaultImg: require("../../../assets/image/default_error.png"),
                // 搜索框
                showSearch: true,
                queryData: {
                    mainQuery: {}
                },
                optionList:{
                    platform_list:[],
                    parent_list:[],
                    create_by_list:[],
                    status:[],
                },
                checkList: [],
                // 数据
                tableData: [],
                tableKey: ['平台', "类型", "类型值", "启用/禁用","备注", "创建人", '创建时间', "修改人", '修改时间','操作'],
                tableProps: [],
                tableWidth: [],
                // 表格加载动画
                tableLoading: false,

                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
                //id参数
                ids: '',
                dialog:{
                    isBasicDataShow:false,
                    isShowLogShow: false
                },
                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['content', 'created_by', 'created_at' ],
                    tableWidth: []
                },
                dialogData:{showLogTableData: []},
                //新增编辑弹窗数据
                form:{
                    id:'',
                    platform:'',
                    type:'',            //一级 first_id
                    twotype: "",        //二级 parent_id
                    typeValue:'',       //三级 name
                    isEnable:'',        //是否启用
                    remarks:'',
                },
                isModifyShow:false,
                isTwotypeShow:false,

                requestData:{
                    platform:[],
                    type:{},
                    twotype: []
                },
                formRule:{
                    platform:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    type:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    twotype:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        },
                        {
                            max:100,
                            message:'不能超过最大长度'
                        }
                    ],
                    typeValue:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        },
                        {
                            max:100,
                            message:'不能超过最大长度'
                        }
                    ],
                    isEnable:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ]
                },
                classType:false,
            }
        },
        methods: {
            // ...mapActions(["GetBasicDataList"]),
            getBasicDataList,
            getBasicDataDelete,
            getPlatformDropDown,
            getCategoryDropDown,
            basicConfigEdit,
            basicConfigAdd,
            getLog,
            getChildType,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['basic_data']);
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
                this.getBasicDataList(obj).then(({data}) => {
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

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    mainQuery: {}
                }
            },
            // 查询回调
            handleQueryInfoCallBack(data){
                // 获取保存的查询参数
                // this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                //     key: 'basic_data',
                //     value: JSON.stringify(this.queryData)
                // });
                this.optionList = data.data_list.drop_down_box;
                this.tableData = data.data_list.values;
                this.tableProps = ['platform_code', 'parent_name','name', 'status', 'text','create_by', 'create_time', 'modify_by', 'modify_time','operate'];
                this.tableWidth = ['120', '200', '200', '100', ' ', '100', '150', '100', '150', '180'];
                // 渲染分页
                this.pageData.currentPage = data.page_data.offset * 1;
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentTotal = data.page_data.total * 1;

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
                    this.handleQueryInfo({...this.queryData.mainQuery}, true);
                } else {
                    this.$message({
                        type: 'error',
                        message: data.errorMess || '操作失败'
                    })
                }
            },
            // 点击新增
            handleNewAdd(){
                this.dialog.isBasicDataShow = true;
                this.isModifyShow = true;
                this.form.isEnable = "1"
            },
            // 点击编辑
            handleOperateEdit(row){
                this.handlePlatformChange(row.platform_code);
                //编辑时获取二级类型值数据
                this.getChildType({
                    parent_id: row.first_id,
                    platform_code: row.platform_code,
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.requestData.twotype = data.data_list.values;
                });
                this.form.id = row.id;
                this.form.platform = row.platform_code;
                this.form.type = row.first_id;         //一级
                // if(row.parent_name === '售后原因责任归属部门'){
                if((row.first_id === '1'||row.first_id === '21'||row.first_id === '38'||row.first_id === '39')&&row.parent_id!='0'){
                    this.classType = true;
                    this.form.typeValue = row.name        //三级
                    this.form.twotype = row.parent_id  
                }else{
                    this.form.twotype = row.name        //二级
                }
                this.form.isEnable = row.status         //是否启用
                this.form.remarks = row.text            //备注
                this.dialog.isBasicDataShow = true      //显示弹窗
                this.isModifyShow = false               //title编辑
                this.isTwotypeShow = true
                this.handleEditTwotypeShow(row)
            },
            // 关闭新增编辑弹窗
            handleAddEditCancel(){
                this.form = {
                    id:'',
                    platform:'',
                    type:'',            //一级
                    twotype: "",        //二级
                    typeValue:'',       //三级
                    isEnable:'',        //是否启用
                    remarks:'',
                },
                this.classType=false;
                this.$refs['form'].resetFields();
                this.dialog.isBasicDataShow = false
                this.isTwotypeShow = false
            },
            // 弹窗确认
            handleAddEditConfirm(){
                // this.handleAddtTwotypeShow()
                this.$refs.form.validate((res) => {
                    if (res) {
                        let obj={}
                        if(this.form.twotype=='选择本项时二级由三级赋值'||!this.classType){
                            obj = {
                                id:this.form.id,
                                platform_code:this.form.platform,
                                first_id:this.form.type,
                                parent_id:0,
                                name:this.form.typeValue||this.form.twotype,
                                status:this.form.isEnable,
                                text:this.form.remarks,
                            };
                        }else{
                            obj = {
                                id:this.form.id,
                                platform_code:this.form.platform,
                                first_id:this.form.type,
                                parent_id:this.form.twotype||0,
                                name:this.form.typeValue||this.form.twotype,
                                status:this.form.isEnable,
                                text:this.form.remarks,
                            };
                        }
                        if (this.isModifyShow) {
                            this.basicConfigAdd(obj).then(({data}) => {
                                this.handleOperationCall(data)
                            });
                        } else {
                            this.basicConfigEdit(obj).then(({data}) => {
                                this.handleOperationCall(data)
                            });
                        }
                        this.dialog.isBasicDataShow = false
                    }
                })
            },
            // 操作删除
            handleOperateDelete(row){
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getBasicDataDelete({
                        id:row.id,
                    }).then(({data})=>{
                        this.handleOperationCall(data)
                    }).catch(error=>{})
                }).catch(error =>{})
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

            // 列表勾选
            handleCheck(row) {
                this.checkList = row
                let idArr = [];
                this.checkList.forEach(item => {
                    idArr.push(item.id)
                });
                this.ids = idArr.join(',')
            },
            // 日志
            handleOperateDiary(row){
                this.getLog({
                    id: row.id,
                    modules: "basic_config"
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },

            //一级类型值发生改变时获取二级类型值
            handleFirstTypeChange(val) {

                if (val && this.form.platform) {
                    getChildType({
                        parent_id: val,
                        platform_code: this.form.platform,
                    }).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败');
                            return;
                        }
                        this.requestData.twotype = data.data_list.values;
                        this.classType=false;
                        for (const key in this.requestData.type) {
                            if (key==val&&(this.requestData.type[key]==='售后原因责任归属部门'||this.requestData.type[key]==='不良类型原因')) {
                                this.classType=true;
                            }
                        }
                        if(this.classType){
                            this.requestData.twotype.unshift({
                                id: "选择本项时二级由三级赋值",
                                name: "选择本项时二级由三级赋值",
                                parent_id: "选择本项时二级由三级赋值",
                            })
                        }
                    });
                }
                this.form.twotype = "";
                this.requestData.twotype = [];
                this.form.typeValue = "";
                // this.isTwotypeShow = true
                
            },

            //平台发生改变时
            handlePlatformChange(val){
                // if ( this.form.type && val){
                //     getChildType({
                //         parent_id: this.form.type,
                //         platform_code: val,
                //     }).then(({data}) => {
                //         if (data.status !== 1) {
                //             this.$message.error(data.errorMess || '操作失败')
                //             return;
                //         }
                //         this.requestData.twotype = data.data_list.values;
                //         if(this.form.type == '1'){
                //             this.requestData.twotype.unshift({
                //                 id: "选择本项时二级由三级赋值",
                //                 name: "选择本项时二级由三级赋值",
                //                 parent_id: "选择本项时二级由三级赋值",
                //             })
                //             this.form.twotype = "";
                //         }
                //     });
                // }
                // this.requestData.twotype = [];
                this.form.type='';
                this.form.twotype = "";
                this.form.typeValue = "";
                this.requestData.type=[];
                getCategoryList({
                    platform_code: val,
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    this.requestData.type = data.data_list;
                });
            },

            // //二级类型值选择'选择本项时二级由三级赋值'时
            // handleTwoTypeChange(){
            //     if (this.form.twotype=='选择本项时二级由三级赋值'&&this.form.typeValue!="") {
            //         this.form.twotype = this.form.typeValue;
            //     }
            // },

            // //三级类型值发生改变时
            // handleThreeRankChange(){
            //     if (this.form.twotype=='选择本项时二级由三级赋值') {
            //         this.form.twotype = this.form.typeValue;
            //     }
            // },

            //修改编辑时二级类型显示
            handleEditTwotypeShow(row){
                // //当一级类型不为'售后责任部门时'
                // if (row.first_id!=1) {
                //     this.form.twotype = row.name
                // }
                // //当一级类型为'售后责任部门'且'二级类型值为空由三级赋值时'
                // if (row.first_id==1&&row.parent_id==0) {
                //     this.form.twotype = row.id
                // }
                // //当一级类型为'售后责任部门'且'二级类型值不为空时'
                // if (row.first_id==1&&row.parent_id!=0) {
                //     this.form.twotype = row.parent_id
                // }
                // console.log("111",this.form.twotype)
            },

            // //修改新增时二级类型传值
            // handleAddtTwotypeShow(){
            //     //当一级类型不为'售后责任部门时'
            //     if (this.form.type!=1) {
            //         this.form.typeValue = this.form.twotype
            //         this.form.twotype = 0
            //     }
            //     //当一级类型为'售后责任部门'且'二级类型值为空由三级赋值时'
            //     if (this.form.type==1&&this.form.typeValue==this.form.twotype) {
            //         this.form.twotype = 0;
            //     }
            // }

        },
        created() {
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.BasicDataInfo) === "{}") {
            //         // this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo["basic_data"]);
            //         this.handleQueryInfoCallBack(this.BasicDataInfo);
            //     }
            // } catch (e) {};

            //获取平台列表
            this.getPlatformDropDown().then(({data})=>{
                this.requestData.platform = data.data_list.values
            })

            //获取一级分类列表
            // this.getCategoryDropDown().then(({data})=>{
            //     this.requestData.type = data.data_list
            // })
        },
        computed: {
            // ...mapGetters(['queryParamsInfo', 'BasicDataInfo']),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
    }
</script>

<style scoped lang="less">
.ui-form-style{
    width:240px;
}

.el-form-item{
    .el-form-item__content{
        .ui-form-style.el-textarea{
            /deep/.el-input__count{
                line-height: 15px;
                padding: 0px;
                bottom:2px;
            }
        }
    }
}
.twotype{
    /deep/.el-input__inner{
        padding-right: 55px;
    }
}
</style>