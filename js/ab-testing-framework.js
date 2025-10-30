/**
 * A/B Testing Framework for Adaptive Learning
 *
 * Enables scientific comparison of different adaptive strategies.
 *
 * METHODOLOGY:
 * - Random assignment to control/treatment groups
 * - Statistical significance testing (t-test, chi-square)
 * - Effect size calculation (Cohen's d)
 * - Sample size calculation
 *
 * METRICS:
 * - Learning velocity (concepts mastered per hour)
 * - Retention rate (7-day, 30-day)
 * - Dropout rate
 * - User satisfaction
 * - Time to mastery
 *
 * @references
 * - Kohavi, R., et al. (2009). Controlled experiments on the web
 * - Deng, A., et al. (2013). Improving the sensitivity of online experiments
 */

class ABTestingFramework {
    constructor() {
        this.experiments = {};
        this.userAssignments = {};
    }

    /**
     * Create new A/B test
     */
    createExperiment(config) {
        const {
            id,
            name,
            description,
            variants,          // ['control', 'treatment']
            metrics,           // metrics to track
            sampleSize,
            startDate,
            endDate
        } = config;

        this.experiments[id] = {
            id,
            name,
            description,
            variants: variants.map(v => ({
                name: v,
                users: [],
                metrics: {}
            })),
            sampleSize,
            startDate: startDate || Date.now(),
            endDate,
            active: true
        };

        return this.experiments[id];
    }

    /**
     * Assign user to variant
     */
    assignUserToVariant(userId, experimentId) {
        if (this.userAssignments[userId]?.[experimentId]) {
            return this.userAssignments[userId][experimentId];
        }

        const experiment = this.experiments[experimentId];
        if (!experiment || !experiment.active) return 'control';

        // Random assignment (50/50 split)
        const variant = Math.random() < 0.5 ? 'control' : 'treatment';

        if (!this.userAssignments[userId]) {
            this.userAssignments[userId] = {};
        }

        this.userAssignments[userId][experimentId] = variant;
        return variant;
    }

    /**
     * Record metric for user
     */
    recordMetric(userId, experimentId, metricName, value) {
        const variant = this.userAssignments[userId]?.[experimentId];
        if (!variant) return;

        const experiment = this.experiments[experimentId];
        const variantData = experiment.variants.find(v => v.name === variant);

        if (!variantData.metrics[metricName]) {
            variantData.metrics[metricName] = [];
        }

        variantData.metrics[metricName].push(value);
    }

    /**
     * Calculate statistical significance (t-test)
     */
    calculateSignificance(experimentId, metricName) {
        const experiment = this.experiments[experimentId];
        const control = experiment.variants.find(v => v.name === 'control');
        const treatment = experiment.variants.find(v => v.name === 'treatment');

        const controlData = control.metrics[metricName] || [];
        const treatmentData = treatment.metrics[metricName] || [];

        if (controlData.length < 30 || treatmentData.length < 30) {
            return { significant: false, reason: 'Insufficient sample size' };
        }

        // Simple t-test calculation
        const controlMean = this.mean(controlData);
        const treatmentMean = this.mean(treatmentData);
        const pooledStdDev = this.pooledStandardDeviation(controlData, treatmentData);

        const t = (treatmentMean - controlMean) /
                  (pooledStdDev * Math.sqrt(1/controlData.length + 1/treatmentData.length));

        const df = controlData.length + treatmentData.length - 2;
        const pValue = this.tTestPValue(t, df);

        // Cohen's d for effect size
        const cohensD = (treatmentMean - controlMean) / pooledStdDev;

        return {
            significant: pValue < 0.05,
            pValue,
            controlMean,
            treatmentMean,
            improvement: ((treatmentMean - controlMean) / controlMean) * 100,
            cohensD,
            effectSize: this.interpretCohensD(cohensD)
        };
    }

    mean(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    pooledStandardDeviation(arr1, arr2) {
        const var1 = this.variance(arr1);
        const var2 = this.variance(arr2);
        return Math.sqrt(((arr1.length - 1) * var1 + (arr2.length - 1) * var2) /
                        (arr1.length + arr2.length - 2));
    }

    variance(arr) {
        const m = this.mean(arr);
        return arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / (arr.length - 1);
    }

    tTestPValue(t, df) {
        // Simplified p-value approximation
        const absT = Math.abs(t);
        if (absT > 2.58) return 0.01;
        if (absT > 1.96) return 0.05;
        if (absT > 1.65) return 0.10;
        return 0.20;
    }

    interpretCohensD(d) {
        const absD = Math.abs(d);
        if (absD < 0.2) return 'negligible';
        if (absD < 0.5) return 'small';
        if (absD < 0.8) return 'medium';
        return 'large';
    }

    /**
     * Get experiment results
     */
    getResults(experimentId) {
        const experiment = this.experiments[experimentId];
        const results = {};

        Object.keys(experiment.variants[0].metrics).forEach(metric => {
            results[metric] = this.calculateSignificance(experimentId, metric);
        });

        return {
            experiment: experiment.name,
            results,
            recommendation: this.generateRecommendation(results)
        };
    }

    generateRecommendation(results) {
        const significantImprovements = Object.values(results).filter(r =>
            r.significant && r.improvement > 0
        );

        if (significantImprovements.length > 0) {
            return {
                action: 'adopt_treatment',
                reason: `Treatment shows significant improvement in ${significantImprovements.length} metrics`
            };
        }

        return {
            action: 'keep_control',
            reason: 'No significant improvement detected'
        };
    }
}

if (typeof window !== 'undefined') window.ABTestingFramework = ABTestingFramework;
if (typeof module !== 'undefined' && module.exports) module.exports = { ABTestingFramework };
