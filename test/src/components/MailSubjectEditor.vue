<style lang="less" scoped>
.MailSubjectEditorwrap{
    display: flex;
    .editDialogObjwrap{
        padding-left: 20px;
        max-height: 690px;
        overflow-y: auto;
        .editDialogObjitem{
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
}
</style>

<template>
    <div class="MailSubjectEditorwrap">
        <el-button @click="togglePanelShow()" type="primary" style="margin-left: 15px;">编辑主题</el-button>

        <el-dialog
            class="ui-layout_edit-dialog"
            title="编辑主题"
            top="5vh"
            width="820px"
            :visible.sync="editDialogObj.dialog">
            <div class="editDialogObjwrap">
                <div v-for="(item, idx) in editDialogObj.data" class="editDialogObjitem" :key="idx">
                    <span class="sortspan">{{idx+1}}.</span>
                    <el-input v-model.trim="item.subject" placeholder="请输入主题" maxlength="500" show-word-limit size="small" class="showwordlimitipt" style="width: 640px;"></el-input>
                    <span class="editspan">
                        <i v-if="editDialogObj.data.length > 1" @click="delItem(idx)" class="icon-shanjian" title="删除此行"></i><i v-if="editDialogObj.data.length < 50" @click="addItem(idx)" class="icon-zengjia" title="在下面添加一行"></i>
                    </span>
                </div>
            </div>
            <span slot="footer">
                <el-button @click="editDialogObj.dialog = false" size="small">取消</el-button>
                <el-button @click="submitFn()" type="primary" size="small">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getMailSubjectEditor,
    saveMailSubjectEditor,
} from '@/api/Common';

export default {
    name: 'PersonalCollection',
    data () {
        return {
            panelShow: false,
            isfirst: true,
            linkArr: [],
            editDialogObj: {
                dialog: false,
                data: [],
            },
        }
    },
    props: {
        platform: {
            type: String,
            default: 'Amazon'
        },
    },
    methods: {
        togglePanelShow() {
            this.editDialogObj.dialog = true;
            this.editDialogObj.data = [];
            getMailSubjectEditor({}, this.translateStr(this.platform)).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                if( !data.data_list.length ){
                    data.data_list = [
                        {
                            id: 0,
                            subject: '',
                        }
                    ];
                }
                this.editDialogObj.data = data.data_list;
            });
        },

        delItem(idx) {
            this.editDialogObj.data.splice(idx, 1);
        },
        addItem(idx) {
            this.editDialogObj.data.splice(idx+1, 0, {
                id: 0,
                subject: '',
            });
        },

        submitFn() {
            let idx = 0;
            let obj = {
                data: [],
            };
            for (let v of this.editDialogObj.data) {
                console.log(v)
                if( v.subject ) {
                    obj.data.push(v);
                }
            }
            this.editDialogObj.dialog = false;
            saveMailSubjectEditor(obj, this.translateStr(this.platform)).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.$message.success('修改成功！');
                this.$emit('success');
            });
        },

        translateStr(str) {
            if( str == 'EB' ) {
                str = 'Ebay';
            }
            return str;
        },
    },
}
</script>
