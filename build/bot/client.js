"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const v4_1 = __importDefault(require("uuid/v4"));
// temp
const kDiscordBotToken = process.env.DISCORD_BOT_TOKEN;
// temp
const stdCmp = (a, b) => {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};
const discordClient = new discord_js_1.Client({
    fetchAllMembers: true,
});
// return the client instance afterwards so all the other
// functions dont have to access the global variable
const clientPromise = discordClient
    .login(kDiscordBotToken)
    .then(() => discordClient);
const fetchUser = (discordId, cache = true) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clientPromise;
    const user = yield client.fetchUser(discordId, cache);
    return user;
});
exports.fetchUser = fetchUser;
// TODO: make limit actually do something lmao, also add a sort order
const fetchMembers = (guildId, query = "", limit = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clientPromise;
    const guild = yield client.guilds.get(guildId).fetchMembers(query, limit);
    return guild.members.filter(e => e.user.username.toLowerCase().includes(query.toLowerCase()) || (e.nickname == null ? false : e.nickname.toLowerCase().includes(query.toLowerCase()))).array();
});
exports.fetchMembers = fetchMembers;
// TODO: make limit actually do something lmao, also add a sort order
const kTempGuildLimit = 20;
const fetchGuilds = (query = "", /* sortField = "name", sortOrder: "ascending" | "descending" = "ascending", */ limit = kTempGuildLimit) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clientPromise;
    const filteredGuilds = client.guilds.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => stdCmp(a.name, b.name)).array().slice(0, Math.min(limit, kTempGuildLimit));
    return filteredGuilds;
});
exports.fetchGuilds = fetchGuilds;
// TODO: make limit actually do something lmao, also add a sort order
const kTempMessageDefault = 200;
const kTempMessageLimit = 5000;
// { guildId, channelId, count, fetched, messages }
let fetchedMessages = [];
let currentlySearching = false;
const fetchMessages = (guildId, channelId, count = kTempMessageDefault) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clientPromise;
    const guild = client.guilds.get(guildId);
    const channel = guild.channels.get(channelId);
    // TODO \
    // TODO | // MAKE IT SO IF A REQUEST COMES IN THATS THE SAME AS AN ALREADY RUNNING ONE, DROP THE NEW ONE (instead of waiting like it currently does lel)
    // TODO /
    while (currentlySearching) {
        yield new Promise((resolve, reject) => {
            setTimeout(resolve, 200);
        });
    }
    currentlySearching = true;
    // temp testing
    // await new Promise((resolve, reject) => {
    //   setTimeout(resolve, 2000);
    // });
    // console.log("hmmmm...");
    console.log("*** req ***");
    let previouslyFetchedIndex = fetchedMessages.findIndex(e => e.guildId === guildId && e.channelId === channelId);
    if (previouslyFetchedIndex === -1) {
        previouslyFetchedIndex = fetchedMessages.push({
            guildId,
            channelId,
            count,
            fetched: 0,
            active: true,
            messages: new discord_js_1.Collection(),
        }) - 1;
    }
    else {
        if (fetchedMessages[previouslyFetchedIndex].active) {
            console.log("****************** ret2");
            return;
        }
        fetchedMessages[previouslyFetchedIndex].active = true;
    }
    const previouslyFetched = fetchedMessages[previouslyFetchedIndex];
    if (previouslyFetched.messages.size >= Math.min(kTempMessageLimit, count)) {
        fetchedMessages[previouslyFetchedIndex].active = false;
        currentlySearching = false;
        console.log("****************** ret1");
        return;
    }
    previouslyFetched.count = count;
    while (previouslyFetched.messages.size < count) {
        const currentMessages = yield channel.fetchMessages(Object.assign({ limit: Math.min(kTempMessageLimit - previouslyFetched.messages.size, 50) }, (previouslyFetched.messages.size === 0 ? {} : { before: previouslyFetched.messages.last().id })));
        if (currentMessages.size === 0) {
            break;
        }
        previouslyFetched.messages = previouslyFetched.messages.concat(currentMessages);
        previouslyFetched.fetched += currentMessages.size;
        fetchedMessages[previouslyFetchedIndex] = previouslyFetched;
    }
    fetchedMessages[previouslyFetchedIndex].active = false;
    currentlySearching = false;
    console.log("^^^^^^^^^^^^^^^ FINISHED ^^^^^^^^^^^^^^^^");
});
exports.fetchMessages = fetchMessages;
const retrieveMessages = (guildId, channelId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(fetchedMessages.find(e => e.guildId === guildId && e.channelId === channelId).messages.array().length);
    return fetchedMessages.find(e => e.guildId === guildId && e.channelId === channelId).messages.array();
});
exports.retrieveMessages = retrieveMessages;
const messageFetchQueue = [];
let messageFetchCurrent = null;
const messageCache = [];
// max message fetch counts also apply to the total number of messages that can be cached
const kDefaultMessageFetchCount = 200;
const kMaxRegularMessageFetchCount = 2000;
const kMaxPremiumMessageFetchCount = 5000;
const kMaxRegularItemsInQueue = 1;
const kMaxPremiumItemsInQueue = 5;
var QueueError;
(function (QueueError) {
    QueueError[QueueError["MAX_ITEMS_EXCEEDED"] = 0] = "MAX_ITEMS_EXCEEDED";
    QueueError[QueueError["UNIMPLEMENTED"] = 1] = "UNIMPLEMENTED";
})(QueueError || (QueueError = {}));
const processQueueItem = () => __awaiter(void 0, void 0, void 0, function* () {
    [messageFetchCurrent] = (messageFetchQueue.find(e => e.premium) == null ? messageFetchQueue.slice() : messageFetchQueue.filter(e => e.premium)).sort((a, b) => stdCmp(a.requestedAt, b.requestedAt));
    // Check if there are already cached messages for this guild and channel,
    // if it is, take that into consideration when calculating which messages to fetch
    const messageCacheLimit = messageFetchCurrent.premium ? kMaxPremiumMessageFetchCount : kMaxRegularMessageFetchCount;
    const fetchFragments = [];
    const cached = messageCache.find(e => e.guildId === messageFetchCurrent.guildId && e.channelId === messageFetchCurrent.channelId);
    if (cached != null) {
    }
});
const processQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    do {
        yield processQueueItem(); // eslint-disable-line no-await-in-loop
    } while (messageFetchCurrent != null);
});
// TODO: instead of having 'messageFetchCurrent' seperate, make it a reference to some object in the messageFetchQueue array instead,
// this will prevent a lot of the gay shit that i have to do later on teehee...
const queueMessageFetch = (guildId, channelId, requesterId, premium = false, count = kDefaultMessageFetchCount, before = null, after = null) => {
    var _a;
    const maxItemsInQueue = premium ? kMaxPremiumItemsInQueue : kMaxRegularItemsInQueue;
    const maxMessageFetchCount = premium ? kMaxPremiumMessageFetchCount : kMaxRegularMessageFetchCount;
    // check if max queue item count would be exceeded
    const currentItemsInQueue = messageFetchQueue.filter(e => e.requesterId === requesterId);
    // the 'greater than' scenario shouldnt happen, but just making sure
    if (currentItemsInQueue.length >= maxItemsInQueue) {
        return {
            success: false,
            error: QueueError.MAX_ITEMS_EXCEEDED,
            info: {
                maxItemsInQueue,
                currentItemsInQueue: currentItemsInQueue.length,
                message: `You cannot have more than ${maxItemsInQueue} items queued at any one time.`,
            },
        };
    }
    const messageFetchCount = Math.min(count, maxMessageFetchCount);
    const uuid = v4_1.default();
    const messageQueueItem = {
        guildId,
        channelId,
        options: {
            count: messageFetchCount,
            before,
            after,
        },
        premium,
        requesterId,
        requestedAt: new Date(),
        uuid,
    };
    messageFetchQueue.push(messageQueueItem);
    // in the unlikely case that 1. the queue array is out of order, and 2. some other premium request happened to be added asynchronously
    // const currentPositionInQueue = (premium ? messageFetchQueue
    //     .filter(e => e.premium)
    //     .sort((a, b) => stdCmp(a.requestedAt, b.requestedAt))
    //     .findIndex(e => e.uuid === uuid) : messageQueueItemIndex) + 1;
    // if the currently processed item is not premium AND the current one is, add 1 (processed item (index 0) will be filtered out)
    const currentPositionInQueue = (premium ? messageFetchQueue.filter(e => e.premium) : messageFetchQueue.slice())
        .sort((a, b) => stdCmp(a.requestedAt, b.requestedAt))
        .findIndex(e => e.uuid === uuid) + (!((_a = messageFetchCurrent) === null || _a === void 0 ? void 0 : _a.premium) && premium ? 1 : 0);
    return {
        success: true,
        error: null,
        info: {
            maxItemsInQueue,
            currentItemsInQueue: currentItemsInQueue.length,
            currentPositionInQueue,
            message: "Message successfully queued.",
        },
    };
};
exports.queueMessageFetch = queueMessageFetch;
const getMessageFetchQueueStatus = (requesterId) => {
    const currentItemsInQueue = messageFetchQueue
        .filter(e => e.requesterId === requesterId)
        .map(e => {
        var _a;
        return (Object.assign(Object.assign({}, e), { 
            // if the currently processed item is not premium AND the current one is, add 1 (processed item (index 0) will be filtered out)
            currentPositionInQueue: (e.premium ? messageFetchQueue.filter(f => f.premium) : messageFetchQueue.slice())
                .sort((a, b) => stdCmp(a.requestedAt, b.requestedAt))
                .findIndex(f => f.uuid === e.uuid) + (!((_a = messageFetchCurrent) === null || _a === void 0 ? void 0 : _a.premium) && e.premium ? 1 : 0) }));
    });
    return {
        success: true,
        error: null,
        info: {
            currentItemsInQueue,
            message: "Successfully retrieved queued items.",
        },
    };
};
exports.getMessageFetchQueueStatus = getMessageFetchQueueStatus;
const editQueuedMessageFetch = () => {
    return {
        success: false,
        error: QueueError.UNIMPLEMENTED,
        info: {
            message: "TODO: Implement this!",
        },
    };
};
exports.editQueuedMessageFetch = editQueuedMessageFetch;
const removeQueuedMessageFetch = () => {
    return {
        success: false,
        error: QueueError.UNIMPLEMENTED,
        info: {
            message: "TODO: Implement this!",
        },
    };
};
exports.removeQueuedMessageFetch = removeQueuedMessageFetch;
const removeCachedFetchedMessages = () => {
    return {
        success: false,
        error: QueueError.UNIMPLEMENTED,
        info: {
            message: "TODO: Implement this!",
        },
    };
};
exports.removeCachedFetchedMessages = removeCachedFetchedMessages;
//# sourceMappingURL=client.js.map