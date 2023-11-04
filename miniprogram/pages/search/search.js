// pages/search/search.js
// pages/search/search.js

const app = getApp();

const utils = require("../../utils/util");
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
  },

  search(info) {
    let that = this;
    let _=db.command;
    console.log("search", info);
    db.collection("todo")
      .where(_.and([
        {
            title: db.RegExp({
              regexp: info, //info坐为关键字进行匹配
              options: 'i', //不区分大小写
            })
          },{  freq:1,}

      ]) )
      .get({
        success: (res) => {
          console.log("res", res);
          that.setData({
            booklist: res.data,
          });
          console.log(this.data.booklist);
        },
        fail: (err) => {
          console.log("查询失败",err);
        },
      });

   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options",options.name);
    this.search(options.name);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  onBookNameTap() {
    console.log("skadl...");
  },
});
