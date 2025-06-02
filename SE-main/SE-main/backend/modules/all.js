const db = require('./db');

// Function to retrieve joined data from multiple tables
const getAllData = (req, res) => {
    const query = `
        SELECT
            s.USN,
            s.Name,
            s.Department,
            s.Gender,
            s.Date_of_Birth,
            s.Email,
            s.Secondary_Email,
            s.Phone_Number,
            s.10th_Percentage,
            s.12th_Diploma_Percentage,
            s.BE_CGPA,
            s.Active_Backlogs,
            s.History_of_Backlogs,
            CASE
                WHEN s.Active_Backlogs > 0 THEN 'Not Eligible'
                ELSE 'Eligible'
            END AS Eligibility_for_Placements,
            i.Company AS Internship_Company,
            i.Stipend AS Internship_Stipend,
            i.Status AS Internship_Status,
            i.Start_Date AS Internship_Start_Date,
            i.Offer_Type AS Internship_Offer_Type,
            p.Company AS Placement_Company,
            p.Type AS Placement_Type,
            p.CTC AS Placement_CTC,
            p.Category AS Placement_Category,
            p.Remarks AS Placement_Remarks,
            p.Offer_Date AS Placement_Offer_Date,
            p.Start_Date_Internship AS Placement_Start_Date_Internship
        FROM student s
        LEFT JOIN internship i ON s.USN = i.USN
        LEFT JOIN placement p ON s.USN = p.USN;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data.');
        } else {
            res.json(results);
        }
    });
};

module.exports = {
    getAllData,
};