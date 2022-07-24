<template>
        <!-- 留评\消息联系\批量消息联系 -->
        <el-dialog
            class="ui-layout_edit-dialog"
            :title="form.title"
            :append-to-body='true'
            width="800px"
            :visible.sync="isTemplateChooseShow"
            @close="handleOperateCancel()">
            <el-form border style="width: 100%" ref="from" :rules="batchRules" :model="form">
                <div style="display:flex;">
                    <div style="display:flex;">
                        <div>
                            <el-form-item label="模板选择：" label-width="80px">
                                <el-select placeholder="请选择" size="mini" v-model="form.templateChoose" filterable v-filter @change="handleSelectionTemplate()">
                                    <el-option v-for="(value, key, index) in dataComment.template"
                                            :label="value"
                                            :value="key"
                                            :key="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <TemplateEdit :platform="'EB'" class="templateChange" @selectTemplate="templateChange" />
                    </div>
                    <div v-if="form.title!=='留评'">
                        <el-form-item label="添加标签：" label-width="120px">
                            <el-select placeholder="请选择" size="mini" v-model="form.tag_id">
                                <el-option v-for="value in tag"
                                        :label="value.value"
                                        :value="value.id"
                                        :key="value.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                    <ComSelectLanguageV2 @change="changeLanguage" @translate="googleTranslate()" class="translateButton" :list="dataComment.google_lang_code"></ComSelectLanguageV2>
                <el-form-item :label="isTranslate?'翻译前':'正文'" prop="before_translate_content">
                    <el-input size="small" type="textarea" v-model="form.before_translate_content" :rows="isTranslate?8:16" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="翻译后" v-if="isTranslate">
                    <el-input size="small" type="textarea" v-model="form.comment_text" rows="8" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleOperateCancel()" size="small">取 消</el-button>
                <el-button type="primary" @click="handleTemplateChooseConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import config from '@/assets/js/config';
import ComSelectLanguageV2 from "@/views/HomePage/MailCenterManagement/PostMail/components/ComSelectLanguageV2";
import {
    getGoogleTranslate,
    getTemplateDetail,
} from '@/api/MailCenterManagement/PostMail';
import {
    getCommentHeader,
} from '../../../../api/orderInfo/Ebay/OrderListManagement';
import routerConfig from '@/router/routerConfig';
import {getTag} from '../../../../api/MailCenterManagement/Inbox';
import * as storage from '@/utils/storage';
import {
    activeContactConfirm,
} from '../../../../api/orderInfo/Ebay/OrderListManagement';

export default {
    name: "TemplateChooseShow",
    props: {
        activeInfo:{
            type: Object,
            default:{}
        },
        isTemplateChoose:{
            type: Boolean,
            default:false
        },
    },
    components:{
        ComSelectLanguageV2
    },
    data () {
        return {
            //消息联系
            isTemplateChooseShow:false,
            replyBack:{
                item_id:'',//平台item_id
                platform_order_id:"",//平台订单号
                before_translate_content:"",//评价内容
                buyer_id:"",//买家ID
                transaction_id:"",//交易号
                account_id:"",//账号ID
                type:"",
                platform_code:"",//平台
                currency:"",//币种
                sale_price:"",//产品价格
                site_id:"",//平台ID
            },
            dataComment:{
                google_lang_code:{},
                quick_parameter:{},
                template:[]
            },
            tag:[],
            form: {
                template:{},
                templateChoose:"",
                quickParameter:"",
                before_translate_content:"",
                comment_text:"",
                title:'',
                tag_id:"",
            },
            languageCode:'',
            isTranslate:false,
            activeContactRow:{},
            activeContact:{
                reply_title:'',
                reply_content:"",
                reply_content_en:"",
                ebay_order:[]
            },

            batchRules: {
                before_translate_content: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchOrderId: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchPlatform: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                batchRemark: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
                reason: [{
                    required: true,
                    message: "带*号为必填项",
                    trigger: "blur"
                }],
            },
        }
    },
    methods: {
        //消息联系提交
        handleTemplateChooseConfirm(){
            this.replyBack.before_translate_content = this.form.before_translate_content;
            this.replyBack.comment_text = this.form.comment_text?this.form.comment_text:this.form.before_translate_content;
            let tagIndex = this.tag.findIndex((item)=>{ return this.form.tag_id == item.id});
            this.$refs['from'].validate(res => {
                if (res) {
                        this.activeContact={
                            // reply_title: this.form.template.template_title,
                            reply_content:  this.form.comment_text?this.form.comment_text:this.form.before_translate_content,
                            reply_content_en: this.form.before_translate_content,
                            tag: tagIndex>-1?this.tag[tagIndex].value:"",
                            tag_id: this.form.tag_id,
                            ebay_order:[{
                                sender: this.activeContactRow.orderDetailsInfo.store_name||'',
                                item_id: this.activeContactRow.proDetailsInfo[0].item_id,
                                question_type: '',
                                account_id: this.activeContactRow.orderDetailsInfo.cust_account_id,
                                recipient_id: this.activeContactRow.orderDetailsInfo.buyer_id,
                                platform_order_id: this.activeContactRow.orderDetailsInfo.platform_order_id,
                                platform_code: this.activeContactRow.orderDetailsInfo.platform_code,
                                template_id:this.form.templateChoose,
                            }]
                        }
                        activeContactConfirm(this.activeContact).then(({data}) => {
                            if( !data.status ){
                                this.$message.error(data.errorMess || '操作失败！');
                                return;
                            }else{
                                this.$message.success('操作成功！');
                                this.handleOperateCancel();
                            };
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //取消消息联系提交
        handleOperateCancel(){
            // this.isTemplateChooseShow=false;
            // this.form= {
            //     templateChoose:"",
            //     quickParameter:"",
            //     before_translate_content:"",
            //     comment_text:"",
            //     tag_id:"",
            //     title:''
            // }
            // this.activeContact={
            //     reply_title:'',
            //     reply_content:"",
            //     reply_content_en:"",
            //     ebay_order:[]
            // }
            // this.replyBack={};
            // this.isTranslate=false;
            // this.languageCode=false;
            // this.$refs['from'].resetFields();
            this.$emit('handleOperateCancel')
        },
        //模板渲染
        handleSelectionTemplate(){
            // this.form.before_translate_content = this.dataComment.template[this.form.templateChoose];
            getTemplateDetail({id:this.form.templateChoose}).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.before_translate_content += data.data_list.values[0].template_content;
                this.form.template = data.data_list.values[0];
            });
        },
        //常用语言翻译
        changeLanguage(code) {
            if( !this.form.before_translate_content){
                return;
            }
            this.languageCode = code;
        },
        //选择语言翻译
        googleTranslate() {
            if( !this.languageCode ) {
                this.$message.warning('请选择语言后再进行翻译！');
                return;
            }
            if( !this.form.before_translate_content){
                return;
            }
            getGoogleTranslate({
                content: this.form.before_translate_content,
                after : this.languageCode,
                before : "auto"
            }).then(({data}) => {
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.form.comment_text = data.after;
                this.isTranslate=true;
            });
        },
        //获取标签下拉数据
        handleGetTag(){
            getTag({platform_code: 'EB'}).then(({data}) => {
                this.tag = data.data_list;
            });
        },
        //更多按钮
        templateChange(id) {
            this.form.templateChoose = id;
            getTemplateDetail({id}).then(({data}) => {
                this.form.before_translate_content = (this.form.before_translate_content ? this.form.before_translate_content + '\n\n\n' : '') + data.data_list.values[0].template_content;
            });
        },
    },
    watch:{
        isTemplateChoose:{
            handler(newName, oldName) {
                this.activeContactRow = {...this.activeInfo};
                this.form.title = this.activeContactRow.title;
                getCommentHeader({
                    platfrom_code:'EB',
                    type:'2'
                }).then(({data}) => {
                    if (data.status !== 1) {
                        this.$message.error(data.errorMess);
                        return;
                    }
                    this.dataComment = data.data_list;
                    this.handleGetTag();
                    this.isTemplateChooseShow = this.isTemplateChoose;
                }).catch(err => {
                    console.log(err);
                });
            },
    　　    immediate: true
        }
    },
}
</script>
<style lang="less" scoped>
    table {
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        font-size: 12px;

        td {
            border-top: 1px solid #e6e6e6;
            border-left: 1px solid #e6e6e6;
            padding: 5px 10px;
        }
    }
    .triangle {
        display: inline-block;
        border-top: 5px solid #5196fe;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        position: relative;
        top: 3px;
    }
</style>
<style  lang="less">
    .afterId{
        max-height: 500px;
        overflow-y: auto;
    }
    .templateChange{
        padding: 5px;
        /deep/.el-dialog{
            z-index: 2200 !important;
        }
    }
</style>