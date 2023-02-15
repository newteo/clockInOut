var delay = 10
var key = require('../secret.js')
var time
var Api = require('./api.js')
//获取code
var getCode = function (callback) {
  wx.login({
    success: function (res) {
      if (res.code) {
        typeof callback === "function" && callback(res.code)
      }
      else {
        console.log('获取code失败！' + res.errMsg)
      }
    }
  })
}

// 获取access_token
function getToken(callback) {
  getCode((code) => {
    wx.getUserInfo({
      success: function (res) {
        console.log('用户允许授权')
        wx.request({
          url: Api.session,
          data: {
            code: code,
            newteo: key.newteo,
            iv: res.iv,
            encryptedData: res.encryptedData
          },
          method: 'GET',
          success: function (res) {
            typeof callback == "function" && callback(res.data)
          },
          fail: function (res) {
            console.log('wx.request 请求失败',res)
          }
        })
      },
      fail: function (res) {
        if (res.errMsg) {
          console.log('用户拒绝授权', res)
          typeof callback == "function" && callback({ errMsg: "userDenyed" })
        }
      }
    })
  })
}


var translateMonth = function (month) {
  month = month * 1 + 1
  if (month < 10) {
    return month = '0' + month
  }
  else return month = month + ''
}

var translateWeek = function (week) {
  switch (week) {
    case 0:
      return '星期日';
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
    default:
  }
}


function loadStaffDate(value, id, callback) {
  var newdate = new Date(value);
  var month;
  if (newdate.getMonth() < 10) {
    month = '0' + (newdate.getMonth() + 1)
  }
  wx.request({
    url: Api.staffsigns + id,
    data: {
      today: newdate.getFullYear() + '-' + month,
      token: wx.getStorageSync('token')
    },
    method: 'GET',
    success: (res) => {
      //服务器返回的员工某月的打卡纪录
      console.log(res)
      typeof callback == "function" && callback(newdate.getDay(), res)
    },
    fail: function (fail) {
      console.log(fail)
    },
  })
}
function obtainIndate(cb) {
  var obtainInday = new Date()
  obtainInday.setMonth(obtainInday.getMonth() + 1)
  var month = obtainInday.getMonth(), day = obtainInday.getDate()
  if (month < 10)
    month = '0' + month
  if (day < 10)
    day = '0' + day
  typeof cb == "function" && cb(obtainInday.getFullYear()
    + '-' + month
    + '-' + day)
}

var checkToken = function (token, cb) {
  wx.request({
    url: Api.userInfo + token,
    data: {},
    method: 'GET',
    success: function (res) {
      // success
      if (res.statusCode == 200) {
        console.log('token有效')
        typeof cb == 'function' && cb('good')
      }
      else {
        console.log('token无效')
        typeof cb == 'function' && cb('invail')
      }

    }
  })
}
function disable(seconds, total, callback) {
  if (total != '')
    delay = total
  delay--;
  if (delay == 0) {
    delay = 10
    clearTimeout(time)
    typeof callback == "function" && callback(false)
    console.log('清除了定时器')
  } else {
    console.log('重开了定时器计时' + delay)
    time = setTimeout(() => { this.disable(seconds,'', callback) }, seconds);
  }

}

module.exports = {
  getToken: getToken,
  checkToken: checkToken,
  translateMonth: translateMonth,
  translateWeek: translateWeek,
  loadStaffDate: loadStaffDate,
  obtainIndate: obtainIndate,
  disable: disable,
}