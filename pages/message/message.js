const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    my_friends: [],
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },
  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo,
      my_friends: [],
    });
    this.loadUser();
    this.getMyfriend();
  },

  loadUser() {
    var that = this;
    db.collection("user")
      .where({
        account_id: that.data.userInfo.account_id,
        password: that.data.userInfo.password,
      })
      .get({
        success(res) {
          console.log(res);
          // 更新数据 拿到 _id
          app.globalData.userInfo = res.data[0];
          that.setData({
            userInfo: app.globalData.userInfo,
          });
        },
      });
  },

  getMyfriend() {
    // 获取所有成功添加好友的朋友
    var that = this;
    const DB = wx.cloud.database().command;
    db.collection("chat_record")
      .where(
        DB.or([
          {
            userA_id: app.globalData.userInfo._id,
            friend_status: true,
          },
          {
            userB_id: app.globalData.userInfo._id,
            friend_status: true,
          },
        ])
      )
      .watch({
        onChange: function (snapshot) {
          that.setData({
            my_friends: snapshot.docs,
          });
        },
        onError: function (err) {
          console.log(err);
        },
      });
  },

  startChat(e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "/pages/chat/chat?id=" + this.data.my_friends[index]._id,
    });
  },
});
