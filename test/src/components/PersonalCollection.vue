<style lang="less" scoped>
.PersonalCollectionwrap{
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    .psctwtopbtn{
        font-size: 12px;
        padding: 0 15px 0 0;
        color: #4d4d4d;
        line-height: 28px;
        /deep/ i{
            font-size: 14px;
            margin-right: 5px;
            color: #737371;
        }
        &.active, &:hover{
            color: #409EFF;
            /deep/ i{
                color: #409EFF;
            }
        }
    }
    .psctwtopbtnpanel{
        position: fixed;
        top: 30px;
        bottom: 0;
        right: 0;
        z-index: 999;
        background: #fff;
        width: 333px;
        border-radius: 2px;
        box-shadow: -2px -2px 6px #dbd9d9;
        display: flex;
        .psctwtopbtnpanelbox{
            flex: auto;
            display: flex;
            flex-direction: column;
            padding: 25px;
            .psctwtopbtnpanelhead{
                flex: none;
                height: 40px;
                border-bottom: 1px solid #e6e6e6;
            }
            .psctwtopbtnpanelbody{
                flex: auto;
                overflow-y: auto;
                padding: 10px 0;
                &::-webkit-scrollbar{
                    width: 0;
                }
                a{
                    padding: 6px 0;
                    display: flex;
                    align-items: center;
                    &:hover{
                        color: #38f;
                        background: #f5f7fa;
                    }
                }
            }
        }
    }
    .move-enter-active {
        animation: move-in .4s;
    }
    .move-leave-active {
        animation: move-out .4s;
    }
    @keyframes move-in {
        0% {
            transform: translate3d(100%, 0, 0);
        }
        100% {
            transform: translate3d(0,0,0);
        }
    }
    @keyframes move-out {
        0% {
            transform: translate3d(0,0,0);
        }
        100% {
            transform: translate3d(100%,0,0);
        }
    }

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

.nodatatips{
    padding: 15px 0;
    color: #999;
    text-align: center;
}
</style>

<template>
    <div class="PersonalCollectionwrap" v-if="1 || $route.path == '/staging'">
        <el-button @click="togglePanelShow()" :class="{active: panelShow}" type="text" icon="icon-wenjianjia" size="mini" class="psctwtopbtn">个人收藏夹</el-button>
        <transition name="move">
            <div v-show="panelShow" class="psctwtopbtnpanel">
                <div class="psctwtopbtnpanelbox">
                    <div class="psctwtopbtnpanelhead">
                        <el-button @click="openEditDialog()" type="text">编辑个人收藏夹<i class="icon-bianjihexiugai el-icon--right"></i></el-button>
                    </div>
                    <div class="psctwtopbtnpanelbody">
                        <a v-for="(item, idx) in linkArr" :href="item.url" target="_blank" :key="idx"><span class="icon-dianshangliulanqi"></span>{{item.url_name}}</a>
                        <p v-if="!linkArr.length" class="nodatatips">没有数据</p>
                    </div>
                </div>
            </div>
        </transition>

        <el-dialog
            class="ui-layout_edit-dialog"
            title="个人收藏夹"
            top="5vh"
            width="780px"
            :visible.sync="editDialogObj.dialog">
            <div class="editDialogObjwrap">
                <div v-for="(item, idx) in editDialogObj.data" class="editDialogObjitem" :key="idx">
                    <span class="sortspan">{{idx+1}}.</span>
                    <span style="margin-right: 12px;">名称</span><el-input v-model.trim="item.url_name" placeholder="请输入名称" maxlength="20" show-word-limit size="small" class="showwordlimitipt"></el-input>
                    <span style="margin: 0 12px 0 30px;">网址</span><el-input v-model.trim="item.url" placeholder="请输入网址" size="small"></el-input>
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
    getPersonalCollectionList,
    addPersonalCollectionItem,
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
    methods: {
        togglePanelShow() {
            this.panelShow = !this.panelShow;
            if( this.isfirst ){
                this.isfirst = false;
                this.getLinkList();
            }
        },
        getLinkList() {
            getPersonalCollectionList().then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.linkArr = data.data_list;
            });
        },
        closePanelFn() {
            this.panelShow = false;
        },
        openEditDialog() {
            this.editDialogObj.dialog = true;
            if( this.linkArr.length ){
                this.editDialogObj.data = JSON.parse(JSON.stringify(this.linkArr));
            }else{
                this.editDialogObj.data = [
                    {
                        id: '',
                        url_name: '',
                        url: '',
                    },
                ];
            }
        },
        delItem(idx) {
            this.editDialogObj.data.splice(idx, 1);
        },
        addItem(idx) {
            this.editDialogObj.data.splice(idx+1, 0, {
                id: '',
                url_name: '',
                url: '',
            });
        },
        submitFn() {
            let idx = 0;
            let obj = {
                id: '',
                url_name: '',
                url: '',
            };
            for (let v of this.editDialogObj.data) {
                idx++;
                if( v.url_name && !v.url ) {
                    this.$message.warning('第 ' + idx + ' 项没有输入网址！');
                    return;
                }
                if( !v.url_name && v.url ) {
                    this.$message.warning('第 ' + idx + ' 项没有输入名称！');
                    return;
                }
                if( v.url_name && v.url ) {
                    obj.id = obj.id ? obj.id + ',' + v.id : v.id;
                    obj.url_name = obj.url_name ? obj.url_name + ',' + v.url_name : v.url_name;
                    obj.url = obj.url ? obj.url + ',' + v.url : v.url;
                }
            }
            this.editDialogObj.dialog = false;
            addPersonalCollectionItem(obj).then(({data}) => {
                if (data.status !== 1) {
                    this.$message.error(data.errorMess || '操作失败！');
                    return;
                }
                this.$message.success('修改成功！');
                this.getLinkList();
            });
        },
    },
    watch: {
        $route(to, from) {
            this.closePanelFn();
        },
    }
}
</script>
