import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import 'bootswatch/dist/lux/bootstrap.min.css'; 
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import image1 from '../assets/rvce.logo.png';
import image2 from '../assets/rvce.write.png';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const View = () => {
    const [campusData, setCampusData] = useState(null);
    const [ctcData, setCtcData] = useState(null);
    const [typeData, setTypeData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campusResponse, ctcResponse, typeResponse, categoryResponse] = await Promise.all([
                    axios.get("https://se-server-yjpl.onrender.com/campus"),
                    axios.get("https://se-server-yjpl.onrender.com/ctc"),
                    axios.get("https://se-server-yjpl.onrender.com/type"),
                    axios.get("https://se-server-yjpl.onrender.com/cato"),
                ]);

                setCampusData(campusResponse.data);
                setCtcData(ctcResponse.data);
                setTypeData(typeResponse.data);
                setCategoryData(categoryResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const tableStyle = {
        marginBottom: '2rem'
    };

    const pieData = campusData ? {
        labels: ['On Campus', 'Off Campus'],
        datasets: [{
            data: [campusData.On_Campus, campusData.Off_Campus],
            backgroundColor: ['#007bff', '#dc3545'],
        }],
    } : null;

    const pieOptions = {
        maintainAspectRatio: false,
    };

    const barData = ctcData ? {
        labels: ['MAX CTC', 'Average CTC', 'Median CTC'],
        datasets: [{
            label: 'CTC Metrics (in Lakhs)',
            data: [ctcData['MAX of CTC (in lakhs)'], ctcData['Average CTC (in lakhs)'], ctcData['Median CTC (in lakhs)']],
            backgroundColor: ['#007bff', '#28a745', '#ffc107'],
        }],
    } : null;

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    const offerTypeBarData = typeData ? {
        labels: ['FTE', 'FTE+Internship', 'FTE+Internship (PBC)', 'Internship'],
        datasets: [{
            label: 'Offer Type Counts',
            data: [typeData.FTE, typeData['FTE+Internship'], typeData['FTE+Internship (PBC)'], typeData.Internship],
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
        }],
    } : null;

    const offerTypeBarOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    const categoryPieData = categoryData ? {
        labels: ['Dream', 'Open Dream', 'No PPO'],
        datasets: [{
            data: [categoryData.Dream, categoryData.Open_Dream, categoryData.No_PPO],
            backgroundColor: ['#007bff', '#28a745', '#ffc107'],
        }],
    } : null;

    const categoryPieOptions = {
        maintainAspectRatio: false,
    };

    const handleLogout = () => {
        navigate('/login'); 
    };
    
    const handleDeleteAllData = async () => {
        try {
            await axios.delete("https://se-server-yjpl.onrender.com/delete");
            alert('All data deleted successfully.');
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Error deleting data.');
        }
    };

    const downloadPDF = async () => {
        const pdf = new jsPDF('l', 'mm', 'a4'); // Create a landscape A4 PDF
    
        // Function to capture and add a graph to the PDF
        const addGraphToPDF = async (elementId, title) => {
            const input = document.getElementById(elementId); // Element to capture
            if (!input) {
                console.error(`Element with ID ${elementId} not found`);
                return;
            }
    
            const canvas = await html2canvas(input, { scale: 5 }); // Increase the scale for better resolution
            const imgData = canvas.toDataURL('image/png');
    
            const imgWidth = 100; // Width of the image
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate the height of the image
    
            // Add title if needed
            pdf.text(title, 10, 10); // Title position
    
            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight); // 20 units from the top
            pdf.addPage(); // Add a new page for the next graph
        };
    
        // Capture and add each graph to the PDF
        await addGraphToPDF('campus-graph', 'On Campus vs Off Campus');
        await addGraphToPDF('ctc-graph', 'CTC Statistics');
        await addGraphToPDF('offer-type-graph', 'Offer Type Statistics');
        await addGraphToPDF('category-graph', 'Category Statistics');
    
        // Remove the last page since it's empty
        pdf.deletePage(pdf.internal.getNumberOfPages());
    
        pdf.save('graphs.pdf'); // Save the PDF
    };
    
    return (
        <div className="container mt-5">
            <div style={{ position: 'absolute', top: '15px', left: '15px', margin: '10px' }}>
                <img src={image1} alt="RVCE Logo" style={{ width: '130px' }} />
            </div>
            <div style={{ position: 'absolute', top: '10px', right: '15px', margin: '10px' }}>
                <img src={image2} alt="RVCE" style={{ width: '300px' }} />
            </div>

            <div className="text-center">
                <h1 style={{ marginTop: '170px' }}>Placement Portal</h1>
            </div>
            <div className="d-flex justify-content-between mb-4" style={{ marginTop: '20px' }}>
                <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
                <button className="btn btn-success" onClick={() => navigate('/student')}>Student Data</button>
                <button className="btn btn-primary" onClick={() => navigate('/internship')}>Internship Data</button>
                <button className="btn btn-success" onClick={() => navigate('/placement')}>Placement Data</button>
            </div>

            <div>
                <hr className="my-4" />
            </div>

            <div className="text-center">
                <h2 style={{ marginTop: '30px' }}>On Campus vs Off Campus</h2>
            </div>
            {campusData ? (
                <div id="pdf-content"> {/* Single Div to capture for PDF */}
                    <table className="table table-bordered table-striped" style={tableStyle}>
                        <thead className="thead-dark">
                            <tr>
                                <th>Category</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>On Campus</td>
                                <td>{campusData.On_Campus}</td>
                            </tr>
                            <tr>
                                <td>Off Campus</td>
                                <td>{campusData.Off_Campus}</td>
                            </tr>
                            <tr>
                                <td>Grand Total</td>
                                <td>{campusData.Grand_Total}</td>
                            </tr>
                        </tbody>
                    </table>
                    {pieData && (
                        <div id="campus-graph" style={{ width: '340px', height: '340px', margin: 'auto' }}>
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    )}
                    <div>
                        <hr className="my-4" />
                    </div>
                    <div className="text-center">
                        <h2>CTC Statistics</h2>
                    </div>
                    {ctcData && (
                        <>
                            <table className="table table-bordered table-striped" style={tableStyle}>
                                <thead className="thead-dark">
                                    <tr>
                                        <th>CTC Metric</th>
                                        <th>Value (in lakhs)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>MAX of CTC</td>
                                        <td>{ctcData['MAX of CTC (in lakhs)']}</td>
                                    </tr>
                                    <tr>
                                        <td>Average CTC</td>
                                        <td>{ctcData['Average CTC (in lakhs)']}</td>
                                    </tr>
                                    <tr>
                                        <td>Median CTC</td>
                                        <td>{ctcData['Median CTC (in lakhs)']}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div id="ctc-graph" style={{ width: '340px', height: '340px', margin: 'auto' }}>
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </>
                    )}
                    <div>
                        <hr className="my-4" />
                    </div>
                    <div className="text-center">
                        <h2>Offer Type Statistics</h2>
                    </div>
                    {typeData && (
                        <>
                            <table className="table table-bordered table-striped" style={tableStyle}>
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Offer Type</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>FTE</td>
                                        <td>{typeData.FTE}</td>
                                    </tr>
                                    <tr>
                                        <td>FTE+Internship</td>
                                        <td>{typeData['FTE+Internship']}</td>
                                    </tr>
                                    <tr>
                                        <td>FTE+Internship (PBC)</td>
                                        <td>{typeData['FTE+Internship (PBC)']}</td>
                                    </tr>
                                    <tr>
                                        <td>Internship</td>
                                        <td>{typeData.Internship}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div id="offer-type-graph" style={{ width: '340px', height: '340px', margin: 'auto' }}>
                                <Bar data={offerTypeBarData} options={offerTypeBarOptions} />
                            </div>
                        </>
                    )}
                    <div>
                        <hr className="my-4" />
                    </div>
                    <div className="text-center">
                        <h2>Category Statistics</h2>
                    </div>
                    {categoryData && (
                        <>
                            <table className="table table-bordered table-striped" style={tableStyle}>
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Category</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Dream</td>
                                        <td>{categoryData.Dream}</td>
                                    </tr>
                                    <tr>
                                        <td>Open Dream</td>
                                        <td>{categoryData.Open_Dream}</td>
                                    </tr>
                                    <tr>
                                        <td>No PPO</td>
                                        <td>{categoryData.No_PPO}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div id="category-graph" style={{ width: '340px', height: '340px', margin: 'auto' }}>
                                <Pie data={categoryPieData} options={categoryPieOptions} />
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div>Loading data...</div>
            )}
            <div className="d-flex justify-content-between mt-5">
                <button className="btn btn-danger" onClick={handleDeleteAllData}>Delete All Data</button>
                <button className="btn btn-primary" onClick={downloadPDF}>Download PDF</button>
                <button className="btn btn-primary" onClick={() => navigate('/all')}>Data Page</button>
            </div>
        </div>
    );
};

export default View;
