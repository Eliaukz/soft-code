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
      userInfo:null,
    id: '',
    bookInfo: null,
    owner: null, // 保存书籍所有者的id
    title: '', // 保存书名
    files: [], //书的图片
    desc: '', // 保存描述
    price: 0, // 保存价格
    addressarr: ['沁苑','紫菘','韵苑'],
    address: 0, // 保存地址
    freq: 0, // 保存发布状态
    star: 0, // 保存星标特效标记
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
    this.getBookInfo();
  },
  /*
  getBookInfo() {
    // 调用云函数来查询书籍信息
    console.log("getBookInfo function :: ",this.data.id),
    wx.cloud.callFunction({
      name: 'getBookById',
      data: {
        bookId: this.data.id
      },
      complete: res => {
        console.log("OK");
        console.log("res.num :: ",res);
        
        /*
        this.setData({
          title:res.data
        });
        
      },
      fail: err => {
        console.error(err);
      },
    });
  },
  */
  getBookInfo() {
    wx.cloud.database().collection("todo").doc(this.data.id).get({
      success: (res) =>{
        console.log("OK!");
        console.log("title :",res.data.title);
        this.setData({
          title: res.data.title,
          bookInfo: res.data,
          ownerid: res.data.owner,
          files: res.data.files, //书的图片
          desc: res.data.desc, // 保存描述
          price: res.data.price, // 保存价格
          address: res.data.address, // 保存地址
          freq: res.data.freq, // 保存发布状态
          star: res.data.star, // 保存星标特效标记
        });
        console.log("this.title :",this.data.title);
      },
      fail: (err) => {
        console.log(err);
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
      console.log('书名:', this.data.title);
      console.log('描述:', this.data.desc);
      console.log('价格:', this.data.price);
      console.log('地址:', this.data.address);
      console.log('发布状态:', this.data.freq === 1 ? '已发布' : '未发布');
      console.log('星标特效标记:', this.data.star === 1 ? '是' : '否');
    }
  },

  acceptNewFriend( ) {
  console.log(this.data.ownerid);
    var that = this;
    db.collection("chat_record")
     // .doc(that.data.new_friends[index]._id)
     .doc(this.data.ownerid)
      .update({
        data: {
          friend_status: true,
        },
        success(res) {
          that.setData({
            //new_accepted_friend_id: that.data.new_friends[index].userA_id,
            new_accepted_friend_id:this.data.ownerid    ////
          });
        },
      });
      console.log("成为好友")
    // AB成为朋友

    db.collection("user")
      .where({
         _id: that.data.userInfo._id,
      })  //查询当前用户
      .get({
        success(res) {
          console.log(res.data);
          var my_friends = res.data[0].friends;
          my_friends.push(this.data.ownerid)
        //   my_friends.push(that.data.new_friends[index].userA_id);
          app.globalData.userInfo.friends = my_friends;
          db.collection("user")
            .where({
              _id: that.data.userInfo._id,
            })
            .update({
              data: {
                friends: my_friends,
              },
            });
        },
      });

    db.collection("user")
      .where({
       // _id: that.data.new_friends[index].userA_id,
        _id:this.data.ownerid
      })
      .get({
        success(res) {
          //console.log(res)
          var A_friends = res.data[0].friends;
          A_friends.push(that.data.userInfo._id);
          db.collection("user")
            .where({
            //   _id: that.data.new_friends[index].userA_id,
            _id:this.data.ownerid
            })
            .update({
              data: {
                friends: A_friends,
              },
            });
          that.onShow();
        },
      });
  },


  addFriend() {

    var that = this;

    db.collection("chat_record").add({
      data: {
        userA_id: that.data.userInfo._id,
        userA_account_id: that.data.userInfo.account_id,
        userA_avatarUrl: that.data.userInfo.avatarUrl,

        userB_id:this.data.ownerid._id,
        userB_account_id:this.data.ownerid.account_id,
        userB_avatarUrl : this.data.ownerid.avatarUrl,

        record: [],
        friend_status: true,
        time: utils.formatTime(new Date()),
      },
      success(res) {
        console.log(res);

      },
    });

    db.collection("user")
    .where({
       _id: that.data.userInfo._id,
    })  //查询当前用户
    .get({
      success(res) {
        console.log(res.data);
        var my_friends = res.data[0].friends;
        my_friends.push(this.data.ownerid)
      //   my_friends.push(that.data.new_friends[index].userA_id);
        app.globalData.userInfo.friends = my_friends;
        db.collection("user")
          .where({
            _id: that.data.userInfo._id,
          })
          .update({
            data: {
              friends: my_friends,
            },
          });
      },
    });

  db.collection("user")
    .where({
     // _id: that.data.new_friends[index].userA_id,
      _id:this.data.ownerid
    })
    .get({
      success(res) {
        //console.log(res)
        var A_friends = res.data[0].friends;
        A_friends.push(that.data.userInfo._id);
        db.collection("user")
          .where({
          //   _id: that.data.new_friends[index].userA_id,
          _id:this.data.ownerid
          })
          .update({
            data: {
              friends: A_friends,
            },
          });
        that.onShow();
      },
    });




  },




  
  onclickButton() {
    console.log("跳转到chat" ,this.data.ownerid);
    this.addFriend()
    console.log("加好友成功")
    wx.navigateTo({
      url: "/pages/chat/chat?id=" +this.data.ownerid,
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
  clickButton(e){

  },
});
