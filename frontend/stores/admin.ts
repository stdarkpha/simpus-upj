const config = useRuntimeConfig()
const { token } = useAuth()
export const useAdminStore = defineStore("admin", () => {
  const data_users = ref([])
  const data_books = ref([])
  const data_books_category = ref<any>([])

  const fetchUserData = async () => {
    await useFetch(`${config.public.API_URL}user/list`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Accept": "application/json",
      },
      onResponse: ({ response }) => {
        if (response._data.success) {
          data_users.value = response._data.data
        } else {
          console.error("Failed to fetch user data:", response.statusText)
        }
      },
    })
  }

  const fetchUserDetails = async (user_id: number) => {
    const { data } = await useFetch(`${config.public.API_URL}user/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Accept": "application/json",
      },
    })
    return data.value
  }

  const fetchBooks = async (paginate: number) => {
    const { data } = await useFetch<any>(`${config.public.API_URL}books`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Accept": "application/json",
      },
      params: {
        paginate: paginate,
      }
    })
    data_books.value = data.value?.data?.data
  }

  const fetchBooksCategory = async () => {
    const { data } = await useFetch<any>(`${config.public.API_URL}categories`)
    data_books_category.value = data.value?.data
  }

  const fetchBooksCategoryDetails = async (category_id: number) => {
    const { data } = await useFetch<any>(`${config.public.API_URL}categories/${category_id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Accept": "application/json",
      },
    })
    return data.value
  }

  const fetchBookDetails = async (book_id: number) => {
    const { data } = await useFetch(`${config.public.API_URL}books/detail/${book_id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Accept": "application/json",
      },
    })
    return data.value
  }

  return {
    data_users,
    data_books,
    data_books_category,

    fetchUserData,
    fetchUserDetails,

    fetchBooks,
    fetchBookDetails,
    fetchBooksCategory,
    fetchBooksCategoryDetails,
  }
});