import { Request, Response } from "express";
import { IdentifyService } from "../services/identify.service";

const unionFind = new IdentifyService();

export const identifyController = (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res
      .status(400)
      .send({ error: "Either email or phoneNumber must be provided" });
  }

  const result = unionFind.find(phoneNumber, email);
  res.status(200).json(result);
};
