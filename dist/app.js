"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const students_1 = __importDefault(require("./routes/students"));
const careers_1 = __importDefault(require("./routes/careers"));
const enrollments_1 = __importDefault(require("./routes/enrollments"));
const payments_1 = __importDefault(require("./routes/payments"));
const prisma_1 = __importDefault(require("./lib/prisma"));
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(body_parser_1.default.json());
exports.app.use('/api/students', students_1.default);
exports.app.use('/api/careers', careers_1.default);
exports.app.use('/api/enrollments', enrollments_1.default);
exports.app.use('/api/payments', payments_1.default);
// Healthcheck for load balancers / Render
exports.app.get('/health', async (_req, res) => {
    try {
        // simple DB ping
        await prisma_1.default.$queryRaw `SELECT 1`;
        res.json({ ok: true, db: 'ok' });
    }
    catch (err) {
        console.error('Healthcheck DB failed', err);
        res.status(500).json({ ok: false, db: 'error', error: String(err) });
    }
});
exports.app.get('/', (req, res) => res.json({ ok: true }));
