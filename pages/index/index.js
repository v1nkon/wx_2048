//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    slots:[1,2,3,4],
    current: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function() {
    this.load()
  },
  load: function () {
    let n = 1
    let timer = setInterval( () => {
      console.log(this.data.current)
      if(n === 6) {
        clearInterval(timer)
        wx.redirectTo({
          url: '../2048/2048',
        })
        return
      }
      this.setData({
        current: this.data.current+1
      })
      if( this.data.current > 3 ) {
        this.setData({
          current: 0
        })
      }
      n++
    } ,400)
  },
})
