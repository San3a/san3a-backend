import express from 'express';

const router = express.Router();

router.route('/').get().post();
router.route('/:id').get().patch().delete();
router.patch('/:id/status');
router.patch('/:id/select-offer');
