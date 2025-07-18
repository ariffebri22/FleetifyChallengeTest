const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const employeeModel = {
    getAllEmployees: async () => {
        console.log("Model: Mengambil semua karyawan.");
        try {
            const query = `
                SELECT
                    e.id,
                    e.employee_id,
                    e.departement_id,
                    d.departement_name,
                    e.name,
                    e.address,
                    e.created_at,
                    e.updated_at
                FROM
                    employee AS e
                JOIN
                    departement AS d ON e.departement_id = d.id
            `;
            const [rows] = await pool.execute(query);
            return rows;
        } catch (err) {
            console.error("Error di getAllEmployees:", err);
            throw err;
        }
    },

    getEmployeeById: async (id) => {
        console.log(`Model: Mengambil karyawan dengan ID: ${id}`);
        try {
            const query = `
                SELECT
                    e.id,
                    e.employee_id,
                    e.departement_id,
                    d.departement_name,
                    e.name,
                    e.address,
                    e.created_at,
                    e.updated_at
                FROM
                    employee AS e
                JOIN
                    departement AS d ON e.departement_id = d.id
                WHERE
                    e.id = ?
            `;
            const [rows] = await pool.execute(query, [id]);
            return rows[0] || null;
        } catch (err) {
            console.error("Error di getEmployeeById:", err);
            throw err;
        }
    },

    getEmployeeByEmployeeId: async (employee_id) => {
        console.log(`Model: Mengambil karyawan dengan Employee ID: ${employee_id}`);
        try {
            const query = `
                SELECT
                    e.id,
                    e.employee_id,
                    e.departement_id,
                    d.departement_name,
                    e.name,
                    e.address,
                    e.created_at,
                    e.updated_at
                FROM
                    employee AS e
                JOIN
                    departement AS d ON e.departement_id = d.id
                WHERE
                    e.employee_id = ?
            `;
            const [rows] = await pool.execute(query, [employee_id]);
            return rows[0] || null;
        } catch (err) {
            console.error("Error di getEmployeeByEmployeeId:", err);
            throw err;
        }
    },

    createEmployee: async (employeeData) => {
        console.log("Model: Membuat karyawan baru.");
        try {
            const { employee_id, departement_id, name, address } = employeeData;
            const newId = uuidv4();
            const query = `
                INSERT INTO employee (id, employee_id, departement_id, name, address)
                VALUES (?, ?, ?, ?, ?)
            `;
            await pool.execute(query, [newId, employee_id, departement_id, name, address || null]);
            return newId;
        } catch (err) {
            console.error("Error di createEmployee:", err);
            throw err;
        }
    },

    updateEmployee: async (id, employeeData) => {
        console.log(`Model: Memperbarui karyawan dengan ID: ${id}`);
        try {
            const { employee_id, departement_id, name, address } = employeeData;
            let query = `UPDATE employee SET updated_at = NOW()`;
            const params = [];

            if (employee_id !== undefined) {
                query += `, employee_id = ?`;
                params.push(employee_id);
            }
            if (departement_id !== undefined) {
                query += `, departement_id = ?`;
                params.push(departement_id);
            }
            if (name !== undefined) {
                query += `, name = ?`;
                params.push(name);
            }
            if (address !== undefined) {
                query += `, address = ?`;
                params.push(address);
            }

            query += ` WHERE id = ?`;
            params.push(id);

            const [result] = await pool.execute(query, params);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error di updateEmployee:", err);
            throw err;
        }
    },

    deleteEmployee: async (id) => {
        console.log(`Model: Menghapus karyawan dengan ID: ${id}`);
        try {
            const query = `DELETE FROM employee WHERE id = ?`;
            const [result] = await pool.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error di deleteEmployee:", err);
            throw err;
        }
    },
};

module.exports = employeeModel;
