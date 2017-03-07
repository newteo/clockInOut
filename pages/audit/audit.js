var util = require('../../utils/util.js')
Page({
  data: {
    winHeight: '',
    winWidth: '',
    message: '',
    companyName: '',
    btnDis: false,
  },
  onLoad: function (options) {
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData(
          {
            winWidth: res.windowWidth,
            winHeight: res.windowHeight,
            message: options.message,
            companyName: options.companyName,
          });
      }
    });
  },
  back: function (e) {
    if (this.data.btnDis != true) {
      this.setData({
        btnDis: true
      })
      wx.redirectTo({ url: '/pages/list/list' })
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