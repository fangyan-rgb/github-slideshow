<style lang="less" scoped>
.ui-ComMailProcessNav {
    font-size: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #e5e5e5;
    .ComMailProcessNavwrap{
        min-height: 28px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        & > div{
            padding: 0 6px;
            position: relative;
            &:after{
                content: ' ';
                display: block;
                width: 1px;
                height: 12px;
                background: #e4e4e4;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
            a{
                display: inline-block;
                padding: 3px 8px;
                border-radius: 3px;
                position: relative;
                span{
                    display: none;
                    position: absolute;
                    top: 0;
                    right: 0;
                    color: #999;
                    transform: translate(50%, -50%);
                }
                &.active, &:hover{
                    background: #eaedf4;
                    span{
                        display: inline-block;
                    }
                }
            }
        }
    }
}
</style>

<template>
    <div v-if="list.length > 1" class="ui-ComMailProcessNav">
        <div class="ComMailProcessNavwrap">
            <div v-for="(item, idx) in list" :key="idx">
                <a @click="goMailProcessingPage(item)" :class="{active: getNavInfo(item) === curId}" href="javascript:;">{{'邮件' + (idx+1)}}<span @click.stop="handleDelItem(idx)" class="el-icon-circle-close"></span></a>
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/router/routerConfig';

export default {
    name: "ComMailProcessNav",
    data() {
        return {

        }
    },
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        },
        curId: {
            type: String,
            default: ''
        },
        isEbayMail: {
            type: Boolean,
            default: false
        },
    },
    computed: {

    },
    created() {

    },
    methods: {
        handleDelItem(idx) {
            // 只有一封邮件不做处理
            if( this.list.length <= 1 ){
                return;
            }
            // 如果删掉当前打开的
            if( this.getNavInfo(this.list[idx]) === this.curId ){
                // 后面还有邮件
                if( this.list.length - 1 > idx ){
                    // 切换到后面邮件
                    this.goMailProcessingPage(this.list[idx + 1]);
                }else{
                    // 后面没有邮件 切换到前面邮件
                    this.goMailProcessingPage(this.list[idx - 1]);
                }
            }
            // 执行删除
            this.list.splice(idx, 1);
            // 保存删除后邮件列表
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: this.$route.query.queryParamsInfo,
                value: JSON.stringify(this.list)
            });
        },
        handleDelCurItem(curId) {
            // 只有一封邮件不做处理
            if( this.list.length <= 1 ){
                return;
            }
            let idx = this.list.findIndex(e => this.getNavInfo(e) === curId);
            // 执行删除
            this.list.splice(idx, 1);
            // 保存删除后邮件列表
            this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                key: this.$route.query.queryParamsInfo,
                value: JSON.stringify(this.list)
            });
        },
        goMailProcessingPage(obj) {
            this.$router.push({path: obj.routerPath, query: obj});
            // 修改多页签
            this.$store.commit('SAVE_TAB_LABELS', {
                path: obj.routerPath,
                name: obj.routerPathName,
                isRemove: 3,
                query: obj
            });
        },

        // 提取已有邮件处理列表关键字段方法
        getNavInfo(obj) {
            if( !this.isEbayMail ){
                return JSON.stringify({
                    inbox_id: obj.inbox_id,
                    account_id: obj.account_id,
                    order_id: obj.order_id,
                    buyer_id: obj.buyer_id,
                });
            }else{
                return JSON.stringify({
                    id: obj.id,
                    inbox_id: obj.inbox_id,
                    type: obj.type,
                });
            }
        },
    }
}
</script>
