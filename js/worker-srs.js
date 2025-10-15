/**
 * Web Worker for handling SRS calculations off the main thread.
 */

// The LeitnerSystem class is now self-contained within the worker.
class LeitnerSystem {
    constructor() {
        this.boxes = [0, 1, 2, 3, 4, 5];
        this.intervals = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
    }

    getPracticeQueue(allItems, maxCount = 20) {
        const now = Date.now();
        const dueItems = allItems.filter(item => item.srsBox > 0 && item.nextReview <= now);
        const newItems = allItems.filter(item => item.srsBox === 0);
        const weakItems = allItems
            .filter(item => item.srsBox > 0 && item.srsBox <= 3)
            .sort((a, b) => (a.lastIncorrect || 0) - (b.lastIncorrect || 0));

        const dueCount = Math.ceil(maxCount * 0.7);
        const newCount = Math.floor(maxCount * 0.2);
        const weakCount = Math.floor(maxCount * 0.1);

        let queue = [];
        queue = queue.concat(this.shuffle(dueItems).slice(0, dueCount));
        queue = queue.concat(this.shuffle(newItems).slice(0, newCount));
        queue = queue.concat(this.shuffle(weakItems).slice(0, weakCount));

        if (queue.length < maxCount) {
            const remaining = maxCount - queue.length;
            const extraDue = this.shuffle(dueItems.filter(item => !queue.find(q => q.id === item.id)));
            queue = queue.concat(extraDue.slice(0, remaining));
        }

        if (queue.length === 0) {
            queue = this.shuffle(newItems).slice(0, maxCount);
        }

        return this.shuffle(queue);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

const srs = new LeitnerSystem();

// Listen for messages from the main thread
self.onmessage = (event) => {
    const { allItems, maxCount } = event.data;
    if (allItems) {
        const practiceQueue = srs.getPracticeQueue(allItems, maxCount);
        // Post the result back to the main thread
        self.postMessage({ practiceQueue });
    }
};
