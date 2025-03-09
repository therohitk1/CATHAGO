import { asyncHandler } from "../utils/AsyncHandler.js";
import { createUser, findUser, generateAccessAndRefreshToken } from "../services/user.service.js";

const renderRegister = (req, res) => {
  res.render("auth/register.ejs", {
    title: "Register | DocScan",
    messages: req.flash(),
    url: req.originalUrl,
  });
};

const renderLogin = (req, res) => {
  res.render("auth/login.ejs", { 
    title: "Login | DocScan", 
    messages: req.flash(),
    url: req.originalUrl
  });
};

const register = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    req.flash("error", "All fields are required");
    return res.redirect("/auth/register");
  }

  const existingUser = await findUser(email);
  if (existingUser) {
    req.flash("error", `User with ${email} already registered`);
    return res.redirect("/auth/register");
  }

  try {
    await createUser({ email, username, password });
    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Registration failed");
    res.redirect("/auth/register");
  }
});

const login = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    req.flash("error", "User ID and password are required");
    return res.redirect("/auth/login");
  }

  const user = await findUser(userId);

  if (!user) {
    req.flash("error", `User with ${userId} does not exist`);
    return res.redirect("/auth/login");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    req.flash("error", "Invalid user credentials");
    return res.redirect("/auth/login");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);

  // Set cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  // Set session
  req.session.user = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    credits: user.availableCredits,
  };

  req.flash("success", "Logged in successfully");
  res.redirect("/dashboard");
  //res.redirect("/home");
});

const logout = asyncHandler(async (req, res) => {
  // Clear cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/auth/login");
  });
});

export { renderRegister, register, renderLogin, login, logout };