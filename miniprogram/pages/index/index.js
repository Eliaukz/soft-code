// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    book_name: null,

    hotBooksid: [],
    hotBookTitle: null,
    hotBookAddressArray:['沁苑','紫菘','韵苑'],
    hotBookAddress: null,
    hotBookPrice:0,
    hotBook_id:0,
    hotBookPicture:null,
    randomIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   book_name: null,
    // });

    //获得热门书籍信息
    this.getHotBookInfo().then(() => {
      this.randomSelect();
    });
  },

  /*
   *  获得热门书籍信息
   */ 
  async getHotBookInfo(){
    return new Promise((resolve,reject) => {
      wx.cloud.database().collection("book").orderBy("count","desc").limit(100).field({
        _id:true,
      }).get({
        success: (res) => {
          console.log("查询热门书籍成功!",res.data);
          console.log("长度",res.data.length);
          for(let i = 0;i < res.data.length;i++){
            this.data.hotBooksid[i] = res.data[i]._id;
            console.log("当前值：",res.data[i]._id);
          }
          console.log("成功返回!");
          resolve();
        },
        fail: (err) => {
          console.log(err);
          reject(err);
        },
      });
    });
  },

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  /*
   * 随机选取一个热门书籍
   */
  randomSelect(){
    console.log("热门书籍id数组 :",this.data.hotBooksid);
    this.data.randomIndex = this.getRandomNumber(0,this.data.hotBooksid.length);
    console.log("randomIndex :", this.data.randomIndex);

    this.getSelectBook().then(() => {
    });
  },

  /*
   * 获得选取的热门书籍的信息
   */
  async getSelectBook(){
    return new Promise((resolve,reject) => {
      wx.cloud.database().collection("book").doc(this.data.hotBooksid[this.data.randomIndex]).get({
        success: (res) => {
          this.setData({
            hotBookTitle: res.data.title,
            hotBookAddress: this.data.hotBookAddressArray[res.data.address],
            hotBookPrice: res.data.price,
            hotBookPicture: res.data.files[0].id,
            hotBook_id: res.data._id,
          });
          console.log("this.title :", this.data.hotBookTitle);
          resolve(); // 表示异步操作成功
        },
        fail: (err) => {
          console.log(err);
          reject(err); // 表示异步操作失败
        },
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.getHotBookInfo().then(() => {
    //   this.randomSelect();
    // });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
    onHide() {
        // this.setData({
        //     book_name: null,
        //   });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // this.setData({
    //   book_name: null,
    // });
  },

  ondetail(e) {
    console.log("tobook", e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/book/book?id=" + e.currentTarget.dataset.id,
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

  ondetail(e) {
    console.log("tobook", e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/book/book?id=" + e.currentTarget.dataset.id,
    });
  },

  onChange(){
    this.getHotBookInfo().then(() => {
      this.randomSelect();
    });
  },
});
