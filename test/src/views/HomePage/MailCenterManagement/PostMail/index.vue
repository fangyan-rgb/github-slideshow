<style lang="less">
.PostMailwrap {
    // background-color: #fff;
    padding: 10px 20px 0 10px;

    // .PostMailbox {
        // padding: 10px 15px 0px;
        // border: 1px solid #e6e6e6;
    // }

    /deep/ .cuslabelheight66 {
        & > .el-form-item__label {
            line-height: 45px;
        }
    }

    .cusformrightbg {
        padding: 5px 0 0;
        border: 1px solid #e6e6e6;
        background: #f2f2f2;
        .el-form-item{
            margin-bottom: 5px !important;
        }
    }

    .postmailsubmit{
        display: flex;
    }

    .uploadbox {
        padding: 0 0 3px;
        margin-left: 60px;
        color: #666;
        border-bottom: 1px solid #e6e6e6;
        & > div{
            width: 666px;
        }
    }

    /deep/ .el-form-item__label, .el-form-item__content {
        font-size: 12px;
    }

    .el-form-item{
        margin-bottom: 10px;
        .el-form-item{
            margin-bottom: 0;
        }
    }

    .elloadingbtn{
        .el-loading-spinner{
            margin-top: -6px;
        }
    }
}

.is-required .el-form-item__label::before{
    position: static !important;
}

.el-form-item__label{
    color: #333 !important;
}

// 下拉框z-index  信息弹框z-index           遮罩层
.zindexhighest, .el-message-box__wrapper, .el-loading-mask{
    z-index: 10002 !important;
}

// 消息弹框
.el-message{
    z-index: 10003 !important;
}
</style>

<template>
    <div class="PostMailwrap">
        <div class="PostMailbox">
            <el-form :model="sendForm" :rules="formRules" ref="sendForm" label-width="90px" size="mini">
                <el-form-item label="系统订单号：">
                    <el-row>
                        <el-col :span="12">
                            <el-input v-model.trim="sendForm.order_id" @keyup.enter.native="loadInfo()" placeholder="多个订单号用英文 , 隔开"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <el-button @click="loadInfo()" type="primary" style="margin-left: 15px;">加载信息(Enter)</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="平台账号：">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="account_id">
                                <el-select v-model="sendForm.account_id" filterable v-filter @change="accountIdChange" popper-class="zindexhighest" style="width: 100%;">
                                    <el-option
                                        v-for="(v, k, i) in optionListLabel.accountId"
                                        :label="v"
                                        :value="k"
                                        :key="i">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="发件人：">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="sender_email">
                                <el-input v-model.trim="sendForm.sender_email" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="收件人：">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="receive_email">
                                <el-input v-model.trim="sendForm.receive_email"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="主题：">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="title">
                                <el-autocomplete
                                    v-model="sendForm.title"
                                    :fetch-suggestions="subjectQuerySearch"
                                    placeholder="请输入或选择主题"
                                    style="width: 100%;">
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <MailSubjectEditor :platform="platform" @success="getSubjectListFn" />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="操作：">
                    <div class="cusformrightbg">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="模板选择：">
                                    <el-select v-model="sendForm.template_id" filterable v-filter @change="templateChange" popper-class="zindexhighest">
                                        <el-option
                                            v-for="(v, k, i) in optionListLabel.template"
                                            :label="v"
                                            :value="k"
                                            :key="i">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="快捷参数：">
                                    <el-select v-model="sendForm.quick_parameter" filterable v-filter @change="changeQuickParameter" popper-class="zindexhighest" :disabled="(sendForm.receive_email || '').split(',').length > 1">
                                        <el-option
                                            v-for="(v, k, i) in optionListLabel.quick_parameter"
                                            :label="v"
                                            :value="k"
                                            :key="i">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="个性标签：">
                                    <el-select v-model="sendForm.tag_id" filterable v-filter popper-class="zindexhighest">
                                        <el-option
                                            v-for="(v, k, i) in optionListLabel.tag_id"
                                            :label="v"
                                            :value="k"
                                            :key="i">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <div style="padding: 0 0 8px 10px;">
                                    <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" :list="optionListLabel.google_lang_code"></ComSelectLanguageV2>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
                <div v-if="sendForm.content_type == '2'">
                    <el-form-item prop="content" :label="languageCode ? '翻译前：' : '正文：'">
                        <el-input v-model="sendForm.content" type="textarea" :rows="languageCode ? '14' : '29'" style="display: none;"></el-input>
                        <WangEditor v-model="sendForm.content" :styleObj="{height: languageCode ? '255px' : '550px'}" key="WangEditor1" ref="WangEditor1"></WangEditor>
                    </el-form-item>
                    <el-form-item v-if="languageCode" label="翻译后：">
                        <el-input v-model="sendForm.content_after" type="textarea" rows="11" style="display: none;"></el-input>
                        <WangEditor v-model="sendForm.content_after" :styleObj="{height: '255px'}" key="WangEditor2" ref="WangEditor2"></WangEditor>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item prop="content" :label="languageCode ? '翻译前：' : '正文：'">
                        <el-input v-model="sendForm.content" id="maintextarea" type="textarea" :rows="languageCode ? '14' : '29'"></el-input>
                    </el-form-item>
                    <el-form-item v-if="languageCode" label="翻译后：">
                        <el-input v-model="sendForm.content_after" type="textarea" rows="14"></el-input>
                    </el-form-item>
                </div>
                <el-form-item>
                    <div class="postmailsubmit">
                        <div>
                            <el-button @click="sendFn()" type="primary">发送</el-button>
                            <el-button @click="saveFn()" type="primary">存为草稿</el-button>
                            <!-- <el-button @click="cancel()" v-if="$route.query.type">取消</el-button> -->
                        </div>
                        <div class="uploadbox">
                            <el-upload
                                action="/api/system_set/general_upload/upload"
                                :file-list="fileList"
                                :data="{
                                    staff_code: JSON.parse(getSessionStorage('userInfo')).staff_code,
                                    uid: JSON.parse(getSessionStorage('userInfo')).uid
                                }"
                                name="userfile"
                                :on-success="UpSuccess"
                                :on-remove="UpRemove"
                                :beforeUpload="beforeUpload"
                                :on-preview="UpPreview"
                                :limit="5"
                                :on-exceed="overLimitFn"
                                ref="upFile"
                                :key="uploadKey"
                                :disabled="fileUploading">
                                <el-button type="primary" v-loading="fileUploading" element-loading-spinner="el-icon-loading" class="elloadingbtn">上传附件</el-button>&nbsp;&nbsp;&nbsp;
                                <span slot="tip">支持gif、jpg、png、jpeg、bmp、pdf、docx、xlsx、doc、xls、zip、rar格式，大小不能超过8M</span>
                            </el-upload>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {
    sendEmail,
    saveDraftEmail,
    getDraftBoxMail,
    getOutBoxMail,
    getInBoxMail,
    getOrderProItem,
    getItemTemplate,
    getTemplateDetail,
    getGoogleTranslate,
    getAccountIdList,
    getEmailById,
    getSubjectList,
} from '@/api/MailCenterManagement/PostMail';
import routerConfig from '@/router/routerConfig';
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import mailConfig from "@/assets/js/mailProcessingConfig";
import * as storage from '@/utils/storage';
import { getSessionStorage } from '@/utils/storage';

export default {
    name: 'PostMail',
    data () {
        const validateMail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入'));
            }else{
                let flag = true;
                value.split(',').forEach(e => {
                    if( !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e) ){
                        flag = false;
                    }
                });
                if( flag ){
                    callback();
                }else{
                    callback(new Error('请输入正确的邮箱'));
                }
            }
        };
        return {
            sendForm: {
                order_id: '',
                platform_order_id: '',
                receive_email: '',
                receive_name: '',
                account_id: '',
                content: '',
                content_after: '',
                content_type: '',
                buyer_id: '',
                attachments: '',
                attachments_name: '',
                site_id: '',
                sender_email: '',
                sender_name: '',
                platform_code: '',
                title: '',
                template_id: '',
                type: '',
                inbox_id: '',
                quick_parameter: '',
                tag_id: '',
            },

            // 查询下拉框数据
            optionListLabel: {
                google_lang_code: {},
                tag_id: {},
                template: {},
                quick_parameter: {},
                parameter: {},
                accountId: {},
                subjectList: [],
            },

            // 平台
            platform: 'Amazon',

            // 上传文件列表
            fileList: [],
            uploadKey: 0,
            fileUploading: false,

            // 选择语言
            languageCode: '',

            // 表单验证
            formRules: {
                sender_email: [
                    { validator: validateMail, trigger: 'blur' },
                    { required: true, trigger: 'blur' }
                ],
                receive_email: [
                    { validator: validateMail, trigger: 'blur' },
                    { required: true, trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                account_id: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },

            MailProcessingArr: JSON.parse(JSON.stringify(mailConfig.paramsRouterObj)),

            // 保存路由数据，判断是否重置数据
            curRouterData: ''
        }
    },
    components: {ComSelectLanguageV2},
    mounted() {

    },
    activated() {
        // 路由变化就重置数据
        if( this.curRouterData !== this.$route.fullPath ){
            this.curRouterData = this.$route.fullPath;
            this.initData();
        }
    },
    methods: {
        getSessionStorage,

        // 页面初始化
        initData() {
            this.handleResetQueryInfo();
            if( this.$route.query.id ){
                switch (this.$route.query.type) {
                    case 'DraftBox':
                        // 草稿箱
                        getDraftBoxMail({id: this.$route.query.id}).then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败')
                                return;
                            }
                            this.sendForm = {
                                ...this.sendForm,
                                ...data.data_list,
                                sender_email: '',
                                template_id: data.data_list.template_id == '0' ? '' : data.data_list.template_id,
                                title: data.data_list.subject,
                                point: 'draftbox'
                            };
                            if( this.sendForm.content_type == '2' ) {
                                // 填充编辑器内容
                                this.$nextTick(() => {
                                    this.$refs.WangEditor1.handleSetValue(this.sendForm.content);
                                });
                            }
                            // 填充已传文件列表
                            let files = (this.sendForm.attachments || '').split(',');
                            if( this.sendForm.attachments && files.length ){
                                files.forEach((e, i) => {
                                    let name = '附件' + (i+1);
                                    if( this.sendForm.attachments_name && this.sendForm.attachments_name.split(',')[i] ){
                                        name = this.sendForm.attachments_name.split(',')[i];
                                    }
                                    this.fileList.push({
                                        name: name,
                                        url: e
                                    });
                                });
                            }
                            // 加载信息
                            this.loadInfo();
                        });
                        break;
                    case 'Inbox':
                        // 收件箱
                        getInBoxMail({id: this.$route.query.id}).then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败')
                                return;
                            }
                            this.sendForm = {
                                ...this.sendForm,
                                ...data.data_list,
                                sender_email: '',
                                title: data.data_list.subject,
                                point: 'inbox'
                            };
                            if( this.sendForm.content_type == '2' ) {
                                // 填充编辑器内容
                                this.$nextTick(() => {
                                    this.$refs.WangEditor1.handleSetValue(this.sendForm.content);
                                });
                            }
                            // 填充已传文件列表
                            let files = (this.sendForm.attachments || '').split(',');
                            if( this.sendForm.attachments && files.length ){
                                files.forEach((e, i) => {
                                    let name = '附件' + (i+1);
                                    if( this.sendForm.attachments_name && this.sendForm.attachments_name.split(',')[i] ){
                                        name = this.sendForm.attachments_name.split(',')[i];
                                    }
                                    this.fileList.push({
                                        name: name,
                                        url: e
                                    });
                                });
                            }
                            // 加载信息
                            this.loadInfo();
                        });
                        break;
                    case 'Outbox':
                        // 发件箱
                        getOutBoxMail({id: this.$route.query.id}).then(({data}) => {
                            if (data.status !== 1) {
                                this.$message.error(data.errorMess || '操作失败')
                                return;
                            }
                            this.sendForm = {
                                ...this.sendForm,
                                ...data.data_list,
                                sender_email: '',
                                title: data.data_list.subject,
                                point: 'outbox'
                            };
                            if( this.sendForm.content_type == '2' ) {
                                // 填充编辑器内容
                                this.$nextTick(() => {
                                    this.$refs.WangEditor1.handleSetValue(this.sendForm.content);
                                });
                            }
                            // 填充已传文件列表
                            let files = (this.sendForm.attachments || '').split(',');
                            if( this.sendForm.attachments && files.length ){
                                files.forEach((e, i) => {
                                    let name = '附件' + (i+1);
                                    if( this.sendForm.attachments_name && this.sendForm.attachments_name.split(',')[i] ){
                                        name = this.sendForm.attachments_name.split(',')[i];
                                    }
                                    this.fileList.push({
                                        name: name,
                                        url: e
                                    });
                                });
                            }
                            // 加载信息
                            this.loadInfo();
                        });
                        break;
                }
            }

            getItemTemplate().then(({data})=> {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.optionListLabel = {...this.optionListLabel, ...data.data_list};
            });

            getAccountIdList({platform_code: this.platform}).then(({data})=> {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                this.optionListLabel.accountId = data.data_list.account_id;
            });

            this.getSubjectListFn();
        },
        // 执行操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success('操作成功！');
                this.$router.push({path: this.$route.path});

                this.changeNavShowFn(this.$route.path);
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        },

        // 重置
        handleResetQueryInfo(){
            this.sendForm = {
                order_id: '',
                platform_order_id: '',
                receive_email: '',
                receive_name: '',
                account_id: '',
                content: '',
                content_after: '',
                content_type: '',
                buyer_id: '',
                attachments: '',
                attachments_name: '',
                site_id: '',
                sender_email: '',
                sender_name: '',
                platform_code: '',
                title: '',
                template_id: '',
                type: '',
                inbox_id: '',
                quick_parameter: '',
                tag_id: '',
            };
            // 清空文件
            this.fileList = [];
            this.$refs.upFile.clearFiles();
            // 重置验证
            this.$refs.sendForm.resetFields();
            // 填充编辑器内容
            if( this.$refs.WangEditor1 ){
                this.$refs.WangEditor1.handleSetValue(this.sendForm.content);
            }
            if( this.$refs.WangEditor2 ){
                this.$refs.WangEditor2.handleSetValue(this.sendForm.content_after);
            }
        },

        changeLanguage(code) {
            this.languageCode = code;
        },

        googleTranslate() {
            if( !this.languageCode ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.sendForm.content ){
                return;
            }
            getGoogleTranslate({
                content: this.sendForm.content_type == '2' ? this.$refs.WangEditor1.handleGetText() : this.sendForm.content,
                after : this.languageCode,
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.sendForm.content_after = data.after;
                if( this.sendForm.content_type == '2' ) {
                    // 填充编辑器内容
                    this.$refs.WangEditor2.handleSetValue(this.sendForm.content_after);
                }
            });
        },

        UpSuccess(response, file, fileList) {
            this.fileUploading = false;
            if( response.status !== 1 ){
                this.$message.error(response.errorMess || '上传失败！');
                this.uploadKey++;
                return;
            }
            this.fileList.push({name: file.name, url: file.response.file_path, size: file.size});
        },
        UpRemove(file, fileList) {
            this.fileList = JSON.parse(JSON.stringify(fileList));
        },
        overLimitFn(files, fileList){
            this.$message.error('最多上传五个附件！');
        },
        beforeUpload(file) {
            // 格式检查
            let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            let extArr = ['gif', 'jpg', 'png', 'jpeg', 'bmp', 'pdf', 'docx', 'xlsx', 'doc', 'xls', 'zip', 'rar'];
            if( !extArr.includes(ext) ){
                this.$message.error('文件格式不符合！');
                return false;
            }

            // 当前文件大小检查
            let maxSize = 1024 * 1024 * 8;
            if( file.size > maxSize ){
                this.$message.error('文件大小必须在8m以内！');
                return false;
            }
            // 所有文件大小检查
            let allSize = this.fileList.map(e => e.size).reduce((total, currentValue, currentIndex, arr)=>{
                return total + currentValue;
            }, 0);
            if( file.size + allSize > maxSize ) {
                this.$message.error('所有文件大小必须在8m以内！');
                return false;
            }
            this.fileUploading = true;
        },
        UpPreview(file) {
            window.open('http://crmupload.yibainetwork.com:82' + file.url);
        },

        sendFn(isDraft) {
            this.$refs.sendForm.validate((valid) => {
                if (valid) {
                    let obj = {
                        ...this.sendForm,
                        attachments: this.fileList.map(e => e.url).join(','),
                        attachments_name: this.fileList.map(e => e.name).join(','),
                        sender_email: (this.sendForm.sender_email || '').split(','),
                        account_id: (this.sendForm.account_id || '').split(','),
                        order_id: (this.sendForm.order_id || '').split(','),
                        platform_order_id: (this.sendForm.platform_order_id || '').split(','),
                        receive_email: (this.sendForm.receive_email || '').split(','),
                        receive_name: (this.sendForm.receive_name || '').split(','),
                        content: [this.sendForm.content],
                        buyer_id: (this.sendForm.buyer_id || '').split(','),
                        platform_code: this.platform,
                    };
                    let fn = !isDraft ? sendEmail : saveDraftEmail;
                    fn(obj).then(({data}) => {
                        if (data.status !== 1) {
                            this.$message.error(data.errorMess || '操作失败')
                            return;
                        }
                        this.handleResetQueryInfo();
                        this.handleOperationCallBack(data);
                    });
                }
            });
        },

        saveFn() {
            this.$confirm('确认存为草稿?', '提示', {
                type: 'warning'
            }).then(() => {
                this.sendFn(true);
            }).catch(() => {

            });
        },

        loadInfo() {
            if( !this.sendForm.order_id ){
                // 填充发件人
                this.accountIdChange(this.sendForm.account_id);
                return;
            }
            getOrderProItem({order_id: this.sendForm.order_id, platform_code: this.platform}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败')
                    return;
                }
                if( !data.data_list.data ) {
                    this.$message.error('加载不到信息！');
                    return;
                }
                let ordLen = this.sendForm.order_id.split(',').length;
                let rData = data.data_list.data;
                if( ordLen === 1 ){
                    this.sendForm = {...this.sendForm, ...rData, ...{
                        site_id: rData.site,
                        receive_email: rData.email,
                        receive_name: rData.ship_name,
                        sender_email: rData.seller_email ? rData.seller_email : this.sendForm.sender_email
                    }};
                    this.optionListLabel = {...this.optionListLabel, ...{parameter: rData}};
                }else{
                    let sendEmail = [];
                    let platformOrderId = [];
                    let buyerId = [];
                    let accountId = [];
                    for( let i = 0; i < ordLen; i++ ){
                        if( rData && rData[i] && rData[i].seller_email ){
                            if( !sendEmail.find(e => e === rData[i].seller_email) ){
                                sendEmail.push(rData[i].seller_email);
                            }
                        }
                        if( rData && rData[i] && rData[i].platform_order_id ){
                            platformOrderId.push(rData[i].platform_order_id);
                        }
                        if( rData && rData[i] && rData[i].buyer_id ){
                            buyerId.push(rData[i].buyer_id);
                        }
                        if( rData && rData[i] && rData[i].account_id ){
                            accountId.push(rData[i].account_id);
                        }
                    }
                    sendEmail = sendEmail.join(',');
                    platformOrderId = platformOrderId.join(',');
                    buyerId = buyerId.join(',');

                    // 检测平台账号是否一致
                    if( [...new Set([...accountId])].length != 1 ){
                        this.$message.warning('订单号中的平台账号不一样，请选择相同的平台账号发送！');
                        return;
                    }

                    accountId = accountId[0];
                    this.sendForm = {
                        ...this.sendForm,
                        ...{
                            order_id: this.sendForm.order_id,
                            platform_order_id: platformOrderId,
                            receive_email: rData.email,
                            receive_name: '',
                            account_id: accountId,
                            buyer_id: buyerId,
                            site_id: '',
                            sender_email: sendEmail ? sendEmail : this.sendForm.sender_email,
                            sender_name: '',
                            template_id: '',
                            inbox_id: '',
                            quick_parameter: '',
                            tag_id: '',
                        }
                    };
                    this.optionListLabel = {...this.optionListLabel, ...{parameter: {}}};
                }
            });
        },

        subjectQuerySearch(queryString, cb) {
            let results = queryString ? this.optionListLabel.subjectList.filter(e => e.value.toLowerCase().includes(queryString.toLowerCase())) : this.optionListLabel.subjectList;
            cb(results);
        },

        getSubjectListFn() {
            getSubjectList().then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.optionListLabel.subjectList = Object.keys(data.data_list).map(e => {return {value: e}});
            });
        },

        templateChange(id) {
            getTemplateDetail({id}).then(({data}) => {
                let str = this.sendForm.content;
                this.sendForm.content = (str ? str + '\n\n\n' : '') + data.data_list.values[0].template_content;
                if( this.sendForm.content_type == '2' ) {
                    // 填充编辑器内容
                    this.$refs.WangEditor1.handleSetValue((str ? str + '<p><br></p><p><br></p>' : '') + data.data_list.values[0].template_content);
                }
            });
        },

        changeQuickParameter(v) {
            if( !this.optionListLabel.parameter[v] ){
                this.$message.warning('快捷参数内容为空！');
                return;
            }
            if( this.sendForm.content_type == '2' ) {
                this.$refs.WangEditor1.handleInsertText(this.optionListLabel.parameter[v]);
            }else{
                this.insertText(document.getElementById('maintextarea'), this.optionListLabel.parameter[v]);
                this.moveEnd(document.getElementById('maintextarea'));
            }
        },

        // 在textarea光标位置插入文本
        insertText(obj, str) {
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.text = str;
            } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                // obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                this.sendForm.content = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                // obj.value += str;
                this.sendForm.content += str;
            }
        },

        moveEnd(obj) {
            this.$nextTick(() => {
                obj.focus();
                // var len = obj.value.length;
                // if (document.selection) {
                //     var sel = obj.createTextRange();
                //     sel.moveStart('character', len);
                //     sel.collapse();
                //     sel.select();
                // } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                //     obj.selectionStart = obj.selectionEnd = len;
                // }
            });
        },

        cancel() {
            if( this.$route.query.goBackUrl ){
                let route = JSON.parse(this.$route.query.goBackUrl);
                let path = route.path;
                let query = route.query;
                this.$router.push({path, query});

                // 如果是邮件处理页来的
                let MailArr = [];   // 邮件处理页签名称数组
                for (let key in this.MailProcessingArr) {
                    if (this.MailProcessingArr.hasOwnProperty(key)) {
                        let element = this.MailProcessingArr[key];
                        MailArr.push(element.pathName);
                    }
                }
                if( route.pathName && MailArr.includes(route.pathName) ){
                    // 添加tab标签
                    this.$store.commit('SAVE_TAB_LABELS', {
                        path: path,
                        name: route.pathName,
                        index: path,
                        query
                    });
                    this.$store.commit('SAVE_NAV_INDEX', path);
                }else{
                    this.changeNavShowFn(path);
                }
            }else{
                let path = '/' + this.$route.query.type;
                this.$router.push({path});

                this.changeNavShowFn(path);
            }
        },
        changeNavShowFn(path, query = {}) {
            let idx = routerConfig.getRouteIndex(path);
            storage.setSessionStorage('navActive', idx);
            let to = routerConfig.navJumpFn(idx);
            this.$store.commit('SAVE_TAB_LABELS', {
                path: to.path,
                name: to.name,
                index: idx,
                query
            });
            this.$store.commit('SAVE_NAV_INDEX', idx);
        },

        // 改变平台账号
        accountIdChange(v) {
            if( !v ){
                return;
            }
            getEmailById({account_id: v, platform_code: this.platform}).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '网络请求失败！');
                    return;
                }
                this.sendForm.sender_email = data.data_list.seller_email;
            });
        },
    },
    watch: {
        $route(to, from) {
            // 页面内切换路由
            if( to.path == this.curRouterData.split('?')[0] && from.path == this.curRouterData.split('?')[0] ){
                // 路由变化就重置数据
                if( this.curRouterData !== to.fullPath ){
                    this.curRouterData = to.fullPath;
                    this.initData();
                }
            }
        }
    }
}
</script>
