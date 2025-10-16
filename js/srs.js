class LeitnerSystem {
    constructor() {
        // Box 0: New items. Box 5: Mastered items.
        this.boxes = [0, 1, 2, 3, 4, 5];
        // Time intervals for review, in days. Box 0 is immediate, Box 5 is ~6 months.
        this.intervals = {
            1: 1,
            2: 3,
            3: 7,
            4: 14,
            5: 30, 
        };
    }

    /**
     * Promotes an item to the next box.
     * @param {object} item The learning item from IndexedDB.
     */
    promote(item) {
        if (item.srsBox < this.boxes.length - 1) {
            item.srsBox++;
            const interval = this.intervals[item.srsBox];
            if (interval) {
                const now = new Date();
                item.nextReview = now.setDate(now.getDate() + interval);
            }
        } else {
            // Item is considered "mastered", no more reviews needed for a while
            const now = new Date();
            item.nextReview = now.setFullYear(now.getFullYear() + 1);
        }
        item.lastCorrect = Date.now();
    }

    /**
     * Demotes an item to the first box on incorrect answer.
     * @param {object} item The learning item from IndexedDB.
     */
    demote(item) {
        item.srsBox = 1; // Always back to box 1 for review in 1 day
        const now = new Date();
        item.nextReview = now.setDate(now.getDate() + this.intervals[1]);
        item.lastIncorrect = Date.now();
    }

    /**
     * Selects which items to practice.
     * @param {Array<object>} allItems All items from the database.
     * @param {number} maxCount The maximum number of items to return.
     * @returns {Array<object>} A list of items to practice.
     */
    getPracticeQueue(allItems, maxCount = 20) {
        const now = Date.now();
        
        const dueItems = allItems.filter(item => item.srsBox > 0 && item.nextReview <= now);
        const newItems = allItems.filter(item => item.srsBox === 0);
        const weakItems = allItems
            .filter(item => item.srsBox > 0 && item.srsBox <= 3) // Re-practice items from lower boxes
            .sort((a, b) => (a.lastIncorrect || 0) - (b.lastIncorrect || 0)); // Prioritize recently failed

        // Strategy: 70% due, 20% new, 10% weak items
        const dueCount = Math.ceil(maxCount * 0.7);
        const newCount = Math.floor(maxCount * 0.2);
        const weakCount = Math.floor(maxCount * 0.1);

        let queue = [];
        queue = queue.concat(this.shuffle(dueItems).slice(0, dueCount));
        queue = queue.concat(this.shuffle(newItems).slice(0, newCount));
        queue = queue.concat(this.shuffle(weakItems).slice(0, weakCount));

        // Fill up with more due items if queue is not full
        if (queue.length < maxCount) {
            const remaining = maxCount - queue.length;
            const extraDue = this.shuffle(dueItems.filter(item => !queue.find(q => q.id === item.id)));
            queue = queue.concat(extraDue.slice(0, remaining));
        }

        // If still empty, just grab some new items
        if (queue.length === 0) {
            queue = this.shuffle(newItems).slice(0, maxCount);
        }

        return this.shuffle(queue); // Shuffle the final queue
    }

    /**
     * Shuffles an array in place.
     * @param {Array} array The array to shuffle.
     * @returns {Array} The shuffled array.
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeitnerSystem;
} else {
    // Browser environment
    window.LeitnerSystem = LeitnerSystem;
}
