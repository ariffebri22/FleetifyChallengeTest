const departementModel = require("../models/departementModel");

const departementController = {
    getAllDepartements: async (req, res) => {
        try {
            const departements = await departementModel.getAllDepartements();
            res.status(200).json({
                success: true,
                message: "Departemen berhasil diambil",
                data: departements,
            });
        } catch (error) {
            console.error("Error di getAllDepartements controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal mengambil departemen",
                error: error.message,
            });
        }
    },

    getDepartementById: async (req, res) => {
        try {
            const { id } = req.params;
            const departement = await departementModel.getDepartementById(id);

            if (!departement) {
                return res.status(404).json({
                    success: false,
                    message: "Departemen tidak ditemukan",
                });
            }

            res.status(200).json({
                success: true,
                message: "Departemen berhasil ditemukan",
                data: departement,
            });
        } catch (error) {
            console.error("Error di getDepartementById controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal mengambil departemen",
                error: error.message,
            });
        }
    },

    createDepartement: async (req, res) => {
        try {
            const { departement_name, max_clock_in_time, max_clock_out_time } = req.body;

            if (!departement_name) {
                return res.status(400).json({
                    success: false,
                    message: "Nama departemen diperlukan",
                });
            }

            const newDepartementId = await departementModel.createDepartement({
                departement_name,
                max_clock_in_time,
                max_clock_out_time,
            });

            res.status(201).json({
                success: true,
                message: "Departemen berhasil dibuat",
                data: { id: newDepartementId, departement_name },
            });
        } catch (error) {
            console.error("Error di createDepartement controller:", error);
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Nama departemen sudah ada atau data duplikat",
                    error: error.sqlMessage,
                });
            }
            res.status(500).json({
                success: false,
                message: "Gagal membuat departemen",
                error: error.message,
            });
        }
    },

    updateDepartement: async (req, res) => {
        try {
            const { id } = req.params;
            const departementData = req.body;

            if (Object.keys(departementData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Tidak ada data yang disediakan untuk diperbarui",
                });
            }

            const updated = await departementModel.updateDepartement(id, departementData);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Departemen tidak ditemukan atau tidak ada perubahan",
                });
            }

            res.status(200).json({
                success: true,
                message: "Departemen berhasil diperbarui",
                data: { id },
            });
        } catch (error) {
            console.error("Error di updateDepartement controller:", error);
            res.status(500).json({
                success: false,
                message: "Gagal memperbarui departemen",
                error: error.message,
            });
        }
    },

    deleteDepartement: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await departementModel.deleteDepartement(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Departemen tidak ditemukan",
                });
            }

            res.status(200).json({
                success: true,
                message: "Departemen berhasil dihapus",
            });
        } catch (error) {
            console.error("Error di deleteDepartement controller:", error);
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    success: false,
                    message: "Departemen tidak dapat dihapus karena ada karyawan yang terkait. Harap hapus atau pindahkan karyawan terlebih dahulu.",
                    error: error.sqlMessage,
                });
            }
            res.status(500).json({
                success: false,
                message: "Gagal menghapus departemen",
                error: error.message,
            });
        }
    },
};

module.exports = departementController;
