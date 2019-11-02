<template>
    <div>
        <el-card class="box-card">
            <div class="box-card-header" slot="header">
                <el-button-group>

                    <el-button round size="mini" icon="el-icon-refresh" @click="queryList">刷新</el-button>
                    <el-input size="mini"
                              style="margin-left:20px;width: 500px;"
                              placeholder="请输入内容"
                              v-model="fuzzyInput"
                              @keydown.enter.native="queryList"
                              clearable
                              class="input-with-select">
                        <el-select size="mini"
                                   style="width: 100px"
                                   v-model="fuzzyKey"
                                   slot="prepend"
                                   @change="pageNo=0"
                                   placeholder="请选择">
                            <!--                                <el-option label="餐厅名" value="1"></el-option>-->
                            <el-option style="text-align: center;line-height: 36px;" label="题目"
                                       value="keyword"></el-option>
                            <el-option style="text-align: center;line-height: 36px;" label="作者"
                                       value="author"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search"
                                   @click.native="queryList"></el-button>
                    </el-input>
                </el-button-group>
                <el-button-group>
                    <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="dialogShowInsert=true">新增
                    </el-button>
                    <!--                    <el-button type="primary" icon="el-icon-edit">导入json格式</el-button>-->
                    <!--                <el-button type="danger" icon="el-icon-delete">删除</el-button>-->
                </el-button-group>
            </div>
            <el-table
                    height="65vh"
                    :data="tableData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        type="index"
                        :index="indexMethod"
                        width="50">
                </el-table-column>
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
                    <template slot-scope="scope">
                        <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden">
                            {{scope.row.title}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="answer"
                        label="答案"
                        width="300">
                    <template slot-scope="scope">
                        <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden">
                            {{scope.row.answer}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="author"
                        label="作者"
                        width="150">
                    <template slot-scope="scope">
                        <i class="el-icon-user">
                            {{scope.row.author}}
                        </i>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createtime"
                        label="创建时间">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.createtime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="250">
                    <template slot-scope="scope">
                        <!--                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
                        <el-button type="info" icon="el-icon-edit" size="small" @click="updateHandle(scope.row)">查看/编辑
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteHandle(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex" justify="space-between" style="margin:20px 0">
                <el-pagination
                        class="pagination"
                        background
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :total="count">
                </el-pagination>
                <el-button-group>
                    <el-button type="primary" size="mini">批量删除</el-button>
                    <el-button type="primary" size="mini">添加分类标签</el-button>
                </el-button-group>
            </el-row>
        </el-card>
        <!--新增对话框-->
        <el-dialog
                title="新增题目"
                :visible.sync="dialogShowInsert"
                width="500px"
                @closed="insertHandleClose">
            <el-form label-position="right" label-width="80px" size="mini" :model="payloadInsert">
                <el-form-item label="题目"
                              :rules="[{ required: true, message: '题目不能为空'}]">
                    <el-input v-model="payloadInsert.title"></el-input>
                </el-form-item>
                <el-form-item label="答案"
                              :rules="[{ required: true, message: '答案不能为空'}]">
                    <el-input type="textarea" rols="10" autosize v-model="payloadInsert.answer"
                              @keydown.enter.native="remoteInsert"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShowInsert = false">取 消</el-button>
                <el-button type="primary" @click="remoteInsert" :disabled="!insertPermit">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改对话框-->
        <el-dialog
                title="修改题目"
                :visible.sync="dialogShowUpdate"
                width="500px"
                @closed="updateHandleClose">
            <el-form label-position="right" label-width="80px" size="mini" :model="payloadRow">
                <el-form-item label="题目"
                              :rules="[{ required: true, message: '题目不能为空'}]">
                    <el-input v-model="payloadRow.title"></el-input>
                </el-form-item>
                <el-form-item label="答案"
                              :rules="[{ required: true, message: '答案不能为空'}]">
                    <el-input v-model="payloadRow.answer"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShowUpdate = false">取 消</el-button>
                <el-button type="primary" @click="remoteUpdate">确 定</el-button>
            </span>
        </el-dialog>
        <!--删除对话框-->
        <el-dialog
                title="删除題目"
                :visible.sync="dialogShowDelete"
                width="500px"
                @closed="deleteHandleClose">
            <!--            <p slot="title"><el-link type="danger">删除</el-link></p>-->
            <el-alert
                    style="padding:20px;margin-bottom:20px"
                    :title="`确认继续操作请输入：${payloadRow.answer}`"
                    type="error"
                    :closable="false"
                    description="目前暫不支持假性刪除，刪除后無法恢復"
                    show-icon>
            </el-alert>
            <el-input v-model="deletePrecheckInput" placeholder="输入题目答案以确认继续删除"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShowDelete = false">取 消</el-button>
                <el-button type="danger" @click="remoteDelete" :disabled="!deletePermit">确 定</el-button>
            </span>
        </el-dialog>
        <!--添加分类标签-->
        <el-dialog
                title="标签编辑"
                :visible.sync="dialogShowDelete"
                width="500px"
                @closed="deleteHandleClose">
            <!--            <p slot="title"><el-link type="danger">删除</el-link></p>-->
            <el-alert
                    style="padding:20px;margin-bottom:20px"
                    :title="`确认继续操作请输入：${payloadRow.answer}`"
                    type="error"
                    :closable="false"
                    description="目前暫不支持假性刪除，刪除后無法恢復"
                    show-icon>
            </el-alert>
            <el-input v-model="deletePrecheckInput" placeholder="输入题目答案以确认继续删除"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShowDelete = false">取 消</el-button>
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
                //表格数据
                tableData: [],

                //模糊查询键
                fuzzyKey: "keyword",
                //模糊查询值
                fuzzyInput: "",
                //新增对话框show
                payloadInsert: {},
                //编辑数据缓存：查看，修改，删除
                payloadRow: {},
                //新增数据缓存
                dialogShowInsert: false,
                //更新对话框show
                dialogShowUpdate: false,
                //删除对话框
                dialogShowDelete: false,

                //清醒验证输入
                deletePrecheckInput: "",

                //分页
                count: 0,
                pageNo: 1,
            }
        },
        watch: {
            pageNo: function () {
                this.queryList()
            }
        },
        computed: {
            //新增许可
            insertPermit() {
                return this.payloadInsert.title && this.payloadInsert["answer"]
            },
            //删除许可
            deletePermit() {
                return this.deletePrecheckInput === this.payloadRow["answer"]
            }
        },
        methods: {
            indexMethod(index) {
                return index + 1
            },
            insertHandleClose() {
                this.payloadInsert = {};
                this.queryList()
            },
            updateHandleClose() {
                this.payloadRow = {};
                this.queryList()
            },
            remoteInsert() {
                if (!this.insertPermit) {
                    return
                }
                this.$axios.post("/api/topic/insert", {...this.payloadInsert})
                    .then(rep => {
                        const {code} = rep["data"];
                        if (code === 0) {
                            this.dialogShowInsert = false;
                        }
                    })
            },
            remoteUpdate() {
                const params = {
                    id: this.payloadRow["id"]
                }
                const data = {
                    title: this.payloadRow["title"],
                    answer: this.payloadRow["answer"]
                }
                this.$axios({
                    url: "api/topic/update",
                    method: "post",
                    params: params,
                    data: data
                }).then(rep => {
                    const {code} = rep["data"];
                    if (code === 0) {
                        this.dialogShowUpdate = false;
                    }
                })
            },
            deleteHandleClose() {
                this.payloadRow = {};
                this.deletePrecheckInput = "";
                this.queryList()
            },
            updateHandle(row) {
                this.payloadRow = row;
                this.dialogShowUpdate = true;
            },
            deleteHandle(row) {
                this.payloadRow = row;
                this.dialogShowDelete = true;
            },
            remoteDelete() {
                const {id} = this.payloadRow;
                this.$axios(
                    {
                        method: "post",
                        url: "api/topic/delete",
                        params: {id}
                    }
                ).then(rep => {
                    const {code} = rep["data"];
                    if (code === 0) {
                        this.dialogShowDelete = false;
                        let index = this.tableData.findIndex(row => row.id === id);
                        this.tableData.splice(index, 1)
                    }
                })
            },
            queryList() {
                let params = {};
                if (this.fuzzyInput) {
                    params[this.fuzzyKey] = this.fuzzyInput;
                }
                if (this.pageNo) {
                    params["pageNo"] = this.pageNo;
                }
                //如果不是通过模糊查询方式，则清空
                this.$axios.get("/api/topic/list", {params}).then(rep => {
                    if (rep.data.code !== 0) return
                    this.tableData = this.formatCreateTime(rep["data"].data["listData"])
                    this.count = rep.data.data.count
                })
            },
            formatCreateTime(tableData) {
                return tableData.map(topic => {
                    var time = topic["createtime"];
                    return {
                        ...topic,
                        createtime: new Date(time).toLocaleString()
                    }
                })
            }
        },
        created() {
            this.queryList()
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../../assets/main";

    .el-card {
        height: 100%;
        position: relative;
        box-sizing: border-box;
    }

    .box-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>