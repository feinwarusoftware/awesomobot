import { Client, /* Collection, Message */ } from "discord.js";
// import uuidv4 from "uuid/v4";

// TODO: Rewrite everything here lol

// temp
const kDiscordBotToken = process.env.DISCORD_BOT_TOKEN;

// temp
const stdCmp = (a: string | number | Date, b: string | number | Date) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

const discordClient = new Client({
  fetchAllMembers: true,
});

// return the client instance afterwards so all the other
// functions dont have to access the global variable
const clientPromise = discordClient
  .login(kDiscordBotToken)
  .then(() => discordClient);

const fetchUser = async (discordId: string, cache = true) => {
  const client = await clientPromise;

  const user = await client.fetchUser(discordId, cache);
  return user;
};

// TODO: make limit actually do something lmao, also add a sort order
const fetchMembers = async (guildId: string, query = "", limit = 0) => {
  const client = await clientPromise;

  const guild = await client.guilds.get(guildId)?.fetchMembers(query, limit);
  return guild?.members.filter(e => e.user.username.toLowerCase().includes(query.toLowerCase()) || (e.nickname == null ? false : e.nickname.toLowerCase().includes(query.toLowerCase()))).array() ?? [];
};

// TODO: make limit actually do something lmao, also add a sort order
const kTempGuildLimit = 20;
const fetchGuilds = async (query = "", /* sortField = "name", sortOrder: "ascending" | "descending" = "ascending", */ limit = kTempGuildLimit) => {
  const client = await clientPromise;

  const filteredGuilds = client.guilds.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => stdCmp(a.name, b.name)).array().slice(0, Math.min(limit, kTempGuildLimit));
  return filteredGuilds;
};

// // TODO: make limit actually do something lmao, also add a sort order
// const kTempMessageDefault = 200;
// const kTempMessageLimit = 5000;

// // { guildId, channelId, count, fetched, messages }
// let fetchedMessages = [];
// let currentlySearching = false;

// const fetchMessages = async (guildId: string, channelId: string, count = kTempMessageDefault) => {
//   const client = await clientPromise;

//   const guild = client.guilds.get(guildId);
//   const channel = guild.channels.get(channelId);

//   // TODO \
//   // TODO | // MAKE IT SO IF A REQUEST COMES IN THATS THE SAME AS AN ALREADY RUNNING ONE, DROP THE NEW ONE (instead of waiting like it currently does lel)
//   // TODO /

//   while (currentlySearching) {
//     await new Promise((resolve, reject) => {
//       setTimeout(resolve, 200);
//     });
//   }

//   currentlySearching = true;

//   // temp testing
//   // await new Promise((resolve, reject) => {
//   //   setTimeout(resolve, 2000);
//   // });

//   // console.log("hmmmm...");

//   console.log("*** req ***");

//   let previouslyFetchedIndex = fetchedMessages.findIndex(e => e.guildId === guildId && e.channelId === channelId)
//   if (previouslyFetchedIndex === -1) {
//     previouslyFetchedIndex = fetchedMessages.push({
//       guildId,
//       channelId,
//       count,
//       fetched: 0,
//       active: true,
//       messages: new Collection(),
//     }) - 1;
//   } else {
//     if (fetchedMessages[previouslyFetchedIndex].active) {
//       console.log("****************** ret2");
//       return;
//     }

//     fetchedMessages[previouslyFetchedIndex].active = true;
//   }

//   const previouslyFetched = fetchedMessages[previouslyFetchedIndex];

//   if (previouslyFetched.messages.size >= Math.min(kTempMessageLimit, count)) {
//     fetchedMessages[previouslyFetchedIndex].active = false;

//     currentlySearching = false;

//     console.log("****************** ret1");
//     return;
//   }

//   previouslyFetched.count = count;

//   while (previouslyFetched.messages.size < count) {
//     const currentMessages = await channel.fetchMessages({
//       limit: Math.min(kTempMessageLimit - previouslyFetched.messages.size, 50),
//       ...(previouslyFetched.messages.size === 0 ? {} : { before: previouslyFetched.messages.last().id }),
//     });

//     if (currentMessages.size === 0) {
//       break;
//     }

//     previouslyFetched.messages = previouslyFetched.messages.concat(currentMessages);
//     previouslyFetched.fetched += currentMessages.size;

//     fetchedMessages[previouslyFetchedIndex] = previouslyFetched;
//   }

//   fetchedMessages[previouslyFetchedIndex].active = false;

//   currentlySearching = false;

//   console.log("^^^^^^^^^^^^^^^ FINISHED ^^^^^^^^^^^^^^^^");
// };

// const retrieveMessages = async (guildId: string, channelId: string) => {
//   // console.log(fetchedMessages.find(e => e.guildId === guildId && e.channelId === channelId).messages.array().length);

//   return fetchedMessages.find(e => e.guildId === guildId && e.channelId === channelId).messages.array();
// };

// // temp

// // only one request will be handled at any given time
// // the queue is organised by dates
// // premium queue items will get taken care of first

// // functionality: view queue status, cancel queue request(s), modify queue request(s)
// // premium: queue fast-track, can queue multiple items, different request limits, different request types (no of messages vs date range, etc)

// // once an item is being processed, it can no longer be modified ???? add a thing so they can lel!!! no.

// interface IMessageFetchOptions {
//   count: number | null,
//   before: Date | null,
//   after: Date | null,
// }

// interface IMessageQueueItem {
//   guildId: string,
//   channelId: string,
//   options: IMessageFetchOptions,
//   premium: boolean,
//   requesterId: string,
//   requestedAt: Date,
//   uuid: string,
// }

// interface ICachedMessages {
//   guildId: string,
//   channelId: string,
//   options: IMessageFetchOptions,
//   messages: Collection<string, Message>,
// }

// const messageFetchQueue: IMessageQueueItem[] = [];
// let messageFetchCurrent: IMessageQueueItem | null = null;

// const messageCache: ICachedMessages[] = [];

// // max message fetch counts also apply to the total number of messages that can be cached
// const kDefaultMessageFetchCount = 200;
// const kMaxRegularMessageFetchCount = 2000;
// const kMaxPremiumMessageFetchCount = 5000;

// const kMaxRegularItemsInQueue = 1;
// const kMaxPremiumItemsInQueue = 5;

// enum QueueError {
//   MAX_ITEMS_EXCEEDED,
//   UNIMPLEMENTED,
// }

// const processQueueItem = async () => {
//   [messageFetchCurrent] = (messageFetchQueue.find(e => e.premium) == null ? messageFetchQueue.slice() : messageFetchQueue.filter(e => e.premium)).sort((a, b) => stdCmp(a.requestedAt, b.requestedAt));

//   // Check if there are already cached messages for this guild and channel,
//   // if it is, take that into consideration when calculating which messages to fetch
//   const messageCacheLimit = messageFetchCurrent.premium ? kMaxPremiumMessageFetchCount : kMaxRegularMessageFetchCount;

//   const fetchFragments: IMessageFetchOptions[] = [];

//   const cached = messageCache.find(e => e.guildId === messageFetchCurrent.guildId && e.channelId === messageFetchCurrent.channelId);

//   // if (cached != null) {

//   // }
// };

// // regular vs premium:
// // - 

// const processQueue = async () => {
//   do {
//     await processQueueItem(); // eslint-disable-line no-await-in-loop
//   } while (messageFetchCurrent != null);
// };

// // TODO: instead of having 'messageFetchCurrent' seperate, make it a reference to some object in the messageFetchQueue array instead,
// // this will prevent a lot of the gay shit that i have to do later on teehee...
// const queueMessageFetch = (guildId: string, channelId: string, requesterId: string, premium = false, count = kDefaultMessageFetchCount, before: Date | null = null, after: Date | null = null) => {
//   const maxItemsInQueue = premium ? kMaxPremiumItemsInQueue : kMaxRegularItemsInQueue;
//   const maxMessageFetchCount = premium ? kMaxPremiumMessageFetchCount : kMaxRegularMessageFetchCount;

//   // check if max queue item count would be exceeded
//   const currentItemsInQueue = messageFetchQueue.filter(e => e.requesterId === requesterId);

//   // the 'greater than' scenario shouldnt happen, but just making sure
//   if (currentItemsInQueue.length >= maxItemsInQueue) {
//     return {
//       success: false,
//       error: QueueError.MAX_ITEMS_EXCEEDED,
//       info: {
//         maxItemsInQueue,
//         currentItemsInQueue: currentItemsInQueue.length,
//         message: `You cannot have more than ${maxItemsInQueue} items queued at any one time.`,
//       },
//     };
//   }

//   const messageFetchCount = Math.min(count, maxMessageFetchCount);

//   const uuid = uuidv4();

//   const messageQueueItem: IMessageQueueItem = {
//     guildId,
//     channelId,
//     options: {
//       count: messageFetchCount,
//       before,
//       after,
//     },
//     premium,
//     requesterId,
//     requestedAt: new Date(),
//     uuid,
//   };

//   messageFetchQueue.push(messageQueueItem);

//   // in the unlikely case that 1. the queue array is out of order, and 2. some other premium request happened to be added asynchronously
//   // const currentPositionInQueue = (premium ? messageFetchQueue
//   //     .filter(e => e.premium)
//   //     .sort((a, b) => stdCmp(a.requestedAt, b.requestedAt))
//   //     .findIndex(e => e.uuid === uuid) : messageQueueItemIndex) + 1;

//   // if the currently processed item is not premium AND the current one is, add 1 (processed item (index 0) will be filtered out)
//   const currentPositionInQueue = (premium ? messageFetchQueue.filter(e => e.premium) : messageFetchQueue.slice())
//     .sort((a, b) => stdCmp(a.requestedAt, b.requestedAt))
//     .findIndex(e => e.uuid === uuid) + (!messageFetchCurrent?.premium && premium ? 1 : 0);

//   return {
//     success: true,
//     error: null,
//     info: {
//       maxItemsInQueue,
//       currentItemsInQueue: currentItemsInQueue.length,
//       currentPositionInQueue,
//       message: "Message successfully queued.",
//     },
//   };
// };

// const getMessageFetchQueueStatus = (requesterId: string) => {
//   const currentItemsInQueue = messageFetchQueue
//     .filter(e => e.requesterId === requesterId)
//     .map(e => ({
//       ...e,
//       // if the currently processed item is not premium AND the current one is, add 1 (processed item (index 0) will be filtered out)
//       currentPositionInQueue: (e.premium ? messageFetchQueue.filter(f => f.premium) : messageFetchQueue.slice())
//         .sort((a, b) => stdCmp(a.requestedAt, b.requestedAt))
//         .findIndex(f => f.uuid === e.uuid) + (!messageFetchCurrent?.premium && e.premium ? 1 : 0),
//     }));

//   return {
//     success: true,
//     error: null,
//     info: {
//       currentItemsInQueue,
//       message: "Successfully retrieved queued items.",
//     },
//   };
// };

// const editQueuedMessageFetch = () => {
//   return {
//     success: false,
//     error: QueueError.UNIMPLEMENTED,
//     info: {
//       message: "TODO: Implement this!",
//     },
//   };
// };

// const removeQueuedMessageFetch = () => {
//   return {
//     success: false,
//     error: QueueError.UNIMPLEMENTED,
//     info: {
//       message: "TODO: Implement this!",
//     },
//   };
// };

// const removeCachedFetchedMessages = () => {
//   return {
//     success: false,
//     error: QueueError.UNIMPLEMENTED,
//     info: {
//       message: "TODO: Implement this!",
//     },
//   };
// };

export {
  fetchUser,
  fetchMembers,
  fetchGuilds,
  // fetchMessages,
  // retrieveMessages,

  // queueMessageFetch,
  // getMessageFetchQueueStatus,
  // editQueuedMessageFetch,
  // removeQueuedMessageFetch,
  // removeCachedFetchedMessages,
};
