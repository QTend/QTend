export const fetchMenuItems = async({
  branchId, 
  categoryId, 
  q,
  page = 1,    // NEW: Default to page 1
  limit = 10   // NEW: Default to 10 items per page
}: {
  branchId: string; 
  categoryId?: string; 
  q?: string;
  page?: number;
  limit?: number;
}) => {
  // Use URLSearchParams for cleaner URL building
  const params = new URLSearchParams();
  
  if (categoryId) params.append("categoryId", categoryId);
  if (q) params.append("q", q);
  
  // --- Append pagination params ---
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const queryString = params.toString();
  const url = `/api/user-admin/${branchId}/menu/item${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch menu items: ${res.status}`);
  }

  const data = await res.json();
  console.log(data)
  // Expected return: { items: [...], totalPages: number, currentPage: number }
  return data;
}