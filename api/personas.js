import { personas } from '../backend/personas.js';

export default function handler(req, res) {
  res.status(200).json(personas);
}
