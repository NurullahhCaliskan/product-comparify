export function queryBuilder(body) {
    let query = '';

    if (!body.search) {
        return null;
    }

    query = 'query:"title:*' + body.search + '*"';

    return query;
}
