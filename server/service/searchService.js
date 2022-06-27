import SearchRepository from '../repository/searchRepository.js';

export default class SearchService {
    /***
     *
     * @param searchModel {SearchModel}
     */
    async getSearch(searchModel) {
        let searchRepository = new SearchRepository();

        return await searchRepository.getSearch(searchModel);
    }
}
