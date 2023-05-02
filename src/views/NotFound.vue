<template>
    <div class="page bg-white box radius">
            <div>Oops, không thể tìm thấy trang. Trở về, </div> 
            <router-link to="/"> trang chủ.</router-link>
    </div>
</template>

<style scoped>
    .page{
        display: flex;
        padding: 50px;
        min-height: 100px;
        margin-top: 15px;
    }
    
    .page *{
        font-size: 26px;
    }
</style>