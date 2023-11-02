// app.js
App({
  onLaunch() {
    
    wx.cloud.init({
      env:"cloud1-1gm82cvd1dfb220a"
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
