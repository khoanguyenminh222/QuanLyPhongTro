import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BillDetailModal = ({ token, bill, onClose }) => {
    const [maxElectricity, setMaxElectricity] = useState(0);
    const [maxWater, setMaxWater] = useState(0);
    const [electricityCost, setElectricityCost] = useState('');
    const [waterCost, setWaterCost] = useState('');
    const [otherCostsTotal, setOtherCostsTotal] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    if (!bill) return null;

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };

    useEffect(() => {
        const fetchConfig = async () => {
            const response = await axios.get('/api/config', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMaxElectricity(response.data.maxElectricity);
            setMaxWater(response.data.maxWater);
        };
        fetchConfig();
    }, [])

    useEffect(() => {
        const calculate = () => {
            let electricityUsage;
            if (bill.currentElectricity < bill.previousElectricity) {
                // Trường hợp đồng hồ điện quay về 0
                electricityUsage = (maxElectricity - bill.previousElectricity + 1) + parseInt(bill.currentElectricity);
            } else {
                electricityUsage = bill.currentElectricity - bill.previousElectricity;
            }

            let waterUsage;
            if (bill.currentWater < bill.previousWater) {
                // Trường hợp đồng hồ nước quay về 0
                waterUsage = (maxWater - bill.previousWater + 1) + parseInt(bill.currentWater);
            } else {
                waterUsage = bill.currentWater - bill.previousWater;
            }
            const calculatedElectricityCost = electricityUsage * bill.electricityRate;
            const calculatedWaterCost = waterUsage * bill.waterRate;
            const calculatedOtherCostsTotal = bill.otherCosts.reduce((total, cost) => total + cost.amount, 0);
            const calculatedTotalAmount = calculatedElectricityCost + calculatedWaterCost + calculatedOtherCostsTotal + bill.rent;

            setElectricityCost(calculatedElectricityCost);
            setWaterCost(calculatedWaterCost);
            setOtherCostsTotal(calculatedOtherCostsTotal);
            setTotalAmount(calculatedTotalAmount);
        }
        calculate();
    }, [maxElectricity, maxWater])

    return (
        <div className="container w-full flex justify-center items-center mx-auto px-3 relative">
            <div className="fixed z-20 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Thông tin tính toán</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="month">Tháng:</label>
                        <input
                            type="text"
                            id="month"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            disabled
                            value={bill.month}
                        />
                    </div>
                    <div className="mb-4">
                        {bill.currentElectricity < bill.previousElectricity ?
                            <p>Điện: {formatNumber(bill.currentElectricity)} . {maxElectricity-bill.previousElectricity+1+bill.currentElectricity} kí * {formatNumber(bill.electricityRate)} đ = {formatNumber(electricityCost)} đ</p>
                            :
                            <p>Điện: {formatNumber(bill.previousElectricity)} . {bill.currentElectricity-bill.previousElectricity} kí * {formatNumber(bill.electricityRate)} đ = {formatNumber(electricityCost)} đ</p>
                        }
                        {bill.currentWater < bill.previousWater ?
                            <p>Nước: {formatNumber(bill.currentWater)} . {maxWater-bill.previousWater+1+bill.currentWater} khối * {formatNumber(bill.waterRate)} đ = {formatNumber(waterCost)} đ</p>
                            :
                            <p>Nước: {formatNumber(bill.previousWater)} . {bill.currentWater-bill.previousWater} khối * {formatNumber(bill.waterRate)} đ = {formatNumber(waterCost)} đ</p>
                        }
                        {Array.isArray(bill.otherCosts) && bill.otherCosts.length > 0 && (
                            <div className="mb-2">
                                <h3 className="font-semibold">Chi phí khác:</h3>
                                <ul className="list-disc list-inside">
                                    {bill.otherCosts.map((cost, index) => (
                                        <li key={index}>{cost.description}: <span>{formatNumber(cost.amount).toLocaleString()} đ</span></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <p>Tổng chi phí khác: {formatNumber(otherCostsTotal)} đ</p>
                        <p>Tiền nhà: {formatNumber(bill.rent)} đ</p>
                        <p className='font-bold text-2xl mt-2 text-red-600'>Thành tiền: {formatNumber(totalAmount)} đ</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillDetailModal;
