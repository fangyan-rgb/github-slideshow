<style lang="less" scoped>
.s-main{
    height: 100%;
    overflow-y: auto;
}
.ui-tab-nav {
    display: flex;
    .ui-multiple_tab {
        flex: auto;
        border-right: none;
    }
}

</style>

<template>
    <section class="s-main">
        <!-- 面包屑 -->
        <!-- <ComBreadcrumbs></ComBreadcrumbs> -->
        <div class="ui-tab-nav">
            <!-- 导航标签 -->
            <MultipleTab></MultipleTab>
            <!-- 个人收藏夹 -->
            <PersonalCollection />
            <!-- 搜索配置 -->
            <ComSearchButton></ComSearchButton>
        </div>
        <!-- 内容 -->
        <keep-alive :include="keepAlive">
            <router-view></router-view>
        </keep-alive>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mailConfig from "@/assets/js/mailProcessingConfig";

    export default {
        name: "Main",
        data() {
            return {
                MailProcessingArr: JSON.parse(JSON.stringify(mailConfig.paramsRouterObj)),
            }
        },
        computed: {
            ...mapGetters(['tabLabel', 'queryParamsInfo']),
            keepAlive() {
                // 对已打开邮件列表的页面做缓存
                let openMailPage = [];
                let MailArr = [];   // 邮件处理页签名称数组
                for (let key in this.MailProcessingArr) {
                    if (this.MailProcessingArr.hasOwnProperty(key)) {
                        let element = this.MailProcessingArr[key];
                        MailArr.push(element.pathName);

                        let tempArr = JSON.parse(this.queryParamsInfo[key]).map(e => (e.routerPath || '').replace('/', ''));
                        openMailPage = [...openMailPage, ...tempArr];
                    }
                }

                // 对页签存在的页面做缓存
                let tabArr = this.tabLabel.map(item => {
                    // 邮件处理页签不做处理
                    if( MailArr.includes(item.name) ){
                        return '';
                    }else{
                        return item.path.replace('/', '');
                    }
                }).filter(Boolean);

                return [...tabArr, ...openMailPage];
            }
        },
        methods: {

        },
    }
</script>
