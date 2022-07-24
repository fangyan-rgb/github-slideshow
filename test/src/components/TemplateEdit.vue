<style lang="less">
    .templateEditObjwrap{
        max-height: 700px;
        overflow-y: auto;
        .templateEditObjtop{
            padding-bottom: 20px;
            border-bottom: 1px solid #e6e6e6;
        }
        .templateEditObjbody{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 18px 60px;
            .templateEditObjbodyitem{
                width: 280px;
                border: 1px solid #e6e6e6;
                border-radius: 3px;
                .itemhead{
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    background: #f3f3f3;
                }
                .itembox{
                    min-height: 30px;
                    padding: 0 10px;
                    line-height: 30px;
                    text-align: center;
                    border-top: 1px solid #e6e6e6;
                    cursor: pointer;
                    &.active, &:hover{
                        background: #ecf6ff;
                    }
                }
            }
        }
    }
    .commonTemplateObjwrap{
        padding-left: 20px;
        max-height: 700px;
        overflow-y: auto;
        .commonTemplateObjitem{
            margin-bottom: 18px;
            .sortspan{
                display: inline-block;
                width: 30px;
            }
            .editspan{
                i{
                    cursor: pointer;
                }
                i:first-child{
                    margin-left: 10px;
                }
            }
        }
    }

.nodatatips{
    padding: 15px 0;
    color: #999;
    text-align: center;
}
</style>

<template>
    <div class="TemplateEditwrap">
        <el-button @click="openDialogFn()" type="primary" size="small">更多</el-button>

        <el-dialog
            class="ui-layout_edit-dialog"
            title="模板编辑"
            top="5vh"
            width="800px"
            append-to-body
            :visible.sync="templateEditObj.dialog">
            <div class="templateEditObjwrap">
                <div class="templateEditObjtop">
                    <span>搜索模板：</span>
                    <el-input v-model="templateEditObj.searchValue" placeholder="请搜索" size="small"></el-input>&nbsp;
                    <el-button @click="searchTemplateFn()" type="primary" size="small">搜索</el-button>
                </div>
                <div class="templateEditObjbody">
                    <div class="templateEditObjbodyitem">
                        <div class="itemhead">
                            模板分类
                        </div>
                        <div @click="curTemNav = v.id" v-for="(v, i) in templateEditObj.data" :key="i" :class="{active: v.id === curTemNav}" class="itembox">
                            {{v.name}}<span v-if="v.name === '常用'" @click="openCommonTpl(v.child)" class="icon-bianjihexiugai el-icon--right" style="color: #6caaff;"></span>
                        </div>
                    </div>
                    <div class="templateEditObjbodyitem">
                        <div class="itemhead">
                            模板名称
                        </div>
                        <div @click="selectTemplate(v.id)" v-for="(v, i) in curTemplateList" :key="i" :class="{active: (templateEditObj.searchValue && (templateEditObj.data.find(e => e.id === curTemNav).name === '全部')) ? v.template_name.includes(templateEditObj.searchValue) : ''}" class="itembox">
                            {{v.template_name}}
                        </div>
                        <div v-if="!curTemplateList.length" class="nodatatips">
                            列表为空
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            class="ui-layout_edit-dialog"
            title="常用模板配置"
            top="5vh"
            width="430px"
            append-to-body
            :visible.sync="commonTemplateObj.dialog">
            <div class="commonTemplateObjwrap">
                <div v-for="(item, idx) in commonTemplateObj.data" class="commonTemplateObjitem" :key="idx">
                    <span class="sortspan">{{idx + 1}}.</span>
                    <el-select v-model="item.id" filterable placeholder="请选择" size="small">
                        <el-option v-for="(v, i) in allTemplateList" :label="v.template_name" :value="v.id" :key="i"></el-option>
                    </el-select>
                    <span class="editspan">
                        <i v-if="commonTemplateObj.data.length > 1" @click="delItem(idx)" class="icon-shanjian" title="删除此行"></i><i @click="addItem(idx)" class="icon-zengjia" title="在下面添加一行"></i>
                    </span>
                </div>
            </div>
            <span slot="footer">
                <el-button @click="commonTemplateObj.dialog = false" size="small">取消</el-button>
                <el-button @click="submitcommonTemplateFn()" type="primary" size="small">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getCustomizeMailTemplateList,
    addCustomizeMailTemplate,
} from '@/api/Common';

export default {
    name: 'PersonalCollection',
    data () {
        return {
            isfirst: true,
            curTemNav: '',
            templateEditObj: {
                dialog: false,
                searchValue: '',
                data: [],
            },

            commonTemplateObj: {
                dialog: false,
                data: [],
            },
        }
    },
    props: {
        platform: {
            type: String,
            default: '',
        },
    },
    computed: {
        curTemplateList() {
            let arr = [];
            if( this.curTemNav ){
                let obj = this.templateEditObj.data.find(e => e.id === this.curTemNav)
                if( obj ){
                    arr = obj.child;
                }
            }
            return arr;
        },
        allTemplateList() {
            let arr = [];
            let obj = this.templateEditObj.data.find(e => e.name === '全部');
            if( obj ){
                arr = obj.child;
            }
            return arr;
        },
    },
    methods: {
        openDialogFn() {
            this.templateEditObj.dialog = true;
            if( this.isfirst ){
                this.isfirst = false;
                this.getList();
            }
        },
        getList() {
            getCustomizeMailTemplateList({platform_code: this.platform, type: this.platform == 'EB' ? 1 : ''}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                let arr = [];
                if( Array.isArray(data.data_list) ){
                    arr = data.data_list;
                }else{
                    Object.keys(data.data_list).forEach((e, i) => {
                        arr.push({
                            id: i+1,
                            name: e,
                            child: data.data_list[e],
                        });
                    });
                    if( arr.length ){
                        let idx = arr.findIndex(e => e.name === '常用');
                        let obj = arr.splice(idx, 1);
                        arr.unshift(obj[0]);
                    }
                }
                this.templateEditObj.data = arr;
                if( arr.length ){
                    this.curTemNav = arr[0].id;
                }
            });
        },
        selectTemplate(id) {
            this.templateEditObj.dialog = false;
            this.$emit('selectTemplate', id);
        },
        openCommonTpl(arr) {
            this.commonTemplateObj.dialog = true;
            if( !arr.length ){
                arr = [
                    {
                        id: '',
                    }
                ];
            }
            this.commonTemplateObj.data = JSON.parse(JSON.stringify(arr));
        },
        delItem(idx) {
            this.commonTemplateObj.data.splice(idx, 1);
        },
        addItem(idx) {
            this.commonTemplateObj.data.splice(idx+1, 0, {
                id: ''
            });
        },
        submitcommonTemplateFn() {
            let id = [];
            this.commonTemplateObj.data.forEach(e => {
                if( e.id ){
                    id.push(e.id);
                }
            });
            addCustomizeMailTemplate({id: id.join(','), platform_code: this.platform, type: this.platform == 'EB' ? 1 : ''}).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.$message.success('修改成功！');
                this.commonTemplateObj.dialog = false;
                this.getList();
            });
        },
        searchTemplateFn() {
            this.curTemNav = this.templateEditObj.data.find(e => e.name === '全部').id;
            let str = this.templateEditObj.searchValue;
            if( !str ){
                return;
            }
        },
    },
}
</script>
