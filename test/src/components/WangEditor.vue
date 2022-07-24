<style scoped lang="less">
.ui-wang_editor{
    background-color: #fff;
    .wangEditorBar{
        height: 30px;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
        /deep/ .w-e-menu{
            padding: 0 10px;
            z-index: 2 !important;
        }
    }
    .wangEditorBody{
        border: 1px solid #ccc;
        border-top: none;
        z-index: 1 !important;
        /deep/ p{
            margin: 0;
        }
    }

}
</style>

<template>
    <div class="ui-wang_editor">
        <div class="wangEditorBar" ref="wangEditorBar"></div>
        <div class="wangEditorBody" ref="wangEditorBody" :style="styleObj"></div>
    </div>
</template>

<script>
import wangeditor from 'wangeditor';

export default {
    name: "WangEditor",
    data() {
        return {
            editorObj: {}
        }
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        styleObj: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    mounted() {
        const editor = new wangeditor(this.$refs.wangEditorBar, this.$refs.wangEditorBody);

        // 自定义菜单配置
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            // 'emoticon',  // 表情
            // 'image',  // 插入图片
            'table',  // 表格
            // 'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ];

        // 自定义处理粘贴的文本内容
        editor.customConfig.pasteTextHandle = content => {
            // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
            if (content == '' && !content) return '';
            var str = content;
            str = str.replace(/<xml[^>]*>[\s\S]*?<\/xml>/ig, '');
            str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/ig, '');
            str = str.replace(/<!--[^>]+[\s\S]*?-->/ig, '');
            str = str.replace(/<\/?spanyes[^>]*>/ig, '');
            str = str.replace(/<\/?o:p[^>]*>/ig, '');
            str = str.replace(/<\/?font[^>]*>/ig, '');
            // str = str.replace(/<\/?[^>]*>/g, '');
            // str = str.replace(/[ | ]*\n/g, '\n');
            str = str.replace(/&nbsp;/ig, '');
            return str;
        }

        editor.customConfig.onchange = html => {
            if( html === '<p><br></p>' ){
                html = '';
            }
            this.$emit('input', html);
        };

        editor.create();
        this.editorObj = editor;

        this.handleSetValue(this.value);
    },
    methods: {
        handleSetValue(val) {
            let params = ''
            if( val ){
                if(/^\s*<\/?[^>]*>/g.test(val)){
                    params = val;
                }else{
                    params = `<p style="white-space: pre-wrap;">${val}</p>`;
                }
            }
            this.editorObj.txt.html(params);
        },
        handleChangeState(val) {
            this.editorObj.$textElem.attr('contenteditable', val);
        },
        handleGetText() {
            let str = this.editorObj.txt.html();
            str = str.replace(/&nbsp;/ig, ' ');  // 去掉&nbsp;
            return str;
        },
        handleInsertText(val) {
            this.editorObj.cmd.do('insertText', val);
        },
    },
    watch: {
        isDisabled(val) {
            this.editorObj.$textElem.attr('contenteditable', !val);
        }
    }
}
</script>
