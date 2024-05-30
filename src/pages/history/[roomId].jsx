import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { getServerSideProps } from '@/helpers/cookieHelper';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import BillDetailModal from '@/components/BillDetailModal';

function historyPage({ token }) {
    const router = useRouter();
    const { roomId } = router.query;
    const [room, setRoom] = useState([])
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        const checkConfig = async () => {
            // Kiểm tra cấu hình của người dùng
            const res = await axios.get('/api/config/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.configured) {
                
            } else {
                router.push('/settings'); // Chuyển hướng đến trang cấu hình
            }
        }
        checkConfig();
    }, [])

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get('/api/bills/years', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setYears(response.data);
            } catch (error) {
                console.error('Failed to fetch years:', error);
            }
        };
        fetchYears();
    }, []);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    useEffect(() => {
        if (!roomId) {
            router.push('/rooms'); // Chuyển hướng người dùng đến trang danh sách phòng
        } else {
            const fetchBills = async () => {
                if (roomId) {
                    try {
                        const response = await axios.get(`/api/bills?roomId=${roomId}${selectedYear ? `&year=${selectedYear}` : ''}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setBills(response.data);
                    } catch (error) {
                        console.error('Failed to fetch bills:', error);
                    }
                }
            };
            fetchBills();

            const fetchRoom = async () => {
                const response = await axios.get(`/api/rooms/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRoom(response.data)
            };
            fetchRoom();
        }

    }, [roomId, selectedYear]);

    const openModal = (bill) => {
        setSelectedBill(bill);
    };

    const closeModal = () => {
        setSelectedBill(null);
    };

    return (
        <>
            <Header token={token} />
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-4">Lịch sử hóa đơn # Phòng {room.name}</h1>
                <div className="flex items-center mb-4">
                    <label htmlFor="year" className="mr-2">Chọn năm:</label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">-- Chọn năm --</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bills.map((bill) => (
                        <div key={bill._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg relative">
                            <h2 className="text-2xl font-semibold mb-4">Tháng: {bill.month}</h2>
                            <div className="mb-4">
                                <p className="text-lg font-medium">Điện:</p>
                                <p className="text-gray-700">{bill.previousElectricity} - {bill.currentElectricity} kWh</p>
                                <p className="text-gray-500">Giá: {formatNumber(bill.electricityRate)} đ/kWh</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-lg font-medium">Nước:</p>
                                <p className="text-gray-700">{bill.previousWater} - {bill.currentWater} m³</p>
                                <p className="text-gray-500">Giá: {formatNumber(bill.waterRate)} đ/m³</p>
                            </div>
                            {bill.otherCosts.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-lg font-medium">Chi phí khác:</p>
                                    {bill.otherCosts.map(cost => (
                                        <div key={cost._id} className="text-gray-700">
                                            <p>{cost.description}: {formatNumber(cost.amount)} đ</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mb-4">
                                <p className="text-lg font-medium">Tiền nhà:</p>
                                <p className="text-gray-700">{formatNumber(bill.rent)} đ</p>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-xl font-bold text-red-600">Tổng cộng: {formatNumber(bill.total)} đ</p>
                            </div>
                            <button
                                onClick={() => openModal(bill)}
                                className="absolute top-6 right-4 text-blue-500 hover:text-blue-700"
                            >
                                <FontAwesomeIcon icon={faInfoCircle} fontSize={24} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {selectedBill && (
                <BillDetailModal token={token} bill={selectedBill} onClose={closeModal} />
            )}
        </>
    )
}

export { getServerSideProps };
export default historyPage