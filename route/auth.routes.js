const {Router} = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')

const router = Router()

router.post('/register',
 [
   check('email', 'Uncorrected email').isEmail(),
   check('password', 'Minimum 4 characters').isLength({min: 4, max: 20})
 ],
  async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({email})
    if (candidate) {
      return res.status(400).json({message: 'This user already exists'})
    }
    const salt = 10
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({email, password: hashedPassword})
    await user.save()
    res.status(201).json({message: 'User is created'})
  } catch (e) {
    res.status(500).json({message: e})
  }
})

router.post('/login', async (req, res) => {
  try {
    
  } catch (e) {
    res.status(500).json({message: e})
  }
})

module.exports = router