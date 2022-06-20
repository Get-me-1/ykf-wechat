// pages/table/table.js
const db = wx.cloud.database({env: 'yzy-eat02-8g2to6g10601a6ef'});
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: {},
    // hasUserInfo: false,
    // canIUseGetUserProfile: false,
    // allBill: [],
    // time: moment().subtract(10, 'minutes').valueOf()
  },

   // 用户授权登录
  //  getUserProfile(e) {
  //   wx.getUserProfile({
  //     desc: '用户授权登录', 
  //     success: (res) => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //       wx.setStorageSync('nickName', res.userInfo.nickName);
  //       wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
  //       let count =  db.collection('customer').where({uid: '6888ad7w0-c33a-11ec-a48b-b173ad94c5a9', nickName: res.userInfo.nickName}).count();
  //       // 首次登录
  //       if(count.total == undefined || count.total == 0) {
  //         db.collection('customer').add({data:{
  //           uid: '6888ad7w0-c33a-11ec-a48b-b173ad94c5a9',
  //           cuid: 'customer' + moment().valueOf(),
  //           nickName: this.data.userInfo.nickName,
  //           avatarUrl: this.data.userInfo.nickName,
  //           _st: 0,
  //           create_date: moment().valueOf(),
  //           update_date: moment().valueOf()
  //         }})
  //         .then(res => {
  //           // wx.navigateTo({
  //           //   url: '../index/index',
  //           // })
  //         }).catch(err => {
  //           console.log('添加顾客信息失败');
  //         })
  //       }
        
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // if (wx.getStorageSync('nickName').length > 0 && wx.getStorageSync('avatarUrl').length > 0){
    //   this.setData({
    //     hasUserInfo: true
    //   })
    // }else {
    //   this.setData({
    //     hasUserInfo: false,
    //     canIUseGetUserProfile: true
    //   })
    // }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})