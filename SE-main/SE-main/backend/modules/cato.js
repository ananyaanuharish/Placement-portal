const db = require('./db');

// Function to retrieve Dream/Open Dream counts
const getDreamOpenDreamCounts = (req, res) => {
    const query = `
        SELECT 
            Category,
            COUNT(*) as count
        FROM 
            placement
        GROUP BY 
            Category;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data.');
        } else {
            console.log('Query results:', results); // Add this line to see what results are being retrieved
            
            const counts = {
                Dream: 0,
                No_PPO: 0,
                Open_Dream: 0,
                Grand_Total: 0
            };

            results.forEach(row => {
                console.log('Processing row:', row); // Add this line to see each row being processed

                if (row.Category === 'Dream') {
                    counts.Dream = row.count;
                } else if (row.Category === 'Open-Dream' || 'Open Dream') {
                    counts.Open_Dream = row.count;
                } else if (row.Category === 'No-PPO' || 'No PPO') {
                    counts.No_PPO = row.count;
                }
                counts.Grand_Total += row.count;
            });

            console.log('Final counts:', counts); // Add this line to see the final counts object

            res.json(counts);
        }
    });
};

module.exports = {
    getDreamOpenDreamCounts,
};
