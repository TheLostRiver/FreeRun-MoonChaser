import * as THREE from 'three';
import Events from './Events.js';
// 🔥  引入新模块
import { Config } from '../data/Config.js';
import { Player } from '../entities/Player.js';
// 🔥  引入 InputSystem
import { InputSystem } from '../systems/InputSystem.js';
// 🔥  引入 WorldSystem
import { WorldSystem } from '../systems/WorldSystem.js';

export class Game {
	static instance;

	constructor() {
		if (Game.instance) return Game.instance;
		Game.instance = this;

		this.initThree();
		this.initEvents();

		// 🔥 2. 初始化世界内容
		this.initWorld();

		this.clock = new THREE.Clock();
		this.loop();

		console.log("✅ Game Core Initialized");
	}

	initThree() {
		this.scene = new THREE.Scene();
		// 使用 Config 里的配置
		this.scene.background = new THREE.Color(Config.COLORS.skyDay);
		this.scene.fog = new THREE.Fog(Config.COLORS.skyDay, Config.FOG.near, Config.FOG.far);

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
		// 调整相机位置，方便看清主角
		this.camera.position.set(0, 3, 6);
		this.camera.rotation.x = -0.2;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding; // 开启 sRGB 渲染更鲜艳

		document.getElementById('game-container').innerHTML = '';
		document.getElementById('game-container').appendChild(this.renderer.domElement);

		// 加点光，不然主角是黑的
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		this.scene.add(ambientLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(-10, 20, 10);
		dirLight.castShadow = true;
		this.scene.add(dirLight);

		window.addEventListener('resize', () => this.onResize());
	}

	initWorld() {
		// 🔥 2. 先初始化世界，再初始化玩家
		this.worldSystem = new WorldSystem(this);
		// 🔥 3. 创建主角
		this.player = new Player(this);
	}

	initEvents() { }

	onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	update(delta) {
		// 🔥 4. 更新主角逻辑
		if (this.player) {
			this.player.update(delta);

			// 🔥 3. 相机跟随逻辑
			// 相机保持在玩家身后上方 (Z+10, Y+5)
			// 我们只跟 Z 轴 (前进) 和 X 轴 (一点点平滑跟随，增加动感)
			const targetZ = this.player.mesh.position.z + 10;
			const targetX = this.player.mesh.position.x * 0.3; // X轴稍微跟一点点

			this.camera.position.z = targetZ;
			this.camera.position.x += (targetX - this.camera.position.x) * 5 * delta; // 平滑插值

			// 🔥 4. 更新世界 (生成跑道)
			if (this.worldSystem) {
				this.worldSystem.update(delta);
			}
		}
	}

	loop() {
		requestAnimationFrame(() => this.loop());
		const delta = this.clock.getDelta();
		this.update(delta);
		this.renderer.render(this.scene, this.camera);
	}

	initEvents() {
		// 🔥 2. 启动输入系统
		this.inputSystem = new InputSystem();
	}
}
