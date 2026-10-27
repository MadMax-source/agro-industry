'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Category, CategoryDeletionStrategy } from '@/types'
import { useAdminCatalog } from '@/contexts/admin-catalog-context'
import { SelectChevron, nativeSelectClass } from '@/components/admin/form-field'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface CategoryDeleteDialogProps {
  category: Category | null
  productCount: number
  onOpenChange: (open: boolean) => void
}

export function CategoryDeleteDialog({ category, productCount, onOpenChange }: CategoryDeleteDialogProps) {
  const { categories, deleteCategory } = useAdminCatalog()
  const [strategy, setStrategy] = useState<CategoryDeletionStrategy>({ type: 'unpublish' })
  const availableCategories = categories.filter((item) => item.id !== category?.id)
  const targetCategoryId = strategy.type === 'reassign' ? strategy.targetCategoryId : ''
  const canReassign = availableCategories.length > 0

  useEffect(() => {
    setStrategy({ type: 'unpublish' })
  }, [category?.id])

  const confirmDelete = async () => {
    if (!category) return

    if (strategy.type === 'reassign' && !availableCategories.some((item) => item.id === strategy.targetCategoryId)) {
      return
    }

    try {
      await deleteCategory(category.id, strategy)
      toast.success(
        productCount > 0 && strategy.type === 'unpublish'
          ? `Category deleted; ${productCount} products moved to drafts`
          : 'Category deleted',
      )
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete category.')
    }
  }

  return (
    <AlertDialog open={!!category} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this category?</AlertDialogTitle>
          <AlertDialogDescription>
            {productCount > 0
              ? `“${category?.name}” contains ${productCount} ${productCount === 1 ? 'product' : 'products'}. Products will not be deleted.`
              : `“${category?.name}” will be permanently removed. This cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {productCount > 0 && (
          <div className="flex flex-col gap-3">
            <label htmlFor="category-delete-strategy" className="text-sm font-medium">
              What should happen to its products?
            </label>
            <div className="relative">
              <select
                id="category-delete-strategy"
                value={strategy.type}
                onChange={(event) => {
                  if (event.target.value === 'reassign' && canReassign) {
                    setStrategy({ type: 'reassign', targetCategoryId: availableCategories[0].id })
                  } else {
                    setStrategy({ type: 'unpublish' })
                  }
                }}
                className={nativeSelectClass}
              >
                <option value="unpublish">Move products to drafts</option>
                {canReassign && <option value="reassign">Move products to another category</option>}
              </select>
              <SelectChevron />
            </div>

            {strategy.type === 'reassign' && (
              <>
                <label htmlFor="category-delete-target" className="text-sm font-medium">
                  Destination category
                </label>
                <div className="relative">
                  <select
                    id="category-delete-target"
                    value={targetCategoryId}
                    onChange={(event) =>
                      setStrategy({ type: 'reassign', targetCategoryId: event.target.value })
                    }
                    className={nativeSelectClass}
                  >
                    {availableCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
              </>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={confirmDelete}
            disabled={strategy.type === 'reassign' && !targetCategoryId}
          >
            Delete category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
