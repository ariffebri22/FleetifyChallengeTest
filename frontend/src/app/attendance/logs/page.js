"use client";

import { useEffect, useState } from "react";
import { Layout, Card, Input, Button, Form, Typography, Table, DatePicker, Select, message, Spin, Space } from "antd";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import Navbar from "../../../components/common/Navbar";
import axios from "axios";
import dayjs from "dayjs";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AttendanceLogsPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [departements, setDepartements] = useState([]);

    const fetchAttendanceLogs = async (filters = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.employeeId) params.append("employee_id", filters.employeeId);
            if (filters.departementId) params.append("departement_id", filters.departementId);
            if (filters.dates && filters.dates.length === 2) {
                params.append("start_date", filters.dates[0].format("YYYY-MM-DD"));
                params.append("end_date", filters.dates[1].format("YYYY-MM-DD"));
            }

            const response = await axios.get(`${API_BASE_URL}/attendance/logs?${params.toString()}`);
            setLogs(response.data.data);
        } catch (error) {
            console.error("Error fetching attendance logs:", error);
            message.error(error.response?.data?.message || "Gagal mengambil log absensi. Coba lagi.");
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
            message.error(error.response?.data?.message || "Gagal mengambil daftar departemen. Coba lagi.");
        }
    };

    useEffect(() => {
        fetchDepartements();
        fetchAttendanceLogs();
    }, []);

    const onFinishFilter = (values) => {
        fetchAttendanceLogs(values);
    };

    const onResetFilter = () => {
        form.resetFields();
        fetchAttendanceLogs();
    };

    const columns = [
        {
            title: "Employee ID",
            dataIndex: "employee_id",
            key: "employee_id",
        },
        {
            title: "Nama Karyawan",
            dataIndex: "employee_name",
            key: "employee_name",
        },
        {
            title: "Departemen",
            dataIndex: "departement_name",
            key: "departement_name",
        },
        {
            title: "Waktu Absen",
            dataIndex: "date_attendance",
            key: "date_attendance",
            render: (text) => dayjs(text).format("DD MMMM YYYY HH:mm:ss"),
        },
        {
            title: "Tipe Absen",
            dataIndex: "attendance_type_name",
            key: "attendance_type_name",
            render: (text) => {
                let color = "";
                if (text === "Clock In") color = "text-green-600";
                else if (text === "Clock Out") color = "text-blue-600";
                return <span className={`font-semibold ${color}`}>{text}</span>;
            },
        },
        {
            title: "Status Clock In",
            dataIndex: "clock_in_status",
            key: "clock_in_status",
            render: (text) => {
                if (!text) return "-";
                let color = "";
                if (text === "Tepat Waktu") color = "text-green-600";
                else if (text === "Terlambat") color = "text-red-600";
                return <span className={`font-semibold ${color}`}>{text}</span>;
            },
        },
        {
            title: "Actual Clock In",
            dataIndex: "actual_clock_in",
            key: "actual_clock_in",
            render: (text) => (text ? dayjs(text).format("HH:mm:ss") : "-"),
        },
        {
            title: "Actual Clock Out",
            dataIndex: "actual_clock_out",
            key: "actual_clock_out",
            render: (text) => (text ? dayjs(text).format("HH:mm:ss") : "-"),
        },
    ];

    return (
        <Layout className="min-h-screen bg-gray-100">
            <Header className="bg-white shadow-sm p-0">
                <Navbar />
            </Header>

            <Content className="p-4 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <Title level={2} className="text-gray-800 mb-6 text-center md:text-left">
                        Log Absensi Karyawan
                    </Title>

                    <Card className="rounded-xl shadow-lg mb-6 p-6">
                        <Title level={4} className="!mt-0 mb-4 text-gray-700">
                            Filter Log Absensi
                        </Title>
                        <Form form={form} layout="vertical" onFinish={onFinishFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Form.Item label="Employee ID" name="employeeId">
                                <Input placeholder="Employee ID" className="rounded-lg" />
                            </Form.Item>

                            <Form.Item label="Departemen" name="departementId">
                                <Select placeholder="Pilih Departemen" allowClear className="rounded-lg">
                                    {departements.map((dept) => (
                                        <Option key={dept.id} value={dept.id}>
                                            {dept.departement_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Rentang Tanggal" name="dates">
                                <RangePicker className="w-full rounded-lg" format="YYYY-MM-DD" />
                            </Form.Item>

                            <Form.Item className="md:col-span-2 lg:col-span-1 flex items-end">
                                <Space>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading} className="rounded-lg bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 border-none">
                                        Cari
                                    </Button>
                                    <Button onClick={onResetFilter} icon={<ClearOutlined />} className="rounded-lg">
                                        Reset
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>

                    <Card className="rounded-xl shadow-lg p-6">
                        <Title level={4} className="!mt-0 mb-4 text-gray-700">
                            Daftar Log
                        </Title>
                        <Spin spinning={loading}>
                            <Table columns={columns} dataSource={logs} rowKey="history_id" pagination={{ pageSize: 10 }} className="rounded-lg overflow-hidden" />
                        </Spin>
                    </Card>
                </div>
            </Content>

            <Footer className="text-center text-gray-500 py-4 bg-gray-50">Fleetify Fullstack Challenge Test ©{new Date().getFullYear()} Arif Febriansyah.</Footer>
        </Layout>
    );
}
