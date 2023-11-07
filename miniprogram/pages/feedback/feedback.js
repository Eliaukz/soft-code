// pages/feedback/feedback.js
/* 新增待办页面 */
const app = getApp();
var count = 0;
const db = wx.cloud.database();
Page({
  // 保存编辑中待办的
  data: {
    owner: null,
    name:"",
    phonenumber:"",
    suggestion:"",
    stars:4
  },

  onLoad() {
    this.setData({
      owner: app.globalData.userInfo,
    });
  },
  // 表单输入处理函数
  onNameInput(e) { //输入名字
    this.setData({
      name: e.detail.value,
    });
  },
  onPhoneNumberInput(e) { //输入电话号码
    this.setData({
      phonenumber: e.detail.value,
    });
  },
  onSuggestionInput(e) { //输入建议
    this.setData({
      suggestion: e.detail.value,
    });
    console.log("1");
  },
  //提交
  onChange(e) {
    const {num}=praseInt(e.detail.num);
    this.setData({
      stars: num,
    }, () => {
      console.log(this.data.stars);
    });
  },

  async tap() {
  console.log("submit");
  // 对输入框内容进行校验
  if (this.data.name === "") {
    this.setData({
      name: "匿名",
    });
  }
  if (this.data.suggestion=== "") {
    wx.showToast({
      title: "请填写建议",
      icon: "error",
      duration: 2000,
    });
    return;
  }
  if(this.data.phonenumber!==""){// 可以为空，但不能不合法
    if (this.data.phonenumber.length !== 11 ||
      !/^[1][3-9]\d{9}$/.test(this.data.phonenumber )) {// 判断手机号是否合法
      wx.showToast({
        title: "电话号码不合法",
        icon: "error",
        duration: 2000,
      });
      return;
    }
  }
  
  const db = await getApp().database();
  // 在数据库中新建待办事项，并填入已编辑对信息
  console.log(this.data.owner);
  db.collection(getApp().globalData.collection1)
    .add({
      data: {
        name: this.data.name, // 人名
        stars: this.data.stars, // 星星数
        phonenumber: this.data.phonenumber, // 电话号码
        suggestion: this.data.suggestion, //建议
        owner: this.data.owner,
      },
    })
    .then(() => {
      console.log("back");
      wx.redirectTo({
        url: '../../pages/list/index',
      })
    });
},
  

  
  
});

