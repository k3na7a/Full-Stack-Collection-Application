<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import * as bootstrap from 'bootstrap'

import { useOffcanvasStore, OffcanvasStore, OffcanvasOptions } from '@/app/components/offcanvas/store/offcanvas.store'

const store: OffcanvasStore = useOffcanvasStore()

const offCanvasRef = ref<InstanceType<typeof HTMLElement>>()

const isOpen = computed<boolean>(() => store.isOpen)
const options = computed<OffcanvasOptions>(() => store.options as OffcanvasOptions)

watch(isOpen, async (value: boolean, _prev: boolean): Promise<void> => {
  const myOffcanvas: bootstrap.Offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offCanvasRef.value || '')

  if (value) myOffcanvas.show()
  else myOffcanvas.hide()
})

const purge: () => void = store.purgeOffcanvas

onMounted(() => offCanvasRef.value?.addEventListener('hidden.bs.offcanvas', purge))
onUnmounted(() => offCanvasRef.value?.removeEventListener('hidden.bs.offcanvas', purge))
</script>

<template>
  <div
    ref="offCanvasRef"
    class="offcanvas offcanvas-start text-light border-0"
    data-bs-backdrop="static"
    tabindex="-1"
    id="offcanvas"
  >
    <component :is="options.view" v-bind="options.properties" />
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

#offcanvas {
  & .offcanvas-header,
  & .offcanvas-body {
    background-color: inherit;
    min-width: 240px;
  }

  width: max-content;

  background-color: $backgroundLight;
  box-shadow: $boxShadow;
}
</style>
