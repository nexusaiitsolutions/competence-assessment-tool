const { query } = require('../config/database');
const logger = require('../utils/logger');

exports.me = async (req, res) => {
res.json(req.user);
};

exports.list = async (req, res) => {
try {
const result = await query('SELECT id, employee_id, email, first_name, last_name, role_type, job_role, department, manager_id, is_active FROM users ORDER BY id');
res.json(result.rows);
} catch (e) { logger.error(e); res.status(500).json({ error: 'Failed' }); }
};


exports.create = async (req, res) => {
const { employee_id, email, first_name, last_name, role_type, job_role, department, manager_id } = req.body;
try {
const r = await query(`INSERT INTO users (employee_id,email,first_name,last_name,role_type,job_role,department,manager_id,is_active)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)
RETURNING id, employee_id, email, first_name, last_name, role_type, job_role, department, manager_id`,
[employee_id, email, first_name, last_name, role_type, job_role, department, manager_id || null]);
res.status(201).json(r.rows[0]);
} catch (e) { logger.error(e); res.status(500).json({ error: 'Create failed' }); }
};


exports.update = async (req, res) => {
const { id } = req.params;
const { first_name, last_name, role_type, job_role, department, manager_id, is_active } = req.body;
try {
const r = await query(`UPDATE users SET first_name=$1,last_name=$2,role_type=$3,job_role=$4,department=$5,manager_id=$6,is_active=$7,updated_at=NOW()
WHERE id=$8 RETURNING id, employee_id, email, first_name, last_name, role_type, job_role, department, manager_id, is_active`,
[ first_name, last_name, role_type, job_role, department, manager_id || null, is_active ?? true, id ]);
if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
res.json(r.rows[0]);
} catch (e) { logger.error(e); res.status(500).json({ error: 'Update failed' }); }
};