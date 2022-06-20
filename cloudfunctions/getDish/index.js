// 云函数入口文件
const cloud = require('wx-server-sdk')
// 云环境id
const envCloud = 'yzy-eat02-8g2to6g10601a6ef'; 
cloud.init({env: envCloud})
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取集合条数
  let total = await db.collection('dish').where({_st:0, uid: '6888ad7w0-c33a-11ec-a48b-b173ad94c5a9'}).count();
  total = total.total;
  // 记录读取的数据
  let result = [];
  for(let i = 0; i < total; i += 100) {
    let list = await db.collection('dish').skip(i).where({_st:0, uid: '6888ad7w0-c33a-11ec-a48b-b173ad94c5a9'}).get();
    result = result.concat(list.data);
  }
  // 将数据抛出
  return result;
}