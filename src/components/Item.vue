<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  anime: Object,
});

const addContextualMenuForItem = async (event, uuid) => {
  event.preventDefault();
  await window.app.setContextualMenu(uuid, event.clientX, event.clientY)
};

const incrementEpisodes = async (eps, uuid) => {
  await changeEpisodes(eps + 1, uuid);
}

const decrementEpisodes = async (eps, uuid) => {
  if (eps - 1 >= 0) {
    await changeEpisodes(eps - 1, uuid);
  }
}

const changeEpisodes = async (episodes, uuid) => {
  await window.app.editAnime(uuid, {
    episodes
  });
  await refreshList();
}
</script>

<template>
  <div :key="anime.uuid" class="item" :data-uuid="anime.uuid"
    @contextmenu="addContextualMenuForItem($event, anime.uuid)">
    <span class="item__title">{{ anime.title }}</span>
    <span class="item__episodes">
      <input class="input-number" @input="e => changeEpisodes(e.target.valueAsNumber, anime.uuid)" type="number"
        :value="anime.episodes" min="0">
      <span class="input-number-increment" @click="incrementEpisodes(anime.episodes, anime.uuid)">
        <FontAwesomeIcon :icon="faPlus" />
      </span>
    </span>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item:hover {
  background-color: rgba(255, 255, 255, .05);
}

.item__title {
  padding: .5rem 0 .5rem .75rem;
  display: inline-flex;
  align-items: center;
  flex: 1;
}

.item__episodes {
  display: inline-flex;
  align-items: center;
  padding: .5rem .75rem .5rem 0;
}

.input-number,
.input-number-decrement,
.input-number-increment {
  height: 1.9rem;
  border-width: 0;
  margin: 0;
  padding: 0;
  background: transparent;
  color: rgb(var(--primary-txt-color-rgb));
  border-radius: 0;
  font-size: 1.2rem;
}

.input-number {
  width: 3.5rem;
  vertical-align: top;
  text-align: center;
  border-radius: 1rem 0 0 1rem;
  overflow: hidden;
  padding-left: 0.25rem;
  box-shadow: rgb(255 255 255 / 16%) 0px 30px 60px -12px inset, rgb(0 0 0 / 20%) 0px 18px 36px -18px inset;
}

.input-number::-webkit-outer-spin-button,
.input-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-number-decrement,
.input-number-increment {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  border-radius: 0;
  padding: 0.25rem;
  box-sizing: border-box;
  fill: white;
  /* border: 2px solid red; */
  box-shadow: rgba(255, 255, 255, 0.189) 0px 30px 60px -12px inset,
    rgb(100, 100, 100) 0px 18px 36px -18px inset;
}

.input-number-increment {
  border-radius: 0 1rem 1rem 0;
}

.input-number-decrement:active,
.input-number-increment:active {
  background: rgb(var(--secondary-bg-color-rgb));
}
</style>
