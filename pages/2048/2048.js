// pages/2048/2048.js

const Game = require('./game.js')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden:false,
    data: [],
    start: '重新开始',
    nickName:'',
    animations: [],
    score:0,
    best:0,
    hasUserInfo:false, 
    isGameOver: false
  },
  /*
  * 内部用到的参数
  */
  game: null,
  flag: false,
  state:true,
  duration: 0,
  RN: 4,
  CN: 4,
  startX: 0,
  startY: 0,
  inAnimation: false,
  normalAudio:null,
  scoreAudio: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    setTimeout(() => {
      this.setData({
        hidden: true,
      })
      this.init()
      console.log(this.data)
    }, 500)
    this.getUserInfoNickName()
  },
  getUserInfoNickName(){
    let nickName = ''
    if (app.globalData.userInfo) {
      nickName = app.globalData.userInfo.nickName
      this.setData({
        nickName: nickName,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        nickName = res.userInfo.nickName
        this.setData({
          nickName: nickName,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          nickName = res.userInfo.nickName
          this.setData({
            nickName: nickName,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  init(){
    let { RN, CN, duration} = this
    this.game = new Game(RN, CN, duration )
    this.normalAudio = wx.createInnerAudioContext()
    this.normalAudio.src = './audio/normal.mp3'
    this.scoreAudio = wx.createInnerAudioContext()
    this.scoreAudio.src = './audio/score.mp3'
    this.scoreAudio.onPlay( () => {
      console.log('play--------')
    } )
    let ne2 = wx.createAudioContext('normal')
    setInterval( ()=>{
      console.log('xxxxxxxxxxx')
      console.log(ne2)
      ne2.play()
    } ,2000)
    console.log('wx版本号')
    console.log(wx.getSystemInfoSync())
    let nickName = this.data.nickName
    console.log(nickName + 'nickName')
    let best = wx.getStorageSync(nickName)
    if (best) {
      this.setData({
        best
      })
    }

    this.updateView( this.game.grid )
    console.log(app.globalData.userInfo)
  },
  updateAnimations: function (animations){
    this.setData({
      animations
    })
  },
  updateView: function(data , score = 0){
    console.log(score)
    let self = this
    let beforeScore = this.data.score
    if( score === beforeScore ){
      this.normalAudio.startTime = 0
      this.normalAudio.play()
    }else{
      this.scoreAudio.startTime = 0
      this.scoreAudio.play()
    }
    this.setData({
      data,
      score
    }, () => {
      if( this.game.isGameOver() ){
        let nickName = this.data.nickName
        this.setData({
          isGameOver: true
        })
        wx.setStorageSync(nickName, score)
      }
    })
  },
  gameStart(){
    this.setData({
      isGameOver: false
    })
    this.init()
  },
  touchStart: function(e){
    //console.log(e)
    let { pageX, pageY } = e.touches[0]
    this.startX = pageX
    this.startY = pageY

  },
  touchMove: function(e){
    if (!this.flag && !this.inAnimation){
      this.flag = true
      let { pageX, pageY } = e.touches[0]
      let direction = this.getDirection( pageX, pageY )
      let hasChange = this.game.move(direction)
      if (hasChange){
        this.inAnimation = true
        this.updateAnimations(this.game.animations)
        setTimeout( _ => {
          this.game.randomNum()
          this.updateView(this.game.grid, this.game.score, true)
          setTimeout( _ => {
            this.game.resetAnimation()
            this.updateAnimations(this.game.animations)
            this.inAnimation = false
          }, 50)
        }, this.duration + 50)
      }
    }

  },
  touchEnd:function(e){

    //console.log(e)
    this.flag = false

  },
  getDirection( endX, endY ){
    let { startX, startY } = this
    let x = endX - startX
    let y = endY - startY
    return Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4
  }

})