var util = require('../../utils/util.js')
Page({
  data: {
    btnDis: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  handleCreateBtn: function () {

    if (this.data.btnDis != true) {
      {
        this.setData({
          btnDis: true
        })
        wx.navigateTo({
          url: '/pages/create/create',
        })
        util.disable(1000, 2, (backData) => {
          if (backData == false) {
            console.log('禁用解除')
            this.setData({
              btnDis: false
            })
          }
        })
      }
    } else {
      wx.showToast({
        title: '点击过于频繁',
        icon: 'success',
        duration: 2000
      })
    }
  },
  handleJoinBtn: function () {
    if (this.data.btnDis != true) {
      {
        this.setData({
          btnDis: true
        })
        wx.navigateTo({
          url: '/pages/list/list',
        })
        util.disable(1000, 2, (backData) => {
          if (backData == false) {
            console.log('禁用解除')
            this.setData({
              btnDis: false
            })
          }
        })
      }
    }else {
      wx.showToast({
        title: '点击过于频繁',
        icon: 'success',
        duration: 2000
      })
    }
  },

})