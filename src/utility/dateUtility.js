export const humanReadableTime = (time) => {
    let date = new Date(time);

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
