import { Template } from '../types';

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Modern Business',
    description: 'Clean and professional business template with hero section, features, and contact form',
    category: 'business',
    thumbnail: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-15',
    content: [
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          title: 'Transform Your Business Today',
          subtitle: 'We help companies grow with innovative solutions and expert guidance',
          buttonText: 'Get Started'
        },
        styles: {
          backgroundColor: '#1e40af',
          color: 'white',
          padding: '80px 20px'
        }
      },
      {
        id: 'features-1',
        type: 'features',
        content: {
          title: 'Why Choose Us',
          features: [
            { title: 'Expert Team', description: 'Skilled professionals with years of experience' },
            { title: 'Fast Delivery', description: 'Quick turnaround times without compromising quality' },
            { title: '24/7 Support', description: 'Round-the-clock assistance whenever you need it' }
          ]
        },
        styles: {
          backgroundColor: 'white',
          padding: '60px 20px'
        }
      }
    ]
  },
  {
    id: 'template-2',
    name: 'Creative Portfolio',
    description: 'Showcase your work with this stunning portfolio template featuring image galleries',
    category: 'portfolio',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-10',
    content: [
      {
        id: 'hero-2',
        type: 'hero',
        content: {
          title: 'Creative Designer',
          subtitle: 'Bringing ideas to life through thoughtful design and user experience',
          buttonText: 'View Portfolio'
        },
        styles: {
          backgroundColor: '#7c3aed',
          color: 'white',
          padding: '100px 20px'
        }
      }
    ]
  },
  {
    id: 'template-3',
    name: 'E-commerce Store',
    description: 'Complete online store template with product showcase and shopping features',
    category: 'ecommerce',
    thumbnail: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-08',
    content: [
      {
        id: 'hero-3',
        type: 'hero',
        content: {
          title: 'Premium Products',
          subtitle: 'Discover our curated collection of high-quality items',
          buttonText: 'Shop Now'
        },
        styles: {
          backgroundColor: '#059669',
          color: 'white',
          padding: '80px 20px'
        }
      }
    ]
  },
  {
    id: 'template-4',
    name: 'Tech Blog',
    description: 'Modern blog template perfect for sharing articles and insights',
    category: 'blog',
    thumbnail: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-05',
    content: [
      {
        id: 'hero-4',
        type: 'hero',
        content: {
          title: 'Tech Insights',
          subtitle: 'Latest trends and innovations in technology',
          buttonText: 'Read Articles'
        },
        styles: {
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '80px 20px'
        }
      }
    ]
  },
  {
    id: 'template-5',
    name: 'Landing Page Pro',
    description: 'High-converting landing page template with call-to-action sections',
    category: 'landing',
    thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-03',
    content: [
      {
        id: 'hero-5',
        type: 'hero',
        content: {
          title: 'Boost Your Conversions',
          subtitle: 'Professional landing pages that convert visitors into customers',
          buttonText: 'Start Free Trial'
        },
        styles: {
          backgroundColor: '#ea580c',
          color: 'white',
          padding: '100px 20px'
        }
      }
    ]
  },
  {
    id: 'template-6',
    name: 'Startup Launch',
    description: 'Perfect template for startup launches with team showcase and feature highlights',
    category: 'business',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-01',
    content: [
      {
        id: 'hero-6',
        type: 'hero',
        content: {
          title: 'Revolutionize Your Industry',
          subtitle: 'Innovative solutions for the modern world',
          buttonText: 'Join Waitlist'
        },
        styles: {
          backgroundColor: '#0891b2',
          color: 'white',
          padding: '120px 20px'
        }
      }
    ]
  }
];