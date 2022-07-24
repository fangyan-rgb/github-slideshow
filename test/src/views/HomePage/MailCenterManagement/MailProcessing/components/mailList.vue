<style lang="less" scoped>
.mailcontitem{
    display: flex;
    margin-bottom: 20px;
    .mailcontiteml{
        color: #71b7fc;
        width: 42px;
        flex: none;
        padding-top: 7px;
        span{
            font-size: 32px;
        }
    }
    .mailcontitemr{
        flex: auto;
        padding-right: 130px;
    }
    .mailcontitemrhead{
        color: #fff;
        padding:  8px 8px 8px 10px;
        background: #71b7fc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mailcontitemrheadl{
            flex: auto;
            width: 0;
            margin-right: 10px;
            p{
                &:first-child{
                    font-size: 14px;
                }
            }
        }
        .mailcontitemrheadr{
            flex: none;
            span{
                cursor: pointer;
            }
        }
        .mailcontitemrheadlcen{
            margin: 3px 0;
            .receivespan{
                display: inline-block;
                height: 22px;
                line-height: 22px;
                padding: 0 10px;
                background: #fff;
                border-radius: 3px;
            }
        }
        .mailcontitemrheadlbot{
            display: flex;
            margin-top: 7px;
            .translateword{
                margin-right: 17px;
                height: 24px;
                line-height: 0.9;
                color: #8cc4f7;
            }
        }
    }
    .mailcontitemrbody{
        border: 1px solid #e6e6e6;
        padding: 5px 9px;
        .mailcontitemrbodycont{
            line-height: 1.8;
        }
        .mailcontitemrbodyedit{
            min-height: 32px;
            display: flex;
            align-items: center;
            a{
                color: #4a94ff;
            }
            .translateword{
                margin-left: 17px;
            }
            .time{
                flex: auto;
                color: #b6b6b6;
                text-align: right;
            }
            .fileimgdiv{
                width: 100px;
                height: 100px;
                overflow: hidden;
                border: 1px solid #e6e6e6;
                margin: 10px 6px 10px 0;
                img{
                    width: 100%;
                    cursor: pointer;
                }
            }
        }
    }

    &.myself{
        .mailcontiteml{
            color: #53c68b;
            text-align: right;
            span{
                margin-right: 0;
            }
        }
        .mailcontitemr{
            order: -1;
            padding-right: 0;
            padding-left: 130px;
        }
        .mailcontitemrhead{
            background: #53c68b;
            .mailcontitemrheadr{
                span{
                    display: none;
                }
            }
        }
        .mailcontitemrbody{
            .mailcontitemrbodyedit{
                .time{
                    order: -1;
                    text-align: left;
                }
            }
        }
    }
}

.downloaddiv{
    p{
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        &:first-child{
            margin-top: 0;
        }
        a{
            color: #4a94ff;
        }
    }
}
</style>

<template>
    <div class="MailProcessing_MailListwrap">
        <div v-for="(v, i) in mailList" :class="{myself: v.mail_type === '3'}" class="mailcontitem" :key="i">
            <div class="mailcontiteml">
                <span v-if="v.mail_type === '3'" class="icon-kefutouxiang"></span>
                <span v-else class="icon-maijiatouxiang"></span>
            </div>
            <div class="mailcontitemr">
                <div class="mailcontitemrhead">
                    <div class="mailcontitemrheadl">
                        <p>主题：{{v.subject}}</p>
                        <div class="mailcontitemrheadlcen">
                            <div v-if="v.mail_type === '3'">
                                {{v.account_name}} <span class="el-icon-right"></span> {{v.receiver}}　　　发送时间：{{v.receive_date}}　　　{{v.reply_by}}
                            </div>
                            <div v-else>
                                {{v.sender}} <span class="el-icon-right"></span> {{v.account_name}}　　　收取时间：{{v.receive_date}}　　　<span v-if="v.is_replied_name" class="receivespan" :style="{color: v.is_replied_name === '已回复' ? '#8dc444' : '#fe312e'}">{{v.is_replied_name}}</span>
                            </div>
                        </div>
                        <p style="color: #f33; word-break: break-all;">{{v.remark ? '备注：' + v.remark : ''}}</p>
                        <div class="mailcontitemrheadlbot">
                            <el-button
                                v-if="v.mail_type !== '3'"
                                @click="goTransResFn(v)"
                                size="mini"
                                class="translateword">
                                {{!v.isTranslate ? '翻译' : v.isTranslate == 1 ? '翻译中...' : '翻译完成'}}
                            </el-button>
                            <p v-if="v.attachments && !v.isEB">
                                <el-popover
                                    width="100"
                                    placement="top"
                                    trigger="hover">
                                    <div class="downloaddiv" style="max-height: 500px; overflow-y: auto;">
                                        <p v-for="(file, fileIdx) in (v.attachments || '').split(',').filter(e => e)"><span>附件{{fileIdx+1}}</span><a :href="file" target="_blank">下载附件</a></p>
                                    </div>
                                    <a href="javascript:;" style="text-decoration: underline;" slot="reference"><span class="icon-fujian" style="color: #fff;"></span>附件下载</a>
                                </el-popover>
                            </p>
                            <p v-if="v.isEB && v.mail_type != '3'" style="margin: 0 0 0 150px;">客户发送时间：{{v.cusSendTime}}</p>
                        </div>
                    </div>
                    <div class="mailcontitemrheadr">
                        <span @click="mailRemark(v)" class="icon-bianji"></span>
                    </div>
                </div>
                <div class="mailcontitemrbody">
                    <div class="mailcontitemrbodycont">
                        <p v-if="v.body_en" style="font-size: 14px;">翻译前内容：</p>
                        <iframe :id="'iframea' + i" :srcdoc="v.body" @load="iframeOnload('iframea' + i, v.body)" width="100%" frameborder="0"></iframe>
                        <p v-if="v.body_en" style="font-size: 14px;">翻译后内容：</p>
                        <iframe v-if="v.body_en" :id="'iframeb' + i" :srcdoc="v.body_en" @load="iframeOnload('iframeb' + i, v.body_en)" width="100%" frameborder="0"></iframe>
                    </div>
                    <div class="mailcontitemrbodyedit">
                        <div v-for="file in (v.attachments || '').split(',').filter(e => e)" class="fileimgdiv">
                            <img :src="file" @click="handleClickImg(file)" alt="">
                        </div>
                    </div>
                    <div v-if="v.translateEn" class="mailcontitemrbodycont" style="background: #ecf6fe; border: 1px solid #7bbbf6; padding: 0 5px;">
                        <p style="font-size: 14px;">翻译结果：</p>
                        <iframe :id="'iframec' + i" :srcdoc="v.translateEn" @load="iframeOnload('iframec' + i, v.translateEn)" width="100%" frameborder="0"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MailProcessing_MailList',
    data () {
        return {

        }
    },
    props: {
        mailList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods: {
        goTransResFn(v) {
            this.$emit('goTransResFn', v);
        },
        mailRemark(v) {
            this.$emit('mailRemark', v);
        },
        handleClickImg(v) {
            this.$emit('handleClickImg', v);
        },
        // iframe自适应内容高度
        iframeOnload(id, v) {
            if( !/^\s*<\/?[^>]*>/g.test(v) ){
                document.getElementById(id).contentWindow.document.body.style.whiteSpace = 'pre-wrap';
            }
            document.getElementById(id).contentWindow.document.body.style.fontSize = '14px';
            document.getElementById(id).height = 0;
            document.getElementById(id).height = document.getElementById(id).contentWindow.document.body.scrollHeight + 33;
        },
    },
}
</script>
