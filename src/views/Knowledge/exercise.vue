<template>
    <div>
        <el-card class="dashbord top-border">
            <div slot="header">数据面板</div>
            <div class="circle-wrap">
                <circle-progres :right="right" :total="list.length" :wrong="wrong"></circle-progres>
            </div>
            <!--            <h1>已经完成：{{completed}}</h1>-->
            <!--            <h1>花费时间</h1>-->
            <p>{{time}}</p>
        </el-card>
        <el-card class="top-border">
            <div slot="header">答题卡</div>
            <div class="topic-field">
                <div class="panel topic">
                    <h1>{{nowTopic.title}}</h1>
<!--                    <h1>{{nowTopic.answer}}</h1>-->
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
        </el-card>
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
                        this.index = Math.min(++this.index, total - 1)
                        this.right = Math.min(total - this.wrong, ++this.right)
                        this.input = ""
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
            this.$axios.get("/api/topic/list?pageSize=150").then(rep => {
                const list = rep["data"].data["listData"];
                return new Promise((resolve, reject) => {
                    list ? resolve(list) : reject()
                })
            }).then(data => {
                this.list = this.shuffle(data);
                loading.close();
            }).catch(err => {
                loading.close();
                // this.$router.back();
            })
        },
        mounted() {
            setInterval(() => {
                this.time = new Date().toLocaleString()
            })
        },
        destroyed() {
            clearInterval(this.time)
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/main.scss";

    .dashbord {
        height: 300px;

        .circle-wrap {
            width: 200px;
        }
    }

    .top-border {
        border-top: 5px solid #36cfc9;
    }

    .topic-field {
        height: 30vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .panel {
        margin: 5px 5px 20px 5px;
        padding: 20px;
        @include baseShadow;
    }

    .topic {
        min-height: 100px;
        font-size: 20px;
        line-height: 30px;
    }

    .tools {
        height: 50px;
    }
</style>

