// pages/login/login.js
const db = wx.cloud.database({env: 'yzy-eat02-8g2to6g10601a6ef'});
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    allBill: [],
    time: moment().subtract(10, 'minutes').valueOf()
  },

  // 取消订单
  cancelBill(e) {
    const celBill = this.data.allBill[e.target.dataset.cancelindex];
    let nowDate = moment().subtract(10, 'minutes').valueOf();
    let gtDate = moment().subtract(30, 'minutes').valueOf();
    
    let isCancel = 0;
    let title = '取消成功';

    // 该订单在下单的30分钟内，且商家未确认，可直接取消
    if(celBill.create_date > gtDate && celBill.onConfirm == 0) {
      isCancel = 2;
    }else if(celBill.create_date >= nowDate) {
      isCancel = 2
    }else if(celBill.onConfirm == 2){
      title = '该订单已被取消'
    }else {
      title = '取消失败，请和商家联系'
    }

    if(isCancel == 2 && celBill.onConfirm != 2) {
      db.collection('bill').doc(celBill._id).update({data:{
        onConfirm: 2,
        totalPrice: 0,
        update_date: moment().valueOf()
      }})
      .then(res => {
        wx.showToast({
          title: title,
        })
        this.onLoad();
      })
      .catch(err => {
        wx.showToast({
          title: `${title}`,
          icon: 'none'
        })
      })
    }else if(celBill.onConfirm == 2){
      wx.showToast({
        title: `${title}`,
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: `${title}`,
        icon: 'none'
      })
    }
  },

  // 再来一单
  getOneBill(e) {
    const getBill = this.data.allBill[e.target.dataset.getoneindex];
      wx.showModal({
      title: '是否确认购买？',
      success: (res) => {
        if(res.confirm) {
          // 生成订单
          db.collection('bill').add({data:{
            "nickName": getBill.nickName,
            "avatarUrl": getBill.avatarUrl,
            "cid": getBill.cid,
            "uid": getBill.uid,
            "bid": moment().valueOf(),
            "order": getBill.order,
            "totalPrice": getBill.totalPrice,
            "onConfirm": 0,
            "_st": 0,
            "create_date": moment().valueOf(),
            "update_date": moment().valueOf(),
          }})
          .then(res => {
            console.log('成功添加')
            // 修改菜品数据
            for(let i = 0; i < getBill.order.length; i++) {
              db.collection('dish').where({name: getBill.order[i].name}).update({data:{
                "update_date": moment().valueOf(),
                "saleCount": db.command.inc(getBill.order[i].count)
              }})
              .then(res => {
                console.log('修改菜品销售个数成功');
              })
              .catch(err => {
                console.log('修改菜品销售个数失败err=', err)
              })
            }

            // 修改类目数据
            for(let j = 0; j < getBill.order.length; j++) {
              db.collection('category').where({value: getBill.order[j].category}).update({data:{
                "update_date": moment().valueOf(),
                "sele_quantity": db.command.inc(getBill.order[j].count)
              }})
              .then(res => {
                console.log('修改类目销售个数成功');
              })
              .catch(err => {
                console.log('修改类目销售个数失败err=', err)
              })
            }
            wx.showToast({
              title: '支付成功',
              duration: 1000
            })
            this.onLoad();
          })
          .catch(err => {
            console.log('支付错误=', err)
          })

        }else if(res.cancel) {
          console.log('取消支付')
          wx.showToast({
            title: '取消订单成功',
            duration: 1000
          })
        }
      }
    })
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

  // 用户授权登录
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用户授权登录', 
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('nickName', res.userInfo.nickName);
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
        let count =  db.collection('customer').where({uid: '6888ad7w0-c33a-11ec-a48b-b173ad94c5a9', nickName: res.userInfo.nickName}).count();
        // 首次登录
        if(count.total == undefined || count.total == 0) {
          db.collection('customer').add({data:{
            uid: '6888ad7w0-c33a-11ec-a48b-b173ad94c5a9',
            cuid: 'customer' + moment().valueOf(),
            nickName: this.data.userInfo.nickName,
            avatarUrl: this.data.userInfo.nickName,
            _st: 0,
            create_date: moment().valueOf(),
            update_date: moment().valueOf()
          }})
          .then(res => {
            wx.navigateTo({
              url: '../index/index',
            })
          }).catch(err => {
            console.log('添加顾客信息失败');
          })
        }
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getStorageSync('nickName').length > 0 && wx.getStorageSync('avatarUrl').length > 0) {
      var item = {
        nickName: wx.getStorageSync('nickName'),
        avatarUrl: wx.getStorageSync('avatarUrl')
      }
      this.setData({
        canIUseGetUserProfile: false,
        hasUserInfo: true,
        userInfo: item
      })
      
      db.collection('bill').orderBy('update_date', 'desc').where({_st:0, uid:'6888ad7w0-c33a-11ec-a48b-b173ad94c5a9', nickName: this.data.userInfo.nickName, avatarUrl: this.data.userInfo.avatarUrl}).get()
      .then(res => {
        this.setData({
          allBill: res.data
        })
      })
      .catch(err => {
        console.log('获取订单失败err==', err);
      })
    }else {
      this.setData({
        hasUserInfo: false,
        canIUseGetUserProfile: true
      })
    }

    
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