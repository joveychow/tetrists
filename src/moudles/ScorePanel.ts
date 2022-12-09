
class ScorePanel {
    levelMax: number;
    levelStep: number;
    score: number = 0;
    level: number = 1;
    scoreEl: HTMLElement;
    levelEl: HTMLElement;
    constructor(levelMax: number = 100, levelStep: number = 100) {
        this.levelMax = levelMax;
        this.levelStep = levelStep;
        this.scoreEl = document.getElementById("score")!;
        this.levelEl = document.getElementById("level")!;
    }

    addScore(score: number) {
        this.scoreEl.innerHTML = score + '';
        console.log(score, this.levelStep, score % this.levelStep);

        this.level = Math.floor(score / this.levelStep) + 1;
        this.levelUp();
    }

    levelUp() {
        if (this.level < this.levelMax) {
            this.levelEl.innerHTML = this.level + '';
        }

    }

}

export default ScorePanel;