import * as THREE from 'three';
import Events from './Events.js';
import { Config } from '../data/Config.js';
import { Player } from '../entities/Player.js';
import { InputSystem } from '../systems/InputSystem.js';
import { WorldSystem } from '../systems/WorldSystem.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { UIManager } from '../ui/UIManager.js';
import { AudioSystem } from '../systems/AudioSystem.js';


export class Game {
	static instance;

	constructor() {
		if (Game.instance) return Game.instance;
		Game.instance = this;

		// --- 游戏状态数据 ---
		this.score = 0;
		this.coins = 0;
		// 🔥 2. 新增状态标记
		this.isGameActive = false; // 游戏是否进行中
		this.isGameOver = false;
		// --------------------

		this.initThree();
		this.initEvents();

		// 初始化世界内容
		this.initWorld();

		// 初始化音频 (但不立即启动，等待用户点击)
		this.audioSystem = new AudioSystem();
		// 初始化 UI
		this.uiManager = new UIManager();

		// 监听开始信号
		this.setupStartListener();

		this.clock = new THREE.Clock();
		this.loop();

		console.log("✅ Game Core Initialized");
	}

	setupStartListener() {
		const startHandler = () => {
			if (this.isGameActive) return;

			// 第一次交互，启动音频引擎
			this.audioSystem.init();

			// 隐藏开始界面
			const startScreen = document.getElementById('start-screen');
			if (startScreen) startScreen.style.display = 'none';

			// 激活游戏
			this.isGameActive = true;
			this.isGameOver = false;
			console.log("🚀 Game Started!");

			// 移除监听，防止重复触发
			window.removeEventListener('keydown', startHandler);
			window.removeEventListener('click', startHandler);
		};

		window.addEventListener('keydown', startHandler);
		window.addEventListener('click', startHandler);
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
		// 先初始化世界，再初始化玩家
		this.worldSystem = new WorldSystem(this);

		// 创建主角
		this.player = new Player(this);

		// 初始化物理系统
		this.physicsSystem = new PhysicsSystem(this);

		this.isGameOver = false; // 游戏状态标记

		// 监听物理系统的金币事件 (稍后在 PhysicsSystem 发送)
		Events.on('COIN_COLLECTED', () => {
			this.coins += 1; // 以后可以是 +10
			Events.emit('COIN_UPDATE', this.coins);
		});

		// 监听死亡事件
		Events.on('GAME_OVER_UI', () => {
			this.isGameOver = true;
			this.isGameActive = false; // 停止跑动
			// 把最终数据传给 UI
			Events.emit('GAME_OVER', { score: this.score, coins: this.coins });
		});
	}

	initEvents() { }

	onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	update(delta) {
		// 只有游戏激活时才更新逻辑
		if (!this.isGameActive) return;

		// 更新主角逻辑
		if (this.player) {
			this.player.update(delta);

			// 实时计算分数 (基于跑动距离)
			// 玩家初始 Z 是 0，越跑越负。距离 = abs(z)
			this.score = Math.abs(this.player.mesh.position.z);

			// 通知 UI 更新 (每帧通知虽然频繁，但对于这种简单 DOM 操作没问题)
			Events.emit('SCORE_UPDATE', this.score);

			// 相机跟随逻辑
			// 相机保持在玩家身后上方 (Z+10, Y+5)
			// 我们只跟 Z 轴 (前进) 和 X 轴 (一点点平滑跟随，增加动感)
			const targetZ = this.player.mesh.position.z + 10;
			const targetX = this.player.mesh.position.x * 0.3; // X轴稍微跟一点点

			this.camera.position.z = targetZ;
			this.camera.position.x += (targetX - this.camera.position.x) * 5 * delta; // 平滑插值

			// 更新世界 (生成跑道)
			if (this.worldSystem) {
				this.worldSystem.update(delta);
			}

			// 每帧进行物理检测
			if (this.physicsSystem) {
				this.physicsSystem.update(delta);
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
		// 启动输入系统
		this.inputSystem = new InputSystem();
	}
}
