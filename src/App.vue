<template>
    <!-- <div id="app" class="scroll-wrapper"> -->
    <div id="app">
        <el-header>
            <el-row style="width: 1200px;margin:0 auto" type="flex" align="center" justify="space-between">
                <nav>
                    <router-link to="/">首页</router-link>
                    <!-- <router-link to="/exercise">知识点练习</router-link> -->
                    <router-link to="/mgmt">题库管理</router-link>
                </nav>
                <el-row type="flex" style="align-items:center">
                    <el-dropdown style="height: 40px"
                                 placement="bottom-end">
                        <el-avatar> user</el-avatar>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="signDialogVsb=true">登录</el-dropdown-item>
                            <el-dropdown-item @click.native="signOut">注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
            </el-row>
        </el-header>
        <el-container>
            <!--user view-->
            <router-view class="view two" name="user_menu">
                <el-aside style="overflow-y: scroll;background: #545c64">

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
                :close-on-click-modal="false"
                center
                title="用户登录"
                :visible.sync="signDialogVsb"
                width="600px"
                :destroy-on-close="true">
            <el-form ref="userSign"
                     :rules="form_rules"
                     :model="ruleForm"
                     label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%" @click="siginInRemote('userSign')">登录</el-button>
                </el-form-item>
            </el-form>
            <!--            <el-divider content-position="center" style="font-size: 30px">-->
            <!--                第三方合作账号登录-->
            <!--            </el-divider>-->
            <!--            <el-row type="flex" justify="space-around">-->
            <!--                <i style="font-size:40px" class="sign_btn fab fa-github"></i>-->
            <!--                <i style="font-size:40px" class="sign_btn fa fa-comments"></i>-->
            <!--                <i style="font-size:40px" class="sign_btn fab fa-qq"></i>-->
            <!--            </el-row>-->
        </el-dialog>
    </div>
</template>

<script>
    import Cookie from "js-cookie"

    export default {
        name: "App",
        data() {
            return {
                time: "",
                signDialogVsb: false,
                ruleForm: {
                    username: "",
                    password: "",
                },
                form_rules: {
                    username: [
                        {required: true, message: "请输入活动名称", trigger: "blur"},
                        {min: 5, max: 18, message: "长度在 6 到 8 个字符", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "请输入活动名称", trigger: "blur"},
                        {min: 5, max: 18, message: "长度在 6 到 8 个字符", trigger: "blur"}
                    ]
                }
            }
        },
        methods: {
            fullscreen() {
                document.querySelector("#app").requestFullscreen();
            },
            //远程登陆，客户端状态存储
            siginInRemote(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        alert("检查格式");
                        return false
                    }
                    this.$axios.post("/api/user/login", {
                        ...this.ruleForm
                    }).then(res => {
                        this.signDialogVsb = false;
                        const {code} = res.data;
                        if (code !== 0) {
                            return
                        }
                        this.$message({
                            message: "登录成功!",
                            type: "success"
                        });
                        Cookie.set("login", "online", {expires: 1})
                    })

                })
            },
            //客户端清理session
            signOut() {
                Cookie.set("login", "offline", {expires: 1});
                this.$router.push("/")
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
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
        .el-avatar {
            cursor: pointer;
        }

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

        .el-footer {
            bottom: 0;
        }

        .el-container {
            height: 100%;
            box-sizing: border-box;
            padding: 50px 0;

            .el-main {
                .router-view {
                    height: 100%;
                }
            }
        }

        .sign_btn {
            &:hover {
                cursor: pointer;
                color: #F44336;
            }
        }
    }

</style>