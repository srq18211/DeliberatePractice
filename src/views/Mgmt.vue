<template>
    <div>
        <div class="slide-menu">
            <el-menu default-active="1-4-1" class="el-menu-vertical-demo"
                     :collapse="isCollapse">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span slot="title">导航一</span>
                    </template>
                    <el-menu-item-group>
                        <span slot="title">分组一</span>
                        <el-menu-item index="1-1">选项1</el-menu-item>
                        <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                        <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                        <span slot="title">选项4</span>
                        <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="main">
            <el-card class="box-card">
                <div class="box-card-header" slot="header">
                    <el-button-group>
                        <el-button round size="mini" icon="el-icon-full-screen" @click="fullscreen">全屏</el-button>
                        <el-button round size="mini" icon="el-icon-refresh" @click="queryList">刷新</el-button>
                    </el-button-group>
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-plus" @click="insertDialogVisible=true">新增</el-button>
                        <!--                <el-button type="info" icon="el-icon-edit">编辑</el-button>-->
                        <!--                <el-button type="danger" icon="el-icon-delete">删除</el-button>-->
                    </el-button-group>
                </div>
                <el-table
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            prop="id"
                            label="id"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="id"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="题目"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="answer"
                            label="答案"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="author"
                            label="作者">
                    </el-table-column>
                    <el-table-column
                            prop="createtime"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="150">
                        <template slot-scope="scope">
                            <!--                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
                            <el-button type="text" size="small" @click="handleUpdate(scope.row)">查看/编辑</el-button>
                            <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </el-card>
        </div>
        <!--新增对话框-->
        <el-dialog
                title="新增题目"
                :visible.sync="insertDialogVisible"
                width="30%"
                @closed="insertHandleClose">
            <el-form label-position="right" label-width="80px" size="mini" :model="InsertPayload">
                <el-form-item label="题目"
                              :rules="[{ required: true, message: '题目不能为空'}]">
                    <el-input v-model="InsertPayload.title"></el-input>
                </el-form-item>
                <el-form-item label="答案"
                              :rules="[{ required: true, message: '答案不能为空'}]">
                    <el-input v-model="InsertPayload.answer"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="remoteInsert" :disabled="!insertPermit">确 定</el-button>
            </span>
        </el-dialog>
        <!--删除对话框-->
        <el-dialog
                title="删除"
                :visible.sync="deleteDialogVisible"
                width="30%"
                @closed="deleteHandleClose">
            <!--            <p slot="title"><el-link type="danger">删除</el-link></p>-->
            <el-alert
                    :title="`确认继续操作请输入：${rowPayload.answer}`"
                    type="error">
            </el-alert>

            <el-input v-model="deletePrecheckInput" placeholder="输入题目答案以确认继续删除"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="remoteDelete" :disabled="!deletePermit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Mgmt",
        data() {
            return {
                //菜单折叠状态
                isCollapse: false,
                tableData: [],

                //新增对话框
                insertDialogVisible: false,
                //新增数据载荷
                InsertPayload: {},

                //删除对话框
                deleteDialogVisible: false,
                //编辑数据载荷：查看，修改，删除
                rowPayload: {},
                deletePrecheckInput: ""
            }
        },
        computed: {
            //新增许可
            insertPermit() {
                return this.InsertPayload.title && this.InsertPayload["answer"]
            },
            //删除许可
            deletePermit() {
                return this.deletePrecheckInput === this.rowPayload["answer"]
            }
        },
        methods: {
            insertHandleClose() {
                this.InsertPayload = {};
                this.queryList()
            },
            remoteInsert() {
                this.$axios.post("/api/topic/insert", {...this.InsertPayload})
                    .then(rep => {
                        const {code} = rep["data"];
                        if (code === 0) {
                            this.insertDialogVisible = false;
                        }
                    })
            },
            deleteHandleClose() {
                this.rowPayload = {};
                this.deletePrecheckInput = "";
                this.queryList()
            },
            deleteHandle(row) {
                this.rowPayload = row;
                this.deleteDialogVisible = true;
            },
            remoteDelete() {
                const {id} = this.rowPayload;
                this.$axios(
                    {
                        method: "post",
                        url: "api/topic/delete",
                        params: {id}
                    }
                ).then(rep => {
                    const {code} = rep["data"];
                    if (code === 0) {
                        this.deleteDialogVisible = false;
                        let index = this.tableData.findIndex(row => row.id === id);
                        this.tableData.splice(index, 1)
                    }
                })
            },
            fullscreen() {
                document.querySelector('#app').requestFullscreen();
            },
            queryList() {
                this.$axios.get("/api/topic/list").then(rep => {
                    this.tableData = rep.data.data
                })
            }
        },
        created() {
            this.$axios.get("/api/topic/list").then(rep => {
                this.tableData = rep.data.data
            })
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../assets/main.scss";

    .slide-menu {
        float: left;
        margin-right: 20px;
        @include baseShadow;
    }

    .main {
        overflow: hidden;
    }
    .box-card-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>