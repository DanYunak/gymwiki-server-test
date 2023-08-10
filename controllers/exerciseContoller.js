import exerciseService from '../services/exerciseService.js'

export const capitaliseParam = (param) => {
    return param.charAt(0).toUpperCase() + param.slice(1)
}

class ExerciseController {
    async createExercise(req, res, next) {
        try {
            const exercise = await exerciseService.createExercise(req.body)

            return res.json(exercise)
        } catch (e) {
            next(e)
        }
    }

    async editExercise(req, res, next) {
        try {
            const { id } = req.params
            const editedExercise = await exerciseService.editExercise(id, req.body)

            return res.json(editedExercise)
        } catch (e) {
            next(e)
        }
    }

    async deleteExercise(req, res, next) {
        try {
            const { id } = req.params
            const deletedExercise = await exerciseService.deleteExercise(id)

            return res.json(deletedExercise)
        } catch (e) {
            next(e)
        }
    }

    async getAllExercises(req, res, next) {
        try {
            const exercises = await exerciseService.getAllExercises()

            return res.json(exercises)
        } catch (e) {
            next(e)
        }
    }

    async getExercisesByMuscle(req, res, next) {
        try {
            const { muscles } = req.params
            const musclesCapitalized = capitaliseParam(muscles)

            const exercises = await exerciseService.getExercisesByMuscle(musclesCapitalized)

            return res.json(exercises)
        } catch (e) {
            next(e)
        }
    }
}

export default new ExerciseController()