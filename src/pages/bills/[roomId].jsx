import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getServerSideProps } from '@/helpers/cookieHelper';

function BillPage({ token }) {
  const router = useRouter();
  const { roomId } = router.query;
  const [room, setRoom] = useState([])
  const [electricityCurrent, setElectricityCurrent] = useState('');
  const [waterCurrent, setWaterCurrent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  useEffect(() => {
    if (!roomId) {
      router.push('/rooms'); // Chuyển hướng người dùng đến trang danh sách phòng
    } else {
      const fetchRoom = async () => {
        const response = await axios.get(`/api/rooms/${roomId}`);
        setRoom(response.data)
      };
      fetchRoom();
      setCurrentDate(getCurrentDate());
    }
  }, [roomId])

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Thêm 0 phía trước nếu tháng < 10
    const day = date.getDate().toString().padStart(2, '0'); // Thêm 0 phía trước nếu ngày < 10
    return `${day}-${month}-${year}`;
  };

  const [electricityCost, setElectricityCost] = useState('');
  const [waterCost, setWaterCost] = useState('');
  const [otherCostsTotal, setOtherCostsTotal] = useState('');

  const handleCalculate = () => {
    if (!electricityCurrent || !waterCurrent) {
      toast.warning("Yêu cầu điền đủ thông tin");
      return;
    }
    setElectricityCost((electricityCurrent - room.electricity) * room.electricityRate);
    setWaterCost((waterCurrent - room.water) * room.waterRate);
    setOtherCostsTotal(room.otherCosts.reduce((total, cost) => total + cost.amount, 0));
    setTotalAmount(electricityCost + waterCost + otherCostsTotal + room.rent)
    setShowModal(true);
  };

  const handleSaveBill = async () => {
    try {
      const response = await axios.post('/api/savebill', {
        roomId: roomId,
        month: currentDate,
        previousElectricity: room.electricity,
        currentElectricity: electricityCurrent,
        electricityRate: room.electricityRate,
        previousWater: room.water,
        currentWater: waterCurrent,
        waterRate: room.waterRate,
        otherCosts: room.otherCosts,
        rent: room.rent,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message);
        //setShowModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }

  return (
    <>
      <Header token={token}/>
      <div className="container mx-auto px-4 py-3 mt-4 mb-4 bg-white">
        <Link href="/rooms" legacyBehavior>
          <a className="text-blue-500 hover:underline">Quay lại</a>
        </Link>
        <h1 className="text-3xl font-bold mt-8 mb-4">Tạo Hóa đơn cho Phòng #{room.name}</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="electricity">Số điện (kWh) - trên đồng hồ điện</label>
          <input
            type="number"
            id="electricity"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={electricityCurrent}
            onChange={(e) => setElectricityCurrent(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="water">Số nước (m³) - trên đồng hồ nước</label>
          <input
            type="number"
            id="water"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={waterCurrent}
            onChange={(e) => setWaterCurrent(e.target.value)}
          />
        </div>
        <button
          onClick={handleCalculate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Tính Toán
        </button>
      </div>

      {/* Modal bill */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Thông tin tính toán</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="month">Tháng:</label>
              <input
                type="text"
                id="month"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled
                value={currentDate}
              />
            </div>
            <div className="mb-4">
              <p>Điện: ({formatNumber(electricityCurrent)} - {formatNumber(room.electricity)}) * {formatNumber(room.electricityRate)} đ = {formatNumber(electricityCost)} đ</p>
              <p>Nước: ({formatNumber(waterCurrent)} - {formatNumber(room.water)}) * {formatNumber(room.waterRate)} đ = {formatNumber(waterCost)} đ</p>
              {Array.isArray(room.otherCosts) && room.otherCosts.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold text-red-700">Chi phí khác:</h3>
                  <ul className="list-disc list-inside text-red-800">
                    {room.otherCosts.map((cost, index) => (
                      <li key={index}>{cost.description}: <span>{formatNumber(cost.amount).toLocaleString()} đ</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <p>Tổng chi phí khác: {formatNumber(otherCostsTotal)} đ</p>
              <p>Tiền nhà: {formatNumber(room.rent)} đ</p>
              <p className='font-bold text-2xl'>Thành tiền: {formatNumber(totalAmount)} đ</p>
            </div>
            <div className='grid grid-cols-2'>
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-200 bg-white-500 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mr-1"
              >
                Đóng
              </button>
              <button
                onClick={() => handleSaveBill()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ml-1"
              >
                Lưu
              </button>
            </div>

          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export { getServerSideProps };
export default BillPage