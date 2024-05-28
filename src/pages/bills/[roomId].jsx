import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
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
  const [maxElectricity, setMaxElectricity] = useState(9999);
  const [maxWater, setMaxWater] = useState(9999);
  const [viewHistory, setViewHistory] = useState(false);

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  useEffect(() => {
    if (!roomId) {
      router.push('/rooms'); // Chuyển hướng người dùng đến trang danh sách phòng
    } else {
      const fetchRoom = async () => {
        const response = await axios.get(`/api/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRoom(response.data)
      };
      fetchRoom();
      setCurrentDate(getCurrentDate());

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
    }
  }, [roomId, token])

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

  const handleCalculate = async () => {
    if (!electricityCurrent || !waterCurrent) {
      toast.warning("Yêu cầu điền đủ thông tin");
      return;
    }

    let electricityUsage;
    if (electricityCurrent < room.electricity) {
      // Trường hợp đồng hồ điện quay về 0
      electricityUsage = (maxElectricity - room.electricity + 1) + parseInt(electricityCurrent);
    } else {
      electricityUsage = electricityCurrent - room.electricity;
    }

    let waterUsage;
    if (waterCurrent < room.water) {
      // Trường hợp đồng hồ nước quay về 0
      waterUsage = (maxWater - room.water + 1) + parseInt(waterCurrent);
    } else {
      waterUsage = waterCurrent - room.water;
    }
    const calculatedElectricityCost = electricityUsage * room.electricityRate;
    const calculatedWaterCost = waterUsage * room.waterRate;
    const calculatedOtherCostsTotal = room.otherCosts.reduce((total, cost) => total + cost.amount, 0);
    const calculatedTotalAmount = calculatedElectricityCost + calculatedWaterCost + calculatedOtherCostsTotal + room.rent;

    setElectricityCost(calculatedElectricityCost);
    setWaterCost(calculatedWaterCost);
    setOtherCostsTotal(calculatedOtherCostsTotal);
    setTotalAmount(calculatedTotalAmount);
    setShowModal(true);
  };

  const handleSaveBill = async () => {
    try {
      const response = await axios.post('/api/bills', {
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
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message);
        setViewHistory(true);
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
      <Header token={token} />
      <div className="container w-full flex justify-center items-center mx-auto px-3 relative">
        <div className='bg-white mx-auto px-4 py-3 my-4 rounded-md shadow-xl'>
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
                  value={currentDate}
                />
              </div>
              <div className="mb-4">
                {electricityCurrent < room.electricity ?
                  <p>Điện: ({formatNumber(maxElectricity)} - {formatNumber(room.electricity)} + 1 + {formatNumber(electricityCurrent)}) * {formatNumber(room.electricityRate)} đ = {formatNumber(electricityCost)} đ</p>
                  :
                  <p>Điện: ({formatNumber(electricityCurrent)} - {formatNumber(room.electricity)}) * {formatNumber(room.electricityRate)} đ = {formatNumber(electricityCost)} đ</p>
                }
                {waterCurrent < room.water ?
                  <p>Nước: ({formatNumber(maxWater)} - {formatNumber(room.water)} + 1 + {formatNumber(waterCurrent)}) * {formatNumber(room.waterRate)} đ = {formatNumber(waterCost)} đ</p>
                  :
                  <p>Nước: ({formatNumber(waterCurrent)} - {formatNumber(room.water)}) * {formatNumber(room.waterRate)} đ = {formatNumber(waterCost)} đ</p>
                }
                {Array.isArray(room.otherCosts) && room.otherCosts.length > 0 && (
                  <div className="mb-2">
                    <h3 className="font-semibold">Chi phí khác:</h3>
                    <ul className="list-disc list-inside">
                      {room.otherCosts.map((cost, index) => (
                        <li key={index}>{cost.description}: <span>{formatNumber(cost.amount).toLocaleString()} đ</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                <p>Tổng chi phí khác: {formatNumber(otherCostsTotal)} đ</p>
                <p>Tiền nhà: {formatNumber(room.rent)} đ</p>
                <p className='font-bold text-2xl mt-4 text-red-700'>Thành tiền: {formatNumber(totalAmount)} đ</p>
              </div>
              <div className='grid grid-cols-2 mb-3'>
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
              {viewHistory &&
                <Link href={`/history/${roomId}`} legacyBehavior>
                  <a className="text-blue-500 hover:underline"><FontAwesomeIcon icon={faFile} /> Xem lịch sử</a>
                </Link>
              }
            </div>
          </div>
        )}
      </div>


      <ToastContainer />
    </>
  );
}

export { getServerSideProps };
export default BillPage