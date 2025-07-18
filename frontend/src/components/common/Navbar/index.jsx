"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import Link from "next/link";
import { HomeOutlined, UserOutlined, ClockCircleOutlined, TeamOutlined, ProfileOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {
    const [selectedKey, setSelectedKey] = useState("/");

    useEffect(() => {
        setSelectedKey(window.location.pathname);
    }, []);

    const menuItems = [
        { key: "/", icon: <HomeOutlined />, label: <Link href="/">Dashboard</Link> },
        { key: "/attendance", icon: <ProfileOutlined />, label: <Link href="/attendance">Absensi</Link> },
        { key: "/attendance/logs", icon: <ClockCircleOutlined />, label: <Link href="/attendance/logs">Log Absensi</Link> },
        { key: "/employees", icon: <UserOutlined />, label: <Link href="/employees">Karyawan</Link> },
        { key: "/departements", icon: <TeamOutlined />, label: <Link href="/departements">Departemen</Link> },
    ];

    return (
        <Header className="w-full flex items-center justify-between px-6 !bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center">
                <Link href="/" passHref>
                    <div className="flex items-center cursor-pointer">
                        <ClockCircleOutlined className="text-purple-600 text-2xl mr-2" />
                        <Title level={3} className="!mb-0 text-gray-800">
                            Absensi App
                        </Title>
                    </div>
                </Link>
            </div>
            <Menu theme="light" mode="horizontal" selectedKeys={[selectedKey]} className="flex-grow justify-end border-b-0" items={menuItems} />
        </Header>
    );
}
