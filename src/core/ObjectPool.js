export class ObjectPool {
        constructor(createFn, resetFn) {
                this.createFn = createFn; // 工厂函数：池子空的时候怎么造新对象
                this.resetFn = resetFn;   // 重置函数：从池子拿出来时怎么“洗干净”
                this.pool = [];           // 仓库
        }

        // 从池中获取一个对象
        get(...args) {
                if (this.pool.length > 0) {
                        const item = this.pool.pop();
                        // 如果有重置逻辑，执行它
                        if (this.resetFn) this.resetFn(item, ...args);
                        return item;
                } else {
                        // 池子空了，造个新的
                        return this.createFn(...args);
                }
        }

        // 将对象放回池中
        release(item) {
                this.pool.push(item);
        }
}