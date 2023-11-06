// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    book_name: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      book_name: null,
    });
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
    onHide() {
        this.setData({
            book_name: null,
          });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.setData({
      book_name: null,
    });
  },

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

  onSearchButtonClick(e) {
    //console.log(this.data.book_name);
    if (this.data.book_name != "") {
      wx.navigateTo({
        url: "/pages/search/search?name=" + this.data.book_name,
      });
    }
  },
  onInput(e) {
    this.setData({
      book_name: e.detail.value,
    });
  },
});
