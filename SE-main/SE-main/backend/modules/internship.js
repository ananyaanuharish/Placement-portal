const db = require('./db');

const insertInternship = (internshipData, callback) => {
    const query = `
        INSERT INTO internship (USN, Company, Stipend, Status, Start_Date, Offer_Type)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        internshipData.USN,
        internshipData.Company,
        internshipData.Stipend,
        internshipData.Status,
        internshipData.Start_Date,
        internshipData.Offer_Type
    ];

    db.query(query, values, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

const getAllInternships = (callback) => {
    const query = 'SELECT * FROM internship';

    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

module.exports = {
    insertInternship,
    getAllInternships,
};
