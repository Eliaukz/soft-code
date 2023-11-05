// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  /*try {
    const bookId = event.bookId; // 获取传入的书的ID
    const result = await db.collection('todo').doc(bookId).get();
    return {title:result.data.title}; // 返回查询结果
  } catch (error) {
    console.error(error);
    return error;
  }*/
  /*
  try {
    return await db.collection('todo').doc(event.bookId).get({
      success: function(res){
        return 1
      }
    });
  } catch(err){
    console.error(err);
  }*/
  /*
  try {
    const result = await db.collection('todo').doc(event.bookId).get();
    //return result.data; // 返回查询到的数据
    return {num:"1"};
  } catch(err){
    console.error(err);
    return err; // 返回错误信息
  }*/
  return {num:"1"};
  return new Promise((resolve, reject) => {
    db.collection('todo')
      .doc(event.bookId)
      .get()
      .then(result => {
        resolve({ num: "1" });
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });

}