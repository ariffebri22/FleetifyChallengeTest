"use client";

import { useEffect, useState } from "react";
import { Layout, Card, Statistic, Row, Col, Spin, message, Typography } from "antd";
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Navbar from "../components/common/Navbar";
import axios from "axios";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalEmployees: 0,
        employeesClockedInToday: 0,
        onTimeClockIns: 0,
        lateClockIns: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const employeesRes = await axios.get(`${API_BASE_URL}/employees`);
                const totalEmployees = employeesRes.data.data.length;

                const today = new Date().toISOString().slice(0, 10);
                const attendanceLogsRes = await axios.get(`${API_BASE_URL}/attendance/logs?start_date=${today}&end_date=${today}`);
                const todayLogs = attendanceLogsRes.data.data;

                const clockedInEmployees = new Set();
                let onTimeCount = 0;
                let lateCount = 0;

                todayLogs.forEach((log) => {
                    if (log.attendance_type === 1) {
                        clockedInEmployees.add(log.employee_id);
                        if (log.clock_in_status === "Tepat Waktu") {
                            onTimeCount++;
                        } else if (log.clock_in_status === "Terlambat") {
                            lateCount++;
                        }
                    }
                });

                setDashboardData({
                    totalEmployees: totalEmployees,
                    employeesClockedInToday: clockedInEmployees.size,
                    onTimeClockIns: onTimeCount,
                    lateClockIns: lateCount,
                });
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
                message.error("Gagal memuat data dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Layout className="h-[100dvh] bg-gray-100">
            <Header className="bg-white shadow-sm p-0">
                <Navbar />
            </Header>

            <Content className="p-4 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <Title level={2} className="text-gray-800 mb-6 text-center md:text-left">
                        Dashboard Absensi Karyawan
                    </Title>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                <Col xs={24} sm={12} lg={8}>
                                    <Card className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <Statistic title="Total Karyawan" value={dashboardData.totalEmployees} prefix={<UserOutlined className="text-purple-500" />} valueStyle={{ color: "#6a67d0" }} />
                                        <Text type="secondary" className="text-sm mt-2 block">
                                            Jumlah karyawan terdaftar.
                                        </Text>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} lg={8}>
                                    <Card className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <Statistic title="Absen Masuk Hari Ini" value={dashboardData.employeesClockedInToday} prefix={<ClockCircleOutlined className="text-green-500" />} valueStyle={{ color: "#52c41a" }} />
                                        <Text type="secondary" className="text-sm mt-2 block">
                                            Karyawan yang sudah absen masuk hari ini.
                                        </Text>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} lg={8}>
                                    <Card className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <Statistic title="Tepat Waktu (Masuk)" value={dashboardData.onTimeClockIns} prefix={<CheckCircleOutlined className="text-blue-500" />} valueStyle={{ color: "#1890ff" }} />
                                        <Text type="secondary" className="text-sm mt-2 block">
                                            Karyawan masuk tepat waktu.
                                        </Text>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} lg={8}>
                                    <Card className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <Statistic title="Terlambat (Masuk)" value={dashboardData.lateClockIns} prefix={<ExclamationCircleOutlined className="text-red-500" />} valueStyle={{ color: "#ff4d4f" }} />
                                        <Text type="secondary" className="text-sm mt-2 block">
                                            Karyawan masuk terlambat.
                                        </Text>
                                    </Card>
                                </Col>
                            </Row>
                            <div className="mt-12 text-center">
                                <Title level={3} className="text-gray-700 mb-4">
                                    Mulai Kelola Absensi Anda
                                </Title>
                                <Row gutter={[16, 16]} justify="center">
                                    <Col>
                                        <Card hoverable className="rounded-xl shadow-md w-64 p-4 text-center cursor-pointer" onClick={() => (window.location.href = "/employees")}>
                                            <UserOutlined className="text-4xl text-blue-600 mb-2" />
                                            <Title level={4} className="mt-2">
                                                Kelola Karyawan
                                            </Title>
                                            <Text type="secondary">Tambah, Edit, Hapus data karyawan.</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card hoverable className="rounded-xl shadow-md w-64 p-4 text-center cursor-pointer" onClick={() => (window.location.href = "/departements")}>
                                            <ClockCircleOutlined className="text-4xl text-green-600 mb-2" />
                                            <Title level={4} className="mt-2">
                                                Kelola Departemen
                                            </Title>
                                            <Text type="secondary">Atur divisi dan jadwal absensi.</Text>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card hoverable className="rounded-xl shadow-md w-64 p-4 text-center cursor-pointer" onClick={() => (window.location.href = "/attendance/logs")}>
                                            <CheckCircleOutlined className="text-4xl text-purple-600 mb-2" />
                                            <Title level={4} className="mt-2">
                                                Lihat Log Absensi
                                            </Title>
                                            <Text type="secondary">Cek riwayat absen dan kedisiplinan.</Text>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </>
                    )}
                </div>
            </Content>

            <Footer className="text-center text-gray-500 py-4 bg-gray-50">Fleetify Fullstack Challenge Test ©{new Date().getFullYear()} Arif Febriansyah.</Footer>
        </Layout>
    );
}
