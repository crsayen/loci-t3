const handleDeleteItem = async (id: string, name: string) => {
  setItemToDelete({ id, name })
  setConfirmDeleteOpen(true)
}

const handleConfirm = (confirmed: boolean) => {
  const { id } = itemToDelete as { id: string }
  setConfirmDeleteOpen(false)
  setItemToDelete(undefined)
  setFilteredItems(undefined)
  if (!confirmed) return
  deleteItemMutation.mutate({ itemId: id })
}
