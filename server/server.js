const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 8082;

app.use(bodyParser.json()); // Middleware to parse JSON

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');  // use https://jiazhe1221.github.io when website is live on github use http://localhost:8081 for local host
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
              res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
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

    // Endpoint to get user data based on userId
    app.get('/getUserData', async (req, res) => {
      const userId = req.query.userId;
    
      try {
        // Find the user with the specified userId
        const user = await usersCollection.findOne({ _id: ObjectId(userId) });
      
        if (!user) {
          // If the user does not exist, send an error response
          return res.status(404).json({ error: 'User not found.' });
        }
      
        // Send the user data in the response
        res.status(200).json({ user });
      } catch (error) {
        // Send an error response with details
        res.status(500).json({ error: 'Internal server error.', details: error.message });
      }
    });

    // Check username endpoint
    app.post('/checkUsername', async (req, res) => {
      try {
          const { newUsername } = req.body;
      
          // Check if the new username already exists in the database
          const existingUser = await usersCollection.findOne({ username: newUsername });
      
          if (existingUser) {
              res.status(200).json({ success: false, message: 'Username already exists' });
          } else {
              res.status(200).json({ success: true, message: 'Username is unique' });
          }
      } catch (error) {
          console.error('Error checking username:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });

    // Update username endpoint
    app.post('/updateUsername', async (req, res) => {
      try {
          const { userId, newUsername } = req.body;
  
          // Convert userId to ObjectId
          const objectId = new ObjectId(userId);
  
          // Update the username in the database
          const result = await usersCollection.updateOne({ _id: objectId }, { $set: { username: newUsername } });
          if (result.modifiedCount > 0) {
              // Username updated successfully
              res.status(200).json({ success: true, message: 'Username updated successfully' });
          } else {
              // No matching user found
              res.status(404).json({ success: false, message: 'User not found' });
          }
      } catch (error) {
          console.error('Error updating username:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });

    // Check old password endpoint
    app.post('/checkOldPassword', async (req, res) => {
      try {
          // Extract necessary information from the request body
          const { userId, oldPassword } = req.body;
          const objectId = new ObjectId(userId);
      
          // Retrieve the user's hashed password from the database based on the username
          const user = await usersCollection.findOne({ _id: objectId });
      
          if (!user) {
              return res.status(400).json({ success: false, message: 'User not found' });
          }
        
          // Compare the entered old password with the stored hashed password
          const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        
          if (!passwordMatch) {
              return res.status(401).json({ success: false, message: 'Incorrect old password' });
          }
        
          // Password is correct
          res.status(200).json({ success: true, message: 'Old password is correct' });
      } catch (error) {
          console.error('Error checking old password:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });
    
    // Update password endpoint
    app.post('/updatePassword', async (req, res) => {
      try {
          // Extract necessary information from the request body
          const { _id, newPassword } = req.body;
          const objectId = new ObjectId(_id);
          
          // Hash the password
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          // Update the user's password in the database
          await usersCollection.updateOne({ _id: objectId }, { $set: { password: hashedPassword } });
          res.status(200).json({ success: true, message: 'Password updated successfully' });
      } catch (error) {
          console.error('Error updating password:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });

    // Check if email exists endpoint
    app.post('/checkEmailExistence', async (req, res) => {
      try {
          const { email } = req.body;
      
          // Check if the email already exists in the database
          const existingEmail = await usersCollection.findOne({ email: email });
      
          if (existingEmail) {
              return res.status(400).json({ success: false, message: 'Email already exists' });
          }
        
          // Email is unique
          res.status(200).json({ success: true, message: 'Email is unique' });
      } catch (error) {
          console.error('Error checking email existence:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });

    // Update email endpoint
    app.post('/updateEmail', async (req, res) => {
      try {
          const { userId, newEmail } = req.body;
      
          // Update the email in the database
          const result = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: { email: newEmail } });
      
          if (result.modifiedCount > 0) {
              // Email updated successfully
              res.status(200).json({ success: true, message: 'Email updated successfully' });
          } else {
              // No matching user found
              res.status(404).json({ success: false, message: 'User not found' });
          }
      } catch (error) {
          console.error('Error updating email:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });

    // Update birthdate endpoint
    app.post('/updateBirthdate', async (req, res) => {
      try {
          const { userId, newBirthdate } = req.body;
      
          // Convert userId to ObjectId
          const objectId = new ObjectId(userId);
      
          // Update the birthdate in the database
          const result = await usersCollection.updateOne(
              { _id: objectId },
              { $set: { birthdate: newBirthdate } }
          );
          
          if (result.modifiedCount > 0) {
              // Birthdate updated successfully
              res.status(200).json({ success: true, message: 'Birthdate updated successfully' });
          } else {
              // No matching user found
              res.status(404).json({ success: false, message: 'User not found' });
          }
      } catch (error) {
          console.error('Error updating birthdate:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });

    // Update currency endpoint
    app.post('/updateCurrency', async (req, res) => {
      try {
          const { userId, newCurrency } = req.body;
      
          // Convert userId to ObjectId
          const objectId = new ObjectId(userId);
      
          // Update the currency in the database
          const result = await usersCollection.updateOne(
              { _id: objectId },
              { $set: { currency: newCurrency } }
          );
          
          if (result.modifiedCount > 0) {
              // Currency updated successfully
              res.status(200).json({ success: true, message: 'Currency updated successfully' });
          } else {
              // No matching user found
              res.status(404).json({ success: false, message: 'User not found' });
          }
      } catch (error) {
          console.error('Error updating currency:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
      }
    });

    // Add Wallet End Point
    app.post('/addWalletItem', async (req, res) => {
      const { userId, name, type, currency, amount } = req.body;
    
      try {      
        // Check if the user with the specified userId exists
        const user = await usersCollection.findOne({ _id: ObjectId(userId) });
      
        if (!user) {
          // If the user does not exist, send an error response
          return res.status(400).json({ error: 'User not found.' });
        }
        // Check if the name already exists in the wallet items
        const existingItem = user.walletItems && user.walletItems.find(item => item.name === name);
      
        if (existingItem) {
          // If the item already exists, send an error response
          return res.status(401).json({ error: 'Wallet item with this name already exists for the user.' });
        }
      
        // Create a new wallet item
        const newWalletItem = {
          name,
          type,
          currency,
          amount
        };
      
        // Update the user document by adding the new wallet item
        await usersCollection.updateOne(
          { _id: ObjectId(userId) },
          { $push: { walletItems: newWalletItem } }
        );
        
        // Send a success response
        res.status(200).json({ success: 'Wallet item added successfully.' });
      } catch (error) {
        // Send an error response with details
        res.status(500).json({ error: 'Internal server error.', details: error.message });
      }
    });

    // Add Transaction endpoint
    app.post('/submitTransaction', async (req, res) => {
        const { userId, account, type, amount, currency, notes, transactionDateTime, ...additionalFields } = req.body;
      
        try {
          // Check if the user with the specified userId exists
          const user = await usersCollection.findOne({ _id: ObjectId(userId) });
      
          if (!user) {
            // If the user does not exist, send an error response
            return res.status(400).json({ error: 'User not found.' });
          }
      
          // Create a new transaction object
          const newTransaction = {
            account,
            type,
            amount,
            currency,
            notes,
            transactionDateTime,
            ...additionalFields,
            timestamp: new Date(),
          };
          
          if (type === 'income') {

            // Add the amount from the specified account
            const updatedWalletItems = user.walletItems.map(walletItem => {
                if (walletItem.name === account) {
                  const updatedAmount = walletItem.amount + parseFloat(amount);
                  return { ...walletItem, amount: updatedAmount };
                }
                return walletItem;
              });
        
              // Update the user document with the updated wallet items and add the new income transaction
              await usersCollection.updateOne(
                { _id: ObjectId(userId) },
                {
                  $set: { walletItems: updatedWalletItems },
                  $push: { transactionHistory: newTransaction },
                }
              );

              return res.status(200).json({ success: 'Transaction added successfully.' });

          } else if (type === 'expenses') {
            // Deduct the amount from the specified account
            const updatedWalletItems = user.walletItems.map(walletItem => {
              if (walletItem.name === account) {
                const updatedAmount = walletItem.amount - amount;
                return { ...walletItem, amount: updatedAmount };
              }
              return walletItem;
            });
            
            // Update the user document with the updated wallet items and add the new expense transaction
            await usersCollection.updateOne(
              { _id: ObjectId(userId) },
              {
                $set: { walletItems: updatedWalletItems },
                $push: { transactionHistory: newTransaction },
              }
            );

            return res.status(200).json({ success: 'Transaction added successfully.' });

          } else if (type === 'transfer') {
            // Convert amount to a numeric type
            const numericAmount = parseFloat(amount);
        
            // Find the index of the payment account in walletItems
            const paymentAccountIndex = user.walletItems.findIndex(walletItem => walletItem.name === additionalFields.paymentAccount);
        
            // Find the index of the receive account in walletItems
            const receiveAccountIndex = user.walletItems.findIndex(walletItem => walletItem.name === additionalFields.receiveAccount);
        
            // Validate that the payment and receive accounts are different
            if (paymentAccountIndex === receiveAccountIndex) {
                return res.status(400).json({ error: 'Payment and receive accounts must be different.' });
            }
        
            // Deduct the amount from the payment account
            user.walletItems[paymentAccountIndex].amount -= numericAmount;
        
            // Add the amount to the receive account
            user.walletItems[receiveAccountIndex].amount += numericAmount;
        
            // Update the user document with the updated wallet items and add the new transfer transaction
            await usersCollection.updateOne(
                { _id: ObjectId(userId) },
                {
                    $set: { walletItems: user.walletItems },
                    $push: { transactionHistory: newTransaction },
                }
            );
        
            // Send a success response
            return res.status(200).json({ success: 'Transaction added successfully.' });
        }
        } catch (error) {
          // Send an error response with details
          res.status(500).json({ error: 'Internal server error.', details: error.message });
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


