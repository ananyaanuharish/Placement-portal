const db = require('./db');

const insertPlacement = (placementData, callback) => {
    const query = `
        INSERT INTO placement (USN, Company, Type, CTC, Category, Remarks, Offer_Date, Start_Date_Internship)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        placementData.USN,
        placementData.Company,
        placementData.Type,
        placementData.CTC,
        placementData.Category,
        placementData.Remarks,
        placementData.Offer_Date,
        placementData.Start_Date_Internship
    ];

    db.query(query, values, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

const getAllPlacements = (callback) => {
    const query = 'SELECT * FROM placement';

    db.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

module.exports = {
    insertPlacement,
    getAllPlacements,
};
