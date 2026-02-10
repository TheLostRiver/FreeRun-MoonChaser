import Events from '../core/Events.js';

export class InputSystem {
        constructor() {
                this.isPaused = false;
                this.initKeyboard();
                // 未来可以在这里添加 this.initTouch();
        }

        initKeyboard() {
                window.addEventListener('keydown', (e) => {
                        if (this.isPaused) return;

                        switch (e.code) {
                                case 'ArrowLeft':
                                case 'KeyA':
                                        Events.emit('INPUT_LEFT');
                                        break;
                                case 'ArrowRight':
                                case 'KeyD':
                                        Events.emit('INPUT_RIGHT');
                                        break;
                                case 'ArrowUp':
                                case 'KeyW':
                                case 'Space':
                                        Events.emit('INPUT_JUMP');
                                        break;
                                case 'ArrowDown':
                                case 'KeyS':
                                        Events.emit('INPUT_ROLL');
                                        break;
                        }
                });
        }
}