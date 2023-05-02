import createApiClient from "./api.service";
class AuthorService {
    constructor(baseUrl = "https://bookstore-3c8x.onrender.com/api/authors") {
        this.api = createApiClient(baseUrl);
    }
    async getAllAuthors() {
        return (await this.api.get(`/`)).data;
    }
    async getAnAuthor(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async addAnAuthor(data) {
        return (await this.api.post("/", data)).data;
    }
}
export default new AuthorService();