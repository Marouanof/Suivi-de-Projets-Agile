const db = require("../config/database");
const bcrypt = require("bcrypt");

exports.findByEmail = (email) => {
    return db.query("SELECT * FROM users WHERE email = ?", [email]);
};

exports.create = async (user) => {
    const { id, email, password, first_name, last_name, role } = user;
    if (!email || !password) {
        return Promise.reject(new Error("Email and password are required"));
    }

    const normalizedRole = role || "USER";
    const hashedPassword = password.startsWith("$2")
        ? password
        : await bcrypt.hash(password, 10);

    return db.query(
        "INSERT INTO users (id, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)",
        [id, email, hashedPassword, first_name, last_name, normalizedRole]
    );
};
