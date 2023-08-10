import ApiError from '../exceptions/apiError.js'
import Exercise from '../models/exerciseModel.js'

class ExerciseService {
    async createExercise(exerciseData) {
        const { name, primaryMuscles, secondaryMuscles, equipment, img, type } = exerciseData

        const exerciseCheck = await Exercise.findOne({ name })

        if (exerciseCheck) {
            throw ApiError.BadRequest('Exercise with this name already exists')
        }

        const exercise = await Exercise.create({ name, primaryMuscles, secondaryMuscles, equipment, img, type })

        return exercise
    }

    async editExercise(id, exerciseData) {
        if (!id) {
            throw ApiError.BadRequest('ID is not defined')
        }

        const exercise = Exercise.findByIdAndUpdate(id, exerciseData, { new: true })

        return exercise
    }

    async deleteExercise(id) {
        if (!id) {
            throw ApiError.BadRequest('ID is not defined')
        }

        const exercise = Exercise.findByIdAndDelete(id)

        return exercise
    }

    async getAllExercises() {
        const exercises = await Exercise.find()

        return exercises
    }

    async getExercisesByMuscle(muscles) {
        const exercises = await Exercise.find({ primaryMuscles: muscles })

        return exercises
    }
}

export default new ExerciseService()