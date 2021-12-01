const axios = require('axios');

exports.getAllUsers = async (req, res) => {
 
  await axios.get('https://jsonplaceholder.typicode.com/users').then((data => {
    const users = [...data.data];
    res.status(200).json({
       users, 
    })
  })).catch((err) => {
      res.status(400).json({
          message: 'Users not found!'
      });
  })
  
};