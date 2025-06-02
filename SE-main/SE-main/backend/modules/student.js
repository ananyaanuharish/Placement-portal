const db = require('./db');

const insertStudent = (studentData, callback) => {
    const eligibility = studentData.Active_Backlogs > 0 ? 'Not eligible' : 'Eligible';
    
    const query = `
        INSERT INTO student (USN, Name, Department, Gender, Date_of_Birth, Email, Secondary_Email, Phone_Number, 10th_Percentage, 12th_Diploma_Percentage, BE_CGPA, Active_Backlogs, History_of_Backlogs, Eligibility_for_Placements)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        studentData.USN,
        studentData.Name,
        studentData.Department,
        studentData.Gender,
        studentData.Date_of_Birth,
        studentData.Email,
        studentData.Secondary_Email,
        studentData.Phone_Number,
        studentData['10th_Percentage'],
        studentData['12th_Diploma_Percentage'],
        studentData.BE_CGPA,
        studentData.Active_Backlogs,
        studentData.History_of_Backlogs,
        eligibility
    ];

    db.query(query, values, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

const getAllStudents = (callback) => {
    const query = 'SELECT * FROM student';

    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

module.exports = {
    insertStudent,
    getAllStudents,
};