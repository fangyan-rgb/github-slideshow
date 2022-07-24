<template>
    <div>
        <div></div>
        <div>
            <label>
                <input type="file" name="fileData">
            </label>
            <el-button></el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ComUploadList",
        props: [],
        data() {
            return {
                uploadData: []
            }
        },
        methods: {
            handleSubmit() {
                console.log(this.uploadData);
            }
        },
        created() {

        },
        mounted() {
            const file = document.querySelectorAll('.files');
            let formData = new FormData();
            file.forEach((e, i) => {
                e.addEventListener('change', function () {
                    // console.log(this.files);
                    // var reader = new FileReader();//新建一个FileReader
                    // reader.readAsDataURL(this.files[0]);//读取文件
                    // reader.onload = function (evt) { //读取完文件之后会回来这里
                    //     var fileString = evt.target.result;
                    //     //post方式上传图片到控制器
                    //     var date = {"file": fileString};
                    //     // $.post("editProfile", date).success(function (result) {
                    //     //     alert("ok");
                    //     // });
                    //     console.log(date);
                    // }
                    formData.append("mydata" + i, this.files[0]);
                    this.uploadData = formData;
                });
            });

            console.log(file);
        }
    }
</script>

<style scoped>

</style>