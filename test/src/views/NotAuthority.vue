<template>
    <div class="ui-not_authority" :style="{ height: initHeight + 'px' }">
        <div class="ui-not_authority-txt">
            <img src="../assets/image/empty2.png" alt="">
            <p>您没有访问当前页面的权限</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NotAuthority",
        data() {
            return {
                initHeight: 600
            }
        },
        mounted() {
            this.initHeight = window.innerHeight - 70;
        }
    }
</script>

<style scoped lang="less">
    .ui-not_authority {
        position: relative;

        .ui-not_authority-txt {
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -133px;
            margin-top: -133px;

            color: #666666;

            p {
                margin-top: 10px;
            }
        }
    }
</style>