<template>
    <div class="user_guide_mask" v-show="value">
        <div class="user_guide_view" :style="view"></div>

        <div class="user_guide_message" :style="messageStyle">
            <div class="user_guide_text">{{message}}</div>
            <el-button-group style="margin-top: 20px">
                <el-button style="margin-right: 20px" @click="pre">上一步</el-button>
                <el-button style="margin-right: 20px" @click="next">下一步</el-button>
                <el-button style="margin-right: 20px" @click="close">关闭帮助</el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
    export default {
        name: "userGuide",
        props: {
            data: {
                type: [Array],
                default: function () {
                    return []
                }
            },
            value:{
                type:[Boolean],
                default:false
            }
        },
        data() {
            return {
                index: 0,
                currentElement: "",
                show: true
            }
        },
        computed: {
            left() {
                return this.currentElement["left"] || 0
            },
            top() {
                return this.currentElement["top"] || 0
            },
            width() {
                return this.currentElement["width"] || 0
            },
            height() {
                return this.currentElement["height"] || 0
            },
            message() {
                return this.data[this.index]["message"] || ""
            },

            view() {
                return {
                    left: this.left - 9999 + "px",
                    top: this.top - 9999 + "px",
                    width: this.width + "px",
                    height: this.height + "px"
                }
            },
            messageStyle() {
                var left = 0;
                if (this.currentElement.left > 300) {
                    left = this.left - 300
                } else {
                    left = this.left
                }
                return {
                    top: this.top + this.height + "px",
                    left: left + "px"
                }
            }
        },
        methods: {
            getClientSize() {
                let el = document.querySelector(this.data[this.index].el);
                if(!el)return
                this.currentElement = el.getBoundingClientRect() || {}
            },
            pre() {
                this.index = Math.max(--this.index, 0)
                this.getClientSize();
            },
            next() {
                if (this.index === this.data.length - 1) {
                    this.close();
                    return
                }
                this.index = Math.min(++this.index, this.data.length - 1);
                this.getClientSize();
            },
            close() {
                this.$emit("input",false)
                this.index = 0
            }
        },
        mounted() {
            window.onresize = () => {
                this.getClientSize();
            }
            this.getClientSize();
        }
    }
</script>

<style lang="scss">
    .user_guide_mask {
        color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;

        .user_guide_message {
            position: fixed;
            z-index: 1;
            width: 50vw;
            padding: 20px;
            display: flex;
            flex-direction: column;

            .user_guide_text {
                font-size: 20px;
            }

            & > .el-button {
                float: right;
            }
        }

        .user_guide_view {
            position: absolute;
            border: 9999px solid rgba(0, 0, 0, 0.7);
            transition: all 0.4s;
        }
    }
</style>