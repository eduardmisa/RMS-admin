<template>
  <v-form>
    <div
      v-for="key in Object.keys(model).filter(a => !a.endsWith('_error'))"
      :key="key"
    >
      <v-text-field
        @input="model[key]=$event"
        :value="model[key]"
        :label="key"
        :hide-model="false"
        :error-messages="model[`${key}_error`]"
      />

    </div>
  </v-form>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true
    },
  },
}
</script>