const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const attendanceHistoryModel = {
    createAttendanceHistory: async (historyData) => {
        console.log("Model: Membuat catatan riwayat absensi baru.");
        try {
            const { employee_id, attendance_id, date_attendance, attendance_type, description } = historyData;
            const newId = uuidv4();
            const query = `
                INSERT INTO attendance_history (id, employee_id, attendance_id, date_attendance, attendance_type, description)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await pool.execute(query, [newId, employee_id, attendance_id, date_attendance, attendance_type, description || null]);
            return newId;
        } catch (err) {
            console.error("Error di createAttendanceHistory:", err);
            throw err;
        }
    },

    getAttendanceLogs: async (filters = {}) => {
        console.log("Model: Mengambil log absensi dengan filter.");
        try {
            const { employee_id, departement_id, startDate, endDate } = filters;

            let query = `
                SELECT
                    ah.id AS history_id,
                    ah.employee_id,
                    e.name AS employee_name,
                    e.address AS employee_address,
                    e.departement_id,
                    d.departement_name,
                    d.max_clock_in_time,
                    d.max_clock_out_time,
                    ah.attendance_id,
                    ah.date_attendance,
                    ah.attendance_type,
                    CASE ah.attendance_type
                        WHEN 1 THEN 'Clock In'
                        WHEN 2 THEN 'Clock Out'
                        ELSE 'Unknown'
                    END AS attendance_type_name,
                    ah.description,
                    a.clock_in AS actual_clock_in,
                    a.clock_out AS actual_clock_out,
                    -- Status ketepatan absensi (berdasarkan clock_in)
                    CASE
                        WHEN ah.attendance_type = 1 AND TIME(ah.date_attendance) > d.max_clock_in_time THEN 'Terlambat'
                        WHEN ah.attendance_type = 1 AND TIME(ah.date_attendance) <= d.max_clock_in_time THEN 'Tepat Waktu'
                        ELSE NULL
                    END AS clock_in_status,
                    -- Status ketepatan absensi (berdasarkan clock_out - jika diperlukan)
                    CASE
                        WHEN ah.attendance_type = 2 AND TIME(ah.date_attendance) < d.max_clock_out_time THEN 'Pulang Cepat'
                        WHEN ah.attendance_type = 2 AND TIME(ah.date_attendance) >= d.max_clock_out_time THEN 'Tepat Waktu/Lembur'
                        ELSE NULL
                    END AS clock_out_status
                FROM
                    attendance_history AS ah
                JOIN
                    employee AS e ON ah.employee_id = e.employee_id
                JOIN
                    departement AS d ON e.departement_id = d.id
                LEFT JOIN
                    attendance AS a ON ah.attendance_id = a.attendance_id AND DATE(ah.date_attendance) = DATE(a.clock_in) 
                WHERE 1=1
            `;
            const params = [];

            if (employee_id) {
                query += ` AND ah.employee_id = ?`;
                params.push(employee_id);
            }
            if (departement_id) {
                query += ` AND e.departement_id = ?`;
                params.push(departement_id);
            }
            if (startDate) {
                query += ` AND DATE(ah.date_attendance) >= ?`;
                params.push(startDate);
            }
            if (endDate) {
                query += ` AND DATE(ah.date_attendance) <= ?`;
                params.push(endDate);
            }

            query += ` ORDER BY ah.date_attendance DESC`;

            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (err) {
            console.error("Error di getAttendanceLogs:", err);
            throw err;
        }
    },
};

module.exports = attendanceHistoryModel;
