// components/Step1.js
import React from 'react';

const Step1 = ({ maxElectricity, setMaxElectricity }) => {
  const handleChange = (e) => {
    setMaxElectricity(e.target.value);
  };

  return (
    <div className='text-center'>
      <h2>Bước 1: Nhập Giá Điện Tối Đa</h2>
      <input
        type="number"
        placeholder="Nhập giá điện tối đa"
        value={maxElectricity}
        onChange={handleChange}
        className="border-2 p-2 rounded outline-none mt-4"
      />
    </div>
  );
};

export default Step1;
