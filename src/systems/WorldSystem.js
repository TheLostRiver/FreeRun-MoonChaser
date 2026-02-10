import * as THREE from 'three';
import { Config } from '../data/Config.js';
import { ObjectPool } from '../core/ObjectPool.js';
import { Obstacle } from '../entities/Obstacle.js';

export class WorldSystem {
        constructor(game) {
                this.game = game;
                this.activeTracks = [];
                this.activeObstacles = [];
                this.lastSpawnZ = 0;

                // 1. 初始化资源 (材质/几何体)
                this.initMaterials();

                // 2. 初始化灯光
                this.initLights();

                // 3. 初始化对象池 (跑道 & 障碍物)
                this.initPools();

                // 4. 初始生成跑道
                for (let i = 0; i < 5; i++) {
                        this.spawnTrackSegment();
                }
        }

        initMaterials() {
                // --- 跑道材质 ---
                const groundMat = new THREE.MeshStandardMaterial({ color: Config.COLORS.ground, roughness: 1.0 });
                const railMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.4, metalness: 0.8 });
                const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.9 });

                // --- 障碍物材质 (确保这里必须有！) ---
                const trainMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.2, metalness: 0.6 });
                const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
                const barrierMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
                const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

                this.materials = {
                        ground: groundMat, rail: railMat, sleeper: sleeperMat,
                        train: trainMat, wheels: wheelMat, barrier: barrierMat, barrierLeg: legMat
                };

                // --- 几何体 ---
                this.geometries = {
                        floor: new THREE.PlaneGeometry(60, Config.TRACK_LENGTH),
                        rail: new THREE.BoxGeometry(0.2, 0.3, Config.TRACK_LENGTH),
                        sleeper: new THREE.BoxGeometry(3.2, 0.15, 0.8),

                        // 🔥 关键：确保这里定义了火车的尺寸
                        trainBody: new THREE.BoxGeometry(2.8, 4.0, 15),
                        trainWheel: new THREE.BoxGeometry(3.0, 1.0, 12),
                        barrier: new THREE.BoxGeometry(2.0, 0.8, 0.2),
                        barrierLeg: new THREE.BoxGeometry(0.1, 0.8, 0.1)
                };
        }

        initLights() {
                const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
                hemiLight.position.set(0, 50, 0);
                this.game.scene.add(hemiLight);
        }

        initPools() {
                // --- 跑道池 ---
                this.trackPool = new ObjectPool(
                        () => this.createTrackMesh(),
                        (mesh, zPos) => {
                                mesh.position.set(0, 0, 0); mesh.position.z = zPos; mesh.visible = true;
                        }
                );

                // --- 障碍物池 ---
                this.obstaclePool = new ObjectPool(
                        // 创建新对象
                        (params) => {
                                const obs = new Obstacle();
                                this.setupObstacle(obs, params);
                                return obs;
                        },
                        // 复用旧对象
                        (obs, params) => {
                                this.setupObstacle(obs, params);
                        }
                );
        }

        // 统一的障碍物设置逻辑
        setupObstacle(obs, params) {
                // 1. 设置位置
                obs.mesh.position.set(params.x, 0, params.z);

                // 2. 初始化外观 (如果材质没传进去，这里就会生成隐形物体)
                obs.init(params.type, this.geometries, this.materials);

                obs.mesh.visible = true;
        }

        createTrackMesh() {
                const seg = new THREE.Group();
                // 地面
                const floor = new THREE.Mesh(this.geometries.floor, this.materials.ground);
                floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; seg.add(floor);

                // 铁轨
                Config.LANES.forEach(x => {
                        const railOffset = 1.2;
                        [-railOffset, railOffset].forEach(offset => {
                                const r = new THREE.Mesh(this.geometries.rail, this.materials.rail);
                                r.position.set(x + offset, 0.15, 0);
                                r.castShadow = true; r.receiveShadow = true; seg.add(r);
                        });
                        for (let z = -Config.TRACK_LENGTH / 2; z < Config.TRACK_LENGTH / 2; z += 4.0) {
                                const sleeper = new THREE.Mesh(this.geometries.sleeper, this.materials.sleeper);
                                sleeper.position.set(x, 0.08, z);
                                sleeper.receiveShadow = true; seg.add(sleeper);
                        }
                });
                return seg;
        }

        spawnTrackSegment() {
                const zPos = this.lastSpawnZ;
                const seg = this.trackPool.get(zPos);

                // 强制修正位置
                seg.position.z = zPos;

                this.game.scene.add(seg);
                this.activeTracks.push(seg);

                // 撒障碍物 (跳过前 400 米)
                if (Math.abs(zPos) > Config.TRACK_LENGTH * 0.1) {
                        this.spawnObstaclesForSegment(zPos);
                }

                this.lastSpawnZ -= Config.TRACK_LENGTH;
        }

        spawnObstaclesForSegment(baseZ) {
                const count = 3 + Math.floor(Math.random() * 3);

                for (let i = 0; i < count; i++) {
                        const laneIndex = Math.floor(Math.random() * 3);
                        const x = Config.LANES[laneIndex];
                        const zOffset = Math.random() * Config.TRACK_LENGTH;
                        const z = baseZ - zOffset;

                        // 70% 路障，30% 火车
                        const type = Math.random() > 0.7 ? 'train' : 'barrier';

                        // 从池子拿对象
                        const obs = this.obstaclePool.get({ type, x, z });

                        this.game.scene.add(obs.mesh);
                        this.activeObstacles.push(obs);
                }
        }

        update(delta) {
                const playerZ = this.game.player.mesh.position.z;

                // 生成新跑道
                const lastTrack = this.activeTracks[this.activeTracks.length - 1];
                if (playerZ < lastTrack.position.z + Config.TRACK_LENGTH * 2) {
                        this.spawnTrackSegment();
                }

                // 回收跑道
                const firstTrack = this.activeTracks[0];
                if (playerZ < firstTrack.position.z - Config.TRACK_LENGTH * 2) {
                        this.game.scene.remove(firstTrack);
                        this.trackPool.release(firstTrack);
                        this.activeTracks.shift();
                }

                // 回收障碍物
                if (this.activeObstacles.length > 0) {
                        const firstObs = this.activeObstacles[0];
                        // 只要障碍物跑到玩家身后 20 米，就销毁
                        if (playerZ < firstObs.mesh.position.z - 20) {
                                this.game.scene.remove(firstObs.mesh);
                                this.obstaclePool.release(firstObs);
                                this.activeObstacles.shift();
                        }
                }
        }
}