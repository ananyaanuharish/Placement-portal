const multer = require('multer');
const xlsx = require('xlsx');
const db = require('./db');

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Function to convert Excel serial date to JavaScript Date
const excelDateToJSDate = (serial) => {
    if (typeof serial === 'number') {
        const utcDays = Math.floor(serial - 25569);
        const utcValue = utcDays * 86400;
        const dateInfo = new Date(0); // Start with epoch
        dateInfo.setUTCSeconds(utcValue);
        return dateInfo;
    } else {
        throw new Error('Invalid date format');
    }
};

// Function to parse date string in DD/MM/YYYY format
const parseDateString = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(part => part.trim());
    return new Date(`${year}-${month}-${day}`);
};

// Function to check if a date is valid
const isValidDate = (d) => {
    return d instanceof Date && !isNaN(d);
};

// Function to handle file upload and data insertion
const uploadAndInsertData = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(file.path);

        // Process the "Student List" sheet
        const studentSheetName = 'Student List';
        const studentSheet = workbook.Sheets[studentSheetName];
        const studentData = xlsx.utils.sheet_to_json(studentSheet);

        // Process each row of student data
        studentData.forEach((row) => {
            try {
                const {
                    'College Email ID': collegeEmail,
                    'Personal Email ID': personalEmail,
                    'Name': name,
                    'USN': usn,
                    'Branch': department,
                    'Gender': gender,
                    'Date of Birth (DD/MM/YYYY)': dateOfBirth,
                    'Mobile': mobile,
                    '10th Percentage': percentage_10th,
                    '12th/Diploma Percentage': percentage_12th,
                    'BE CGPA': be_cgpa,
                    'Active Backlogs': backlogs,
                    'History of Backlogs (YES/NO)': historyOfBacklogs,
                } = row;

                // Parse date of birth
                let dob;
                if (typeof dateOfBirth === 'string') {
                    dob = parseDateString(dateOfBirth); // Parse date string
                } else if (typeof dateOfBirth === 'number') {
                    dob = excelDateToJSDate(dateOfBirth); // Convert Excel serial date
                } else {
                    throw new Error('Invalid date format');
                }

                // Format date to YYYY-MM-DD format
                dob = dob.toISOString().split('T')[0];

                // Prepare SQL query
                const query = `
                    INSERT INTO student (USN, Name, Department, Gender, Date_of_Birth, Email, Secondary_Email, Phone_Number, 10th_Percentage, 12th_Diploma_Percentage, BE_CGPA, Active_Backlogs, History_of_Backlogs, Eligibility_for_Placements)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Eligible')
                    ON DUPLICATE KEY UPDATE
                        Name = VALUES(Name),
                        Department = VALUES(Department),
                        Gender = VALUES(Gender),
                        Date_of_Birth = VALUES(Date_of_Birth),
                        Email = VALUES(Email),
                        Secondary_Email = VALUES(Secondary_Email),
                        Phone_Number = VALUES(Phone_Number),
                        10th_Percentage = VALUES(10th_Percentage),
                        12th_Diploma_Percentage = VALUES(12th_Diploma_Percentage),
                        BE_CGPA = VALUES(BE_CGPA),
                        Active_Backlogs = VALUES(Active_Backlogs),
                        History_of_Backlogs = VALUES(History_of_Backlogs),
                        Eligibility_for_Placements = VALUES(Eligibility_for_Placements);
                `;

                const values = [
                    usn,
                    name,
                    department,
                    gender,
                    dob,
                    collegeEmail,
                    personalEmail,
                    mobile,
                    percentage_10th,
                    percentage_12th,
                    be_cgpa,
                    backlogs,
                    historyOfBacklogs === 'YES' ? 1 : 0 // Convert 'YES'/'NO' to 1/0
                ];

                // Execute the query
                db.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting student data:', err);
                    }
                });
            } catch (rowError) {
                console.error('Error processing student row:', row);
                console.error(rowError);
            }
        });

        res.send('File uploaded and data insertion started.');
    } catch (error) {
        console.error('Error processing the file:', error);
        res.status(500).send('Error processing the file.');
    }
};

module.exports = {
    upload,
    uploadAndInsertData,
};
