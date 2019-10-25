<template>
    <div class="hello">
        <el-card class="box-card">
            <div class="title">
                <h3>{{currentTitle}}</h3>
            </div>
            <div class="desc  secondary">
                提示：{{currentDesc}}
            </div>
            <el-button size="small" @click="keyVisible=!keyVisible">
                <span v-if="keyVisible">隐藏</span>
                <span v-else>显示</span>
                答案
            </el-button>
            <div class="secondary" v-if="keyVisible">
                {{currentKey}}
            </div>
        </el-card>
        <el-row>
            <el-col :span="18">
                <el-input
                        ref="input"
                        clearable
                        autofocus v-model="input"
                        placeholder="在这里输入答案，大小写敏感"
                        @input.native="nextTopic('auto')"
                        @keydown.enter.native="nextTopic('enter')"
                >
                </el-input>
            </el-col>
            <el-col :span="6">
                <el-select v-model="select" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import topicMixins from "@/utils/Topic.js"
    import _ from "lodash"

    export default {
        name: 'topicCloze',
        mixins: [topicMixins],
        filters: {
            reverse(v) {
                if (!v) return
                return v.toString().split("").reverse().join("")
            }
        },
        data() {
            return {
                input: "",
                select: "enter",
                options: [{
                    value: 'auto',
                    label: '回答正确自动提交'
                }, {
                    value: 'enter',
                    label: '按下 Enter 提交'
                }],
                keyVisible: false,
                data: []
            }
        },
        methods: {
            /**
             * @param submitType
             */
            nextTopic(submitType) {
                if (submitType !== this.select) {
                    return;
                }
                if (this.currentData.key !== this.input.toString()) {
                    this.$message({
                        showClose: true,
                        message: '不是预期的答案',
                        type: 'error'
                    });
                    //手机震动
                    window.navigator.vibrate(200);
                    return;
                }
                this.data.splice(0, 1);
                this.input = ""
            }
        },
        computed: {
            currentData() {
                return this.data[0] || {}
            },
            currentTitle() {
                return this.currentData.title
            },
            currentDesc() {
                return this.currentData.desc
            },
            currentKey() {
                return this.currentData.key
            }
        },
        watch: {
            currentData: function (v) {
                console.log(!v.id)
            }
        },
        mounted() {
            this.setDatabasesByFile().then(data => {
                this.data = _.shuffle(data)
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .box-card {
        min-height: 200px;
    }

    .desc {
        white-space: pre-line;
    }

    .el-select {
        width: 100%;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

</style>
