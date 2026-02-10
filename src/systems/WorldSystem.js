import * as THREE from 'three';
import { Config } from '../data/Config.js';
import { ObjectPool } from '../core/ObjectPool.js';
import { Obstacle } from '../entities/Obstacle.js';
import { Collectible } from '../entities/Collectible.js';

export class WorldSystem {
        constructor(game) {
                this.game = game;
                this.activeTracks = [];
                this.activeObstacles = [];
                this.activeCoins = [];
                this.lastSpawnZ = 0;

                this.initMaterials();
                this.initLights();
                this.initPools();

                // 初始生成
                for (let i = 0; i < 5; i++) {
                        this.spawnTrackSegment();
                }
        }

        initMaterials() {
                // --- 跑道材质 ---
                const groundMat = new THREE.MeshStandardMaterial({ color: Config.COLORS.ground, roughness: 1.0 });
                const railMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.4, metalness: 0.8 });
                const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.9 });

                // --- 障碍物材质 ---
                const trainMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.2, metalness: 0.6 });
                const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
                const barrierMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
                const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

                // --- 金币材质 ---
                const coinMat = new THREE.MeshStandardMaterial({
                        color: Config.COLORS.coin,
                        roughness: 0.3,
                        metalness: 1.0,
                        emissive: 0x443300
                });

                this.materials = {
                        ground: groundMat, rail: railMat, sleeper: sleeperMat,
                        train: trainMat, wheels: wheelMat, barrier: barrierMat, barrierLeg: legMat,
                        coin: coinMat
                };

                // --- 几何体 ---
                this.geometries = {
                        floor: new THREE.PlaneGeometry(60, Config.TRACK_LENGTH),
                        rail: new THREE.BoxGeometry(0.2, 0.3, Config.TRACK_LENGTH),
                        sleeper: new THREE.BoxGeometry(3.2, 0.15, 0.8),

                        trainBody: new THREE.BoxGeometry(2.8, 4.0, 15),
                        trainWheel: new THREE.BoxGeometry(3.0, 1.0, 12),
                        barrier: new THREE.BoxGeometry(2.0, 0.8, 0.2),
                        barrierLeg: new THREE.BoxGeometry(0.1, 0.8, 0.1),

                        coin: new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16)
                };
        }

        initLights() {
                const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
                hemiLight.position.set(0, 50, 0);
                this.game.scene.add(hemiLight);
        }

        initPools() {
                // 跑道池
                this.trackPool = new ObjectPool(
                        () => this.createTrackMesh(),
                        (mesh, zPos) => {
                                mesh.position.set(0, 0, 0); mesh.position.z = zPos; mesh.visible = true;
                        }
                );

                // 障碍物池
                this.obstaclePool = new ObjectPool(
                        (params) => {
                                const obs = new Obstacle();
                                this.setupObstacle(obs, params);
                                return obs;
                        },
                        (obs, params) => {
                                this.setupObstacle(obs, params);
                        }
                );

                // 金币池
                this.coinPool = new ObjectPool(
                        (params) => {
                                const c = new Collectible();
                                this.setupCoin(c, params);
                                return c;
                        },
                        (c, params) => {
                                this.setupCoin(c, params);
                        }
                );
        }

        setupObstacle(obs, params) {
                obs.mesh.position.set(params.x, 0, params.z);
                obs.init(params.type, this.geometries, this.materials);
                obs.mesh.visible = true;
        }

        setupCoin(c, params) {
                c.mesh.position.set(params.x, 0, params.z);
                c.init(this.geometries, this.materials);
                c.mesh.visible = true;
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

                // 撒障碍物和金币
                if (Math.abs(zPos) > Config.TRACK_LENGTH * 0.5) {
                        this.spawnObstaclesForSegment(zPos);
                        this.spawnCoinsForSegment(zPos);
                }

                this.lastSpawnZ -= Config.TRACK_LENGTH;
        }

        // 生成障碍物
        spawnObstaclesForSegment(baseZ) {
                const count = 3 + Math.floor(Math.random() * 3);

                for (let i = 0; i < count; i++) {
                        const laneIndex = Math.floor(Math.random() * 3);
                        const x = Config.LANES[laneIndex];
                        const zOffset = Math.random() * Config.TRACK_LENGTH;
                        const z = baseZ - zOffset;

                        const type = Math.random() > 0.7 ? 'train' : 'barrier';

                        const obs = this.obstaclePool.get({ type, x, z });
                        this.game.scene.add(obs.mesh);
                        this.activeObstacles.push(obs);
                }
        }

        // 生成金币
        spawnCoinsForSegment(baseZ) {
                const laneIndex = Math.floor(Math.random() * 3);
                const x = Config.LANES[laneIndex];

                const startZ = baseZ - 50;

                for (let i = 0; i < 5; i++) {
                        const z = startZ - (i * 3);

                        const coin = this.coinPool.get({ x, z });
                        this.game.scene.add(coin.mesh);
                        this.activeCoins.push(coin);
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
                        if (playerZ < firstObs.mesh.position.z - 20) {
                                this.game.scene.remove(firstObs.mesh);
                                this.obstaclePool.release(firstObs);
                                this.activeObstacles.shift();
                        }
                }

                // 更新金币 & 回收金币
                for (let i = this.activeCoins.length - 1; i >= 0; i--) {
                        const coin = this.activeCoins[i];

                        // 转动
                        coin.update(delta);

                        // 回收
                        if (playerZ < coin.mesh.position.z - 10) {
                                this.returnCoin(coin);
                                this.activeCoins.splice(i, 1);
                        }
                }
        }

        returnCoin(coin) {
                coin.mesh.visible = false;
                this.game.scene.remove(coin.mesh);
                this.coinPool.release(coin);
        }
}