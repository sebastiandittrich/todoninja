<template>
    <div @click="$emit('click', $event)" class="text-grey-darkest py-4 my-1 pl-6 flex flex-row items-center justify-start relative cursor-pointer group">
        <i v-if="icon.length > 0" class="text-xl text-grey-darker mr-4" :class="icon"></i>
        <slot class="transition" :class="active ? 'font-bold text-blue' : ''"></slot>
        <div class="indicator bg-blue rounded-full absolute transition pin-l w-4" :class="active ? 'h-full active' : 'h-4'"></div>
    </div>
</template>

<style lang="stylus" scoped>
.indicator
    transform translateX(-100%)
.indicator.active
    transform: translate(-50%)
.group:hover .indicator
    transition-duration 150ms
    transform translateX(-50%)
</style>


<script>
import Page from '@/assets/js/Page'

export default new Page()
    .props({
        active: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: ''
        }
    })
    .vue()
</script>
