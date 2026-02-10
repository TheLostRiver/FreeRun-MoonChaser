import * as THREE from 'three';
import Events from '../core/Events.js';

export class PhysicsSystem {
        constructor(game) {
                this.game = game;
                this.tempBox = new THREE.Box3(); // 复用对象，减少GC
        }

        update(delta) {
                const player = this.game.player;
                const obstacles = this.game.worldSystem.activeObstacles;

                // 获取玩家包围盒
                const playerBox = player.getBoundingBox();
                const playerBottomY = player.mesh.position.y;

                for (const obs of obstacles) {
                        // 获取障碍物包围盒
                        this.tempBox.setFromObject(obs.mesh);

                        // 1. 简单的 AABB 碰撞检测 (轴对齐包围盒)
                        if (playerBox.intersectsBox(this.tempBox)) {

                                // 💥 发生了碰撞！接下来判断是“死”还是“活”

                                // A. 火车跑酷逻辑
                                if (obs.mesh.userData.isHeavy) { // 如果是火车
                                        const trainTopY = 4.0;
                                        const tolerance = 2.5; // 容错高度

                                        // 如果玩家脚底比火车腰部还高，说明是跳上去的
                                        if (playerBottomY > tolerance) {
                                                // 且正在下落，修正位置到车顶
                                                if (player.verticalVelocity <= 0) {
                                                        player.mesh.position.y = trainTopY;
                                                        player.verticalVelocity = 0;
                                                        player.isJumping = false;
                                                        player.groundY = trainTopY; // 🔥 临时把地面抬高
                                                }
                                                // 如果是在上升(verticalVelocity > 0)，就让他飞，不算撞
                                                continue;
                                        }
                                }

                                // B. 死亡判定
                                // 如果没触发上面的“车顶幸存逻辑”，那就是真撞了
                                this.handleCollision();
                                return; // 撞一个就死，不用看后面的了
                        }
                }

                // 金币检测 (新增)
                const coins = this.game.worldSystem.activeCoins;

                // 倒序遍历，因为我们可能会删除元素
                for (let i = coins.length - 1; i >= 0; i--) {
                        const coin = coins[i];

                        // 简单的距离检测 (比 Box3 更快，适合金币这种小东西)
                        // 玩家 X 和 金币 X 距离小于 1，且 Z 轴距离小于 1
                        const dx = Math.abs(player.mesh.position.x - coin.mesh.position.x);
                        const dz = Math.abs(player.mesh.position.z - coin.mesh.position.z);

                        if (dx < 1.0 && dz < 1.0) {

                                // 发射事件 💰 吃到金币了！
                                Events.emit('COIN_COLLECTED');
                                // 💰 吃到金币了！
                                console.log("DING! Coin Collected!");

                                // 1. 播放音效 (以后做)
                                // Events.emit('PLAY_SOUND', 'coin');

                                // 2. 加分 (以后做)
                                // Events.emit('ADD_SCORE', 10);

                                // 3. 销毁金币
                                this.game.worldSystem.returnCoin(coin);
                                coins.splice(i, 1); // 从活跃列表移除
                        }
                }

                // C. 落地重置
                // 如果玩家离开了火车顶（比如跑过了火车），要掉回地面
                // 简单的判定：如果没有在任何障碍物上方，且 groundY 是车顶高度
                if (player.groundY > 0 && !player.isJumping) {
                        // 这里为了简化，我们暂时让它下一帧自动受重力影响掉下去
                        // 只要重置地面高度为 0
                        player.groundY = 0;
                }
        }

        handleCollision() {
                console.log("💥 CRASH!");
                this.game.player.onCrash(); // 玩家消失
                Events.emit('GAME_OVER');   // 广播游戏结束事件
        }

}