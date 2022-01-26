const {Router} = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

const router = Router()

router.post('/register',
 [
   check('email', 'Uncorrected email').isEmail(),
   check('password', 'Minimum 4 characters').isLength({min: 4, max: 20})
 ],
  async (req, res) => {
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Uncorrected data',
      })
    }

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

router.post('/login',
  [
    check('email', 'Uncorrected email').normalizeEmail().isEmail(),
    check('password', 'Minimum 4 characters').exists()
  ],
 async (req, res) => {
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Uncorrected data',
    })
    }

    const { email, password } = req.body
    const user = await User.findOne({email})
    if (!user) {
      return res.status(400).json({message: 'This user not found'})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) { 
      return res.status(400).json({message: 'Unauthorized access'})
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.get('jwtSecret'),
      { expiresIn: '2h' },
    )
    res.json({token, userId: user.id})
    
  } catch (e) {
    res.status(500).json({message: e})
  }
})

module.exports = router