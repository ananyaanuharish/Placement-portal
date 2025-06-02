const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();


const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const db = require('./modules/db');

// Import route handlers
const loginRoutes = require('./modules/login');
const registerRouter = require('./modules/register');
const logoutRouter = require('./modules/logout');
const { upload, uploadAndInsertData } = require('./modules/input');
const { extractAndInsertInternshipData } = require('./modules/input2');
const { getAllData } = require('./modules/all');
const { getDreamOpenDreamCounts } = require('./modules/cato');
const { getPlacementCTCStats } = require('./modules/ctc');
const { calculateOfferStatistics } = require('./modules/type');
const { insertStudent, getAllStudents } = require('./modules/student');
const { insertInternship, getAllInternships } = require('./modules/internship');
const { insertPlacement, getAllPlacements } = require('./modules/placement');
const { getOnOffCampusCounts } = require('./modules/campus');

const app = express();
const port = process.env.PORT || 3000;
// Middleware setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'wasssssuppp',
    resave: false,
    saveUninitialized: false,
}));



app.use(fileUpload());
app.post('/upload/student', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetName = 'Student List';
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
        INSERT INTO student (
            USN, Name, Department, Gender, Date_of_Birth, Email, 
            Secondary_Email, Phone_Number, 10th_Percentage, 
            12th_Diploma_Percentage, BE_CGPA, Active_Backlogs, 
            History_of_Backlogs, Eligibility_for_Placements
        ) VALUES ?`;

    // Helper function to format the date in 'dd/mm/yyyy'
    function formatExcelDate(excelDate) {
        // Check if date is a number (Excel's date format)
        if (typeof excelDate === 'number') {
            const jsDate = new Date((excelDate - (25567 + 1)) * 86400 * 1000); // Convert Excel date to JS date
            const day = String(jsDate.getDate()).padStart(2, '0');
            const month = String(jsDate.getMonth() + 1).padStart(2, '0');
            const year = jsDate.getFullYear();
            return `${day}/${month}/${year}`; // Format in 'dd/mm/yyyy'
        }
        // If it's already a string, return it as is
        return excelDate;
    }

    const values = jsonData.map((row) => {
        const formattedDateOfBirth = formatExcelDate(row['Date of Birth (DD/MM/YYYY)']); // Format the date

        // Convert "History of Backlogs (YES/NO)" to 1 or 0
        const historyOfBacklogs = row['History of Backlogs (YES/NO)'] === 'YES' ? 1 : 0;
        
        // Determine "Eligibility for Placements"
        const eligibilityForPlacements = row['Active Backlogs'] > 0 ? 'Not eligible' : 'Eligible';

        return [
            row['USN'],
            row['Name'],
            row['Branch'], // Assuming "Branch" corresponds to "Department"
            row['Gender'],
            formattedDateOfBirth, // Use the formatted date
            row['College Email ID'],
            row['Personal Email ID'],
            row['Mobile'],
            row['10th Percentage'],
            row['12th/Diploma Percentage'],
            row['BE CGPA'],
            row['Active Backlogs'],
            historyOfBacklogs,
            eligibilityForPlacements
        ];
    });

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            return res.status(500).send('Database error: ' + err.message);
        }
        res.send('Data inserted successfully.');
    });
});


app.post('/upload/internship', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetName = 'Internship';
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Function to format Excel date
    function formatExcelDate(excelDate) {
        const jsDate = new Date((excelDate - (25567 + 1)) * 86400 * 1000); // Convert Excel date to JS date
        const day = String(jsDate.getDate()).padStart(2, '0');
        const month = String(jsDate.getMonth() + 1).padStart(2, '0');
        const year = jsDate.getFullYear();
        return `${day}/${month}/${year}`; // Format in 'dd/mm/yyyy'
    }

    const values = jsonData.map((row) => {
        const formattedDate = typeof row['Start Date'] === 'number' ? formatExcelDate(row['Start Date']) : row['Start Date'];

        return [
            row['USN'],
            row['Company'],
            row['Stipend'], 
            row['Status'],
            formattedDate,
            row['Offer']
        ];
    });

    const insertQuery = `
        INSERT INTO internship (
            USN, Company, Stipend, Status, Start_Date, Offer_Type
        ) VALUES ?`;

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            return res.status(500).send('Database error: ' + err.message);
        }
        res.send('Data inserted successfully.');
    });
});

app.post('/upload/placement', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetName = 'Placement';
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Function to format Excel date
    function formatExcelDate(excelDate) {
        const jsDate = new Date((excelDate - (25567 + 1)) * 86400 * 1000); // Convert Excel date to JS date
        const day = String(jsDate.getDate()).padStart(2, '0');
        const month = String(jsDate.getMonth() + 1).padStart(2, '0');
        const year = jsDate.getFullYear();
        return `${day}/${month}/${year}`; // Format in 'dd/mm/yyyy'
    }

    const values = jsonData.map((row) => {
        // Check if the date fields are numbers and format them
        const formattedOfferDate = typeof row['Offer Date'] === 'number' ? formatExcelDate(row['Offer Date']) : row['Offer Date'];
        const formattedStartDateInternship = typeof row['Start Date (Internship)'] === 'number' ? formatExcelDate(row['Start Date (Internship)']) : row['Start Date (Internship)'];

        return [
            row['USN'],
            row['Company'],
            row['Type'],
            row['CTC'],
            row['Category'],
            row['Remarks'],
            formattedOfferDate,
            formattedStartDateInternship
        ];
    });

    const insertQuery = `
        INSERT INTO placement (
            USN, Company, Type, CTC, Category, Remarks, Offer_Date, Start_Date_Internship
        ) VALUES ?`;

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            return res.status(500).send('Database error: ' + err.message);
        }
        res.send('Data inserted successfully.');
    });
});

app.delete('/delete', (req, res) => {
    const queries = [
        'SET FOREIGN_KEY_CHECKS = 0;',
        'TRUNCATE TABLE internship;',
        'TRUNCATE TABLE placement;',
        'TRUNCATE TABLE student;',
        'SET FOREIGN_KEY_CHECKS = 1;'
    ];

    const executeQuery = (query, callback) => {
        db.query(query, (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    };

    const runQueries = (index = 0) => {
        if (index >= queries.length) {
            return res.send('All data deleted successfully.');
        }

        executeQuery(queries[index], (err) => {
            if (err) {
                return res.status(500).send('Error deleting data: ' + err.message);
            }
            runQueries(index + 1);
        });
    };

    runQueries();
});


// Route handlers
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/students/upload', upload.single('file'), (req, res) => {
    uploadAndInsertData(req, res);
});

app.post('/internships/upload', upload.single('file'), (req, res) => {
    extractAndInsertInternshipData(req.file.path); // Call the function with the file path
    res.send('Internship data upload started.'); // Respond immediately
});

app.get('/all', getAllData);
app.get('/cato', getDreamOpenDreamCounts);

app.get('/ctc', async (req, res) => {
    try {
        const stats = await getPlacementCTCStats();
        console.log('Fetched Placement Stats:', stats); // Log for debugging
        res.json(stats);
    } catch (err) {
        console.error('Error fetching CTC stats:', err);
        res.status(500).json({ error: 'An error occurred while fetching CTC statistics' });
    }
});

app.get('/type', async (req, res) => {
    try {
        const statistics = await calculateOfferStatistics();
        res.json(statistics);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching offer statistics.');
    }
});

app.get('/campus', getOnOffCampusCounts);

app.post('/student', (req, res) => {
    const studentData = req.body;
    insertStudent(studentData, (err, results) => {
        if (err) {
            return res.status(500).send('Error inserting student data.');
        }
        res.send('Student data inserted successfully.');
    });
});

app.get('/student', (req, res) => {
    getAllStudents((err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving student data.');
        }
        res.status(200).json(results);
    });
});

app.post('/internship', (req, res) => {
    const internshipData = req.body;
    insertInternship(internshipData, (err, results) => {
        if (err) {
            return res.status(500).send('Error inserting internship data.');
        }
        res.send('Internship data inserted successfully.');
    });
});

app.get('/internship', (req, res) => {
    getAllInternships((err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving internship data.');
        }
        res.status(200).json(results);
    });
});

app.post('/placement', (req, res) => {
    const placementData = req.body;
    insertPlacement(placementData, (err, results) => {
        if (err) {
            return res.status(500).send('Error inserting placement data.');
        }
        res.send('Placement data inserted successfully.');
    });
});

app.get('/placement', (req, res) => {
    getAllPlacements((err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving placement data.');
        }
        res.status(200).json(results);
    });
});

// Use route handlers
app.use('/login', loginRoutes);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

// Start the server
app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
});
