import * as THREE from 'three';
import { Config } from '../data/Config.js';
import Events from '../core/Events.js';

export class Player {
        constructor(game) {
                this.game = game;
                this.mesh = null;

                // --- 核心状态 ---
                this.laneIndex = 1; // 0:左, 1:中, 2:右
                this.targetX = Config.LANES[1]; // 目标 X 轴位置

                // --- 物理状态 ---
                this.verticalVelocity = 0;
                this.isJumping = false;
                this.groundY = 0; // 地面高度 (目前先写死为0，以后由 WorldSystem 决定)

                this.initModel();
                this.initControls();
        }

        initModel() {

                const group = new THREE.Group();
                // 身体
                const body = new THREE.Mesh(
                        new THREE.BoxGeometry(0.6, 0.8, 0.4),
                        new THREE.MeshStandardMaterial({ color: Config.COLORS.playerBody, roughness: 0.3 })
                );
                body.position.y = 0.6; body.castShadow = true; group.add(body);
                // 头
                const head = new THREE.Mesh(
                        new THREE.SphereGeometry(0.3, 16, 16),
                        new THREE.MeshStandardMaterial({ color: Config.COLORS.playerHead, roughness: 0.1 })
                );
                head.position.y = 1.3; head.castShadow = true; group.add(head);
                // 背包
                const pack = new THREE.Mesh(
                        new THREE.BoxGeometry(0.4, 0.5, 0.2),
                        new THREE.MeshStandardMaterial({ color: Config.COLORS.backpack })
                );
                pack.position.set(0, 0.7, -0.25); group.add(pack);

                this.mesh = group;
                this.game.scene.add(this.mesh);
        }

        // 🔥 核心：监听控制指令
        initControls() {
                Events.on('INPUT_LEFT', () => this.moveLane(-1));
                Events.on('INPUT_RIGHT', () => this.moveLane(1));
                Events.on('INPUT_JUMP', () => this.jump());
        }

        // 🔥 新增：获取玩家碰撞盒 (带一点容错)
        getBoundingBox() {
                const box = new THREE.Box3().setFromObject(this.mesh);
                // 收缩一点点，避免“空气撞墙”让玩家觉得冤枉
                //box.expandByScalar(-0.2);

                // 只缩 0.1，给 Z 轴留点厚度
                box.min.x += 0.2; box.max.x -= 0.2;
                box.min.z += 0.1; box.max.z -= 0.1;

                return box;
        }

        // 🔥 新增：处理碰撞反馈
        onCrash() {
                // 以后可以在这里播放死亡动画
                this.mesh.visible = false;
        }

        moveLane(direction) {
                // 计算新车道索引 (限制在 0 ~ 2 之间)
                const newLane = this.laneIndex + direction;
                if (newLane >= 0 && newLane < Config.LANES.length) {
                        this.laneIndex = newLane;
                        this.targetX = Config.LANES[this.laneIndex];
                }
        }

        jump() {
                if (!this.isJumping) {
                        this.verticalVelocity = Config.JUMP_FORCE;
                        this.isJumping = true;
                        // TODO: 播放音效 Events.emit('PLAY_SOUND', 'jump');
                }
        }

        update(delta) {
                if (!this.mesh) return;

                // 让主角往前跑！(Z轴负方向)
                // 以后这个速度会随着时间变快，现在先读配置
                const speed = Config.PLAYER_SPEED_BASE;
                this.mesh.position.z -= speed * delta;

                // 水平移动 (使用 Lerp 插值实现平滑滑动)
                // 这里的 10 是平滑速度，越大越快
                this.mesh.position.x += (this.targetX - this.mesh.position.x) * 10 * delta;

                // 垂直移动 (重力模拟)
                this.mesh.position.y += this.verticalVelocity;

                // 核心修改：不要用严格的 > groundY
                // 只要在地面上方 0.1 米以内，都算“贴地”
                if (this.mesh.position.y > this.groundY + 0.1) {
                        // 只有真的飞得比 0.1 高，才算在空中
                        this.verticalVelocity -= Config.GRAVITY;
                } else {
                        // 吸附到地面
                        this.mesh.position.y = this.groundY;
                        this.verticalVelocity = 0;
                        this.isJumping = false;
                }

                // 简单的倾斜动画 (根据移动方向倾斜身体)
                const xDiff = this.targetX - this.mesh.position.x;
                this.mesh.rotation.z = -xDiff * 0.1; // 往左移时身体往左倾
                this.mesh.rotation.x = this.isJumping ? -0.2 : 0; // 跳跃时前倾
        }
}