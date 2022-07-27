export const getAfterLastCharacter = (data, char) => {
    try {
        return data.substring(data.lastIndexOf(char) + 1);
    } catch (e) {
        return data;
    }
};
