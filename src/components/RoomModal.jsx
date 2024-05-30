import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#__next');

function RoomModal({ isOpen, onRequestClose, onSave, initialData = {} }) {
    const [name, setName] = useState('');
    const [rent, setRent] = useState('');
    const [rentFormatted, setRentFormatted] = useState('');
    const [electricityRate, setElectricityRate] = useState('');
    const [electricityRateFormatted, setElectricityRateFormatted] = useState('');
    const [waterRate, setWaterRate] = useState('');
    const [waterRateFormatted, setWaterRateFormatted] = useState('');
    const [otherCosts, setOtherCosts] = useState([]);
    const [electricity, setElectricity] = useState('');
    const [water, setWater] = useState('');

    const formatNumberForEdit = (rent) => {
        // Ensure rent is a string before formatting
        const rentValue = rent !== undefined ? String(rent) : '';
        // Format currency value for rent
        return formatCurrency(rentValue);
    };

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setRent(initialData.rent || '');
            setElectricityRate(initialData.electricityRate || '');
            setWaterRate(initialData.waterRate || '');
            setOtherCosts(initialData.otherCosts || []);
            setElectricity(initialData.electricity || '');
            setWater(initialData.water || '');

            setRentFormatted(formatNumberForEdit(initialData.rent));
            setElectricityRateFormatted(formatNumberForEdit(initialData.electricityRate));
            setWaterRateFormatted(formatNumberForEdit(initialData.waterRate));
        }
    }, [initialData]);

    const handleAddCost = () => {
        setOtherCosts([...otherCosts, { description: '', amount: '' }]);
    };

    const handleCostChange = (index, key, value) => {
        const updatedCosts = [...otherCosts];
        updatedCosts[index][key] = value;
        setOtherCosts(updatedCosts);
    };

    const handleRemoveCost = (index) => {
        const updatedCosts = otherCosts.filter((_, i) => i !== index);
        setOtherCosts(updatedCosts);
    };

    const handleSubmit = () => {
        // Check if any required field is empty
        if (!name || !rent || !electricityRate || !waterRate || !electricity || !water) {
            toast.warning("Yêu cầu điền đầy đủ thông tin");
            return;
        }

        // Check if otherCosts have any empty description or amount
        for (const cost of otherCosts) {
            if (!cost.description || !cost.amount) {
                toast.warning("Yêu cầu điền đầy đủ vào ô chí phí khác");
                return;
            }
        }
        onSave({ name, rent, electricityRate, waterRate, otherCosts, electricity, water });
    };

    const formatCurrency = (value) => {
        // Remove any existing dots
        const cleanValue = value.replace(/\./g, '');

        // Add dots for thousands separator
        const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return formattedValue;
    };

    const handleChangeRentFormatted = (e) => {
        // Get raw input value
        const rawValue = e.target.value;

        // Remove non-digit characters from input value
        const cleanedValue = rawValue.replace(/[^\d]/g, '');

        // Format currency value
        const formattedRent = formatCurrency(cleanedValue);
        // Update state with both raw and formatted values
        setRent(cleanedValue);
        setRentFormatted(formattedRent);
    };

    const handleChangeElectricityRateFormatted = (e) => {
        // Get raw input value
        const rawValue = e.target.value;

        // Remove non-digit characters from input value
        const cleanedValue = rawValue.replace(/[^\d]/g, '');

        // Format currency value
        const formattedRent = formatCurrency(cleanedValue);
        // Update state with both raw and formatted values
        setElectricityRate(cleanedValue);
        setElectricityRateFormatted(formattedRent);
    };

    const handleChangeWaterRateFormatted = (e) => {
        // Get raw input value
        const rawValue = e.target.value;

        // Remove non-digit characters from input value
        const cleanedValue = rawValue.replace(/[^\d]/g, '');

        // Format currency value
        const formattedRent = formatCurrency(cleanedValue);
        // Update state with both raw and formatted values
        setWaterRate(cleanedValue);
        setWaterRateFormatted(formattedRent);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Room Modal"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Chỉnh sửa Phòng' : 'Tạo mới Phòng'}</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tên Phòng</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tiền Phòng (VND)</label>
                <input
                    type="text"
                    value={rentFormatted}
                    onChange={handleChangeRentFormatted}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tiền Điện (VND/kWh)</label>
                <input
                    type="text"
                    value={electricityRateFormatted}
                    onChange={handleChangeElectricityRateFormatted}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tiền Nước (VND/m³)</label>
                <input
                    type="text"
                    value={waterRateFormatted}
                    onChange={handleChangeWaterRateFormatted}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Số điện - trên đồng hồ điện</label>
                <input
                    type="number"
                    value={electricity}
                    onChange={(e) => setElectricity(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Số nước - trên đồng hồ nước</label>
                <input
                    type="number"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Chi phí khác</label>
                {otherCosts.map((cost, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="text"
                            placeholder="Tên chi phí"
                            value={cost.description}
                            onChange={(e) => handleCostChange(index, 'description', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        />
                        <input
                            type="number"
                            placeholder="Số tiền"
                            value={cost.amount}
                            onChange={(e) => handleCostChange(index, 'amount', e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        />
                        <button
                            onClick={() => handleRemoveCost(index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddCost}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    <FontAwesomeIcon icon={faPlusCircle} /> Thêm Chi phí
                </button>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onRequestClose}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Lưu
                </button>
            </div>
        </Modal>
    );
}

export default RoomModal;
