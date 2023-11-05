/* 文件列表页面 */
const app = getApp();
Page({
  // 存储显示的待办事项 _id 及其附件列表
  data: {
    _id: '',
    files: []
  },
  
  async onLoad(options) {
    // 根据上一页传来的 _id 参数，刷新文件列表
    if (options.id !== undefined) {
      this.setData({
        _id: options.id
      })
      const db = await getApp().database()
      // 根据 _id，查询待办事项
      db.collection(getApp().globalData.collection).where({
        _id: this.data._id
      }).get().then(res => {
        // 解包获得返回列表（应只匹配一项）中的 todo 对象
        const {
          data: [todo]
        } = res
        if (todo !== undefined) {
          // 存储查询得到 todo 对象中的文件列表
          this.setData({
            files: todo.files
          })
        }
      })
    }
  },

  // 调用小程序 Api，预览图片
  async previewFile(e){
    console.log("预览图片")
    var self = this
    const index = e.currentTarget.dataset.index
    console.log(index)
    const db = await getApp().database()
    const ImageUrl = this.data.files[index].id
    wx.previewImage({
      urls: [ImageUrl],
    });
  },
  // 删除文件
  async deleteFile(e) {
    // 根据触发删除事件的文件序号，获取文件 id
    const index = e.currentTarget.dataset.index
    const db = await getApp().database()
    // 快速刷新本地数据，更新显示
    this.data.files.splice(index, 1)
    this.setData({
      files: this.data.files
    })
    // 根据 id 从数据库中删除对应文件记录
    db.collection(getApp().globalData.collection).where({
      _id: this.data._id
    }).update({
      data: {
        files: this.data.files
      }
    })
  }
})