"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
/**
 * GET /api/careers
 * Listar todas las carreras / planes de estudio
 */
router.get('/', async (req, res) => {
    try {
        const careers = await prisma_1.default.career.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return res.json(careers);
    }
    catch (error) {
        console.error('Error fetching careers:', error);
        return res.status(500).json({
            error: 'Error al obtener las carreras'
        });
    }
});
exports.default = router;
