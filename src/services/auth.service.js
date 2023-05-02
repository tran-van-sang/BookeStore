import createApiClient from "./api.service";
class AuthService {
    constructor(baseUrl = "https://bookstore-3c8x.onrender.com/api/auth") {
        this.api = createApiClient(baseUrl);
    }
    async signIn(data) {
        return (await this.api.post("/signin", data));
    }
    async signUp(data) {
        return (await this.api.post("/signup", data)).data;
    }
    async signOut(){
        return (await this.api.get("/signout")).data;
    }
    async verifyToken(token){
        return (await this.api.get("/getinfo",{headers: { 'auth-token': token }})).data;
    }
    async updateInfoUser(id,data) {
        return (await this.api.put(`/updateinfouser/${id}`, data)).data;
    }
    async changePassword(id,data) {
        return (await this.api.put(`/changepassword/${id}`, data)).data;
    }
}
export default new AuthService();