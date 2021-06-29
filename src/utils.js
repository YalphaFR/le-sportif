const config = require("./config");
const moment = require("moment");

function getMainRole(member) {
    const roles = member.roles.map(id => member.guild.roles.get(id));
    roles.sort((a, b) => - b.position - a.position);
    return roles.find(r => r.hoist);
}

function isStaff(member) {
    if (!member) return false;

    if (member.guild.ownerID === member.id) return true;

    return config.serverPermissions.some(perm => {
        if (!isNaN(perm)) {
            return member.id === perm || member.roles.includes(perm);
        } else {
            return member.permission.has(perm);
        }
    });
}

function isBenevole(member) {
    if (!member) return false;
    return member.roles.includes(config.benevoleRoleID);
}

function date() {
    moment.locale("fr");
    return moment().format("LLLL");
}

module.exports = {
    getMainRole,
    isStaff,
    isBenevole,
    date,
};