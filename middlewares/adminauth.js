const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.adminisAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { admintoken } = req.cookies;

    if (!admintoken) {
        return next(
            res.redirect("/admin/login")
        );
    }
    try {
        const { id } = jwt.verify(admintoken, process.env.JWT_SECRET);
        req.id = id;
        next();
    } catch (error) {
        return res.redirect("/admin/login");
    }
});
