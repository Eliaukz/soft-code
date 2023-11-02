// pages/search/search.js

const app = getApp();

const utils = require("../../utils/util");
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    booklist: [
      {
        name: "英语",
        info: "描述信息",
        src: "/images/index/book1.jpg",
      },
      {
        name: "英语",
        info: "描述信息",
        src: "/images/index/book1.jpg",
      },
      {
        name: "英语",
        info: "描述信息",
        src: "/images/index/book1.jpg",
      },
    ],
  },

  search(info) {
    db.collection("book")
      .where({
        description: db.RegExp({
          regexp: info, //miniprogram做为关键字进行匹配
          options: "i", //不区分大小写
        }),
      })
      .get()
      .try((res) => {
        this.setData({
          booklist: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
