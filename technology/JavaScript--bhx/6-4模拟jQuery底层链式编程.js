// 把这个文件当做js文件，要连接到其他文件中，就要有一个出口 和入口
    
        (function(window , undefined){  
            //  $ 最常用的对象 返回给外界(出口)  大型程序开发 一般使用'_'作为私用的对象 （规范）
            function _$(arguments){
                // 实现代码...
                //最简单的正则表达式   匹配id选择器
                var idselector = /#\w+/ ;//如果传进来的选择器跟这个id表达式匹配就证明是 id选择器  
               this.dom;  //此属性 接受所得到的的元素 (dom指文档对象)
            //    如果匹配成功 则接收 dom元素   arguments[0]='#inp'
                if(idselector.test(arguments[0])){
                    this.dom=document.getElementById(arguments[0].substring(1)); //这样就接收到了dom对象
                }else{
                    throw new Error('arguments is error!');
                }
            }
             
            // _$就是一个构造函数 一个类 ，在类里面添加一个method方法，就可以调用method方法
            // 在Function类上扩展一个可以实现链式编程的方法
            Function.prototype.method=function(methodName , fn){
                // this指向调用者 _$
                 this.prototype[methodName]=fn;
                 return this;//链式编程的关键
            }
    
            // 在_$的原型上天街一些公共的方法
            _$.prototype={
                  constuctor:_$,
                  addEvent:function(type,fn){
                    //   判断是什么浏览器
                //    给得到的元素 注册事件
                    if(window.addEventListener){   // FF  火狐 
                           this.dom.addEventListener(type , fn);
                    }else if(window.attachEvent){   // IE浏览器
                           this.dom.attachEvent('on'+type , fn);
                    }


                    //    alert('addEvent');
                       return this;
                  },
                  setStyle:function(prop,val){
                      this.dom.style[prop]=val;

                    // alert('setStyle');
                    return this;
                    },
            };
    
            // window 上先注册一个全局变量  与外界产生关系
            window.$=_$;
    
            // 写一个准备的方法(在内置对象里添加一个方法)
            _$.onReady=function(fn){
                // 1.实例化出来 _$对象 真正的注册到window上
                window.$=function(){
                    return new _$(arguments);  //有一个返回值赋给$ $变成一个真正的对象了
                    };
    
                    //2.执行传入进来的代码
                      fn();  
                   
                    //   3.实现链式编程  (组合代码)
     // _$就是一个构造函数 一个类 ，在类里面添加一个method方法，就可以调用method方法   //所以这里就可以调用method方法
                    _$.method('addEvent',function(){
                            //  nothing to do
                    }).method('setStyle',function(){
                           //  nothing to do
                    });  
    
            };
    
        })(window);   //程序的入口 window传入作用域中 (外部传入一个window，最后再返回一个外部能用的对象)
            