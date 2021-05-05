"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoney = void 0;
var numeral = require("numeral");
var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
var moneyFormats = {
    amount: '$0,0.00',
    amount_no_decimals: '$0,0',
    amount_with_comma_separator: '$0,0.00',
    amount_no_decimals_with_comma_separator: '$0,0',
    amount_no_decimals_with_space_separator: '$0,0',
};
function parseFormat(format) {
    if (!format) {
        return moneyFormats.amount;
    }
    var parsed = format.match(placeholderRegex);
    if (!parsed[1]) {
        return moneyFormats.amount;
    }
    return moneyFormats[parsed[1] || 'amount'] || moneyFormats.amount;
}
function formatMoney(cents, format) {
    var numeralFormat = parseFormat(format);
    if (typeof cents === "string") {
        if (!/^[0-9\.,]$/g.test(cents)) {
            return cents;
        }
        cents = Number(cents.replace(/[,\.]/g, ''));
    }
    if (isNaN(cents)) {
        return '0';
    }
    return numeral(cents / 100).format(numeralFormat);
}
exports.formatMoney = formatMoney;
//# sourceMappingURL=chums-theme--currency.js.map