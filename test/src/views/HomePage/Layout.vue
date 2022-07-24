<template>
    <div class="ui-main ui-theme_default">      
        <div class="ui-nav">
            <Navbar></Navbar>
        </div>
        <div class="ui-content">
            <Main></Main>
        </div>
        <Loading></Loading>

        <!-- 采购系统对接蓝凌处理 -->
        <!-- <iframe class="ui-login_iframe" :src="iFramePath" frameborder="0" v-if="!isComplete"></iframe> -->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import {
        Navbar,
        Main,
        // Sidebar
    } from '@/views/HomePage'
    export default {
        name: "Layout",
        components: {
            Navbar,
            Main,
            // Sidebar
        },
        data() {
            return {
                iFramePath: '',
                isComplete: false
            }
        },
        computed: {
            ...mapGetters(['loginInfo'])
        },
        mounted() {
            // const fixUrl = 'http://192.168.71.158:8080/km/review/km_review_main/kmReviewMain.do?';
            // this.iFramePath = `${fixUrl}access_token=${this.loginInfo.session_id}`;
            setTimeout(() => {
                this.isComplete = true;
            }, 10000)
        }
    }
</script>

<style lang="less" scoped>
    .ui-login_iframe {
        position: absolute;
        z-index: -9999;
        left: 0;
    }
    .ui-content {
        height: 100%;
    }
</style>