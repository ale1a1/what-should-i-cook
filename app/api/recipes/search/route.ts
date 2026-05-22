import { NextRequest, NextResponse } from "next/server"

const FORWARDED_PARAMS = new Set([
  "maxReadyTime",
  "minReadyTime",
  "diet",
  "cuisine",
  "maxPricePerServing",
  "minPricePerServing",
  "minHealthScore",
  "maxHealthScore",
  "minSweetness",
  "minSaltiness",
  "minSpiciness",
  "minSavoriness",
  "includeIngredients",
  "query",
  "sort",
  "number",
  "offset",
])

export async function GET(request: NextRequest) {
  const apiKey = process.env.SPOONACULAR_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const params = new URLSearchParams({ apiKey, addRecipeInformation: "true" })

  if (!searchParams.has("number")) params.set("number", "24")
  if (!searchParams.has("offset")) params.set("offset", "0")

  for (const [key, value] of searchParams.entries()) {
    if (FORWARDED_PARAMS.has(key)) {
      params.set(key, value)
    }
  }

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}
