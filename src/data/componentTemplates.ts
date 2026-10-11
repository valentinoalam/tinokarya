import { ComponentTemplate } from '../types';

export const componentTemplates: ComponentTemplate[] = [
  {
    id: 'hero-modern',
    name: 'Modern Hero',
    description: 'Clean hero section with centered content and call-to-action',
    category: 'hero',
    thumbnail: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400',
    elements: [
      {
        id: 'hero-container',
        type: 'container',
        content: {},
        styles: {
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 20px',
          textAlign: 'center',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px'
        },
        children: [
          {
            id: 'hero-title',
            type: 'text',
            content: { text: 'Build Amazing Websites' },
            styles: {
              fontSize: '48px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              textAlign: 'center'
            }
          },
          {
            id: 'hero-subtitle',
            type: 'text',
            content: { text: 'Create stunning web experiences with our powerful drag-and-drop builder' },
            styles: {
              fontSize: '20px',
              margin: '0 0 30px 0',
              opacity: '0.9',
              textAlign: 'center'
            }
          },
          {
            id: 'hero-button',
            type: 'button',
            content: { text: 'Get Started Free' },
            styles: {
              backgroundColor: '#ffffff',
              color: '#667eea',
              padding: '15px 30px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'features-grid',
    name: 'Features Grid',
    description: '3-column feature showcase with icons and descriptions',
    category: 'features',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    elements: [
      {
        id: 'features-container',
        type: 'container',
        content: {},
        styles: {
          backgroundColor: '#ffffff',
          padding: '80px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        },
        children: [
          {
            id: 'features-title',
            type: 'text',
            content: { text: 'Why Choose Us' },
            styles: {
              fontSize: '36px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '0 0 50px 0',
              color: '#1f2937'
            }
          },
          {
            id: 'features-grid',
            type: 'container',
            content: {},
            styles: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              width: '100%'
            },
            children: [
              {
                id: 'feature-1',
                type: 'container',
                content: {},
                styles: {
                  textAlign: 'center',
                  padding: '30px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                },
                children: [
                  {
                    id: 'feature-1-icon',
                    type: 'text',
                    content: { text: '🚀' },
                    styles: {
                      fontSize: '48px',
                      margin: '0 0 20px 0'
                    }
                  },
                  {
                    id: 'feature-1-title',
                    type: 'text',
                    content: { text: 'Fast Performance' },
                    styles: {
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 15px 0',
                      color: '#1f2937'
                    }
                  },
                  {
                    id: 'feature-1-desc',
                    type: 'text',
                    content: { text: 'Lightning-fast loading times and optimized performance for the best user experience.' },
                    styles: {
                      fontSize: '16px',
                      color: '#6b7280'
                    }
                  }
                ]
              },
              {
                id: 'feature-2',
                type: 'container',
                content: {},
                styles: {
                  textAlign: 'center',
                  padding: '30px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                },
                children: [
                  {
                    id: 'feature-2-icon',
                    type: 'text',
                    content: { text: '🎨' },
                    styles: {
                      fontSize: '48px',
                      margin: '0 0 20px 0'
                    }
                  },
                  {
                    id: 'feature-2-title',
                    type: 'text',
                    content: { text: 'Beautiful Design' },
                    styles: {
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 15px 0',
                      color: '#1f2937'
                    }
                  },
                  {
                    id: 'feature-2-desc',
                    type: 'text',
                    content: { text: 'Stunning, modern designs that captivate your audience and drive engagement.' },
                    styles: {
                      fontSize: '16px',
                      color: '#6b7280'
                    }
                  }
                ]
              },
              {
                id: 'feature-3',
                type: 'container',
                content: {},
                styles: {
                  textAlign: 'center',
                  padding: '30px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0'
                },
                children: [
                  {
                    id: 'feature-3-icon',
                    type: 'text',
                    content: { text: '🔧' },
                    styles: {
                      fontSize: '48px',
                      margin: '0 0 20px 0'
                    }
                  },
                  {
                    id: 'feature-3-title',
                    type: 'text',
                    content: { text: 'Easy to Use' },
                    styles: {
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 15px 0',
                      color: '#1f2937'
                    }
                  },
                  {
                    id: 'feature-3-desc',
                    type: 'text',
                    content: { text: 'Intuitive drag-and-drop interface that makes building websites effortless.' },
                    styles: {
                      fontSize: '16px',
                      color: '#6b7280'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];