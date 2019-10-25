<template>
    <!-- <div id="app" class="scroll-wrapper"> -->
    <div id="app" class>
        <app-nav></app-nav>
        <el-container>
            <el-main>
                <router-view class="router-view"></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "App"
    }
</script>

<style lang="scss">
.el-container{
    min-height: 600px;
}
</style>