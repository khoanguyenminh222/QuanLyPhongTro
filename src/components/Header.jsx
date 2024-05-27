import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { getUserIdFromToken } from '@/helpers/getUserIdFromToken';
import axios from 'axios';

function Header({ token }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const [userId, setUserId] = useState(undefined);
    const [user, setUser] = useState([]);

    useEffect(() => {
        if (token) {
            const useridfromtoken = getUserIdFromToken(token);
            if (useridfromtoken) {
                setUserId(useridfromtoken);
            }
        }
    }, [token])

    useEffect(() => {
        if(userId){
            const fetchUser = async () => {
                const response = await axios.get(`../api/users/${userId}`,{
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(response.data)
            };
            fetchUser();
        }
    },[userId])

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/rooms" legacyBehavior>
                    <a className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/images/coffee-ryo.jpg" className="h-10 rounded-lg" alt="Quản lý Phòng trọ Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Chào {user.fullname}</span>
                    </a>
                </Link>
                <button onClick={toggleNavbar} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`w-full md:w-auto ${isOpen ? 'block' : 'hidden'} md:block md:items-center md:w-auto`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link href="/rooms" legacyBehavior>
                                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Phòng trọ</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/history" legacyBehavior>
                                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Lịch sử</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" legacyBehavior>
                                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Giới thiệu</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" legacyBehavior>
                                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Liên hệ</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/utilities" legacyBehavior>
                                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Thiết lập số điện, nước tối đa</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header