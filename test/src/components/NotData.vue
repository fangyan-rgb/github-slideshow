<template>
    <div class="ui-not_data-txt">
        <img src="../assets/image/no_data.png" alt="">
        <p>空空如也</p>
    </div>
</template>

<script>
    export default {
        name: "NotData",
        // props: ['isNotData'],
        // watch: {
        //     isNotData(val) {
        //         if (val) {
        //             this.$emit('changeState', true)
        //         } else {
        //             this.$emit('changeState', false)
        //         }
        //     }
        // }
    }
</script>

<style scoped lang="less">
    .ui-not_data-txt {
        line-height: normal;
        p {
            margin-top: 4px;
        }
    }
</style>