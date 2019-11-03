<template>
    <div style="margin:0 auto;width: 1000px">
        <el-card :class="{'error':error}">
            <div slot="header">
                答题卡
                {{duration}}
            </div>
            <div class="topic-field">
                <el-row type="flex" class="topicQuestion">
                    <div style="height:200px;width: 200px">
                        <circle-progres :right="right" :total="list.length" :wrong="wrong"></circle-progres>
                    </div>
                    <div style="height: 50%">
                        <div v-if="nowTopic.id">ID:</div>
                        {{nowTopic.id}}<h1>{{nowTopic.title}}</h1>
                    </div>
                </el-row>
                <el-row>
                    <el-input
                            class="topicUserInput"
                            rows="10"
                            ref="input"
                            clearable
                            v-model="input"
                            placeholder="输入答案"
                            autofocuse
                            @input.native="inputHandle"
                            @keydown.13.native="nextTopic">
                    </el-input>
                </el-row>

                <el-row style="margin-top: 20px;" type="flex" justify="space-between" align="center">
                    <el-button-group class="topicOperate">
                        <el-button size="mini" type="info" icon="el-icon-star-off">收藏</el-button>
                        <el-button size="mini" type="info" icon="el-icon-document-delete">屏蔽</el-button>
                    </el-button-group>
                    <el-button-group class="startBtn">
                        <el-button v-if="index==-1"
                                   type="primary">开始
                        </el-button>
                        <el-button v-else
                                   type="primary"
                                   @click="nextTopic"
                                   ref="nextTopic">下一题
                        </el-button>
                    </el-button-group>
                </el-row>
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
        <user-help v-if="guideVisible" :data="guide"></user-help>
    </div>
</template>

<script>
    import userHelp from "./components/userHelp"
    import circleProgres from "./components/circleProgres"

    export default {
        components: {circleProgres, userHelp},
        data() {
            return {
                switchV: true,

                input: "",
                error: false,

                beginTime: "",

                duration: "",
                ticTimer: "",
                //题目列表
                list: [],
                index: -1,

                right: 0,
                wrong: 0,

                logList: [],
                guideVisible: true,
                guide: [
                    {
                        el: ".topicQuestion",
                        message: "答题卡区域，这里会显示题目"
                    },
                    {
                        el: ".topicUserInput",
                        message: "答题卡区域，在这里输入答案，回车键可以快速提交"
                    }, {
                        el: ".topicOperate",
                        message: "这里收藏或者屏蔽当前题目"
                    }, {
                        el: ".startBtn",
                        message: "在没有开始之前，这里是开始按钮，点击开始答题。"
                    }
                ]
            };
        },
        computed: {
            nowTopic() {
                return this.list[this.index] || {}
            },
            completed() {
                return this.right + this.wrong || 0
            },
            total() {
                return this.list.length;
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
                // e.stopPropagation();
                //题目未开始
                if (this.index === -1) {
                    this.index++;
                    this.ticHandle();
                    return;
                }
                //题目已开始
                this.checkLast()
                    .then(() => {
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
                                this.switchV === "1" ? this.wrongHandle() : this.rightHandle()
                            })
                            .catch(() => {
                                this.wrongHandle()
                            })
                    })
                    .catch(() => {
                        this.duration = ""
                        clearInterval(this.ticTimer);
                        return
                    })

            },
            //验证答案
            validateInput(v1, v2) {
                return new Promise((resolve, reject) => {
                    v1 === v2 ? resolve() : reject()
                })
            },
            //题目正确切换
            rightHandle() {
                return new Promise((resolve, reject) => {
                    //获取题目总数
                    this.index = Math.min(++this.index, this.total - 1);
                    this.right = Math.min(this.total - this.wrong, ++this.right)
                    this.input = "";
                    this.logHandle()
                    resolve()
                })
            },
            //题目错误切换
            wrongHandle() {
                return new Promise((resolve, reject) => {
                    //获取题目总数
                    this.index = Math.min(++this.index, this.total);
                    this.wrong = Math.min(this.total - this.right, ++this.wrong)
                    this.input = "";
                    this.logHandle()
                    resolve()
                })
            },
            logHandle(validate) {
                this.logList.push({
                    topicId: this.nowTopic.id,
                    time: this.duration,
                    validate
                });
                this.ticHandle();
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
            ticHandle() {
                console.log("tic")
                clearInterval(this.ticTimer);
                this.beginTime = "";
                this.beginTime = new Date();
                this.ticTimer = setInterval(() => {
                    this.duration = new Date() - this.beginTime
                }, 60)
            },
            checkLast() {
                return new Promise((resolve, reject) => {
                    //检查是否是最后一题
                    this.index === this.list.length ? reject() : resolve()
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
            });
            // this.ticHandle()
        },
        destroyed() {
            clearInterval(this.ticTimer)
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../../assets/main";

    .el-card {
        /*height: 300px;*/
        margin-bottom: 20px;
    }

    .error {
        color: #F44336;
    }

    .topic-field {
        min-height: 40vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        /*align-items: center;*/
    }

    .tools {
        height: 50px;
    }

</style>

