<template>
    <div class="container">
        <button class="button-tertiary button-small btn-add" @click="showModal = true">Ajouter</button>
    </div>
    <Teleport to="body">
        <Modal :show="showModal" @close="showModal = false" @refresh="refresh" />
    </Teleport>
</template>

<script setup>
import Modal from './Modal.vue'
import { ref } from 'vue';

const showModal = ref(false);

const refresh = () => window.refreshList();
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: .5rem 1rem;
    border-bottom: 2px solid rgb(36, 38, 42);
    background: rgb(var(--primary-bg-color-rgb));
    height: var(--action-bar-height);
    box-sizing: border-box;
}

.btn-add {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1;
}
</style>
