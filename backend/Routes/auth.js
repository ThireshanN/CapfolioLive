import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


import { Router } from 'express';
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';


export let currentUserId = null;

async function sendEmail(firstname, email) {
  const code = Math.floor(Math.random() * 90000) + 10000;
  const sql = `UPDATE Users SET Verfified = ? WHERE Email = ?;`;
  await executeSQLstatement(sql, [code, email]);


  const html = `
        <h1> Welcome to Capfolio ${firstname} </h1>
        <p> Your verification code is: <h3> ${code} </h3> </p>
    `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreplycapfolio@gmail.com',
      pass: 'okuuldsavlqwnzdn'
    }
  });

  transporter
    .sendMail({
      from: 'noreplycapfolio@gmail.com',
      to: email,
      subject: 'Verify your Capfolio Account',
      html: html,
    })
    .then((info) => {
      console.log('Message Sent:' + info.message);
    })
    .catch((error) => {
      console.error('Failed to send email:', error);
    });
}




async function executeSQLstatement(sql, values) {
  const connection = await mysql.createConnection(config.db);
  const [rows, result] = await connection.execute(sql, values);
  await connection.end();
  return [rows, result];
}

async function emailExists(email) {
  const sql = `SELECT COUNT(*) as count FROM Users WHERE Email = ?;`;
  const [rows] = await executeSQLstatement(sql, [email]);
  return rows[0].count > 0;
}

async function codeExists(code) {
  const sql = `SELECT COUNT(*) as count FROM Users WHERE Verfified = ?;`;
  const [rows] = await executeSQLstatement(sql, [code]);
  return rows[0].count > 0;
}

async function next_id() {
  const sql = `SELECT UserID FROM Users ORDER BY UserID DESC LIMIT 1;`;
  const var1 = await executeSQLstatement(sql);
  //console.log(var1[0][0]);
  //console.log(var1[0][0].UserID);
  //console.log(Number(var1[0][0].UserID) + 1);
  return Number(var1[0][0].UserID) + 1;
}

async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function fetchUserData(email) {
  const sql = `
        SELECT Users.UserID, Users.FirstName, Users.LastName, Users.Email, Users.Password, Users.Verfified, Users.UserTypeID as Type
        FROM Users
        WHERE Users.Email = ?;
    `;
  const [rows] = await executeSQLstatement(sql, [email]);
  return rows[0];
}

async function fetchUserDataByCode(code) {
  const sql = `
        SELECT Users.UserID
        FROM Users
        WHERE Users.Verfified = ?;
    `;
  const [rows] = await executeSQLstatement(sql, [code]);
  return rows[0];
}

const router = Router();

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("logged in users only, besides Madavi");
};

export const requireAucklandEmail = (req, res, next) => {
  if (req.isAuthenticated()) {
    //console.log('req.user.email:', req.user.id);
    const userEmail = req.user.emails[0].value;
    //console.log('req.user.email:', userEmail.endsWith("@aucklanduni.ac.nz"));
    if (userEmail.endsWith("@aucklanduni.ac.nz")) {
      return next();
    } else {
      return res.status(403).send("Uni students only, besides madavi");
    }
  } else {
    return res.status(401).send("Uni students only, besides madavi");
  }
};

export const authRouter = router;

// Replace these with your own Google Client ID and Secret

const GOOGLE_CLIENT_ID =
  "659834162586-hq30vt8gf1vu39pr2u4055t8djk0394d.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      //const sql = `Insert into Visitors(UserID, UserTypeID, FirstName, lastName) values (40, 4, "Paul", "Pogba")`;

      const emailToCheck = profile.emails[0].value;
      const name = profile.displayName;
      const sep_name = name.split(" ");
      const first_name = sep_name[0];
      const last_name = sep_name[1];
      let type;
      let sql;
      let sql1;
      let sql2;
      let var1;
      let var2;
      let pic_logo = profile._json.picture;

      const exists = await emailExists(emailToCheck);
      const studentUpi = emailToCheck.slice(0, emailToCheck.indexOf("@"));
      //console.log("Email exists:", exists);
      console.log(pic_logo);
      if (!exists) {
        const id = await next_id();
        console.log(emailToCheck);
        if (emailToCheck === "tnai955@aucklanduni.ac.nz") {
          console.log("T1");
          type = 3;
          console.log("T2");
          sql = `Insert into Users(UserID, UserTypeID, FirstName, lastName, Email, Picture) values (${id}, ${type}, "${first_name}", "${last_name}", "${emailToCheck}", "${pic_logo}");`;
          console.log("T3");
          sql2 = `Insert into Admins(UserID, UserTypeID) values (${id}, 3);`;
          console.log("T4");
          const var1 = await executeSQLstatement(sql);
          console.log("T5");
          const var2 = await executeSQLstatement(sql2);
          console.log("T6");
        } else if (emailToCheck.endsWith("@aucklanduni.ac.nz")) {
          console.log("T7");
          type = 1;
          console.log("T8");
          sql = `Insert into Users(UserID, UserTypeID, FirstName, lastName, Email, Picture) values (${id}, ${type}, "${first_name}", "${last_name}", "${emailToCheck}", "${pic_logo}");`;
          console.log("T9");
          sql2 = `Insert into Student(UserID, UserTypeID,  StudentUPI) values (${id}, 1, "${emailToCheck.substring(0, 7)}");`;
          console.log("T10");
          const var1 = (await executeSQLstatement(sql));
          console.log("T11");
          const var2 = (await executeSQLstatement(sql2));
          console.log("T12");
        } else {
          console.log("T13");
          type = 4;
          console.log("T14");
          sql = `Insert into Users(UserID, UserTypeID, FirstName, lastName, Email, Picture) values (${id}, ${type}, "${first_name}", "${last_name}", "${emailToCheck}", "${pic_logo}");`;
          console.log("T15");
          sql2 = `Insert into Visitor(UserID, UserTypeID) values (${id}, 4);`;
          console.log("T16");
          const var1 = (await executeSQLstatement(sql));
          console.log("T17");
          const var2 = (await executeSQLstatement(sql2));
          console.log("T18");
        }
      } else {
        //unregistered student
        //they have a user and student record, but the field 'isRegistered' in Student table is SET to 0
        //the above occurs from ./FormAddProject Route
        //SO NOW SET 'isRegistered' to 1 (student table), and also set firstname and lastname (users table)
        console.log("T18");
        if (emailToCheck.endsWith("@aucklanduni.ac.nz")) {
          const isRegistered = (
            await executeSQLstatement(
              `SELECT isRegistered FROM Capfolio.Student WHERE StudentUPI = '${studentUpi}'`
            )
          )[0][0].isRegistered;
          if (isRegistered === 0) {
            type = 1;
            sql = `SELECT UserID FROM Users WHERE Email = '${emailToCheck}'`;
            const aUserId = (await executeSQLstatement(sql))[0][0].UserID;
            sql1 = `UPDATE Capfolio.Users SET FirstName = "${first_name}", lastName = "${last_name}" WHERE Capfolio.Users.UserID = ${aUserId}`;
            const sql2 = `UPDATE Capfolio.Student SET isRegistered = 1 WHERE Capfolio.Student.StudentUPI = '${studentUpi}'`;
            await executeSQLstatement(sql1);
            await executeSQLstatement(sql2);
            //console.log('unregistered student has logged in through google!')
          }
        }
        const sql2 = `UPDATE Users SET Picture = ? WHERE Email = ?;`;
        await executeSQLstatement(sql2, [pic_logo, emailToCheck]);
      }
      console.log("T19");
      profile.photo = profile._json.picture;
      console.log("T20");
      //Insert into Admins(UserID) values (40);
      console.log("T21");
      return cb(null, profile);
      console.log("T22");

    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

authRouter.use(passport.initialize());
authRouter.use(passport.session());



authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get("/user", async (req, res) => {
  try {
    if (!req.user && !req.session.user) {
      return res.status(401).send({ error: "User not authenticated" });
    }

    let user;
    let email;
    let isGoogleOAuth;
    let photo;
    //console.log("T1")
    if (req.session.user) {
      user = req.session.user;
      //console.log("user:", user)
      email = user.email;
      //console.log("T2")
      if (user.isFormLogin) {
        isGoogleOAuth = false;
        //console.log("T3a")
        photo = "/images/icon.png";
        //console.log("T4a")
      } else {
        isGoogleOAuth = true;
        //console.log("T3b")
        photo = user.photo; // Store photo in session during Google OAuth login
        //console.log("T4b")
      }
    } else {
      user = req.user;
      //console.log("T2b")
      email = user.emails[0].value;
      //console.log("T2b1")
      isGoogleOAuth = true;
      //console.log("T2b2")
      photo = user.photo;
      //console.log("T2b3")
    }
    //console.log("T5")

    //const sql = `SELECT u.FirstName, u.LastName, u.UserTypeID FROM Users u WHERE u.Email = ?;`;
    const sql = `
        SELECT Users.UserID, Users.FirstName, Users.LastName, Users.Email, Users.Password, Users.UserTypeID, Users.linkedin, Users.githubLink, Users.userDescription, Users.profession as Type
        FROM Users
        WHERE Users.Email = ?;
    `;
    const [rows] = await executeSQLstatement(sql, [email]);
    const userData = rows[0];
    //console.log("Picture URL:", photo);
    //console.log("T6")
    currentUserId = userData.UserID;

    res.send({
      UserID: userData.UserID,
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      Email: email,
      UserType: userData.UserTypeID,
      Photo: photo,
      OAuth: isGoogleOAuth,
      githubLink: userData.githubLink,
      linkedin: userData.linkedin,
      userDescription: userData.userDescription,
      Type: userData.Type,
    });
    //console.log("T7")
  } catch (error) {
    //console.log("T8")
    res.status(400).send({ error: "Failed to fetch user data" });
  }
});

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Store user data in the session
    req.session.user = {
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.emails[0].value,
      photo: req.user.photo,
    };

    // Successful authentication, redirect to the desired page.
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      currentUserId = null;
      res.json({ message: "Logged out successfully" });
    });
  });
});



router.post('/signup', async (req, res) => {
  console.log("A1")
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const exists = await emailExists(email);

  if (exists) {
    return res.status(400).send({ error: 'Email already exists' });
  }

  const passwordHash = await generatePasswordHash(password);
  const userTypeID = 4;
  const userID = await next_id();
  const verified = 0;
  const pic = 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg';
  //const pic = '/images/icon.png';

  const sql = `INSERT INTO Users (UserID, UserTypeID, FirstName, lastName, Email, password, Verfified, Picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  const sql2 = `Insert into Visitor(UserID, UserTypeID) values (${userID}, ${userTypeID});`;
  await executeSQLstatement(sql, [userID, userTypeID, firstName, lastName, email, passwordHash, verified, pic]);
  await executeSQLstatement(sql2);
  console.log("A2")
  try {
    sendEmail(firstName, email);
    res.status(200).send({ message: 'User successfully registered' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).send({ error: 'Failed to send verification email' });
  }
  console.log("A3")
  //res.status(200).send({ message: 'User successfully registered' });
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }

  const userData = await fetchUserData(email);

  if (!userData) {
    return res.status(400).send({ error: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, userData.Password);

  if (!isPasswordValid) {
    return res.status(400).send({ error: "Invalid email or password" });
  }


  console.log(userData.Verfified);

  if (userData.Verfified != 1) {
    const sql1 = `DELETE FROM Visitor WHERE UserID = ?;`;
    const sql2 = `DELETE FROM Users WHERE UserID = ?;`;
    await executeSQLstatement(sql1, [userData.UserID]);
    await executeSQLstatement(sql2, [userData.UserID]);
    return res.status(400).send({ error: 'Account not verified. Pls Sign up again and a new verification link will be sent' });
  }

  // Create a session and redirect the user to the home page with a different navbar
  req.session.user = {
    id: userData.UserID,
    firstName: userData.FirstName,
    lastName: userData.LastName,
    email: userData.Email,
    userType: userData.Type,
    isFormLogin: true,
  };


  res.status(200).send({ message: "Logged in successfully" });
  console.log("Logged in successfully");
});




router.post('/emailVerify', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).send({ error: 'No code entered' });
  }

  const exists = await codeExists(code)
  console.log("exists: ", exists);
  if (exists) {
    const userData = await fetchUserDataByCode(code);
    console.log("userdata: ", userData);
    const id = userData.UserID;
    const value = 1
    const sql2 = `UPDATE Users SET Verfified = ? WHERE UserID = ?;`;
    await executeSQLstatement(sql2, [value, id]);
    console.log('YesSir');
    return res.status(200).send({ message: 'Verified' });
  } else {
    return res.status(400).send({ error: 'Invalid Verification code' });
  }

  return res.status(400).send({ error: 'Invalid Verification code' });

});

async function sendPasswordResetEmail(email) {
  //console.log("Sub1");

  const code = Math.floor(Math.random() * 90000) + 10000;
  //console.log("Sub2");
  const unique_string = email + code;
  //console.log("Sub3");
  const hash = await generatePasswordHash(unique_string);
  //console.log("Sub4");

  const sql = `UPDATE Users SET PassReset = ? WHERE Email = ?;`;
  //console.log("Sub5");
  await executeSQLstatement(sql, [hash, email]);
  //console.log("Sub6");


  const html = `
        <h1> This email was sent because you forgot your password. </h1>
        <p> Your passowrd reset code is: <h3> ${hash} </h3> </p>
    `;
  //console.log("Sub7");
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreplycapfolio@gmail.com',
      pass: 'okuuldsavlqwnzdn'
    }
  });
  //console.log("Sub8");

  transporter
    .sendMail({
      from: 'noreplycapfolio@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      html: html,
    })
    .then((info) => {
      //console.log('Message Sent:' + info.message);
    })
    .catch((error) => {
      //console.error('Failed to send email:', error);
    });
}


router.post('/resetPasswordEmail', async (req, res) => {
  const { email } = req.body;
  //console.log("RPE1");
  //console.log(email);
  if (!email) {
    return res.status(400).send({ error: 'No code entered' });
  }
  //console.log("RPE2");
  const exists = await emailExists(email)
  if (exists) {
    try {
      //console.log("RPE3");
      sendPasswordResetEmail(email);
      //console.log("RPE4");
      res.status(200).send({ message: 'Email Sent' });
      //console.log("RPE5");
    } catch (error) {
      //console.error('Error sending email:', error);
      //console.log("RPE6");
      res.status(500).send({ error: 'Failed to send verification email' });
      //console.log("RPE7");
    }
    //console.log("RPE8");
    //return res.status(200).send({ message: 'Password reset code sent to your email' });
  } else {
    //console.log("RPE9");
    return res.status(400).send({ error: 'Email dont exist bruhhhh' });
  }

  //console.log("RPE10");
  //return res.status(400).send({ error: 'Invalid Verification code' });

});



async function pcodeExists(code) {
  const sql = `SELECT COUNT(*) as count FROM Users WHERE PassReset = ?;`;
  const [rows] = await executeSQLstatement(sql, [code]);
  return rows[0].count > 0;
}

async function fetchUserDataBypCode(code) {
  const sql = `
        SELECT Users.UserID
        FROM Users
        WHERE Users.PassReset = ?;
    `;
  const [rows] = await executeSQLstatement(sql, [code]);
  return rows[0];
}

router.post('/reset-password', async (req, res) => {
  const { code, password } = req.body;
  console.log("RPE1");
  console.log(code);
  console.log(password);
  if (!code) {
    return res.status(400).send({ error: 'No code entered' });
  }

  if (!password) {
    return res.status(400).send({ error: 'No Password entered' });
  }

  const exists = await pcodeExists(code);
  if (exists) {
    const userData = await fetchUserDataBypCode(code);
    console.log("userdata: ", userData);
    const id = userData.UserID;
    const value = 0
    const new_password = await generatePasswordHash(password);
    const sql2 = `UPDATE Users SET PassReset = ? WHERE UserID = ?;`;
    await executeSQLstatement(sql2, [value, id]);
    const sql3 = `UPDATE Users SET password = ? WHERE UserID = ?;`;
    await executeSQLstatement(sql3, [new_password, id]);
    console.log('YesSir');
    return res.status(200).send({ message: 'Password Updated' });
  } else {
    return res.status(400).send({ error: 'Invalid code' });
  }
  //return res.status(400).send({ error: 'Invalid Verification code' });

});