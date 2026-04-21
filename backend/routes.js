const express = require("express");
const router = express.Router();
const db = require("./db");

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, password],
    (err) => {
      if (err) return res.send("User exists");
      res.send("Registered");
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (result.length === 0) return res.send("Invalid credentials");
      res.send(result[0]);
    }
  );
});

// GET DOCTORS
router.get("/doctors", (req, res) => {
  db.query("SELECT * FROM doctors", (err, result) => {
    res.send(result);
  });
});

// GET BOOKED SLOTS
router.get("/appointments", (req, res) => {
  const { doctor_id, date } = req.query;

  db.query(
    "SELECT time FROM appointments WHERE doctor_id=? AND date=?",
    [doctor_id, date],
    (err, result) => {
      res.send(result);
    }
  );
});

// BOOK APPOINTMENT
router.post("/book", (req, res) => {
  const { user_id, doctor_id, date, time } = req.body;

  const today = new Date();
  const bookingDate = new Date(date);

  if (bookingDate < new Date(today.toDateString())) {
    return res.send("Cannot book past dates");
  }

  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 20);

  if (bookingDate > maxDate) {
    return res.send("Booking allowed only for next 20 days");
  }

  db.query("SELECT * FROM holidays WHERE date=?", [date], (err, holiday) => {
    if (holiday.length > 0) return res.send("Holiday");

    db.query("SELECT * FROM doctors WHERE id=?", [doctor_id], (err, doc) => {
      const d = doc[0];

      if (time < d.start_time || time > d.end_time)
        return res.send("Outside working hours");

      if (time >= d.break_start && time <= d.break_end)
        return res.send("Break time");

      db.query(
        "SELECT * FROM appointments WHERE doctor_id=? AND date=? AND time=?",
        [doctor_id, date, time],
        (err, existing) => {
          if (existing.length > 0)
            return res.send("Slot already booked");

          db.query(
  "INSERT INTO appointments (user_id,doctor_id,date,time) VALUES (?,?,?,?)",
  [user_id, doctor_id, date, time],
  (err) => {
    if (err) {
      console.log("DB ERROR:", err);   // 👈 IMPORTANT
      return res.send("Database error");
    }

    console.log("INSERT SUCCESS");     // 👈 DEBUG
    res.send("Booked successfully");
  }
);
        }
      );
    });
  });
});

module.exports = router;