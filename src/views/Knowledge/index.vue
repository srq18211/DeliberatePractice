<template>
    <div>
        <el-row class="panel">
<!--            <h2>基础知识</h2>-->
            <el-checkbox-group v-model="checkboxGroup" size="large">
                <el-checkbox
                        class="checkbox-item"
                        v-for="(item,index) in lables"
                        :key="index"
                        :label="item.id"
                        border
                        style="margin-left:0;margin-top:5px">
                    <div class="checkbox-viewwrap">
                        <div class="checkbox-title">{{item.name}}</div>
                        <el-progress
                                class="checkbox-progress"
                                :text-inside="true"
                                :stroke-width="20"
                                :percentage="item.completed"
                        ></el-progress>
                    </div>
                </el-checkbox>
            </el-checkbox-group>
        </el-row>
        <el-row class="knowledge_footer">
<!--            <el-col>选择难度：</el-col>-->
<!--            <el-rate v-model="rateValue" show-text :max="+3" :texts="texts"></el-rate>-->
            <el-col>
                <el-button style="width: 100%" type="primary" :loading="false" @click="startexercise('startBtn')" ref="startBtn">进入练习
                </el-button>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeName: "",
                rateValue: null,
                texts: ["了解", "熟悉", "掌握"],
                checkboxGroup: [],
                lables: []
            };
        },
        methods: {
            startexercise(whitchBtn) {
                // this.$refs[whitchBtn].loading = true
                // this.$axios.post("beginPrectice")
                //     .then(rep => {
                //         const {id} = rep["data"].data;
                //         this.$router.push(`/knowledge/exercise/${id}`)
                        this.$router.push(`/knowledge/exercise`)
                    // })
            }
        },
        created() {
            let loading = this.$loading({
                target:".el-container",
                text: "loading"
            });
            this.$axios.get("/api/topic/tags").then(rep => {
                const list= rep["data"].data;
                this.lables = list;
                loading.close()
            });
        }
    };
</script>
<style scope>
    .el-checkbox__input{
        top: -17px;
    }
    .el-calendar{
        max-height: 60vh;
        margin-bottom: 80px ;
    }
    .checkbox-item {
        margin-bottom: 1em;
    }

    .checkbox-title {
        min-width: 10em;
    }

    .el-rate {
        padding: 20px 0;
    }

    .knowledge_footer {
        padding: 20px 0;
    }
</style>

