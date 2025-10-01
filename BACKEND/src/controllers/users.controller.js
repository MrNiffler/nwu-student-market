export const getProfile = (req, res) => {
    res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
  };