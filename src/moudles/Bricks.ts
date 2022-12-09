// Load the core build.
let _ = require('lodash');
import GlobalData from "../GlobalData";
import ScorePanel from "./ScorePanel";

class Bricks {
    scorePanel: ScorePanel;
    // 定义16宫格的模型源
    MODELS = GlobalData.MODELS;
    // 分割容器
    // 18行 ， 10列
    ROW_COUNT: number = GlobalData.ROW_COUNT;
    COL_COUNT: number = GlobalData.COL_COUNT;
    STEP: number = GlobalData.STEP;

    currentX: number = 0;
    currentY: number = 0;
    currentModelIdex: number = 0;//当前的模型序号
    currentShape: number = 0;//当前模型的旋转方向序号
    // 当前的模型源数据
    currentModel: number[][] = [];
    // 保存所有已经被固定的模块
    // K=行数_列数 : V=元素
    fixedBlocks = {};
    colorIndex: number = 0;

    constructor(x: number, y: number, step: number) {
        this.currentX = x;
        this.currentY = y;
        this.STEP = GlobalData.STEP = step;
        this.scorePanel = new ScorePanel();
        this.createModel();
    }

    resetData() {
        this.currentX = _.random(0, 10);
        this.currentY = 0;
        this.currentModelIdex = 0;
        this.currentShape = 0;
    }
    // 生成对应模型
    createModel() {
        if (!GlobalData.ISLIVE) {
            return;
        }

        this.resetData();
        // 当前的模型数据源
        this.currentModelIdex = _.random(0, this.MODELS.length - 1);
        this.currentModel = this.MODELS[this.currentModelIdex][this.currentShape];
        this.colorIndex = _.random(1, 7);

        // 根据当前的数据源来创建对应数量的块元素
        for (let key in this.currentModel) {
            let divEle = document.createElement("div");
            divEle.className = "active_brick";
            divEle.classList.add("color" + this.colorIndex);
            let container = document.getElementById("stage") as HTMLElement;
            container.appendChild(divEle);
        }
        /*
                const createOkEvent=new Event("CREAT_OK",{
                    "bubbles":true,
                    "cancelable":false,
                    "composed":false
                })
                this.dispatchEvent(createOkEvent);
                */
        this.locationBlocks();
    }

    // 定位每个模型的位置
    locationBlocks() {
        // 判断模块是否越界了
        this.checkBound();

        let eles = document.getElementsByClassName("active_brick");
        // 首先拿到对应的块元素
        //console.log(typeof this.currentModel);
        for (let i = 0; i < eles.length; i++) {
            let blockEle = eles[i] as HTMLElement;
            // 有当前块元素对应的数据源

            let blockModel = this.currentModel[i];

            // 依据16宫格的原理，来定位块元素
            blockEle.style.top = (this.currentY + blockModel[1]) * this.STEP + "px";
            blockEle.style.left = (this.currentX + blockModel[0]) * this.STEP + "px";
        }
    }

    // 模型的旋转
    rotate() {
        // 当模块进行旋转时，需要判断将要旋转到的位置是否可以进行旋转
        let tempModel = this.MODELS[this.currentModelIdex][this.currentShape < 3 ? this.currentShape + 1 : 0];//假设目标方块

        // 判断目标方块是否跟固定方块碰撞
        if (this.isMeet(this.currentX, this.currentY, tempModel)) {
            return;
        }

        //旋转后数据
        if (this.currentShape < 3) {
            this.currentShape++
        } else {
            this.currentShape = 0;
        }

        //更新方块数据
        this.currentModel = this.MODELS[this.currentModelIdex][this.currentShape];
        //console.log(this.currentModelIdex, this.currentShape);

        //更新方块布局形状
        this.locationBlocks();
    }

    // 移动模型
    // x 表示在 X 轴移动的步数
    // y 表示在 y 轴移动的步数
    move(x: number, y: number) {
        // 当模块进行移动式，需要判断将要移动到的位置是否可以移动
        if (this.isMeet(this.currentX + x, this.currentY + y, this.currentModel)) {
            // 将要移动到的位置会发生碰撞
            // 如果碰撞是来自于底部的碰撞，则将方块固定在底部，否则停止当前移动
            if (y !== 0) {
                this.fixedBottomModel();
            }
            return;
        }

        // 表示 16 宫格移动之后的距离
        this.currentX += x;
        this.currentY += y;
        // 带动模型移动
        this.locationBlocks();
    }

    // 控制模型只能在容器中移动
    checkBound() {
        // 定义容器边界
        let leftBound = 0,
            rightBound = this.COL_COUNT,
            bottomBound = this.ROW_COUNT;
        // 当每次模型移动了之后，我们来判断模型是否超出了边界
        for (let key in this.currentModel) {
            let blcokModel = this.currentModel[key];
            // 左侧越界
            if ((blcokModel[0] + this.currentX) < leftBound) {
                this.currentX++;
            }
            // 右侧越界
            if ((this.currentX + blcokModel[0]) >= rightBound) {
                this.currentX--;
            }
            // 底部越界
            if ((this.currentY + blcokModel[1]) >= bottomBound) {
                this.currentY--;
                this.fixedBottomModel();
            }
        }
    }

    // 处理模块之间的碰撞
    // x，y：是16宫格将要移动到的位置
    isMeet(x: number, y: number, model: { [key: string]: any }) {
        // 判断当前活动的模型和固定的模型坐标是否重叠了
        // 判断被固定的数据源中是否可以根据当前活动的块元素位置得到对应的元素
        // 遍历当前模型，将块进行依次的对比
        for (let key in model) {

            let blcokModel = model[key];
            // 判断当前块元素所在的位置上是否已经有了其他的块元素了
            if (this.fixedBlocks[(y + blcokModel[1]) + "_" + (x + blcokModel[0])]) {
                return true;
            }
        }
        return false;
    }

    // 让方块固定在底部
    fixedBottomModel() {
        // 1、当模块与底部进行接触的时候，执行该方法
        // 2、修改模型的样式，变为灰白色，改变模型类名
        // 3、不再允许模型移动了

        let eles = document.getElementsByClassName("active_brick");
        for (let i = eles.length - 1; i >= 0; i--) {
            let activityModelEle = eles[i];
            activityModelEle.classList.remove("active_brick")
            activityModelEle.classList.add("fixed_brick");

            // 把该模型添加到数据源中
            let blockModel = this.currentModel[i];
            // X: 16宫格所在的 X坐标位置+ 快元素在16宫格中的列数
            // Y：16宫格所在的 Y坐标位置 + 块元素在16宫格中的一个行数
            this.fixedBlocks[(this.currentY + blockModel[1]) + "_" + (this.currentX + blockModel[0])] = activityModelEle;
        }

        // 判断一行是否被铺满了
        this.isRemoveLine();

        // 创建新的模型
        this.createModel();

        //方块落底后，分数按单次消除行数，增加分数
        this.setScore(GlobalData.LINES_ONCE * 2 * 10);
        //console.log(GlobalData.LINES_ONCE);

    }

    // 判断一行是否被铺满
    isRemoveLine() {
        GlobalData.LINES_ONCE = 0;
        // 如果一行中每一列都存在块元素，那么就表示该行已经被铺满了
        // 遍历所有行
        for (let i = 0; i < this.ROW_COUNT; i++) {
            // 计数器,记录每一行存在的块元素的数量
            let count = 0;
            // 遍历所有列
            for (let j = 0; j < this.COL_COUNT; j++) {
                //  判断改行该列是否存在块元素
                if (this.fixedBlocks[i + "_" + j]) {
                    count++;
                }
            }
            // 如果每一行中存在的块元素数量 === 列数，表示一行中每一列都存在块元素
            if (count === this.COL_COUNT) {
                GlobalData.LINES_TOTAL++;
                GlobalData.LINES_ONCE++;
                // 删除该行
                this.removeLine(i);
            }
        }
    }
    //加分
    setScore(score: number) {
        GlobalData.SCORE += score;
        this.scorePanel.addScore(GlobalData.SCORE);
    }


    // 删除指定行
    removeLine(line: number) {
        // 拿到当前行所有的块元素
        for (let i = 0; i < this.COL_COUNT; i++) {
            // 1、从容器中删除元素
            let container = document.getElementById("stage")!;
            container.removeChild(this.fixedBlocks[line + "_" + i]);
            // 2、从数据源中删除元素
            this.fixedBlocks[line + "_" + i] = null;
        }
        this.downLine(line);
    }

    // 让指定行之上的块元素下落
    downLine(line: number) {

        // 让指定行之上的所有行中的每一列的块元素，向下移动 1 个步长
        // 遍历指定行之上的所有行
        for (let i = (line - 1); i >= 0; i--) {
            // 这些行中每一列元素
            for (let j = 0; j < this.COL_COUNT; j++) {
                // 如果当前列没有数据进入下一次循环
                if (!this.fixedBlocks[i + "_" + j]) continue;
                // 如果当前行的当前列存在块元素的话
                // 1、平移数据，把当前行的数据给下一行
                this.fixedBlocks[(i + 1) + "_" + j] = this.fixedBlocks[i + "_" + j];
                // 2、平移元素，让当前行的元素到下一行
                this.fixedBlocks[(i + 1) + "_" + j].style.top = (i + 1) * this.STEP + "px";
                // 3、清理掉平移之前的数据
                this.fixedBlocks[i + "_" + j] = null;
            }
        }
    }


}
export default Bricks;