<template>
    <div style="margin:0 auto;width: 1000px">
        <el-card class="dashbord">
            <div class="circle-wrap">
                <circle-progres :right="right" :total="list.length" :wrong="wrong"></circle-progres>
            </div>
            {{logList}}
        </el-card>
        <el-card :class="{'error':error}">
            <div slot="header"> 答题卡 {{duration}}</div>
            <div class="topic-field">
                <div class="topic">
                    ID:{{nowTopic.id}}<h1>{{nowTopic.title}}</h1>
                </div>
                <el-input
                        rows="10"
                        ref="input"
                        clearable
                        v-model="input"
                        placeholder="输入答案"
                        autofocuse
                        @input.native="inputHandle"
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
        <el-card>
            <div slot="header">
                答案：
                <el-switch
                        v-model="switchV"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
            </div>
            <span v-if="switchV==='1'">{{nowTopic.answer}}</span>
        </el-card>
    </div>
</template>

<script>
    import circleProgres from "./components/circleProgres"

    export default {
        components: {circleProgres},
        data() {
            return {
                switchV: true,

                input: "",
                error: false,

                beginTime: new Date(),

                duration: "",
                currentTopicTimer: "",

                list: [],

                index: 0,

                right: 0,
                wrong: 0,

                logList: []
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
            //输入事件
            inputHandle(e) {
                e.preventDefault();
                this.diffValue(this.input, this.nowTopic.answer)
            },
            //下一道题
            nextTopic(e) {
                e.preventDefault();
                this.logHandle();
                this.beginTime = new Date();
                // e.stopPropagation();
                if (!this.input || this.error) {
                    this.$confirm("是否提交到错题本？", '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.wrongHandle();
                    }).catch(() => {
                    })
                    return;
                }

                //验证答案是否正确
                this.validateInput(this.input, this.nowTopic.answer)
                    .then(() => {
                        this.rightHandle();

                    })
                    .catch(() => {
                        this.wrongHandle();
                    })

                //检查是否是最后一题
                if(this.index===this.list.length-1){
                    clearInterval(this.currentTopicTimer)
                }
            },
            //验证答案
            validateInput(v1, v2) {
                return new Promise((resolve, reject) => {
                    v1 === v2 ? resolve() : reject()
                })
            },
            //题目正确切换
            rightHandle() {
                //获取题目总数
                let total = this.list.length;
                this.index = Math.min(++this.index, total - 1)
                this.right = Math.min(total - this.wrong, ++this.right)
                this.input = ""
            },
            //题目错误切换
            wrongHandle() {
                //获取题目总数
                let total = this.list.length;
                this.index = Math.min(++this.index, total)
                this.wrong = Math.min(total - this.right, ++this.wrong)
                this.input = ""
            },
            logHandle(topicId, time) {
                this.logList.push({
                    topicId: this.nowTopic.id,
                    time: this.duration
                })
            },
            /**
             * @desc 对比字符串，返回不同索引数组
             * @param value
             * @param str
             */
            diffValue(value, str) {
                if (!value || !str) return;
                this.error = (value !== str.slice(0, value.length))
            },
            userInputTimer() {
                clearInterval(this.currentTopicTimer)
                this.currentTopicTimer = setInterval(() => {
                    this.duration = new Date() - this.beginTime
                },60)
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
            });
            this.userInputTimer()
        },
        destroyed() {
            clearInterval(this.currentTopicTimer)
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../../assets/main";

    .el-card {
        /*height: 300px;*/
        margin-bottom: 20px;

        .circle-wrap {
            width: 200px;
        }
    }

    .error {
        color: #F44336;
    }

    .topic-field {
        height: 30vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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

