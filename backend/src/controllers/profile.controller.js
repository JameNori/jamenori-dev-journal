import { getProfile } from "../services/profile.service.js";

export const handleGetProfile = (req, res) => {
  try {
    const data = getProfile();

    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
