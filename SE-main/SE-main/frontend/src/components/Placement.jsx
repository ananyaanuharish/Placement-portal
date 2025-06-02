import { useState, useEffect } from 'react';
import axios from 'axios';

const Placement = () => {
    const [originalData, setOriginalData] = useState([]);
    const [joinedData, setJoinedData] = useState([]);
    const [formData, setFormData] = useState({
        USN: '',
        Company: '',
        Type: '',
        CTC: '',
        Category: '',
        Remarks: '',
        Offer_Date: '',
        Start_Date_Internship: ''
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searched, setSearched] = useState(false);
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState(null); // State to handle file upload

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("https://se-server-yjpl.onrender.com/placement");
            setOriginalData(response.data);
            setJoinedData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateFormData = () => {
        const newErrors = {};
        const ctcRegex = /^\d+(\.\d{1,2})?$/; // Allows CTC values like 50000, 50000.50

        if (!formData.USN) newErrors.USN = "USN is required.";
        if (!formData.Company) newErrors.Company = "Company is required.";
        if (!formData.Type) newErrors.Type = "Type is required.";
        if (!ctcRegex.test(formData.CTC)) newErrors.CTC = "Invalid CTC format.";
        if (!formData.Category) newErrors.Category = "Category is required.";
        if (!formData.Remarks) newErrors.Remarks = "Remarks are required.";
        if (!formData.Offer_Date) newErrors.Offer_Date = "Offer Date is required.";
        if (!formData.Start_Date_Internship) newErrors.Start_Date_Internship = "Start Date (Internship) is required.";

        return newErrors;
    };

    const handleAddData = async () => {
        const validationErrors = validateFormData();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await axios.post("https://se-server-yjpl.onrender.com/placement", formData);
            setDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleSearch = () => {
        const trimmedSearchQuery = searchQuery.trim().toLowerCase();

        const filteredData = originalData.filter(row => {
            return (
                row.USN.toLowerCase().includes(trimmedSearchQuery) ||
                row.Company.toLowerCase().includes(trimmedSearchQuery) ||
                row.Remarks.toLowerCase().includes(trimmedSearchQuery) ||
                (row.Category.toLowerCase() === trimmedSearchQuery) // Exact match for Category
            );
        });

        setJoinedData(filteredData);
        setSearched(true);
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        setJoinedData(originalData);
        setSearched(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the file to state
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post("https://se-server-yjpl.onrender.com/upload/placement", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchData(); // Refresh the placement data after uploading
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Placement Data</h1>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by USN, Company, Category, or Remarks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>Search</button>
                </div>
            </div>

            {searched && (
                <button className="btn btn-secondary mb-3" onClick={handleResetSearch}>Reset Search</button>
            )}

            <div className="d-flex justify-content-between mb-3">
                {/* Add Data Button */}
                <button className="btn btn-primary" onClick={() => setDialogOpen(true)}>Add Data</button>

                {/* File Upload Section */}
                <div className="d-flex align-items-center ml-auto">
                    <input type="file" onChange={handleFileChange} className="mr-2" />
                    <button className="btn btn-success" onClick={handleFileUpload}>Upload File</button>
                </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>USN</th>
                            <th>Company</th>
                            <th>Type</th>
                            <th>CTC</th>
                            <th>Category</th>
                            <th>Remarks</th>
                            <th>Offer Date</th>
                            <th>Start Date (Internship)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {joinedData.map(row => (
                            <tr key={row.USN}>
                                <td>{row.USN}</td>
                                <td>{row.Company}</td>
                                <td>{row.Type}</td>
                                <td>{row.CTC}</td>
                                <td>{row.Category}</td>
                                <td>{row.Remarks}</td>
                                <td>{row.Offer_Date}</td>
                                <td>{row.Start_Date_Internship}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {dialogOpen && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Placement Data</h5>
                                <button type="button" className="close" onClick={() => setDialogOpen(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    name="USN"
                                    placeholder="USN"
                                    onChange={handleInputChange}
                                />
                                {errors.USN && <div className="text-danger">{errors.USN}</div>}
                                <input
                                    type="text"
                                    name="Company"
                                    placeholder="Company"
                                    onChange={handleInputChange}
                                />
                                {errors.Company && <div className="text-danger">{errors.Company}</div>}
                                <input
                                    type="text"
                                    name="Type"
                                    placeholder="Type"
                                    onChange={handleInputChange}
                                />
                                {errors.Type && <div className="text-danger">{errors.Type}</div>}
                                <input
                                    type="text"
                                    name="CTC"
                                    placeholder="CTC"
                                    onChange={handleInputChange}
                                />
                                {errors.CTC && <div className="text-danger">{errors.CTC}</div>}
                                <input
                                    type="text"
                                    name="Category"
                                    placeholder="Category"
                                    onChange={handleInputChange}
                                />
                                {errors.Category && <div className="text-danger">{errors.Category}</div>}
                                <input
                                    type="text"
                                    name="Remarks"
                                    placeholder="Remarks"
                                    onChange={handleInputChange}
                                />
                                {errors.Remarks && <div className="text-danger">{errors.Remarks}</div>}
                                <input
                                    type="date"
                                    name="Offer_Date"
                                    placeholder="Offer Date"
                                    onChange={handleInputChange}
                                />
                                {errors.Offer_Date && <div className="text-danger">{errors.Offer_Date}</div>}
                                <input
                                    type="date"
                                    name="Start_Date_Internship"
                                    placeholder="Start Date (Internship)"
                                    onChange={handleInputChange}
                                />
                                {errors.Start_Date_Internship && <div className="text-danger">{errors.Start_Date_Internship}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDialogOpen(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddData}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Placement;
