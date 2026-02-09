# 🏃 Free Run: Moon Chaser (v2.3)
### 自由奔跑：逐月者 —— 次世代 Web 3D 无尽跑酷

> **"在异星的苍穹下飞奔，在悬浮的土星环映照中起舞。突破重力，追逐月光。"**
> **"Dash beneath alien skies, dance in the glow of Saturn's rings. Defy gravity, chase the moon."**

---

### 🎮 游戏简介 (Introduction)

**Free Run: Moon Chaser** 是一款基于 **Three.js (WebGL)** 构建的高性能 3D 无尽跑酷游戏。

本作在 v2.0 版本中迎来了**画质与系统的全面革新**！体验从清晨到日落的动态光影变化，仰望巨大的科幻星球与蓬松的云层。利用全新的物理碰撞系统在列车顶端飞跃，并通过专业的音频控制台调节你的游戏体验。无需下载，打开浏览器即可进入这个霓虹闪烁的低多边形世界。

**Free Run: Moon Chaser** is a high-performance 3D endless runner built with Three.js. The v2.0 update brings **massive visual and systemic overhauls**! Experience dynamic lighting, gaze upon massive sci-fi planets, and surf atop speeding trains. No download required—play instantly in your browser!

### [ ▶️ START GAME / 开始游戏 ](https://moon.bolobolo.online/)

---

### ✨ 核心特色 (Key Features)

#### 1. 🎨 极致视觉体验 (Visual Overhaul)
* **PBR 材质渲染**：全新的哑光马卡龙配色 (Macaron Low-Poly)，配合金属质感的轨道与枕木，画面质感大幅提升。
* **沉浸式天穹**：引入半球光 (Hemisphere Light) 与方向光，模拟真实的大气散射。抬头可见巨大的**带环行星 (Ringed Planet)** 与**悬浮卫星**，配合蓬松的**体积感云团**，营造浓厚的科幻氛围。
* **动态昼夜循环**：从湛蓝的正午到紫红的黄昏，夜晚降临时，城市建筑的窗户会自动亮起暖光 (Self-Illumination)，仿佛城市有了呼吸。

#### 2. 🚆 深度跑酷机制 (Advanced Gameplay)
* **列车冲浪**：不仅仅是躲避！你可以跳上**正在飞驰的列车顶部**，利用高低差进行垂直维度的躲避。
* **智能判定**：优化的碰撞盒逻辑，允许玩家在空中调整姿态，精准降落在车顶或安全区域。
* **物理破坏特效**：撞击小型障碍物会触发物理碎片爆炸 (Particle Explosion)，带来爽快的打击感。

#### 3. 🎛️ 专业级系统 (Pro Systems)
* **音频控制台**：全新的**设置面板 (Settings UI)**，支持独立调节 **BGM (背景音乐)** 和 **SFX (音效)** 的音量。
* **智能结算 UI**：带有弹性动画的结算界面，支持**自动记忆玩家昵称**，无需重复输入即可快速保存分数并重开。
* **HUD 界面**：实时显示分数、倍率、速度及护盾状态，完美适配 PC 与移动端布局。

---

### 🕹️ 操作指南 (Controls)

支持 **键盘 (PC)** 与 **触摸滑动 (Mobile)** 双重操作：

| 动作 (Action) | 键盘 (Keyboard) | 触摸 (Touch) |
| :--- | :--- | :--- |
| **左 / 右移动 (Move L/R)** | `←` `→` / `A` `D` | 向左 / 向右滑动 (Swipe L/R) |
| **跳跃 / 上车 (Jump)** | `↑` `Space` / `W` | 向上滑动 (Swipe Up) |
| **翻滚 / 下落 (Roll)** | `↓` / `S` | 向下滑动 (Swipe Down) |
| **暂停 / 设置 (Pause)** | `Esc` | 点击左上角暂停或设置按钮 |

---

### 🎒 道具与经济 (Items & Economy)

#### 货币 (Currency)
* 🟡 **金币 (Coin)**: 基础货币，值得收集。
* 💎 **蓝钻 (Gem)**: 悬浮在空中的稀有宝石，价值 **50** 金币。
* 🌟 **紫星环 (Star Ring)**: 极罕见的旋转星体，价值 **100** 金币。

#### 道具 (Power-ups)
* 🛡️ **能量护盾 (Shield)**: 开局自带或拾取。抵消一次伤害，并在破碎时提供短暂无敌时间。
* 🧲 **强力磁铁 (Magnet)**: 自动吸附周围所有类型的货币。
* 🚀 **喷气背包 (Jetpack)**: 飞向高空，在无障碍的空中像超人一样飞行并收集金币。

---

### 🤖 角色系统 (Characters)

赚取金币，在 **CHARACTERS** 菜单中解锁高级角色：

1.  **Runner (Default)**: 经典的赛博跑者，身着高科技护甲。
2.  **Crimson (Samurai)**: 红色武士装甲，拥有棱角分明的头盔，象征力量。
3.  **Stealth (Ninja)**: 深色流线型设计，身手敏捷，如影随形。
4.  **Midas (Golden Bot)**: **[传说级]** 全金属构造，拥有精密的关节与工业设计美感。

---

### 💻 技术亮点 (Technical Specs)

* **Engine**: Three.js (r128)
* **Architecture**: Single-file HTML (零外部资源依赖，所有贴图/音频均为代码生成)。
* **Audio**: Web Audio API Procedural Synthesis (无 MP3 文件，纯代码合成音效)。
* **Performance**: 对象池 (Object Pooling) 技术，确保在移动端也能跑满 60FPS。
* **Storage**: 使用 `localStorage` 本地保存金币、最高分、解锁角色及音量设置。

---

## 📥 如何离线运行 (How to Play Offline)

本项目完全开源且轻量化，您可以下载并在没有网络的情况下游玩。

### 1. 下载 (Download)
点击页面顶部的绿色 **Code** 按钮，选择 **Download ZIP**。

### 2. 解压 (Extract)
⚠️ **注意**：下载后必须先**解压**压缩包，不要直接在压缩包内双击文件。

### 3. 运行 (Run)
进入解压后的文件夹，双击 **`index.html`**。游戏将立即在您的默认浏览器中启动。

---

### 👨‍💻 开发者 (Developer)

**Version**: v2.3.0 (Sci-Fi Visual Update)
**Updates**:
* ✅ Added Sci-Fi Planets & Saturn Rings.
* ✅ Upgraded to PBR Materials & Realistic Rails.
* ✅ Implemented Audio Bus & Settings UI.
* ✅ Optimized Pop-in Animations & UX.

*Enjoy the run!* 🏃💨
