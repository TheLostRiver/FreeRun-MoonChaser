import * as THREE from 'three';
import { Config } from '../data/Config.js';

export class Collectible {
        constructor() {
                this.mesh = new THREE.Group();
                this.isActive = false;

                // 简单的旋转动画参数
                this.rotationSpeed = 3.0;
        }

        init(geometries, materials) {
                this.mesh.clear();

                // --- 金币模型 (简单的扁圆柱体) ---
                const coin = new THREE.Mesh(geometries.coin, materials.coin);
                coin.position.y = 1.0; // 悬浮高度
                coin.castShadow = true;

                // 稍微倾斜一点，更有质感
                coin.rotation.z = Math.PI / 2;

                this.mesh.add(coin);
                this.isActive = true;
        }

        update(delta) {
                // 自转特效
                if (this.isActive) {
                        this.mesh.rotation.y += this.rotationSpeed * delta;
                }
        }
}