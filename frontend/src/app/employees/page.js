"use client";

import { useEffect, useState } from "react";
import { Layout, Card, Input, Button, Form, Typography, Table, Select, message, Spin, Space, Popconfirm, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined } from "@ant-design/icons";
import Navbar from "../../components/common/Navbar";
import axios from "axios";
import dayjs from "dayjs";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EmployeesPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const generateNextEmployeeId = () => {
        const empIds = employees
            .map((emp) => {
                const match = emp.employee_id.match(/^EMP(\d{3})$/);
                return match ? parseInt(match[1], 10) : 0;
            })
            .filter((num) => num > 0);

        const maxNum = empIds.length > 0 ? Math.max(...empIds) : 0;
        const nextNum = maxNum + 1;

        return `EMP${String(nextNum).padStart(3, "0")}`;
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/employees`);
            setEmployees(response.data.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            messageApi.error(error.response?.data?.message || "Gagal mengambil data karyawan.");
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartements = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/departements`);
            setDepartements(response.data.data);
        } catch (error) {
            console.error("Error fetching departements:", error);
            messageApi.error("Gagal mengambil daftar departemen.");
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartements();
    }, []);

    const showAddModal = () => {
        form.resetFields();
        setEditingEmployee(null);

        form.setFieldsValue({
            employee_id: generateNextEmployeeId(),
        });

        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingEmployee(record);
        form.setFieldsValue({
            id: record.id,
            employee_id: record.employee_id,
            name: record.name,
            address: record.address,
            departement_id: record.departement_id,
        });
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingEmployee(null);
        form.resetFields();
    };

    const handleModalSubmit = async (values) => {
        setLoading(true);
        try {
            if (editingEmployee) {
                const response = await axios.put(`${API_BASE_URL}/employees/${editingEmployee.id}`, values);
                messageApi.success(response.data.message || "Data karyawan berhasil diperbarui!");
            } else {
                const response = await axios.post(`${API_BASE_URL}/employees`, values);
                messageApi.success(response.data.message || "Karyawan berhasil ditambahkan!");
            }
            setIsModalVisible(false);
            setEditingEmployee(null);
            form.resetFields();
            fetchEmployees();
        } catch (error) {
            console.error("Error submitting employee form:", error);
            messageApi.error(error.response?.data?.message || "Gagal menyimpan data karyawan.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);
            messageApi.success(response.data.message || "Karyawan berhasil dihapus!");
            fetchEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
            messageApi.error(error.response?.data?.message || "Gagal menghapus karyawan.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Employee ID",
            dataIndex: "employee_id",
            key: "employee_id",
        },
        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Departemen",
            dataIndex: "departement_name",
            key: "departement_name",
            render: (text, record) => {
                if (text) return text;
                const dept = departements.find((d) => d.id === record.departement_id);
                return dept ? dept.departement_name : "-";
            },
        },
        {
            title: "Alamat",
            dataIndex: "address",
            key: "address",
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
                    <Popconfirm title="Apakah Anda yakin ingin menghapus karyawan ini?" onConfirm={() => handleDeleteEmployee(record.id)} okText="Ya" cancelText="Tidak">
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
                        Manajemen Karyawan
                    </Title>

                    <Card className="rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <Title level={4} className="!mt-0 !mb-0 text-gray-700">
                                Daftar Karyawan
                            </Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} className="rounded-lg bg-green-500 hover:bg-green-600 focus:bg-green-600 border-none">
                                Tambah Karyawan
                            </Button>
                        </div>
                        <Spin spinning={loading}>
                            <Table columns={columns} dataSource={employees} rowKey="id" pagination={{ pageSize: 10 }} className="rounded-lg overflow-hidden" />
                        </Spin>
                    </Card>
                </div>
            </Content>

            <Footer className="text-center text-gray-500 py-4 bg-gray-50">Fleetify Fullstack Challenge Test ©{new Date().getFullYear()} Arif Febriansyah.</Footer>

            <Modal title={editingEmployee ? "Edit Karyawan" : "Tambah Karyawan Baru"} open={isModalVisible} onCancel={handleModalCancel} footer={null} centered className="rounded-xl">
                <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
                    <Form.Item
                        label="Employee ID"
                        name="employee_id"
                        rules={[
                            { required: true, message: "Employee ID tidak boleh kosong!" },
                            { pattern: /^EMP\d{3}$/, message: "Format Employee ID harus EMPXXX (misal: EMP001)." },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Employee ID" className="rounded-lg" readOnly={true} />
                    </Form.Item>

                    <Form.Item label="Nama Karyawan" name="name" rules={[{ required: true, message: "Mohon masukkan nama karyawan!" }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nama Lengkap" className="rounded-lg" />
                    </Form.Item>

                    <Form.Item label="Departemen" name="departement_id" rules={[{ required: true, message: "Mohon pilih departemen!" }]}>
                        <Select placeholder="Pilih Departemen" className="rounded-lg">
                            {departements.map((dept) => (
                                <Option key={dept.id} value={dept.id}>
                                    {dept.departement_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Alamat" name="address">
                        <Input.TextArea prefix={<HomeOutlined />} placeholder="Alamat Lengkap" rows={3} className="rounded-lg" />
                    </Form.Item>

                    <Form.Item className="!mb-0">
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleModalCancel} className="rounded-lg">
                                Batal
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading} className="rounded-lg bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 border-none">
                                {editingEmployee ? "Simpan Perubahan" : "Tambah Karyawan"}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}
