import React, { useState, useEffect } from 'react';
import { faTrash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UtilitiesForm() {
    const [electricityRate, setElectricityRate] = useState('');
    const [waterRate, setWaterRate] = useState('');
    const [otherCosts, setOtherCosts] = useState([]);
    const [otherCostsNote, setOtherCostsNote] = useState([]);

    // Nạp dữ liệu từ localStorage khi component được mount
    useEffect(() => {
        const storedElectricityRate = localStorage.getItem('electricityRate');
        const storedWaterRate = localStorage.getItem('waterRate');
        const storedOtherCosts = JSON.parse(localStorage.getItem('otherCosts') || '[]');
        const storedOtherCostsNote = JSON.parse(localStorage.getItem('otherCostsNote') || '[]');

        if (storedElectricityRate) setElectricityRate(storedElectricityRate);
        if (storedWaterRate) setWaterRate(storedWaterRate);
        if (storedOtherCosts) setOtherCosts(storedOtherCosts);
        if (storedOtherCostsNote) setOtherCostsNote(storedOtherCostsNote);
    }, []);

    const handleSave = () => {
        localStorage.setItem('electricityRate', electricityRate);
        localStorage.setItem('waterRate', waterRate);
        localStorage.setItem('otherCosts', JSON.stringify(otherCosts));
        localStorage.setItem('otherCostsNote', JSON.stringify(otherCostsNote));
        alert('Đã lưu thông tin thành công!');
    };

    const handleAddCost = () => {
        setOtherCosts([...otherCosts, '']);
        setOtherCostsNote([...otherCostsNote, '']);
    };

    const handleCostChange = (index, value) => {
        const updatedCosts = [...otherCosts];
        updatedCosts[index] = value;
        setOtherCosts(updatedCosts);
    };

    const handleNoteChange = (index, value) => {
        const updatedNotes = [...otherCostsNote];
        updatedNotes[index] = value;
        setOtherCostsNote(updatedNotes);
    };

    const handleRemoveCost = (index) => {
        const updatedCosts = otherCosts.filter((_, i) => i !== index);
        const updatedNotes = otherCostsNote.filter((_, i) => i !== index);
        setOtherCosts(updatedCosts);
        setOtherCostsNote(updatedNotes);
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mt-8 mb-4">Thiết lập Tiền điện, Tiền nước và Chi phí khác Cố định</h1>
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="electricityRate">
                        Giá tiền điện (VND/kWh)
                    </label>
                    <input
                        type="number"
                        id="electricityRate"
                        value={electricityRate}
                        onChange={(e) => setElectricityRate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="waterRate">
                        Giá tiền nước (VND/m³)
                    </label>
                    <input
                        type="number"
                        id="waterRate"
                        value={waterRate}
                        onChange={(e) => setWaterRate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Chi phí khác</h2>
                {otherCosts.map((cost, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Chi phí khác {index + 1} (VND)
                        </label>
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => handleCostChange(index, e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                        />
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Ghi chú chi phí khác {index + 1}
                        </label>
                        <textarea
                            value={otherCostsNote[index]}
                            onChange={(e) => handleNoteChange(index, e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                        />
                        <button
                            onClick={() => handleRemoveCost(index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Xóa
                        </button>
                    </div>
                ))}
                <div className='flex flex-col justify-start'>
                <button
                    onClick={handleAddCost}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Thêm Chi phí khác
                </button>
                <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                >
                    Lưu
                </button>
                </div>
                
            </div>
        </div>
    );
}

export default UtilitiesForm;
