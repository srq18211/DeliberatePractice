<template>
    <!-- <div id="app" class="scroll-wrapper"> -->
    <div id="app">
        <el-header>
            <el-row style="width: 1200px;margin:0 auto" type="flex" align="center" justify="space-between">
                <nav>
                    <router-link to="/">首页</router-link>
                    <router-link to="/exercise">exercise</router-link>
                    <router-link to="/mgmt">mgmt</router-link>
                </nav>
                <el-row type="flex" style="align-items:center">
                    <el-dropdown style="height: 40px"
                                 placement="bottom-end">
                        <el-avatar> user</el-avatar>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="signInUi">登录</el-dropdown-item>
                            <el-dropdown-item @click.native="signOutUi">注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
            </el-row>
        </el-header>
        <el-container>
            <!--user view-->
            <router-view class="view two" name="user_menu">
                <el-aside style="overflow-y: scroll;background: #545c64">
                    <el-menu
                            mode="vertical"
                            width="200"
                            default-active="2"
                            class="el-menu-vertical-demo"
                            @open="handleOpen"
                            @close="handleClose"
                            background-color="#545c64"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>题库管理</span>
                            </template>
                            <el-menu-item-group>
                                <!--                            <template slot="title">科目管理</template>-->
                                <el-menu-item index="1-1"> 科目管理</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>科目管理</span>
                            </template>
                            <el-menu-item-group>
                                <!--                            <template slot="title">科目管理</template>-->
                                <el-menu-item index="1-2"> 科目管理</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
            </router-view>
            <el-main>
                <router-view class="router-view"></router-view>
            </el-main>
        </el-container>
        <el-footer>
            <el-row type="flex" justify="space-between">
                <span>&copy; 2019 xinzejy.cn 京ICP备18018920号 </span>
                <span>
                    <el-button type="text"
                               size="mini"
                               icon="el-icon-full-screen"
                               @click="fullscreen">全屏
                    </el-button></span>
            </el-row>
        </el-footer>
        <el-dialog
                center
                title="用户登录"
                :visible.sync="dialogVisible"
                width="600px"
                :destroy-on-close="true">
            <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="ruleForm.user"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="ruleForm.pswd"></el-input>
                </el-form-item>
                <span>
                </span>
            </el-form>
            <el-divider content-position="center" style="font-size: 30px">
                第三方合作账号登录
            </el-divider>
            <el-row type="flex" justify="space-around">
                <i style="font-size:40px" class="fab fa-github"></i>
                <i style="font-size:40px" class="fa fa-comments"></i>
                <i style="font-size:40px" class="fab fa-qq"></i>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "App",
        data() {
            return {
                time: "",
                dialogVisible: true,
                ruleForm: {
                    user:"",
                    pswd:"",
                },
                form_rules: {
                    user: [
                        {required: true, message: "请输入活动名称", trigger: "blur"},
                        {min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur"}
                    ],
                    pswd: [
                        {required: true, message: "请输入活动名称", trigger: "blur"},
                        {min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur"}
                    ]
                }
            }
        },
        methods: {
            handleOpen(e) {
                console.log(e)
            },
            handleClose(e) {
                console.log(e)
            },
            fullscreen() {
                document.querySelector("#app").requestFullscreen();
            },
            signInUi() {
                this.dialogVisible = true
            },
            signOutUi() {

            }
        },
        mounted() {
            setInterval(() => {
                this.time = new Date().toLocaleString()
            })
        },
        destroyed() {
            clearInterval(this.time)
        }
    }
</script>

<style lang="scss">
    #app {
        width: 100%;
        height: 100%;
        background: #eceef1;
        overflow: hidden;
        /*zoom: 0.75;*/
        .el-header, .el-footer {
            color: #fff;
            line-height: 60px;
            background: #282c35 !important;
            position: fixed;
            width: 100%;

            & a {
                color: #fff;
                margin-left: 20px;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        .el-header {
            top: 0;
        }

        .el-footer {
            bottom: 0;
        }

        .el-container {
            height: 100%;
            /*min-width: 1500px;*/
            box-sizing: border-box;
            padding: 60px 0;

            .el-main {
                .router-view {
                    height: 100%;
                }
            }
        }
    }

</style>