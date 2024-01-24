const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const app = express();
const port = 8082;

app.use(bodyParser.json()); // Middleware to parse JSON

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://jiazhe1221.github.io');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Connection URI
const uri = 'mongodb+srv://user123:SkyStudios5757@skystudios.rjfe3hg.mongodb.net/NimbusWealth';

// Connect to the MongoDB server
MongoClient.connect(uri, (err, client) => {
    if (err) throw err;

    // Access the databases
    const db = client.db('NimbusWealth');

    // Access the users collection
    const usersCollection = db.collection('testing');

    // Registration endpoint
    app.post('/signup', async (req, res) => {
        const { username, emailaddress, password } = req.body;

        try {
            // Check if the username or email already exists in the database
            const existingUser = await usersCollection.findOne({
                $or: [
                    { username: username },
                    { email: emailaddress },
                ],
            });

            if (existingUser) {
                const existingField = existingUser.username === username ? 'Username' : 'Email';
                return res.status(400).json({ success: false, message: `${existingField} already exists` });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Replace the plain text password with the hashed password
            const userData = {
                username: username,
                email: emailaddress, // Fix variable name here
                password: hashedPassword,
            };

            // Insert user data
            await usersCollection.insertOne(userData);

            res.status(200).json({ success: true, message: 'User registered successfully' });
        } catch (error) {
            console.error('Error processing registration:', error);
            res.status(500).json({ success: false, message: 'Error processing registration' });
        }
    });

    // Login endpoint
    app.post('/signin', async (req, res) => {
      const { username, password } = req.body;
  
      try {
          // Check if the user exists in the database
          const existingUser = await usersCollection.findOne({ username: username });
  
          if (!existingUser) {
              return res.status(400).json({ success: false, message: 'User not found' });
          }
  
          // Compare the provided password with the hashed password in the database
          const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
          if (!passwordMatch) {
              return res.status(401).json({ success: false, message: 'Invalid password' });
          }
  
          // If username and password are valid, you can consider the user authenticated
          // Send the user data along with the success response
          res.status(200).json({ success: true, message: 'Login successful', userData: existingUser });
      } catch (error) {
          console.error('Error processing login:', error);
          res.status(500).json({ success: false, message: 'Error processing login' });
      }
  });

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running and listening at http://localhost:${port}`);
    });

    // Close the MongoDB client when the application is shutting down
    process.on('SIGINT', () => {
        client.close();
        process.exit();
    });
});
