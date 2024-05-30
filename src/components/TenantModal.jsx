import React, { useState, useEffect } from 'react';

const TenantModal = ({ show, onClose, onSave, tenantData }) => {
    const [tenant, setTenant] = useState({
        name: '',
        dob: '',
        gender: '',
        healthInsuranceId: '',
        currentAddress: '',
        idCardNumber: '',
        phone: '',
    });

    useEffect(() => {
        if (tenantData) {
            setTenant(tenantData);
        } else {
            setTenant({
                name: '',
                dob: '',
                gender: '',
                healthInsuranceId: '',
                currentAddress: '',
                idCardNumber: '',
                phone: '',
            });
        }
    }, [tenantData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenant({ ...tenant, [name]: value });
    };

    const handleSubmit = () => {
        onSave(tenant);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full h-full max-w-md overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{tenantData ? 'Chỉnh sửa người ở' : 'Thêm người ở mới'}</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="name" className="block mb-1">Tên</label>
                        <input type="text" id="name" name="name" value={tenant.name} onChange={handleInputChange} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="dob" className="block mb-1">Ngày sinh</label>
                        <input type="date" id="dob" name="dob" value={tenant.dob} onChange={handleInputChange} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block mb-1">Giới tính</label>
                        <select id="gender" name="gender" value={tenant.gender} onChange={handleInputChange} className="border p-2 rounded w-full">
                            <option value="Other">Khác</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="healthInsuranceId" className="block mb-1">Mã số BHYT</label>
                        <input type="text" id="healthInsuranceId" name="healthInsuranceId" value={tenant.healthInsuranceId} onChange={handleInputChange} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="currentAddress" className="block mb-1">Nơi ở hiện nay</label>
                        <input type="text" id="currentAddress" name="currentAddress" value={tenant.currentAddress} onChange={handleInputChange} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="idCardNumber" className="block mb-1">Số CCCD</label>
                        <input type="text" id="idCardNumber" name="idCardNumber" value={tenant.idCardNumber} onChange={handleInputChange} className="border p-2 rounded w-full" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-1">Số điện thoại</label>
                        <input type="text" id="phone" name="phone" value={tenant.phone} onChange={handleInputChange} className="border p-2 rounded w-full" />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">Hủy</button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">{tenantData ? 'Lưu' : 'Thêm'}</button>
                </div>
            </div>
        </div>
    );
};

export default TenantModal;
