let app = getApp();
var count = 0;
const db = wx.cloud.database();
Page({
  data: {
    userInfo: null,
    avatarUrl: null,
    currentView: null,
    userpublish: [],
    userclooection: [],
    history: [],
    nickName: "加载中...",
  },
  //页面加载时调用该函数
  setdata() {
    /*
        //加载我的发布，收藏栏，浏览记录的函数
        db.collection("user")
          .limit(10)
          .get()
          .then((res) => {
            this.setData({
              userpublish: res.data.userpublish,
              userclooection: res.data.userclooection,
              history: res.data.history,
            });
          })
          .catch((err) => {
            console.log(err);
          });
          */
  },
  onLancn() {
    this.setdata();
  },

  onShow() {
    console.log("page load!!!!");
    //app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo,
      avatarUrl: app.globalData.userInfo.avatarUrl,
    });
    this.updateNickName();
  },

  updateNickName(){
    wx.cloud.database().collection("user").doc(app.globalData.userInfo._id).get({
      success: (res) => {
        this.setData({
          nickName: res.data.nickName,
        });
        console.log("res.data.nickName :" , res.data.nickName);
        console.log("this.data.nickName :", this.data.nickName);
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },

  onLoad() {},

  changeNickName(){
    wx.navigateTo({
      url: '/pages/change/change', // 跳转到更改昵称页面
    });
  },

  changeUser() {
    app.globalData.userInfo = null;
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },
  // 跳转到库存 要使用switchTab
  jump2Warehouse() {
    wx.switchTab({
      url: '/pages/list/index', // 仓库页面的路径
    });
  },
  jump2feedback() {
    wx.navigateTo({
      url: '../../pages/feedback/feedback',
    })
  },
  changeUserAvatar() {
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
    wx.cloud.uploadFile({
      filePath: e, //图片路径
      cloudPath: app.globalData.userInfo.account_id + count + ".png",
      success: (res) => {
        count += 1;
        console.log(res.fileID);
        that.updateAvatar(res.fileID);
        wx.hideLoading();
        wx.showToast({
          title: "上传成功",
          icon: "success",
          duration: 1000,
        });
      },
      fail: (err) => {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: "上传失败",
          icon: "none",
          duration: 3000,
        });
      },
    });
  },

  updateAvatar(url) {
    var that = this;
    console.log(url);

    // 更新聊天记录数据库中头像信息
    db.collection("chat_record")
      .where({
        userA_avatarUrl: app.globalData.userInfo.avatarUrl,
        userA_account_id: app.globalData.userInfo.account_id,
      })
      .update({
        data: {
          userA_avatarUrl: url,
        },
      });

    db.collection("chat_record")
      .where({
        userB_avatarUrl: app.globalData.userInfo.avatarUrl,
        userB_account_id: app.globalData.userInfo.account_id,
      })
      .update({
        data: {
          userB_avatarUrl: url,
        },
      });

    console.log(app.globalData.userInfo.avatarUrl);

    // 更新数据集中用户的头像信息
    db.collection("user")
      .doc(app.globalData.userInfo._id)
      .update({
        data: {
          avatarUrl: url,
        },
        success(res) {
          console.log(res);
          wx.showToast({
            title: "头像更新成功",
          });
          that.setData({
            avatarUrl: url,
          });
          app.globalData.userInfo.avatarUrl = url;
          wx.setStorageSync("userInfo", app.globalData.userInfo);
        },
      });

    this.onShow();
  },

  showContent: function (event) {
    const viewId = event.currentTarget.dataset.id;
    this.setData({
      currentView: viewId,
    });
  },

  getHistory(){

  },
});
