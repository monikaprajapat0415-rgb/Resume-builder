// Project 5: employees, departments, attendance and permissions (admin, hr, manager, employee).
import express from 'express';
import { AppError, requireAuth, requireRole, errorHandler, notFoundHandler } from './p-kit.js';

const today = (now) => now().toISOString().slice(0, 10);

export function createApp({ now = () => new Date() } = {}) {
  const app = express();
  app.use(express.json());
  const auth = requireAuth();
  const departments = new Map();
  const employees = new Map();
  const attendance = [];       // { employeeId, date, checkIn, checkOut }

  app.post('/api/departments', auth, requireRole('admin', 'hr'), (req, res) => {
    const name = String(req.body?.name ?? '').trim();
    if (!name) throw new AppError('name is required', 422);
    if ([...departments.values()].some((d) => d.name.toLowerCase() === name.toLowerCase())) throw new AppError('Department exists', 409);
    const department = { id: departments.size + 1, name };
    departments.set(department.id, department);
    res.status(201).json(department);
  });

  app.post('/api/employees', auth, requireRole('admin', 'hr'), (req, res) => {
    const { name, departmentId, userId } = req.body ?? {};
    if (!name || !departments.has(departmentId)) throw new AppError('name and a real departmentId are required', 422);
    const employee = { id: employees.size + 1, name, departmentId, userId: userId ?? null, active: true };
    employees.set(employee.id, employee);
    res.status(201).json(employee);
  });

  // Who may see which employees: hr and admin see all, a manager sees their own department, an employee only themselves.
  app.get('/api/employees', auth, (req, res) => {
    const all = [...employees.values()];
    if (['admin', 'hr'].includes(req.user.role)) return res.json(all);
    const me = all.find((e) => e.userId === req.user.id);
    if (req.user.role === 'manager' && me) return res.json(all.filter((e) => e.departmentId === me.departmentId));
    res.json(me ? [me] : []);
  });

  // Soft delete: keep the history, just stop the person from working.
  app.delete('/api/employees/:id', auth, requireRole('admin', 'hr'), (req, res) => {
    const employee = employees.get(Number(req.params.id));
    if (!employee) throw new AppError('Employee not found', 404);
    employee.active = false;
    res.status(204).end();
  });

  const myEmployee = (req) => {
    const employee = [...employees.values()].find((e) => e.userId === req.user.id && e.active);
    if (!employee) throw new AppError('You are not an active employee', 403);
    return employee;
  };

  app.post('/api/attendance/check-in', auth, (req, res) => {
    const employee = myEmployee(req);
    if (attendance.some((a) => a.employeeId === employee.id && a.date === today(now))) throw new AppError('Already checked in today', 409);
    const record = { employeeId: employee.id, date: today(now), checkIn: now().toISOString(), checkOut: null };
    attendance.push(record);
    res.status(201).json(record);
  });

  app.post('/api/attendance/check-out', auth, (req, res) => {
    const employee = myEmployee(req);
    const record = attendance.find((a) => a.employeeId === employee.id && a.date === today(now));
    if (!record) throw new AppError('Check in first', 409);
    if (record.checkOut) throw new AppError('Already checked out', 409);
    record.checkOut = now().toISOString();
    record.hours = Math.round(((new Date(record.checkOut) - new Date(record.checkIn)) / 3_600_000) * 100) / 100;
    res.json(record);
  });

  app.get('/api/attendance', auth, requireRole('admin', 'hr', 'manager'), (req, res) => {
    const { date } = req.query;
    res.json(attendance.filter((a) => !date || a.date === date));
  });

  app.use(notFoundHandler, errorHandler);
  return app;
}
