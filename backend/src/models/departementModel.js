const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const departementModel = {
    getAllDepartements: async () => {
        console.log("Model: Mengambil semua departemen.");
        try {
            const query = `SELECT id, departement_name, max_clock_in_time, max_clock_out_time, created_at, updated_at FROM departement`;
            const [rows] = await pool.execute(query);
            return rows;
        } catch (err) {
            console.error("Error di getAllDepartements:", err);
            throw err;
        }
    },

    getDepartementById: async (id) => {
        console.log(`Model: Mengambil departemen dengan ID: ${id}`);
        try {
            const query = `SELECT id, departement_name, max_clock_in_time, max_clock_out_time, created_at, updated_at FROM departement WHERE id = ?`;
            const [rows] = await pool.execute(query, [id]);
            return rows[0] || null;
        } catch (err) {
            console.error("Error di getDepartementById:", err);
            throw err;
        }
    },

    createDepartement: async (departementData) => {
        console.log("Model: Membuat departemen baru.");
        try {
            const { departement_name, max_clock_in_time, max_clock_out_time } = departementData;
            const newId = uuidv4();
            const query = `
                INSERT INTO departement (id, departement_name, max_clock_in_time, max_clock_out_time)
                VALUES (?, ?, ?, ?)
            `;
            await pool.execute(query, [newId, departement_name, max_clock_in_time || null, max_clock_out_time || null]);
            return newId;
        } catch (err) {
            console.error("Error di createDepartement:", err);
            throw err;
        }
    },

    updateDepartement: async (id, departementData) => {
        console.log(`Model: Memperbarui departemen dengan ID: ${id}`);
        try {
            const { departement_name, max_clock_in_time, max_clock_out_time } = departementData;
            let query = `UPDATE departement SET updated_at = NOW()`;
            const params = [];

            if (departement_name !== undefined) {
                query += `, departement_name = ?`;
                params.push(departement_name);
            }
            if (max_clock_in_time !== undefined) {
                query += `, max_clock_in_time = ?`;
                params.push(max_clock_in_time);
            }
            if (max_clock_out_time !== undefined) {
                query += `, max_clock_out_time = ?`;
                params.push(max_clock_out_time);
            }

            query += ` WHERE id = ?`;
            params.push(id);

            const [result] = await pool.execute(query, params);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error di updateDepartement:", err);
            throw err;
        }
    },

    deleteDepartement: async (id) => {
        console.log(`Model: Menghapus departemen dengan ID: ${id}`);
        try {
            const query = `DELETE FROM departement WHERE id = ?`;
            const [result] = await pool.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error di deleteDepartement:", err);
            throw err;
        }
    },
};

module.exports = departementModel;
