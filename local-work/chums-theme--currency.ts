import * as numeral from 'numeral';
import {Numeral} from "numeral";

const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
const moneyFormats = {
    amount: '$0,0.00',
    amount_no_decimals: '$0,0',
    amount_with_comma_separator: '$0,0.00',
    amount_no_decimals_with_comma_separator: '$0,0',
    amount_no_decimals_with_space_separator: '$0,0',
}

function parseFormat(format?:string) {
    if (!format) {
        return moneyFormats.amount;
    }
    const parsed = format.match(placeholderRegex);
    if (!parsed[1]) {
        return moneyFormats.amount;
    }
    return moneyFormats[parsed[1] || 'amount'] || moneyFormats.amount;
}


export function formatMoney(cents: number|string, format?:string):string {

    const numeralFormat = parseFormat(format);
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
