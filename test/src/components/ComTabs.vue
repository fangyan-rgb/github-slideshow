<style lang="less" scoped>
    .ui-tab-container {
        display: flex;
        justify-content: left;
        font-weight: 600;
        font-size: 14px;
        margin: 0 0 5px 5px;
        border-bottom: 1px solid #e6e6e6;
        .ui-item {
            display: inline-block;
            line-height: 26px;
            cursor: pointer;
        }
        .ui-active {
            color: #5198fd;
            border-bottom: 2px solid #3688ff;
        }
    }
    .ui-divider {
        margin: 0 15px;
        display: inline-block;
        height: .9em;
        width: 1px;
        vertical-align: middle;
        position: relative;
        top: -.06em;
        background: #ccc;
    }
</style>
<template>
    <div class="ui-tab-container">
        <div v-for="(item, index) in platforms" :key='index'>
            <span :class="index===activatedIndex? 'ui-active ui-item': 'ui-item'" @click='handleClick(item, index)'>{{item}}</span>
            <i v-if="index!==platforms.length-1" class='ui-divider'></i>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ComTabs',
        props: {
            platform: {
                type: String,
                default: ''
            },
        },
        data () {
            return {
                activatedIndex: 0
            }
        },
        computed: {
            platforms() {
                if (typeof(this.platform) === 'string') {
                    if (this.platform.indexOf(',')) {
                        return this.platform.split(',')
                    }
                    return [this.platform]
                } else if (typeof(this.platform) === 'array') {
                    return this.platform
                } 
                return []
            }
        },
        methods: {
            handleClick(item, index) {
                this.activatedIndex = index
                this.$emit('handleTabsClick', item);
            },
        }
    }
</script>