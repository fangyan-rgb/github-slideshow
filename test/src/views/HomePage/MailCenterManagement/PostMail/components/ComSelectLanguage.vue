<style lang="less" scoped>
.ComSelectLanguagewrap {
    display: inline-block;
    position: relative;
    padding: 0 10px;

    * {
        box-sizing: border-box;
    }

    .SelectLanguagePanel {
        position: absolute;
        top: 110%;
        left: 11px;
        width: 494px;
        padding: 16px 20px;
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 0 6px #bbb;
        z-index: 10002;
        height: 300px;
        overflow-y: auto;
        a {
            display: inline-block;
            padding: 3px 6px;
            margin: 0 10px;
            white-space: nowrap;
            color: #535353 !important;
            text-decoration: none !important;
            &:hover, &.hover {
                color: #4e92ff !important;
            }
        }
        hr {
            margin: 7px 0;
        }
    }
}
</style>

<template>
    <div class="ComSelectLanguagewrap" v-clickOutside="close">
        <el-button @click="panelShow = !panelShow" type="text">{{list[curItem] || '选择翻译后语种'}}</el-button>
        <div v-show="panelShow" class="SelectLanguagePanel">
            <div>
                <a @click="changeItem(k)" v-for="(v, k, i) in list" :class="{hover: k === curItem}" href='javascript:;' :key="i">{{v}}</a>
            </div>
        </div>
    </div>
</template>

<script>
import clickOutside from '@/utils/clickOutside';

export default {
    name: 'ComSelectLanguage',
    data() {
        return {
            panelShow: false,
            curItem: '',
        }
    },
    props: {
        list: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    directives: {
        clickOutside
    },
    methods: {
        changeItem(item) {
            this.curItem = item;
            this.panelShow = false;
            this.$emit("change", item);
        },
        close() {
            this.panelShow = false;
        }
    },
}
</script>