import { message } from 'antd';
import axios from 'axios';

const ReceiptRequest = async (request) => {
    const { RequestID } = request;

    try {
        const response = await axios.get(`https://dvs-be-sooty.vercel.app/api/requests/${RequestID}`, { withCredentials: true });

        if (response.status === 200) {
            const valuationData = response.data.request[0];
            const currentDate = new Date().toLocaleDateString('en-US');

            const printableContent = `
                <html>
                <head>
                    <title>Valuation Report</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.13/antd.min.css">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f2f5;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 800px;
                            margin: auto;
                            padding: 20px;
                            background-color: #fff;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            border-radius: 5px;
                        }
                        .header, .footer {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .header h1 {
                            color: #ff0000;
                            margin: 0;
                        }
                        .details {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                        }
                        .info {
                            flex: 1;
                            padding-right: 10px;
                        }
                        .info p {
                            margin: 10px 0;
                            font-size: 1.1em;
                            color: #666;
                        }
                        .info p strong {
                            color: #1890ff;
                        }
                        .diamond-image {
                            flex: 1;
                            text-align: right;
                            margin-top: 20px;
                        }
                        .diamond-image img {
                            max-width: 70%;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            padding: 5px;
                        }
                        .signature {
                            text-align: right;
                            margin-top: 50px;
                            padding-top: 20px;
                            border-top: 1px solid #ccc;
                        }
                        .signature img {
                            max-width: 100px;
                            height: auto;
                        }
                        .signature .sign {
                            margin-top: 20px;
                            font-size: 1.2em;
                            font-weight: bold;
                        }
                        .footer h3 {
                            color: #1890ff;
                            margin: 0;
                        }
                        .footer p {
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Receipt Request</h1>
                        </div>
                        <div class="details">
                            <div class="info">
                                <p><strong>Print Date:</strong> ${currentDate}</p>
                                <p><strong>Appointment Date:</strong> ${new Date(valuationData.appointmentDate).toLocaleDateString('en-US')}</p>
                                <p><strong>Payment Status:</strong> ${valuationData.paymentStatus}</p>
                                <p><strong>Customer:</strong> ${valuationData.firstName} ${valuationData.lastName}</p>
                                <p><strong>Note:</strong> ${valuationData.note}</p>
                            </div>
                            <div class="diamond-image">
                                <img src="${valuationData.requestImage}" alt="Diamond Image"/>
                            </div>
                        </div>
                        <div class="signature">
                            <p>Authorized Signature:</p>
                            <img src="https://clipground.com/images/make-signature-clipart-1.jpg" alt="Signature"/>
                            <p class="sign">Brian</p>
                            <p>Valuation Expert</p>
                        </div>
                        <div class="footer">
                            <h3>Diamond Valuation</h3>
                            <p>VRG2+27 Dĩ An, Bình Dương, Việt Nam</p>
                            <p>Phone: 0032-3-233-91-60</p>
                            <p>Email: diamondvaluation@gmail.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(printableContent);
                printWindow.document.close();
                printWindow.print();
            } else {
                message.error('Failed to open print window. Please allow pop-ups for this site.');
            }
        } else if (response.status === 404) {
            message.error('Valuation report not found. Please check the request ID.');
        } else {
            message.error('Failed to fetch valuation report. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching valuation report:', error);
        message.error('Error fetching valuation report. Please try again later.');
    }
};

export default ReceiptRequest;
