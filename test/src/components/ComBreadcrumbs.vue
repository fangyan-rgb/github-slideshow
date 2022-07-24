<style lang="less" scoped>
.ui-ComBreadcrumbs {
    font-size: 12px;
    /* font-weight: bold; */
    .ComBreadcrumbswrap {
        line-height: 36px;
        background: #f9f9f9;
        border-bottom: 1px solid #e6e6e6;
        a {
            cursor: default;
            color: #333 !important;
            text-decoration: none !important;
            i {
                /* font-weight: bold; */
            }
            &:last-child {
                i {
                    display: none;
                }
            }
        }
    }
    .ui-click {
        cursor: pointer!important;
    }
    .icon-mianbaoxie {
        margin-right: 3px;
        font-size: 14px;
        color: #3688ff;
    }
}
</style>

<template>
    <div v-if="curNav.length && $route.path !== '/staging'" class='ui-ComBreadcrumbs'>
        <div class="ComBreadcrumbswrap">
            <i class="icon-mianbaoxie"></i><span>当前位置：</span>
            <a v-for="(item, idx) in curNav" @click="handleClickNav(item.path)" :class="item.path && 'ui-click'" href="javascript:;" :key="idx">{{item.name}}<i class="el-icon-arrow-right"></i></a>
        </div>
    </div>
</template>

<script>
import routerConfig from '@/router/routerConfig';

export default {
    name: "ComBreadcrumbs",
    computed: {
        // 自动获取当前路由及父路由
        curNav() {
            let nav;
            let cur = this.$route.path;
            let fn = (arr, names) => {
                names = names || [];
                arr.forEach(e => {
                    if( e.path === cur ){
                        nav = [...names, e];
                    }else if( e.children && e.children.length ){
                        fn(e.children, [...names, e]);
                    }
                });
            };
            fn(routerConfig.getRouteConfig());
            return nav || [];
        }
    },
    created() {

    },
    methods: {
        // 路由跳转
        handleClickNav(path) {
            if( path ){
                this.$router.push(path);
                let idx = routerConfig.getRouteIndex(path);
                let to = routerConfig.navJumpFn(idx);
                this.$store.commit('SAVE_TAB_LABELS', {
                    path: to.path,
                    name: to.name,
                    index: idx,
                });
                this.$store.commit('SAVE_NAV_INDEX', idx);
            }
        }
    }
}
</script>
