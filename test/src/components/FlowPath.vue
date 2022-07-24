<template>
    <div class="ui-flow_path">
        <ul>
            <li class="clearFix"
                v-if="!item.minAmount || item.minAmount <= condition"
                v-for="(item, index) in dataList"
                :key="index">
                <div :class="item.applyForNum === item.auditUserNum ? 'ui-active_state' : 'ui-default_state' "></div>
                <div class="ui-label_area">
                    <div>
                        <span>{{item.title}}</span>
                    </div>
                    <div>
                        <span>{{item.applyForName}}</span>
                    </div>
                </div>
                <div class="ui-detail_area">
                    <div>
                        <span class="ui-state" :class="'ui-state' + item.state">{{item.stateCn}}</span>
                        <span class="ui-time">{{item.time}}</span>
                    </div>
                    <div class="ui-main_content">
                        <span>{{item.content}}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "FlowPath",
        props: {
            dataList: {
                type: Array,
                default() {
                    return [];
                }
            },
            condition: {
                default: 0
            },
        },
        watch: {
            condition(val) {
                console.log(val);
            }
        }
    }
</script>

<style scoped lang="less">

    @import (reference) '../assets/less/index';
    @state-init: #999999;
    @state-success: #4fc44f;
    @state-wait: #efb507;
    @state-error: #ff6765;

    .ui-flow_path {
        padding-left: 30px;
        border-left: 1px dotted #676767;

        li > div {
            float: left;
        }
        
        li {
            position: relative;
            margin-bottom: 20px;
        }

        .ui-active_state {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #379fff;
            position: absolute;
            -webkit-box-shadow: 0 0 0 2px rgba(55, 159, 255, 0.3);
            box-shadow: 0 0 0 2px rgba(55, 159, 255, 0.3);
            top: 50%;
            margin-top: -5px;
            left: -35px;
        }

        .ui-default_state {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #cccccc;
            position: absolute;
            -webkit-box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5);
            box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5);
            top: 50%;
            margin-top: -5px;
            left: -35px;
        }

        .ui-state0 {
            background: @state-wait;
        }

        .ui-state1 {
            background: @state-success;
        }

        .ui-state2 {
            background: @state-error;
        }

        .ui-state3 {
            background: @state-success;
        }

        .ui-label_area {

            margin-right: 30px;
            width: 60px;
            text-align: center;

            & > div:first-child {
                font-size: 14px;
                color: #8D8D8D;
                padding: 3px 0;
            }

            & > div:last-child {
                font-size: 14px;
                color: #333333;
            }
        }

        .ui-detail_area {
            text-align: left;

            & > div:first-child .ui-state{
                font-size: 12px;
                padding: 2px 12px;
                /*background: #999999;*/
                color: #fff;
                border-radius: 15px;
                margin-right: 5px;
                margin-bottom: 3px;
                display: inline-block;
            }

            & > div:first-child .ui-time{
                font-size: 14px;
                color: #8D8D8D;
            }
        }
    }
</style>