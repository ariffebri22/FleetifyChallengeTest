"use client";

import { useEffect, useState } from "react";
import { Layout, Card, Input, Button, Form, Typography, Table, message, Spin, Space, Popconfirm, Modal, TimePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, BuildingOutlined, ClockCircleOutlined } from "@ant-design/icons";

import Navbar from "../../components/common/Navbar";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DepartementsPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [departements, setDepartements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDepartement, setEditingDepartement] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchDepartements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/departements`);
            setDepartements(response.data.data);
        } catch (error) {
            console.error("Error fetching departements:", error);
            messageApi.error(error.response?.data?.message || "Gagal mengambil data departemen.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartements();
    }, []);

    const showAddModal = () => {
        form.resetFields();
        setEditingDepartement(null);
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingDepartement(record);
        form.setFieldsValue({
            departement_name: record.departement_name,
            max_clock_in_time: record.max_clock_in_time ? dayjs(record.max_clock_in_time, "HH:mm:ss") : null,
            max_clock_out_time: record.max_clock_out_time ? dayjs(record.max_clock_out_time, "HH:mm:ss") : null,
        });
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingDepartement(null);
        form.resetFields();
    };

    const handleModalSubmit = async (values) => {
        setLoading(true);
        try {
            const dataToSend = {
                ...values,
                max_clock_in_time: values.max_clock_in_time ? values.max_clock_in_time.format("HH:mm:ss") : null,
                max_clock_out_time: values.max_clock_out_time ? values.max_clock_out_time.format("HH:mm:ss") : null,
            };

            if (editingDepartement) {
                const response = await axios.put(`${API_BASE_URL}/departements/${editingDepartement.id}`, dataToSend);
                messageApi.success(response.data.message || "Data departemen berhasil diperbarui!");
            } else {
                const response = await axios.post(`${API_BASE_URL}/departements`, dataToSend);
                messageApi.success(response.data.message || "Departemen berhasil ditambahkan!");
            }
            setIsModalVisible(false);
            setEditingDepartement(null);
            form.resetFields();
            fetchDepartements();
        } catch (error) {
            console.error("Error submitting departement form:", error);
            messageApi.error(error.response?.data?.message || "Gagal menyimpan data departemen.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartement = async (id) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/departements/${id}`);
            messageApi.success(response.data.message || "Departemen berhasil dihapus!");
            fetchDepartements();
        } catch (error) {
            console.error("Error deleting departement:", error);
            messageApi.error(error.response?.data?.message || "Gagal menghapus departemen.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Nama Departemen",
            dataIndex: "departement_name",
            key: "departement_name",
        },
        {
            title: "Max Clock-In Time",
            dataIndex: "max_clock_in_time",
            key: "max_clock_in_time",
            render: (text) => text || "-",
        },
        {
            title: "Max Clock-Out Time",
            dataIndex: "max_clock_out_time",
            key: "max_clock_out_time",
            render: (text) => text || "-",
        },
        {
            title: "Dibuat Pada",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => dayjs(text).format("DD MMMM YYYY HH:mm:ss"),
        },
        {
            title: "Diperbarui Pada",
            dataIndex: "updated_at",
            key: "updated_at",
            render: (text) => dayjs(text).format("DD MMMM YYYY HH:mm:ss"),
        },
        {
            title: "Aksi",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditModal(record)} className="rounded-lg bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 border-none">
                        Edit
                    </Button>
                    <Popconfirm title="Apakah Anda yakin ingin menghapus departemen ini?" onConfirm={() => handleDeleteDepartement(record.id)} okText="Ya" cancelText="Tidak">
                        <Button type="default" icon={<DeleteOutlined />} danger className="rounded-lg">
                            Hapus
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Layout className="min-h-screen bg-gray-100">
            {contextHolder}
            <Header className="bg-white shadow-sm p-0">
                <Navbar />
            </Header>

            <Content className="p-4 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <Title level={2} className="text-gray-800 mb-6 text-center md:text-left">
                        Manajemen Departemen
                    </Title>

                    <Card className="rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <Title level={4} className="!mt-0 !mb-0 text-gray-700">
                                Daftar Departemen
                            </Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} className="rounded-lg bg-green-500 hover:bg-green-600 focus:bg-green-600 border-none">
                                Tambah Departemen
                            </Button>
                        </div>
                        <Spin spinning={loading}>
                            <Table columns={columns} dataSource={departements} rowKey="id" pagination={{ pageSize: 10 }} className="rounded-lg overflow-hidden" />
                        </Spin>
                    </Card>
                </div>
            </Content>

            <Footer className="text-center text-gray-500 py-4 bg-gray-50">Fleetify Fullstack Challenge Test ©{new Date().getFullYear()} Arif Febriansyah.</Footer>

            <Modal title={editingDepartement ? "Edit Departemen" : "Tambah Departemen Baru"} open={isModalVisible} onCancel={handleModalCancel} footer={null} centered className="rounded-xl">
                <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
                    <Form.Item label="Nama Departemen" name="departement_name" rules={[{ required: true, message: "Mohon masukkan nama departemen!" }]}>
                        <Input placeholder="Nama Departemen" className="rounded-lg" />
                    </Form.Item>

                    <Form.Item label="Max Clock-In Time" name="max_clock_in_time" rules={[{ required: true, message: "Mohon pilih batas waktu masuk!" }]}>
                        <TimePicker format="HH:mm:ss" className="w-full rounded-lg" placeholder="HH:mm:ss" suffixIcon={<ClockCircleOutlined />} />
                    </Form.Item>

                    <Form.Item label="Max Clock-Out Time" name="max_clock_out_time" rules={[{ required: true, message: "Mohon pilih batas waktu keluar!" }]}>
                        <TimePicker format="HH:mm:ss" className="w-full rounded-lg" placeholder="HH:mm:ss" suffixIcon={<ClockCircleOutlined />} />
                    </Form.Item>

                    <Form.Item className="!mb-0">
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleModalCancel} className="rounded-lg">
                                Batal
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading} className="rounded-lg bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 border-none">
                                {editingDepartement ? "Simpan Perubahan" : "Tambah Departemen"}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}
