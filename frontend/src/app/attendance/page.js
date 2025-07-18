"use client";

import { useState } from "react";
import { Layout, Card, Input, Button, Form, Typography, message } from "antd";
import { UserOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import Navbar from "../../components/common/Navbar";
import axios from "axios";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AttendancePage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleClockIn = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/attendance/clock-in`, {
                employee_id: values.employeeId,
            });

            const employeeName = response.data.data.employee_name || "Karyawan";

            messageApi.success(`Selamat bekerja ${employeeName}!`);
            form.resetFields();
        } catch (error) {
            console.error("Error clocking in:", error);

            if (error.response && error.response.data && error.response.data.message) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error("Terjadi suatu masalah. Mohon coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/attendance/clock-out`, {
                employee_id: values.employeeId,
            });

            const employeeName = response.data.data.employee_name || "Karyawan";

            messageApi.success(`Sampai Jumpa lagi ${employeeName}!`);
            form.resetFields();
        } catch (error) {
            console.error("Error clocking out:", error);

            if (error.response && error.response.data && error.response.data.message) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error("Terjadi suatu masalah. Mohon coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="h-[100dvh] bg-gray-100">
            {contextHolder}
            <Header className="bg-white shadow-sm p-0">
                <Navbar />
            </Header>

            <Content className="p-4 md:p-8 lg:p-12 flex justify-center items-start">
                <Card
                    className="rounded-xl shadow-lg p-6 w-full max-w-md"
                    title={
                        <div className="text-center">
                            <UserOutlined className="text-purple-600 text-4xl mb-2 mt-2" />
                            <Title level={3} className="!mb-0 text-gray-800">
                                Absen Karyawan
                            </Title>
                            <Text type="secondary">Masukkan Employee ID Anda untuk absen</Text>
                        </div>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={() => {}} className="mt-6">
                        <Form.Item
                            name="employeeId"
                            rules={[
                                { required: true, message: "Mohon masukkan Employee ID Anda!" },
                                { pattern: /^[a-zA-Z0-9-]+$/, message: "Employee ID hanya boleh berisi huruf, angka, dan hyphen (-)." },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Employee ID" size="large" className="rounded-lg" />
                        </Form.Item>

                        <Form.Item className="!mb-0">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="primary"
                                    icon={<LoginOutlined />}
                                    onClick={() => form.validateFields().then(handleClockIn)}
                                    loading={loading}
                                    size="large"
                                    className="rounded-lg flex-1 bg-green-500 hover:bg-green-600 focus:bg-green-600 border-none !h-12"
                                >
                                    Absen Masuk
                                </Button>
                                <Button
                                    type="default"
                                    icon={<LogoutOutlined />}
                                    onClick={() => form.validateFields().then(handleClockOut)}
                                    loading={loading}
                                    size="large"
                                    className="rounded-lg flex-1 border-purple-500 text-purple-600 hover:border-purple-600 hover:text-purple-700 !h-12"
                                >
                                    Absen Keluar
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>

            <Footer className="text-center text-gray-500 py-4 bg-gray-50">Fleetify Fullstack Challenge Test ©{new Date().getFullYear()} Arif Febriansyah.</Footer>
        </Layout>
    );
}
