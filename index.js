const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const router = express.Router();
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
  });  
  app.get('/getfile', (req, res) => {
    const file_id = req.query.fileid;
    const password = req.query.pw;
    
    if (!file_id || !password) {
      return res.status(400).send('file_id and password are required');
    }
    
    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send(`Error reading the database: ${err.message}`);
      }
    
      try {
        const users = JSON.parse(data).users;
        const user = users.find(u => u.file_id === file_id && u.password === password);
    
        if (user) {
          return res.redirect(user.link);
        } else {
          return res.status(401).sendFile(path.join(__dirname+'/wrongfile.html'));
        }
      } catch (err) {
        return res.status(500).send(`Error parsing the database: ${err.message}`);
      }
    });
  });
  
  app.use('/', router);
  app.listen(3000, () => { console.log('Server started on port 3000'); });
  module.exports = app;