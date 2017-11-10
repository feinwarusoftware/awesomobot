const rquest = require("./rquest");
const utils = require("./utils");

const host = "southpark.wikia.com";
const api = "/api/v1"

// Activity.
module.exports = {

    /**
     * Get information about the latest user activity on the current wiki.
     * @param options 
     * Options:     
     * - limit [type = int, default = 1]: Limit the number of results.
     * - namespaces [type = string, default = "0"]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     * - allowDuplicates [type = bool, default = true]: Set if duplicate values of an article's revisions made by the same user are not allowed.
     */
    latestActivity: function(options, callback) {
        var limit = utils.opt(options, "limit", 10);
        var namespaces = utils.opt(options, "namespaces", "0");
        var allowDuplicates = utils.opt(options, "allowDuplicates", true);

        // /Activity/LatestActivity
        rquest.performRequest(host, api + "/Activity/LatestActivity", "GET", {
            limit: limit,
            namespaces: namespaces,
            allowDuplicates: allowDuplicates,

        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get information about the latest user activity on the current wiki.
     * @param options 
     * Options:     
     * - limit [type = int, default = 1]: Limit the number of results.
     * - namespaces [type = string, default = "0"]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     * - allowDuplicates [type = bool, default = true]: Set if duplicate values of an article's revisions made by the same user are not allowed.
     */
    recentlyChangedArticles: function(options, callback) {
        var limit = utils.opt(options, "limit", 10);
        var namespaces = utils.opt(options, "namespaces", "0");
        var allowDuplicates = utils.opt(options, "allowDuplicates", true);

        // /Activity/RecentlyChangedArticles
        rquest.performRequest(host, api + "/Activity/RecentlyChangedArticles", "GET", {
            limit: limit,
            namespaces: namespaces,
            allowDuplicates: allowDuplicates,

        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get simplified article contents.
     * @param options 
     * Options:
     * - id [type = int, default = 50]: A single article ID.
     */
    articleAsSimpleJson: function(options, callback) {
        var id = utils.opt(options, "id", 50);

        // /Articles/AsSimpleJson
        rquest.performRequest(host, api + "/Articles/AsSimpleJson", "GET", {
            id: id,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get details about one or more articles.
     * @param options 
     * Options:
     * - ids [type = string, default = "50"]: Comma-separated list of article ids.
     * - titles [type = string, default = ""]: Titles with underscores instead of spaces, comma-separated.
     * - abstract [type = int, default = 100]: The desired length for the article's abstract.
     * - width [type = int, default = 200]: The desired width for the thumbnail.
     * - height [type = int, default = 200]: The desired height for the thumbnail.
     */
    articleDetails: function(options, callback) {
        var ids = utils.opt(options, "ids", "50");
        var titles = utils.opt(options, "titles", "");
        var abstract = utils.opt(options, "abstract", 100);
        var width = utils.opt(options, "width", 200);
        var height = utils.opt(options, "height", 200);

        // /Articles/Details
        rquest.performRequest(host, api + "/Articles/Details", "GET", {
            ids: ids,
            titles: titles,
            abstract: abstract,
            width: width,
            height: height,
            
        }, function(data) {

            callback(data);
        });
    },

     /**
     * Get articles list in alphabetical order.
     * @param options 
     * Options:
     * - category [type = string, default = ""]: Return only articles belonging to the provided valid category title.
     * - namespaces [type = string, default = ""]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     * - limit [type = int, default = 25]: Limit the number of results.
     * - offset [type = string, default = ""]: 	Lexicographically minimal article title.
     */
    articleList: function(options, callback) {
        var category = utils.opt(options, "category", "");
        var namespaces = utils.opt(options, "namespaces", "");
        var limit = utils.opt(options, "limit", 25);
        var offset = utils.opt(options, "offset", "");

        // /Articles/List
        rquest.performRequest(host, api + "/Articles/List", "GET", {
            category: category,
            namespaces: namespaces,
            limit: limit,
            offset: offset,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get a list of pages on the current wiki.
     * @param options 
     * Options:
     * - category [type = string, default = ""]: Return only articles belonging to the provided valid category title.
     * - namespaces [type = string, default = ""]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     * - limit [type = int, default = 25]: Limit the number of results.
     * - offset [type = string, default = ""]: 	Lexicographically minimal article title.
     */
    articleListExpand: function(options, callback) {
        var expand = 1;
        var category = utils.opt(options, "category", "");
        var namespaces = utils.opt(options, "namespaces", "");
        var limit = utils.opt(options, "limit", 25);
        var offset = utils.opt(options, "offset", "");

        // /Articles/List
        rquest.performRequest(host, api + "/Articles/List", "GET", {
            expand: expand,
            category: category,
            namespaces: namespaces,
            limit: limit,
            offset: offset,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get the most linked articles on this wiki.
     */
    mostLinkedArticles: function(callback) {
        

        // /Articles/MostLinked
        rquest.performRequest(host, api + "/Articles/MostLinked", "GET", {

            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get the most linked articles on this wiki (extended results).
     */
    mostLinkedArticlesExpand: function(callback) {
        var expand = 1;

        // /Articles/MostLinked
        rquest.performRequest(host, api + "/Articles/MostLinked", "GET", {
            expand: expand,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get a list of new articles on this wiki.
     * @param options 
     * Options:
     * - namespaces [type = string, default = ""]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     * - limit [type = int, default = 20]: Limit the number of result - maximum limit is 100.
     * - minArticleQuality [type = int, default = 10]: Minimal value of article quality. Ranges from 0 to 99.
     */
    newArticles: function(options, callback) {
        var namespaces = utils.opt(options, "namespaces", "");
        var limit = utils.opt(options, "limit", 20);
        var minArticleQuality = utils.opt(options, "minArticleQuality", 10);

        // /Articles/New
        rquest.performRequest(host, api + "/Articles/New", "GET", {
            namespaces: namespaces,
            limit: limit,
            minArticleQuality: minArticleQuality,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get popular articles for the current wiki (from the beginning of time).
     * @param options
     * Options: 
     * - limit [type = int, default = 10]: Limit the number of result - maximum limit is 10.
     * - baseAtricleId [type = int, default = null]: Trending and popular related to article with given id.
     */
    popularArticles: function(options, callback) {
        var limit = utils.opt(options, "limit", 10);
        var baseArticleId = utils.opt(options, "baseArticleId", null);

        // /Articles/Popular
        rquest.performRequest(host, api + "/Articles/Popular", "GET", {
            limit: limit,
            baseArticleId: baseArticleId,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * get popular articles for the current wiki (from the beginning of time).
     * @param options
     * Options: 
     * - limit [type = int, default = 10]: Limit the number of result - maximum limit is 10.
     * - baseAtricleId [type = int, default = null]: Trending and popular related to article with given id.
     */
    popularArticlesExpand: function(options, callback) {
        var expand = 1;
        var limit = utils.opt(options, "limit", 10);
        var baseArticleId = utils.opt(options, "baseArticleId", null);

        // /Articles/Popular
        rquest.performRequest(host, api + "/Articles/Popular", "GET", {
            expand: expand,
            limit: limit,
            baseArticleId: baseArticleId,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get the most viewed articles on this wiki.
     * @param options 
     * Options:
     * - namespaces [type = string, default = ""]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     * - category [type = string, default = ""]: Return only articles belonging to the provided valid category title.
     * - limit [type = int, default = 10]: Limit the number of result - maximum limit is 250.
     * - baseArticleId [type = int, default = null]: Trending and popular related to article with given id.
     */
    topArticles: function(options, callback) {
        var namespaces = utils.opt(options, "namespaces", "");
        var category = utils.opt(options, "category", "");
        var limit = utils.opt(options, "limit", 10);
        var baseArticleId = utils.opt(options, "baseArticleId", null);

        // /Articles/Top
        rquest.performRequest(host, api + "/Articles/Top", "GET", {
            namespaces: namespaces,
            category: category,
            limit: limit,
            baseArticleId: baseArticleId,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get the most viewed articles on this wiki (expanded results).
     * @param options 
     * Options:
     * - namespaces [type = string, default = ""]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     * - category [type = string, default = ""]: Return only articles belonging to the provided valid category title.
     * - limit [type = int, default = 10]: Limit the number of result - maximum limit is 250.
     * - baseArticleId [type = int, default = null]: Trending and popular related to article with given id.
     */
    topArticlesExpand: function(options, callback) {
        var expand = 1;
        var namespaces = utils.opt(options, "namespaces", "");
        var category = utils.opt(options, "category", "");
        var limit = utils.opt(options, "limit", 10);
        var baseArticleId = utils.opt(options, "baseArticleId", null);

        // /Articles/Top
        rquest.performRequest(host, api + "/Articles/Top", "GET", {
            expand: expand,
            namespaces: namespaces,
            category: category,
            limit: limit,
            baseArticleId: baseArticleId,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get the top articles by pageviews for a hub.
     * @param options 
     * Options:
     * - hub [type = string, default = "gaming"]: The name of the vertical (e.g. Gaming).
     * - lang [type = string, default = ""]: Comma separated language codes (e.g. en,de,fr).
     * - namespaces [type = string, default = ""]: 	Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
     */
    topArticlesByHub: function(options, callback) {
        var hub = utils.opt(options, "hub", "gaming");
        var lang = utils.opt(options, "lang", "");
        var namespaces = utils.opt(options, "namespaces", "");

        // /Articles/TopByHub
        rquest.performRequest(host, api + "/Articles/TopByHub", "GET", {
            hub: hub,
            lang: lang,
            namespaces: namespaces,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get wiki data, including key values, navigation data, and more.
     */
    wikiVariables: function(callback) {


        // /Mercury/WikiVariables
        rquest.performRequest(host, api + "/Mercury/WikiVariables", "GET", {

            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get wiki navigation links (the main menu og given links).
     */
    navigationData: function(callback) {


        // /NavigationData
        rquest.performRequest(host, api + "/NavigationData", "GET", {

            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get pages related to a given article ID.
     * @param options 
     * Options:
     * - ids [type = string, default = "50"]: Comma-separated list of article ids.
     * - limit [type = int, default = 3]: Limit the number of results.
     */
    relatedPages: function(options, callback) {
        var ids = utils.opt(options, "ids", 50);
        var limit = utils.opt(options, "limit", 3);

        // /RelatedPages/List
        rquest.performRequest(host, api + "/RelatedPages/List", "GET", {
            ids: ids,
            limit: limit,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get results for cross-wiki search (extended response).
     * @param options 
     * Options:
     * - query (required) [type = string, default = ""]: Search query.
     * - hub [type = string, default = ""]: Comma-separated list of verticals (e.g. Gaming, Entertainment, Lifestyle).
     * - lang [type = string, default = "en"]: Comma separated language codes (e.g. en,de,fr).
     * - rank [type = string, default = ""]: The ranking to use in fetching the list of results, one of default, newest, oldest, recently-modified, stable, most-viewed, freshest, stalest.
     * - limit [type = int, default = 25]: Limit the number of results.
     * - batch [type = int, default = 1]: The batch (page) of results to fetch.
     * - height [type = int, default = null]: The desired height for the thumbnail.
     * - width [type = int, default = null]: The desired width for the thumbnail.
     * - snippet [type = int, default = null]: Maximum number of words returned in description.
     */
    crossWikiSearchExpand: function(options, callback) {
        var expand = 1;
        var query = utils.opt(options, "query", "");
        var hub = utils.opt(options, "hub", "");
        var lang = utils.opt(options, "lang", "en");
        var rank = utils.opt(options, "rank", "");
        var limit = utils.opt(options, "limit", 25);
        var batch = utils.opt(options, "batch", 1);
        var height = utils.opt(options, "height", null);
        var width = utils.opt(options, "width", null);
        var snippet = utils.opt(options, "snippet", null);

        if (query == "") {
            return;
        }

        // /Search/CrossWiki
        rquest.performRequest(host, api + "/Search/CrossWiki", "GET", {
            expand: expand,
            query: query,
            hub: hub,
            lang: lang,
            rank: rank,
            limit: limit,
            batch: batch,
            height: height,
            width: width,
            snippet: snippet,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Do search for given phrase.
     * @param options 
     * Options:
     * - query (required) [type = string, default = ""]: Search query.
     * - type [type = string, default = ""]: The search type, either articles (default) or videos. For 'videos' value, this parameter should be used with namespaces parameter (namespaces needs to be set to 6)
     * - rank [type = string, default = ""]: The ranking to use in fetching the list of results, one of default, newest, oldest, recently-modified, stable, most-viewed, freshest, stalest.
     * - limit [type = int, default = 25]: Limit the number of results.
     * - minArticleQuality [type = int, default = 10]: Minimal value of article quality. Ranges from 0 to 99.
     * - batch [type = int, default = 1]: The batch (page) of results to fetch.
     * - namespaces [type = string, default = "0,14"]: Page namespace number, see more: http://community.wikia.com/wiki/Help:Namespaces.
     */
    search: function(options, callback) {
        var query = utils.opt(options, "query", "");
        var type = utils.opt(options, "type", "");
        var rank = utils.opt(options, "rank", "");
        var limit = utils.opt(options, "limit", 25);
        var minArticleQuality = utils.opt(options, "minArticleQuality", 10);
        var batch = utils.opt(options, "batch", 1);
        var namespaces = utils.opt(options, "namespaces", "0,14");

        if (query == "") {
            return;
        }

        // /Search/List
        rquest.performRequest(host, api + "/Search/List", "GET", {
            query: query,
            type: type,
            rank: rank,
            limit: limit,
            minArticleQuality: minArticleQuality,
            batch: batch,
            namespaces: namespaces,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Find suggested phrases for chosen query.
     * @param options 
     * Options:
     * - query (required) [type = string, default = ""]: Search query.
     */
    searchSuggestions: function(options, callback) {
        var query = utils.opt(options, "query", "");

        if (query == "") {
            return;
        }

        // /SearchSuggestions/List
        rquest.performRequest(host, api + "/SearchSuggestions/List", "GET", {
            query: query,
            
        }, function(data) {

            callback(data);
        });
    },

    /**
     * Get details about selected users.
     * @param options 
     * Options:
     * - ids (required) [type = string, default = ""]: Comma-separated list of user ids. Maximum size of id list is 100.
     * - size [type = int, default = null]: The desired width (and height, because it is a square) for the thumbnail, defaults to 100, 0 for no thumbnail.
     */
    userDetails: function(options, callback) {
        var ids = utils.opt(options, "ids", "");
        var size = utils.opt(options, "size", null);

        if (ids == "") {
            return;
        }

        // /User/Details
        rquest.performRequest(host, api + "/User/Details", "GET", {
            ids: ids,
            size: size,
            
        }, function(data) {

            callback(data);
        });
    }
}