'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

interface Attribute {
  id: string
  attribute_name: string
  attribute_type: 'text' | 'number' | 'dropdown' | 'multiselect' | 'date' | 'checkbox'
  is_required: boolean
  dropdown_values?: string[]
  unit?: string
  min_value?: number
  max_value?: number
}

interface DynamicAttributeFormProps {
  categoryId: string
  onValuesChange: (values: Record<string, any>) => void
}

export function DynamicAttributeForm({ categoryId, onValuesChange }: DynamicAttributeFormProps) {
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttributes()
  }, [categoryId])

  const fetchAttributes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${categoryId}/attributes`)
      const data = await response.json()
      setAttributes(data)
    } catch (error) {
      console.error('Error fetching attributes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (attributeName: string, value: any) => {
    const newValues = { ...formValues, [attributeName]: value }
    setFormValues(newValues)
    onValuesChange(newValues)
  }

  if (loading) return <div className="text-gray-500">Loading fields...</div>

  return (
    <div className="space-y-4">
      {attributes.map(attr => (
        <div key={attr.id} className="space-y-2">
          <Label className="flex items-center gap-2">
            {attr.attribute_name}
            {attr.is_required && <span className="text-red-500">*</span>}
          </Label>

          {attr.attribute_type === 'text' && (
            <Input
              placeholder={`Enter ${attr.attribute_name.toLowerCase()}`}
              value={formValues[attr.attribute_name] || ''}
              onChange={e => handleChange(attr.attribute_name, e.target.value)}
              required={attr.is_required}
            />
          )}

          {attr.attribute_type === 'number' && (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Enter ${attr.attribute_name.toLowerCase()}`}
                value={formValues[attr.attribute_name] || ''}
                onChange={e => handleChange(attr.attribute_name, e.target.value)}
                min={attr.min_value}
                max={attr.max_value}
                required={attr.is_required}
                className="flex-1"
              />
              {attr.unit && <span className="text-gray-600 py-2">{attr.unit}</span>}
            </div>
          )}

          {attr.attribute_type === 'date' && (
            <Input
              type="date"
              value={formValues[attr.attribute_name] || ''}
              onChange={e => handleChange(attr.attribute_name, e.target.value)}
              required={attr.is_required}
            />
          )}

          {attr.attribute_type === 'dropdown' && (
            <Select value={formValues[attr.attribute_name] || ''} onValueChange={value => handleChange(attr.attribute_name, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${attr.attribute_name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {attr.dropdown_values?.map(val => (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {attr.attribute_type === 'multiselect' && (
            <div className="space-y-2">
              {attr.dropdown_values?.map(val => (
                <div key={val} className="flex items-center gap-2">
                  <Checkbox
                    id={`${attr.attribute_name}-${val}`}
                    checked={(formValues[attr.attribute_name] || []).includes(val)}
                    onCheckedChange={checked => {
                      const current = formValues[attr.attribute_name] || []
                      const updated = checked
                        ? [...current, val]
                        : current.filter((v: string) => v !== val)
                      handleChange(attr.attribute_name, updated)
                    }}
                  />
                  <Label htmlFor={`${attr.attribute_name}-${val}`} className="cursor-pointer">
                    {val}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {attr.attribute_type === 'checkbox' && (
            <Checkbox
              id={attr.attribute_name}
              checked={formValues[attr.attribute_name] || false}
              onCheckedChange={checked => handleChange(attr.attribute_name, checked)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
