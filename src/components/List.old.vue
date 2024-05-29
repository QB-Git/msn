<script setup lang="ts">
import Modal from './Modal.vue';
import Item from './Item.vue';

import { ref, onMounted } from 'vue';

import { dragAndDrop, useDragAndDrop } from "@formkit/drag-and-drop/vue";

const animes = ref({});
const days = ['Ø', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const showModal = ref(false);
const currentEditedAnime = ref({});
const dragInProgress = ref(false);

// let parent = ref(null);

// dragAndDrop({
//   parent: parent,
//   value: animes['Lundi'],
//   group: "weekAnimes",
// });

let parenta = {};
days.forEach(d => parenta[d] = ref(null));

let values = ref([]);

const refreshList = async () => {
  dragAndDrop({
    parent: parenta['Lundi'],
    values: values,
  });
  animes.value = await window.app.getAnimes();
  values.value = animes.value['Lundi'];
}
window.refreshList = refreshList;

window.setEditedAnime = async (uuid) => {
  currentEditedAnime.value = await window.app.getAnime(uuid);
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
  currentEditedAnime.value = {};
}

const dragStart = () => dragInProgress.value = true;
const dragEnd = async (e) => {
  dragInProgress.value = false

  await window.app.setPosition(
    e.item.dataset.uuid,
    {
      position: e.oldIndex,
      day: e.from.parentElement.dataset.day,
    },
    {
      position: e.newIndex,
      day: e.to.parentElement.dataset.day,
    }
  );
  await refreshList();
  // TODO: résoudre problème dupplication item quand on le glisse dans un jour avec déjà des items
};

onMounted(async () => {
  await refreshList();
});
</script>

<template>
  <div class="container">
    <div v-for="day in days" :key="day" :data-day="day" :ref="parenta[day]">
      <div class="day">{{ day }}</div>
      <Item v-for="anime in animes[day]" :key="anime.uuid" :anime="anime" />
    </div>
  </div>
  <Teleport to="body">
    <Modal :show="showModal" @close="closeModal" @refresh="refreshList" :anime="currentEditedAnime" />
  </Teleport>
</template>

<style scoped>
.container::-webkit-scrollbar {
  width: 8px;
}

.container::-webkit-scrollbar-thumb {
  background: rgb(var(--darker-bg-color-rgb));
  border-radius: 10px;
}

.container {
  max-height: calc(100vh - calc(var(--drag-height) + var(--action-bar-height)));
  overflow-y: auto;
}

.day {
  background: rgb(43, 45, 49);
  padding: .3rem;
  font-weight: 900;
  text-transform: uppercase;
  text-align: center;
  position: sticky;
  top: -1px;
}
</style>
