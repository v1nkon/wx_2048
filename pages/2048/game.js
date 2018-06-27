function Game( row, col ){
   this.init( row, col )
}
Game.prototype = {
  RN: 0,
  CN: 0,
  score: 0,
  duration:500,
  width: 120,
  margin:10,
  pixelRatio:2,
  init: function (row = 4, col = 4, duration = 1000 ){
    this.RN = row
    this.CN = col
    this.duration = duration
    this.getDevice()
    this.initData()
    this.initAnimations()
    this.randomNum()
    this.randomNum()
  },
  initData: function(){
    let data = []
    for( let i = 0 ; i < this.RN ; i++ ){
      data[i] = []
      for( let j = 0 ; j < this.CN ; j++ ){
        data[i][j] = ""
      }
    }
    this.grid = data
  },
  initAnimations: function () {
    let animations = []
    for (let i = 0; i < this.RN; i++) {
      animations[i] = []
      for (let j = 0; j < this.CN; j++) {
        animations[i][j] = {}
      }
    }
    this.animations = animations
  },
  initBox(){
    let box = []
    for (let i = 0; i < this.RN; i++) {
      box[i] = []
      for (let j = 0; j < this.CN; j++) {
        box[i][j] = "box-" + i + j 
      }
    }
    return box
  },
  getDevice(){
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        self.pixelRatio =  750 / res.screenWidth
      }
    })
  },
  randomNum: function(min = 2, max = 4){
    while( true ){
      let num = Math.random() > 0.5 ? 2 : 4
      let x = Math.floor(Math.random() * this.RN )
      let y = Math.floor(Math.random() * this.CN )
      if ( !this.grid[x][y] ){
        this.grid[x][y] = num
        return
      }
    }
  },
  move: function(direction){
    let beforeStr = String(this.grid)
    switch(direction){
      case 0: this.moveTop(); break;
      case 1: this.moveRight(); break;
      case 2: this.moveBottom(); break;
      case 3: this.moveLeft(); break;
    }
    console.log('随机数生产')
    let afterStr = String(this.grid)
    if (beforeStr !== afterStr ){
      return true
    }
    return false
  },
  isGameOver(){
    let { RN,CN,grid } = this
    for( let r = 0; r < RN; r++ ){
      for( let c = 0 ; c < CN; c++ ){
        if( !grid[r][c] ){
          return false
        }
        if( c < CN -1 && grid[r][c] === grid[r][c+1] ){
          return false
        }
        if (r < RN - 1 && grid[r][c] === grid[r+1][c]) {
          return false
        }
      }
    }
    return true
  },
  getMax(){
    
  },
  moveAction: function(){

  },
  moveTop: function(){
    for (let c = 0; c < this.CN; c++) {
      this.moveTopInCol(c)
    }
  },
  moveTopInCol: function (c) {
    for (let r = 0; r < this.RN - 1; r++) {
      let index = this.getNextRow(r, c)
      if (index === -1) break;
      if (!this.grid[r][c]) {
        this.createTopBottomAnimation(r, index, c, 'col', -1)
        this.grid[r][c] = this.grid[index][c]
        this.grid[index][c] = ''
        r--
      } else if (this.grid[r][c] === this.grid[index][c]) {
        this.createTopBottomAnimation(r, index, c, 'col', -1)
        this.grid[r][c] += this.grid[index][c]
        this.score += this.grid[r][c]
        this.grid[index][c] = ''
      }
    }
  },
  getNextRow: function (r, c) {
    for (let i = r + 1; i < this.RN; i++) {
      if (this.grid[i][c]) {
        return i
      }
    }
    return -1
  },
  moveBottom: function () {
    for (let c = 0; c < this.CN; c++) {
      this.moveBottomIncol(c)
    }
  },
  
  moveBottomIncol: function(c){
    for (let r = this.RN - 1; r > 0; r-- ) {
      let index = this.getPrevRow(r, c)
      if (index === -1) break;
      if (!this.grid[r][c]) {
        this.createTopBottomAnimation(r, index, c , 'col',1)
        this.grid[r][c] = this.grid[index][c]
        this.grid[index][c] = ''
        r++
      } else if (this.grid[r][c] === this.grid[index][c]) {
        this.createTopBottomAnimation(r, index, c, 'col', 1)
        this.grid[r][c] += this.grid[index][c]
        this.score += this.grid[r][c]
        this.grid[index][c] = ''
      }
    }
  },
  getPrevRow: function (r, c) {
    for (let i = r - 1; i >= 0; i--) {
      if (this.grid[i][c]) {
        return i
      }
    }
    return -1
  },
  moveLeft(){
    for (let r = 0; r < this.RN; r++) {
      this.moveLeftInRow(r)
    }
  },
  moveLeftInRow(r){
    for (let c = 0; c < this.CN - 1; c++) {
      let index = this.getNextCol(r, c)
      if (index === -1) break;
      if (!this.grid[r][c]) {
        this.createTopBottomAnimation(c, index, r, 'row', -1)
        this.grid[r][c] = this.grid[r][index]
        this.grid[r][index] = ''
        c--
      } else if (this.grid[r][c] === this.grid[r][index]) {
        this.createTopBottomAnimation(c, index, r, 'row', -1)
        this.grid[r][c] += this.grid[r][index]
        this.score += this.grid[r][c]
        this.grid[r][index] = ''
      }
    }
  },
  getNextCol(r, c){
    for (let i = c + 1; i < this.CN ; i++) {
      if (this.grid[r][i]) {
        return i
      }
    }
    return -1
  },
  moveRight(){
    for (let r = 0; r < this.RN; r++) {
      this.moveRightInRow(r)
    }
  },
  moveRightInRow(r){
    for (let c = this.CN -1 ; c > 0; c--) {
      let index = this.getPrevCol(r, c)
      if (index === -1) break;
      if (!this.grid[r][c]) {
        this.createTopBottomAnimation(c, index, r, 'row', 1)
        this.grid[r][c] = this.grid[r][index]
        this.grid[r][index] = ''
        c++
      } else if (this.grid[r][c] === this.grid[r][index]) {
        this.createTopBottomAnimation(c, index, r, 'row', 1)
        this.grid[r][c] += this.grid[r][index]
        this.score += this.grid[r][c]
        this.grid[r][index] = ''
      }
    }
  },
  getPrevCol(r, c){
    for (let i = c - 1; i >= 0; i--) {
      if (this.grid[r][i]) {
        return i
      }
    }
    return -1
  },
  createTopBottomAnimation(before, after, mutation, rowOrCol = 'col',dir = -1){
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: this.duration,
      timingFunction: "ease",
      delay: 0
    });
    let distance = ((dir * Math.abs(after - before) * (this.width + this.margin))) / this.pixelRatio
    if (rowOrCol === 'col' ){
      animation.translateY(distance).step();
      this.animations[after][mutation] = animation
    }else{
      animation.translateX(distance).step();
      this.animations[mutation][after] = animation
    }
  },
  resetAnimation: function(){
    for (let i = 0; i < this.RN; i++) {
      for (let j = 0; j < this.CN; j++) {
        let animation = wx.createAnimation({
          transformOrigin: "50% 50%",
          duration: 0,
          timingFunction: "ease",
          delay: 0
        });
        animation.translateX(0).translateY(0).step();
        this.animations[i][j] = animation
      }
    }
  }
}
module.exports = Game;