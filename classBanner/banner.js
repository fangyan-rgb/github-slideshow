class Banner {

    constructor(id) {
        // 先用实例存储当前的这个元素
        this.id = document.querySelector(id);

        // 存储图片盒子
        this.imgBox = this.id.querySelector("ul");

        // 存储焦点盒子
        this.fcousBox = this.id.querySelector("ol");

        // 获取焦点元素数组
        this.fcousArr;

        // 图片数量
        this.length;

        // 时间函数
        this.timeAuto;

        // 当前视图所呈现的图片和焦点的位置
        this.index = 1;

        // 增加一个开关防止多次点击造成闪烁的情况，也可使用节流或防抖
        this.flag = false;

        // 调用初始化方法
        this.handleInit();
    }

    // 初始化调用方法
    handleInit() {
        this.handleAddElement();
        this.handleAutoPlay();
        this.handleClickFcous();
        this.handleClickLeftRight();
    }

    // 1.添加焦点和头尾元素
    handleAddElement() {
        this.length = this.imgBox.children.length;

        // 添加焦点
        for (let index = 0; index < this.length; index++) {
            let li = document.createElement("li");
            if( index === 0 ) li.className = "activy";
            li.onclick = () => {
                this.handleBoxMove(-500, index+1);
            };
            this.fcousBox.appendChild(li);
        }
        this.fcousArr = this.fcousBox.querySelectorAll('li');
        this.fcousBox.style.width = this.length * 20 + "px";
        
        // 添加头尾元素
        const first = this.imgBox.firstElementChild.cloneNode(true);
        const last = this.imgBox.lastElementChild.cloneNode(true);

        this.imgBox.appendChild(first);
        this.imgBox.insertBefore(last, this.imgBox.children[0]);

        this.imgBox.style.width = 500 * (this.length + 2) + "px";
        this.imgBox.style.left = -500 + "px";
    }

    // 2.开始自动轮播
    handleAutoPlay() {
        this.timeAuto = setInterval(()=>{
            this.handleBoxMove(-500, this.index+1);
        }, 1000);
    }

    // 轮播一次时的处理
    handleBoxMove(distance, index) {
        if( this.flag ) return
        this.flag = true;

        this.index = index;
        distance = distance * index;
        let auto = setInterval(() => {
            let current = parseInt(getComputedStyle(this.imgBox)['left']);
            let move = (distance - current)/5;
            move = move > 0 ? Math.ceil(move) : Math.floor(move);
            this.imgBox.style.left = current + move + "px";
            if( distance === current ) {
                clearInterval(auto); 
                // 判断是否是最后一张
                if(this.index === this.length+1 ) {
                    this.index = 1;
                    this.imgBox.style.left = "-500px";
                }
                // 判断是否是第一张
                if(this.index === 0 ) {
                    this.index = this.length;
                    this.imgBox.style.left = -500*this.length+"px";
                }
                this.fcousArr.forEach(element => element.className = "");
                this.fcousArr[this.index-1].className = "activy";

                this.flag = false;
            }
        }, 30);
    }

    // 3.鼠标移入移出时
    handleClickFcous() {
        this.id.onmouseover = () => { clearInterval(this.timeAuto); };
        this.id.onmouseout = () => { this.handleAutoPlay() };
    }

    // 4.点击左右按钮切换
    handleClickLeftRight() {
        let left = this.id.querySelector(".left");
        let right = this.id.querySelector(".right");
        left.onclick = () => {
            this.handleBoxMove(-500, this.index-1);
        };
        right.onclick = () => {
            this.handleBoxMove(-500, this.index+1);
        };
    }
}