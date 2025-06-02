const db = require('./db');

// Function to retrieve on-campus and off-campus counts
const getOnOffCampusCounts = (req, res) => {
    const query = `
        SELECT 
            Offer_Type,
            COUNT(*) as count
        FROM 
            internship
        GROUP BY 
            Offer_Type;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data.');
        } else {
            console.log('Query results:', results); // Add this line to see what results are being retrieved
            
            const counts = {
                On_Campus: 0,
                Off_Campus: 0,
                Grand_Total: 0
            };

            results.forEach(row => {
                console.log('Processing row:', row); // Add this line to see each row being processed

                if (row.Offer_Type === 'On Campus') {
                    counts.On_Campus = row.count;
                } else if (row.Offer_Type === 'Off Campus') {
                    counts.Off_Campus = row.count;
                }
                counts.Grand_Total += row.count;
            });

            console.log('Final counts:', counts); // Add this line to see the final counts object

            res.json(counts);
        }
    });
};

module.exports = {
    getOnOffCampusCounts,
};
