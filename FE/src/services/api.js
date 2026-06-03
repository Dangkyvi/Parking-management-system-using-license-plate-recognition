
const BASE_URL = "http://127.0.0.1:8000"

export const uploadImage = async (formData) => {
  const response = await fetch(
    `${BASE_URL}/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  return await response.json()
}

export const getHistory = async () => {
  const response = await fetch(
    `${BASE_URL}/history`
  )

  return await response.json()
}

export const searchHistory = async (keyword) => {
  const response = await fetch(
    `${BASE_URL}/history/search?q=${encodeURIComponent(keyword)}`
  )

  return await response.json()
}