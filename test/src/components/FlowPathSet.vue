<template>
    <div class="ui-flow_path_set">
        <div>
            <ul class="clearFix">
                <li :style="{width: width}">
                    <span>申请人</span>
                    <span class="ui-fn_flag-right"></span>
                </li>
                <li
                        :style="{width: width}"
                        v-for="(item, index) in dataList"
                        :key="index">
                    <div class="ui-is_com-area">
                        <el-select
                                filterable v-filter
                                size="small"
                                v-model="dataList[index][0]"
                                :disabled="index === 0">
                            <el-option
                                    v-for="(itemChild, index) in optionList.useAuditStaffList"
                                    :key="index"
                                    :label="itemChild.label"
                                    :value="itemChild.value"></el-option>
                            <span slot="prefix" class="ui-select_icon">
                                <i class="el-icon-phone-outline"></i>
                                <i
                                        v-if="dataList.length > 3 && index > 0"
                                        @click="handleRemoveNode(index)"
                                        class="el-icon-remove"></i>
                            </span>
                        </el-select>
                        <el-input
                                size="small"
                                v-model="dataList[index][1]" placeholder="限制金额" v-if="index > 0"></el-input>
                    </div>
                    <span :class="autoToggleForClass(index)">
                        <i
                                @click="handleAddData"
                                v-if="index === dataList.length - 2" class="el-icon-circle-plus"></i>
                    </span>
                </li>
                <li :style="{width: width}">
                    <div class="ui-is_com-last">
                        <el-checkbox label="对公" v-model="lastChild.com[0]"></el-checkbox>
                        <el-select
                                filterable v-filter
                                size="small"
                                v-model="lastChild.com[1]">
                            <el-option
                                    v-for="(itemChild, index) in optionList.useAuditStaffList"
                                    :key="index"
                                    :label="itemChild.label"
                                    :value="itemChild.value"></el-option>
                            <!--<span slot="prefix" class="ui-select_icon">-->
                                <!--<i class="el-icon-phone-outline"></i>-->
                            <!--</span>-->
                        </el-select>
                        <el-checkbox label="对私" v-model="lastChild.side[0]"></el-checkbox>
                        <el-select
                                filterable v-filter
                                size="small"
                                v-model="lastChild.side[1]">
                            <el-option
                                    v-for="(itemChild, index) in optionList.useAuditStaffList"
                                    :key="index"
                                    :label="itemChild.label"
                                    :value="itemChild.value"></el-option>
                            <!--<span slot="prefix" class="ui-select_icon">-->
                                <!--<i class="el-icon-phone-outline"></i>-->
                            <!--</span>-->
                        </el-select>
                    </div>
                    <div class="ui-bg_area">
                        <span>完成</span>
                    </div>
                    <span class="ui-fn_flag-bottom"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FlowPathSet",
        props: {
            optionList: {
                type: Object,
                default() {
                    return {
                        useAuditStaffList: []
                    }
                }
            }
        },
        data() {
            return {
                test: '',
                dataList: [['直属上司'], [], []],
                lastChild: {
                    com: [false, ''],
                    side: [false, '']
                },
                width: '150px'
            }
        },
        methods: {
            autoToggleForClass(index) {
                index = index + 2;
                let isBottom = index > 0 && (index % 5) === 0;

                return isBottom ? 'ui-fn_flag-bottom' : Math.floor(index / 5) % 2 === 0 ? 'ui-fn_flag-right' : 'ui-fn_flag-left';
            },

            // 添加
            handleAddData() {
                this.dataList.push([this.dataList[this.dataList.length - 1][0], this.dataList[this.dataList.length - 1][1]]);
                this.dataList[this.dataList.length - 2] = [];
                this.autoRefreshLayout();
            },

            // 移除节点
            handleRemoveNode(inx) {
                this.dataList.splice(inx, 1);
                this.autoRefreshLayout();
            },

            // 刷新布局
            autoRefreshLayout() {
                this.$nextTick(() => {
                    let liEl = document.querySelectorAll('.ui-flow_path_set > div > ul > li');
                    liEl.forEach((e, i) => {
                        if (i === 0) return;
                        i = i + 1;
                        if (Math.floor(i / 5) % 2 === 0) {
                            Object.assign(e.style, {
                                float: 'left'
                            });
                        } else {
                            Object.assign(e.style, {
                                float: 'right',
                                marginRight: i % 5 === 0 || i % 5 === 1 ? 0 : '60px',
                            })
                        }
                    })
                })
            },

            // 数据渲染
            handleDataShow(val) {
                let arr = [['直属上司']];
                if (val) {
                    const [{comList, lastList}] = [val];
                    for (let i = 0; i < comList.length; i++) {
                        arr.push([comList[i].user_number, comList[i].min_amount])
                    }

                    for (let i = 0; i < lastList.length; i++) {
                        if (lastList[i].account_type === '1') {
                            this.lastChild.side[0] = true;
                            this.lastChild.side[1] = lastList[i].user_number;
                        }

                        if (lastList[i].account_type === '2') {
                            this.lastChild.com[0] = true;
                            this.lastChild.com[1] = lastList[i].user_number;
                        }
                    }

                    this.$nextTick(() => {
                        this.autoRefreshLayout();
                    })
                } else {
                    arr.push([], []);
                    this.lastChild.com = [false, ''];
                    this.lastChild.side = [false, ''];
                    this.autoRefreshLayout();
                }
                this.dataList = Array.from(arr);
            }
        },
        mounted() {
            this.autoRefreshLayout()
        },
        watch: {
            dataList: {
                handler(val) {
                    let arr = Array.from(val);
                    arr.push(this.lastChild);
                    this.$emit('change', Array.from(arr))
                },
                deep: true
            },
            lastChild: {
                handler(val) {
                    let arr = Array.from(this.dataList);
                    arr.push(val);
                    this.$emit('change', Array.from(arr))
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-flow_path_set {

        margin-bottom: 120px;

        ul {
            li {

                position: relative;
                float: left;
                margin-right: 60px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                height: 80px;
                margin-bottom: 30px;

                &:first-child > span:not(.ui-fn_flag-right), .ui-bg_area{
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                    border-radius: 40px;
                    background: #3e9ffb;
                    text-align: center;
                    color: #FFFFFF;
                }

                &:first-child > .ui-fn_flag-right {
                    width: 95px;
                }

                &:first-child, .ui-bg_area {
                    line-height: 80px;
                }

                &:nth-of-type(2) {
                    .ui-is_com-area{
                        .el-select {
                            margin-top: 24px;
                        }
                    }
                }

                .ui-bg_area {
                    position: absolute;
                    left: 35px;
                    bottom: -133px;
                    background: #4ec34e;
                }

                .el-select, .el-input {
                    width: 100%!important;
                    margin-top: 5px;
                }

                .el-input__suffix {
                    height: 40px;
                }

                .el-input--prefix .el-input__inner {
                    padding: 0;
                }

                .ui-select_icon {
                    display: block;
                    line-height: 32px;
                    padding-left: 5px;
                }

                i.el-icon-remove {
                    display: none;
                    position: absolute;
                    top: 9px;
                    right: -114px;
                    font-size: 15px;
                    color: #CCC;
                    z-index: 1;
                    background: #fff;
                    cursor: pointer;

                    &:hover {
                        color: #666666;
                    }
                }

                .el-select:hover  i.el-icon-remove {
                    display: block;
                }

                .ui-is_com-last {
                    .el-select {
                        width: 62%!important;

                        i.el-icon-remove {
                            right: -57px;;
                        }
                    }
                }

                .ui-bg_area+.ui-fn_flag-bottom {
                    height: 42px;
                    bottom: auto;
                }

                .ui-fn_flag-right, .ui-fn_flag-left, .ui-fn_flag-bottom {
                    position: absolute;
                    background: #cccccc;

                    &::after {
                        content: '';
                        position: absolute;
                        border: solid transparent;
                    }
                }

                .ui-fn_flag-right {
                    width: 60px;
                    height: 2px;
                    top: 50%;
                    right: -60px;
                    margin-top: -1px;

                    &::after {
                        border-left: solid #cccccc;
                        border-width: 5px 0 5px 5px;
                        right: 0;
                        top: -4px;
                    }

                    i.el-icon-circle-plus {
                        font-size: 16px;
                        position: absolute;
                        top: 50%;
                        margin-top: -8px;
                        right: 22px;
                        z-index: 1;
                        background: #ffff;
                        cursor: pointer;
                    }
                }

                .ui-fn_flag-left {
                    width: 60px;
                    height: 2px;
                    top: 50%;
                    left: -60px;
                    margin-top: -1px;

                    &::after {
                        border-right: solid #cccccc;
                        border-width: 5px 5px 5px 0;
                        left: 0;
                        top: -4px;
                    }

                    i.el-icon-circle-plus {
                        font-size: 16px;
                        position: absolute;
                        top: 50%;
                        margin-top: -8px;
                        right: 22px;
                        z-index: 1;
                        background: #ffff;
                        cursor: pointer;
                    }
                }

                .ui-fn_flag-bottom {
                    width: 2px;
                    height: 33px;
                    bottom: -34px;
                    left: 50%;
                    margin-left: -1px;

                    &::after {
                        border-top: solid #cccccc;
                        border-width: 5px 5px 0 5px;
                        bottom: 0;
                        left: -4px;
                    }

                    i.el-icon-circle-plus {
                        font-size: 16px;
                        position: absolute;
                        left: 50%;
                        margin-left: -8px;
                        bottom: 12px;
                        z-index: 1;
                        background: #ffff;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>