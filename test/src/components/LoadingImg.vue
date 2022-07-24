<template>
    <div @click="handleClick">
        <img v-if="src && !isComplete" src="../assets/image/img_loading.gif" alt="">
        <img class="ui-image" v-show="isComplete" v-if="src" :src="src" alt="" ref="myImg" :style="{width, height}">
    </div>
</template>

<script>
    export default {
        name: "LoadingImg",
        props: {
            src: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '80px'
            },
            height: {
                type: String,
                default: '60px'
            }
        },
        data() {
            return {
                isComplete: false
            }
        },
        methods: {
            handleClick(e) {
                this.$emit('click', e)
            }
        },
        mounted() {
            const vm = this;
            this.$nextTick(() => {
                this.$refs.myImg.addEventListener('load', function() {
                    vm.isComplete = true;
                });

                this.$refs.myImg.addEventListener('error', function() {
                    // vm.isComplete = true;
                    this.src = require('../assets/image/img_error.png');
                })
            })
        }
    }
</script>

<style scoped>
    .ui-image {
        height: 100%;
        width: 100%;
    }
</style>