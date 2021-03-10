function formatRollResult(rollResult) {
    return rollResult.replace(/((\_|\*|\~|\`|\|){2})/g, '\\$1');
}
function isNumeric(str) {
    return /^\d+$/.test(str);  //match a number with optional '-' and decimal.
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    formatRollResult: formatRollResult,
    isNumeric: isNumeric,
    capitalize: capitalize
}