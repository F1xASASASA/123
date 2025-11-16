export type ProcessFunction<T> = (item: T, next: () => void) => void

export class Queue<T> {
    processFunction: ProcessFunction<T>
    isProcessing: boolean = false
    private queue: T[]

    constructor(processFunction: ProcessFunction<T>) {
        this.queue = []
        this.processFunction = processFunction
    }

    addToQueue(item: T) {
        this.queue.push(item)
        this.processQueue()
    }

    async processQueue() {
        if (this.queue.length === 0 || this.isProcessing) return

        this.isProcessing = true

        const next = () => {
            this.isProcessing = false
            this.processQueue()
        }

        this.processFunction(this.queue.shift()!, next)
    }
}
