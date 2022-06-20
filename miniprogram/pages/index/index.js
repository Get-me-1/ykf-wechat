const db = wx.cloud.database({env: 'yzy-eat02-8g2to6g10601a6ef'});
var heightArr = [0];
import moment from 'moment'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    all: [],
    allDish: [], // 菜品数据
    allCategory: [], // 菜品类目数据
    carList: [], // 购物车记录
    bill: [], // 订单记录
    cateCount: [], // 记录分类购买个数
    totalPrice: 0, // 购买总价
    totalCount: 0, // 购买总个数
    isShowCar: false, // 是否展示购物车
    scrollIntoView: 'a0', // 右侧联动
    leftNum: 0, // 左侧当前项
    title: '购物车为空'
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

  // 左侧点击事件
  leftScroll(e) {
    var leftIndex = e.currentTarget.dataset.leftindex;
    console.log('leftIndex=', leftIndex)
    this.setData({
      leftNum: this.data.all[leftIndex].cid,
      scrollIntoView: this.data.all[leftIndex].cid
    })
  },

  // 右侧滚动
  rightScroll(e) {
    let st = e.detail.scrollTop;
    for(let i = 0; i < heightArr.length; i++) {
      if(st >= heightArr[i] && st< heightArr[i + 1] - 15) {
        this.setData({
          leftNum: this.data.all[i].cid
        })
        return;
      }
    }
  },

  // 添加到购物车
  addToCar(e) {
    var index = e.target.dataset.index;
    var newindex = e.target.dataset.newindex;
    const getData = this.data;
    // const car =  getData.allDish[index]
    var car = getData.all[newindex].dish[index];
    // console.log('car=index===', index, ',car.category==', car.category);

    var text = [];
    var cateText = [],
    text = getData.carList;
    cateText = getData.cateCount;
    
    let cateList = {
      "category": car.category, // 菜品类目
      "count": 1
    }
    if(cateText.length == 0) {
      cateText.push(cateList);
    }else {
      for(let j = 0; j < cateText.length; j++) {
        if(cateText[j].category == car.category) {
          cateText[j].count += 1;
          break;
        }else if(j == cateText.length - 1 && cateText[j].category != car.category) {
          cateText.push(cateList);
          break;
        }
      }
    }

    var addList = {
      "newid": newindex, // 类目下标
      "id": index, // 记录该类目下的菜品下标
      "category": car.category, // 记录菜品类目
      "image": car.image[0].url, // 记录菜品图片
      "name": car.name,  // 记录菜品名称
      "price": car.price, // 记录菜品价格
      "count": 1,
    };
    if(text.length == 0) {
      text.push(addList);
    }else {
      for(let i = 0; i < text.length; i++) {
        // console.log('text[i].newid==', text[i].newid, ',,newindex=',newindex)
        if(text[i].newid == newindex && text[i].id == index) {
          // 相同类目，相同菜品
          text[i].count += 1;
          text[i].price = text[i].count * car.price;
          // console.log('相同类目，相同菜品=', text)
          break;
        }else if (text[i].newid == newindex && text[i].id != index && i == text.length - 1) {
          // 相同类目，不同菜品
          text.push(addList);
          break;
        }else if(i == text.length - 1 && text[i].newid != newindex){ 
          // 类目不同        
          text.push(addList);
          break;
        }
      }
    }
    this.setData({
      title: '点击购买',
      carList: text,
      cateCount: cateText,
      totalCount: getData.totalCount + 1,
      totalPrice: getData.totalPrice + car.price
    })
    // console.log('获取值=', car)
    // console.log('购物车数据=', getData.carList);
    // console.log('类目购买个数=', getData.cateCount);
    // console.log('总价=', getData.totalPrice);
    // console.log('总个数=', getData.totalCount);
  },

  // 减少数量
  delToCar(e) {
    var index = e.target.dataset;
    // console.log('delindex===', index)
    const del = this.data.all[index.newdelindex].dish[index.delindex];
    // console.log('del===',del);
    var delCarText = this.data.carList;
    var delCateCount = this.data.cateCount;
    for(let k = 0; k < delCarText.length; k++) {
      if(delCarText[k].newid == index.newdelindex && delCarText[k].id == index.delindex) {
        delCarText[k].count -= 1;
        delCarText[k].price = delCarText[k].count * del.price
        if(delCarText[k].count == 0) {
          // splice(index, howmany): 如果howmany没有指定个数，则会删除index后面的所有数据
          delCarText.splice(k, 1);
          break;
        }
        break;
      }
    }

    for(let m = 0; m < delCateCount.length; m++) {
      if(delCateCount[m].category == del.category) {
        delCateCount[m].count -= 1;
        if(delCateCount[m].count == 0) {
          delCateCount.splice(m, 1);
          break;
        }
        break;
      }
    }
    const a = delCarText.length > 0 ? '点击购买' : '购物车为空';
    this.setData({
      title: a,
      carList: delCarText,
      cateCount: delCateCount,
      totalPrice: this.data.totalPrice - parseInt(del.price),
      totalCount: this.data.totalCount - 1
    })
    // console.log('减购物车数据=', this.data.carList);
    // console.log('减类目数量=', this.data.cateCount);
    // console.log('减总价=', this.data.totalPrice);
  },

  // 购物车数量减少
  delcount(e) {
    // console.log('数量-1 --- e', e)
    let index = e.currentTarget.dataset.cardelindex;
    let list = this.data.carList;
    let cateList = this.data.cateCount;
    let count = list[index].count;
    let updateShow = true;
    
    for(let i = 0; i < cateList.length; i++) {
      if(cateList[i].category == list[index].category) {
        if(cateList[i].count > 1) {
          cateList[i].count--;
          break;
        }else {
          cateList[i].count--;
          cateList.splice(i, 1);
          break;
        }
      }
    }
    let pp = list[index].price / list[index].count;
    if(count > 1) {
      list[index].price = list[index].price / list[index].count * (count - 1);
      list[index].count--;
    }else {
      list.splice(index, 1);
      if(list.length == 0) {
        updateShow = false;
        list = [];
      }
    }
    let a = '点击购买';
    if(cateList.length == 0) {
      cateList= [];
      a = '购物车为空'
    }
    this.setData({
      carList: list,
      isShowCar: updateShow,
      cateCount: cateList,
      totalCount: this.data.totalCount - 1,
      totalPrice: this.data.totalPrice - pp,
      title: a
    })
  },

  // 购物车数量增加
  addcount(e) {
    // console.log('数量+1 ---- e', e)
    let index = e.currentTarget.dataset.caraddindex;
    let list = this.data.carList;
    let cateList = this.data.cateCount;
    let count = list[index].count;
    list[index].price = list[index].price / list[index].count * (count + 1);
    list[index].count++;
    // console.log('购物车类目===', list[index].category);
    for(let i = 0; i < cateList.length; i++) {
      if(cateList[i].category == list[index].category) {
        // console.log('类目名称====', cateList[i].category);
        cateList[i].count++;
        break;
      }
    }
    this.setData({
      carList: list,
      cateCount: cateList,
      totalCount: this.data.totalCount + 1,
      totalPrice: this.data.totalPrice + list[index].price / list[index].count
    })
  },

  // 展示购物车
  showCar() {
    this.setData({
      isShowCar: !this.data.isShowCar
    })
  },

  // 关闭购物车展示
  closeShow() {
    this.setData({
      isShowCar: false
    })
  },

  // 清空购物车
  carClearAll(e) {
    console.log('点击清空购物车', e)
    this.setData({
      carList: [],
      cateCount: [],
      totalCount: 0,
      totalPrice: 0,
      isShowCar: false
    })
  },
  
  // 点击购买
  addBill() {
    if(this.data.carList.length > 0) {
        wx.showModal({
        title: '是否确认购买？',
        success: (res) => {
          if(res.confirm) {
            // 生成订单
            db.collection('bill').add({data:{
              "nickName": wx.getStorageSync('nickName'),
              "avatarUrl": wx.getStorageSync('avatarUrl'),
              "cid": this.data.allDish[0].cid,
              "uid": this.data.allDish[0].uid,
              "bid": Date.parse(new Date()),
              "order": this.data.carList,
              "totalPrice": this.data.totalPrice,
              "onConfirm": 0,
              "_st": 0,
              "create_date": moment().valueOf(),
              "update_date": moment().valueOf(),
            }})
            .then(res => {
              console.log('成功添加')
              // 修改菜品数据
              for(let i = 0; i < this.data.carList.length; i++) {
                db.collection('dish').where({name: this.data.carList[i].name}).update({data:{
                  "update_date": moment().valueOf(),
                  "saleCount": db.command.inc(this.data.carList[i].count)
                }})
                .then(res => {
                  console.log('修改菜品销售个数成功');
                })
                .catch(err => {
                  console.log('修改菜品销售个数失败err=', err)
                })
              }

              // 修改类目数据
              for(let j = 0; j < this.data.cateCount.length; j++) {
                db.collection('category').where({value: this.data.cateCount[j].category}).update({data:{
                  "update_date": moment().valueOf(),
                  "sele_quantity": db.command.inc(this.data.cateCount[j].count)
                }})
                .then(res => {
                  console.log('修改类目销售个数成功');
                })
                .catch(err => {
                  console.log('修改类目销售个数失败err=', err)
                })
              }
              this.setData({
                carList: [],
                cateCount: [],
                totalPrice: 0,
                totalCount: 0
              })
              wx.showToast({
                title: '支付成功',
                duration: 1000
              })
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
            this.setData({
              carList: [],
              cateCount: [],
              totalCount: 0,
              totalPrice: 0
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权登录，没有跳转到登录
    // console.log('登录====', wx.getStorageSync('nickName').length)
    if(wx.getStorageSync('nickName').length == 0) {
      wx.navigateTo({
        url: '../login/login',
      })
    }

    // 获取所有菜品信息
    wx.cloud.callFunction({
      name: 'getDish'
    }).then(res => {
      for(let i = 0; i < res.result.length; i++) {
        res.result[i].image = JSON.parse(res.result[i].image);
      }
      // 修改data数据，需要使用setData，不能直接赋值修改(this.allDish = res.result)
      this.setData({
        allDish: res.result
      })
      // console.log('菜品信息=', res.result)

      // 获取所有拥有菜品数量的菜品类目信息
    db.collection('category').where({_st:0, count: db.command.gt(0)}).get()
    .then(res => {
      this.setData({
        allCategory: res.data,
        scrollIntoView: res.data[0].cid
      })
        // 结合
        var cateDish = [];
        for(let i = 0; i < this.data.allCategory.length; i++) {
          let cate = {
            "cid": this.data.allCategory[i].cid,
            "category": this.data.allCategory[i].value,
            "dish": []
          }
          cateDish =  cateDish.concat(cate);
        }
        for(let i = 0; i < this.data.allCategory.length; i++) {
          for(let j = 0; j < this.data.allDish.length; j++) {
            if(cateDish[i].cid == this.data.allDish[j].cid) {
              cateDish[i].dish.push(this.data.allDish[j])
            }
          }
        }
        this.setData({
          all: cateDish
        })
        // console.log('all=', this.data.all)
    }).catch(err => {
      console.log('获取菜品类目数据失败', err);
    })
    }).catch(err => {
      console.log('获取菜品数据失败', err);
    })
    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取区域的高度 --- 为防止图片为渲染完成，加延迟器
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.selectAll('.box').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].map(val => {
          let result = val.height + heightArr[heightArr.length - 1]
          heightArr.push(result);
        })
        console.log('高度: ', heightArr);
      })
    }, 1000)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})