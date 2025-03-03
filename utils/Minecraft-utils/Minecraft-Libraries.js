'use strict';
const os = require('os');
const fs = require('fs');
const AdmZip = require('adm-zip');

let MojangLib = { win32: "windows", darwin: "osx", linux: "linux" };
let Arch = { x32: "32", x64: "64", arm: "32", arm64: "64" };

class Libraries {
    constructor(version, config) {
        this.version = version.json;
        this.infoVersion = version.InfoVersion;
        this.config = config;
    }

    async Getlibraries() {
        let libraries = [];

        for (let lib of this.version.libraries) {
            let artifact;
            let type = "LIBRARY";

            if (lib.natives) {
                let classifiers = lib.downloads.classifiers;
                let native = lib.natives[MojangLib[process.platform]];
                if (!native) native = lib.natives[process.platform];
                type = "NATIVE";
                if (native) artifact = classifiers[native.replace("${arch}", Arch[os.arch()])];
                else continue;
            } else {
                if (lib.rules && lib.rules[0].os) {
                    if (lib.rules[0].os.name !== MojangLib[process.platform]) continue;
                }
                artifact = lib.downloads.artifact;
            }
            if (!artifact) continue;
            libraries.push({
                sha1: artifact.sha1,
                size: artifact.size,
                path: `libraries/${artifact.path}`,
                type: type,
                url: artifact.url
            });
        }

        let clientjar = this.version.downloads.client;
        libraries.push({
            sha1: clientjar.sha1,
            size: clientjar.size,
            path: `versions/${this.version.id}/${this.version.id}.jar`,
            type: "LIBRARY",
            url: clientjar.url
        });
        libraries.push({
            path: `versions/${this.version.id}/${this.version.id}.json`,
            type: "CFILE",
            content: JSON.stringify(this.version, null, 4)
        });
        return libraries;
    }

    async natives(bundle) {
        let natives = bundle.filter(mod => mod.type == "NATIVE").map(mod => `${mod.path}`);
        let nativeFolder = (`${this.config.path}/versions/${this.version.id}/natives`).replace(/\\/g, "/");
        if(!fs.existsSync(nativeFolder)) fs.mkdirSync(nativeFolder, { recursive: true, mode: 0o777 });
    
        for(let native of natives){
            let zip = new AdmZip(native);
            let entries = zip.getEntries();
            for(let entry of entries){
                if(entry.entryName.startsWith("META-INF")) continue;
                if(entry.isDirectory){
                    fs.mkdirSync(`${nativeFolder}/${entry.entryName}`, { recursive: true, mode: 0o777 });
                    continue
                }
                fs.writeFileSync(`${nativeFolder}/${entry.entryName}`, entry.getData(), { encoding: "utf8", mode: 0o777 });
            }
        }
        return natives;
    }
}

module.exports = Libraries;