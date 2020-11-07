<template>
<td v-if="!dataItem['inEdit']" class="command--btns flex-row">
    <button
        class="k-primary k-button k-grid-edit-command mr-2"
        @click="editHandler">
        Edit
    </button>
    <button
        class="k-button k-grid-remove-command"
        @click="removeHandler">
        Remove
    </button>
</td>
<td v-else class="command--btns flex-row">
        <button
            class="k-button k-grid-save-command mr-2"
            @click="addUpdateHandler">
            {{dataItem.ID? 'Update' : 'Add'}}
        </button>
        <button
            class="k-button k-grid-cancel-command"
            @click="cancelDiscardHandler">
            {{dataItem.ID? 'Cancel' : 'Discard'}}
        </button>
    </td>
</template>
<script>

export default {
    props: {
        field: String,
        dataItem: Object,
        format: String,
        className: String,
        columnIndex: Number,
        columnsCount: Number,
        rowType: String,
        level: Number,
        expanded: Boolean,
        editor: String
    },
    methods: {
        editHandler: function() {
            this.$emit('edit', {dataItem:this.dataItem});
        },
        removeHandler: function() {
            this.$emit('remove', {dataItem:this.dataItem});
        },
        addUpdateHandler: function() {
            this.$emit('save', {dataItem:this.dataItem});
        },
        cancelDiscardHandler: function() {
            this.$emit('cancel', {dataItem:this.dataItem});
        }
    }
}
</script>
<style scoped>
    .command--btns{
        white-space:nowrap;
        flex-wrap:nowrap;
    }

</style>