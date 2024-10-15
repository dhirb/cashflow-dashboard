<script setup>
const props = defineProps({
  label: { type: String, required: true },
  checked: { type: Boolean, required: true },
  disabled: { type: Boolean }
})

const emit = defineEmits(['toggle'])

const toggle = () => {
  emit('toggle')
}
</script>

<template>
  <label class="flex">
    <input
      class="toggle-checkbox"
      type="checkbox"
      :checked="props.checked"
      :disabled="props.disabled"
      @change="toggle"
    />
    <div class="toggle-switch"></div>
    <span class="toggle-label">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.toggle-switch {
  display: inline-block;
  background: #ccc;
  border-radius: 16px;
  width: 48px;
  height: 24px;
  position: relative;
  vertical-align: middle;
  transition: background 0.25s;
}
.toggle-switch:before,
.toggle-switch:after {
  content: '';
}
.toggle-switch:before {
  display: block;
  background: linear-gradient(to bottom, #fff 0%, #eee 100%);
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
  width: 18px;
  height: 18px;
  position: absolute;
  top: 3px;
  left: 4px;
  transition: left 0.25s;
}

.toggle-checkbox:checked + .toggle-switch {
  background: #13c87b;
}
.toggle-checkbox:checked + .toggle-switch:before {
  left: 30px;
}

.toggle-checkbox {
  position: absolute;
  visibility: hidden;
}

.toggle-label {
  margin-left: 5px;
  position: relative;
  top: 2px;
}
</style>
