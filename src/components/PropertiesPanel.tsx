/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PageElement } from '@/types';
import { Settings, Palette, Type as TypeIcon, Layout, Move, Grid3X3 } from 'lucide-react';

interface PropertiesPanelProps {
  element: PageElement;
  onElementUpdate: (element: PageElement) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onElementUpdate }) => {
  const handleStyleChange = (property: string, value: string) => {
    const updatedElement = {
      ...element,
      styles: {
        ...element.styles,
        [property]: value
      }
    };
    onElementUpdate(updatedElement);
  };

  const handleContentChange = (property: string, value: any) => {
    const updatedElement = {
      ...element,
      content: {
        ...element.content,
        [property]: value
      }
    };
    onElementUpdate(updatedElement);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Properties
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Content Settings */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TypeIcon className="w-4 h-4" />
            Content
          </h3>
          
          {element.type === 'text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <textarea
                  value={element.content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          )}

          {element.type === 'button' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={element.content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {element.type === 'image' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={element.content.src || ''}
                  onChange={(e) => handleContentChange('src', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={element.content.alt || ''}
                  onChange={(e) => handleContentChange('alt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Style Settings */}
        <div className="p-4 border-b border-gray-200 max-h-96 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.styles.backgroundColor || ''}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.styles.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.styles.color || ''}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <select
                value={element.styles.fontSize || '16px'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
                <option value="48px">48px</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
              <select
                value={element.styles.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
              <select
                value={element.styles.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
              <input
                type="text"
                value={element.styles.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                placeholder="e.g., 8px"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border</label>
              <input
                type="text"
                value={element.styles.border || ''}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                placeholder="e.g., 1px solid #ccc"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Box Shadow</label>
              <input
                type="text"
                value={element.styles.boxShadow || ''}
                onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                placeholder="e.g., 0 4px 6px rgba(0,0,0,0.1)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={element.styles.opacity || '1'}
                onChange={(e) => handleStyleChange('opacity', e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{element.styles.opacity || '1'}</div>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Layout
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display</label>
              <select
                value={element.styles.display || 'block'}
                onChange={(e) => handleStyleChange('display', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="block">Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="inline-block">Inline Block</option>
                <option value="inline-flex">Inline Flex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <input
                type="text"
                value={element.styles.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                placeholder="e.g., 100%, 300px, auto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input
                type="text"
                value={element.styles.height || ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                placeholder="e.g., 200px, auto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
              <input
                type="text"
                value={element.styles.padding || ''}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                placeholder="e.g., 16px or 1rem"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
              <input
                type="text"
                value={element.styles.margin || ''}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                placeholder="e.g., 16px or 1rem"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={element.styles.position || 'static'}
                onChange={(e) => handleStyleChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="static">Static</option>
                <option value="relative">Relative</option>
                <option value="absolute">Absolute</option>
                <option value="fixed">Fixed</option>
                <option value="sticky">Sticky</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flexbox Settings */}
        {element.styles.display === 'flex' && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Move className="w-4 h-4" />
              Flexbox
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flex Direction</label>
                <select
                  value={element.styles.flexDirection || 'row'}
                  onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                  <option value="row-reverse">Row Reverse</option>
                  <option value="column-reverse">Column Reverse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justify Content</label>
                <select
                  value={element.styles.justifyContent || 'flex-start'}
                  onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="flex-start">Flex Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">Flex End</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                  <option value="space-evenly">Space Evenly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Align Items</label>
                <select
                  value={element.styles.alignItems || 'stretch'}
                  onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="flex-start">Flex Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">Flex End</option>
                  <option value="stretch">Stretch</option>
                  <option value="baseline">Baseline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flex Wrap</label>
                <select
                  value={element.styles.flexWrap || 'nowrap'}
                  onChange={(e) => handleStyleChange('flexWrap', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="nowrap">No Wrap</option>
                  <option value="wrap">Wrap</option>
                  <option value="wrap-reverse">Wrap Reverse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gap</label>
                <input
                  type="text"
                  value={element.styles.gap || ''}
                  onChange={(e) => handleStyleChange('gap', e.target.value)}
                  placeholder="e.g., 16px, 1rem"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Grid Settings */}
        {element.styles.display === 'grid' && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Grid
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grid Template Columns</label>
                <input
                  type="text"
                  value={element.styles.gridTemplateColumns || ''}
                  onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                  placeholder="e.g., repeat(3, 1fr), 200px 1fr"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grid Template Rows</label>
                <input
                  type="text"
                  value={element.styles.gridTemplateRows || ''}
                  onChange={(e) => handleStyleChange('gridTemplateRows', e.target.value)}
                  placeholder="e.g., repeat(2, 1fr), auto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grid Gap</label>
                <input
                  type="text"
                  value={element.styles.gridGap || ''}
                  onChange={(e) => handleStyleChange('gridGap', e.target.value)}
                  placeholder="e.g., 20px, 1rem 2rem"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Advanced
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transform</label>
              <input
                type="text"
                value={element.styles.transform || ''}
                onChange={(e) => handleStyleChange('transform', e.target.value)}
                placeholder="e.g., rotate(45deg), scale(1.1)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transition</label>
              <input
                type="text"
                value={element.styles.transition || ''}
                onChange={(e) => handleStyleChange('transition', e.target.value)}
                placeholder="e.g., all 0.3s ease"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
              <input
                type="number"
                value={element.styles.zIndex || ''}
                onChange={(e) => handleStyleChange('zIndex', e.target.value)}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};