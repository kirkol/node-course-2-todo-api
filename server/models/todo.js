const mongoose = require('mongoose')

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, 
    minlenght: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  //przechowuje id usera, ktory stworzyl to todo
  //spoko sprawa, bo pole jest wymagane, zatem bez id (bez zalogowania)
  //nie da sie stworzyc posta
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = {Todo}
