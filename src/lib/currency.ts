import type { Currency } from "@/types/currency";

export const DEFAULT_CURRENCY_CODE = 'USD';

export const getCurrencyMinorUnit = (currency?: Currency | null) => {
    return currency?.minorUnit ?? 2;
}

export const formatMoney = (
    amount: number,
    options?: {
        currency?: Currency | null;
        currencyCode?: string | null;
        locale?: string;
    }
) => {
    const locale = options?.locale ?? 'es-CO';
    const currency = options?.currency;
    const currencyCode = options?.currencyCode ?? currency?.code ?? DEFAULT_CURRENCY_CODE;
    const fractionDigits = getCurrencyMinorUnit(currency);

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(amount);
    } catch {
        const formattedAmount = new Intl.NumberFormat(locale, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(amount);

        return currency?.symbol
            ? `${currency.symbol}${formattedAmount}`
            : `${currencyCode} ${formattedAmount}`;
    }
}

export const formatDecimalAmount = (
    amount: number,
    options?: {
        currency?: Currency | null;
        locale?: string;
    }
) => {
    const locale = options?.locale ?? 'es-CO';
    const fractionDigits = getCurrencyMinorUnit(options?.currency);

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(amount);
}

export const mapCurrenciesToSelectOptions = (currencies: Currency[]) => {
    return currencies.map((currency) => ({
        value: currency.code,
        label: `${currency.code} - ${currency.label}`,
    }));
}

export const findCurrencyByCode = (currencies: Currency[], code?: string | null) => {
    if (!code) return undefined;
    return currencies.find((currency) => currency.code === code);
}
