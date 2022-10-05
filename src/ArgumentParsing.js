function populate(defaultMap) {
    const args = process.argv.splice(2);
    for (let i = 0; i < args.length; i++) {
        let arg = args[i].substr(2);
        if (defaultMap.has(arg)) defaultMap.set(arg, args[i + 1])
    }

}

function requirementsFulfilled(defaultMap) {
    for (let value of defaultMap.values()) if (value == null) return false;
    return true;
}

function parse(defaultMap) {
    populate(defaultMap);
    return requirementsFulfilled(defaultMap);
}

module.exports = parse;