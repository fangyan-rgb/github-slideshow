<template>
    <el-dialog
            class="ui-layout_edit-dialog"
            top="8vh"
            title="预览图片"
            width="1000px"
            append-to-body
            :visible.sync="isShow"
            @close="handleClosePreview">
        <div class="ui-look_image" ref="lookImage">
            <div class="ui-look_image--area">
                <img v-for="(url, key) in srcList"
                    :key="key"
                    :src="url"
                    alt="" 
                    style="display: none">
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import Viewer from 'viewerjs';
    export default {
        name: "PreviewImg",
        props: {
            src: {
                type: [Array, String],
                default() {
                    return [];
                }
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                areaObj: {},
                isShow: false
            }
        },
        computed: {
            srcList() {
                return Array.isArray(this.src) ? this.src : [this.src]
            }
        },
        mounted() {

        },
        methods: {
            handleClosePreview() {
                this.$emit('update:show', false);
            },

            // 加载
            handleLoadImage(type) {
                this.$nextTick().then(() => {
                    let lookImageArea;
                    const vm = this;
                    if (type === 'change') {
                        lookImageArea = this.$refs['lookImage'].querySelectorAll('.ui-look_image--area img');
                        this.areaObj.update(lookImageArea, {
                            inline: true,
                            // toolbar: false,
                            viewed: function() {
                                // console.log('change');
                                document.querySelector('.viewer-play').style.display = 'none';
                                document.querySelector('.viewer-prev').style.display = 'block';
                                document.querySelector('.viewer-next').style.display = 'block';
                            }
                        });
                        vm.areaObj.reset();
                    } else {
                        lookImageArea = this.$refs['lookImage'].querySelector('.ui-look_image--area');
                        this.areaObj = new Viewer(lookImageArea, {
                            inline: true,
                            // toolbar: false,
                            // url: 'src',
                            viewed: function() {
                                vm.areaObj.zoomTo(1);
                                document.querySelector('.viewer-play').style.display = 'none';
                                document.querySelector('.viewer-prev').style.display = 'block';
                                document.querySelector('.viewer-next').style.display = 'block';
                            }
                        });
                    }
                })
            }
        },
        watch: {
            show(val) {
                if (!val) return;
                this.isShow = this.show;
                this.$nextTick(() => {
                    if (this.areaObj.update) {
                        this.handleLoadImage('change');
                    } else {
                        this.handleLoadImage();
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-look_image {
        width: 100%;
        overflow: hidden;
        height: 600px;
        .ui-look_image--area {
            /*overflow: hidden;*/
            height: 600px;
            transition: all linear .1s;
            img {
                /*width: 100%;*/
                /*height: 100%;*/
            }
        }
    }

    .ui-look_image--oper {
        height: 50px;
        line-height: 50px;
        text-align: center;

        span {
            cursor: pointer;

            &:hover {
                color: #5980FC;
            }
        }
    }
</style>