import * as THREE from 'three';
import { Config } from '../data/Config.js';
import { ObjectPool } from '../core/ObjectPool.js';

export class WorldSystem {
        constructor(game) {
                this.game = game;
                this.activeTracks = [];

                // 🔥 1. 确保游标从 0 开始
                this.lastSpawnZ = 0;

                this.initMaterials();
                this.initLights();

                this.trackPool = new ObjectPool(
                        () => this.createTrackMesh(),
                        (mesh, zPos) => {
                                mesh.position.set(0, 0, 0);
                                mesh.position.z = zPos;
                                mesh.visible = true;
                        }
                );

                // 初始生成
                for (let i = 0; i < 5; i++) {
                        this.spawnTrackSegment();
                }
        }

        initMaterials() {
                this.materials = {
                        ground: new THREE.MeshStandardMaterial({
                                color: Config.COLORS.ground, roughness: 1.0, metalness: 0.0
                        }),
                        rail: new THREE.MeshStandardMaterial({
                                color: 0x999999, roughness: 0.4, metalness: 0.8
                        }),
                        sleeper: new THREE.MeshStandardMaterial({
                                color: 0x4e342e, roughness: 0.9, metalness: 0.0
                        })
                };

                this.geometries = {
                        floor: new THREE.PlaneGeometry(60, Config.TRACK_LENGTH),
                        rail: new THREE.BoxGeometry(0.2, 0.3, Config.TRACK_LENGTH),
                        sleeper: new THREE.BoxGeometry(3.2, 0.15, 0.8)
                };
        }

        initLights() {
                const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
                hemiLight.position.set(0, 50, 0);
                this.game.scene.add(hemiLight);
        }

        createTrackMesh() {
                // ... (这部分代码保持不变，省略以节省篇幅) ...
                const seg = new THREE.Group();
                const floor = new THREE.Mesh(this.geometries.floor, this.materials.ground);
                floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; seg.add(floor);

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

                // 从池子获取对象
                const seg = this.trackPool.get(zPos);

                // 🔥🔥🔥 核心修复：强制设置位置 🔥🔥🔥
                // 无论对象是刚 new 出来的，还是池子里复用的，都必须显式设置 Z 轴
                seg.position.z = zPos;

                this.game.scene.add(seg);
                this.activeTracks.push(seg);

                // 游标后移
                this.lastSpawnZ -= Config.TRACK_LENGTH;
        }

        update(delta) {
                const playerZ = this.game.player.mesh.position.z;

                // 生成新跑道
                const lastTrack = this.activeTracks[this.activeTracks.length - 1];
                // 这里必须用 lastTrack.position.z 来判断距离，而不是 lastSpawnZ
                if (playerZ < lastTrack.position.z + Config.TRACK_LENGTH * 2) {
                        this.spawnTrackSegment();
                }

                // 销毁旧跑道
                const firstTrack = this.activeTracks[0];
                if (playerZ < firstTrack.position.z - Config.TRACK_LENGTH * 2) {
                        this.game.scene.remove(firstTrack);
                        this.trackPool.release(firstTrack);
                        this.activeTracks.shift();
                }
        }
}