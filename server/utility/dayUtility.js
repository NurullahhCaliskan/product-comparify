export function getYesterdayMidnight() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);

    return date;
}

export function getTodayMidnight() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);

    return date;
}

export function get7dayMidnight() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 7);
    return date;
}

export function getTomorrowMidnight() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    return date;
}
