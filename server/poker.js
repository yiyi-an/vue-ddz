// 生成一套扑克牌类
class Pocker {

  constructor(playerCount){
    this.playerCount=playerCount
    this.allList = Pocker.list()
    this.random() // 洗牌
    this.dealer() // 发牌
  }
  // 生成扑克牌
  static list(){
    const num=['3','4','5','6','7','8','9','10','J','Q','K','A','2',]
    const _category=['方','梅','红','黑']
    const pockerEmpty =  new Array(54).fill("")
    return pockerEmpty.map((item,ind)=>{
      if(ind==53) return {id:ind, weight:15, color:'JOCKER',label:'JOCKER',checked:false}
      if(ind==52) return {id:ind ,weight:14, color:'Jocker',label:'Jocker',checked:false}
      return {
        id:ind, 
        weight: ind % 13 ,
        color: _category[Math.floor(ind / 13)] , 
        label : num[ ind % 13 ],
        checked:false 
      } 
    })
  }

  // 外部调用此方法
  static created(playerCount=3){
    return new Pocker(playerCount)
  }
  // 洗牌
  random(){
    const result = []
    const arr = [...this.allList]
    while(arr.length){
      result.push(arr.splice(parseInt(Math.random()*arr.length),1)[0])
    }
    this.randomedList=result
    return this.randomedList
  }
  // 发牌
  dealer(){
    const arr = [...this.randomedList]
    const playerObj = {...new Array(this.playerCount).fill().map(()=> new Array())}
    const spliceInd =  Math.floor(Math.random() * (arr.length-1))
    const floorList =  arr.splice(spliceInd,3)
    
    arr.forEach((item,ind)=>{
      playerObj[ind % this.playerCount].push(item)
    })
    this.dealedList = {playerObj,floorList}
    return this.dealedList
  }
}

module.exports = Pocker