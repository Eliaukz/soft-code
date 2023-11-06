// pages/book/book.js

const app = getApp();

const utils = require("../../utils/util");

const db = wx.cloud.database();
const _ = db.command;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    id: "",
    bookInfo: null,
    owner: null, // 保存书籍所有者的id
    title: "", // 保存书名
    files: [], //书的图片云存储，每个元素包含三个属性,id name size(弃用)
    desc: "", // 保存描述
    price: 0, // 保存价格
    addressarr: ["沁苑", "紫菘", "韵苑"],
    count:0, //书本被点击次数
    address: 0, // 保存地址
    freq: 0, // 保存发布状态
    star: 0, // 保存星标特效标记
    recordid: "", //记录对话id

    imagesUrl: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    this.setData({
      id: options.id,
    });
    // this.getBookInfo();
    // this.getPicture();
    this.getBookInfo().then(() => {
      this.getPicture();
      this.updateCount(); //更新书本点击次数+1
    });
  },

  // getBookInfo() {
  //   /*
  //    * 从数据库获取书籍的信息
  //    */
  //   wx.cloud.database().collection("book").doc(this.data.id).get({
  //     success: (res) =>{
  //       console.log("OK!");
  //       console.log("data :",res.data);
  //       console.log("title :",res.data.title);
  //       this.setData({
  //         title: res.data.title,
  //         bookInfo: res.data,
  //         owner: res.data.owner,
  //         files: res.data.files, //书的图片
  //         desc: res.data.desc, // 保存描述
  //         price: res.data.price, // 保存价格
  //         address: res.data.address, // 保存地址
  //         freq: res.data.freq, // 保存发布状态
  //         star: res.data.star, // 保存星标特效标记
  //       });
  //       console.log("this.title :",this.data.title);
  //     },
  //     fail: (err) => {
  //       console.log(err);
  //     },

  //   });
  // },

  async getBookInfo() {
    return new Promise((resolve, reject) => {
      wx.cloud
        .database()
        .collection("book")
        .doc(this.data.id)
        .get({
          success: (res) => {
            console.log("OK!");
            console.log("data :", res.data);
            console.log("title :", res.data.title);
            this.setData({
              title: res.data.title,
              bookInfo: res.data,
              owner: res.data.owner,
              files: res.data.files,
              count: res.data.count,
              desc: res.data.desc,
              price: res.data.price,
              address: res.data.address,
              freq: res.data.freq,
              star: res.data.star,
            });
            console.log("this.title :", this.data.title);
            resolve(); // 表示异步操作成功
          },
          fail: (err) => {
            console.log(err);
            reject(err); // 表示异步操作失败
          },
        });
    });
  },

  /*
   * 从云存储中获取书籍的图片
   */
  async getPicture() {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.data.files.length; i++) {
        console.log("now getPicture");
        const cloudId = this.data.files[i].id;
        console.log("cloudId : ", cloudId);

        wx.cloud.getTempFileURL({
          fileList: [cloudId], // 传入文件 ID 的数组
          success: (res) => {
            // 获取临时链接成功，res.fileList 是一个包含临时链接的数组
            const tempFileURL = res.fileList[0].tempFileURL;
            // 在页面中显示图片
            const curImagesUrl = this.data.imagesUrl; // 获取当前图片数组的引用
            curImagesUrl[i] = tempFileURL;
            this.setData({
              imagesUrl: curImagesUrl,
            });

            console.log("imagesUrl :", this.data.imagesUrl);
          },
          fail: (err) => {
            // 获取临时链接失败
            console.error("获取临时链接失败", err);
            reject(err);
          },
        });
      }
      resolve();
    });
  },

  /*
   * 书本点击次数+1
   */
  updateCount(){
    wx.cloud.database().collection('book').doc(this.data.id).update({
      data: {
        // 更新的字段
        count: this.data.count + 1,
        // 可以添加多个字段的更新
      },
      success: (res) => {
        console.log('更新成功', res);
        console.log("count",res.data.count)
      },
      fail: (err) => {
        console.error('更新失败', err);
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 在页面初次渲染完成时，可以根据获取的书籍信息渲染页面
    if (this.data.bookInfo) {
      // 可以使用this.data中的变量来渲染页面
      console.log("书名:", this.data.title);
      console.log("描述:", this.data.desc);
      console.log("价格:", this.data.price);
      console.log("地址:", this.data.address);
      console.log("发布状态:", this.data.freq === 1 ? "已发布" : "未发布");
      console.log("星标特效标记:", this.data.star === 1 ? "是" : "否");
    }
  },

  addFriend() {
    if (this.data.userInfo._id == this.data.owner._id) {
      wx.showToast({
        title: "卖家是您！",
      });
      return;
    }

    db.collection("chat_record")
      .where(
        db.command.and(
          {
            userA_id: this.data.userInfo._id,
          },
          {
            userB_id: this.data.owner._id,
          }
        )
      )
      .get({
        success: (res) => {
          console.log(res, res.data);
          wx.navigateTo({
            url: "/pages/chat/chat?id=" + res.data[0]._id,
          });
        },
        fail: (err) => {
          console.log(err);
          this.f();
        },
      });
  },

  f() {
    var that = this;
    db.collection("chat_record").add({
      data: {
        userA_id: this.data.userInfo._id,
        userA_account_id: this.data.userInfo.account_id,
        userA_avatarUrl: this.data.userInfo.avatarUrl,

        userB_id: this.data.owner._id,
        userB_account_id: this.data.owner.account_id,
        userB_avatarUrl: this.data.owner.avatarUrl,

        record: [],
        friend_status: true,
        time: utils.formatTime(new Date()),
      },
      success: function (res) {
        that.setData({
          recordid: res._id,
        });
        console.log("插入成功", res._id);
        wx.navigateTo({
          url: "/pages/chat/chat?id=" + that.data.recordid,
        });
      },
      fail: function (err) {
        console.error("插入失败", err);
      },
    });
  },

  onclickButton() {
    this.addFriend();
  },

  /*
   * 图片点击放大查看
   */
  previewImage: function (e) {
    const current = e.currentTarget.dataset.src;
    const urls = this.data.imagesUrl;

    wx.previewImage({
      current: current, // 当前显示图片的链接
      urls: urls, // 需要预览的图片链接列表
    });
  },
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

  /*
   * 用户点击按钮触发事件
   */
  clickButton(e) {},
});
