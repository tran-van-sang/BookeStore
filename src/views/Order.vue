<template>
    <div id="bg-white" class="bg-white article cach radius">
        <div id="flex-donhang">
            <div id="chitiet">
                <h1>ĐẶT HÀNG</h1>
                <table id="details-order">
                    <thead>
                        <tr>
                            <td> <b>Hình SP</b> </td>
                            <td><b>Tên SP</b></td>
                            <td><b>Số Lượng</b></td>
                            <td><b>Giá</b></td>
                            <td><b>Thành Tiền</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody id="details-order-body">
                        <tr v-for="(book, index) in books">
                            <td>
                                <router-link :to="{ name: 'book.detail', params: { id: book.book_id } }">
                                    <img :src="book.image" class="round-figure">
                                </router-link>
                            </td>
                            <td style="text-align: left;">
                                <router-link style="color: #000;"
                                    :to="{ name: 'book.detail', params: { id: book.book_id } }">
                                    {{ book.title }}
                                </router-link>
                            </td>
                            <td>
                                <div class="quantity-product">
                                    <div class="quantity-product-form"
                                        @click="book.quantity > 1 ? book.quantity-- : ''">
                                        <button><i class="fa-solid fa-minus"></i></button>
                                    </div>
                                    <input type="text" class="quantity" v-model="book.quantity">
                                    <div class="quantity-product-form" @click="book.quantity++">
                                        <button><i class="fa-solid fa-plus"></i></button>
                                    </div>
                                </div>
                            </td>
                            <td>{{ formatter(book.price) }}</td>
                            <td>{{ formatter(book.quantity * book.price) }}</td>
                            <td><i @click="removeOrder(book.book_id)" class="fa-solid fa-trash-can"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="hoadon" class="radius">
                <h1 class="radius bg-white">HÓA ĐƠN</h1>

                <div class="row">
                    <div class="col-3">
                        Địa chỉ nhận:
                    </div>
                    <div class="col-9">
                        <textarea v-model="this.order.address" cols="44" rows="2"></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        Tổng giá trị:
                    </div>
                    <div class="col-9">
                        {{ formatter(userStore.totalPriceOrderComputer) }}
                    </div>
                </div>
                <div class="row">
                    <input id="sm-donhang" @click="addOrder()" class="radius" type="submit" value="Đặt Hàng" />
                </div>
                <br>
                <div class="row">
                    <h5><u> <b>Lưu ý:</b> </u> Thanh toán bằng tiền mặt và tự thanh toán phí ship khi nhận hàng.</h5>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { useUserStore } from "../stores/UserStore";
import OrderService from "../services/order.service";
import AuthService from "../services/auth.service";
export default {
    data() {
        const books = useUserStore().order.products;
        const order = useUserStore().order;
        const userStore = useUserStore()
        return {
            books,
            order,
            userStore
        }
    },
    watch: {
        books(newV, oldV) {
            console.log(this.order)
            this.order.totalPriceOrderComputer()
        }
    },
    methods: {
        async addOrder() {
            var today = new Date();
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            await OrderService.addOrder({
                address: this.order.address,
                products: this.order.products,
                totalPrice: this.userStore.totalPriceOrderComputer,
                time: dateTime,
                status: false,
                user: this.userStore.user.id
            });
            alert("Đặt hàng thành công! Xem chi tiết đơn hàng đã đặt trong Tài Khoản -> Lịch sử mua hàng.")
            this.order.products.forEach(p => {
                this.userStore.removeCart(p.book_id)
            })
            this.userStore.setUserInfo(await AuthService.verifyToken());
            this.$router.push({ name: 'cart' })
        },
        goDetailItem(id) {
            this.$router.push({ name: "book.detail", params: { id: id } });
        },
        showCart() {
            if (!this.order.totalPrice) {
                this.$router.push({ name: "cart" });
            }
        },
        removeOrder(id) {
            useUserStore().removeOrder(id);
        },

        formatter(par) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(par);
        },

    },
    mounted() {
        this.showCart();
    },
}
</script>

<style scoped>
/* Don Hang */


.quantity-product {
    display: flex;
    padding: 0 10px 0 15px;
}

.quantity-product label {
    margin-right: 10px;
}

.quantity {
    margin-left: 1px;
    margin-right: 1px;
    width: 30px;
    text-align: center;
}

#details-order {
    text-align: center;
}

#details-order td,
#details-order tr {
    border-bottom: 1px solid rgb(231, 232, 233);
    font-size: 18px;
    width: fit-content;
}

#totalprice,
#discount,
#tax,
#totalcost {
    text-align: right;
}

#flex-donhang {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

#chitiet {
    width: 90%;
    border-radius: 10px;
    padding: 20px 10px;
}

#chitiet,
#chitiet *,
#hoadon,
#hoadon *,
#details-order,
#details-order * {
    background-color: white;
}

#hoadon>h1 {
    margin-bottom: 20px;
}

#chitiet table {
    width: 100%;
    border: 0.5px solid rgb(231, 232, 233);
}

#details-order,
#chitiet h1,
#hoadon h1,
#sm-donhang {
    text-align: center;
    border-radius: 10px;
}

#totalprice input {
    width: 100%;
    border: none;
}

.round-figure {
    max-width: 130px;
    margin: 10px;
}

#hoadon {
    width: 90%;
    padding: 20px 25px;
}

#hoadon div.row * {
    font-size: 18px;
    font-weight: 600;
}


#hoadon table {
    margin: 0 5px;
    width: 100%;
}

#hoadon table tr,
#hoadon table td {
    text-align: left;
    line-height: 2.5;
    border-bottom: 1px solid rgb(231, 232, 233);
    font-size: 18px;
    font-weight: 600;
}

#sm-donhang {
    font-weight: bold;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 25px;
    background-color: #78BF00;
    border: 2px solid #78BF00;
    width: 200px;
    margin-top: 30px;
    padding: 10px 40px;
}

#sm-donhang:hover {
    color: #78BF00;
    background-color: white;
}
</style>