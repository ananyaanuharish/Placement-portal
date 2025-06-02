import { useState, useEffect } from 'react';
import axios from 'axios';

const AllData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://se-server-yjpl.onrender.com/all");
                setData(response.data);
            } catch (err) {
                setError('Error fetching data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5" style={{ paddingRight: '10px', paddingBottom: '20px' }}>
            <h1 className="mb-4">All Data</h1>
            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'auto' }}>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>USN</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Secondary Email</th>
                            <th>Phone Number</th>
                            <th>10th Percentage</th>
                            <th>12th Diploma Percentage</th>
                            <th>BE CGPA</th>
                            <th>Active Backlogs</th>
                            <th>History of Backlogs</th>
                            <th>Eligibility for Placements</th>
                            <th>Internship Company</th>
                            <th>Internship Stipend</th>
                            <th>Internship Status</th>
                            <th>Internship Start Date</th>
                            <th>Internship Offer Type</th>
                            <th>Placement Company</th>
                            <th>Placement Type</th>
                            <th>Placement CTC</th>
                            <th>Placement Category</th>
                            <th>Placement Remarks</th>
                            <th>Placement Offer Date</th>
                            <th>Placement Start Date Internship</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.USN}</td>
                                <td>{item.Name}</td>
                                <td>{item.Department}</td>
                                <td>{item.Gender}</td>
                                <td>{item.Date_of_Birth}</td>
                                <td>{item.Email}</td>
                                <td>{item.Secondary_Email}</td>
                                <td>{item.Phone_Number}</td>
                                <td>{item['10th_Percentage']}</td>
                                <td>{item['12th_Diploma_Percentage']}</td>
                                <td>{item.BE_CGPA}</td>
                                <td>{item.Active_Backlogs}</td>
                                <td>{item.History_of_Backlogs}</td>
                                <td>{item.Eligibility_for_Placements}</td>
                                <td>{item.Internship_Company}</td>
                                <td>{item.Internship_Stipend}</td>
                                <td>{item.Internship_Status}</td>
                                <td>{item.Internship_Start_Date}</td>
                                <td>{item.Internship_Offer_Type}</td>
                                <td>{item.Placement_Company}</td>
                                <td>{item.Placement_Type}</td>
                                <td>{item.Placement_CTC}</td>
                                <td>{item.Placement_Category}</td>
                                <td>{item.Placement_Remarks}</td>
                                <td>{item.Placement_Offer_Date}</td>
                                <td>{item.Placement_Start_Date_Internship}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllData;
