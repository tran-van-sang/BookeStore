import createApiClient from "./api.service";
class OrderService {
    constructor(baseUrl = "https://bookstore-3c8x.onrender.com/api/order") {
        this.api = createApiClient(baseUrl);
    }
    async addOrder(data) {
        return (await this.api.post(`/`, data)).data;
    }
    async confirmOrder(id, data) {
        return (await this.api.put(`/confirmorder/${id}`, data)).data;
    }
}
export default new OrderService();