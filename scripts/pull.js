"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs_1 = require("fs");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var timestamp = new Date();
var storePath = (0, path_1.join)(__dirname, "../stats/" + timestamp.getFullYear() + timestamp
    .getMonth()
    .toString()
    .padStart(2, '0') + timestamp.getDate());
if (!(0, fs_1.existsSync)(storePath)) {
    (0, fs_1.mkdirSync)(storePath);
}
var apis = [
    '/account/bank',
    '/account/inventory',
    '/account/materials',
    '/account/wallet',
    '/commerce/delivery',
    '/commerce/listings',
];
var args = process.argv.slice(2);
var request = axios_1.default.create({
    baseURL: 'https://api.guildwars2.com/v2',
    headers: { Authorization: "Bearer " + args[0] },
});
Promise.all(apis.map(function (api) {
    return request
        .get(api)
        .then(function (res) {
        var splitted = api.split('/');
        (0, promises_1.writeFile)((0, path_1.join)(storePath, splitted[splitted.length - 1] + ".json"), JSON.stringify(res.data));
    })
        .catch(console.log);
}));
