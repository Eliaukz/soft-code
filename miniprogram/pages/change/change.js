// pages/change/change.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newNickName: null,
  },

  /*
   * 更改用户新昵称
   */
  handleSubmit(e){
    if(e.detail.value.nickname.length>=15){// 可以为空，但不能不合法
      console.log()
      wx.showToast({
        title: "请输入15字以下名称！",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    this.setData({
      newNickName : e.detail.value.nickname,
    });
    
    console.log("newNickName : " ,this.data.newNickName);
    this.updateUser().then(() => {
      console.log("update done!");
      this.getBack();
    });
  },

  getBack(){
    console.log("prepare to get back!");
    wx.reLaunch({
      url: "/pages/user/user", // 跳转回去
      success: function(e) {
        var page = getCurrentPages()[0];
        if (page == undefined || page == null) return;
        console.log("now page:",page);    
        page.onShow();
      }
    });
  },

  /*
   * 更新用户数据库
   */

  async updateUser(){
    return new Promise((resolve, reject) => {

      console.log("NickName : " ,this.data.newNickName);


      wx.cloud.database().collection("user").doc(app.globalData.userInfo._id).update({
        data: {
          nickName: this.data.newNickName,
        },
        success: (res) => {
          console.log("更新成功", res);
          resolve();
        },
        fail: (err) => {
          console.error("更新失败", err);
          reject(err);
        },
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})