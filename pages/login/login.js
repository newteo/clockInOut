
var util = require('../../utils/util.js');
var Api = require('../../utils/api.js')

Page({
  data: {
    btnDis: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // wx.clearStorageSync()
    //每次进入小程序都 设置token和userType
    var token = wx.getStorageSync('token');
    if (token && wx.getStorageSync('userType')) {
      util.checkToken(token, (res) => {
        if (res == 'invail') {
          wx.clearStorageSync()
        }
        else {
          if (res == 'good') {
            this.updateUserType((userType) => {
              this.switchPages(userType)
            })
          }
        }
      })
    }
  },
  onShow: function () {
    // 页面显示
  },

  switchPages: function (userType) {
    console.log(userType)
    switch (userType) {
      case 'manager':
        wx.switchTab({ url: '/pages/workers/workers' })
        break;
      case 'staff':
        wx.redirectTo({ url: '/pages/scan/scan?' })
        break;
      case 'user':
        wx.redirectTo({ url: '/pages/select/select' })
        break;
      default:
        break;
    }
  },


  //更新个人的userType
  updateUserType: function (cb) {
    wx.request({
      url: Api.userInfo + wx.getStorageSync('token'),
      method: 'GET',
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          wx.setStorageSync('userType', res.data.types)
          typeof cb == 'function' && cb(res.data.types)
        }
      }
    })
  },

  //登录按钮处理函数
  handleLoginBtn() {
    wx.showToast({
      title: '登录中',
      icon: 'loading'
    })
    if (this.data.btnDis != true) {
      this.setData({
        btnDis: true
      });
      // this.switchPages('user');
      console.log("getToken")
      util.getToken((res) => {
        console.log(res)
        //用户拒绝授权
        if (res.errMsg == 'userDenyed') {
          wx.redirectTo({
            url: '/pages/unAuth/unAuth',
          })
        }
        //用户允许授权
        else {
          wx.setStorageSync('userType', res.types)
          wx.setStorage({
            key: 'token',
            data: res.token,
            success: (sssres) => {
              this.switchPages(res.types)
            },
            fail: function () {
              console.error('存储token时失败')
            }
          })
        }
      })
      util.disable(1000, 3, (backData) => {
        if (backData == false)
          this.setData({
            btnDis: false
          })
            console.log('解除禁用')          
      })
    }
  }
})