import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    InboxOutlined,
    MinusCircleOutlined,
    PhoneOutlined,
    PrinterOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Radio, Row, Table, Tag } from 'antd';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import MySpin from '../../components/MySpin';
import handlePrintCommitmentReport from './CommitmentRequest';
import handlePrintSealingReport from './SealingReport';
import SignatureModal from './SignatureCanvas';

const RequestApproval = () => {
    const [requests, setRequests] = useState([]);
    const [serviceFilter, setServiceFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signatureUrl, setSignatureUrl] = useState(null);
    const [signName, setSignName] = useState('');
    const [recordForPrint, setRecordForPrint] = useState(null);

    useEffect(() => {
        const getAllRequests = async () => {
            setLoading(true);
            try {
                const res = await axios.get('https://dvs-be-sooty.vercel.app/api/request-approved', {
                    withCredentials: true,
                });
                setLoading(false);
                setRequests(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAllRequests();
    }, []);

    const statusColors = {
        Pending: 'blue',
        'Booked Appointment': 'cyan',
        Received: 'green',
        Approved: 'gold',
        'In Progress': 'gold',
        'Sent to Valuation': 'purple',
        Completed: 'green',
        'Start Valuated': 'gold',
        Valuated: 'purple',
        Commitment: 'orange',
        Sealing: 'orange',
        'Result Sent to Customer': 'purple',
        'Received for Valuation': 'cyan',
        'Sent to Consulting': 'cyan',
        Unprocessed: 'red',
        'Ready for valuation': 'blue',
        Done: 'green',
    };

    const serviceColors = {
        Sealing: 'red',
        Commitment: 'blue',
    };

    const statusIcons = {
        Pending: <ClockCircleOutlined />,
        'Booked Appointment': <PhoneOutlined />,
        Received: <InboxOutlined />,
        Approved: <ExclamationCircleOutlined />,
        'In Progress': <ClockCircleOutlined />,
        'Sent to Valuation': <ClockCircleOutlined />,
        Completed: <CheckCircleOutlined />,
        'Start Valuated': <ClockCircleOutlined />,
        Valuated: <ExclamationCircleOutlined />,
        Commitment: <ClockCircleOutlined />,
        Sealing: <ClockCircleOutlined />,
        'Result Sent to Customer': <ExclamationCircleOutlined />,
        'Received for Valuation': <InboxOutlined />,
        'Sent to Consulting': <InboxOutlined />,
        Unprocessed: <MinusCircleOutlined />,
        'Ready for valuation': <CheckCircleOutlined />,
        Done: <CheckCircleOutlined />,
    };

    const renderActionButtons = (text, record) => {
        const isProcessMatchingType = record.processStatus === record.requestType;
        const isSealed = record.requestType === 'Sealing' && signName !== '' && signatureUrl !== null;
        const isCommitted = record.requestType === 'Commitment' && signName !== '' && signatureUrl !== null;

        if (isProcessMatchingType) {
            if (isSealed) {
                return (
                    <Button
                        onClick={() => handlePrintSealingReport(record, signatureUrl, signName)}
                        style={{ backgroundColor: '#007bff', color: '#fff', border: 'none' }}
                    >
                        <PrinterOutlined /> Print Sealing Report
                    </Button>
                );
            } else if (record.requestType === 'Commitment') {
                return (
                    <>
                        {isCommitted ? (
                            <Button
                                onClick={() => handlePrintCommitmentReport(record, signatureUrl, signName)}
                                style={{ backgroundColor: '#007bff', color: '#fff', border: 'none' }}
                            >
                                <PrinterOutlined /> Print Commitment Report
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={() => handlePrintCommitmentReport(record, setShowSignatureModal, setRecordForPrint, true)}
                                    style={{ backgroundColor: '#007bff', color: '#fff', border: 'none' }}
                                >
                                    <PrinterOutlined /> Read Commitment Report
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowSignatureModal(true);
                                        setRecordForPrint(record);
                                    }}
                                    style={{ backgroundColor: '#007bff', color: '#fff', border: 'none' }}
                                >
                                    Sign
                                </Button>
                            </>
                        )}
                    </>
                );
            } else {
                return (
                    <Button
                        onClick={() => {
                            setShowSignatureModal(true);
                            setRecordForPrint(record);
                        }}
                        style={{ backgroundColor: '#007bff', color: '#fff', border: 'none' }}
                    >
                        Sign
                    </Button>
                );
            }
        } else {
            return (
                <Button disabled style={{ backgroundColor: '#d9d9d9', color: '#fff', border: 'none' }}>
                    Sign
                </Button>
            );
        }
    };



    const columns = [
        {
            title: 'No.',
            dataIndex: 'requestId',
            key: 'requestId',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Image',
            dataIndex: 'requestImage',
            key: 'requestImage',
            render: (image) => <img src={image} alt="Request" style={{ width: '50px', height: '50px' }} />,
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Created Date',
            dataIndex: 'RequestCreatedDate',
            key: 'RequestCreatedDate',
            render: (date) => new Date(date).toLocaleDateString('en-GB'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Process',
            key: 'process',
            dataIndex: 'processStatus',
            render: (processStatus, record) => (
                <Tag icon={statusIcons[processStatus]} color={statusColors[processStatus]}>
                    {processStatus || 'Unprocessed'}
                </Tag>
            ),
        },
        {
            title: 'Request Type',
            key: 'service',
            dataIndex: 'requestType',
            render: (requestType) => <Tag color={serviceColors[requestType]}>{requestType}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            render: renderActionButtons,
        },
    ];

    const handleServiceFilterChange = (e) => {
        setServiceFilter(e.target.value);
    };

    const uploadSignatureToFirebase = async (signatureUrl) => {
        const byteArray = Uint8Array.from(atob(signatureUrl.split(',')[1]), (c) => c.charCodeAt(0));
        try {
            const storage = getStorage();
            const storageRef = ref(storage, 'signatures/' + new Date().getTime() + '.png');
            const snapshot = await uploadBytes(storageRef, byteArray);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setSignatureUrl(downloadURL);
            console.log('Signature uploaded:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleSubmitUploadSignature = async (signature, name) => {
        setSignName(name); // Set signName state with name input
        await uploadSignatureToFirebase(signature);
    };

    const handlePrintSealingReportAfterSigning = async () => {
        // Check if all necessary data is available
        if (recordForPrint && signatureUrl && signName) {
            if (recordForPrint.requestType === 'Sealing') {
                handlePrintSealingReport(recordForPrint, signatureUrl, signName);
            } else if (recordForPrint.requestType === 'Commitment') {
                handlePrintCommitmentReport(recordForPrint);
            }
        } else {
            console.warn('Cannot print report: Missing data.');
        }
    };

    const filteredRequests = requests.filter((request) => {
        if (serviceFilter !== 'All' && request.requestType !== serviceFilter) {
            return false;
        }
        return true;
    });

    if (loading) return <MySpin />;

    return (
        <div className="tabled">
            <Row gutter={[24, 0]}>
                <Col xs={24} xl={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title="Requests Table"
                        extra={
                            <div style={{ margin: '10px 0' }}>
                                <Radio.Group onChange={handleServiceFilterChange} defaultValue="All">
                                    <Radio.Button value="All">All</Radio.Button>
                                    <Radio.Button value="Sealing">Sealing</Radio.Button>
                                    <Radio.Button value="Commitment">Commitment</Radio.Button>
                                </Radio.Group>
                            </div>
                        }
                    >
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                dataSource={filteredRequests}
                                pagination={{ pageSize: 10 }}
                                className="ant-border-space"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
            <SignatureModal
                visible={showSignatureModal}
                onCancel={() => {
                    setShowSignatureModal(false);
                    setRecordForPrint(null); // Reset record for print when modal closes
                }}
                onSubmit={handleSubmitUploadSignature}
            />
            {recordForPrint && (
                <Button
                    onClick={handlePrintSealingReportAfterSigning}
                    style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', marginTop: '10px' }}
                >
                    <PrinterOutlined /> Print Report
                </Button>
            )}
        </div>
    );
};

export default RequestApproval;
