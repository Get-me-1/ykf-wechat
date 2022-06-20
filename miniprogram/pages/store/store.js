// pages/store/store.js
const db = wx.cloud.database({env: 'yzy-eat02-8g2to6g10601a6ef'});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeName: '',
    storeAddress: '',
    storeLogo: ''
  },

  // 跳转到店铺界面
  toStore() {
    wx.navigateTo({
      url: '../store/store',
    })
  },

  // 跳转到订单界面
  toBill() {
    wx.navigateTo({
      // url: '../bill/bill',
      url: '../login/login'
    })
  },

  // 首页
  toDish() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    db.collection('store').where({_st:0, uid: '6888ad7w0-c33a-11ec-a48b-b173ad94c5a9'}).get()
    .then(res => {
      var da = res.data;
      this.setData({
        storeName: da[0].name,
        storeAddress: da[0].address,
        storeLogo: da[0].logo[0].url
      })
    }).catch(err => {
      console.log('获取店铺信息失败==', err)
    })
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