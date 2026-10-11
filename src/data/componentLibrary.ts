import { ComponentType } from '../types';

export const componentLibrary: ComponentType[] = [
  {
    id: 'text',
    name: 'Text',
    icon: 'Type',
    category: 'basic',
    defaultProps: {
      id: '',
      type: 'text',
      content: { text: 'Add your text here...' },
      styles: {
        fontSize: '16px',
        color: '#000000',
        padding: '16px',
        textAlign: 'left'
      }
    }
  },
  {
    id: 'image',
    name: 'Image',
    icon: 'Image',
    category: 'media',
    defaultProps: {
      id: '',
      type: 'image',
      content: { 
        src: 'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Placeholder image'
      },
      styles: {
        width: '100%',
        height: '200px',
        borderRadius: '8px',
        margin: '16px 0'
      }
    }
  },
  {
    id: 'button',
    name: 'Button',
    icon: 'MousePointer',
    category: 'interactive',
    defaultProps: {
      id: '',
      type: 'button',
      content: { text: 'Click me' },
      styles: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '500',
        margin: '16px 0'
      }
    }
  },
  {
    id: 'container',
    name: 'Container',
    icon: 'Square',
    category: 'layout',
    defaultProps: {
      id: '',
      type: 'container',
      content: {},
      styles: {
        backgroundColor: '#f9fafb',
        padding: '32px',
        borderRadius: '12px',
        margin: '16px 0',
        border: '1px solid #e5e7eb',
        display: 'block'
      },
      children: []
    }
  },
  {
    id: 'hero',
    name: 'Hero Section',
    icon: 'Layout',
    category: 'sections',
    defaultProps: {
      id: '',
      type: 'hero',
      content: {
        title: 'Your Amazing Headline',
        subtitle: 'A compelling subtitle that explains your value proposition',
        buttonText: 'Get Started'
      },
      styles: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  },
  {
    id: 'features',
    name: 'Features Grid',
    icon: 'Star',
    category: 'sections',
    defaultProps: {
      id: '',
      type: 'features',
      content: {
        title: 'Our Features',
        features: [
          { title: 'Feature 1', description: 'Description of feature 1' },
          { title: 'Feature 2', description: 'Description of feature 2' },
          { title: 'Feature 3', description: 'Description of feature 3' }
        ]
      },
      styles: {
        backgroundColor: 'white',
        padding: '60px 20px',
        display: 'block'
      }
    }
  }
];