class LeitnerSystem {
    constructor(enabled = true) {
        this.enabled = enabled;
        // Box 0: New items. Box 5: Mastered items.
        this.boxes = [0, 1, 2, 3, 4, 5];
        // Time intervals for review, in days. Box 0 is immediate, Box 5 is ~6 months.
        this.intervals = {
            1: 1,      // 1 day
            2: 3,      // 3 days
            3: 7,      // 1 week
            4: 14,     // 2 weeks
            5: 30,     // 1 month
        };
        console.log(`? LeitnerSystem initialized (SRS: ${enabled ? 'enabled' : 'disabled'})`);
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        console.log(`SRS ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Promotes an item to the next box.
     * @param {object} item The learning item from IndexedDB.
     */
    promote(item) {
        if (!this.enabled) {
            console.log(`SRS disabled - promote() is no-op for item: ${item.id}`);
            return;
        }

        const oldBox = item.srsBox;
        if (item.srsBox < this.boxes.length - 1) {
            item.srsBox++;
            const interval = this.intervals[item.srsBox];
            if (interval) {
                const now = new Date();
                item.nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).getTime();
            }
        } else {
            // Mastered - review in 1 year
            const now = new Date();
            item.nextReview = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).getTime();
        }
        item.lastCorrect = Date.now();

        console.log(`? Promoted: ${item.id.slice(0, 8)} | Box ${oldBox} ? ${item.srsBox} | Next: ${new Date(item.nextReview).toLocaleString()}`);
    }

    /**
     * Demotes an item to the first box on incorrect answer.
     * @param {object} item The learning item from IndexedDB.
     */
    demote(item) {
        if (!this.enabled) {
            console.log(`SRS disabled - demote() is no-op for item: ${item.id}`);
            return;
        }

        const oldBox = item.srsBox;
        item.srsBox = 1; // Always back to box 1
        const now = new Date();
        item.nextReview = new Date(now.getTime() + this.intervals[1] * 24 * 60 * 60 * 1000).getTime();
        item.lastIncorrect = Date.now();

        console.log(`? Demoted: ${item.id.slice(0, 8)} | Box ${oldBox} ? ${item.srsBox} | Next: ${new Date(item.nextReview).toLocaleString()}`);
    }

    /**
     * Selects which items to practice.
     * @param {Array<object>} allItems All items from the database.
     * @param {number} maxCount The maximum number of items to return.
     * @returns {Array<object>} A list of items to practice.
     */
    getPracticeQueue(allItems, maxCount = 20) {
        console.group('?? SRS: Building practice queue');
        const now = Date.now();
        
        const dueItems = allItems.filter(item => item.srsBox > 0 && item.nextReview <= now);
        const newItems = allItems.filter(item => item.srsBox === 0);
        const weakItems = allItems
            .filter(item => item.srsBox > 0 && item.srsBox <= 3)
            .sort((a, b) => (b.lastIncorrect || 0) - (a.lastIncorrect || 0));

        console.log(`Due items: ${dueItems.length}`);
        console.log(`New items: ${newItems.length}`);
        console.log(`Weak items: ${weakItems.length}`);

        // Strategy: 70% due, 20% new, 10% weak
        const dueCount = Math.ceil(maxCount * 0.7);
        const newCount = Math.floor(maxCount * 0.2);
        const weakCount = Math.floor(maxCount * 0.1);

        let queue = [];
        queue = queue.concat(this.shuffle(dueItems).slice(0, dueCount));
        queue = queue.concat(this.shuffle(newItems).slice(0, newCount));
        queue = queue.concat(this.shuffle(weakItems).slice(0, weakCount));

        // Fill remaining slots with due items
        if (queue.length < maxCount) {
            const remaining = maxCount - queue.length;
            const extraDue = this.shuffle(dueItems.filter(item => !queue.includes(item)));
            queue = queue.concat(extraDue.slice(0, remaining));
        }

        // If still empty, grab new items
        if (queue.length === 0) {
            queue = this.shuffle(newItems).slice(0, maxCount);
        }

        console.log(`Final queue: ${queue.length} items`);
        console.groupEnd();

        return this.shuffle(queue);
    }

    /**
     * Shuffles an array in place.
     * @param {Array} array The array to shuffle.
     * @returns {Array} The shuffled array.
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
