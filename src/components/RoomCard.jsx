import React from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';

function RoomCard({ user, room, onEdit, onDelete, onEditStatus }) {
  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white relative">
      <button onClick={onEditStatus} className="ml-2 text-blue-500 hover:underline focus:outline-none absolute top-4 right-4">
        {room.status == false ? <FontAwesomeIcon className='text-black' fontSize={30} icon={faToggleOff} /> : <FontAwesomeIcon className='text-green-500' fontSize={30} icon={faToggleOn} />}
      </button>
      {user.role == "admin" && <p>{room.userId.fullname}</p>}
      <h2 className="text-xl font-bold mb-2 capitalize">Phòng {room.name}</h2>
      <p className="mb-2">Trạng thái: {room.status == false ? <span className='text-red-500'>Đang trống</span> : <span className='text-green-500'>Đang thuê</span>}  </p>
      <p className="mb-2">Tiền phòng: <span className="font-bold text-green-800">{formatNumber(room.rent).toLocaleString()} VND</span></p>
      <p className="mb-2">Tiền điện: <span className="font-bold text-blue-800">{formatNumber(room.electricityRate).toLocaleString()} VND/kWh</span></p>
      <p className="mb-2">Tiền nước: <span className="font-bold text-purple-800">{formatNumber(room.waterRate).toLocaleString()} VND/m³</span></p>
      <p className="mb-2">Số điện hiện tại: {formatNumber(room.electricity).toLocaleString()} kWh</p>
      <p className="mb-2">Số nước hiện tại: {formatNumber(room.water).toLocaleString()} m³</p>
      {Array.isArray(room.otherCosts) && room.otherCosts.length>0 && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-red-700">Chi phí khác:</h3>
          <ul className="list-disc list-inside text-red-800">
            {room.otherCosts.map((cost, index) => (
              <li className='capitalize' key={index}>{cost.description}: <span className="font-bold">{formatNumber(cost.amount).toLocaleString()} VND</span></li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex space-x-4 mb-4">
        <Link href={`/bills/${room._id}`} legacyBehavior>
          <a className="text-blue-500 hover:underline">Tạo Hóa đơn</a>
        </Link>
        <Link href={`/history/${room._id}`} legacyBehavior>
          <a className="text-blue-500 hover:underline">Lịch sử</a>
        </Link>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onEdit}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Xóa
        </button>
      </div>
    </div>
  )
}

export default RoomCard