'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function FitPage() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedWaist, setSelectedWaist] = useState('')
  const [selectedFit, setSelectedFit] = useState('')
  const [selectedScore, setSelectedScore] = useState('')
  const [recommendedSize, setRecommendedSize] = useState('')
  const [showResults, setShowResults] = useState(false)

  const handleGetRecommendation = () => {
    if (selectedBrand && selectedCategory && selectedWaist && selectedFit) {
      setRecommendedSize('M')
      setShowResults(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fit</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized size recommendations based on your preferences
            </p>
          </div>

          {/* Main Form Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Size Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Brand Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nike">Nike</SelectItem>
                    <SelectItem value="adidas">Adidas</SelectItem>
                    <SelectItem value="puma">Puma</SelectItem>
                    <SelectItem value="under-armour">Under Armour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Waist Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Waist</label>
                <Select value={selectedWaist} onValueChange={setSelectedWaist}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select waist size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="28">28</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="32">32</SelectItem>
                    <SelectItem value="34">34</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fit Preference */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fit Preference</label>
                <Select value={selectedFit} onValueChange={setSelectedFit}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select fit preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slim">Slim</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Score Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Score</label>
                <Select value={selectedScore} onValueChange={setSelectedScore}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (90-100%)</SelectItem>
                    <SelectItem value="medium">Medium (70-89%)</SelectItem>
                    <SelectItem value="low">Low (50-69%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleGetRecommendation}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!selectedBrand || !selectedCategory || !selectedWaist || !selectedFit}
              >
                Get Recommendation
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {showResults && (
            <Card className="mt-6 shadow-lg border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Size Recommendation
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Recommended Size:</span>
                    <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {recommendedSize}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Confidence:</span>
                    <Badge variant="secondary">95%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Indicators */}
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
