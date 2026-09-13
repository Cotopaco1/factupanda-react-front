const KEEP_ONLY_NUMERIC = /[^\d.,]/g

/**
 * Los usuarios escriben importes como los escribe su país: "1.500,00" en Chile,
 * "1,500.50" en México, "1500,50" en España. Un `Number()` directo devuelve NaN
 * en los tres casos, así que hay que decidir cuál separador es el decimal.
 *
 * Devuelve el importe en formato canónico ("1500.5"), o "" si no hay nada
 * aprovechable en la entrada.
 */
export const normalizeAmountInput = (raw: string): string => {
    const cleaned = raw.replace(KEEP_ONLY_NUMERIC, '')

    if (cleaned === '') return ''

    const lastDot = cleaned.lastIndexOf('.')
    const lastComma = cleaned.lastIndexOf(',')

    // Con ambos separadores presentes, el último es siempre el decimal.
    if (lastDot !== -1 && lastComma !== -1) {
        const decimalSeparator = lastDot > lastComma ? '.' : ','
        return toCanonical(cleaned, decimalSeparator)
    }

    const separator = lastDot !== -1 ? '.' : lastComma !== -1 ? ',' : null

    if (separator === null) return cleaned

    const occurrences = cleaned.split(separator).length - 1

    // "1.234.567" solo puede ser separador de miles.
    if (occurrences > 1) return cleaned.replaceAll(separator, '')

    const [whole, fraction] = cleaned.split(separator)

    // "1.500" son mil quinientos; "10.50" son diez con cincuenta.
    if (fraction.length === 3 && whole.length > 0) return whole + fraction

    return toCanonical(cleaned, separator)
}

/**
 * Deja un único separador decimal (el último) y descarta el resto.
 */
const toCanonical = (cleaned: string, decimalSeparator: string): string => {
    const groupSeparator = decimalSeparator === '.' ? ',' : '.'
    const withoutGroups = cleaned.replaceAll(groupSeparator, '')

    const splitAt = withoutGroups.lastIndexOf(decimalSeparator)

    if (splitAt === -1) return withoutGroups

    const whole = withoutGroups.slice(0, splitAt).replaceAll(decimalSeparator, '')
    const fraction = withoutGroups.slice(splitAt + 1)

    return fraction === '' ? whole : `${whole}.${fraction}`
}

/**
 * Normaliza cualquier entrada del formulario a un número utilizable por Zod.
 */
export const parseAmountInput = (value: unknown): unknown => {
    if (typeof value !== 'string') return value

    const normalized = normalizeAmountInput(value)

    return normalized === '' ? value : Number(normalized)
}
