-- Active: 1752846405640@@153.92.15.71@3306@u885555543_fleetify_test
-- 1. Tabel departement
CREATE TABLE departement (
    id VARCHAR(100) PRIMARY KEY,
    departement_name VARCHAR(255) NOT NULL,
    max_clock_in_time TIME,
    max_clock_out_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

DROP Table departement;

-- 2. Tabel employee
CREATE TABLE employee (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    departement_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departement_id) REFERENCES departement(id)
);

-- 3. Tabel attendance
CREATE TABLE attendance (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) NOT NULL,
    attendance_id VARCHAR(100) UNIQUE NOT NULL,
    clock_in TIMESTAMP,
    clock_out TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

-- 4. Tabel attendance_history
CREATE TABLE attendance_history (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(100) NOT NULL,
    attendance_id VARCHAR(100) NOT NULL,
    date_attendance TIMESTAMP NOT NULL,
    attendance_type TINYINT(1) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (attendance_id) REFERENCES attendance(attendance_id)
);

INSERT INTO departement (id, departement_name, max_clock_in_time, max_clock_out_time) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'IT Development', '09:00:00', '17:00:00'),
('b1fcc1d3-3c99-4e01-9a99-b1d3c99e01a2', 'Human Resources', '08:30:00', '16:30:00'),
('c2gdd2e4-4d11-4f12-acac-c2d4e12eacb3', 'Finance & Accounting', '09:15:00', '17:15:00'),
('d3hee3f5-5e22-4g23-bddd-d3e5f23ebdc4', 'Marketing & Sales', '09:00:00', '18:00:00'),
('e4iff4g6-6f33-4h34-ceee-e4f6g34fecd5', 'Operations', '08:00:00', '16:00:00'),
('f5jgg5h7-7g44-4i45-dfff-f5g7h45fgde6', 'Customer Service', '10:00:00', '19:00:00'),
('g6khh6i8-8h55-4j56-efff-g6h8i56hefg7', 'Research & Development', '09:30:00', '17:30:00'),
('h7lii7j9-9i66-4k67-gaga-h7i9j67igfh8', 'Legal Affairs', '08:45:00', '16:45:00'),
('i8mjj8ka-aaj7-4l78-hbhb-i8jab78jahgi9', 'Public Relations', '09:00:00', '17:00:00'),
('j9nkk9lb-bbk8-4m89-icic-j9kbc89kbhij0', 'Product Management', '09:30:00', '17:30:00');

INSERT INTO employee (id, employee_id, departement_id, name, address, created_at, updated_at) VALUES
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'EMP001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Budi Santoso', 'Jl. Merdeka No. 10, Jakarta', NOW(), NOW()),
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'EMP002', 'b1fcc1d3-3c99-4e01-9a99-b1d3c99e01a2', 'Siti Aminah', 'Jl. Sudirman No. 25, Bogor', NOW(), NOW()),
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'EMP003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Joko Susilo', 'Jl. Thamrin Raya No. 3, Depok', NOW(), NOW()),
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f90', 'EMP004', 'c2gdd2e4-4d11-4f12-acac-c2d4e12eacb3', 'Dewi Lestari', 'Jl. Pahlawan No. 45, Bandung', NOW(), NOW()),
('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f90a1', 'EMP005', 'd3hee3f5-5e22-4g23-bddd-d3e5f23ebdc4', 'Andi Wijaya', 'Jl. Kebon Jeruk No. 12, Surabaya', NOW(), NOW()),
('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f90a1b2', 'EMP006', 'e4iff4g6-6f33-4h34-ceee-e4f6g34fecd5', 'Rina Permata', 'Jl. Gatot Subroto No. 7, Medan', NOW(), NOW()),
('7a8b9c0d-1e2f-3a4b-5c6d-7e8f90a1b2c3', 'EMP007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Faisal Rahman', 'Jl. Diponegoro No. 88, Yogyakarta', NOW(), NOW()),
('8b9c0d1e-2f3a-4b5c-6d7e-8f90a1b2c3d4', 'EMP008', 'b1fcc1d3-3c99-4e01-9a99-b1d3c99e01a2', 'Kartika Sari', 'Jl. Ahmad Yani No. 100, Semarang', NOW(), NOW()),
('9c0d1e2f-3a4b-5c6d-7e8f-90a1b2c3d4e5', 'EMP009', 'c2gdd2e4-4d11-4f12-acac-c2d4e12eacb3', 'Bayu Pratama', 'Jl. Asia Afrika No. 5, Makassar', NOW(), NOW()),
('0d1e2f3a-4b5c-6d7e-8f90-a1b2c3d4e5f6', 'EMP010', 'd3hee3f5-5e22-4g23-bddd-d3e5f23ebdc4', 'Citra Kirana', 'Jl. Patimura No. 20, Palembang', NOW(), NOW()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e', 'EMP011', 'e4iff4g6-6f33-4h34-ceee-e4f6g34fecd5', 'Dian Kusuma', 'Jl. Gajah Mada No. 15, Denpasar', NOW(), NOW()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7f', 'EMP012', 'f5jgg5h7-7g44-4i45-dfff-f5g7h45fgde6', 'Eko Cahyono', 'Jl. Imam Bonjol No. 30, Samarinda', NOW(), NOW()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e80', 'EMP013', 'g6khh6i8-8h55-4j56-efff-g6h8i56hefg7', 'Gita Anjani', 'Jl. Hasanuddin No. 40, Pontianak', NOW(), NOW()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f91', 'EMP014', 'h7lii7j9-9i66-4k67-gaga-h7i9j67igfh8', 'Hendra Gunawan', 'Jl. Letjen Suprapto No. 50, Manado', NOW(), NOW()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f90a2', 'EMP015', 'i8mjj8ka-aaj7-4l78-hbhb-i8jab78jahgi9', 'Indra Saputra', 'Jl. WR Supratman No. 60, Padang', NOW(), NOW());

INSERT INTO attendance (id, employee_id, attendance_id, clock_in, clock_out, created_at, updated_at) VALUES
('111a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c', 'EMP001', 'ATT001_UUID', '2025-07-15 08:55:00', '2025-07-15 17:05:00', NOW(), NOW()),
('222b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5d6e', 'EMP002', 'ATT002_UUID', '2025-07-15 08:28:00', '2025-07-15 16:32:00', NOW(), NOW()),
('333c4d5e-6f7a-8b9c-0d1e-2f3a4b5e6f7a', 'EMP003', 'ATT003_UUID', '2025-07-15 09:10:00', '2025-07-15 17:00:00', NOW(), NOW()),
('444d5e6f-7a8b-9c0d-1e2f-3a4b5f6a7b8c', 'EMP004', 'ATT004_UUID', '2025-07-15 09:12:00', '2025-07-15 17:20:00', NOW(), NOW()),
('555e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f90', 'EMP005', 'ATT005_UUID', '2025-07-15 09:05:00', '2025-07-15 18:10:00', NOW(), NOW()),
('666f7a8b-9c0d-1e2f-3a4b-5c6d7e8f91a2', 'EMP006', 'ATT006_UUID', '2025-07-15 07:58:00', '2025-07-15 16:02:00', NOW(), NOW()),
('777a8b9c-0d1e-2f3a-4b5c-6d7e8f92b3c4', 'EMP007', 'ATT007_UUID', '2025-07-15 09:25:00', '2025-07-15 17:35:00', NOW(), NOW()),
('888b9c0d-1e2f-3a4b-5c6d-7e8f93c4d5e6', 'EMP008', 'ATT008_UUID', '2025-07-15 08:35:00', '2025-07-15 16:40:00', NOW(), NOW()),
('999c0d1e-2f3a-4b5c-6d7e-8f94d5e6f7a8', 'EMP009', 'ATT009_UUID', '2025-07-15 09:18:00', '2025-07-15 17:10:00', NOW(), NOW()),
('000d1e2f-3a4b-5c6d-7e8f-95e6f7a8b9c0', 'EMP010', 'ATT010_UUID', '2025-07-15 09:02:00', '2025-07-15 18:05:00', NOW(), NOW()),
('aaae2f3a-4b5c-6d7e-8f90-a1b2c3d4e5f6', 'EMP011', 'ATT011_UUID', '2025-07-16 08:00:00', '2025-07-16 16:00:00', NOW(), NOW()),
('bbbf3a4b-5c6d-7e8f-90a1-b2c3d4e5f6a7', 'EMP012', 'ATT012_UUID', '2025-07-16 10:05:00', '2025-07-16 19:10:00', NOW(), NOW()),
('cccg4b5c-6d7e-8f90-a1b2-c3d4e5f6a7b8', 'EMP013', 'ATT013_UUID', '2025-07-16 09:30:00', '2025-07-16 17:30:00', NOW(), NOW()),
('dddh5c6d-7e8f-90a1-b2c3-d4e5f6a7b8c9', 'EMP014', 'ATT014_UUID', '2025-07-16 08:40:00', '2025-07-16 16:40:00', NOW(), NOW()),
('eeei6d7e-8f90-a1b2-c3d4-e5f6a7b8c9d0', 'EMP015', 'ATT015_UUID', '2025-07-16 09:00:00', '2025-07-16 17:00:00', NOW(), NOW());

INSERT INTO attendance_history (id, employee_id, attendance_id, date_attendance, attendance_type, description, created_at, updated_at) VALUES
('aa00bb11-cc22-dd33-ee44-ff55aa66bb77', 'EMP001', 'ATT001_UUID', '2025-07-15 08:55:00', 1, 'Clock In: Tepat waktu', NOW(), NOW()),
('bb11cc22-dd33-ee44-ff55-aa66bb77cc88', 'EMP001', 'ATT001_UUID', '2025-07-15 17:05:00', 2, 'Clock Out: Selesai kerja', NOW(), NOW()),
('cc22dd33-ee44-ff55-aa66-bb77cc88dd99', 'EMP002', 'ATT002_UUID', '2025-07-15 08:28:00', 1, 'Clock In: Awal', NOW(), NOW()),
('dd33ee44-ff55-aa66-bb77-cc88dd99ee00', 'EMP002', 'ATT002_UUID', '2025-07-15 16:32:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('ee44ff55-aa66-bb77-cc88-dd99ee00ff11', 'EMP003', 'ATT003_UUID', '2025-07-15 09:10:00', 1, 'Clock In: Terlambat sedikit', NOW(), NOW()),
('ff55aa66-bb77-cc88-dd99-ee00ff11aa22', 'EMP003', 'ATT003_UUID', '2025-07-15 17:00:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('aa66bb77-cc88-dd99-ee00-ff11aa22bb33', 'EMP004', 'ATT004_UUID', '2025-07-15 09:12:00', 1, 'Clock In: Terlambat', NOW(), NOW()),
('bb77cc88-dd99-ee00-ff11-aa22bb33cc44', 'EMP004', 'ATT004_UUID', '2025-07-15 17:20:00', 2, 'Clock Out: Lebih dari jam kerja', NOW(), NOW()),
('cc88dd99-ee00-ff11-aa22-bb33cc44dd55', 'EMP005', 'ATT005_UUID', '2025-07-15 09:05:00', 1, 'Clock In: Tepat waktu', NOW(), NOW()),
('dd99ee00-ff11-aa22-bb33-cc44dd55ee66', 'EMP005', 'ATT005_UUID', '2025-07-15 18:10:00', 2, 'Clock Out: Lembur', NOW(), NOW()),
('ee00ff11-aa22-bb33-cc44-dd55ee66ff77', 'EMP006', 'ATT006_UUID', '2025-07-15 07:58:00', 1, 'Clock In: Sangat awal', NOW(), NOW()),
('ff11aa22-bb33-cc44-dd55-ee66ff77aa88', 'EMP006', 'ATT006_UUID', '2025-07-15 16:02:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('aa22bb33-cc44-dd55-ee66-ff77aa88bb99', 'EMP007', 'ATT007_UUID', '2025-07-15 09:25:00', 1, 'Clock In: Terlambat', NOW(), NOW()),
('bb33cc44-dd55-ee66-ff77-aa88bb99cc00', 'EMP007', 'ATT007_UUID', '2025-07-15 17:35:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('cc44dd55-ee66-ff77-aa88-bb99cc00dd11', 'EMP008', 'ATT008_UUID', '2025-07-15 08:35:00', 1, 'Clock In: Awal', NOW(), NOW()),
('dd55ee66-ff77-aa88-bb99-cc00dd11ee22', 'EMP008', 'ATT008_UUID', '2025-07-15 16:40:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('ee66ff77-aa88-bb99-cc00-dd11ee22ff33', 'EMP009', 'ATT009_UUID', '2025-07-15 09:18:00', 1, 'Clock In: Terlambat', NOW(), NOW()),
('ff77aa88-bb99-cc00-dd11-ee22ff33aa44', 'EMP009', 'ATT009_UUID', '2025-07-15 17:10:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('aa88bb99-cc00-dd11-ee22-ff33aa44bb55', 'EMP010', 'ATT010_UUID', '2025-07-15 09:02:00', 1, 'Clock In: Tepat waktu', NOW(), NOW()),
('bb99cc00-dd11-ee22-ff33-aa44bb55cc66', 'EMP010', 'ATT010_UUID', '2025-07-15 18:05:00', 2, 'Clock Out: Lembur', NOW(), NOW()),
('cc00dd11-ee22-ff33-aa44-bb55cc66dd77', 'EMP011', 'ATT011_UUID', '2025-07-16 08:00:00', 1, 'Clock In: Tepat waktu', NOW(), NOW()),
('dd11ee22-ff33-aa44-bb55-cc66dd77ee88', 'EMP011', 'ATT011_UUID', '2025-07-16 16:00:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('ee22ff33-aa44-bb55-cc66-dd77ee88ff99', 'EMP012', 'ATT012_UUID', '2025-07-16 10:05:00', 1, 'Clock In: Sangat terlambat', NOW(), NOW()),
('ff33aa44-bb55-cc66-dd77-ee88ff99aa00', 'EMP012', 'ATT012_UUID', '2025-07-16 19:10:00', 2, 'Clock Out: Sangat lembur', NOW(), NOW()),
('aa44bb55-cc66-dd77-ee88-ff99aa00bb11', 'EMP013', 'ATT013_UUID', '2025-07-16 09:30:00', 1, 'Clock In: Tepat waktu', NOW(), NOW()),
('bb55cc66-dd77-ee88-ff99-aa00bb11cc22', 'EMP013', 'ATT013_UUID', '2025-07-16 17:30:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('cc66dd77-ee88-ff99-aa00-bb11cc22dd33', 'EMP014', 'ATT014_UUID', '2025-07-16 08:40:00', 1, 'Clock In: Awal', NOW(), NOW()),
('dd77ee88-ff99-aa00-bb11-cc22dd33ee44', 'EMP014', 'ATT014_UUID', '2025-07-16 16:40:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW()),
('ee88ff99-aa00-bb11-cc22-dd33ee44ff55', 'EMP015', 'ATT015_UUID', '2025-07-16 09:00:00', 1, 'Clock In: Tepat waktu', NOW(), NOW()),
('ff99aa00-bb11-cc22-dd33-ee44ff55aa66', 'EMP015', 'ATT015_UUID', '2025-07-16 17:00:00', 2, 'Clock Out: Tepat waktu', NOW(), NOW());

ALTER TABLE departement
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;