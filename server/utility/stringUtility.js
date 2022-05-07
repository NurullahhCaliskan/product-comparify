export function urlFormatter(value) {
    if (isBlankString(value)) {
        return value
    }

    let formattedValue = value.replace(/\s/g, '')

    formattedValue = formattedValue.replace(/([^:]\/)\/+/g, "$1");

    let lastLetter = formattedValue.charAt(formattedValue.length - 1)

    if (lastLetter === "/") {
        formattedValue = formattedValue.substring(0, formattedValue.length - 1);

    }

    return formattedValue;
}

export function isBlankString(value) {
    return (!value || value.length === 0)
}
