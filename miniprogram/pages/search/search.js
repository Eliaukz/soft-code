// pages/search/search.js
// pages/search/search.js

const app = getApp();

const utils = require("../../utils/util");
const db = wx.cloud.database();
let pages = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    booklist: ["null"],
    searchinfo: null,
    address0: [], // 沁苑
    address1: [], // 紫菘
    address2: [], // 韵苑
    addressOptions: ['沁苑','紫菘', '韵苑','全部'],
    address: 3
  },

  search(info) {
    let that = this;
    let _ = db.command;
    db.collection("book")
      .where(
        _.and([
          {
            title: db.RegExp({
              regexp: info, //info坐为关键字进行匹配
              options: "i", //不区分大小写
            }),
          },
          { freq: 1 },
        ])
      )
      .get({
        success: (res) => {
          console.log("res", res);
          that.setData({
            booklist: res.data,
            address0: res.data.filter((booklist) => booklist.address === 0),
            address1: res.data.filter((booklist) => booklist.address === 1),
            address2: res.data.filter((booklist) => booklist.address === 2),
          });
          console.log(this.data.booklist);
          console.log(this.data.address0);
          console.log(this.data.address1);
          console.log(this.data.address2);
        },
        fail: (err) => {
          console.log("查询失败", err);
        },
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.pages = 0;
    this.setData({
      searchinfo: options.name,
    });
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
  onPullDownRefresh() {
    console.log("下拉刷新");
    this.onRefresh();
    this.search(this.searchinfo);
  },
  //下拉刷新动画
  onRefresh: function () {
    //导航条加载动画
    wx.showNavigationBarLoading();
    //loading 提示框
    wx.showLoading({
      title: "Loading...",
    });
    console.log("下拉刷新啦");
    setTimeout(function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // pages++;
    // console.log(this.data.searchinfo);
    // this.search(this.data.searchinfo);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  onBookNameTap() {
    console.log("skadl...");
  },
  ondetail(e) {
    console.log("tobook", e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/book/book?id=" + e.currentTarget.dataset.id,
    });
  },
  onChooseAddress(e){
    this.setData({
      address: e.detail.value
    })
    console.log(this.data.address)

  }
});
