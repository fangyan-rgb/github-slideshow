<template>
    <div class="ui-look_image" ref="lookImage">
        <div class="ui-look_image--area">
            <img :src="src" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "LookImage",
        props: {
            src: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                imgScale: 1,

                // 元素起始位置
                saveElePosition: [0, 0]
            }
        },
        mounted() {
            const lookImageArea = this.$refs['lookImage'].querySelector('.ui-look_image--area');
            const lookImageAreaImg = this.$refs['lookImage'].querySelector('.ui-look_image--area img');
            const lookImageObj = this.$refs['lookImage'].getBoundingClientRect();
            const astrictObj = [lookImageObj.top, lookImageObj.left, lookImageObj.bottom, lookImageObj.right];

            // 移动图片开关
            let isImageMove = false;

            lookImageAreaImg.onmousedown = function (e) {
                e.preventDefault();
                isImageMove = true;
            };

            lookImageAreaImg.onmouseup = function (e) {
                isImageMove = false;
                mouseS = [0, 0];
            };

            // 设置图片宽高
            if (lookImageAreaImg.offsetHeight >= lookImageAreaImg.offsetWidth) {
                lookImageAreaImg.style.height = '100%';
            } else {
                lookImageAreaImg.style.width = '100%';
            }

            const vm = this;
            const elOffsetObj = lookImageArea.getBoundingClientRect();
            let originData = `${elOffsetObj.width / 2}px ${elOffsetObj.height / 2}px`;

            // saveElePosition

            // 鼠标起点位置
            let mouseS = [0, 0];
            let switchObj = [false, false, false, false];
            lookImageArea.addEventListener('mousemove', function (e) {
                if (isImageMove) {
                    const offsetData = [e.offsetX - mouseS[0], e.offsetY - mouseS[1]];
                    if (!mouseS[0] && !mouseS[1]) {
                        mouseS = Array.from([e.offsetX, e.offsetY]);
                        return;
                    }

                    let [{top, bottom, left, right}] = [lookImageAreaImg.getBoundingClientRect()];

                    // 限制top
                    if (top >= astrictObj[0]) {
                        switchObj[0] = true;
                        if (offsetData[1] < 0) {
                            switchObj[0] = false;
                        }
                    } else {
                        switchObj[0] = false;
                    }

                    // 限制bottom
                    if (bottom <= astrictObj[2]) {
                        switchObj[2] = true;
                        if (offsetData[1] > 0) {
                            switchObj[2] = false;
                        }
                    } else {
                        switchObj[2] = false;
                    }

                    // 限制left
                    if (left >= astrictObj[1]) {
                        switchObj[1] = true;
                        if (offsetData[0] < 0) {
                            switchObj[1] = false;
                        }
                    } else {
                        switchObj[1] = false;
                    }

                    // 限制right
                    if (right <= astrictObj[3]) {
                        switchObj[3] = true;
                        if (offsetData[0] > 0) {
                            switchObj[3] = false;
                        }
                    } else {
                        switchObj[3] = false;
                    }
                    console.log(right);

                    if ((!switchObj[1] && offsetData[0] > 0) || (!switchObj[3] && offsetData[0] < 0)) {
                        // console.log(offsetData[1]);
                        mouseS[0] = e.offsetX;
                        vm.saveElePosition[0] = vm.saveElePosition[0] + offsetData[0];
                    }

                    if ((!switchObj[0] && offsetData[1] > 0) || (!switchObj[2] && offsetData[1] < 0)) {
                        // console.log(offsetData[1]);
                        mouseS[1] = e.offsetY;
                        vm.saveElePosition[1] = vm.saveElePosition[1] + offsetData[1];
                    }

                    lookImageArea.style.transform = `translateX(${vm.saveElePosition[0]}px) translateY(${vm.saveElePosition[1]}px) scale(${imgScale})`;
                }

                if (e.path[0].localName !== 'img') {
                    isImageMove = false;
                    mouseS = [0, 0]
                }
            });

            //FF
            if (window.addEventListener) {
                window.addEventListener('DOMMouseScroll', wheel, false);
            }

            //统一处理滚轮滚动事件
            window.onmousewheel = document.onmousewheel = wheel;//W3C

            function wheel(event){
                let delta = 0;
                if (!event) event = window.event;
                if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                    delta = event.wheelDelta/120;
                    if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
                } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
                    delta = -event.detail/3;
                }
                if (delta)
                    handle(delta);
            }

            // 图片缩放数值
            let imgScale = 1;
            lookImageArea.style.transformOrigin = originData;

            //上下滚动时的具体处理函数
            function handle(delta) {
                if (delta < 0){
                    if (imgScale <= 0.2) return;
                    //向下滚动
                    imgScale -= 0.1;
                    lookImageArea.style.transform = `scale(${imgScale})`;
                }else{
                    //向上滚动
                    if (imgScale >= 6) return;
                    imgScale += 0.1;
                    lookImageArea.style.transform = `scale(${imgScale})`;
                }
                vm.saveElePosition = [0, 0];
                vm.imgScale = imgScale;
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
</style>