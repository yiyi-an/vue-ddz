import Vue from 'vue';
import main from './main.vue';
let MessageConstructor = Vue.extend(main);

let instance;
let instances = [];
let count = 0
const Barrage = function(options){
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }

  instance = new MessageConstructor({
    data: options
  });

  
  let verticalOffset =(count % 4) * 24 + 5;
  instance.verticalOffset = verticalOffset;
  instance.visible = true;
  instances.push(instance);
  count ++

  //监听组件的remove方法
  instance.remove = removeBarrage
  
  // instance.$mount("body"); //这样会把body整个干掉,所以用下面方式挂载
  instance.$mount();
  document.body.appendChild(instance.$el);
}

const removeBarrage = function(ins){
  const ind = instances.indexOf(ins)
  instances.splice(ind,1)
}


export default {
  install(Vue){
    Vue.prototype.$barrage = Barrage
  }
}