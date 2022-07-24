<style lang="less">
.MailProcessingwrap {
    min-width: 1683px;
    font-size: 12px;
    .MailProcessingbox{
        .MailProcessingsubject{
            margin: 11px 15px 3px;
            padding: 8px 3px 8px 8px;
            border: 1px solid #ffe0af;
            background: #fcf7f1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .subjectremark{
                flex: auto;
                width: 0;
                margin-right: 10px;
            }
            .remarkspan{
                color: #5c9ffc;
                cursor: pointer;
            }
        }
        .MailProcessingitem{
            border: 1px solid #e5e7e6;
            background: #fff;
            margin-bottom: 9px;
            &:last-child{
                margin-bottom: 0;
            }
            .MailProcessingitemhead{
                min-height: 26px;
                padding: 5px 11px;
                border-bottom: 1px solid #e5e7e6;
                overflow: hidden;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-tag {
                    color: #343436;
                    border-color: #cde0fb;
                    background: #cde0fb;
                    border-radius: 100px;
                    /deep/ .el-icon-close{
                        width: 15px;
                        height: 15px;
                        background: transparent;
                        color: #343436;
                        border: 1px solid #343436;
                        // visibility: hidden;
                    }
                    &:hover{
                        /deep/ .el-icon-close{
                            visibility: visible;
                        }
                    }

                    & + .el-tag{
                        margin-left: 10px;
                    }
                }
                .alignselfflexend{
                    align-self: flex-end;
                }
                .itemheadorderlist{
                    flex: auto;
                    display: flex;
                    padding: 0 20px;
                    div{
                        width: 25%;
                        flex: none;
                        text-align: center;
                        p{
                            padding: 0 10px;
                            a{
                                word-break: break-all;
                            }
                        }
                    }
                }
            }
            .MailProcessingitembody{
                overflow-y: auto;
                padding: 8px;
                .savedraft{
                    padding-bottom: 6px;
                    .el-checkbox{
                        color: #a2a2a2;
                    }
                }
                .sendlogedit{
                    display: flex;
                    justify-content: space-between;
                    margin: 0 -8px;
                    padding: 8px 16px;
                    background: #f3f7fc;
                    .pageedit{
                        display: flex;
                        align-items: center;
                        a{
                            &:hover{
                                color: #2b85ff;
                            }
                        }
                        .nextmaila{
                            margin-left: 14px;
                        }
                    }
                }
                .sendlogeditunderline{
                    margin: 20px 0 12px;
                    border-bottom: 1px solid #e6e6e6;
                }
                /deep/ .el-form-item {
                    margin-bottom: 9px;
                }
            }
        }
    }
    .elloadingbtn{
        .el-loading-spinner{
            margin-top: -6px;
        }
    }
    .uploadleftspan{
        float: left;
        line-height: 28px;
        margin-right: 22px;
    }
}

.uploadbox {
    padding: 0 0 6px;
    color: #666;
}

.el-form {
    /deep/ .el-form-item__label, .el-form-item__content{
        font-size: 12px;
    }
}

.is-required .el-form-item__label::before{
    position: static !important;
}

.el-input__count{
    line-height: 12px;
}

// 下拉框z-index  信息弹框z-index           遮罩层
.zindexhighest, .el-message-box__wrapper, .el-loading-mask{
    z-index: 10002 !important;
}

// 消息弹框
.el-message{
    z-index: 10003 !important;
}

.pageprevnextwrap{
    padding: 20px 0;
    text-align: center;
    a{
        &:hover{
            color: #38f;
        }
    }
}
</style>

<template>
    <div class="MailProcessingwrap">
        <div style="background: #fff;">
            <ComMailProcessNav :list="mailProcessNavList" :curId="getNavInfo(mailDataId)" ref="ComMailProcessNav"></ComMailProcessNav>
        </div>
        <div class="MailProcessingbox">
            <el-row style="margin-top: 26px;">
                <el-col :span="18" :offset="3">
                    <!-- 邮件列表 -->
                    <div class="MailProcessingitem" v-loading="mailListLoading">
                        <div class="MailProcessingitemhead">
                            <div>
                                <p style="height: 24px; line-height: 24px; margin-bottom: 3px;">
                                    买家ID：{{mailData.info.buyer_id}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    店铺名称：{{mailData.info.account_name}}
                                </p>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div class="MailProcessingitembody" style="height: 750px;">
                            <!-- 邮件列表主体 -->
                            <mailList
                                :mailList="mailData.mail_list"
                                @goTransResFn="goTransResFn"
                                @mailRemark="mailRemark"
                            />
                        </div>
                        <div class="pageprevnextwrap">
                            <a @click="resetPage('prev')"><span class="el-icon-arrow-left"></span>上一封</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <a @click="resetPage('next')" class="nextmaila">下一封<span class="el-icon-arrow-right"></span></a>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 添加备注弹窗 -->
        <el-dialog
            class="ui-layout_edit-dialog zindexhighest"
            title="编辑邮件备注"
            width="375px"
            :visible.sync="remarkObj.dialog">
            <div>
                <el-input v-model="remarkObj.remark" maxlength="250" show-word-limit placeholder="请输入" size="small" style="width: 100%;" class="showwordlimitipt"></el-input>
            </div>
            <span slot="footer">
                <el-button @click="remarkObj.dialog = false" size="small">取 消</el-button>
                <el-button @click="submitRemarkObj()" type="primary" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import {
    getMailData,
    setMailRemark,
} from '@/api/MailCenterManagement/EbayMesMailProcessing';
import {
    getGoogleTranslateV2,
} from '@/api/MailCenterManagement/MailProcessing';
import routerConfig from '@/router/routerConfig';
import mailList from "@/views/HomePage/MailCenterManagement/MailProcessing/components/mailList";
import orderList from "@/views/HomePage/MailCenterManagement/MailProcessing/components/orderList";

export default {
    name: 'EbayMesMailProcessing',
    data () {
        return {
            // 邮件列表加载动画
            mailListLoading: false,

            mailDataId: {
                inbox_id: '',
                account_id: '',
                order_id: '',
                buyer_id: '',
                buyer_email: '',
                point: '',
            },
            mailData: {
                info: {},
                prev: {},
                next: {},
                order: [],
                parent_order: [],
                chiled_order: [],
                more_order: {},
                mail_list: [],
            },

            // 平台
            platform: 'EB',

            // 查询下拉框数据
            optionListLabel: {

            },

            mailProcessNavList: [],

            // 添加备注相关
            remarkObj: {
                dialog: false,
                id: '',
                type: '',
                remark: '',
                remark_origin: '',
                item: '',
            },

            // 保存路由数据，判断是否重置数据
            curRouterData: ''
        }
    },
    components: {mailList, orderList},
    computed: {
        ...mapGetters([
            'queryParamsInfo'
        ])
    },
    activated() {
        // 路由变化就重置数据
        if( this.curRouterData !== this.$route.fullPath ){
            this.curRouterData = this.$route.fullPath;
            this.initData();
        }else{
            this.mailProcessNavList = JSON.parse(this.queryParamsInfo[this.$route.query.queryParamsInfo]);
        }

        // 展开指定面板
        let idx = routerConfig.getRouteIndex('/' + this.$route.query.type);
        this.$store.commit('SAVE_NAV_SINGLE_INDEX', +new Date() + '&&' + idx);
    },
    methods: {
        resetPage(f) {
            let mailLen = this.mailProcessNavList.length;
            let errStr = '';
            let str1 = '已是第一封邮件！';
            let str2 = '已是最后一封邮件！';
            let mailObj = {};
            // 当有邮件处理标签页
            if( mailLen > 1 ){
                let curIdx = this.mailProcessNavList.findIndex(e => e.inbox_id === this.mailDataId.inbox_id);
                if( f === 'prev' ){
                    if( curIdx <= 0 ){
                        mailObj = this.mailProcessNavList[mailLen-1];
                    }else{
                        mailObj = this.mailProcessNavList[curIdx-1];
                    }
                }
                if( f === 'next' ){
                    if( curIdx >= mailLen-1 ){
                        mailObj = this.mailProcessNavList[0];
                    }else{
                        mailObj = this.mailProcessNavList[curIdx+1];
                    }
                }
            }else{
                // 当没有邮件处理标签页
                if( !this.mailData[f] ){
                    if( f === 'prev' ){
                        errStr = str1;
                    }
                    if( f === 'next' ){
                        errStr = str2;
                    }
                }else{
                    mailObj = {
                        ...this.$route.query,
                        inbox_id: this.mailData[f].id,
                        account_id: this.mailData[f].account_id,
                        order_id: this.mailData[f].order_id,
                        buyer_id: this.mailData[f].buyer_id,
                        prev_next_ids: this.mailData[f].prev_next_ids,
                        transaction_id: this.mailData[f].transaction_id,
                    };
                }
            }
            if( errStr ){
                this.$nextTick(() => {
                    this.$message.warning(errStr);
                });
                return;
            }

            let path = mailObj.routerPath;
            let query = {...mailObj};
            this.$router.push({path, query});
            // 修改多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: path,
                name: mailObj.routerPathName,
                isRemove: 3,
                query
            });
        },

        initData() {
            this.mailProcessNavList = JSON.parse(this.queryParamsInfo[this.$route.query.queryParamsInfo]);
            this.mailData = {
                info: {},
                prev: {},
                next: {},
                order: [],
                parent_order: [],
                chiled_order: [],
                more_order: {},
                mail_list: [],
            };
            this.mailDataId = {
                inbox_id: '',
                account_id: '',
                order_id: '',
                buyer_id: '',
                point: ''
            };

            this.mailDataId = {...this.mailDataId, ...this.$route.query};
            this.getMailProcessing();
        },

        // 执行操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success('操作成功！');
                this.getMailProcessing();
            } else {
                this.$message.error(data.errorMess || '操作失败！');
            }
        },

        goTransResFn(v) {
            if( v.isTranslate && v.isTranslate == 2 ){
                return;
            }
            this.$set(v, 'isTranslate', 1);
            getGoogleTranslateV2({
                content: v.body,
                language: 'en',
                platform_code: 'EB',
            }).then(({data}) => {
                this.$set(v, 'isTranslate', 2);
                if( !data.status ){
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.$set(v, 'translateEn', data.data_list);
            }).catch(err => {
                this.$set(v, 'isTranslate', 2);
                console.log(err);
            });
        },

        getMailProcessing() {
            let obj = {
                id: this.mailDataId.inbox_id,
                prev_next_ids: this.mailDataId.prev_next_ids,
            };
            // 获取邮件数据
            this.mailListLoading = true;
            getMailData(obj).then(({data}) => {
                this.mailListLoading = false;
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                // 字段兼容处理
                data.data_list.message_list.forEach(e => {
                    e.isEB = true;
                    e.mail_type = e.message_type == 'send' ? '3' : '';
                    e.account_name = data.data_list.account_name;
                    e.is_replied_name = e.is_replied == '0' ? '未回复' : '已回复';
                    if( e.mail_type == '3' ) {
                        e.receiver = e.recipient_id;
                        e.receive_date = e.create_time;
                        e.body = e.reply_content;
                        e.body_en = e.reply_content_en;
                        e.reply_by = e.create_by;
                        e.attachments = e.pictures.map(j => j.picture_url).join(',');
                    }else{
                        e.receive_date = e.message_time;
                        e.cusSendTime = e.create_time;
                        e.body = e.new_message;
                        e.attachments = e.img.map(j => j.orgial_img).join(',');
                    }
                });
                this.mailData = {...this.mailData, info: data.data_list, mail_list: data.data_list.message_list, prev: data.data_list.prev_next_info.prev, next: data.data_list.prev_next_info.next};
            }).catch(err => {
                this.mailListLoading = false;
                console.log(err);
            });
        },

        mailRemark(item) {
            this.remarkObj = {
                dialog: true,
                id: item.id,
                type: 'message',
                remark: item.remark,
                remark_origin: item.remark,
                item,
            };
        },
        submitRemarkObj(item) {
            if( this.remarkObj.remark === this.remarkObj.remark_origin ){
                return;
            }
            setMailRemark({id: this.remarkObj.id, type: this.remarkObj.type, remark: this.remarkObj.remark}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.remarkObj.dialog = false;
                this.remarkObj.item.remark = this.remarkObj.remark;
            });
        },

        // 提取已有邮件处理列表关键字段方法
        getNavInfo(obj) {
            return JSON.stringify({
                inbox_id: obj.inbox_id,
                account_id: obj.account_id,
                order_id: obj.order_id,
                buyer_id: obj.buyer_id,
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
        },

    }
}
</script>
