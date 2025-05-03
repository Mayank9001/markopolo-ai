const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Read users from JSON file once at startup
let users = [];
try {
  users = JSON.parse(fs.readFileSync("users.json", "utf8"));
} catch (error) {
  console.error("Error reading users database:", error.message);
  process.exit(1);
}
const TOTAL_USERS = users.length;

app.get("/", (req, res) => {
  return res.status(200).json({ status: "success", msg: "API WOrking weLL!!" });
});
// API endpoint with pagination
app.get("/api/users", (req, res) => {
  let { page = 1, limit = 50, search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  search = search.toLowerCase();

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return res.status(400).json({ error: "Invalid page or limit" });
  }

  let filteredUsers = users;

  // 🔍 Filter based on search value (name or email)
  if (search) {
    filteredUsers = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    });
  }

  const startIndex = (page - 1) * limit;
  const paginatedUsers = filteredUsers
    .slice(startIndex, startIndex + limit);

  res.json({
    data: paginatedUsers,
    total: filteredUsers.length,
    page,
    limit,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
