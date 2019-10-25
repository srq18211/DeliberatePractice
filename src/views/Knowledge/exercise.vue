<template>
    <div>
        <el-page-header @back="$router.back()" content="完型填空专项练习">
        </el-page-header>
        <div class="dashbord">
            <circle-progres :right="right" :total="list.length" :wrong="wrong"></circle-progres>
            <!--            <h1>已经完成：{{completed}}</h1>-->
            <!--            <h1>花费时间</h1>-->
            <p>{{time}}</p>
        </div>
        <div class="topic-field">
            <div class="panel topic">
                <h1>{{nowTopic.title}}</h1>
                <h1>{{nowTopic.answer}}</h1>
            </div>
            <el-input
                    rows="10"
                    ref="input"
                    clearable
                    v-model="input"
                    placeholder="输入答案"
                    autofocuse
                    @keydown.13.native="nextTopic">
            </el-input>
            <el-col style="margin-top: 20px;">
                <el-button
                        style="width:100%"
                        type="primary"
                        :loading="false"
                        @click="nextTopic"
                        ref="nextTopic">下一题
                </el-button>
            </el-col>
        </div>
    </div>
</template>

<script>
    import circleProgres from "./circleProgres"

    export default {
        components: {circleProgres},
        data() {
            return {
                input: "",
                list: [],

                index: 0,

                right: 0,
                wrong: 0,

                time: "",
            };
        },
        computed: {
            nowTopic() {
                return this.list[this.index] || {}
            },
            completed() {
                return this.right + this.wrong || 0
            }
        },
        methods: {
            //乱序
            shuffle(arr) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    let rIndex = Math.floor(Math.random() * (i + 1));
                    let temp = arr[rIndex];
                    arr[rIndex] = arr[i];
                    arr[i] = temp;
                }
                return arr;
            },
            //下一道题
            nextTopic() {
                let total = this.list.length;
                this.validateInput(this.input, this.nowTopic.answer)
                    .then(() => {
                        this.index = Math.min(++this.index, total-1)
                        this.right = Math.min(total - this.wrong, ++this.right)
                        this.input=""
                    }).catch(() => {
                        this.index = Math.min(++this.index, total)
                        this.wrong = Math.min(total - this.right, ++this.wrong)
                    }
                )
            },
            //验证答案
            validateInput(v1, v2) {
                return new Promise((resolve, reject) => {
                    v1 === v2 ? resolve() : reject()
                })
            }
        },
        created() {
            let loading = this.$loading({
                target: ".el-container",
                text: "loading"
            });
            this.$axios.get("/api/topic/list", {
                id: this.id
            }).then(rep => {
                const list = rep["data"].data;
                return new Promise((resolve,reject)=>{
                    list?resolve(list):reject()
                })
            }).then(data => {
                this.list = this.shuffle(data);
                loading.close();
            }).catch(err=>{
                loading.close();
                // this.$router.back();
            })
        },
        mounted() {
            setInterval(() => {
                this.time = new Date().toLocaleString()
            })
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/main.scss";

    .el-page-header {
        margin-bottom: 50px;
    }

    .dashbord {
        height: 60vh;
        float: left;
        margin-right: 20px;
        @include baseShadow;
        box-sizing: border-box;
        padding: 0 20px;
        border-top: 5px solid #36cfc9;
        border-bottom: 5px solid #36cfc9;
    }

    .topic-field {
        height: 60vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .topic {
            height: 30vh;
        }

        /*.el-input{*/
        /*    height: 20vh;*/
        /*}*/
    }

    .panel {
        margin: 5px 5px 20px 5px;
        padding: 20px;
        @include baseShadow;
    }

    .topic {
        min-height: 100px;
    }

    .tools {
        height: 50px;
    }
</style>

