import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { Router } from "express";
import mysql from "mysql2/promise";
import { config } from "../sqlconfig.js";
import bcrypt from "bcrypt";

export let currentUserId = null;

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
        SELECT Users.UserID, Users.FirstName, Users.LastName, Users.Email, Users.Password, Users.UserTypeID as Type
        FROM Users
        WHERE Users.Email = ?;
    `;
  const [rows] = await executeSQLstatement(sql, [email]);
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

      const exists = await emailExists(emailToCheck);
      const studentUpi = emailToCheck.slice(0, emailToCheck.indexOf("@"));
      //console.log("Email exists:", exists);
      if (!exists) {
        const id = await next_id();
        if (emailToCheck === "admin@aucklanduni.ac.nz") {
          type = 3;
        } else if (emailToCheck.endsWith("@aucklanduni.ac.nz")) {
          type = 1;
          sql1 = `Insert into Users(UserID, UserTypeID, FirstName, lastName, Email) values (${id}, ${type}, "${first_name}", "${last_name}", "${emailToCheck}");`;
          sql2 = `Insert into Student(UserID, UserTypeID,  StudentUPI) values (${id}, 1, "${emailToCheck.substring(
            0,
            7
          )}");`;
          const var1 = await executeSQLstatement(sql1);
          const var2 = await executeSQLstatement(sql2);
        } else {
          type = 4;
          sql = `Insert into Users(UserID, UserTypeID, FirstName, lastName, Email) values (${id}, ${type}, "${first_name}", "${last_name}", "${emailToCheck}");`;
          sql2 = `Insert into Visitor(UserID, UserTypeID) values (${id}, 4);`;
          const var1 = await executeSQLstatement(sql);
          const var2 = await executeSQLstatement(sql2);
        }
      } else {
        //unregistered student
        //they have a user and student record, but the field 'isRegistered' in Student table is SET to 0
        //the above occurs from ./FormAddProject Route
        //SO NOW SET 'isRegistered' to 1 (student table), and also set firstname and lastname (users table)
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
            sql2 = `UPDATE Capfolio.Student SET isRegistered = 1 WHERE Capfolio.Student.StudentUPI = '${studentUpi}'`;
            await executeSQLstatement(sql1);
            await executeSQLstatement(sql2);
            //console.log('unregistered student has logged in through google!')
          }
        }
      }

      profile.photo = profile._json.picture;
      //Insert into Admins(UserID) values (40);

      return cb(null, profile);
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

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const exists = await emailExists(email);
  if (exists) {
    return res.status(400).send({ error: "Email already exists" });
  }

  const passwordHash = await generatePasswordHash(password);
  const userTypeID = 4;
  const userID = await next_id();

  const sql = `INSERT INTO Users (UserID, UserTypeID, FirstName, lastName, Email, password) VALUES (?, ?, ?, ?, ?, ?);`;
  const sql2 = `Insert into Visitor(UserID, UserTypeID) values (userID, userTypeID);`;
  //await executeSQLstatement(sql2);
  await executeSQLstatement(sql, [
    userID,
    userTypeID,
    firstName,
    lastName,
    email,
    passwordHash,
  ]);

  res.status(200).send({ message: "User successfully registered" });
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
