const attendanceModel = require("../models/attendanceModel");
const attendanceHistoryModel = require("../models/attendanceHistoryModel");
const employeeModel = require("../models/employeeModel");
const departementModel = require("../models/departementModel");

const attendanceController = {
    clockIn: async (req, res) => {
        try {
            const { employee_id } = req.body;

            if (!employee_id) {
                return res.status(400).json({
                    success: false,
                    message: "Employee ID diperlukan untuk absen masuk.",
                });
            }

            const employee = await employeeModel.getEmployeeByEmployeeId(employee_id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Karyawan dengan Employee ID tersebut tidak ditemukan.",
                });
            }

            const today = new Date().toISOString().slice(0, 10);
            const activeAttendance = await attendanceModel.getActiveAttendanceByEmployeeId(employee_id, today);

            if (activeAttendance) {
                return res.status(409).json({
                    success: false,
                    message: "Karyawan ini sudah melakukan absen masuk hari ini dan belum absen keluar.",
                });
            }

            const attendance_id = `ATT-${employee_id}-${Date.now()}`;
            const { id: newAttendanceRecordId, clock_in_time } = await attendanceModel.clockIn(employee_id, attendance_id);

            const historyDescription = "Absen Masuk";
            await attendanceHistoryModel.createAttendanceHistory({
                employee_id: employee.employee_id,
                attendance_id: attendance_id,
                date_attendance: clock_in_time,
                attendance_type: 1,
                description: historyDescription,
            });

            res.status(201).json({
                success: true,
                message: "Absen masuk berhasil!",
                data: {
                    attendance_record_id: newAttendanceRecordId,
                    employee_id: employee.employee_id,
                    employee_name: employee.name,
                    clock_in_time: clock_in_time,
                },
            });
        } catch (error) {
            console.error("Error di clockIn controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal melakukan absen masuk.",
                error: error.message,
            });
        }
    },

    clockOut: async (req, res) => {
        try {
            const { employee_id } = req.body;

            if (!employee_id) {
                return res.status(400).json({
                    success: false,
                    message: "Employee ID diperlukan untuk absen keluar.",
                });
            }

            const employee = await employeeModel.getEmployeeByEmployeeId(employee_id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Karyawan dengan Employee ID tersebut tidak ditemukan.",
                });
            }

            const today = new Date().toISOString().slice(0, 10);
            const activeAttendance = await attendanceModel.getActiveAttendanceByEmployeeId(employee_id, today);

            if (!activeAttendance) {
                return res.status(404).json({
                    success: false,
                    message: "Karyawan ini belum absen masuk hari ini atau sudah absen keluar.",
                });
            }

            const currentTime = new Date();
            const updated = await attendanceModel.clockOut(activeAttendance.id, currentTime);

            if (!updated) {
                return res.status(500).json({
                    success: false,
                    message: "Gagal memperbarui absen keluar. Mungkin catatan absensi tidak ditemukan atau sudah diupdate.",
                });
            }

            const historyDescription = "Absen Keluar";
            await attendanceHistoryModel.createAttendanceHistory({
                employee_id: employee.employee_id,
                attendance_id: activeAttendance.attendance_id,
                date_attendance: currentTime,
                attendance_type: 2,
                description: historyDescription,
            });

            res.status(200).json({
                success: true,
                message: "Absen keluar berhasil!",
                data: {
                    attendance_record_id: activeAttendance.id,
                    employee_id: employee.employee_id,
                    employee_name: employee.name,
                    clock_out_time: currentTime,
                },
            });
        } catch (error) {
            console.error("Error di clockOut controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal melakukan absen keluar.",
                error: error.message,
            });
        }
    },

    getAttendanceLogs: async (req, res) => {
        try {
            const { employee_id, departement_id, start_date, end_date } = req.query;

            if (start_date && !Date.parse(start_date)) {
                return res.status(400).json({ success: false, message: "Format start_date tidak valid (YYYY-MM-DD)." });
            }
            if (end_date && !Date.parse(end_date)) {
                return res.status(400).json({ success: false, message: "Format end_date tidak valid (YYYY-MM-DD)." });
            }

            const filters = {
                employee_id: employee_id || null,
                departement_id: departement_id || null,
                startDate: start_date || null,
                endDate: end_date || null,
            };

            const logs = await attendanceHistoryModel.getAttendanceLogs(filters);

            res.status(200).json({
                success: true,
                message: "Log absensi berhasil diambil.",
                data: logs,
            });
        } catch (error) {
            console.error("Error di getAttendanceLogs controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal mengambil log absensi.",
                error: error.message,
            });
        }
    },
};

module.exports = attendanceController;
