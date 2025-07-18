const employeeModel = require("../models/employeeModel");
const departementModel = require("../models/departementModel");

const employeeController = {
    getAllEmployees: async (req, res) => {
        try {
            const employees = await employeeModel.getAllEmployees();
            res.status(200).json({
                success: true,
                message: "Data karyawan berhasil diambil",
                data: employees,
            });
        } catch (error) {
            console.error("Error di getAllEmployees controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal mengambil data karyawan",
                error: error.message,
            });
        }
    },

    getEmployeeById: async (req, res) => {
        try {
            const { id } = req.params;
            const employee = await employeeModel.getEmployeeById(id);

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Karyawan tidak ditemukan",
                });
            }

            res.status(200).json({
                success: true,
                message: "Karyawan berhasil ditemukan",
                data: employee,
            });
        } catch (error) {
            console.error("Error di getEmployeeById controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal mengambil data karyawan",
                error: error.message,
            });
        }
    },

    createEmployee: async (req, res) => {
        try {
            const { employee_id, departement_id, name, address } = req.body;

            if (!employee_id || !departement_id || !name) {
                return res.status(400).json({
                    success: false,
                    message: "Employee ID, Departement ID, dan Nama karyawan diperlukan",
                });
            }

            const departementExists = await departementModel.getDepartementById(departement_id);
            if (!departementExists) {
                return res.status(400).json({
                    success: false,
                    message: "Departement ID tidak valid atau tidak ditemukan",
                });
            }

            const newEmployeeId = await employeeModel.createEmployee({
                employee_id,
                departement_id,
                name,
                address,
            });

            res.status(201).json({
                success: true,
                message: "Karyawan berhasil dibuat",
                data: { id: newEmployeeId, employee_id, name },
            });
        } catch (error) {
            console.error("Error di createEmployee controller:", error);
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Employee ID sudah ada atau data duplikat",
                    error: error.sqlMessage,
                });
            }
            res.status(500).json({
                success: false,
                message: "Gagal membuat karyawan",
                error: error.message,
            });
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const { id } = req.params;
            const employeeData = req.body;
            const { departement_id } = employeeData;

            if (Object.keys(employeeData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Tidak ada data yang disediakan untuk diperbarui",
                });
            }

            if (departement_id) {
                const departementExists = await departementModel.getDepartementById(departement_id);
                if (!departementExists) {
                    return res.status(400).json({
                        success: false,
                        message: "Departement ID tidak valid atau tidak ditemukan",
                    });
                }
            }

            const updated = await employeeModel.updateEmployee(id, employeeData);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Karyawan tidak ditemukan atau tidak ada perubahan",
                });
            }

            res.status(200).json({
                success: true,
                message: "Data karyawan berhasil diperbarui",
                data: { id },
            });
        } catch (error) {
            console.error("Error di updateEmployee controller:", error);
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Employee ID yang diberikan sudah ada",
                    error: error.sqlMessage,
                });
            }
            res.status(500).json({
                success: false,
                message: "Gagal memperbarui data karyawan",
                error: error.message,
            });
        }
    },

    deleteEmployee: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await employeeModel.deleteEmployee(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Karyawan tidak ditemukan",
                });
            }

            res.status(200).json({
                success: true,
                message: "Karyawan berhasil dihapus",
            });
        } catch (error) {
            console.error("Error di deleteEmployee controller:", error);
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    success: false,
                    message: "Karyawan tidak dapat dihapus karena ada riwayat absensi terkait. Harap hapus riwayat absensi terkait terlebih dahulu.",
                    error: error.sqlMessage,
                });
            }
            res.status(500).json({
                success: false,
                message: "Gagal menghapus karyawan",
                error: error.message,
            });
        }
    },
};

module.exports = employeeController;
