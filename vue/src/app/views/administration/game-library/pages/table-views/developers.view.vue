<script setup lang="ts">
import { Order, PaginationDto, PaginationMeta, PaginationOptions, SortOptions } from '@/library/data/dto/pagination.dto'

import TablePaginated from '@/app/components/table/paginated.component.vue'
import { reactive, ref, watch } from 'vue'
import { GameLibraryService } from '../../service/game-library.service'
import { useI18n } from 'vue-i18n'
import { GenreDto } from '@/library/data/dto/games/genre.dto'

import ContentLayout from '../../../layouts/content.layout.vue'

const defaultOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'developer.name',
  search: undefined
}

const sort: Array<SortOptions> = [
  { sort: 'developer.createdAt', order: Order.ASC, label: 'forms.oldest' },
  { sort: 'developer.createdAt', order: Order.DESC, label: 'forms.newest' },
  { sort: 'developer.name', order: Order.ASC, label: 'forms.name' }
]

const { getPaginated, create, remove, update } = GameLibraryService.developers

const options = reactive<PaginationOptions>(defaultOptions)

const loading = ref<boolean>(true)
const response = reactive<{ data: Array<any>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: options, itemCount: 0 })
})

const columns = [
  { name: 'name', label: 'forms.name' },
  { name: 'actions', label: 'forms.actions' }
]

const { t } = useI18n()

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await getPaginated(payload)
    .then((res: PaginationDto<GenreDto>) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

await getPaginatedData(defaultOptions)
watch(options, async (newVal: PaginationOptions): Promise<void> => {
  await getPaginatedData(newVal)
})
</script>

<template>
  <ContentLayout title="administration.users.title" subtitle="administration.users.subtitle">
    <template #table>
      <TablePaginated
        v-model:options="options"
        :columns
        :loading
        :sort-options="sort"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :caption="
          t(
            'administration.game-library.developers.caption',
            { showing: response.data.length },
            response.meta.itemCount
          )
        "
      >
        <template v-slot>
          <button
            class="btn btn-dark btn-icon d-flex justify-content-center align-items-center"
            type="button"
            v-tooltip="{ text: $t('actions.create'), position: 'bottom', trigger: 'hover' }"
            @click="(_: MouseEvent) => create((_: GenreDto) => { getPaginatedData(options) })"
          >
            <font-awesome-icon size="lg" :icon="['fas', 'plus']" />
          </button>
        </template>

        <template #name="{ row }">
          <span class="fw-semibold">{{ row.name }}</span>
        </template>

        <template #actions="{ row }">
          <div class="d-flex gap-1 flex-nowrap">
            <button
              v-tooltip="{ text: $t('actions.update'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => update(row, (_: GenreDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-warning">
                <font-awesome-icon size="sm" :icon="['fas', 'pencil']" />
              </div>
            </button>
            <button
              v-tooltip="{ text: $t('actions.delete'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => remove(row, (_: GenreDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-danger">
                <font-awesome-icon size="sm" :icon="['fas', 'trash-can']" />
              </div>
            </button>
          </div>
        </template>
      </TablePaginated>
    </template>
  </ContentLayout>
</template>
