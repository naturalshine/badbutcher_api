require('dotenv').config();

// auth handler
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) {
          return res.status(401).end()
      }
  
    jwt.verify(token, process.env.JWT_SECRET, err => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      next()
    })
    
  }
  
  module.exports = {
	authenticateToken,
}