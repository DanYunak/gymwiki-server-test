import { Router } from 'express'
import { body } from 'express-validator'
import exerciseContoller from '../controllers/exerciseContoller.js'

const router = new Router()

const { createExercise, editExercise, deleteExercise, getAllExercises, getExercisesByMuscle } = exerciseContoller

router.post('/create',
    body('name').isLength({ min: 2, max: 30 }),
    createExercise)
router.put('/edit/:id', editExercise)
router.delete('/delete/:id', deleteExercise)
router.get('/', getAllExercises)
router.get('/:muscles', getExercisesByMuscle)

export default router