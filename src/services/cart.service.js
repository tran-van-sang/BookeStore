import createApiClient from "./api.service";
class CartService {
    constructor(baseUrl = "https://bookstore-3c8x.onrender.com/api/cart") {
        this.api = createApiClient(baseUrl);
    }
    async updateCart(id, data) {
        return (await this.api.post(`/${id}`, data)).data;
    }
}
export default new CartService();