<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter
  },
  methods: {
    scrollToTop() {
      let mybutton = document.getElementById("btn-back-to-top");

      window.onscroll = function () {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      };
      
      mybutton.addEventListener("click", () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
    }
  },
  mounted() {
    this.scrollToTop()
  }
};
</script>

<style scoped>
#btn-back-to-top {
  position: fixed;
  bottom: 100px;
  right: 20px;
  display: none;
  background-color: #7ac400;
}

#btn-back-to-top *{
  color: white;
  font-size: 25px;
}
</style>

<template>
  <AppHeader />
  <div class="container-fluid">
    <main class="page">
      <aside class="l"></aside>
      <div class="article">
        <router-view />
      </div>
      <aside class="r">
        <button type="button" class="btn btn-floating btn-lg" id="btn-back-to-top">
          <i class="fas fa-arrow-up"></i>
        </button>
      </aside>
    </main>
  </div>
  <AppFooter />
</template>