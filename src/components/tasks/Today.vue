<template>
    <div>
        <tasks-list :tasks="tasks"></tasks-list>

        <div v-if="yesterdayTasks.length > 0" class="font-bold text-sm m-4 mt-16 text-grey-darker">
            <i class="feather icon-chevron-left mr-2"></i>
            From yesterday
        </div>
        <tasks-list :tasks="yesterdayTasks"></tasks-list>

        <div v-if="earlierTasks.length > 0" class="font-bold text-sm m-4 mt-8 text-grey-darker">
            <i class="feather icon-chevrons-left mr-2"></i>
            Earlier
        </div>
        <tasks-list :tasks="earlierTasks"></tasks-list>
    </div>
</template>

<script>
    import Page from '@/assets/js/Page'

    export default new Page()
        .with('tasks/List')
        .getters({
            findTasks: 'tasks/filteredFind'
        })
        .computed({
            tasksDate() {
                return moment().format('YYYY-MM-DD')
            },
            yesterdayTasksDate() {
                return moment().subtract(1, 'day').format('YYYY-MM-DD')
            },
            tasks() {
                return this.findTasks({query: { today: this.tasksDate }}).data
            },
            yesterdayTasks() {
                return this.findTasks({ query: { today: this.yesterdayTasksDate } }).data
            },
            earlierTasks() {
                return this.findTasks({ query: { today: { $ne: null, $nin: [ this.tasksDate, this.yesterdayTasksDate ] } } }).data
            }
        })
        .vue()    
</script>