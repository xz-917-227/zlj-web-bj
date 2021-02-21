// 这里是公共的Js文件

// 命名空间
var BH={};
  
// 3.鸭式辩型法 (最完美的JavaScript实现接口的方法)
    //鸭式辩型法核心: 一个类实现接口的主要目的:把接口里的方法都实现(检测方法)
    //  优点：完全面向对象 代码也统一了 也解耦了 等...

    // 步骤
    // 一. 定义一个接口类Interface ==> 去实例化N多个接口
    // 接口类需要两个参数吗？
    // 参数1：接口的名称
    //参数2：接受接口所有方法名称的集合(数组 Array)
   BH.Interface=function(name,methods){
    //判断接口的参数个数(判断是不是传进来两个参数，不能多，也不能少) 否则就抛出异常
           if(arguments.length !=2){ //arguments对象 获得函数的实际参数
             throw new Error('this interface interface constructor arguments must be 2 lenght!');
         }
         this.name=name;
         this.methods=[]; //定义一个内置的空函数对象，等待接收methods里的元素(方法名称)
         for(var i=0,len=methods.length;i<len;i++){
              if(typeof methods[i] !== 'string'){  //方法名称必须是字符串
                    throw new Error('the Interface menthod name is error');
              }
              this.methods.push(methods[i]);
         }
    }


      // 三. 检测接口的方法
    // 如果通过不做任何操作 不通过 抛出异常
    // 定义一个ensureImplements 方法：检测接口的方法是否都实现了
    BH.Interface.ensureImplements=function(object){
        // 如果检测方法接收的参数小于 2  参数传递失败  传递的参数是接口的实例对象
        if(arguments.length<2){ //因为必须要有的参数有 至少一个接口
            throw new Error('Interface.ensureImplements methods constructor argumrnts must be > 2 !');
        }
        // 获取接口的实例对象
        for(var i=1,len=arguments.length;i<len;i++){
           var instanceInterface=arguments[i];
          //    判断拿到的参数 是不是接口类 的类型
            if(instanceInterface.constructor !== BH.Interface){
                throw new Error('the arguments construcotr not be Interface Class!');
           }
        //    循环接口实例化的每一个方法
            for(var j=0;j<instanceInterface.methods.length;j++){
               // 用一个临时变量接受每一个方法的名称 （注意是字符串）
                var methodName=instanceInterface.methods[j];
               //object[menthodName] 就是方法 判断方法是否存在 如果它不存在 或者存在但不是一个方法来的 就抛出异常
               if(!object[methodName] || typeof object[methodName] !=='function'){
                   throw new Error('the method name '+ methodName +' is not found');
               }
            }
        }
    }

    //  继承方法
     //    参数：子类，父类
     BH.extend=function (sub,sup){
        //  目的：  实现只继承父类的原型对象
        // 1.创建一个空函数 进行中转
        var F=new Function();
        F.prototype=sup.prototype;  //2.实现空函数的原型对象和父类的原型行对象进行装换
        sub.prototype=new F();  //3.原型继承(这是sub的构造器是F)(实现了sub只继承了sup的原型) 
        sub.prototype.constructor=sub;//4.还原构造器
        // 保存一下父类的原型对象：一方面方便解耦，另一方面方便获得父类的原型对象
        sub.superClass=sup.prototype;//自定义一个子类的静态属性
        //判断父类的原型对象的构造器(加保险)
        if(sup.prototype.constructor == Object.prototype.constructor){
            sup.prototype.constructor=sup;
        }
    }


// 单体模式
// 实现一个跨浏览器的事件处理程序    这就是一个经典的门面模式
    BH.EventUtil={
    // 写一个可以给元素添加事件的方法 参数：要加事件的元素，添加的事件，要绑定该元素的函数
        addHandler:function(element , type, handler){  //注册事件方法
            if(element.addEventListener){  //如果有这个方法就是FF火狐浏览器
               element.addEventListener(type,handler,false);  //加false表示是冒泡事件
            }else if(element.attachEvent){  //如果有这个方法就是IE浏览器
               element.attachEvent('on'+type,handler);//因为IE浏览器事件一般以on为前缀
            }
        },
        removeHandler:function(element , type, handler){  //取消事件方法
            if(element.removeEventListener){  //如果有这个方法就是FF火狐浏览器
                element.removeEventListener(type,handler,false);  //加false表示是冒泡事件
             }else if(element.detachEvent){  //如果有这个方法就是IE浏览器
                element.detachEvent('on'+type,handler);//因为IE浏览器事件一般以on为前缀
             }
        },
    };


    // 扩展Array的原型对象 添加变量数组的每一个元素，并让每一元素都执行fn函数(可遍历多维数组)
    // 通过原型对象添加each方法，自己写代码实现效果
    Array.prototype.each=function(fn){
        try{
       // 1.目的:遍历数组的每一项    //计数器  记录当前遍历的元素位置
           this.i || (this.i=0);  //(i如果不存在就赋值0)这样写防止这个变量出现重复(更严谨)
            //2.严谨的判断什么时候去走each核心方法 
            // 当数组的长度大于0的时候  && 传递的参数必须为函数
            if(this.length>0 && fn.constructor==Function){
                //   循环遍历数组的每一项  (最好不要用 for in 来循环)
                while(this.i<this.length){   //while循环的范围
                //    获取数组的每一项
                var e=this[this.i];
                // 如果当前元素获取到了  并且当前元素是一个数组(多维数组)
                if(e && e.constructor==Array){
                    //直接做递归操作
                    e.each(fn);//直到当前元素不是数组时为止
                }else{
                    // 如果不是数组 那就是单个元素
                    // 这儿的目的就是为了把数组的当前元素传递给fn函数  并让函数执行一下
                    fn.apply(e,[e]);   //fn.call(e,e);
                }

                   
                   this.i++;
                }
                this.i=null;   //释放内存  垃圾回收机制回收变量
            }


        }catch(ex){
            //do something
        }
       return this;//this指向调用者arr,,,所以直接返回arr
    }
