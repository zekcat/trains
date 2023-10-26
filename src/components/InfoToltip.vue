<template>
  <div class="info-tooltip">
    {{ title }}
  </div>
</template>

<script setup>
/**
 * @description Компонент выводит информационное сообщение для пользователя
 * при успешном выполнении действия возможной ошибке и тд
 */
import { defineProps, onMounted } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "empty",
  },
  timeout: {
    type: Number,
    default: 1500,
  },
});

const emit = defineEmits(["close"]);

onMounted(() => {
  setTimeout(() => {
    emit("close");
  }, props.timeout);
});
</script>

<style lang="scss" scoped>
.info-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30vw;
  min-height: 5vh;
  font-size: 3em;
  line-height: 100%;

  background: #f9f9fb;
  box-shadow: 4px 12px 51px 14px rgba(34, 60, 80, 0.64);
  border-radius: 20px;
}
</style>
