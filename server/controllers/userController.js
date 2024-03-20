const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');


exports.logingoogle = async (req, res) => {
   
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        const token = generateToken(user);
        res.json({ success: true, message: "Google login successful", user, token });
    } else {
        res.status(401).json({ success: false, message: "Google user not found" });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
}
  };



// exports.login = async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       // Check if the request is for Google authentication
//       if (email && email.endsWith("@gmail.com") && password === "google-login-password") {
//         const user = await User.findOne({ email });
  
//         if (user) {
//           res.json({ success: true, message: "Login successful", user });
//         } else {
//           res.status(401).json({ success: false, message: "User not found" });
//         }
//       } else {
//         // For regular email/password login
//         const user = await User.findOne({ email });
  
//         if (user) {
//           // Check if the provided password matches the user's password
//           if (password === user.password) {
//             res.json({ success: true, message: "Login successful", user });
//           } else {
//             res.status(401).json({ success: false, message: "Incorrect password" });
//           }
//         } else {
//           res.status(401).json({ success: false, message: "User not found" });
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

exports.login = async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
      if (err || !user) {
          return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = generateToken(user);
      res.json({ success: true, message: "Login successful", user, token });
  })(req, res, next);
};

const generateToken = (user) => {
  const secretKey = '123abcdef'; // Replace with your actual secret key
  const payload = { id: user._id, email: user.email };
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  return token;
};


// exports.getUserDetails = async (req, res) => {
//   try {
//     const user = req.user; // Assuming that the authenticated user is attached to req object

//     if (user) {

//       console.log("User Role:", user.role);
//       res.json({ success: true, message: "User details fetched successfully", role: user.role });
//     } else {
//       res.status(401).json({ success: false, message: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

exports.getUserDetails = async (req, res) => {
  try {
    console.log('User details:', req.user); // Log the entire user details for debugging
    const { id, email, role } = req.user;
    console.log('User role:', role); // Log the user role for debugging
    res.json({ success: true, user: { id, email, role } });
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.getUserRole = async (req, res) => {
  try {
    const user = req.user; // Assuming that the authenticated user is attached to req object

    if (user) {
      console.log("User Role:", user.role);
      res.json({ success: true, message: "User role fetched successfully", role: user.role });
    } else {
      res.status(401).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
