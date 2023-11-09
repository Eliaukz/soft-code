/* 新增待办页面 */
const app = getApp();
var count = 0;
const db = wx.cloud.database();
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
    count: 0,
  },

  onLoad() {
    this.setData({
      owner: app.globalData.userInfo,
    });
    console.log(this.data.owner);
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
  addFile() {
    // 限制附件个数
    if (this.data.files.length + 1 > getApp().globalData.fileLimit) {
      wx.showToast({
        title: "数量达到上限",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    let a = this;
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍照"],
      itemColor: "#f7982a",
      success: function (e) {
        //album:相册   //camera拍照
        e.cancel ||
          (0 == e.tapIndex
            ? a.chooseWxImageShop("album")
            : 1 == e.tapIndex && a.chooseWxImageShop("camera"));
      },
    });


  },
  //a：选择的类型  //album:相册   //camera拍照
  chooseWxImageShop: function (a) {
    var e = this;
    wx.chooseMedia({
      mediaType: ["image"],
      sizeType: ["original", "compressed"],
      sourceType: [a], //类型
      count: 1,
      success: function (a) {
        if (a.tempFiles[0].size > 2097152) {
          wx.showModal({
            title: "提示",
            content: "选择的图片过大，请上传不超过2M的图片",
            showCancel: !1,
            success: function (a) {
              a.confirm;
            },
          });
        } else {
          //把图片上传到服务器
          e.upload_file(a.tempFiles[0].tempFilePath);
        }
      },
    });
  },
  upload_file: function (e) {
    console.log(e);
    var that = this;
    wx.showLoading({
      title: "上传中",
    });
    wx.cloud
      .uploadFile({
        filePath: e, //图片路径
        cloudPath: app.globalData.userInfo.account_id + Date.now() + ".png",
      })
      .then((res) => {
        this.data.files.push({
          id: res.fileID,
          name: Date.now().toString(),
        });
        this.setData({
          files: this.data.files,
        });
        count += 1;
        console.log(res.fileID);
        wx.hideLoading();
        wx.showToast({
          title: "上传成功",
          icon: "success",
          duration: 1000,
        });
      })
      .catch((error) => {
        console.log(error);
        wx.hideLoading();
        wx.showToast({
          title: "上传失败",
          icon: "none",
          duration: 3000,
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
      address: e.detail.value,
    });
  },

  // 保存待办
  async savebook() {
    // 对输入框内容进行校验
    console.log("savebook");
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
          count: 0,
          owner: this.data.owner,
        },
      })
      .then(() => {
        wx.navigateBack({
          delta: 0,
        });
      });
  },

  // 重置所有表单项
  resetbook() {
    this.setData({
      title: "",
      desc: "",
      price: 0,
      files: [],
      fileName: "",
      addressOptions: ["沁苑", "紫菘", "韵苑"],
      address: 0,
      count: 0,
      freq: 0,
    });
  },
});
