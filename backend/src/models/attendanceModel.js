const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const attendanceModel = {
    getAllAttendances: async () => {
        console.log("Model: Mengambil semua data kehadiran.");
        try {
            const query = `
                SELECT
                    a.id,
                    a.employee_id,
                    e.name AS employee_name,
                    a.attendance_id,
                    a.clock_in,
                    a.clock_out,
                    a.created_at,
                    a.updated_at
                FROM
                    attendance AS a
                JOIN
                    employee AS e ON a.employee_id = e.employee_id
            `;
            const [rows] = await pool.execute(query);
            return rows;
        } catch (err) {
            console.error("Error di getAllAttendances:", err);
            throw err;
        }
    },

    getAttendanceById: async (id) => {
        console.log(`Model: Mengambil data kehadiran dengan ID: ${id}`);
        try {
            const query = `
                SELECT
                    a.id,
                    a.employee_id,
                    e.name AS employee_name,
                    a.attendance_id,
                    a.clock_in,
                    a.clock_out,
                    a.created_at,
                    a.updated_at
                FROM
                    attendance AS a
                JOIN
                    employee AS e ON a.employee_id = e.employee_id
                WHERE
                    a.id = ?
            `;
            const [rows] = await pool.execute(query, [id]);
            return rows[0] || null;
        } catch (err) {
            console.error("Error di getAttendanceById:", err);
            throw err;
        }
    },

    getActiveAttendanceByEmployeeId: async (employee_id, date) => {
        console.log(`Model: Mengambil kehadiran aktif karyawan ${employee_id} untuk tanggal ${date}.`);
        try {
            const query = `
                SELECT
                    id,
                    employee_id,
                    attendance_id,
                    clock_in,
                    clock_out
                FROM
                    attendance
                WHERE
                    employee_id = ? AND DATE(clock_in) = ? AND clock_out IS NULL
            `;
            const [rows] = await pool.execute(query, [employee_id, date]);
            return rows[0] || null;
        } catch (err) {
            console.error("Error di getActiveAttendanceByEmployeeId:", err);
            throw err;
        }
    },

    clockIn: async (employee_id, attendance_id) => {
        console.log(`Model: Karyawan ${employee_id} melakukan Clock In.`);
        try {
            const newId = uuidv4();
            const currentTime = new Date();
            const query = `
                INSERT INTO attendance (id, employee_id, attendance_id, clock_in)
                VALUES (?, ?, ?, ?)
            `;
            await pool.execute(query, [newId, employee_id, attendance_id, currentTime]);
            return { id: newId, clock_in_time: currentTime };
        } catch (err) {
            console.error("Error di clockIn:", err);
            throw err;
        }
    },

    clockOut: async (attendanceIdRecord, currentTime) => {
        console.log(`Model: Clock Out untuk catatan absensi ID: ${attendanceIdRecord}`);
        try {
            const query = `
                UPDATE attendance
                SET clock_out = ?, updated_at = NOW()
                WHERE id = ? AND clock_out IS NULL
            `;
            const [result] = await pool.execute(query, [currentTime, attendanceIdRecord]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error di clockOut:", err);
            throw err;
        }
    },
};

module.exports = attendanceModel;
