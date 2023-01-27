const jwt = require('jsonwebtoken');

require('dotenv').config();

// endpoint to login and receive a JWT to sign future requests
const loginSlaughtered = async (req, res) => {
  try{
    const { username, password } = req.body

    if (!username || !password || process.env.JWT_USER != username || process.env.JWT_PW !== password) {
      return res.status(401).end()
    }
  
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      algorithm: process.env.JWT_ALGO,
      expiresIn: process.env.JWT_EXPIRE_TIME,
    })
  
    res
      .status(200)
      .json({ 
              message: "Logged in successfully!",
              jwt: token 
            });
  } catch (error){
    res
      .status(403)
      .json({message: "invalid login"});

  }

}

module.exports = { loginSlaughtered }