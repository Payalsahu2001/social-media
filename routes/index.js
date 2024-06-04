var express = require('express');
var router = express.Router();

// const User = require("../models/userSchema");

const upload = require("../utils/multer").single("profilepic");
const fs = require("fs");
const path = require("path");

const sendmail = require("../utils/mail");

const user = require("../models/userSchema");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(user.authenticate()));




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { user: req.user });
});
router.get('/login', function (req, res, next) {
  res.render("login", { user: req.user });
});
+

  router.post(
    "/login-user",
    passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/login",
    }),
    function (req, res, next) { }
  );

router.get("/delete-user/:id", isLoggedIn, async function (req, res, next) {
  try {
    const deleteuser = await user.findByIdAndDelete(req.params.id);
    if (deleteuser.profilepic !== "default.png") {
      fs.unlinkSync(
        path.join(
          __dirname,
          "..",
          "public",
          "images",
          deleteuser.profilepic
        )
      );
    }
  } catch (error) {
    res.send(error)
  }
});


router.get("/logout-user/:id", function (req, res, next) {
  req.logout(() => {
    res.redirect("/login");
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/forget-email", function (req, res, next) {
  res.render("userforgetemail", { user: req.user });
});

router.post("/forget-email", async function (req, res, next) {

  try {

    const User = await user.findOne({ email: req.body.email });
    console.log("forget-email-get kr liya");
    // res.redirect(`/forget-password/${user._id}`);
    if (User) {
      const url = `${req.protocol}://${req.get("host")}/forget-password/${User._id}`;
      console.log(url);
      console.log("ye nhi ho rha h");
      sendmail(res, users, url);

      // res.redirect(`/forget-password/${user._id}`);
    } else {
      console.log("ye problem h");
      res.redirect("/forget-email");

    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }

});

router.get("/forget-password/:id", function (req, res, next) {

  res.render("userforgetpassword", { user: req.user, id: req.params.id });
});

router.post("/forget-password/:id", async function (req, res, next) {

  try {
    const User = await user.findById(req.params.id);

    if (User.resetPasswordToken === 1) {
      await User.setPassword(req.body.newpassword);
      User.resetPasswordToken = 0;
      await User.save();
      console.log("yaha nhi aaya forget-pass-post");
      res.redirect("/login");
    } else {
      res.send("Link Expired Try Again!");
    }
  } catch (error) {
    console.log("yaha bhi dikkat h");
    console.log(error);
    res.send(error);
  }

});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}
router.get('/about', function (req, res, next) {
  res.render("about", { user: req.user });
});




router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render("profile", { user: req.user });
});

router.get("/update-user/:id", isLoggedIn, function (req, res, next) {
  res.render("updateuser", { user: req.user });
});

router.get('/reset-password/:_id', isLoggedIn, function (req, res, next) {
  res.render("passwordupdate", { user: req.user });
});

router.post('/reset-password/:_id', isLoggedIn, async function (req, res, next) {
  try {
    await req.user.changePassword(
      req.body.oldpassword,
      req.body.newpassword
    );
    req.user.save();
    res.redirect(`/login/${req.user._id}`);
  } catch (error) {
    res.send(error)

  }
});


router.get('/register', function (req, res, next) {
  res.render("register", { user: req.user });
});
router.post('/register-user', async function (req, res, next) {
  try {
    const { username, Email, password } = req.body;
    await user.register({ username, Email }, password);
    res.redirect("/login");
  } catch (error) {
    res.send(error)

  }
});

router.post("/image/:id", isLoggedIn, upload, async function (req, res, next) {
  try {
    if (req.user.profilepic !== "default.png") {
      fs.unlinkSync(
        path.join(
          __dirname,
          "..",
          "public",
          "images",
          req.user.profilepic
        )
      );
    }
    req.user.profilepic = req.file.filename;
    await req.user.save();
    res.redirect(`/update-user/${req.params.id}`);
  } catch (error) {
    res.send(error);
  }
});







module.exports = router;
