const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

let users = [];
try {
  users = JSON.parse(fs.readFileSync("users.json", "utf8"));
} catch (error) {
  console.error("Error reading users database:", error.message);
  process.exit(1);
}

app.get("/", (req, res) => {
  return res.status(200).json({ status: "success", msg: "API WOrking weLL!!" });
});

app.get("/api/users", (req, res) => {
  let { page = 1, limit = 50, search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  search = search.toLowerCase();

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return res.status(400).json({
      error: "Invalid page or limit",
      message: "Invalid page or limit",
    });
  }

  let filteredUsers = users;

  if (search) {
    filteredUsers = users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
      );
    });
  }

  const total = filteredUsers.length;
  const maxPage = Math.ceil(total / limit);

  if (page > maxPage && maxPage !== 0) {
    return res.status(400).json({
      error: "Page limit exceeded",
      message: `Requested page ${page} exceeds maximum page ${maxPage}`,
      maxPage,
      total,
    });
  }

  const startIndex = (page - 1) * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

  res.json({
    data: paginatedUsers,
    total,
    page,
    limit,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
