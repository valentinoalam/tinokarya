"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import pricingContent from "@/data/pricing-content.json"

// JSON structure types
type PriceRange = {
  min: number
  max: number
}

type JsonAddon = {
  id: string
  name: string
  price?: number
  priceRange?: PriceRange
  details: string
  note?: string
  unit?: string
}

type JsonPackage = {
  id: string
  name: string
  description: string
  basePrice: number
  duration?: string
  active: boolean
  images: string[]
  previewUrl: string
  features: string[]
}

type JsonFeature = {
  id: string
  name: string
  price: number
}

type JsonComplexity = {
  id: string
  name: string
  description: string
  multiplier: number
}

type JsonTimeline = {
  id: string
  name: string
  multiplier: number
}

type JsonAdditionalService = {
  id: string
  name: string
  price: number
}

type JsonDiscount = {
  id: string
  name: string
  percentage: number
}

type JsonMonthlyService = {
  id: string
  name: string
  price: number
  features: string[]
  details: string
}

type JsonAddonCategories = {
  customization: JsonAddon[]
  design: JsonAddon[]
  support: JsonAddon[]
  communication: JsonAddon[]
  extended: JsonAddon[]
  ecommerce: JsonAddon[]
}

type PricingContentType = {
  packages: JsonPackage[]
  features: JsonFeature[]
  designComplexity: JsonComplexity[]
  timelines: JsonTimeline[]
  additionalServices: JsonAdditionalService[]
  discounts: JsonDiscount[]
  monthlyServices: JsonMonthlyService
  addons: JsonAddonCategories
  notes: string[]
  revisionCost: {
    min: number
    max: number
    unit: string
  }
  currency?: string
}

const typedPricingContent = pricingContent as PricingContentType

// Currency configuration - unified type
export type CurrencyCode = "IDR" | "USD" | "EUR" | "GBP" | "SGD" | "AUD"

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  IDR: 'Rp',
  SGD: 'S$',
  AUD: 'A$'
}

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  IDR: 'Indonesian Rupiah',
  SGD: 'Singapore Dollar',
  AUD: 'Australian Dollar'
}

// Exchange rates (base: IDR)
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  IDR: 1,
  USD: 0.000063,
  EUR: 0.000058,
  GBP: 0.000050,
  SGD: 0.000085,
  AUD: 0.000095
}

const defaultCurrency: CurrencyCode =
  typeof typedPricingContent?.currency === "string" && 
  typedPricingContent.currency.toUpperCase() === "IDR"
    ? "IDR"
    : "IDR"

function convertFromIDR(amountInIDR: number, code: CurrencyCode, rates: Record<CurrencyCode, number>) {
  const rate = rates[code] ?? 1
  return Math.round(amountInIDR * rate)
}

function formatCurrencyIntl(amount: number, code: CurrencyCode) {
  try {
    const minimumFractionDigits = code === "IDR" ? 0 : 2
    const maximumFractionDigits = code === "IDR" ? 0 : 2
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
  } catch {
    return `${CURRENCY_SYMBOLS[code] ?? ""}${amount.toLocaleString()}`
  }
}

// Store types
export type ProjectType = {
  id: string
  name: string
  description: string
  basePrice: number
}

export type Feature = { 
  id: string
  name: string
  price: number 
}

export type Complexity = { 
  id: string
  name: string
  description: string
  multiplier: number 
}

export type Timeline = { 
  id: string
  name: string
  multiplier: number 
}

export type AdditionalService = { 
  id: string
  name: string
  price: number 
}

export type Discount = { 
  id: string
  name: string
  percentage: number 
}

type AddonsByCategory = Record<string, string[]>

// Map JSON data to store types
export const projectTypes: ProjectType[] = typedPricingContent.packages.map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  basePrice: p.basePrice,
}))

export const features: Feature[] = typedPricingContent.features.map((f) => ({
  id: f.id,
  name: f.name,
  price: f.price,
}))

export const designComplexity: Complexity[] = typedPricingContent.designComplexity.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  multiplier: d.multiplier,
}))

export const timelines: Timeline[] = typedPricingContent.timelines.map((t) => ({
  id: t.id,
  name: t.name,
  multiplier: t.multiplier,
}))

export const additionalServices: AdditionalService[] = typedPricingContent.additionalServices.map((s) => ({
  id: s.id,
  name: s.name,
  price: s.price,
}))

export const discounts: Discount[] = typedPricingContent.discounts.map((d) => ({
  id: d.id,
  name: d.name,
  percentage: d.percentage,
}))

export const monthlyService = typedPricingContent.monthlyServices
export const addonsCatalog = typedPricingContent.addons

type ClientInfo = {
  name: string
  company: string
  email: string
  phone: string
  projectDescription: string
}

type Quote = {
  projectType: ProjectType["id"] | ""
  pages: number
  designComplexity: Complexity["id"] | ""
  timeline: Timeline["id"] | ""
  features: string[]
  additionalServices: string[]
  selectedDiscountId?: string
  discountCode?: string
  selectedAddons: AddonsByCategory
  monthlyServiceSelected?: boolean
  clientInfo: ClientInfo
}

const initialQuote: Quote = {
  projectType: "",
  pages: 5,
  designComplexity: "",
  timeline: "",
  features: [],
  additionalServices: [],
  selectedDiscountId: undefined,
  discountCode: undefined,
  selectedAddons: {},
  monthlyServiceSelected: false,
  clientInfo: {
    name: "",
    company: "",
    email: "",
    phone: "",
    projectDescription: "",
  }
}

function validateDiscountCode(code: string): Discount | null {
  if (!code || typeof code !== 'string') return null
  
  const normalizedCode = code.trim().toUpperCase()
  
  // Find discount by matching the code against discount IDs (converted to uppercase)
  const discount = discounts.find(
    (d) => d.id.toUpperCase() === normalizedCode || 
           d.name.toUpperCase() === normalizedCode
  )
  
  return discount || null
}

function getAddonPrice(addon: JsonAddon | undefined): number {
  if (!addon) return 0
  if (typeof addon.price === "number") return addon.price
  if (addon.priceRange && typeof addon.priceRange.min === "number") return addon.priceRange.min
  return 0
}

function calcTotal(quote: Quote) {
  let total = 0

  // Base price
  const type = projectTypes.find((t) => t.id === quote.projectType)
  if (type) total += type.basePrice

  // Extra pages for business sites (first 5 included)
  if (quote.projectType === "business" && quote.pages > 5) {
    total += (quote.pages - 5) * 400
  }

  // Features
  const featuresTotal = quote.features.reduce((sum, id) => {
    const f = features.find((x) => x.id === id)
    return sum + (f?.price || 0)
  }, 0)
  total += featuresTotal

  // Legacy additional services
  const servicesTotalBefore = quote.additionalServices.reduce((sum, id) => {
    const s = additionalServices.find((x) => x.id === id)
    return sum + (s?.price || 0)
  }, 0)
  const legacyDiscount = quote.additionalServices.length >= 3 ? Math.round(servicesTotalBefore * 0.1) : 0
  const servicesTotal = servicesTotalBefore - legacyDiscount
  total += servicesTotal

  // Addons
  const addonsTotal = Object.entries(quote.selectedAddons || {}).reduce((sum, [cat, ids]) => {
    const list = addonsCatalog[cat as keyof JsonAddonCategories] || []
    const catSum = (ids || []).reduce((s, aid) => {
      const item = list.find((x) => String(x.id) === String(aid))
      return s + getAddonPrice(item)
    }, 0)
    return sum + catSum
  }, 0)
  total += addonsTotal

  // Multipliers
  const complexity = designComplexity.find((d) => d.id === quote.designComplexity)?.multiplier || 1
  const speed = timelines.find((t) => t.id === quote.timeline)?.multiplier || 1
  total = Math.round(total * complexity * speed)

  // Discount
  const discountPct = discounts.find((d) => d.id === quote.selectedDiscountId)?.percentage || 0
  if (discountPct > 0) {
    total = Math.round(total * (1 - discountPct))
  }

  return total
}

type QuoteStore = {
  quote: Quote
  totalPrice: number
  totalMonthly: number
  draftSavedAt?: string
  dialogOpen: boolean
  initialProjectTypeId?: string
  currencyCode: CurrencyCode
  rates: Record<CurrencyCode, number>
  discountError?: string
  // actions
  updateProjectType: (id: Quote["projectType"]) => void
  updatePages: (pages: number) => void
  updateDesignComplexity: (id: Quote["designComplexity"]) => void
  updateTimeline: (id: Quote["timeline"]) => void
  toggleFeature: (id: string) => void
  toggleAdditionalService: (id: string) => void
  setDiscount: (id?: string) => void
  applyDiscountCode: (code: string) => boolean  // NEW
  removeDiscountCode: () => void  // NEW
  toggleAddon: (category: string, id: string) => void
  toggleMonthlyService: (on: boolean) => void
  updateClientInfo: <K extends keyof ClientInfo>(key: K, value: ClientInfo[K]) => void
  setCurrency: (code: CurrencyCode) => void
  formatAmount: (amountInIDR: number) => string
  resetQuote: () => void
  saveDraft: () => void
  openDialogWithType: (id?: string) => void
  closeDialog: () => void
  setDialogOpen: (open: boolean) => void
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quote: initialQuote,
      totalPrice: 0,
      totalMonthly: 0,
      draftSavedAt: undefined,
      dialogOpen: false,
      initialProjectTypeId: undefined,
      currencyCode: defaultCurrency,
      rates: EXCHANGE_RATES,
      discountError: undefined,

      updateProjectType: (id) =>
        set((state) => {
          const quote = { ...state.quote, projectType: id }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      updatePages: (pages) =>
        set((state) => {
          const quote = { ...state.quote, pages: Math.max(1, pages) }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      updateDesignComplexity: (id) =>
        set((state) => {
          const quote = { ...state.quote, designComplexity: id }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      updateTimeline: (id) =>
        set((state) => {
          const quote = { ...state.quote, timeline: id }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      toggleFeature: (id) =>
        set((state) => {
          const exists = state.quote.features.includes(id)
          const featuresNext = exists ? state.quote.features.filter((f) => f !== id) : [...state.quote.features, id]
          const quote = { ...state.quote, features: featuresNext }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      toggleAdditionalService: (id) =>
        set((state) => {
          const exists = state.quote.additionalServices.includes(id)
          const servicesNext = exists
            ? state.quote.additionalServices.filter((s) => s !== id)
            : [...state.quote.additionalServices, id]
          const quote = { ...state.quote, additionalServices: servicesNext }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      setDiscount: (id) =>
        set((state) => {
          const quote = { ...state.quote, selectedDiscountId: id }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      toggleAddon: (category, id) =>
        set((state) => {
          const current = state.quote.selectedAddons[category] || []
          const exists = current.includes(id)
          const nextIds = exists ? current.filter((x) => x !== id) : [...current, id]
          const selectedAddons = { ...state.quote.selectedAddons, [category]: nextIds }
          const quote = { ...state.quote, selectedAddons }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      toggleMonthlyService: (on) =>
        set((state) => {
          const quote = { ...state.quote, monthlyServiceSelected: on }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase = on && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          return { quote, totalPrice, totalMonthly }
        }),

      updateClientInfo: (key, value) =>
        set((state) => {
          const quote = { ...state.quote, clientInfo: { ...state.quote.clientInfo, [key]: value } }
          return { quote }
        }),

      setCurrency: (code) =>
        set((state) => {
          const base = calcTotal(state.quote)
          const totalPrice = convertFromIDR(base, code, state.rates)
          const monthlyBase =
            state.quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, code, state.rates)
          return { currencyCode: code, totalPrice, totalMonthly }
        }),

      formatAmount: (amountInIDR: number) => {
        const { currencyCode, rates } = get()
        const converted = convertFromIDR(amountInIDR, currencyCode, rates)
        return formatCurrencyIntl(converted, currencyCode)
      },

      applyDiscountCode: (code: string) => {
        const discount = validateDiscountCode(code)
        
        if (!discount) {
          set({ discountError: "Invalid discount code" })
          return false
        }

        set((state) => {
          const quote = { 
            ...state.quote, 
            selectedDiscountId: discount.id,
            discountCode: code.trim().toUpperCase()
          }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          
          return { 
            quote, 
            totalPrice, 
            totalMonthly,
            discountError: undefined  // Clear error on success
          }
        })
        
        return true
      },

      // NEW: Remove discount code
      removeDiscountCode: () =>
        set((state) => {
          const quote = { 
            ...state.quote, 
            selectedDiscountId: undefined,
            discountCode: undefined
          }
          const base = calcTotal(quote)
          const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
          const monthlyBase =
            quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
          const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
          
          return { 
            quote, 
            totalPrice, 
            totalMonthly,
            discountError: undefined
          }
        }),
      resetQuote: () =>
        set({
          quote: initialQuote,
          totalPrice: 0,
          totalMonthly: 0,
          draftSavedAt: undefined,
          dialogOpen: false,
          initialProjectTypeId: undefined,
          currencyCode: defaultCurrency,
          rates: EXCHANGE_RATES,
          discountError: undefined,
        }),

      saveDraft: () => set(() => ({ draftSavedAt: new Date().toISOString() })),

      openDialogWithType: (id) =>
        set((state) => {
          const next = { dialogOpen: true, initialProjectTypeId: id }
          if (id) {
            const quote = { ...state.quote, projectType: id }
            const base = calcTotal(quote)
            const totalPrice = convertFromIDR(base, state.currencyCode, state.rates)
            const monthlyBase =
              quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
            const totalMonthly = convertFromIDR(monthlyBase, state.currencyCode, state.rates)
            return {
              ...next,
              quote,
              totalPrice,
              totalMonthly,
            }
          }
          return next
        }),

      closeDialog: () => set({ dialogOpen: false }),

      setDialogOpen: (open) => set({ dialogOpen: open }),
    }),
    {
      name: "quote-calculator-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        quote: state.quote,
        totalPrice: state.totalPrice,
        totalMonthly: state.totalMonthly,
        draftSavedAt: state.draftSavedAt,
        currencyCode: state.currencyCode,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const base = calcTotal(state.quote)
        const code = state.currencyCode ?? defaultCurrency
        const rates = state.rates ?? EXCHANGE_RATES
        state.totalPrice = convertFromIDR(base, code, rates)
        const monthlyBase = state.quote.monthlyServiceSelected && monthlyService ? Number(monthlyService.price ?? 0) : 0
        state.totalMonthly = convertFromIDR(monthlyBase, code, rates)
      },
    },
  ),
)