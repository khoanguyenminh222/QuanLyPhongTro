import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Header from '@/components/Header';
import TenantModal from '@/components/TenantModal';

function TenantPage({ token }) {
    const router = useRouter();
    const { roomId } = router.query;
    const [room, setRoom] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);

    useEffect(() => {
        const checkConfig = async () => {
            // Kiểm tra cấu hình của người dùng
            const res = await axios.get('/api/config/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.configured) {
                router.push('/rooms'); // Chuyển hướng đến trang danh sách phòng
            } else {
                router.push('/settings'); // Chuyển hướng đến trang cấu hình
            }
        }
        checkConfig();
    }, [])

    useEffect(() => {
        if (roomId) {
            fetchTenants();
            fetchRoom();
        }
    }, [roomId]);

    const fetchTenants = async () => {
        try {
            const response = await axios.get(`/api/tenants?roomId=${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTenants(response.data);
        } catch (error) {
            console.error('Failed to fetch tenants', error);
        }
    };

    const fetchRoom = async () => {
        const response = await axios.get(`/api/rooms/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setRoom(response.data)
    };

    const handleSaveTenant = async (tenant) => {
        try {
            if (editingTenant) {
                const response = await axios.put(`/api/tenants/${editingTenant._id}`, tenant, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status >= 200 && response.status < 300) {
                    toast.success(response.data.message)
                    fetchTenants();
                } else {
                    toast.error(response.data.message)
                }
            } else {
                const response = await axios.post('/api/tenants', { ...tenant, roomId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status >= 200 && response.status < 300) {
                    toast.success(response.data.message)
                    fetchTenants();
                } else {
                    toast.error(response.data.message)
                }
                setTenants([...tenants, response.data]);
            }
            setModalVisible(false);
            setEditingTenant(null);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    };

    const handleEditTenant = (tenant) => {
        setEditingTenant(tenant);
        setModalVisible(true);
    };

    const handleDeleteTenant = async (tenantId) => {
        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn muốn xoá người này?',
            buttons: [
                {
                    label: 'Đúng',
                    onClick: async () => {
                        // Call API to delete room from database
                        try {
                            const response = await axios.delete(`/api/tenants/${tenantId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (response.status >= 200 && response.status < 300) {
                                toast.success(response.data.message)
                                fetchTenants();
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
                    }
                },
                {
                    label: 'Không',
                    onClick: () => { }
                }
            ]
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    return (
        <>
            <Header token={token} />
            <div className="container w-full flex justify-center items-center mx-auto px-3">
                <div className="overflow-auto px-4 py-3 bg-white mx-auto my-4 rounded-md shadow-xl">
                    <h1 className='text-center text-3xl font-bold'>Danh sách người thuê #phòng {room.name}</h1>
                    <div className='mb-3'>
                        <Link href="/rooms" legacyBehavior>
                            <a className="text-blue-500 hover:underline">Quay lại</a>
                        </Link>
                    </div>

                    <button onClick={() => setModalVisible(true)} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Thêm người ở</button>
                    <table className="min-w-full divide-y divide-gray-200 mt-2">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tên</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ngày sinh</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Giới tính</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mã số BHYT</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nơi ở hiện nay</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Số CCCD</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Số điện thoại</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tenants.map(tenant => (
                                <tr key={tenant._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{tenant.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(tenant.dob)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{tenant.gender == "Male" ? "Nam" : tenant.gender == "Female" ? "Nữ" : "Khác"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{tenant.healthInsuranceId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{tenant.currentAddress}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{tenant.idCardNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{tenant.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleEditTenant(tenant)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded mr-2">Chỉnh sửa</button>
                                        <button onClick={() => handleDeleteTenant(tenant._id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TenantModal
                show={modalVisible}
                onClose={() => { setModalVisible(false); setEditingTenant(null) }}
                onSave={handleSaveTenant}
                tenantData={editingTenant}
            />
            <ToastContainer />
        </>
    )
}

export { getServerSideProps };
export default TenantPage