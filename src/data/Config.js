/**
 * 全局游戏配置 (Data-Driven)
 * 所有平衡性数值和颜色都在这里管理
 */
export const Config = {
	// 跑道设置
	LANES: [-3.5, 0, 3.5],
	TRACK_LENGTH: 200,

	// 玩家物理参数
	PLAYER_SPEED_BASE: 15,
	PLAYER_SPEED_MAX: 50,
	SPEED_ACCELERATION: 0.8,
	JUMP_FORCE: 0.4,
	GRAVITY: 0.015,

	// 道具持续时间
	MAGNET_DURATION: 10,
	JETPACK_DURATION: 8,
	JETPACK_HEIGHT: 7,

	// 视觉与配色 (PBR)
	COLORS: {
		skyNight: 0x0b1026,
		skySunrise: 0xff9a76,
		skyDay: 0x4faaf0,
		skySunset: 0xfd79a8,

		ground: 0xeaeaea,
		coin: 0xFFD700,

		// 角色配色
		playerBody: 0x333333,
		playerHead: 0xff0000,
		backpack: 0xFFD700
	},

	// 雾气
	FOG: {
		near: 60,
		far: 250
	}
};