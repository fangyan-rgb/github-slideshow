<template>
    <div class="ui-main-module">
        <!-- 搜索框 -->
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <!-- 发票信息页面配置没有搜索配置 -->
                <!-- <ComSearchCondition :componentName='$options.name' @handleQueryInfo='handleQueryInfo'/> -->
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="所属平台">
                            <el-select size="small" v-model="queryData.platform_code" @change="handleSaleAccount(false)" clearable>
                                <el-option
                                    v-for="(value, key, index) in optionList.platform_account"
                                    :key="key"
                                    :value="key"
                                    :label="key">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="销售账号">
                            <el-select size="small" v-model="queryData.saleAccount" :filter-method="(val)=>filterMethod(val,false)" clearable filterable v-filter>
                                <div v-if="queryData.platform_code">
                                    <el-option
                                        v-for="(value, index) in optionList.optionsListShow"
                                        v-if="index<100"
                                        :key="value.id"
                                        :value="value.id"
                                        :label="value.name">
                                    </el-option>
                                </div>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="创建人">
                            <el-select size="small" v-model="queryData.createMan" clearable filterable v-filter>
                                <el-option
                                    v-for="(value, key, index) in optionList.create_by_list"
                                    :key="index"
                                    :value="value"
                                    :label="value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li style="width: 24%;">
                        <SearchRequirement label="创建时间">
                            <el-date-picker
                                size="small" value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="queryData.createTime"
                                :default-time="['00:00:00', '23:59:59']"
                                type="datetimerange" range-separator="至" start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-main-search-btn ui-btn-chose">
                    <el-button size="small" @click="handleResetQueryInfo"><i class="icon-zhongzhi"></i>重置</el-button>
                    <el-button size="small" @click="handleQueryInfo()" type="primary"><i class="icon-chaxun"></i>查询 </el-button>
                </div>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button type="text" @click="handleNewAdd()" v-if="buttonList['newAdd'].permit(thisVm)"><i class="icon-xinzeng1" style="color: #75b1fc" ></i>新增</el-button>
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
            <!-- 账号下拉转换 -->
            <template slot-scope="scope" slot="sale_account">
                <div>{{optionList.sale_account_list? optionList.sale_account_list[scope.row['sale_account']]: ''}}</div>
            </template>
            <!-- 缩略图 -->
            <template slot-scope="scope" slot="invoice_stamp">
                <img v-lazy="'http://crmupload.yibainetwork.com:82'+scope.row['invoice_stamp']" :key='scope.row["invoice_stamp"]' class="proImg"  @click="handleClickImg('http://crmupload.yibainetwork.com:82'+scope.row['invoice_stamp'])"/>
            </template>
            <template slot-scope="scope" slot="operate">
                <el-button type="text" @click="handleOperateEdit(scope.row)" v-if="buttonList['edit'].permit(thisVm)">编辑</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDelete(scope.row)" v-if="buttonList['delete'].permit(thisVm)">删除</el-button>
                <ComDivide/>
                <el-button type="text" @click="handleOperateDiary(scope.row)" v-if="buttonList['diaryLog'].permit(thisVm)">日志</el-button>
            </template>
            <!-- 公司地址 -->
            <template slot="company_addr" slot-scope="scope" >
                <el-tooltip  :disabled="String(scope.row.company_addr).length < 48" effect="light" :content="String(scope.row.company_addr)" placement="top-start">
                    <p v-if="String(scope.row.company_addr) != 'null'">{{String(scope.row.company_addr).slice(0,48)}}<span  v-if="String(scope.row.company_addr).length > 48">...</span></p>
                    <p v-else>{{scope.row.company_addr}}</p>
                </el-tooltip>
            </template>
            <!-- 公司名称 -->
            <template slot="company_name" slot-scope="scope" >
                <el-tooltip  :disabled="String(scope.row.company_name).length < 48" effect="light" :content="String(scope.row.company_name)" placement="top-start">
                    <p v-if="String(scope.row.company_name) != 'null'">{{String(scope.row.company_name).slice(0,48)}}<span  v-if="String(scope.row.company_name).length > 48">...</span></p>
                    <p v-else>{{scope.row.company_name}}</p>
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
        <!-- 发票配置-->
        <el-dialog
            width="800px"
            class="ui-layout_edit-dialog"
            title="发票配置"
            :visible.sync="dialog.isInvoiceconfigurationShow"
            @close="handleAddEditCancel">
            <el-form :model="form" :rules="formRule" ref="form" label-width="110px">
                <el-form-item prop='platform_code' label="所属平台：">
                    <el-select size="small" v-model="form.platform_code" @change="handleSaleAccount(true)" class="ui-form-style">
                        <el-option
                            v-for="(value, key, index) in optionList.platform_account"
                            :key="key"
                            :value="key"
                            :label="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="left">
                    <el-form-item prop='saleAccount' label="销售账号：">
                            <el-select size="small" v-model="form.saleAccount" :filter-method="(val)=>filterMethod(val,true)" @focus='handleFocus' v-filter filterable class="ui-form-style">
                                <div v-if="form.platform_code">
                                    <el-option
                                        v-for="(value, index) in optionList.optionsListShow"
                                        :key="value.id"
                                        :value="value.id"
                                        :label="value.name">
                                    </el-option>
                                </div>
                            </el-select>
                    </el-form-item>
                    <el-form-item :prop="form.platform_code!='EB'?'registeredCompany':''" label="注册公司：">
                        <el-input size="small"  v-model="form.registeredCompany" @input="handleInputLength(form.registeredCompany)" clearable class="ui-form-style" placeholder="不能超过50字符" maxlength="200" ></el-input>
                    </el-form-item>
                    <el-form-item prop='companyAddress' label="公司地址：">
                        <el-input size="small" v-model="form.companyAddress" @input="handleInputLength(form.companyAddress)" clearable class="ui-form-style" placeholder="不能超过200字符" maxlength="200" ></el-input>
                    </el-form-item>
                    <el-form-item prop='companyPhone' label="公司电话：">
                        <el-input size="small" v-model="form.companyPhone" clearable class="ui-form-style"></el-input>
                    </el-form-item>
                    <el-form-item prop='companyFax' label="公司传真：">
                        <el-input size="small" v-model="form.companyFax"  @input="handleInputLength(form.companyFax)" clearable class="ui-form-style" placeholder="不能超过200字符" maxlength="200" ></el-input>
                    </el-form-item>
                    <el-form-item prop='mailAddress' label="邮箱地址：">
                        <el-input size="small" v-model="form.mailAddress" clearable class="ui-form-style"></el-input>
                    </el-form-item>
                    <el-form-item prop='vat_number' label="VAT税号：">
                        <el-input size="small" v-model="form.vat_number" clearable class="ui-form-style"></el-input>
                    </el-form-item>
                </div>
                <div class="right">
                    <el-form-item prop='bank' label="开户银行：">
                        <el-input size="small" v-model="form.bank" @input="handleInputLength(form.bank)" clearable class="ui-form-style" placeholder="不能超过200字符" maxlength="200" ></el-input>
                    </el-form-item>
                    <el-form-item prop='bankAccount' label="银行账号：">
                        <el-input size="small"  v-model="form.bankAccount" @change="handleInputVal" @input="handleInputLength(form.bankAccount)" clearable class="ui-form-style" placeholder="不能超过200字符" maxlength="200" ></el-input>
                    </el-form-item>
                    <el-form-item prop='bankAddress' label="银行地址：">
                        <el-input size="small" v-model="form.bankAddress" @input="handleInputLength(form.bankAddress)" clearable class="ui-form-style" placeholder="不能超过200字符" maxlength="200" ></el-input>
                    </el-form-item>
                    <el-form-item prop='accountMan'  label="开户人：">
                        <el-input size="small" v-model="form.accountMan" @input="handleInputLength(form.accountMan)" clearable class="ui-form-style" placeholder="不能超过200字符" maxlength="200" ></el-input>
                    </el-form-item>
                    <!-- <el-form-item prop='swifCode' label="swif code：">
                        <el-input size="small" v-model="form.swifCode" @input="handleInputLength(form.swifCode)" clearable class="ui-form-style" placeholder="不能超过200字符" maxlength="200"></el-input>
                    </el-form-item> -->
                    <el-form-item prop='invoiceChapter' label="发票章：">
                        <el-input size="small" v-model="form.invoiceChapter" clearable class="ui-form-style" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop='vat_addr' label="VAT注册地址：">
                        <el-input size="small" v-model="form.vat_addr" clearable placeholder="不能超过200字符" class="ui-form-style" maxlength="200"></el-input>
                    </el-form-item>
                    <el-form-item prop='vat_tax_point' label="VAT税点：">
                        <el-input-number size="small" v-model="form.vat_tax_point" controls-position="right" class="ui-form-style"
                                                                            :min="1" :max="100" :precision="0"></el-input-number>%
                    </el-form-item>
                 </div>
                 <div style="clear: left;width:700px;">
                    <el-form-item >
                        <div class="ui-upload-style">
                            <el-upload
                                ref="upload"
                                class="upload-demo"
                                action="/api/system_set/general_upload/upload"
                                name="userfile"
                                :file-list="fileList"
                                :before-upload="beforeAvatarUpload"
                                :on-success="UpSuccess"
                                :beforeUpload="beforeUpload"
                                :on-remove="UpRemove"
                                list-type="picture">
                                <el-button type="primary" size="small">上传</el-button>&nbsp;&nbsp;&nbsp;
                                <div slot="tip" style="line-height:15px;">支持gif、jpg、png、jpeg、bmp，格式大小不能超过10M</div>
                            </el-upload>
                        </div>
                    </el-form-item>
                 </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button @click="handleAddEditCancel" size="small">取消</el-button>
               <el-button type="primary" @click="handleAddEditConfirm" size="small">确定</el-button>
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
        <el-dialog :visible.sync="imageDialogVisible" width="500px" :before-close="handleImageClose">
            <img width="100%" :src="dialogImageUrl" alt="">
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
        getInvoiceList,
        getInvoiceDelete,
        getInvoiceEdit,
        getLog,
    } from '../../../api/SystemManagement/invoiceInfoConfiguration.js'
    import {getSessionStorage} from '@/utils/storage';
    import moment from 'moment';

    export default {
        name: 'InvoiceInfoConfiguration',
        data () {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '当日',
                        onClick(picker) {
                        const start = moment().hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                        const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '昨日',
                        onClick(picker) {
                        const start = moment().subtract(1, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                        const end = moment().subtract(1, 'day').hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                        picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '本月',
                        onClick(picker) {
                        const start = moment().subtract(moment().get('date')-1, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                        const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                        const start = moment().subtract(1, 'month').subtract(moment().get('date')-1, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                        const end = moment().subtract(moment().get('date'), 'day').hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                        picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '过去7天',
                        onClick(picker) {
                        const start = moment().subtract(6, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                        const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '过去30天',
                        onClick(picker) {
                        const start = moment().subtract(29, 'day').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss');
                        const end = moment().hours(23).minutes(59).seconds(59).format('YYYY-MM-DD HH:mm:ss');
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                searchHeight: false,
                thisVm: this,
                fileList:[],
                dialogImageUrl: false,
                imageDialogVisible: false,
                //默认图片
                defaultImg: require("../../../assets/image/default_error.png"),
                // 搜索框
                showSearch: true,
                queryData: {
                    platform_code:"",
                    saleAccount: '',
                    createMan: '',
                    createTime: '',
                },
                optionList:{
                    create_by_list:[],
                    sale_account_list:[],
                    account_list:[],
                    sale_account:{},
                    optionsListShow: [],
                    platform_account:[],
                },
                checkList: [],
                //销售账号列表
                saleAccountList:[],
                // 数据
                tableData: [],
                tableKey: ['所属平台', '销售账号', "邮箱地址", "公司名称", "公司地址", "公章缩略图", "创建人", '创建时间', "修改人", '修改时间', '操作'],
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
                //默认图片
                defaultImg: require("../../../assets/image/default_error.png"),
                //id参数
                ids: '',
                dialog:{
                    isInvoiceconfigurationShow: false,
                    isShowLogShow: false
                },
                logTable: {
                    tableKey: ['操作日志', '操作人', '操作时间'],
                    tableProps: ['content', 'created_by', 'created_at' ],
                    tableWidth: []
                },
                dialogData:{showLogTableData: []},
                form:{
                    platform_code:'',
                    saleAccount:'',
                    registeredCompany:'',
                    companyAddress:'',
                    companyPhone:'',
                    companyFax:'',
                    mailAddress:'',
                    bank:'',
                    bankAccount:'',
                    bankAddress:'',
                    accountMan:'',
                    //swifCode:'',
                    invoiceChapter:'',
                    vat_addr:'',
                    vat_number:'',
                    vat_tax_point:''
                },
                formRule:{
                    platform_code:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    saleAccount:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    registeredCompany:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        },
                        {
                            max: 50,
                            message: '不能超过50个字符!'
                        }
                    ],
                    companyAddress:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    companyPhone:[
                        {
                            pattern: /^[\d\-]+$/,
                            // required: true,
                            message: "请输入正确的电话号码",
                            // trigger: "blur"
                        }
                    ],
                    companyFax:[
                        {
                            pattern: /^[\d\-]+$/,
                            // required: true,
                            message: "请输入正确的传真号码",
                            // trigger: "blur"
                        }
                    ],
                    mailAddress:[
                        {
                            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                            // required: true,
                            message: '请输入正确的电子邮箱',
                            // trigger: "blur"
                        }
                    ],
                    // bank:[
                    //     {
                    //         required: true,
                    //         message: "带*号不能为空",
                    //         trigger: "blur"
                    //     }
                    // ],
                    bankAccount:[
                        {
                            pattern:/^([1-9]\d*|[0]{1,1})$/,
                            // required: true,
                            message: "请输入正确的银行账号",
                            // trigger: "blur"
                        }
                    ],
                    // bankAddress:[
                    //     {
                    //         required: true,
                    //         message: "带*号不能为空",
                    //         trigger: "blur"
                    //     }
                    // ],
                    // accountMan:[
                    //     {
                    //         required: true,
                    //         message: "带*号不能为空",
                    //         // trigger: "blur"
                    //     }
                    // ],
                    // swifCode:[
                    //     {
                    //         required: true,
                    //         message: "带*号不能为空",
                    //         trigger: "blur"
                    //     }
                    // ],
                    invoiceChapter:[
                        {
                            required: true,
                            message: "带*号不能为空",
                            trigger: "blur"
                        }
                    ],
                    
                }

            }
        },
        methods: {
            // ...mapActions(["GetInvoiceList"]),
            getInvoiceList,
            getInvoiceDelete,
            getInvoiceEdit,
            getLog,

            // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
            handleQueryInfo(params, isSave, isComSearch) {
                this.queryData.mainQuery = {...(params || {})};     // 用来缓存  此页面没用到
                // 判断是否取缓存参数
                // if (isSave) {
                //     this.queryData = JSON.parse(this.queryParamsInfo['invoice_info']);
                // }
                let obj = {
                    sale_account: this.queryData.saleAccount,
                    create_by: this.queryData.createMan,
                    start_time: this.queryData.createTime ? this.queryData.createTime[0] : '',
                    end_time: this.queryData.createTime ? this.queryData.createTime[1] : '',
                    platform_code: this.queryData.platform_code,
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
                this.getInvoiceList(obj).then(({data}) => {
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
                    saleAccount: '',
                    createMan: '',
                    createTime: '',
                    platform_code:'',
                }
            },
            // 查询回调
            handleQueryInfoCallBack(data){
                // 获取保存的查询参数
                // this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                //     key: 'invoice_info',
                //     value: JSON.stringify(this.queryData)
                // });
                this.optionList = {
                    account_list:[],
                    create_by_list: data.data_list.drop_down_box.create_by_list,
                    sale_account_list: data.data_list.drop_down_box.sale_account_list,
                    platform_account: data.data_list.drop_down_box.platform_account,
                    sale_account: data.data_list.drop_down_box.account_list
                };

                for (const key in data.data_list.drop_down_box.account_list) {
                    this.optionList.account_list.push({label: data.data_list.drop_down_box.account_list[key], value: key});
                }
                // console.log(this.optionList.account_list)
                // this.optionList.optionsListShow = this.optionList.account_list.slice(0,100);
                this.tableData = data.data_list.values;
                this.tableWidth = ['100', '140', '170', '280', '280', '80', '70', '140', '70','140','180'];
                this.tableProps = ['platform_code', 'sale_account', 'email', 'company_name', 'company_addr', 'invoice_stamp', 'create_by', 'create_time','modify_by', 'modify_time', 'operate'];
                // 渲染分页
                this.pageData.currentPage = data.page_data.offset * 1;
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentTotal = data.page_data.total * 1;
                if(this.queryData.platform_code)this.optionList.optionsListShow = this.optionList.platform_account[this.queryData.platform_code].child.slice(0,100);;
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
            // 新增
            handleNewAdd(){
                this.dialog.isInvoiceconfigurationShow = true
            },
            // 操作编辑
            handleOperateEdit(row){
                    this.form.platform_code = row.platform_code;
                    this.optionList.optionsListShow = this.optionList.platform_account[this.form.platform_code].child.slice(0,100);
                    this.optionList.platform_account[this.form.platform_code].child.filter(item => {
                        if(item.id.indexOf(row.sale_account)>-1){
                            this.optionList.optionsListShow.push(item);
                        }
                    });
                    this.form.id = row.id;
                    this.form.saleAccount = row.sale_account;
                    this.form.registeredCompany = row.company_name;
                    this.form.companyAddress = row.company_addr;
                    this.form.companyPhone = row.company_tel;
                    this.form.companyFax = row.company_fox;
                    this.form.mailAddress = row.email;
                    this.form.bank = row.bank_name;
                    this.form.bankAccount = row.bank_account;
                    this.form.bankAddress = row.bank_addr;
                    this.form.accountMan = row.account_holder;
                    //this.form.swifCode = row.swif_code
                    this.form.invoiceChapter = row.invoice_stamp;
                    this.form.vat_addr = row.vat_addr;
                    this.form.vat_number = row.vat_number;
                    this.form.vat_tax_point = row.vat_tax_point;
                    if(row.invoice_stamp!=null&&row.invoice_stamp!=''){
                        this.fileList = row.invoice_stamp.split(',').map(e =>{
                            return {name:'', url:e}
                        })
                    }else{
                        this.fileList = [];
                    }
                    this.dialog.isInvoiceconfigurationShow = true;

            },
            // 新增编辑确定
            handleAddEditConfirm(){
                this.$refs['form'].validate((res) => {
                    if (res) {
                        let obj = {
                            id:this.form.id,
                            platform_code:this.form.platform_code,
                            sale_account:this.form.saleAccount,
                            company_name:this.form.registeredCompany,
                            company_addr:this.form.companyAddress,
                            company_tel:this.form.companyPhone,
                            company_fox:this.form.companyFax,
                            email:this.form.mailAddress,
                            bank_name:this.form.bank,
                            bank_addr:this.form.bankAddress,
                            bank_account:this.form.bankAccount,
                            account_holder:this.form.accountMan,
                            //swif_code:this.form.swifCode,
                            invoice_stamp:this.form.invoiceChapter,
                            vat_addr:this.form.vat_addr,
                            vat_number:this.form.vat_number,
                            vat_tax_point:this.form.vat_tax_point,
                        };
                        this.getInvoiceEdit(obj).then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败')
                                return;
                            }else{
                                this.$message({
                                    type: 'success',
                                    message: '操作成功'
                                });
                                this.handleQueryInfo({...this.queryData.mainQuery}, true);
                                this.dialog.isInvoiceconfigurationShow = false
                            }
                        });
                    }
                })
            },
            UpSuccess(response, file, fileList) {
                this.form.invoiceChapter = response.file_path
                this.fileList = [{name: file.name,status:  file.status,uid: file.uid,url:response.file_path}]

            },
            beforeUpload(file) {
                let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
                let extArr = ['gif', 'jpg', 'png', 'jpeg', 'bmp'];
                let size = file.size / 1024 / 1024 < 10;
                if( !size ){
                    this.$message.error('文件大小必须在10m以内！');
                    return false;
                }
                if( !extArr.includes(ext) ){
                    this.$message.error('文件格式不符合！');
                    return false;
                }
            },
            UpRemove(response, file, fileList) {
                //this.form.invoiceChapter = ''
            },
            beforeAvatarUpload(){
                //this.fileList = []
            },
            // 新增编辑取消
            handleAddEditCancel(){
                this.form = {
                    id:'',
                    saleAccount:'',
                    platform_code:"",
                    registeredCompany:'',
                    companyAddress:'',
                    companyPhone:'',
                    companyFax:'',
                    mailAddress:'',
                    bank:'',
                    bankAccount:'',
                    bankAddress:'',
                    accountMan:'',
                    //swifCode:'',
                    invoiceChapter:'',
                    vat_addr:'',
                    vat_number:'',
                    vat_tax_point:''
                }
                this.fileList = []
                this.$refs.upload.clearFiles()
                this.dialog.isInvoiceconfigurationShow =false;
                this.$refs['form'].resetFields();
            },
            // 操作删除
            handleOperateDelete(row){
                this.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getInvoiceDelete({
                        id: row.id,
                    }).then(({data}) => {
                        this.handleOperationCall(data)
                    }).catch(error => {
                    })
                }).catch(error => {
                })
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
            // 点击放大图片
            handleClickImg(url) {
                if (url) {
                    this.dialogImageUrl = url;
                    this.imageDialogVisible = true
                }
            },
            handleImageClose() {
                this.imageDialogVisible = false;
            },
            // 日志
            handleOperateDiary(row){
                this.getLog({
                    id:row.id,
                    modules:"invoice"
                }).then(({data})=>{
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return
                    }
                    this.dialogData.showLogTableData = data.data_list.data.values;
                    this.dialog.isShowLogShow = true
                });
            },
            //限制input输入长度
            handleInputLength(val){
                if (val.length == 200) {
                    this.$message({ message: "已输入200个字符", type: 'warning' })
                }
            },

            //输入限制
            handleInputVal(val){
                // console.log("222",val)
                // this.form.bankAccount = val.replace(/^([1-9]\d*|[0]{1,1})$/g,'')
            },

            filterMethod(query,bool) {
                console.log(query,bool)
                if(bool){
                    this.optionList.optionsListShow = this.optionList.platform_account[this.form.platform_code].child.filter(item =>item.name.indexOf(query)>-1).slice(0, 100);
                }else{
                    this.optionList.optionsListShow = this.optionList.platform_account[this.queryData.platform_code].child.filter(item =>item.name.indexOf(query)>-1).slice(0, 100);
                }
                    this.optionList = {...this.optionList};
            },
            handleFocus() {
                // if (!this.optionList.optionsListShow.length) {
                //     this.optionList.optionsListShow = this.optionList.platform_account[this.form.platform_code].child.slice(0,100);
                // }
            },
            handleSaleAccount(bool){
                if(bool){
                    this.optionList.optionsListShow = this.optionList.platform_account[this.form.platform_code].child.slice(0,100);
                    this.form.saleAccount='';
                }else{
                    this.optionList.optionsListShow = this.optionList.platform_account[this.queryData.platform_code].child.slice(0,100);
                    this.queryData.saleAccount='';
                }
            }
        },
        created() {
            this.handleQueryInfo();
            // try {
            //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.InvoiceInfoConfiguration) === "{}") {
            //         this.handleQueryInfo();
            //     } else {
            //         // 获取保存的查询参数
            //         this.queryData = JSON.parse(this.queryParamsInfo["invoice_info"]);
            //         this.handleQueryInfoCallBack(this.InvoiceInfoConfiguration);
            //     }
            // } catch (e) {
            // }

        },
        computed: {
            // ...mapGetters(['queryParamsInfo', 'InvoiceInfoConfiguration']),
            buttonList(){
                return config.buttonList[this.$options.name]['buttonList']
            },
        },
        watch:{
            form:{
                handler(val){
                    // console.log('销售账号',val.saleAccount)
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="less">
.ui-form-style{
        width: 240px;
}
.proImg {
    width: 50px;
    height: 50px;
    cursor: pointer;
    vertical-align: middle;
    border: 1px solid #ebeef5;
}
/deep/.el-upload-list__item.is-success .el-upload-list__item-status-label {
     display: none;
}
/deep/.el-upload-list--picture .el-upload-list__item {
    padding: 10px 6px 7px 95px;
}
/deep/.el-upload-list__item .el-icon-close{
    display: none!important;
}
.left{
    float: left;
}
.right{
    float: left;
}
/deep/.el-form:after{
    display:block;
    clear:both;
    content:"";
}
// .el-form{
//     display: flex;
// }
</style>