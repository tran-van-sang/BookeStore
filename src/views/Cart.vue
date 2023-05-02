<template>
    <div id="bg-white" class="bg-white article cach radius">
        <div id="flex-donhang">
            <div id="chitiet">
                <h1>GIỎ HÀNG</h1>
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
                        <tr v-for="(book, index) in userStore.cart.products">
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
                            <td><i @click="removeCart(book.book_id)" class="fa-solid fa-trash-can"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="hoadon" class="radius">
                <h1 class="radius bg-white">HÓA ĐƠN</h1>
                <table>

                    <tbody id="details-order-foot">
                        <tr class="">
                            <td class="">Tổng giá trị tạm tính: </td>
                            <td class="" id="totalprice" colspan="6">{{ formatter(userStore.totalPriceComputer) }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr id="sm-donhang" class="">
                            <td colspan="2"><input @click="cartToOrder()" class="radius" type="submit"
                                    value="Xác Nhận Đơn Hàng"></td>
                        </tr>
                        <!-- <tr>
                            <td colspan="2">Phải đăng nhập tài khoản trước khi Đặt hàng !</td>
                        </tr> -->
                    </tfoot>

                </table>
                <br>
                <h5 > <u> <b>Lưu ý:</b> </u> Phải đăng nhập tài khoản trước khi Đặt hàng !</h5>
            </div>
        </div>

    </div>
</template>

<script>
import { useUserStore } from "../stores/UserStore";
export default {
    data() {
        const books = useUserStore().infoCart.products;
        const cart = useUserStore().infoCart;
        const userStore = useUserStore()
        return {
            books,
            cart,
            userStore
        }
    },
    methods: {
        cartToOrder() {
            if(!this.userStore.user){
                document.getElementById("Modaldangnhap").style.display = "block";
            } else{
                const products = JSON.stringify(this.userStore.cart.products);
                const totalPrice = JSON.stringify(this.userStore.cart.totalPrice) ;
                const address = JSON.stringify(this.userStore.user.address) ;
                this.userStore.order = {
                    products: JSON.parse(products) ,
                    totalPrice:JSON.parse(totalPrice) ,
                    address:JSON.parse(address) 
                };
                this.$router.push({ name: "order" });
            }
        },
        goDetailItem(id) {
            this.$router.push({ name: "book.detail", params: { id: id } });
        },
        removeCart(id) {
            useUserStore().removeCart(id);
        },
        formatter(par) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(par);
        },

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
    width: 72%;
    border-radius: 10px;
    padding: 20px 0;
}

#chitiet,
#chitiet *,
#hoadon,
#hoadon *,
#details-order,
#details-order * {
    background-color: white;
}

#chitiet table {
    width: 100%;
    border: 0.5px solid rgb(231, 232, 233);
}

#details-order,
#chitiet h1,
#hoadon h1,
#sm-donhang input {
    text-align: center;
    border-radius: 10px;
}

.round-figure {
    max-width: 130px;
    margin: 10px;
}

#hoadon {
    width: 25%;
    padding: 20px 0;
}

#hoadon table {
    margin: auto;
    width: 85%;
}

#hoadon table tr,
#hoadon table td {
    text-align: left;
    line-height: 2.5;
    border-bottom: 1px solid rgb(231, 232, 233);
    font-size: 18px;
    font-weight: 600;
}

#sm-donhang input {
    font-weight: bold;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 18px;
    background-color: #78BF00;
    border: none;
}
</style>