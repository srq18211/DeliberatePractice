import { createNamespacedHelpers } from "vuex";

const {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} = createNamespacedHelpers("exercise");
export default {
  props: ["type"],
  data() {
    return {
      //模糊输入
      fuzzyInput: "",
      //模糊查询字段
      fuzzyKey: "",
      //总页数
      pageCount: "",
      //当前页
      pageNo: 1,

      //用户输入值
      userInputAnswer: "",
      error: false,

      beginTime: "",

      duration: "",
      ticTimer: "",
      //原始题目列表
      list: [],

      index: -1,

      right: 0,
      wrong: 0,
      showSelector: false,
      guideVisible: false,
      guideData: [
        {
          el: ".topicQuestion",
          message: "答题卡区域，这里会显示题目"
        },
        {
          el: ".topicUserInput",
          message: "答题卡区域，在这里输入答案，回车键可以快速提交"
        },
        {
          el: ".topicOperate",
          message: "这里收藏或者屏蔽当前题目"
        },
        {
          el: ".startBtn",
          message: "在没有开始之前，这里是开始按钮，点击开始答题。"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      stateShowAnswer: state => state.showAnswer
    }),
    nowTopic() {
      return this.shuffleList[this.index] || {};
    },
    completed() {
      return this.right + this.wrong || 0;
    },
    total() {
      return this.list.length;
    },
    shuffleList() {
      return this.shuffle(this.list);
    },
    showAnswer: {
      set(value) {
        this.setAnswerVisible(value);
      },
      get() {
        return this.stateShowAnswer;
      }
    },
    listTotal(){
        return this.list.length || 0
    },
    beforeStart(){
      return this.index<0;
    },
    started(){
      return !this.beforeStart && !this.finished 
    },
    finished(){
      return this.listTotal===this.index
    }
  },
  methods: {
    ...mapMutations(["setAnswerVisible"]),
    currentChange(page) {
      // console.log(page)
      this.queryList(page);
    },
    //乱序
    shuffle(arr) {
      var str = JSON.stringify(arr);
      var sarr = JSON.parse(str);
      for (let i = sarr.length - 1; i >= 0; i--) {
        let rIndex = Math.floor(Math.random() * (i + 1));
        let temp = sarr[rIndex];
        sarr[rIndex] = sarr[i];
        sarr[i] = temp;
      }
      return sarr;
    },
    //输入事件
    inputHandle(e) {
      e.preventDefault();
      this.diffValue(this.userInputAnswer, this.nowTopic.answer);
    },
    //下一道题
    async nextTopic(e) {
      e.preventDefault();

      //如果是最后一道题
      if (this.index === this.shuffleList.length) {
        this.$confirm("重新开始吗？","重新开始，或者结束练习")
        .then(()=>{
          this.reset()
        })
        .catch(()=>{
          
        })
        return;
      }
      //如果还未开始，只是开始第一道题目
      if (this.index < 0) {
        this.index++;
        return;
      }
    
      //判断是否正确
      const result = await this.validateInput(
        this.userInputAnswer,
        this.nowTopic.answer
      );

      if (!result) {
        //是否提示错误
        const confirm = await this.showConfirm(result);
        if (confirm) {
        this.wrongHandle()    
        }
      } else {
        this.rightHandle()      
      }
     
    },
    showConfirm(validateResult) {
      return new Promise(resolve => {
        if (validateResult) {
          resolve(true);
          return;
        }
        this.$confirm("是否提交到错题本？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            // this.rightHandle()
          });
      });
    },
    //验证答案
    validateInput(v1, v2) {
      // console.log("validateInput")
      // console.log(v1===v2)
      if (this.index < 0) {
        return;
      }
      return new Promise(resolve => {
        resolve(v1 === v2 || this.index < 0);
      });
    },
    //题目正确切换
    rightHandle() {
      return new Promise(resolve => {
        //获取题目总数
        this.index = Math.min(++this.index, this.total);
        this.right = Math.min(this.total - this.wrong, ++this.right);
        this.userInputAnswer = "";
        // this.logHandle()
        resolve();
      });
    },
    //题目错误切换
    wrongHandle() {
      return new Promise(resolve => {
        //获取题目总数
        this.index = Math.min(++this.index, this.total);
        this.wrong = Math.min(this.total - this.right, ++this.wrong);
        this.userInputAnswer = "";
        // this.logHandle()
        resolve();
      });
    },
    diffValue(value, str) {
      if (!value || !str) return;
      this.error = value !== str.slice(0, value.length);
    },
    checkLast() {
      return new Promise(resolve => {
        resolve(this.index + 1 === this.list.length);
      });
    },
    queryList() {
      this.list = [];
      let params = { pageSize:200};
     
      if (this.type) {
        params["type"] = this.type;
      }
      var prms = new Promise((resolve, reject) => {
        this.$axios
          .get("/api/topic/list", { params })
          .then(rep => {
            if (rep.data.errno !== 0) return;
            this.pageCount = rep.data.data.count;
            this.list = rep.data.data["listData"];

            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
      return prms;
      //如果不是通过模糊查询方式，则清空
    },
    reset(){
        this.right=0;
        this.wrong=0;
        this.index=-1;
        this.error=false;
    },
    created(){
      this.queryList()
    }
  }
};
