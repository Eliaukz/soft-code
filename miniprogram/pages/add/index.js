/* 新增待办页面 */
const app = getApp();
Page({
  // 保存编辑中待办的
  data: {
    owner: null,
    title: "",
    desc: "",
    price: 0,
    files: [],
    fileName: "",
    freq: 0,
    addressOptions: ["沁苑", "紫菘", "韵苑"],
    address: 0,
  },

  onLoad() {
    this.setData({
      owner: app.globalData.userInfo,
    });
  },
  // 表单输入处理函数
  onTitleInput(e) {
    this.setData({
      title: e.detail.value,
    });
  },

  onDescInput(e) {
    this.setData({
      desc: e.detail.value,
    });
  },

  // 上传新附件
  async addFile() {
    // 限制附件个数
    if (this.data.files.length + 1 > getApp().globalData.fileLimit) {
      wx.showToast({
        title: "数量达到上限",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    // 从会话选择文件
    wx.chooseMessageFile({
      count: 1,
    }).then((res) => {
      const file = res.tempFiles[0];
      // 上传文件至云存储
      getApp()
        .uploadFile(file.name, file.path)
        .then((res) => {
          // 追加文件记录，保存其文件名、大小和文件 id
          this.data.files.push({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2),
            id: res.fileID,
          });
          // 更新文件显示
          this.setData({
            files: this.data.files,
            fileName: this.data.fileName + file.name + " ",
          });
        });
    });
  },
  onPriceInput(e) {
    this.setData({
      price: e.detail.value,
    });
  },
  // 响应事件状态选择器
  onChooseAddress(e) {
    this.setData({
      freq: e.detail.value,
    });
  },

  // 保存待办
  async saveTodo() {
    // 对输入框内容进行校验
    if (this.data.title === "") {
      wx.showToast({
        title: "事项标题未填写",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    if (this.data.title.length > 10) {
      wx.showToast({
        title: "事项标题过长",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: "事项描述过长",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    const db = await getApp().database();
    // 在数据库中新建待办事项，并填入已编辑对信息
    console.log(this.data.owner);
    db.collection(getApp().globalData.collection)
      .add({
        data: {
          price: Number(this.data.price), // 用户信息
          title: this.data.title, // 书名
          desc: this.data.desc, // 描述
          files: this.data.files, // 附件列表
          address: Number(this.data.address), // 地址
          freq: 0, // 是否上架
          star: false,
          owner: this.data.owner._id,
        },
      })
      .then(() => {
        wx.navigateBack({
          delta: 0,
        });
      });
  },

  // 重置所有表单项
  resetTodo() {
    this.setData({
      title: "",
      desc: "",
      price: 0,
      files: [],
      fileName: "",
      addressOptions: ["沁苑", "紫菘", "韵苑"],
      address: 0,
      freq: 0,
    });
  },
});
