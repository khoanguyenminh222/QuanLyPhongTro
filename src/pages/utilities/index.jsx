import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { useRouter } from 'next/router';

function UtilitiesPage({ token }) {
  const router = useRouter();
  const [maxElectricity, setMaxElectricity] = useState('');
  const [maxWater, setMaxWater] = useState('');

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

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/api/config', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMaxElectricity(response.data.maxElectricity);
        setMaxWater(response.data.maxWater);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };
    fetchConfig();
  }, [token]);

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/config', { maxElectricity, maxWater }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Header token={token} />
      <div className="container w-full flex justify-center items-center mx-auto px-3">
        <div className='bg-white mx-auto px-4 py-3 my-4 rounded-md shadow-xl'>
          <h1 className="text-3xl font-bold mt-8 mb-4">Cấu hình hệ thống</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxElectricity">Số điện tối đa</label>
            <input
              type="number"
              id="maxElectricity"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={maxElectricity}
              onChange={(e) => setMaxElectricity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxWater">Số nước tối đa</label>
            <input
              type="number"
              id="maxWater"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={maxWater}
              onChange={(e) => setMaxWater(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export { getServerSideProps };
export default UtilitiesPage;
