<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ComSearchCondition
                    :componentName='$options.name'
                    @handleQueryInfo='handleQueryInfo'
                    @handleLoadOk='searchHeight = !searchHeight'
                    @handleDropDownData='handleRequestAddress'/>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button
                size="small"
                type="text"
                @click="isAddShow = true"
                v-if="buttonList['newAdd'].permit(thisVm)"
            >
                <i class="icon-xinzeng1" style="color: #75b1fc"></i>新增
            </el-button>
            <el-button
                size="small"
                type="text"
                @click="batchIsAddShow = true"
                v-if="buttonList['batchNewAdd'].permit(thisVm)"
            >
                <i class="icon-xinzeng1" style="color: #75b1fc"></i>批量新增
            </el-button>
            <el-button
                size="small"
                type="text"
                @click="handleBatchDelete"
                v-if="buttonList['batchDelete'].permit(thisVm)"
            >
                <i class="icon-shanchu1" style="color: #fa686c"></i>批量删除
            </el-button>
        </div>
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
            :tableLoading="tableLoading"
        >
        <!-- 状态 -->
        <template slot-scope="scope" slot="status">
            <span class="ui-state_circle redColor" v-if="scope.row.status === '0'"></span>
            <span class="ui-state_circle greenColor" v-if="scope.row.status === '1'"></span>
            <span v-html="scope.row.status=='1'?'启用':'禁用'"></span>
        </template>
        <!-- SSL  -->
        <template slot-scope="scope" slot="is_receive_ssl">
            <div v-html="scope.row.is_receive_ssl==1?'是':'否'"></div>
        </template>
        <!-- 是否亚马逊邮件服务器发送  -->
        <template slot-scope="scope" slot="is_amazon_send">
            <div v-html="scope.row.is_amazon_send==1?'是':'否'"></div>
        </template>
            <!-- 操作 -->
            <template slot-scope="scope" slot="operate">
                <el-button
                    type="text"
                    @click="handleEdit(scope.row)"
                    v-if="buttonList['edit'].permit(thisVm)"
                >编辑</el-button>
                <ComDivide/>
                <el-button
                    type="text"
                    @click="open(scope.row)"
                    v-if="buttonList['delete'].permit(thisVm)"
                >删除</el-button>
                <ComDivide/>
                <el-button type="text" v-if="buttonList['diaryLog'].permit(thisVm)"  @click="handleOrderLog(scope.row.id)">日志</el-button>
            </template>
        </ComTableInfo>
        <!-- 点击新增/编辑弹窗 -->
        <el-dialog
            :title="isModifyShow ? '编辑' : '新增'"
            width="500px"
            top="5vh"
            class="ui-layout_edit-dialog"
            :visible.sync="isAddShow"
            @close="cancel">
            <el-form label-width="100px" :model="addEMail" ref="addEMail" :rules="addRules">
                <el-form-item label="平台" prop="addPlatform">
                    <el-select v-model="addEMail.addPlatform" size="small" placeholder="请输入平台" filterable v-filter remote :remote-method="handlePlatformPass">
                        <el-option
                            v-for="item in platformOption"
                            :key="item.id"
                            :label="item.id"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱地址" prop="emailAddress">
                    <el-input size="small" v-model.trim="addEMail.emailAddress"></el-input>
                </el-form-item>
                <el-form-item label="密码或授权码" prop="passWord">
                    <el-input size="small" type="password" v-model.trim="addEMail.passWord" placeholder="请输入密码，有授权码则输入授权码"></el-input>
                </el-form-item>
                <el-form-item label="服务类型" prop="serviceType">
                    <el-input size="small" v-model.trim="addEMail.serviceType"></el-input>
                </el-form-item>
                <el-form-item label="接收服务器" prop="theServer">
                    <el-input size="small" v-model.trim="addEMail.theServer"></el-input>
                </el-form-item>
                <el-form-item label="接收端口" prop="servicePort">
                    <el-input size="small" v-model.trim="addEMail.servicePort"></el-input>
                </el-form-item>
                <el-form-item label="发送服务器" prop="sendEailtheServer">
                    <el-input size="small" v-model.trim="addEMail.sendEailtheServer "></el-input>
                </el-form-item>
                <el-form-item label="发送端口" prop="sendPort">
                    <el-input size="small" v-model.trim="addEMail.sendPort "></el-input>
                </el-form-item>
                <el-form-item label="是否开启SSL" prop="addOpenSSL">
                    <el-radio v-model="addEMail.addOpenSSL" label="1">是</el-radio>
                    <el-radio v-model="addEMail.addOpenSSL" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="Amazon SES" prop="amazonTheServerSend">
                    <el-radio v-model="addEMail.amazonTheServerSend" label="1">是</el-radio>
                    <el-radio v-model="addEMail.amazonTheServerSend" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio v-model="addEMail.status" label="1">启用</el-radio>
                    <el-radio v-model="addEMail.status" label="0">禁用</el-radio>
                </el-form-item>
                <el-form-item label="发送加密方式">
                    <el-radio v-model="addEMail.addEncryption" label="no">无加密</el-radio>
                    <el-radio v-model="addEMail.addEncryption" label="ssl">ssl</el-radio>
                    <el-radio v-model="addEMail.addEncryption" label="tls">tls</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="handleNewlyAdded()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 点击批量新增 -->
        <el-dialog
            title="批量新增"
            width="450px"
            class="ui-layout_edit-dialog"
            :visible.sync="batchIsAddShow"
            @close="handleUpload"
            >
            <div>
                <div>
                    <el-upload
                        class="upload-demo"
                        :action="doUpload"
                        ref="upload"
                        :on-success="handleBatchEmailData"
                        :limit="1"
                        :beforeUpload="beforeUpload"
                        :before-remove="beforeRemove"
                        :on-exceed="handleExceed"
                        accept="Excel/xlsx"
                        :file-list='fileList'
                    >
                        <el-button type="primary" size="small">上传</el-button>
                        <div style="position: absolute;left: 100px;top:-5px; line-height:20px;">
                            <el-button type="text"><a href='/attachments/upload_demo/batch_import_demo.xlsx' download>点击下载批量新增邮箱表格模板</a></el-button>
                        </div>
                    </el-upload>
                </div>
            </div>
            <div style="color:#ADADAD;font-size:12px;padding-top:20px;">
                <i class="icon-tishi1"></i><span>温馨提示：文档格式为xls或xlsx，请上传符合格式的Excel文档</span><br/>
                <span style="display: inline-block;padding-left: 86px;">最多支持一次导入500条数据。</span><br/>
                <span style="display: inline-block;padding-left: 86px;">除filter_option其它数据都是必填项。</span><br/>
            </div>
            <div slot="footer">
                <el-button size="small" @click="handleUpload()">取消</el-button>
                <el-button size="small" type="primary" @click="analysisShow=true" :disabled="isAnalysis">解析</el-button>
            </div>
            </el-dialog>
        </el-dialog>
        <!-- 点击批量新增解析按钮 -->
        <el-dialog
            title="解析新增数据"
            width="1300px"
            top="1vh"
            class="ui-layout_edit-dialog"
            :visible.sync="analysisShow"
            >
            <ComTableInfo
            :tableWidth="batchAddPreviewTableWidth"
            :tableKey="batchAddPreviewTableKey"
            :tableProps="batchAddPreviewTableProps"
            :tableData="batchAddPreviewTableData"
            :otherHeight="['el-tabs__header']">
                <!-- 状态 -->
                <template slot-scope="scope" slot="status">
                    <div v-html="scope.row.status==1?'启用':'禁用'"></div>
                </template>
                <!-- SSL  -->
                <template slot-scope="scope" slot="is_receive_ssl">
                    <div v-html="scope.row.is_receive_ssl==1?'是':'否'"></div>
                </template>
                <!-- 是否亚马逊邮件服务器发送  -->
                <template slot-scope="scope" slot="is_amazon_send">
                    <div v-html="scope.row.is_amazon_send==1?'是':'否'"></div>
                </template>
                <!-- 解析状态 -->
                <template slot-scope="scope" slot="analysis_status">
                    <span v-show="scope.row.errors.length<1" style="color:#009900;">解析成功</span>
                    <span v-show="scope.row.errors.length>0" style="color:#FF0000;">邮箱重复</span>
                </template>
            </ComTableInfo>
            <div style="text-align: right;">共识别<span>{{uploadLength}}</span>条数据，成功<span>{{successLength}}</span>条 重复<span>{{repeatLength}}</span>条</div>
            <div slot="footer">
                <el-button size="small" @click="analysisShow=false">取消</el-button>
                <el-button size="small" type="primary" @click="handleBatchNewlyAdded">确定</el-button>
            </div>
        </el-dialog>
        <!-- 日志弹框 -->
        <el-dialog width="950px" class="ui-layout_edit-dialog logs" title="日志" :visible.sync="isShowLogShow">
            <ComPreviewTable
                :isAdaptiveHeight="false"
                :logKey="['操作日志', '操作人', '操作时间']"
                :logProps="['action', 'operator', 'create_time']"
                :logData="showLogTableData"
                :logWidth="['', '180', '180']">
                <template slot-scope="scope" slot="action">
                    <div v-html="scope.row.action"></div>
                </template>
            </ComPreviewTable>
        </el-dialog>
        <!-- 分页 -->
        <div class="ui-main-module-page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageData.currentPage"
                :page-sizes="pageSizes"
                :page-size="pageData.currentList"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.currentTotal"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
// import { mapGetters, mapActions } from "vuex";
import config from "@/assets/js/config";
import {
    mailManagementList, //邮箱管理列表
    addNewMail, //新增邮箱
    editMail,
    deleteMail,
    batchDeleteMail,
    batchImportEmail, //批量新增
    batchImportSubmit,//提交批量导入数据
    platformPass,
    getEmailLog,
} from "../../../api/AccountManagement/mail_management";
import http from '@/http';

export default {
    name: 'MailManagement',
    data() {
        return {
            isAnalysis:true,//是否可以点击解析
            uploadLength:0,//共上传
            successLength:0,//成功多少条
            repeatLength:0,//失败多少条
            searchHeight: false,
            analysisShow:false,//控制解析弹窗
            thisVm: this,
            queryData: {
                mainQuery: {},
                platform:[]
            },
            showSearch: true,
            addEmailInfo: {},
            addEMail: {
                id: "0",
                addPlatform: "", //新增平台信息
                emailAddress: "", //邮箱地址
                passWord: "", //密码
                serviceType: "", //服务类型
                theServer: "", //接受服务器
                servicePort: "", //接受服务端口
                sendEailtheServer: "", //发送邮件服务器
                sendPort: "", //发送端口
                addOpenSSL: "1", //接受是否开启SSL默认值
                addEncryption: "no", //发送加密方式默认值
                amazonTheServerSend: "1", //是否亚马逊邮件服务器发送（Amazon SES）默认值
                status: "1" //状态默认值
            },
            pageSizes: config.pageDatas.pageSizes,
            checkList: [],
            pageData: {
                currentPage: 1,
                currentList: 20,
                currentTotal: 0
            },
            tableKey: [],
            tableWidth: [],
            tableData: [],
            tableProps: [],
            // 表格加载动画
            tableLoading: false,

            isModifyShow: false, //是否修改显示(false是新增显示，true时编辑显示)
            isAddShow: false, //控制弹窗显示隐藏
            batchIsAddShow: false,
            addRules: {
                addPlatform: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                emailAddress: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                passWord: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                serviceType: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                theServer: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                servicePort: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                sendEailtheServer: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                sendPort: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                addOpenSSL: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                amazonTheServerSend: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "带*号为必填项",
                        trigger: "blur"
                    }
                ]
            },
            whetherEncryption: "true",
            encryptionMode: "true",
			fileList: [],
            doUpload:'/api/system_set/email_set/batch_import_prview',
            batchAddPreviewTableWidth:[],
            batchAddPreviewTableKey:[],
            batchAddPreviewTableProps:[],
            batchAddPreviewTableData:[],
            addressPlatform:'',
            platformOption:[],
            //日志
            isShowLogShow:false,
            showLogTableData:[],
        };
    },
    methods: {
        mailManagementList,
        addNewMail,
        editMail,
        deleteMail,
        batchDeleteMail,
        batchImportEmail,
        batchImportSubmit,
        platformPass,
        // ...mapActions(["mailManagementList"]),

        handleRequestAddress(info){//获取平台数据的请求地址
            this.platformOption = info.optionValue
            this.addressPlatform = info.url_address
            this.queryData.platform = info.optionValue
            this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
                key: "mail_management",
                value: JSON.stringify(this.queryData)
            });
        },

        handlePlatformPass(platformId){
            let obj={
                account_name:platformId,
            }
            let url = this.addressPlatform.substring(4)
            http.getAjax(url,obj).then(({data}) => {
                if (data.status !== 1){
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.platformOption = data.data_list
            })
        },
        // 查询     isSave：使用缓存的搜索参数进行查询 此参数需设为 true
        handleQueryInfo(params, isSave, isComSearch) {
            this.queryData.mainQuery = {...(params || {})};     // 用来缓存
            // 判断是否取缓存参数
            // if (isSave) {
            //     this.queryData = JSON.parse(this.queryParamsInfo['mail_management']);
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
                now_page: isSave ? this.pageData.currentPage : 1,     // 不取缓存就要重置页数
                page_size: this.pageData.currentList
            };

            this.tableLoading = true;
            this.mailManagementList(obj).then(({data}) => {
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
            // this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
            //     key: "mail_management",
            //     value: JSON.stringify(this.queryData)
            // });
            //数据渲染
            this.tableData = data.data_list.value;
            this.tableProps = ["platform_code","emailaddress","status","server_type","receive_server","is_receive_ssl","receive_port","send_server","send_port","send_encrypt_type","filter_option","is_amazon_send","create_by","create_time","modify_by","modify_time","operate"];
            this.tableWidth = ["80","150","60","80","100","50","70","100","70","90","80","140","70","150","70","140","145"];
            this.tableKey = ["平台CODE","邮箱","状态","服务类型","接受服务器","SSL","接收端口","发送服务器","发送端口","发送加密方式","过滤文件夹","是否亚马逊服务器发送","创建人","创建时间","修改人","修改时间","操作"];
            // this.tableKey = data.data_list.key;
            // this.tableKey.operate = "操作"
            // console.log(this.tableKey)
            //渲染分页
            this.pageData.currentList = data.page_data.limit * 1;
            this.pageData.currentPage = data.page_data.nowpage * 1;
            this.pageData.currentTotal = data.page_data.total * 1;

            // 重置表格高度
            this.searchHeight = !this.searchHeight;
        },
        //编辑按钮
        handleEdit(row) {
            this.isModifyShow = true;
            this.isAddShow = true;
            this.addEMail = {
                id: row.id,
                addPlatform: row.platform_code,
                emailAddress: row.emailaddress,
                passWord: row.password,
                serviceType: row.server_type,
                theServer: row.receive_server,
                servicePort: row.receive_port,
                addOpenSSL: row.is_receive_ssl,
                sendEailtheServer: row.send_server,
                sendPort: row.send_port,
                addEncryption: row.send_encrypt_type,
                amazonTheServerSend: row.is_amazon_send,
                status: row.status
            };
        },
        //新增编辑弹框
        handleNewlyAdded() {
            this.$refs["addEMail"].validate(res => {
                if (res) {
                    let newObj = {
                        id: this.addEMail.id,
                        platform_code: this.addEMail.addPlatform, //	平台Code
                        emailaddress: this.addEMail.emailAddress, //	邮箱地址
                        password: this.addEMail.passWord, //密码
                        server_type: this.addEMail.serviceType, //服务类型
                        receive_server: this.addEMail.theServer, //接收服务器
                        receive_port: this.addEMail.servicePort, //接收服务端口
                        is_receive_ssl: this.addEMail.addOpenSSL, //是否开启SSL
                        send_server: this.addEMail.sendEailtheServer, //发送邮件服务器
                        send_port: this.addEMail.sendPort, //发送端口
                        send_encrypt_type: this.addEMail.addEncryption, //发送加密方式
                        is_amazon_send: this.addEMail.amazonTheServerSend, //是否亚马逊邮件服务器发送
                        status: this.addEMail.status //状态
                    };
                    if (!this.isModifyShow) {
                        this.addNewMail(newObj).then(({ data }) => {
                            this.succeedCallBack(data);
                        });
                    } else {
                        this.editMail(newObj).then(({ data }) => {
                            this.succeedCallBack(data);
                        });
                    }
                }
            });
        },
        //操作成功回调
        succeedCallBack(data) {
            if (data.status) {
                this.$message.success("操作成功！");
                this.handleQueryInfo({...this.queryData.mainQuery}, true);
                if(this.isAddShow){
                    this.cancel();
                }
                this.analysisShow = false;
                this.batchIsAddShow = false;
            } else {
                this.$message.error(data.errorMess || "操作失败！");
            }
        },
        // 列表勾选
        handleCheck(row) {
            this.checkList = row;
		},
        //上传成功获取上传的数据
        handleBatchEmailData(response, file, fileList){
            if(response.total>500||!response.status){
                this.standardTips()
                return;
            }else{
                this.isAnalysis = false
            }
            this.batchAddPreviewTableWidth=["70","100","190","130","50","80","130","150","100","130","90","90","150","80","80"]
            this.batchAddPreviewTableKey=["序号","平台CODE","邮箱地址","邮箱密码/授权码","状态","服务类型","接受服务器地址","接受是否开启SSL加密","接受服务端口","发送服务器地址","发送服务端口","发送加密方式","是否亚马逊服务器发送","过滤文件夹","解析状态"]
            this.batchAddPreviewTableProps=["index","platform_code","emailaddress","password","status","server_type","receive_server","is_receive_ssl","receive_port","send_server","send_port","send_encrypt_type","is_amazon_send","filter_option","analysis_status"]
            this.batchAddPreviewTableData=response.data
            this.uploadLength = response.total
            this.successLength = response.success_record
            this.repeatLength = response.repeat_record

        },
        //将数据上传至数据库
        handleBatchNewlyAdded (){
            let obj ={
                params: JSON.stringify(this.batchAddPreviewTableData)
            }
            this.batchImportSubmit(obj).then(({ data }) => {
                this.succeedCallBack(data);
            });
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        beforeRemove(file, fileList) {
            this.isAnalysis = true
        },
        //删除提示框
        open(row) {
            this.$confirm("删除的数据将无法恢复，确认删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    if (row) {
                        this.handledelete(row);
                    } else {
                        this.BatchDelete();
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        beforeUpload(file) {
            let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            let extArr = ['xls' , 'xlsx'];
            let size = file.size / 1024 / 1024 < 10;
            if( !extArr.includes(ext) ){
                this.standardTips()
                return false;
            }
        },
        standardTips(){
            this.$refs.upload.clearFiles();
            this.isAnalysis = true
            this.$alert('请上传符合格式的文档', {
                confirmButtonText: '确定',
                type: "warning"
            });
        },
        //删除
        handledelete(row) {
            let deleteObj = {
                id: row.id
            };
            this.deleteMail(deleteObj).then(({ data }) => {
                this.succeedCallBack(data);
            });
        },
        //批量删除勾选数据判断
        handleBatchDelete() {
            if (!this.checkList.length) {
                this.$message.warning("请勾选列表数据");
                return;
            }
            this.open();
        },
        //批量删除
        BatchDelete() {
            let obj = { id: "" };
            for (let i = 0; i < this.checkList.length; i++) {
                obj.id += this.checkList[i].id + ",";
            }
            obj.id = obj.id.substring(0, obj.id.length - 1);
            this.batchDeleteMail(obj).then(({ data }) => {
                this.succeedCallBack(data);
            });
        },
        // 分页条数切换
        handleSizeChange(val) {
            this.pageData.currentPage = 1;
            this.pageData.currentList = val;
            this.handleQueryInfo({...this.queryData.mainQuery}, true);
        },
        // 跳转页数切换
        handleCurrentChange(val) {
            this.pageData.currentPage = val;
            this.handleQueryInfo({...this.queryData.mainQuery}, true);
        },
        //取消（关闭弹窗）
        cancel() {
            this.isAddShow = false;
            this.isModifyShow = false;
            //重置表单域，清除验证
            this.$refs["addEMail"].resetFields();
        },
        handleUpload(){
            this.batchIsAddShow=false;
            this.$refs.upload.clearFiles();
        },
        //日志
        handleOrderLog(id){
            let obj = {
                id: id
            }
            this.isShowLogShow = true
            getEmailLog(obj).then(({data}) => {
                if (data.status !== 1) {
                    // this.$message.error(data.errorMess);
                    return
                }
                this.showLogTableData = data.data_list.value;
            }).catch(err => {
                console.log(err);
            });
        },
    },
    computed: {
        // ...mapGetters(["queryParamsInfo", "mailManagementMation"],),
        buttonList(){
            return config.buttonList[this.$options.name]['buttonList']
        },
    },
    created() {
        // try {
        //     if (this.$route.query._cacheType === '1' || JSON.stringify(this.mailManagementMation) === "{}") {
        //         // this.handleQueryInfo();
        //     } else {
        //         // 获取保存的查询参数
        //         this.queryData = JSON.parse(this.queryParamsInfo['mail_management']);
        //         this.platformOption = this.queryData.platform
        //         this.handleQueryInfoCallBack(this.mailManagementMation);
        //     }
        // } catch (e) {
        //     console.log(e);
        // }
    }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
    padding-right: 60px;
}
.el-input.el-input--small {
    width: 100% !important;
}
/deep/.el-input.el-input--small.el-input--suffix,
.el-select.el-select--small {
    width: 100% !important;
}
/deep/.el-dialog__header {
    height: 20px;
}
/deep/.el-upload.el-upload--text {
    text-align: left;
}
/deep/.el-dialog__body {
    padding: 30px 20px;
    .upload-demo{
        position: relative;
        .el-upload-list__item-name{
            width: 350px;
        }
    }
}
</style>