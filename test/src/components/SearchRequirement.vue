<template>
        <div class="ui-search_require clearFix">
            <label class="ui-search_label" :style="{ width: width }">{{ label }}</label>
            <div class="ui-search_input" :class="isTwo && 'ui-search_input-two'">
                <slot></slot>
            </div>
        </div>
    </template>
    
    <script>
        /**
         *  头部查询组件 > 简便头部书写，自适应宽度
         * */
        export default {
            name: "SearchRequirement",
            props: {
                label: {
                    type: String,
                    default: ''
                },
                width: {
                    type: String,
                    default: '98px'
                },
                fixedWidth: {
                    type: String,
                    default: ''
                },
                isTwo: {
                    type: Boolean,
                    default: false
                }
            },
            data() {
                return {
                    areaWidth: '',
                    minWidth: 298
                }
            },
            mounted() {
                try{
                    let areaWidth = (getEleAttr('.ui-search-area').offsetWidth - 390) / 5;
                    // console.log('偏移宽度为多少aaaa', getEleAttr('.ui-search-area').offsetWidth)
                    this.areaWidth = areaWidth > this.minWidth ? areaWidth + 'px' : this.minWidth + 'px';
                }catch(e){
                    
                }
            }
        }
    </script>
    
    <style scoped lang="less">
        .ui-search_require {
            display: flex;
            .ui-search_label {
                display: inline-block;
                line-height: 22px;
                padding-right: 8px;
                box-sizing: border-box;
                text-align: right;
                font-size: 12px;
                color: #333333;
            }
            .ui-search_input {
                line-height: 22px;
                flex: 1
            }
            .ui-search_input-two {
                .el-input {
                    width: 42% !important;
                }
            }
        }
    </style>