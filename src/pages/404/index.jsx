import React from 'react'
import Link from 'next/link';

function index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Không tìm thấy trang</h1>
      <p className="mb-4">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Link href="/rooms" legacyBehavior>
        <a className="text-blue-500 hover:underline">Trở về trang Danh sách Phòng trọ</a>
      </Link>
    </div>
  )
}

export default index