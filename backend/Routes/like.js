import express from 'express';
export const likeRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';