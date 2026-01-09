const User = require("../models/User");

/* ================= UPDATE USER ================= */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "Nothing to update" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email already in use" });
    }

    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= TOGGLE ACTIVE ================= */
exports.toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (req.user.id === id) {
      return res
        .status(400)
        .json({ message: "Cannot deactivate yourself" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.active = !user.active;
    await user.save();

    res.json({ message: "User status updated" });
  } catch {
    res.status(500).json({ message: "Status update failed" });
  }
};
