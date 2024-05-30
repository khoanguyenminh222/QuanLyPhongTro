// pages/settings.js
import Step1 from '@/components/guide/Step1';
import Step2 from '@/components/guide/Step2';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { useRouter } from 'next/router';

const SettingsPage = ({ token }) => {
    const router = useRouter();
    const [maxElectricity, setMaxElectricity] = useState(99999);
    const [maxWater, setMaxWater] = useState(99999);
    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };
    const handleSave = async () => {
        // Lưu dữ liệu vào database hoặc gửi đến API
        console.log(maxElectricity),
        console.log(maxWater)
        try {
            const response = await axios.post('/api/config', { maxElectricity, maxWater }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data.message);
                router.push('/rooms');
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

    let stepComponent;
    switch (currentStep) {
        case 1:
            stepComponent = <Step1 maxElectricity={maxElectricity} setMaxElectricity={setMaxElectricity} />;
            break;
        case 2:
            stepComponent = <Step2 maxWater={maxWater} setMaxWater={setMaxWater} handleSave={handleSave}/>;
            break;
        default:
            stepComponent = null;
    }

    return (
        <div className="container w-full flex justify-center items-center mx-auto px-3">
            <div className='bg-white mx-auto my-4 rounded-md shadow-xl px-20 py-10'>
                <h1 className="text-3xl font-bold mt-4 mb-4">Thiết lập Cấu Hình - Bước {currentStep}</h1>
                {stepComponent}
                <div className="container flex justify-around mt-4">
                    {currentStep > 1 && (
                        <button
                            onClick={handlePrevStep}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Quay Lại
                        </button>
                    )}
                    {currentStep < 2 && (
                        <button
                            onClick={handleNextStep}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Tiếp Theo
                        </button>
                    )}
                    {currentStep === 2 && (
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Lưu
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export { getServerSideProps };
export default SettingsPage;
