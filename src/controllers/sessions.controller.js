import { sessionsService } from "../services/sessions.service.js";

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await sessionsService.getSessions();

    res.status(200).json({
      status: "success",
      payload: sessions
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await sessionsService.registerUser(req.body);

    res.status(201).json({
      status: "success",
      payload: user
    });
  } catch (error) {
    next(error);
  }
};
