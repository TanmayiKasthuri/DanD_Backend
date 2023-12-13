const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')
const verifyJWT=require('../middleware/verifyJWT')

router.use(verifyJWT)//applies for all the routes below

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router