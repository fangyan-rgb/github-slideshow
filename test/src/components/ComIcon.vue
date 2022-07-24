<template>
    <i :class="'bg-' + name" @click="handleClick"></i>
</template>

<script>
    export default {
        name: "ComIcon",
        props: {
            name: {
                type: String,
                default() {
                    return ''
                }
            }
        },
        methods: {
            handleClick() {
                this.$emit('click');
            }
        }
    }
</script>

<style scoped lang="less">


    .bg-add {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -255px -120px;
    }

    .bg-add_to {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -175px -120px;
    }

    .bg-disabled {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum.png') -227px -40px;
    }

    .bg-calendar {
        width: 19px; height: 17px;
        background: url('../assets/image/icon_sum.png') -50px -174px;
    }

    .bg-check {
        width: 14px; height: 14px;
        background: url('../assets/image/icon_sum.png') -295px -120px;
    }

    .bg-delete2 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -215px -120px;
    }

    .bg-delete {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -215px -80px;
    }

    .bg-delete3 {
        width: 14px; height: 14px;
        background: url('../assets/image/icon_sum.png') -295px -80px;
    }

    .bg-start {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum.png') -175px -40px;
    }

    .bg-drop_down {
        width: 12px; height: 7px;
        background: url('../assets/image/icon_sum.png') -220px -174px;
    }

    .bg-drop_down_2 {
        width: 120px; height: 9px;
        background: url('../assets/image/icon_sum3.png') -10px -10px;
    }

    .bg-drop_down_1 {
        width: 120px; height: 9px;
        background: url('../assets/image/icon_sum3.png') -10px -39px;
    }

    .bg-editor {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -255px -80px;
    }

    .bg-failure {
        width: 20px; height: 19px;
        background: url('../assets/image/icon_sum.png') -135px -69px;
    }

    .bg-logo {
        width: 145px; height: 39px;
        background: url('../assets/image/icon_sum.png') -10px -10px;
    }

    .bg-open {
        width: 13px; height: 7px;
        background: url('../assets/image/icon_sum.png') -187px -174px;
    }

    .bg-pack_up {
        width: 7px; height: 13px;
        background: url('../assets/image/icon_sum.png') -160px -174px;
    }

    .bg-people {
        width: 16px; height: 16px;
        background: url('../assets/image/icon_sum.png') -95px -108px;
    }

    .bg-picture {
        width: 65px; height: 55px;
        background: url('../assets/image/icon_sum.png') -10px -69px;
    }

    .bg-preview {
        width: 23px; height: 20px;
        background: url('../assets/image/icon_sum.png') -279px -40px;
    }

    .bg-preview2 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum.png') -175px -80px;
    }

    .bg-selected {
        width: 16px; height: 16px;
        background: url('../assets/image/icon_sum.png') -131px -108px;
    }

    .bg-successful {
        width: 20px; height: 19px;
        background: url('../assets/image/icon_sum.png') -95px -69px;
    }

    .bg-uncheck {
        width: 16px; height: 16px;
        background: url('../assets/image/icon_sum.png') -89px -174px;
    }

    .bg-update {
        width: 20px; height: 19px;
        background: url('../assets/image/icon_sum.png') -10px -174px;
    }

    .bg-upload {
        width: 15px; height: 15px;
        background: url('../assets/image/icon_sum.png') -125px -174px;
    }



    .bg-icon3_1 {
        width: 16px; height: 14px;
        background: url('../assets/image/icon-set.png') -10px -236px;
    }


    .bg-icon1 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -118px -200px;
    }


    .bg-icon1_1 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -154px -200px;
    }


    .bg-icon2 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -155px -84px;
    }


    .bg-icon2_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -10px -128px;
    }


    .bg-icon3 {
        width: 16px; height: 14px;
        background: url('../assets/image/icon-set.png') -46px -236px;
    }


    .bg-icon10_1 {
        width: 16px; height: 20px;
        background: url('../assets/image/icon-set.png') -10px -10px;
    }


    .bg-icon4 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -46px -128px;
    }


    .bg-icon4_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -82px -128px;
    }


    .bg-icon5 {
        width: 16px; height: 18px;
        background: url('../assets/image/icon-set.png') -10px -90px;
    }


    .bg-icon5_1 {
        width: 16px; height: 18px;
        background: url('../assets/image/icon-set.png') -46px -90px;
    }


    .bg-icon6 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -118px -128px;
    }


    .bg-icon6_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -154px -128px;
    }


    .bg-icon7 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -191px -10px;
    }


    .bg-icon7_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -191px -46px;
    }


    .bg-icon8 {
        width: 16px; height: 20px;
        background: url('../assets/image/icon-set.png') -46px -10px;
    }


    .bg-icon8_1 {
        width: 16px; height: 20px;
        background: url('../assets/image/icon-set.png') -82px -10px;
    }


    .bg-icon9 {
        width: 17px; height: 17px;
        background: url('../assets/image/icon-set.png') -118px -10px;
    }


    .bg-icon9_1 {
        width: 17px; height: 17px;
        background: url('../assets/image/icon-set.png') -118px -47px;
    }


    .bg-icon10 {
        width: 16px; height: 20px;
        background: url('../assets/image/icon-set.png') -10px -50px;
    }


    .bg-icon17_1 {
        width: 16px; height: 14px;
        background: url('../assets/image/icon-set.png') -82px -236px;
    }


    .bg-icon11 {
        width: 16px; height: 17px;
        background: url('../assets/image/icon-set.png') -82px -90px;
    }


    .bg-icon11_1 {
        width: 16px; height: 17px;
        background: url('../assets/image/icon-set.png') -118px -90px;
    }


    .bg-icon12 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -190px -200px;
    }


    .bg-icon12_1 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -226px -200px;
    }


    .bg-icon13 {
        width: 16px; height: 13px;
        background: url('../assets/image/icon-set.png') -226px -236px;
    }


    .bg-icon13_1 {
        width: 16px; height: 13px;
        background: url('../assets/image/icon-set.png') -262px -236px;
    }


    .bg-icon14 {
        width: 16px; height: 14px;
        background: url('../assets/image/icon-set.png') -118px -236px;
    }


    .bg-icon14_1 {
        width: 16px; height: 14px;
        background: url('../assets/image/icon-set.png') -154px -236px;
    }


    .bg-icon15 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -191px -82px;
    }


    .bg-icon15_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -191px -118px;
    }


    .bg-icon16 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -10px -164px;
    }


    .bg-icon16_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -46px -164px;
    }


    .bg-icon17 {
        width: 16px; height: 14px;
        background: url('../assets/image/icon-set.png') -190px -236px;
    }


    .bg-icon24_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -82px -164px;
    }


    .bg-icon18 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -118px -164px;
    }


    .bg-icon18_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -154px -164px;
    }


    .bg-icon19 {
        width: 16px; height: 19px;
        background: url('../assets/image/icon-set.png') -46px -50px;
    }


    .bg-icon19_1 {
        width: 16px; height: 19px;
        background: url('../assets/image/icon-set.png') -82px -50px;
    }


    .bg-icon20 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -190px -164px;
    }


    .bg-icon20_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -227px -10px;
    }


    .bg-icon21 {
        width: 16px; height: 17px;
        background: url('../assets/image/icon-set.png') -155px -10px;
    }


    .bg-icon21_1 {
        width: 16px; height: 17px;
        background: url('../assets/image/icon-set.png') -155px -47px;
    }


    .bg-icon22 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -263px -10px;
    }


    .bg-icon22_1 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -263px -45px;
    }


    .bg-icon23 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -263px -80px;
    }


    .bg-icon23_1 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -263px -115px;
    }


    .bg-icon24 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -227px -46px;
    }


    .bg-icon25 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -227px -82px;
    }


    .bg-icon25_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -227px -118px;
    }


    .bg-icon26 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -263px -150px;
    }


    .bg-icon26_1 {
        width: 16px; height: 15px;
        background: url('../assets/image/icon-set.png') -263px -185px;
    }


    .bg-icon27 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -227px -154px;
    }


    .bg-icon27_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -10px -200px;
    }


    .bg-icon28 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -46px -200px;
    }


    .bg-icon28_1 {
        width: 16px; height: 16px;
        background: url('../assets/image/icon-set.png') -82px -200px;
    }

    .bg-icon_append1 {
        width: 16px; height: 20px;
        background: url('../assets/image/icon_sum2.png') -10px -50px;
    }

    .bg-icon_append2 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum2.png') -10px -10px;
    }

    .bg-icon_append3 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum2.png') -50px -10px;
    }

    .bg-icon_add {
        width: 15px; height: 15px;
        background: url('../assets/image/icon_add.png') -15px -15px;
    }

    .bg-icon_del {
        width: 15px; height: 15px;
        background: url('../assets/image/icon_del.png') -15px -15px;
    }


    .bg-icon_append4 {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -10px -68px;
    }

    .bg-icon_append5 {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -62px -68px;
    }

    .bg-icon_append6 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -150px -90px;
    }

    .bg-icon_append7 {
        width: 23px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -150px -10px;
    }

    .bg-icon_append8 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -150px -50px;
    }

    .bg-icon_append9 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -50px -148px;
    }

    .bg-icon_append10 {
        width: 120px; height: 9px;
        background: url('../assets/image/icon_sum3.png') -10px -10px;
    }

    .bg-icon_append11 {
        width: 120px; height: 9px;
        background: url('../assets/image/icon_sum3.png') -10px -39px;
    }

    .bg-icon_append12 {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -10px -108px;
    }

    .bg-icon_append13 {
        width: 32px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -62px -108px;
    }

    .bg-icon_append14 {
        width: 20px; height: 20px;
        background: url('../assets/image/icon_sum3.png') -10px -148px;
    }

    //待提交
    .bg-status1 {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -10px -157px;
    }

    //审批中
    .bg-status2 {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -348px -10px;
    }

    //已驳回
    .bg-status3 {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -348px -157px;
    }

    //已审批
    .bg-status4  {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -179px -304px;
    }

    //已支付
    .bg-status5 {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -10px -10px;
    }

    //待审批
    .bg-status7 {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -179px -10px;
    }

    //待支付
    .bg-daizhifu  {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -179px -157px;
    }

    //已撤回
    .bg-yichehui {
        width: 149px; height: 127px;
        background: url('../assets/image/status_stamp.png') -10px -304px;
    }

    .bg-shrink_down {
        width: 78px; height: 10px;
        background: url('../assets/image/shrink.png') -10px -10px;
    }

    .bg-shrink_up {
        width: 78px; height: 10px;
        background: url('../assets/image/shrink.png') -10px -40px;
    }

    i {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }
</style>