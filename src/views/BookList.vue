<script>
import BookService from "../services/book.service";
import { useUserStore } from "../stores/UserStore";
import bootstrap from "bootstrap/dist/js/bootstrap";
export default {
    setup() {
        const userStore = useUserStore()
        return {
            userStore
        }
    },
    data() {
        return {
            books: [],
            category: "",
        }
    },
    watch: {
        '$route'(to, from) {
            this.retrieveBooks()
        }
    },
    computed: {
        numPageCurrent() {
            return this.$route.hash ? this.$route.hash : "";
        },
        showPageCurrent() {
            if (this.numPageCurrent) {
                return parseInt(this.numPageCurrent.substr(5));
            }
            else {
                this.$route.hash = "#page1";
                return 1;
            }
        },
        numPageOfBooks() {
            let tempt = [];
            const numPages = this.books.length;
            for (let i = 0; i < numPages; i++) {
                tempt.push(i + 1);
            }
            return tempt;
        },

    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getData(this.$route.fullPath.slice(9));
            } catch (error) {
                console.log(error);
            }
        },
        formatter(par) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(par);
        },
        goDetailItem(id) {

            this.$router.push({ name: "book.detail", params: { id: id } });
        },
        async filterBooks() {

            await this.$router.push({ name: 'book.list', query: { category: this.category } })
            this.books = await BookService.getData(this.$route.fullPath.slice(9));
        },
        showNotify() {
            const toastLiveExample = document.getElementById('liveToast')
            const toast = new bootstrap.Toast(toastLiveExample);

            toast.show();
        },
        addToCart(book) {
            this.userStore.addToCart({
                book_id: book._id,
                quantity: 1,
                price: book.price,
                title: book.title,
                image: book.image[0]
            })
            this.showNotify();
        }
    },
    created() {
        this.retrieveBooks();
    }
}
</script>

<template>
    <div class="container-fluid">

        <div class="row">
            <div class="col-lg-3">
                <div class="container">

                    <div id="content" class="">
                        <div id="filterbar" class="">
                            <div class="box border-bottom">
                                <div class="box-label text-uppercase d-flex align-items-center">Thể Loại Sách</div>
                                <div id="inner-box" class=" mt-2 mr-1">
                                    <div class="my-1"> <label class="tick"> Sách Giáo Khoa - Tham Khảo<input
                                                value="Sách Giáo Khoa - Tham Khảo" type="radio" v-model="category">
                                            <span class="check"></span> </label> </div>
                                    <div class="my-1"> <label class="tick">Sách Thiếu Nhi <input value="Sách Thiếu Nhi"
                                                type="radio" v-model="category"> <span class="check"></span> </label>
                                    </div>
                                    <div class="my-1"> <label class="tick">Sách Kĩ Năng <input value="Sách Kĩ Năng"
                                                type="radio" v-model="category"> <span class="check"></span> </label>
                                    </div>
                                    <div class="my-1"> <label class="tick">Tất Cả <input value="all" type="radio"
                                                v-model="category"> <span class="check"></span> </label> </div>
                                    <input type="button" class="btn-filter" value="Áp dụng" @click="filterBooks">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-lg-9">
                <div class="toast-container position-fixed bottom-0 end-0 p-3">

                    <div id="liveToast" class="toast align-items-center border-1" role="alert" aria-live="assertive"
                        aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body notify-success">
                                Thêm vào giỏ hàng thành công !
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                                aria-label="Close"></button>
                        </div>
                    </div>
                </div>

                <div v-if="books[0]">
                    <template v-for="(numPage, id) in numPageOfBooks" :key="id">
                        <div class="row row-cols-1 row-cols-md-3" :id="'page' + numPage"
                            :style="{ display: numPage !== showPageCurrent ? 'none' : 'inline-flex' }">
                            <div class="col mb-4" v-for="(book, index) in books[id]" :key="index">
                                <div class="thumb-wrapper" @click="goDetailItem(book._id)">
                                    <div class="img-box">
                                        <img :src="book.image[0]" class="img-fluid">
                                    </div>
                                    <div class="thumb-content">
                                        <h4 :title="book.title">{{ book.title }}</h4>
                                        <p class="item-price">{{ formatter(book.price) }}</p>
                                        <button href="#" class="btn btn-primary" @click.stop="addToCart(book)">Add to
                                            Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <nav aria-label="Page of Books">
                        <ul class="pagination">
                            <li class="page-item" :class="{ disabled: 1 === showPageCurrent }">
                                <a class="page-link" :href="'#page' + (showPageCurrent - 1)" tabindex="-1"
                                    aria-disabled="true">Previous</a>
                            </li>
                            <li v-for="(numPage, id) in numPageOfBooks" :key="id" class="page-item"
                                :class="{ active: numPage === showPageCurrent }" aria-current="page">
                                <a class="page-link" :href="'#page' + numPage">
                                    {{ numPage }}
                                    <span class="sr-only" v-if="numPage === showPageCurrent">(current)</span>
                                </a>
                            </li>
                            <li class="page-item" :class="{ disabled: numPageOfBooks.length === showPageCurrent }">
                                <a class="page-link" :href="'#page' + (showPageCurrent + 1)">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap'); */

.row{
    width: 100%;
}

.btn-filter{
    margin-top: 8px;
    width: 150px;
    margin-bottom: 8px;
}

#liveToast {
    background-color: #7ac400;
    width: max-content;
}

.notify-success {
    color: #fff;
    font-size: 20px;
    padding: 10px;
    word-spacing: normal;
}

.pagination {
    float: right;
    padding-right: 20px;
}

.pagination .page-link {
    padding: 0.2rem 0.5rem;
    font-size: 1.2rem;
    line-height: 1.25;
}

.container-fluid {
    margin-top: 20px;
    margin-bottom: 20px;
}

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    /* font-family: 'Poppins', sans-serif; */
}

.container {
    background-color: #f4f4f4;
    width: 100%;
    padding-right: 20px;
}

button.btn.btn-hide {
    height: inherit;
    background-color: #ff935d;
    color: #fff;
    font-size: 0.82rem;
    padding-left: 40px;
    padding-right: 40px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px
}

.btn:focus {
    box-shadow: none
}

#filterbar {
    width: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 15px;
    float: left
}

#filterbar input[type="radio"] {
    visibility: hidden
}

#filterbar input[type='radio']:checked {
    background-color: #16c79a;
    border: none
}

#filterbar .btn.btn-success {
    background-color: #ddd;
    color: #333;
    border: none;
    width: 115px
}

#filterbar .btn.btn-success:hover {
    background-color: #aff1e1;
    color: #444
}

label {
    cursor: pointer
}

.tick {
    display: block;
    position: relative;
    padding-left: 23px;
    cursor: pointer;
    font-size: 17px;
    margin: 0
}

.check {
    position: absolute;
    top: 1px;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 3px
}

.tick:hover input~.check {
    background-color: #f3f3f3
}

.tick input:checked~.check {
    background-color: #ffffff
}

.check:after {
    content: "";
    position: absolute;
    display: none
}

.tick input:checked~.check:after {
    display: block;
    transform: rotate(45deg) scale(1)
}

.tick .check:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid rgb(0, 0, 0);
    border-width: 0 3px 3px 0;
    transform: rotate(45deg) scale(2)
}

.box {
    padding: 10px
}

.box-label {
    color: #7ac400;
    font-size: 18px;
    font-weight: 700
}

#size .btn.btn-success {
    background-color: #ddd;
    color: #333;
    border: none;
    width: 40px;
    font-size: 0.8rem;
    border-radius: 0
}

#size .btn.btn-success:hover {
    background-color: #aff1e1;
    color: #444
}

#size .btn-success:not(:disabled):not(.disabled).active,
#size .btn-success:not(:disabled):not(.disabled):active {
    background-color: #16c79a;
    color: #fff
}

#size label {
    margin: 10px;
    margin-left: 0px
}

.middle {
    position: relative;
    width: 100%;
    margin-top: 25px
}


input[type=range] {
    position: absolute;
    pointer-events: none;
    z-index: 2;
    height: 10px;
    width: 90%;
    opacity: 0
}

input[type=range]::-webkit-slider-thumb {
    pointer-events: all;
    width: 30px;
    height: 30px;
    border-radius: 0;
    border: 0 none;
    background-color: red;
}

.thumb-wrapper {
    padding: 25px 15px;
    background: #fff;
    border-radius: 6px;
    text-align: center;
    position: relative;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    width: 95%;
}

.thumb-wrapper .img-box {
    height: 190px;
    margin-bottom: 20px;
    width: 100%;
    position: relative;
}

.thumb-wrapper img {
    max-width: 100%;
    max-height: 100%;
    display: inline-block;
    position: absolute;
    bottom: 0;
    margin: 0 auto;
    left: 0;
    right: 0;
}

.item-price{
    font-size: 18px;
    margin-top: 10px;
    color: red;
    font-weight: 500;
}

.thumb-wrapper h4 {
    font-size: 18px;
}

.thumb-wrapper h4,
.thumb-wrapper p,
.thumb-wrapper ul {
    margin-bottom: 5px;
}

.thumb-wrapper .thumb-content h4 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    text-align: justify;

}

.thumb-wrapper .thumb-content .btn, .btn-filter {
    color: #7ac400;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: bold;
    background: none;
    border: 1px solid #7ac400;
    padding: 6px 14px;
    margin-top: 5px;
    line-height: 16px;
    border-radius: 20px;
}

.thumb-wrapper .thumb-content .btn:hover,
.thumb-wrapper .thumb-content .btn:focus,
.btn-filter:hover, .btn-filter:focus {
    color: #fff;
    background: #7ac400;
    box-shadow: none;
}

.no-notify {
    display: none;
}

.notify {
    display: flex;
    position: fixed;
    z-index: 100;
    width: 282px;
    height: 90px;
    transform: scale(0.75);
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);
    margin: 20px 15px;
    background-image: url('/img/sanpham/notify-succeess.png');
    bottom: 0;
    left: 0;
    animation: fade-in 3s ease-in-out, fade-in 3s reverse forwards;
}
</style>