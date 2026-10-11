import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ProjectType {
  id: string
  name: string
  basePrice: number
  description: string
}

export interface Feature {
  id: string
  name: string
  price: number
}

export interface DesignComplexity {
  id: string
  name: string
  multiplier: number
  description: string
}

export interface Timeline {
  id: string
  name: string
  multiplier: number
}

export interface AdditionalService {
  id: string
  name: string
  price: number
}

interface AdminStore {
  projectTypes: ProjectType[]
  features: Feature[]
  designComplexity: DesignComplexity[]
  timelines: Timeline[]
  additionalServices: AdditionalService[]

  // Project Types
  addProjectType: (projectType: Omit<ProjectType, "id">) => void
  updateProjectType: (id: string, projectType: Partial<ProjectType>) => void
  deleteProjectType: (id: string) => void

  // Features
  addFeature: (feature: Omit<Feature, "id">) => void
  updateFeature: (id: string, feature: Partial<Feature>) => void
  deleteFeature: (id: string) => void

  // Design Complexity
  addDesignComplexity: (complexity: Omit<DesignComplexity, "id">) => void
  updateDesignComplexity: (id: string, complexity: Partial<DesignComplexity>) => void
  deleteDesignComplexity: (id: string) => void

  // Timelines
  addTimeline: (timeline: Omit<Timeline, "id">) => void
  updateTimeline: (id: string, timeline: Partial<Timeline>) => void
  deleteTimeline: (id: string) => void

  // Additional Services
  addAdditionalService: (service: Omit<AdditionalService, "id">) => void
  updateAdditionalService: (id: string, service: Partial<AdditionalService>) => void
  deleteAdditionalService: (id: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      projectTypes: [
        { id: "landing", name: "Landing Page", basePrice: 1500, description: "Single page website" },
        { id: "business", name: "Business Website", basePrice: 3500, description: "5-10 pages" },
        { id: "ecommerce", name: "E-commerce", basePrice: 8000, description: "Online store" },
        { id: "custom", name: "Custom Web App", basePrice: 12000, description: "Complex functionality" },
      ],

      features: [
        { id: "contact-form", name: "Contact Form", price: 300 },
        { id: "cms", name: "Content Management System", price: 1200 },
        { id: "blog", name: "Blog/News Section", price: 800 },
        { id: "gallery", name: "Photo Gallery", price: 500 },
        { id: "booking", name: "Online Booking System", price: 2000 },
        { id: "payment", name: "Payment Integration", price: 1500 },
        { id: "membership", name: "User Registration/Login", price: 1800 },
        { id: "multilingual", name: "Multi-language Support", price: 1000 },
        { id: "analytics", name: "Analytics Integration", price: 200 },
        { id: "social", name: "Social Media Integration", price: 300 },
      ],

      designComplexity: [
        { id: "basic", name: "Basic", multiplier: 1, description: "Clean, simple design" },
        { id: "standard", name: "Standard", multiplier: 1.3, description: "Custom design elements" },
        { id: "premium", name: "Premium", multiplier: 1.7, description: "Complex animations & interactions" },
      ],

      timelines: [
        { id: "standard", name: "Standard (4-6 weeks)", multiplier: 1 },
        { id: "rush", name: "Rush (2-3 weeks)", multiplier: 1.5 },
        { id: "urgent", name: "Urgent (1 week)", multiplier: 2 },
      ],

      additionalServices: [
        { id: "seo", name: "SEO Optimization", price: 800 },
        { id: "hosting", name: "Hosting Setup (1 year)", price: 300 },
        { id: "maintenance", name: "Maintenance (6 months)", price: 1200 },
        { id: "training", name: "Content Management Training", price: 500 },
        { id: "copywriting", name: "Professional Copywriting", price: 1000 },
        { id: "photography", name: "Professional Photography", price: 1500 },
      ],

      // Project Types Actions
      addProjectType: (projectType) => {
        set((state) => ({
          projectTypes: [...state.projectTypes, { ...projectType, id: generateId() }],
        }))
      },

      updateProjectType: (id, updates) => {
        set((state) => ({
          projectTypes: state.projectTypes.map((pt) => (pt.id === id ? { ...pt, ...updates } : pt)),
        }))
      },

      deleteProjectType: (id) => {
        set((state) => ({
          projectTypes: state.projectTypes.filter((pt) => pt.id !== id),
        }))
      },

      // Features Actions
      addFeature: (feature) => {
        set((state) => ({
          features: [...state.features, { ...feature, id: generateId() }],
        }))
      },

      updateFeature: (id, updates) => {
        set((state) => ({
          features: state.features.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }))
      },

      deleteFeature: (id) => {
        set((state) => ({
          features: state.features.filter((f) => f.id !== id),
        }))
      },

      // Design Complexity Actions
      addDesignComplexity: (complexity) => {
        set((state) => ({
          designComplexity: [...state.designComplexity, { ...complexity, id: generateId() }],
        }))
      },

      updateDesignComplexity: (id, updates) => {
        set((state) => ({
          designComplexity: state.designComplexity.map((dc) => (dc.id === id ? { ...dc, ...updates } : dc)),
        }))
      },

      deleteDesignComplexity: (id) => {
        set((state) => ({
          designComplexity: state.designComplexity.filter((dc) => dc.id !== id),
        }))
      },

      // Timeline Actions
      addTimeline: (timeline) => {
        set((state) => ({
          timelines: [...state.timelines, { ...timeline, id: generateId() }],
        }))
      },

      updateTimeline: (id, updates) => {
        set((state) => ({
          timelines: state.timelines.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }))
      },

      deleteTimeline: (id) => {
        set((state) => ({
          timelines: state.timelines.filter((t) => t.id !== id),
        }))
      },

      // Additional Services Actions
      addAdditionalService: (service) => {
        set((state) => ({
          additionalServices: [...state.additionalServices, { ...service, id: generateId() }],
        }))
      },

      updateAdditionalService: (id, updates) => {
        set((state) => ({
          additionalServices: state.additionalServices.map((as) => (as.id === id ? { ...as, ...updates } : as)),
        }))
      },

      deleteAdditionalService: (id) => {
        set((state) => ({
          additionalServices: state.additionalServices.filter((as) => as.id !== id),
        }))
      },
    }),
    {
      name: "admin-store",
    },
  ),
)
