import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Header from '@/components/Header';

function BillPage() {
  const router = useRouter();
  const { roomId } = router.query;

  const [electricity, setElectricity] = useState('');
  const [water, setWater] = useState('');
  const electricityRate = 3000; // Giá điện mỗi kWh
  const waterRate = 5000; // Giá nước mỗi m³
  const [total, setTotal] = useState(0);

  const handleCalculate = () => {
    const electricityCost = electricity * electricityRate;
    const waterCost = water * waterRate;
    const totalCost = electricityCost + waterCost;
    setTotal(totalCost);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mt-8 mb-4">Tạo Hóa đơn cho Phòng #{roomId}</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="electricity">Số điện (kWh)</label>
          <input
            type="number"
            id="electricity"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={electricity}
            onChange={(e) => setElectricity(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="water">Số nước (m³)</label>
          <input
            type="number"
            id="water"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={water}
            onChange={(e) => setWater(e.target.value)}
          />
        </div>
        <button
          onClick={handleCalculate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Tính Toán
        </button>
        <div className="mt-4">
          <h2 className="text-xl font-bold">Tổng Tiền: {total} VND</h2>
        </div>
      </div>
    </>
  );
}

export default BillPage