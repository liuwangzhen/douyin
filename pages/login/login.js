const app = getApp();
// const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function (e) {
    
  },
  userInfoHandler(data) {
    let that = this
    let MyUser = new wx.BaaS.User()
    wx.BaaS.handleUserInfo(data).then(res => {
      let sex = res.gender
      let city = res.city
      let country = res.country
      let province = res.province
      let MyUser = new wx.BaaS.User()
      let currentUser = MyUser.getCurrentUserWithoutData()
      let nick = res.nickName
      let avatar = res.avatarUrl
      // 为字段设置默认信息
      wx.BaaS.login(false).then(res => {
        MyUser.get(res.id).then(res => {
          // success
          currentUser.set({
            'sex': sex,
            'country0': country,
            'province0': province,
            'city0': city,
            'collection': ['ssss2'],
            'nick': nick,
            'attention': [2],
            'jundge': true
          }).update().then(res => {
            let avatar = res.data.avatar
            currentUser.set({
              'headimg': avatar
            }).update().then(res => {
            }, err => { })
            let tableID = 56146
            let Product = new wx.BaaS.TableObject(tableID)
            let product = Product.create()
            // 设置方式一
            let apple = {
              fans: [2],
              nick: nick,
            }
            product.set(apple).save().then(res => {
              // success
            }, err => {
              //err 为 HError 对象
            })
          }, err => {
            // err
          })
          wx.reLaunch({
            url: '/pages/index/index'
          })
        })
      })

      // res 包含用户完整信息，详见下方描述
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
      let currentUser = MyUser.getCurrentUserWithoutData()
      wx.BaaS.login(false).then(res => {
        MyUser.get(res.id).then(res => {
          // success
          console.log('jujue')
        },
          err => {
            // err
          })
      }, err => {
        // err
      })
    })
  },




  //获取用户信息接口


})