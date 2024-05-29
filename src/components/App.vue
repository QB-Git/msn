<template>
  <div class="drag"></div>
  <ActionBar />
  <List />
</template>

<script setup>
import ActionBar from './ActionBar.vue'
import List from './List.vue'
</script>

<style>
.drag {
  -webkit-app-region: drag;
  background-color: rgb(var(--darker-bg-color-rgb));
  height: var(--drag-height);
  display: flex;
  justify-content: left;
  z-index: 1;
}
</style>
