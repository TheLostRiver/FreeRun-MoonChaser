import * as THREE from 'three';
import { Config } from '../data/Config.js';

export class Obstacle {
        constructor() {
                this.mesh = new THREE.Group();
                this.type = 'barrier'; // 'barrier' | 'train'
                this.collider = new THREE.Box3(); // 碰撞盒
                this.isActive = false;
        }

        // 初始化视觉 (传入共享的材质和几何体，优化性能)
        init(type, geometries, materials) {
                this.type = type;
                this.mesh.clear(); // 清空旧内容

                if (type === 'train') {
                        // --- 火车模型 ---
                        const body = new THREE.Mesh(geometries.trainBody, materials.train);
                        body.position.y = 2.0; // 车身高度
                        body.castShadow = true;
                        this.mesh.add(body);

                        // 车轮 (简单加两个黑色方块代表)
                        const wheel = new THREE.Mesh(geometries.trainWheel, materials.wheels);
                        wheel.position.y = 0.5;
                        this.mesh.add(wheel);

                        // 标记为“重型”障碍物 (不可撞碎)
                        this.mesh.userData.isHeavy = true;
                        this.mesh.userData.isHigh = true; // 可钻过 (虽然火车其实钻不过，这里复用逻辑)

                } else {
                        // --- 路障模型 ---
                        const bar = new THREE.Mesh(geometries.barrier, materials.barrier);
                        bar.position.y = 0.5;
                        bar.castShadow = true;
                        this.mesh.add(bar);

                        // 支架
                        const leg1 = new THREE.Mesh(geometries.barrierLeg, materials.barrierLeg);
                        leg1.position.set(-0.8, 0.4, 0);
                        this.mesh.add(leg1);
                        const leg2 = new THREE.Mesh(geometries.barrierLeg, materials.barrierLeg);
                        leg2.position.set(0.8, 0.4, 0);
                        this.mesh.add(leg2);

                        this.mesh.userData.isHeavy = false; // 可撞碎
                        this.mesh.userData.isHigh = false; // 必须跳过
                }

                this.isActive = true;
        }

        update(delta) {
                // 如果是火车，以后可以让它动起来
                // 目前先做静止的
        }
}