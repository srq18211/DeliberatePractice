<template>
    <div>
        <div class="el-cards">
            <el-card shadow="hover" 
                v-for="(item,index) in types" 
                :key="index" 
                :body-style="{padding:0}">
                <div slot="header" class="clearfix">
                    <span>{{item.type}}</span>
                </div>
                <div class="el-body">
                    <el-row style="padding:10px">
                        完成进度
                        <el-progress :percentage="item.percentage" :color="customColorMethod"></el-progress>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                            <el-button @click="routerHandle(item.type)" type="success" style="width:100%" size="small">开始练习</el-button>
                    </el-row>
                    <el-row>
                    </el-row>
                </div>

            </el-card>
        </div>
    </div>
</template>
<script>
    // import appCircle from "@/views/User/Exercise/components/circleProgres.vue"
    export default {
        name: "Home.vue",
        // components:{appCircle },
        data() {
            return {
                types: [
                    // {
                    //     title: "ECMAScript",
                    //     type:"js",
                    //     percentage:60,
                    // },
                    // {
                    //     title: "Css3",
                    //     type:"css",
                    //     percentage:70,
                    // },
                    // {
                    //     title: "WebApi",
                    //     type:"webapi",
                    //     percentage:10,
                    // },
                    // {
                    //     title: "MVVM",
                    //     type:"mvvm",
                    //     percentage:20,
                    // },
                    // {
                    //     title: "计算机网络原理",
                    //     type:"networkPrinciples",
                    //     percentage:20,
                    // },
                    // {
                    //     title: "数据结构与算法",
                    //     type:"algorithms",
                    //     percentage:0,
                    // },
                    // {
                    //     title: "设计，模式",
                    //     type:"designPatterns",
                    //     percentage:20,
                    // },{
                    //     title: "Linux",
                    //     type:"linux",
                    //     percentage:20,
                    // },{
                    //     title: "数据库",
                    //     type:"database",
                    //     percentage:20,
                    // },
                ],
                links: [
                    {
                        title: "印记中文",
                        link: "https://docschina.org/"
                    },
                    {
                        title: "MDN文档",
                        link: "https://developer.mozilla.org/zh-CN/docs/Web"
                    },
                    {
                        title: "掘金前端社区",
                        link: "https://juejin.im/timeline/frontend"
                    },
                    {
                        title: "张鑫旭博客",
                        link: "https://www.zhangxinxu.com/"
                    },
                    {
                        title: "阮一峰ES6",
                        link: "https://es6.ruanyifeng.com/"
                    },
                    {
                        title: "网易公开课 《学习心理学》",
                        link: "http://open.163.com/newview/movie/courseintro?newurl=%2Fspecial%2Fcuvocw%2Fxuexixinlixue.html"
                    },
                ]
            }
        },
        methods:{
            customColorMethod(percentage) {
                if (percentage < 30) {
                    return '#909399';
                } else if (percentage < 70) {
                    return '#e6a23c';
                } else {
                    return '#67c23a';
                }
            },
            routerHandle(type){
                console.log(type)
                this.$router.push(`/exercise/${type}`)
            }
        },
        mounted() {
            this.$axios.get('/api/topic/getTypes').then(rep=>{
                this.types=rep.data.data
            })
        }
    }
</script>

<style scoped lang="scss">
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }

    .el-cards {
        width: 1200px;
        margin: 0 auto;
        
        flex-wrap: wrap;
        /*justify-content: space-between;*/

        & > .el-card {
            box-sizing: border-box;
            width: calc(1000px / 5);
            margin: calc(100px / 5);
            height: 150px;
            display: inline-flex;
            flex-direction: column;
            justify-content: space-between;
            &:hover{
                cursor: pointer;
            }
            .el-card__body{
              flex:auto!important;
            }
            /*display: inline-block;*/
            /*margin:20px;*/
            /*display: inline-flex;*/
        }
    }
</style>