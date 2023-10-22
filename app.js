// app.js
App({
  onLaunch() {
    
    wx.cloud.init({
      env:"cloud1-6gqy49slbaaeca02"
    })
    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo = wx.getStorageSync('userInfo')
      console.log('get storage')
    }
  },
  globalData: {
    userInfo: null
  }
})
