import Events from '../core/Events.js';

export class AudioSystem {
        constructor() {
                this.ctx = null; // AudioContext
                this.enabled = false;

                this.initListeners();
        }

        init() {
                // 浏览器策略要求：必须在用户交互(点击/按键)后才能创建 AudioContext
                if (!this.ctx) {
                        const AudioContext = window.AudioContext || window.webkitAudioContext;
                        this.ctx = new AudioContext();
                        this.enabled = true;
                        console.log("🔊 Audio System Started");
                } else if (this.ctx.state === 'suspended') {
                        this.ctx.resume();
                }
        }

        initListeners() {
                // 监听事件播放对应声音
                Events.on('INPUT_JUMP', () => this.playJump());
                Events.on('COIN_COLLECTED', () => this.playCoin());
                Events.on('GAME_OVER', () => this.playCrash());
        }

        // 🎵 跳跃音效 (频率滑动的“咻”声)
        playJump() {
                if (!this.enabled) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'sine';
                // 频率从 200Hz 快速升到 600Hz
                osc.frequency.setValueAtTime(200, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.2);

                // 音量渐隐
                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.2);
        }

        // 💰 金币音效 (清脆的高音“叮”)
        playCoin() {
                if (!this.enabled) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'sine'; // 也可以试试 'triangle'
                // 两个高音音符瞬间切换 (模拟硬币撞击)
                osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
                osc.frequency.setValueAtTime(1600, this.ctx.currentTime + 0.1);

                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.3);
        }

        // 💥 撞击音效 (低沉的锯齿波噪音)
        playCrash() {
                if (!this.enabled) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'sawtooth'; // 锯齿波听起来比较粗糙，像噪音
                // 频率急速下降
                osc.frequency.setValueAtTime(100, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);

                gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.5);
        }
}