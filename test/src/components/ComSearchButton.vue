<style lang="less" scoped>
    .ui-search-config-btn {
        font-family: "Microsoft YaHei","微软雅黑";
        padding: 0;
        line-height: 28px;
        font-size: 12px;
        color: #333;
        padding-right: 24px;
        border-bottom-color: #e6e6e6;
        i {
            margin-right: 3px;
            position: relative;
            top: 2px;
            color: #999;
        }
        &:hover {
            color: #409EFF;
        }
    }
    .ui-search-container {
        position: fixed;
        top: 30px;
        bottom: 0;
        right: 0;
        background: white;
        width: 333px;
        overflow: auto;
        z-index: 999;
        border-radius: 2px;
        box-shadow: -2px -2px 6px #dbd9d9;
        display: flex;
        flex-direction: column;
    }
    .move-enter-active {
        -webkit-animation: move-in .4s;
    }
    .move-leave-active {
        -webkit-animation: move-out .4s;
    }
    @-webkit-keyframes move-in {
        0% {
            -webkit-transform: translate3d(100%, 0, 0);
        }
        100% {
            -webkit-transform: translate3d(0,0,0);
        }
    }
    @-webkit-keyframes move-out {
        0% {
            -webkit-transform: translate3d(0,0,0);
        }
        100% {
            -webkit-transform: translate3d(100%,0,0);
        }
    }
    .el-checkbox-group {
        display: flex;
        flex-direction: column;
        flex: auto;
        overflow: auto;
        &::-webkit-scrollbar{width:0}
        .el-checkbox {
            margin-left: 20px!important;
            .el-checkbox__inner {
                border-radius: 0;
            }
        }
        .el-checkbox+.el-checkbox {
            margin-top:6px;
        }
    }
    .ui-search {
        padding: 12px 12px 10px 10px;
        /deep/ .el-input__inner {
            height: 30px!important;
            line-height: 30px;
        }
        /deep/ .el-input__icon {
            line-height: unset;
        }
    }
    .ui-footer {
        padding: 10px;
        display: flex;
        justify-content: space-evenly;
    }
</style>
<template>
    <div class="ui-container" v-if="defaultConfigArr.indexOf($route.path)!== -1">
        <el-button type="text" class="ui-search-config-btn" @click='show=!show'><i class="icon-sousuopeizhi"></i>搜索配置</el-button>
        <transition name="move">
            <div v-show="show" class="ui-search-container">
                <div class="ui-search">
                    <el-input
                        placeholder="请输入搜索条件"
                        suffix-icon="el-icon-search"
                        v-model="queryData.condition"
                        clearable
                        @input='handleFuzzyQuery'>
                      </el-input>
                </div>
                <el-checkbox-group v-model="checkedContent" v-if="searchConfig.all_data && searchConfig.all_data[$route.path]">
                    <el-checkbox v-for="(item, index) in allData" :label="item.html_name" :key="index">{{item.attribute_name}}
                    </el-checkbox>
                </el-checkbox-group>
                <div class="ui-footer">
                    <el-button @click="handleCancel" size="small">取 消</el-button>
                    <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import Store from '@/store'
    import { mapGetters } from 'vuex'
    import { defaultConfigArr, defaultConfig } from '@/assets/js/commonSearch'
    import { getSearchList } from '../api/Common'
    import http from '@/http';

    export default {
        name: 'ComSearchButton',
        props: {},
        data() {
            return {
                show: false,
                queryData: { condition: '' },
                defaultConfigArr,
            }
        },
        methods: {
            handleCancel() {
                this.show = false
            },
            handleConfirm() {
                if (!this.checkedContent.length) {
                    this.$message.warning('至少勾选一个查询条件')
                    return
                }
                const saveMainData = this.searchConfig.all_data[this.$route.path].filter(item => this.checkedContent.indexOf(item.html_name) !== -1)
                // 获取保存的查询参数
                if (this.searchConfig.main_data) {
                    this.searchConfig.main_data[this.$route.path] = saveMainData
                    this.$store.commit('SAVE_COMMON_SEARCH_CONFIG', this.searchConfig);
                    this.handleTransformData(saveMainData)
                    Store.commit('SAVE_CHECK_MAINDATA', saveMainData);
                }
                this.show = false
            },
            /**
             * CaseeLee
             * 处理返回参数
             * @param main_data 查询数据
             */
             handleTransformData(main_data) {
                if (Array.isArray(main_data)) {
                    main_data.forEach((item, index) => {
                        if (item.css_type === 'select') {
                            if (item['select_data'] && item['is_url'] === '0') {
                                try {
                                    item['optionValue'] = JSON.parse(item['select_data']) 
                                    item['originOptionValue'] = item['optionValue']
                                    } 
                                catch(err) {
                                    console.log('json解析出错', item['select_data'], err)
                                    }
                            } else if (!item['optionValue'] && item['is_url'] === '1') {
                                item['optionValue'] = []
                                this.handleGetOption(item, main_data)
                            }
                        } else if (item.css_type === 'cascader' && !item['options']) {
                            item['options'] = []
                            this.handleGetCascaderOption(item, main_data)
                        }
                    })
                }
            },
            /**
             * CaseeLee
             * 处理级联默认请求
             * @param main_data 查询数据
             */
            handleGetCascaderOption (item, main_data) {
                let url = this.handleQueryUrl(item['url_address'])
                http.getAjax(url).then(({data}) => {
                    if (data.status !== 1){
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    item['options'] = data.data_list
                    main_data = [...main_data]
                    Store.commit('SAVE_CHECK_MAINDATA', main_data);
                    this.handleCacheSelectData(item)
                })
            },
             /**
             * 模糊查询
             */
             handleFuzzyQuery() {
                 const newArr = []
                 this.searchConfig.all_data[this.$route.path].map(item => item.attribute_name).forEach((item, index) => {
                    if (item.indexOf(this.queryData.condition) >= 0) {
                        newArr.push(this.searchConfig.all_data[this.$route.path][index]);
                    }
                })
                return newArr
            },
            /**
             * CaseeLee
             * 默认下拉框请求
             * @param item 数据项
             */
             handleGetOption(item, main_data) {
                let url = this.handleQueryUrl(item['url_address'])
                http.getAjax(url).then(({data}) => {
                    if (data.status !== 1){
                        this.$message.error(data.errorMess || '操作失败')
                        return;
                    }
                    item['optionValue'] = data.data_list
                    item['originOptionValue'] = data.data_list
                    main_data = [...main_data]
                    Store.commit('SAVE_CHECK_MAINDATA', main_data);
                    this.handleCacheSelectData(item)
                })
            },
             /**
             * CaseeLee
             * 处理查询地址
             * @param url 查询地址
             */
             handleQueryUrl(url){
                if (!url) return;
                let unnecessary = 'api'
                if (url.indexOf(unnecessary) !== -1) {
                   return url.substring(url.indexOf(unnecessary) + unnecessary.length)
                }
                return url
            },
            /**
             * CaseeLee
             * 缓存下拉数据
             * @param item 数据项
             */
             handleCacheSelectData(item){
                 const copyConfig = this.searchConfig.all_data[this.$route.path].map(_item => {
                    if (_item.html_name === item.html_name) {
                        return {...item}
                    }
                    return _item
                })
                this.searchConfig.all_data[this.$route.path]  = copyConfig
                this.$store.commit('SAVE_COMMON_SEARCH_CONFIG',  this.searchConfig);
            }
        },
        computed: {
            ...mapGetters(['searchConfig']),
            checkedContent: {
                get() {
                    return this.$store.state.checkedSearchInfo;
                },
                set(newValue) {
                    this.$store.state.checkedSearchInfo = newValue
                }
            },
            allData: {
                get() {
                    return this.handleFuzzyQuery()
                }
            },
        },
        watch: {
            $route(nv) {
                if (nv) {
                    this.show = false
                }
            }
        }
    }
</script>

