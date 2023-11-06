// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    book_name: null,

    hotBooksid: [],

    hotBookAddressArray:['沁苑','紫菘','韵苑'],
    
    randomIndex: [],
    title:[],
    address:[],
    price:[],
    id:[],
    picture:[],
    count:[],
    curidx:0,


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
      this.randomSelect().then(() => {
        console.log("all done!");
        console.log("title :",this.data.title);
        console.log("id :",this.data.id);
        console.log("address :",this.data.address);
        console.log("price :",this.data.price);
        console.log("picture :",this.data.picture);
        this.data.mytitle = this.data.title[0];
        console.log("mytitle :",this.data.price);
        console.log("curidx", this.data.curidx);
      });
    });
  },

  /*
   *  获得热门书籍信息
   */
  async getHotBookInfo() {
    return new Promise((resolve, reject) => {
      wx.cloud
        .database()
        .collection("book")
        .orderBy("count", "desc")
        .limit(100)
        .field({
          _id: true,
        })
        .get({
          success: (res) => {
            console.log("查询热门书籍成功!", res.data);
            console.log("长度", res.data.length);
            for (let i = 0; i < res.data.length; i++) {
              this.data.hotBooksid[i] = res.data[i]._id;
              console.log("当前值：", res.data[i]._id);
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

  getRandomNumber(min, max,pos) {
    let cur;
    for(let i=1;i>=1;i++){
      cur = Math.floor(Math.random() * (max - min + 1)) + min;
      let legal = 1;
      for(let j=0;j<pos;j++){
        if(cur == this.data.randomIndex[j]) legal = 0;
      }
      if(legal == 1) break;
    }
    this.data.randomIndex[pos] = cur;
    console.log("cur : ",cur);
    this.data.curidx = pos;
  },
  /*
   * 随机选取一个热门书籍
   */
  async randomSelect(){
    return new Promise((resolve,reject) => {
      console.log("热门书籍id数组 :",this.data.hotBooksid);
      for(let i=0;i<=2;i++){
        this.getRandomNumber(0,this.data.hotBooksid.length-1,i);
      }
      this.getSelectBook(0).then(() => {
        console.log("0 done!");
        this.getSelectBook(1).then(() => {
          console.log("1 done!");
          this.getSelectBook(2).then(() => {
            console.log("2 done!");
            console.log("title :",this.data.title);
            console.log("id :",this.data.id);
            console.log("address :",this.data.address);
            console.log("price :",this.data.price);
            console.log("picture :",this.data.picture);
            console.log("mytitle :",this.data.price);
            console.log("curidx", this.data.curidx);
            resolve();
          });
        });
      });
    });
  },

  /*
   * 获得选取的热门书籍的信息
   */
  async getSelectBook(i){
    return new Promise((resolve,reject) => {
        wx.cloud.database().collection("book").doc(this.data.hotBooksid[this.data.randomIndex[i]]).get({
          success: (res) => {
            const curTitle = this.data.title;
            curTitle[i] = res.data.title;
            const curAddress = this.data.address;
            curAddress[i] = this.data.hotBookAddressArray[res.data.address];
            const curPrice = this.data.price;
            curPrice[i] = res.data.price;
            const curPicture = this.data.picture;
            curPicture[i] = res.data.files[0].id;
            const curId = this.data.id;
            curId[i] = res.data.id;
            const curCount = this.data.count;
            curCount[i] = res.data.count;
            /* 必须使用setData方法赋值！！！！ */
            this.setData({
                title : curTitle,
                address : curAddress,
                price : curPrice,
                picture : curPicture,
                id : curId,
                curidx : i,
                count : curCount,
            });
            // this.data.title[i] = res.data.title;
            // this.data.address[i] = this.data.hotBookAddressArray[res.data.address];
            // this.data.price[i] = res.data.price;
            // this.data.picture[i] = res.data.files[0].id;
            // this.data.id[i] = res.data._id;
            // console.log("this.title :", this.data.title[i]);
            resolve();
          },
          fail: (err) => {
            console.log(err);
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

  onChange() {
    this.getHotBookInfo().then(() => {
      this.randomSelect();
    });
  },
});
