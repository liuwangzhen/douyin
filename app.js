//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
  
    require('./utils/sdk-wechat.2.0.5-a.js')
    let clientId = this.globalData.clientId
    wx.BaaS.init(clientId)
    let MyUser = new wx.BaaS.User()
    wx.BaaS.login(false).then(res => {
      this.globalData.userId = res.id
      MyUser.get(res.id).then(res => {
        // success
        this.globalData.userInfo = res.data
      }, err => {
        // err
      })
    }, err => {
      // 登录失败
    })
  
    // 获取用户信息
   
  },
  globalData: {
    clientId: 'f0bd6a7b27e0ad56dc65', // 从 BaaS 后台获取 ClientID
    // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
    baseUrl: 'https://f0bd6a7b27e0ad56dc65.myminapp.com',
  }
})