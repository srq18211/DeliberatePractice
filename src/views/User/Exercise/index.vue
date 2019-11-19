<template>
  <div style="margin:0 auto;width: 1000px">
    <el-card :class="{'error':error}">
      <div slot="header">
        答题卡:
        <span>{{index}}/{{listTotal}}</span>
        <span v-if="index<0">点击开始按钮或者在答案区域按下回车键开始练习题目</span>
        <!-- <el-button @click="guideVisible=true">查看帮助</el-button> -->
        <!-- <el-button @click="showSelector=true">选择题库</el-button> -->
        <!-- <el-button>错题重做</el-button>    -->
      </div>
      <div class="topic-field">
        <el-row type="flex" class="topicQuestion">
          <div style="height:200px;width: 200px">
            <circle-progres :right="right" :total="list.length" :wrong="wrong"></circle-progres>
          </div>
          <div style="height: 50%">
            <span v-if="nowTopic.id">ID:</span>
            {{nowTopic.id}}
            <h1>{{nowTopic.title}}</h1>
          </div>
        </el-row>
        <el-row>
          <el-input
            class="topicUserInput"
            rows="10"
            ref="input"
            clearable
            v-model="userInputAnswer"
            placeholder="输入答案"
            autofocuse
            @keyup.native="inputHandle"
            @keydown.13.native="nextTopic"
          ></el-input>
        </el-row>
        <el-row style="margin-top: 20px;" type="flex" justify="space-between" align="center">
          <el-button-group class="topicOperate">
            <!-- <el-button size="mini" type="info" icon="el-icon-star-off">收藏</el-button> -->
            <!-- <el-button size="mini" type="info" icon="el-icon-document-delete">屏蔽</el-button> -->
            <el-button size="mini" type="info" @click="guideVisible=true" icon="el-icon-document-delete">查看帮助</el-button>
          </el-button-group>
          <el-button-group class="startBtn">
            <el-button v-if="beforeStart" type="primary" @click="index++">开始</el-button>
            <el-button v-if="started" type="primary" @click="nextTopic" ref="nextTopic">下一题(回车键)</el-button>
            <el-button v-if="finished" type="primary" @click="reset">重新开始</el-button>
          </el-button-group>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <el-row slot="header" type="flex" align="center">
        <el-switch
          style="margin-right:20px"
          v-model="showAnswer"
          active-value="true"
          inactive-value="false"
        ></el-switch>显示答案后提交，不能算作已掌握哦
      </el-row>
      <span v-if="showAnswer==='true'">答案：{{nowTopic.answer}}</span>
    </el-card>
    <el-dialog title="选择题目" :fullscreen="false" :visible.sync="showSelector">
      <el-row type="flex" justify="space-between">
        <el-input
          size="mini"
          style="margin-left:20px;width: 500px;"
          placeholder="请输入内容"
          v-model="fuzzyInput"
          @keydown.enter.native="queryList"
          clearable
          class="input-with-select"
        >
          <el-select
            size="mini"
            style="width: 100px"
            v-model="fuzzyKey"
            slot="prepend"
            @change="pageNo=1"
            placeholder="请选择"
          >
            <el-option style="text-align: center;line-height: 36px;" label="题目" value="keyword"></el-option>
            <el-option style="text-align: center;line-height: 36px;" label="作者" value="author"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click.native="queryList"></el-button>
        </el-input>
        <el-button size="mini" type="success">添加到本次练习计划</el-button>
      </el-row>
      <div class="dialog-body-scrollwrap">

      </div>
      <el-row type="flex" justify="space-between" style="margin:20px 0">
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :current-page.sync="pageNo"
          @current-change="currentChange"
          :total="pageCount"
        ></el-pagination>
      </el-row>
    </el-dialog>
    <user-guide v-model="guideVisible" :data="guideData"></user-guide>
  </div>
</template>

<script>
import userGuide from "./components/userHelp";
import circleProgres from "./components/circleProgres";

import mixins from "./mixins";
export default {
  mixins: [mixins],
  components: { circleProgres, userGuide },
  created() {
    this.queryList();
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
  color: #f44336;
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

.dialog-body-scrollwrap {
  margin-top: 20px;
  height: 60vh;
  overflow-y: scroll;
}
</style>

