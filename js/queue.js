export class Queue {
    constructor(size) {
        this.items = [];
        this.maxSize = size || Infinity;
    }

    enqueue(element) {
        if (this.size() >= this.maxSize) {
            this.dequeue();
        }
        this.items.push(element); 
    }

    dequeue() {
        return this.isEmpty() ? "Queue is empty" : this.items.shift();
    }

    peek() {
        return this.isEmpty() ? "Queue is empty" : this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    print() {
        console.log(this.items.join(" -> "));
    }
}