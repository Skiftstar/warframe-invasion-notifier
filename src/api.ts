import axios, { AxiosError } from "axios";
const Warframe = require("warframe.js");

export type InvasionReward = {
  thumbnail: string;
  items: string[];
  credits: number;
  countedItems: {
    count: number;
    type: string;
    key: string;
  }[];
  itemString: string;
};

export type InvasionInfo = {
  id: string;
  node: string;
  completed: boolean;
  attacker: {
    faction: string;
    reward: InvasionReward;
  };
  defender: {
    faction: string;
    reward: InvasionReward;
  };
  completion: number;
};

const WF = new Warframe({ platform: "pc" });

export const getInvasionStatus: () => Promise<
  InvasionInfo[] | number
> = async () => {
  // artificial delay to give the sense of "loading"
  // complain at https://www.youtube.com/watch?v=XqhduyTnEM8 for giving me the idea
  const delay = new Promise((resolve) => setTimeout(resolve, 500));

  const [response] = await Promise.all([WF.invasions, delay]);

  if (response.error) {
    return response.code;
  }

  return response;
};
