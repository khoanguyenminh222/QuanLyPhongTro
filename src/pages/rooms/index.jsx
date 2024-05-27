import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import RoomCard from '@/components/RoomCard';
import RoomModal from '@/components/RoomModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import { getServerSideProps } from '@/helpers/cookieHelper';

function index({ token }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null);

    const fetchRooms = async () => {
        const response = await axios.get(`/api/rooms`,{
            headers: { Authorization: `Bearer ${token}` }
        });
        setRoomList(response.data)
    };
    useEffect(() => {
        fetchRooms();
    }, []);

    const handleSave = async (roomData) => {
        console.log("edit",editingRoom)
        if (editingRoom) {
            // Call API to update room in database
            try {
                const response = await axios.put(`/api/rooms/${editingRoom._id}`, roomData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status >= 200 && response.status < 300) {
                    toast.success(response.data.message)
                    fetchRooms();
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

        } else {
            // Call API to save room in database
            try {
                const response = await axios.post(`/api/rooms`, roomData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (response.status >= 200 && response.status < 300) {
                    toast.success(response.data.message)
                    fetchRooms();
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
        setModalIsOpen(false);
        setEditingRoom(null);
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setModalIsOpen(true);
    };

    const handleDelete = async (roomId) => {
        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn muốn xoá phòng này?',
            buttons: [
                {
                    label: 'Đúng',
                    onClick: async () => {
                        // Call API to delete room from database
                        try {
                            const response = await axios.delete(`/api/rooms/${roomId}`,{
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (response.status >= 200 && response.status < 300) {
                                toast.success(response.data.message)
                                fetchRooms();
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

    const handleEditStatus = async (room) => {
        try {
            const response = await axios.put(`/api/rooms/${room._id}`, { status: !room.status },{
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data.message)
                fetchRooms();
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
            <Header token={token}/>
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mt-8 mb-4">Danh sách Phòng trọ</h1>
                <button
                    onClick={() => setModalIsOpen(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                >
                    Tạo mới Phòng
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roomList.map((room, index) => (
                        <RoomCard
                            key={index}
                            room={room}
                            onEdit={() => handleEdit(room)}
                            onDelete={() => handleDelete(room._id)}
                            onEditStatus={() => handleEditStatus(room)}
                        />
                    ))}
                </div>
            </div>
            <RoomModal
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    setModalIsOpen(false);
                    setEditingRoom(null);
                }}
                onSave={handleSave}
                initialData={editingRoom}
            />
            <ToastContainer />
        </>
    );
}

export { getServerSideProps };
export default index