<style lang="less" scoped>
.ComSelectLanguageV2wrap {
    display: flex;
    font-size: 12px;
    color: #333;

    * {
        box-sizing: border-box;
    }

    .tit, .list, .btn{
        display: flex;
        align-items: center;
    }
    .tit{
        margin-right: 8px;
    }
    .list{
        position: relative;
        margin: 0 8px 0 0;
        .item{
            display: inline-block;
            height: 24px;
            line-height: 23px;
            padding: 0 15px;
            border: 1px solid #cdcdcd;
            border-left: none;
            overflow: hidden;
            color: #333 !important;
            text-decoration: none !important;
            &:first-child{
                border-left: 1px solid #cdcdcd;
            }
            &.active{
                color: #fff !important;
                border-color: #2c84ff;
                background: #2c84ff;
            }
        }

        .SelectLanguagePanel {
            position: absolute;
            top: 130%;
            right: 0;
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
}
</style>

<template>
    <div style="display: inline-block;">
        <div class="ComSelectLanguageV2wrap" v-clickOutside="close">
            <div v-if="!notxt" class="tit">翻译后语言：</div>
            <div class="list">
                <a v-for="(v, k, i) in commonList" @click="changeItem(k)" :class="{active: k === curItem}" href="javascript:;" class="item">{{v}}</a>
                <a @click="panelShow = !panelShow" href="javascript:;" class="item">更多<span class="el-icon-caret-bottom"></span></a>
                <div v-show="panelShow" class="SelectLanguagePanel">
                    <div>
                        <a @click="changeItem(k)" v-for="(v, k, i) in list" :class="{hover: k === curItem}" href='javascript:;' :key="i">{{v}}</a>
                    </div>
                </div>
            </div>
            <div class="btn">
                <el-button @click="translate()" type="primary" size="mini">翻译</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import clickOutside from '@/utils/clickOutside';

export default {
    name: 'ComSelectLanguageV2',
    data() {
        return {
            panelShow: false,
            curItem: '',
            commonList: {
                en: "英语",
                de: "德语",
                it: "意大利语",
                fr: "法语",
                es: "西班牙语",
                ja: "日语",
                ru: "俄语",
                pt: "葡萄牙语",
            },
        }
    },
    props: {
        list: {
            type: Object,
            default() {
                return {};
            }
        },
        notxt: {
            type: Boolean,
            default: false
        }
    },
    directives: {
        clickOutside
    },
    methods: {
        changeItem(item) {
            // if( this.curItem === item ){
            //     item = '';
            // }
            this.curItem = item;
            this.panelShow = false;
            this.$emit("change", item);
        },
        close() {
            this.panelShow = false;
        },
        translate() {
            this.$emit("translate");
        }
    },
}
</script>