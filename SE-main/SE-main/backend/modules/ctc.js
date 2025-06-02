const pool = require('./db');

// Function to get placement CTC statistics
function getPlacementCTCStats() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT CTC FROM placement';

        pool.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }

            const ctcValues = results.map(row => parseFloat(row.CTC)).filter(value => !isNaN(value));
            if (ctcValues.length === 0) {
                return resolve({
                    "MAX of CTC (in lakhs)": 'N/A',
                    "Average CTC (in lakhs)": 'N/A',
                    "Median CTC (in lakhs)": 'N/A'
                });
            }

            const count = ctcValues.length;
            const sum = ctcValues.reduce((acc, ctc) => acc + ctc, 0);
            const average = (sum / count).toFixed(2);
            const max = Math.max(...ctcValues).toFixed(2);

            ctcValues.sort((a, b) => a - b);
            const median = calculateMedian(ctcValues);

            resolve({
                "MAX of CTC (in lakhs)": max,
                "Average CTC (in lakhs)": average,
                "Median CTC (in lakhs)": median
            });
        });
    });
}

// Helper function to calculate median
function calculateMedian(values) {
    const middle = Math.floor(values.length / 2);
    
    if (values.length % 2 === 0) {
        return ((values[middle - 1] + values[middle]) / 2).toFixed(2);
    } else {
        return values[middle].toFixed(2);
    }
}

module.exports = {
    getPlacementCTCStats
};
