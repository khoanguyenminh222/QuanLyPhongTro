// components/Step3.js
import React from 'react';

const Step2 = ({ maxWater, setMaxWater, handleSave }) => {

  const handleChange = (e) => {
    setMaxWater(e.target.value);
  };

  return (
    <div className='text-center'>
      <h2>Bước 2: Nhập Giá Nước Tối Đa</h2>
      <input
        type="number"
        placeholder="Nhập giá nước tối đa"
        value={maxWater}
        onChange={handleChange}
        className="border-2 p-2 rounded outline-none mt-4"
      />
    </div>
  );
};

export default Step2;
