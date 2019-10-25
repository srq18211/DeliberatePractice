import Mock from "mockjs";
Mock.setup({
  timeout:800
})
Mock.mock(/getTopicList/, {
  recode: 1,
  list: [
    { text: "HTML", id: "1", total: 999, completed: 10 },
    { text: "CSS", id: "2", total: 999, completed: 20 },
    { text: "JavaScript", id: "3", total: 999, completed: 40 },
    { text: "WebAPI", id: "4", total: 999, completed: 40 },
    { text: "ES6", id: "5", total: 999, completed: 60 },
    { text: "VUE", id: "5", total: 999, completed: 60 }
    // { text: "REACT", id: "5", total: 999, completed: 60 },
    // { text: "Lodash", id: "5", total: 999, completed: 60 },
    // { text: "Electron", id: "5", total: 999, completed: 60 },
    // { text: "Flv", id: "5", total: 999, completed: 60 },
    // { text: "Nodejs", id: "5", total: 999, completed: 60 },
    // { text: "Linux", id: "5", total: 999, completed: 60 },
    // { text: "Nginx", id: "5", total: 999, completed: 60 },
  ]
});
Mock.mock(/getList/, {
  recode: 1,
  "list|100": [
    {
      name: "@name",
      age: /[1-2][8-9]/
    }
  ]
});
Mock.mock(/beginPrectice/,{
  recode:1,
  message:"ok",
  "data":{
    id:"@guid"
  }
});
Mock.mock(/queryExercises/,{
  recode:1,
  message:"ok",
  "data":{
    "list|10":[
      {
        topic:"1+1",
        answer:"2"
      },
    ]
  }
})
