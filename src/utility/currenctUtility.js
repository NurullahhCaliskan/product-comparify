export default function priceWithCurrency(price, currency) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency }).format(Number(price));
}
