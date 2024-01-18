exports.AdminSendToken = (admin, statusCode, res) => {
  const admintoken = admin.getjwttoken();

  const options = {
      exipres: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      // secure: true,
  };
  
  res.status(statusCode)
  .cookie("admintoken", admintoken, options)
  res.redirect("/admin/dashboard");
};
