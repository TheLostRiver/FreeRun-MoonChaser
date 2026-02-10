/**
 * 事件总线 (Pub/Sub 模式)
 * 用于模块间解耦通信
 */
class Events {
	constructor() {
		this.listeners = {};
	}

	// 订阅事件
	on(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	// 取消订阅
	off(event, callback) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
	}

	// 广播事件
	emit(event, data) {
		if (!this.listeners[event]) return;
		this.listeners[event].forEach(callback => callback(data));
	}
}

// 导出单例，确保全局只有一个事件中心
export default new Events();