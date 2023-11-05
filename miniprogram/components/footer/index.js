/* 应用下方新增按钮栏组件 */
const app = getApp();
var count = 0;
const db = wx.cloud.database();
Component({
  // footer 组件有两种功能：打开新建待办页面、为待办添加新附件
  properties: {
    addFile: Boolean,
    // 如用于添加新附件，需传入待办记录 _id 值
    _id: String
  },
  data: {
    files: []
  },
  methods: {
    onClick() {
      if (this.properties.addFile) {
        this.addFile()
      } else {
        wx.navigateTo({
          url: '../../pages/add/index',
        })
      }
    },
  
    // 新增附件
    async addFile() {
      const db = await getApp().database()
      // 获取当前待办信息
      db.collection(getApp().globalData.collection).where({
        _id: this.properties._id
      }).get().then(res => {
        const {
          data: [todo]
        } = res
        // 限制上传文件个数
        console.log(todo.files)
        if (todo.files.length + 1 > getApp().globalData.fileLimit) {
          wx.showToast({
            title: '数量达到上限',
            icon: 'error',
            duration: 2000
          })
          return
        }
        try {
          // 从会话选择文件
          let a = this;
          wx.showActionSheet({
            itemList: ["从相册中选择", "拍照"],
            itemColor: "#f7982a",
            success: function (e) {
              //album:相册   //camera拍照
              e.cancel ||
                (0 == e.tapIndex
                  ? a.chooseWxImageShop("album")
                  : 1 == e.tapIndex && a.chooseWxImageShop("camera"));
            },
          });
          console.log("弹出chooseMedia")
        } catch {
          console.error('【选取文件失败】', e.toString())
        }
      })
    },
  
    chooseWxImageShop: function (a) {
      var e = this;
      wx.chooseMedia({
        mediaType: ["image"],
        sizeType: ["original", "compressed"],
        sourceType: [a], //类型
        count: 1,
        success: function (a) {
          if (a.tempFiles[0].size > 2097152) {
            wx.showModal({
              title: "提示",
              content: "选择的图片过大，请上传不超过2M的图片",
              showCancel: !1,
              success: function (a) {
                a.confirm;
              },
            });
          } else {
            //把图片上传到服务器
            e.upload_file(a.tempFiles[0].tempFilePath);
          }
        },
      });
    },
  
    upload_file: function (e) {
      console.log(e);
      var that = this;
      wx.showLoading({
        title: "上传中",
      });
      wx.cloud.uploadFile({
        filePath: e, //图片路径
        cloudPath: app.globalData.userInfo.account_id + Date.now() + ".png",
      }).then(res=>{
          this.data.files.push({
            id: res.fileID,
            name:res.filePath,
            size: (res.size / 1024 / 1024).toFixed(2)
          })
          this.setData({
            files: this.data.files,
            fileName: this.data.fileName+' '
          })
          count += 1;
          console.log(res.fileID);
          wx.hideLoading();
          wx.showToast({
            title: "上传成功",
            icon: "success",
            duration: 1000,
          });
        }).catch(error=>{
          console.log(error)
          wx.hideLoading();
          wx.showToast({
            title: "上传失败",
            icon: "none",
            duration: 3000,
          });
        },
      );
    }
  }
})
