import React from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

const historyData = {
    1: [
        { month: 'January', total: 500000 },
        { month: 'February', total: 450000 },
    ],
    2: [
        { month: 'January', total: 0 },
        { month: 'February', total: 0 },
    ],
    3: [
        { month: 'January', total: 600000 },
        { month: 'February', total: 550000 },
    ],
    // Thêm dữ liệu lịch sử cho các phòng khác
};

function historyPage() {
    const router = useRouter();
    const { roomId } = router.query;

    const roomHistory = historyData[roomId] || [];
    return (
        <>
            <Header />
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mt-8 mb-4">Lịch sử Hóa đơn cho Phòng #{roomId}</h1>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200">Tháng</th>
                                <th className="py-2 px-4 border-b border-gray-200">Tổng Tiền (VND)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomHistory.map((record, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b border-gray-200">{record.month}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{record.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default historyPage