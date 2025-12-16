
const DONATION_BANNER_PREFIX = "donation-domain";
const ALERT_BANNER_PREFIX = "ab";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export const useBannerAlertService = () => {

    const getQuoteCount = () => {
        return Number(localStorage.getItem(`${ALERT_BANNER_PREFIX}.quote_count`));
    }

    const incrementQuoteCount = () => {
        const newCount = getQuoteCount() + 1;
        localStorage.setItem(`${ALERT_BANNER_PREFIX}.quote_count`, String(newCount));
        return newCount;
    }

    const shouldShowDonationBanner = () => {
        const count = getQuoteCount();
        if(count < 2) return false;
        let raw = localStorage.getItem(`${DONATION_BANNER_PREFIX}.show_at`);
        if(!raw) return true;

        const showAtMs = Number(raw)
        if (!Number.isFinite(showAtMs)) return true // storage corrupto o formato viejo
        return Date.now() - showAtMs >= SEVEN_DAYS_MS;
    }

    const DonationBannerShowedNow = () => {
        localStorage.setItem(`${DONATION_BANNER_PREFIX}.show_at`, String(Date.now()))
    }

    return {
        incrementQuoteCount,
        shouldShowDonationBanner,
        DonationBannerShowedNow
    }
}