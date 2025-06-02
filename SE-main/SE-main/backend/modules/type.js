// offer.js

const mysql = require('mysql2');
const { promisify } = require('util');

// Database connection configuration (importing pool from your existing db.js)
const pool = require('./db');


// Function to calculate offer statistics
async function calculateOfferStatistics() {
    try {
        // Query to fetch offer type counts
        const query = `
            SELECT Type, COUNT(USN) AS Count
            FROM placement
            GROUP BY Type
            ORDER BY Type
        `;

        // Promisify pool query
        const queryAsync = promisify(pool.query).bind(pool);

        // Execute the query
        const results = await queryAsync(query);

        // Process results into desired format
        const statistics = {};
        let grandTotal = 0;

        results.forEach(row => {
            statistics[row.Type] = row.Count;
            if (row.Type !== 'Grand Total') {
                grandTotal += row.Count;
            }
        });

        // Add grand total to statistics
        statistics['Grand Total'] = grandTotal;

        return statistics;
    } catch (error) {
        throw new Error(`Error fetching offer statistics: ${error.message}`);
    }
}

module.exports = {
    calculateOfferStatistics
};
