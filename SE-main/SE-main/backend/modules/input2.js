const xlsx = require('xlsx');
const db = require('./db');

// Function to parse date string in DD-MMM-YYYY format or keep as varchar
const parseDateString = (dateStr) => {
    if (typeof dateStr === 'string') {
        // Assume dateStr is in DD-MMM-YYYY format (e.g., 08-May-2023)
        const months = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        const [day, month, year] = dateStr.split('-').map(part => part.trim());
        const monthNumber = months[month.substring(0, 3)];
        return `${year}-${monthNumber}-${day}`;
    } else {
        return dateStr; // If already in varchar format (for Start_Date)
    }
};

// Function to extract and insert internship data from Excel file
const extractAndInsertInternshipData = (filePath) => {
    try {
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(filePath);

        // Process the "Internship Details" sheet
        const internshipSheetName = 'Internship Details'; // Adjust sheet name if different
        const internshipSheet = workbook.Sheets[internshipSheetName];
        const internshipData = xlsx.utils.sheet_to_json(internshipSheet);

        console.log('Extracted internship data:');
        console.log(internshipData); // Log all extracted data

        // Process each row of internship data
        internshipData.forEach((row) => {
            try {
                const {
                    USN,
                    Company,
                    Stipend,
                    Status,
                    Start_Date,
                    Offer_Type
                } = row;

                // Parse Start_Date (keep as varchar)
                const startDate = parseDateString(Start_Date);

                // Prepare SQL query
                const query = `
                    INSERT INTO internship (USN, Company, Stipend, Status, Start_Date, Offer_Type)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        Stipend = VALUES(Stipend),
                        Status = VALUES(Status),
                        Start_Date = VALUES(Start_Date),
                        Offer_Type = VALUES(Offer_Type);
                `;

                const values = [
                    USN,
                    Company,
                    Stipend,
                    Status,
                    startDate,
                    Offer_Type
                ];

                // Execute the query
                db.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting internship data:', err);
                        return;
                    }

                    // Log the inserted data
                    console.log('Inserted internship data:');
                    console.log({
                        USN,
                        Company,
                        Stipend,
                        Status,
                        Start_Date: startDate,
                        Offer_Type
                    });
                });
            } catch (rowError) {
                console.error('Error processing internship row:', row);
                console.error(rowError);
            }
        });

        console.log('Internship data extraction and insertion completed.');
    } catch (error) {
        console.error('Error processing the file:', error);
    }
};

module.exports = {
    extractAndInsertInternshipData
};
