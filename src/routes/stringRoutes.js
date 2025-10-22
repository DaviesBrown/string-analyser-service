import express from 'express';
import * as StringController from '../controllers/stringController.js';

const router = express.Router();

// Health check
router.get('/health', StringController.getHealth);

// String routes - specific routes MUST come before parameterized routes
router.post('/strings', StringController.createString);
router.get('/strings/filter-by-natural-language', StringController.filterByNaturalLanguage);
router.get('/strings', StringController.getAllStrings);
router.get('/strings/:string_value', StringController.getString);
router.delete('/strings/:string_value', StringController.deleteString);

export default router;