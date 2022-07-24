<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>

    body {
        margin: 0;
        padding: 0;
    }
    #app {
        font-family: "Microsoft YaHei","微软雅黑";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* text-align: center; */
        /* background: #ffffff; */
        height: 100%;
    }
    .v-modal{
        z-index:500;
    }
</style>
