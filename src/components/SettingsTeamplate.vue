<template>
    <div class="settings-template">
        <button class="settings-template__btn" @click="$emit('action')">
            <slot name="button"></slot>
        </button>

        <div class="settings-template__body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script setup>
defineEmits(['action'])
</script>

<style lang="scss" scoped>
.settings-template {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: flex-start;

    // .settings-template__body
    &__body {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    // .settings-template__btn
    &__btn {
        width: 100%;
        height: 35px;

        margin: 0 0 20px 0;
        font-size: 20px;
    }
}
</style>