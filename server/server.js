const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
const Booking = require("../server/models/BookingModel");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const session = require("express-session");
const User = require("../server/models/User");
const LocalStrategy = require("passport-local").Strategy;

// // Configure Passport to use JWT
// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: "123abcde456", // Replace with your actual secret key
//     },
//     (payload, done) => {
//       // Payload contains the decoded JWT token
//       // You can perform a database query to find the user by ID or username
//       // For simplicity, we'll assume the payload contains a user ID
//       const user = { id: payload.sub, username: payload.email };
//       return done(null, user);
//     }
//   )
// );

// // Middleware to authenticate requests using Passport
// const authenticateJwt = passport.authenticate("jwt", { session: false });

// // Middleware to check if the user is authenticated
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(401).json({ message: "Unauthorized" });
// };

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "123abcdef", // Replace with your actual secret key
};

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        if (password !== user.password) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.use(
  session({
    secret: "123abcdef", // Replace with a strong and secure secret key
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

// Middleware to authenticate requests using Passport
const authenticateJwt = passport.authenticate("jwt", { session: false });

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const dbUrl =
  "mongodb+srv://tawoplays11:1109200213G@clusterpos.hftfpg5.mongodb.net/BukSU_MoniTour";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(dbUrl, connectionParams)
  .then(() => {
    console.info("Connected to the DB");
  })
  .catch((e) => {
    console.log("Error;", e);
  });

// // Connect to MongoDB using Mongoose
// mongoose.connect("mongodb://localhost:27017/BSU", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// // Event listener for successful MongoDB connection
// db.on("connected", () => {
//   console.log("Connected to MongoDB");
// });

// // Event listener for MongoDB connection error
// db.on("error", (err) => {
//   console.error("MongoDB connection error:", err);
// });

//BookingRoutes
app.use("/", require("./routes/bookingRoutes"));

//UserRoutes
app.use("/", require("./routes/userRoutes"));

//VehicleRoutes
app.use("/", require("./routes/vehicleRoutes"));

app.use("/", require("./routes/dataRoutes"));

app.use("/", require("./routes/driverRoutes"));

app.use("/", require("./routes/completedBookingRoutes"));

const path = require("path");

app.use(
  "/imagesforupload",
  express.static(path.join(__dirname, "imagesforupload"))
);

app.get("/logout", authenticateJwt, (req, res) => {
  // Additional logic for JWT logout if needed
  res.status(200).json({ success: true, message: "Logout successful" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
