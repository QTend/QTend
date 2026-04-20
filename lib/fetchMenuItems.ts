export const fetchMenuItems = async({branchId, categoryId}: {branchId: string; categoryId?: string}) => {
  // Build the URL dynamically
  let url = `/api/user-admin/menu/${branchId}/item`;
  
  // Only add the query param if categoryId is truthy
  if (categoryId) {
    url += `?categoryId=${categoryId}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch menu items: ${res.status}`);
  }

  const data = await res.json();
  return data;
}