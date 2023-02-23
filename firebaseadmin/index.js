const admin = require('firebase-admin');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const dotenv = require('dotenv');

dotenv.config();

// import firebase-admin package

const firebasesdk = process.env.FIREBASE_SDK;

// import service account file (helps to know the firebase project details)
const serviceAccount = require(firebasesdk);

// Intialize the firebase-admin project/account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(bodyParser.json());

var jsonParser = bodyParser.json()

app.get("/status", (req, res) => {
    res.send("ckeck Status");
});

// Custom Verification Link
app.post('/VerificationLink', jsonParser, async (req, res) => {
  const userData = req.body;
  console.log(userData);
  const actionCodeSettings = {
    url: `<hosted_firebase_url_link>`,
    handleCodeInApp: true,
    android: {
      packageName: '<project_id>'
    }
  };
  admin
  .auth()
  .generateSignInWithEmailLink(userData.email, actionCodeSettings)
  .then(async (link) => {
      // We got the Embedded Link (Now we can use this link and send the mail to the user
      // for verifing the Email/account). To send custom mail you can use nodemailer or mail gun.
  })
  .catch((error) => {
    res.json({
      error: false,
      message: error
  })
 });
})

//nfcLogin

app.post('/customToken', (req, res) => {
    const uid = req.body.uid;
    if(uid != undefined){
        
        admin.auth().createCustomToken(uid)
        .then((customToken) => {
        console.log('Custom token created:', customToken)
        res.status(200).send(customToken);
        })
        .catch((error) => {
        console.error('Error creating custom token:', error);
        res.status(500).send('Error creating custom token');
        });
    }
  });

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})