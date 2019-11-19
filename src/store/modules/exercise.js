export default {
    namespaced: true,
    state: {
        userInputAnswer: "",
        errorState: false,

        //秒表
        ticBegin: "",
        ticDuration: "",
        ticTimer: "",
        //原始题目列表
        list: [],
        //选择题目列表
        selectList: [],
        questionIndex: -1,
        //答题统计
        right: 0,
        wrong: 0,

        showQuestionSelector: false,
        fuzzyInput: "",
        fuzzyKey: "",
        pageCount: "",
        pageNo: 1,

        showGuide: false,
        guideData: [
            {
                el: ".topicQuestion",
                message: "答题卡区域，这里会显示题目"
            },
            {
                el: ".topicUserInput",
                message: "答题卡区域，在这里输入答案，回车键可以快速提交"
            }, {
                el: ".topicOperate",
                message: "这里收藏或者屏蔽当前题目"
            }, {
                el: ".startBtn",
                message: "在没有开始之前，这里是开始按钮，点击开始答题。"
            }
        ],
        showAnswer:"false"
    },
    getters: {},
    mutations: {
        "setAnswerVisible": function (state, payload) {
            state.showAnswer = payload
        }
    }
}