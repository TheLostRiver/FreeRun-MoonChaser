# 🏃 Free Run: Moon Chaser (v1.0)
### 自由奔跑：逐月者 —— 3D无尽跑酷 Web 游戏

> **"在霓虹闪烁的城市中飞奔，在飞驰的列车顶端起舞。你能跑多远？"**
> **"Dash through the neon city, dance atop speeding trains. How far can you go?"**

---

### 🎮 游戏简介 (Introduction)

**Free Run: Moon Chaser** 是一款基于 WebGL (Three.js) 构建的高性能 3D 无尽跑酷游戏。体验从清晨到日落的**动态昼夜循环**，在高速移动的列车和障碍物之间穿梭。本项目完全由 **HTML5 + JavaScript** 编写，无需下载，打开浏览器即可体验出色的流畅跑酷！

**Free Run: Moon Chaser** is a high-performance 3D endless runner built with WebGL (Three.js). Experience a dynamic day-night cycle, dodge speeding trains, and master the art of parkour. No download required—play instantly in your browser!

---

### ✨ 核心特色 (Key Features)

* **🌅 沉浸式昼夜系统 (Dynamic Day/Night Cycle)**
    游戏世界拥有完整的时间流逝，从明亮的蓝天正午，到紫红色的绚丽黄昏，再到危机四伏的深夜。
    *Experience the passage of time from bright noon skies to violet sunsets and dangerous nights.*

* **🚆 极限车顶跑酷 (Train Roof Surfing)**
    不仅仅是躲避！你可以跳上**正在飞驰的列车顶部**，利用高低差进行垂直维度的躲避，体验如电影般的动作场面。
    *Jump onto speeding trains! Use verticality to dodge obstacles and perform movie-like parkour moves.*

* **💥 物理破坏反馈 (Physics-based Destruction)**
    告别纸片人手感！撞击栏杆和路障时会触发**物理破碎特效**，甚至引发连环爆炸。
    *Smash through barriers! Hitting obstacles triggers satisfying physics-based destruction effects.*

* **🛡️ 能量护盾机制 (Energy Shield)**
    新手友好！开局自带**能量护盾 (Energy Shield)**，可抵消一次致命的小型障碍物撞击。
    *Start with an Energy Shield that protects you from one fatal collision.*

* **💰 多样化货币系统 (Advanced Currency)**
    除了普通金币，你还会遇到悬浮的**蓝钻 (x50)** 和稀有的**紫星环 (x100)**，助你快速致富。
    *Collect Blue Gems (x50) and Rare Star Rings (x100) to get rich quick.*

---

### 🕹️ 操作指南 (Controls)

支持 **键盘 (PC)** 与 **触摸滑动 (Mobile)** 双重操作：

| 动作 (Action) | 键盘 (Keyboard) | 触摸 (Touch) |
| :--- | :--- | :--- |
| **左 / 右移动 (Move L/R)** | `←` `→` / `A` `D` | 向左 / 向右滑动 (Swipe L/R) |
| **跳跃 / 上车 (Jump)** | `↑` `Space` / `W` | 向上滑动 (Swipe Up) |
| **翻滚 / 下落 (Roll)** | `↓` / `S` | 向下滑动 (Swipe Down) |
| **暂停游戏 (Pause)** | `Esc` | 点击右上角暂停键 (Tap Pause Icon) |

---

### 🤖 角色系统 (Characters)

使用赚取的金币解锁拥有独特外观的高级角色：

1.  **Runner (Default)**: 经典的赛博跑者，身着高科技护甲。
2.  **Crimson (Samurai)**: 红色装甲，拥有棱角分明的头盔，象征着力量。
3.  **Stealth (Ninja)**: 流线型胶囊设计，身手敏捷，如影随形。
4.  **Midas (Golden Bot)**: **[传说级/Legendary]** 全金属构造，拥有精密的关节与工业设计美感。

---

### 🛠️ 进阶技巧 (Pro Tips)

1.  **善用护盾 (Shield is Life)**：右上角的 `READY` 蓝色护盾条意味着你有一条命。当护盾破碎（进入无敌闪烁状态）时，利用这段时间直接撞碎障碍物！
2.  **磁铁黑洞 (Super Magnet)**：升级后的磁铁拥有**动态速度捕获**能力，哪怕你跑得比子弹还快，金币也会像导弹一样追踪你。
3.  **车顶是安全的 (High Ground)**：如果地面障碍物太密集，尝试**跳上火车顶**！那里视野开阔，但要小心断层。
4.  **不要撞火车 (Don't hit trains)**：护盾可以抵消栏杆伤害，但**火车是致命的**，无论你有没有护盾！

---

### 💻 技术亮点 (Technical Specs)

* **Engine**: Three.js (r128)
* **Architecture**: Single-file HTML structure (Zero external asset dependencies).
* **Performance**: Optimized geometry reuse & object pooling for 60FPS on mobile devices.
* **Audio**: Procedural Audio Synthesis (Web Audio API) - No MP3 files used.

---

## 📥 How to Play Offline / 如何下载并离线运行

如果你不想依赖网络，或者想把游戏保存在电脑上随时游玩，请按照以下步骤操作（非常简单，无需懂代码！）：

**If you want to play offline without an internet connection, follow these simple steps (No coding skills required!):**

### 1. 下载游戏 (Download)
1.  在页面顶部找到绿色的 **Code** 按钮。
    *(Find the green **Code** button at the top of this page.)*
2.  点击它，然后选择 **Download ZIP**。
    *(Click it and select **Download ZIP**.)*
3.  等待下载完成。
    *(Wait for the download to finish.)*

### 2. 解压文件 (Unzip)
⚠️ **重要提示 / IMPORTANT**:
请不要直接双击 ZIP 包里的文件！你必须先**解压**。
*Do not run the file directly inside the ZIP! You must **Extract/Unzip** it first.*

1.  找到下载好的 `MoonChaser-main.zip`。
2.  右键点击，选择 **“全部解压缩” (Extract All)**。
3.  记住解压后的文件夹位置。

### 3. 开始游戏 (Start Game)
1.  进入解压后的文件夹。
2.  找到名为 **`index.html`** 的文件。
    *(Find the file named **`index.html`**.)*
3.  **双击它！** 游戏会自动在你的默认浏览器（Chrome, Edge, Safari 等）中打开。
    *(**Double-click it!** The game will launch in your default browser.)*

---

### ❓ 常见问题 (Troubleshooting)

* **Q: 打开是黑屏怎么办？ (Black Screen?)**
    * A: 请确保你使用的是现代浏览器，如 **Google Chrome**, **Microsoft Edge**, 或 **Firefox**。不要使用 IE 浏览器。
    * *Ensure you are using a modern browser like Chrome, Edge, or Firefox. Do not use Internet Explorer.*

* **Q: 为什么没有声音？ (No Sound?)**
    * A: 浏览器通常禁止自动播放声音。请点击游戏画面上的 **"TAP TO PLAY"** 按钮，或者点击右上角的 喇叭 🔊 图标来开启声音。
    * *Browsers block auto-playing audio. Click the **"TAP TO PLAY"** button or the speaker 🔊 icon to enable sound.*

* **Q: 游戏进度会保存吗？ (Will progress be saved?)**
    * A: 是的！即使离线运行，你的金币和角色解锁记录也会保存在浏览器的缓存中。但如果你清理了浏览器缓存，存档可能会丢失。
    * *Yes! Your coins and unlocked characters are saved in your browser's local storage.*

---

### 👨‍💻 开发者留言 (Dev Note)

这是一个致力于探索 Web 3D 极限的项目。从最初的简单方块，到现在的动态云层、粒子特效和复杂碰撞逻辑，每一行代码都倾注了对游戏开发的热爱。

This is a project dedicated to exploring the limits of Web 3D. Every line of code, from dynamic clouds to particle effects, is written with love.

**Version**: v1.0.0
**Status**: Released

---

### [ ▶️ START GAME / 开始游戏 ](https://moon.bolobolo.online/)
