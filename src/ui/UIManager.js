import Events from '../core/Events.js';

export class UIManager {
        constructor() {
                // 获取 DOM 元素
                this.scoreEl = document.getElementById('score-val');
                this.coinEl = document.getElementById('coin-val');

                this.gameOverScreen = document.getElementById('game-over-screen');
                this.finalScoreEl = document.getElementById('final-score');
                this.finalCoinsEl = document.getElementById('final-coins');
                this.restartBtn = document.getElementById('restart-btn');

                // 绑定按钮事件
                this.restartBtn.addEventListener('click', () => {
                        // 简单粗暴：刷新页面重开
                        // (在复杂项目中这里应该调用 Game.reset())
                        window.location.reload();
                });

                // 监听游戏事件
                this.initListeners();
        }

        initListeners() {
                // 1. 更新分数 (每帧都会触发)
                Events.on('SCORE_UPDATE', (score) => {
                        this.scoreEl.innerText = Math.floor(score);
                });

                // 2. 更新金币
                Events.on('COIN_UPDATE', (coins) => {
                        this.coinEl.innerText = coins;
                });

                // 3. 游戏结束
                Events.on('GAME_OVER_UI', (data) => {
                        this.showGameOver(data.score, data.coins);
                });
        }

        showGameOver(score, coins) {
                this.finalScoreEl.innerText = Math.floor(score);
                this.finalCoinsEl.innerText = coins;
                this.gameOverScreen.style.display = 'block';
        }
}