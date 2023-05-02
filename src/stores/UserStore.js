import { defineStore } from "pinia";
import CartService from "../services/cart.service";
import AuthService from "../services/auth.service";

export const useUserStore = defineStore("UserStore", {
    state: () => {
        return {
            user: null,
            cart: {
                products: [],
                totalPrice: 0
            },
            order: {
                products: [],
                totalPrice: 0
            },
        }
    },
    getters: {
        totalPriceComputer() {
            let total = 0;
            this.cart.products.forEach(p => {
                total += p.quantity * p.price;
            })
            this.cart.totalPrice = total;
            const b = this.watchCart;
            if (total) {
                window.localStorage.setItem('cart-info', JSON.stringify(this.cart));
            }
            return total;
        },
        totalPriceOrderComputer() {
            let totalOrder = 0;
            this.order.products.forEach(p => {
                totalOrder += p.quantity * p.price;
            })
            this.order.totalPrice = totalOrder;
            return totalOrder;
        },
        getUserInfo() {
            if (this.user !== null) {
                return this.user;
            }
            return '';
        },
        infoCart() {
            if (this.cart.totalPrice === 0) return "";
            return this.cart;
        },
        infoUser() {
            if (this.user === null) return "";
            return this.user;
        },

        watchCart() {
            const a = this.cart + 1;
            try {

                if (this.user) {
                    let newCart = {
                        products: [],
                        user: this.user.id,
                        totalPrice: this.cart.totalPrice
                    };
                    this.cart.products.forEach((product) => {
                        newCart.products.push({
                            book_id: product.book_id,
                            quantity: product.quantity,
                            price: product.price
                        })
                    })
                    CartService.updateCart(this.user.cart._id, JSON.stringify(newCart));
                }
            }
            catch (error) {
                alert((error.response.data.message));
            }
            return this.cart
        },
        addDataCartFromMongoDB() {
            let a = this.user;
            const b = JSON.parse(window.localStorage.getItem('first-login'));
            if (this.user !== null && b === 1) {
                if (typeof (localStorage) !== 'undefined') {
                    window.localStorage.setItem('first-login', 0);
                }

                this.user.cart.products.forEach((productDB) => {
                    let daCo = false;
                    this.cart.products.forEach((product) => {
                        if (product.book_id === productDB.book_id) {
                            product.quantity += productDB.quantity;
                            daCo = true;
                        }
                    })
                    if (!daCo) {
                        this.cart.products.push({
                            book_id: productDB.book_id,
                            quantity: productDB.quantity,
                            price: productDB.price,
                            title: productDB.title,
                            image: productDB.image
                        })
                    }
                })
                this.cart.totalPrice += this.user.cart.totalPrice;
                window.localStorage.setItem('cart-info', JSON.stringify(this.cart));
            }
            return this.cart;
        },
    },
    actions: {
        addOrder() {
            try {

                if (this.user.order) {
                    let newOrder = {
                        products: [],
                        user: this.user.id,
                        totalPrice: this.order.totalPrice
                    };
                    this.order.products.forEach((product) => {
                        newOrder.products.push({
                            book_id: product.book_id,
                            quantity: product.quantity,
                            price: product.price
                        })
                    })
                    OrderService.updateCart(this.user.order._id, newOrder);
                }
            }
            catch (error) {
                alert((error.response.data.message));
            }
        },
        async signOut() {
            await AuthService.signOut();
            window.localStorage.removeItem('cart-info')
            window.localStorage.removeItem('first-login')
            window.localStorage.removeItem('access-token')
            this.user = null;
            this.cart = {
                products: [],
                totalPrice: 0
            }
            location.reload();
        },
        updateInfoUser(data) {
            console.log(AuthService.updateInfoUser(this.user.id, data));
            this.user.full_name = data.full_name;
            this.user.address = data.address;
        },
        changePassword(data) {
            AuthService.changePassword(this.user.id, data);
        },
        setInfoCart() {
            if (typeof (localStorage) !== 'undefined') {
                if (typeof localStorage['cart-info'] !== 'undefined') {
                    this.cart = JSON.parse(window.localStorage.getItem('cart-info'))

                }
            }
            else {
                alert('Trình duyệt của bạn không hỗ trợ localStorage. Hãy nâng cấp trình duyệt để sử dụng!');
            }
        },
        setUserInfo(userInfo) {
            this.user = userInfo;
            localStorage.setItem("access-token",this.user.accessToken);
            this.setInfoCart();
        },
        addToCart(book) {
            if (this.cart.totalPrice === 0) {
                this.cart.products.push(book)
            }
            else {
                let tempt = this.cart.products.filter((product) => {
                    return product.book_id === book.book_id;
                })
                if (tempt.length === 0) {
                    this.cart.products.push(book)
                }
                else {
                    this.cart.products.forEach((product, index) => {
                        if (product.book_id === book.book_id) {
                            product.quantity = parseInt(product.quantity)
                            book.quantity = parseInt(book.quantity)
                            product.quantity += book.quantity;
                        }
                    })
                }
            }
            this.cart.totalPrice += book.quantity * book.price;
            if (typeof (localStorage) !== 'undefined') {
                window.localStorage.setItem('cart-info', JSON.stringify(this.cart));
            }
            else {
                alert('Trình duyệt của bạn không hỗ trợ localStorage. Hãy nâng cấp trình duyệt để sử dụng!');
            }
        },
        removeCart(id) {
            let p;
            this.cart.products.forEach((product, index) => {
                if (product.book_id === id) {
                    p = index;
                    this.cart.totalPrice -= parseInt(product.price) * parseInt(product.quantity);
                }
            })
            this.cart.products.splice(p, 1);
            let a = this.watchCart;
            window.localStorage.setItem('cart-info', JSON.stringify(this.cart));
        },
        removeOrder(id) {
            let p;
            this.order.products.forEach((product, index) => {
                if (product.book_id === id) {
                    p = index;
                    this.order.totalPrice -= parseInt(product.price) * parseInt(product.quantity);
                }
            })
            this.order.products.splice(p, 1);
        }
    }
})
