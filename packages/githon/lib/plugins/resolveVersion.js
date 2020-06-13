const npm = require("global-npm");
const semver = require("semver");
const Immutable = require("immutable");

const Promise = require("../utils/promise");
const Plugin = require("../models/plugin");
const githon = require("../githon");

/**
    Initialize and prepare NPM

    @return {Promise}
*/
function initNPM(options) {
    return Promise.nfcall(npm.load, {
        silent: true,
        loglevel: "silent",
        ...options,
    });
}

/**
    Resolve a plugin dependency to a version

    @param {PluginDependency} plugin
    @return {Promise<String>}
*/
function resolveVersion(plugin, options) {
    const npmId = Plugin.nameToNpmID(plugin.getName());
    const requiredVersion = plugin.getVersion();

    if (plugin.isGitDependency()) {
        return Promise.resolve(requiredVersion);
    }

    return initNPM(options)
        .then(() => {
            return Promise.nfcall(npm.commands.view, [`${npmId}@${requiredVersion}`, "engines"], true);
        })
        .then((versions) => {
            versions = Immutable.Map(versions).entrySeq();

            const result = versions
                .map((entry) => {
                    return {
                        version: entry[0],
                        gitbook: (entry[1].engines || {}).gitbook,
                    };
                })
                .filter((v) => {
                    return v.gitbook && githon.satisfies(v.gitbook);
                })
                .sort((v1, v2) => {
                    return semver.lt(v1.version, v2.version) ? 1 : -1;
                })
                .get(0);

            if (!result) {
                return undefined;
            } else {
                return result.version;
            }
        });
}

module.exports = resolveVersion;
