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

export let items: any[] = [];

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

// export const getInvasionItemsFromSearchQuery = async (
//   query: string,
// ): Promise<string[]> => {
//   query = query.toLowerCase();

//   if (items.length === 0) await fetchItems();

//   const validItems: string[] = [];

//   items
//     .filter((item: any) => item.tags && item.tags.includes("Invasion Reward"))
//     .forEach((item: any) => {
//       if (!item.components || item.components.length === 0) {
//         if (item.name.toLowerCase().startsWith(query))
//           validItems.push(item.name);
//       } else {
//         item.components.forEach((comp: any) => {
//           if (`${item.name} ${comp.name}`.toLowerCase().startsWith(query))
//             validItems.push(`${item.name} ${comp.name}`);
//         });
//       }
//     });

//   return validItems;
// };

export const fetchItems = async () => {
  const res = await fetch("https://api.warframestat.us/items");

  if (!res.ok) {
    const json = await res.json();
    throw new ApiError("Failed fetch", json, res.status);
  }

  const data = await res.json();
  items = data;
};

export const getInvasionItemDrops = () => {
  const drops: string[] = items
    .filter((item: any) => item.tags && item.tags.includes("Invasion Reward"))
    .filter((item) => item.components && item.components.length > 0)
    .flatMap((item) => {
      return item.components.map((comp: any) => `${item.name} ${comp.name}`);
    });
  return drops;
};

class ApiError extends Error {
  data: any;
  status: number;

  constructor(message: string, data: any, status: number) {
    super(message);
    this.name = "ApiError";
    this.data = data;
    this.status = status;

    // This is required in some environments to fix the prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
