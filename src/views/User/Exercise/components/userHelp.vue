<template>
    <div class="user_guide_mask" v-show="show">
        <div class="user_guide_view" :style="view"></div>
        <div class="user_guide_view-top" :style="topMask"></div>
        <div class="user_guide_view-right" :style="right"></div>
        <div class="user_guide_view-bottom" :style="bottom"></div>
        <div class="user_guide_view-left" :style="leftMask"></div>
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
                    left: this.left + "px",
                    top: this.top + "px",
                    width: this.width + "px",
                    height: this.height + "px"
                }
            },
            topMask() {
                return {
                    width: this.width + "px",
                    left: this.left + "px",
                    top: this.top + "px",
                    transform: `translateY(-100%)`
                }
            },
            bottom() {
                return {
                    width: this.width + "px",
                    left: this.left + "px",
                    top: this.top + "px",
                    transform: `translateY(${this.height}px)`
                }
            },
            leftMask() {
                return {
                    left: this.left + "px",
                    transform: `translateX(-100%)`
                }
            },
            right() {
                return {
                    left: +this.left + +this.width + "px"
                }
            },
            messageStyle() {
                var left = 0;
                if (this.currentElement.left> 300) {
                    left = this.left - 300
                }else{
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
                this.currentElement = el.getBoundingClientRect() || {}
            },
            pre() {
                this.index = Math.max(--this.index,0)
                this.getClientSize();
            },
            next() {
                if(this.index===this.data.length-1){
                    this.close();
                    return
                }
                this.index = Math.min(++this.index,this.data.length-1);
                this.getClientSize();
            },
            close() {
                this.show = false
            }
        },
        mounted() {
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
            }

            & > .el-button {
                float: right;
            }
        }

        .view {
            position: absolute;
            box-sizing: border-box;
            /*border:1px solid #000;*/
        }

        [class^="user_guide_view-"] {
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            position: fixed;
            transition: all 0.7s;
        }

        .user_guide_view-top {
            height: 100vh;
        }

        .user_guide_view-bottom {
            width: 200px;
            /*left: 50px;*/
            /*top: 250px;*/
        }

        .user_guide_view-left {
            width: 100vw;
            top: 0;
        }

        .user_guide_view-right {
            width: 100vw;
            top: 0;
        }
    }
</style>