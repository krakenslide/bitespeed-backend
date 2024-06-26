import { Request, Response } from "express";
import { IdentifyService } from "../services/identify.service";

const unionFind = new IdentifyService();

export const identifyController = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res
      .status(400)
      .send({ error: "Either email or phoneNumber must be provided" });
  }
  try {
    const result = await unionFind.find(phoneNumber, email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in fetching contacts", error);
    res.status(500).send("Something went wrong");
  }
};
