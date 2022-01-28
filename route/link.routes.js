const { Router } = require('express')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const config = require('config')
const router = Router()

router.post('/generate', auth, async (req, res) => {
  try {
    const baseUrl =  config.get('baseUrl')
    const { from } = req.body
    const code = shortid.generate()
    const existing = await Link.findOne({ from: from })
    if (existing) {
      return res.json({ link: existing })
    }

    const to = baseUrl + '/t/' + code
    
    const link = new Link({ code, to, from, owner: req.user.userId })
    await link.save()
    res.status(201).json({ link })

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({owner: req.user.userId})
    res.json(links)
  } catch (e) {
    res.status(500).json({message: e.message})
  }
})

router.get('/:id', auth, async (req, res) => {
  const id = req.params.id
  try {
    const link = await Link.findById(id)
    res.json(link)
  } catch (e) {
    res.status(500).json({message: e})
  }
})

module.exports = router