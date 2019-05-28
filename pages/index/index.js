//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    oldUrl: "",
    douyin: "",
    aa: false,
    status: 0,
    imgs: [],
    loading:false,
  },
  //事件处理函数
  onLoad: function() {
    wx.showShareMenu();
    let that = this;
    that.getUserInfoByToken();
    that.getImg();
  },
  // 获取抖音地址
  goDouyin: function() {
    let that = this
    var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    var result = that.data.oldUrl.match(reg);
   
    if (result == null) {
      that.setData({
        status: 1
      })
    } else {
      wx.BaaS.invokeFunction('Douyin', {
        src: result[0]
      }).then(res => {
        if (res.code === 0) {
          if (res.data.length == 1) {
            that.setData({
              status: 2
            })
          } else {
            console.log(res.data)
            that.setData({
              status: 3,
              douyin: res.data
            })
          }
        }
      }, err => {
        console.log(err)
      })
    }
  },
  iptblur: function(e) {
    let that = this
    that.setData({
      oldUrl: e.detail.value
    })
  },
  getImg: function() {
    let that = this
    let MyFile = new wx.BaaS.File()
    let query = new wx.BaaS.Query()
    // 查询某一文件分类下的所有文件
    query.compare('category_name', '=', '抖音')
    // 查询文件名包含指定字符串的文件
    MyFile.setQuery(query).find().then(
      res => {
        that.setData({
          imgs: res.data.objects
        })
      }, err => {
        console.log(err)
      }
    )
  },
  // 获取用户信息
  getUserInfoByToken() {
    let MyUser = new wx.BaaS.User()
    let that = this
    wx.BaaS.auth.getCurrentUser().then(res => {
      // user 为 currentUser 对象
      if (res.is_authorized == false) {
        wx.redirectTo({
          url: '../../pages/login/login',
        })
      }
    }).catch(err => {
      // HError  
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
  },
  // 预览
  preview: function(e) {
    console.log(e)
    let that = this
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [that.data.imgs[0].path, that.data.imgs[1].path]
    })
  },
  // 保存视频
  save: function() {
    let that = this
    let foo=function(){
      that.setData({
        loading:true
      })
    let insertStr = (soure, start, newStr) => {
      return soure.slice(1, start) + newStr + soure.slice(start)
    }
    let src=insertStr(that.data.douyin,5,'s')
    console.log(src)
    wx.downloadFile({
      url: src, // 仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存成功',
              })
              that.setData({
                loading:false
              })
            },
            fail(err) {
              console.log(err)
              that.setData({
                loading: false
              })
              wx.showToast({
                title: '下载失败',
              })
            },
          })
        }
      },
      fail(){
        that.setData({
          loading: false
        })
        wx.showToast({
          title: '下载失败',
        })
      },
    })
    }
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']==false) {
          that.setData({
            NotAllow: true
          })
          wx.showToast({
            title: '请先手动授权',
          })
        }
        else{
          foo();
        }
      }
    })
  },
  alert:function(e){
    let that=this
    console.log(e)
    if(e.detail.authSetting['scope.writePhotosAlbum']==true){
      that.setData({
      NotAllow:false
    })
    }
  },
  onShareAppMessage:function(res){
     return{
       title:'抖音一键去水印神器，快来看看吧',
       path:'pages/index/index',
      //  imageUrl
     }
  },
})