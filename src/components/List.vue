<script setup lang="ts">
import Modal from './Modal.vue';
import Item from './Item.vue';
import { ref, onMounted, reactive, toRef, nextTick, toRaw } from "vue";
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { handleEnd as dragAndDropEnd, performTransfer as dragAndDropTransfer } from '@formkit/drag-and-drop';

const animes = ref({});
const days = ref(['Ø', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
const showModal = ref(false);
const currentEditedAnime = ref({});
const daysRefs = ref([]);
const tabValues: Record<string, any> = reactive({});

const refreshList = async () => {
  animes.value = await window.app.getAnimes();

  days.value.forEach((d, index) => {
    const values = toRef(tabValues, d);
    values.value = animes.value[d] ?? [];
    let oldValues = tabValues[d].map(e => e.uuid);

    nextTick(() => {
      dragAndDrop({
        parent: daysRefs.value[index],
        values,
        dragHandle: ".item__title",
        async handleEnd(data) {
          const uuid = data.targetData.node.el.dataset.uuid;
          const oldPosition = oldValues.indexOf(uuid);
          const newPosition = data.targetData.node.data.index;
          await window.app.setPosition(
            uuid,
            {
              position: oldPosition,
              day: d,
            },
            {
              position: newPosition,
              day: d,
            }
          );
          oldValues = tabValues[d].map(e => e.uuid);
          dragAndDropEnd(data);
        },
        // group: 'A'
      });
    });
  });
};
window.refreshList = refreshList;

window.setEditedAnime = async (uuid) => {
  currentEditedAnime.value = await window.app.getAnime(uuid);
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
  currentEditedAnime.value = {};
}

onMounted(async () => {
  await refreshList();
});
</script>

<template>
  <div class="container">
    <div v-for="day in days" :key="day">
      <div v-show="(tabValues[day] ?? []).length > 0">
        <div class="day">{{ day }}</div>
        <div class="listItems" ref="daysRefs">
          <Item v-for="value in tabValues[day]" :key="value.uuid" :anime="value" />
        </div>
      </div>
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

.listItems {
  min-height: 1rem
}
</style>
