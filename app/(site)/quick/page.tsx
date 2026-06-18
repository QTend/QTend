'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FolderPlus, ArrowLeft, Loader2, Tag } from 'lucide-react'
import Link from 'next/link'

interface CategoryItem {
  _id: string
  name: string
  description?: string
  createdAt: string
}

const CreateCategoryPage = () => {
  const router = useRouter()
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  
  // New States for fetching categories
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [fetching, setFetching] = useState(true)

  const isButtonDisabled = !categoryName || loading

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories/create')
        const data = await res.json()
        if (res.ok && data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setFetching(false)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Fixed endpoint structure to match your route.ts location
      const res = await fetch('/api/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, description }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to create category')
        return
      }

      alert('Category created successfully!')
      
      // Instantly inject new item to state list layout
      if (data.data) {
        setCategories((prev) => [data.data, ...prev])
      }

      setCategoryName('')
      setDescription('')
    } catch (error) {
      console.error('Error creating category:', error)
      alert('A network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Changed grid setup to handle side-by-side or stacked spacing comfortably
    <section className="flex flex-col md:flex-row justify-center items-start gap-6 min-h-screen bg-transparent p-4 max-w-4xl mx-auto items-center">
      
      {/* Box 1: The Form */}
      <div className="bg-white p-6 sm:p-8 w-full max-w-md rounded-xl shadow-sm border border-gray-100">
        <div className="bg-[#68A544] w-16 h-16 flex justify-center items-center rounded-xl mx-auto mb-4">
          <FolderPlus color="#ffffff" size={24} />
        </div>
        <h5 className="text-2xl font-medium text-center text-gray-900">Create New Category</h5>
        <p className="text-center text-sm text-gray-500 mt-1">Organize your store or business offerings</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid gap-2">
            <label className="font-medium text-sm text-gray-700">Category Name *</label>
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Electronics, Services"
              className="px-3 py-2 focus:outline-none border-gray-300 border rounded-xl text-sm focus:ring-2 focus:ring-[#68A544]/20 focus:border-[#68A544]"
            />
          </div>

          <div className="grid gap-2">
            <label className="font-medium text-sm text-gray-700">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about this category"
              rows={3}
              className="px-3 py-2 focus:outline-none border-gray-300 border rounded-xl text-sm focus:ring-2 focus:ring-[#68A544]/20 focus:border-[#68A544] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full mt-2 py-2.5 rounded-xl font-medium text-sm text-white transition-all ${
              isButtonDisabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#68A544] hover:bg-[#578d37] active:scale-[0.98]'
            }`}
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-sm font-medium text-[#f67d26] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Box 2: Categories Display List */}
      <div className="bg-white p-6 sm:p-8 w-full max-w-md rounded-xl shadow-sm border border-gray-100 self-stretch max-h-[530px] flex flex-col">
        <h6 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Tag size={18} className="text-[#68A544]" />
          Existing Categories ({categories.length})
        </h6>
        
        <div className="mt-4 overflow-y-auto flex-1 pr-1 space-y-3">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <Loader2 className="animate-spin text-[#68A544]" size={24} />
              <p className="text-xs">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
              No categories created yet.
            </div>
          ) : (
            categories.map((cat) => (
              <div 
                key={cat._id} 
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl transition-all hover:bg-gray-100"
              >
                <p className="font-semibold text-sm text-gray-800 capitalize">{cat.name}</p>
                {cat.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{cat.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </section>
  )
}

export default CreateCategoryPage
