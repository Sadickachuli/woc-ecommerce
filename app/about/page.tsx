import { Leaf, Users, Globe, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Wings of Change</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make sustainable living accessible to everyone through 
            carefully curated eco-friendly products that don't compromise on quality or style.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At Wings of Change, we believe that every small choice can create a ripple effect 
                of positive change. Our mission is to provide you with sustainable alternatives 
                that make it easy to reduce your environmental impact without sacrificing the 
                quality and convenience you deserve.
              </p>
              <p className="text-gray-600 mb-4">
                We carefully select each product in our collection, ensuring they meet our 
                high standards for sustainability, quality, and ethical production. From 
                organic cotton clothing to zero-waste home essentials, every item tells a 
                story of conscious consumption.
              </p>
              <p className="text-gray-600">
                Join us in creating a more sustainable future, one purchase at a time.
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-8">
              <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Sustainability First</h3>
              <p className="text-gray-600 text-center">
                Every product is chosen with the planet in mind, helping you make 
                environmentally conscious decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Environmental Responsibility</h3>
              <p className="text-gray-600">
                We prioritize products that minimize environmental impact through sustainable 
                materials and ethical production practices.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                We support artisans and small businesses that share our commitment to 
                sustainability and fair labor practices.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Every product is tested and verified to ensure it meets our high standards 
                for durability, functionality, and sustainability.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
              <p className="text-gray-600 mb-4">
                Wings of Change was born from a simple observation: sustainable products 
                shouldn't be hard to find or expensive to buy. What started as a small 
                collection of eco-friendly essentials has grown into a curated marketplace 
                for conscious consumers.
              </p>
              <p className="text-gray-600">
                Today, we're proud to offer a growing selection of products that help 
                you live more sustainably while supporting the artisans and businesses 
                that make it all possible.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Curated selection of verified sustainable products</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Transparent sourcing and production information</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Support for small businesses and artisans</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Educational content to help you make informed choices</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make a Change?</h2>
          <p className="text-gray-600 mb-6">
            Start your sustainable living journey today with our carefully curated collection 
            of eco-friendly products.
          </p>
          <a
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Explore Our Products
          </a>
        </div>
      </div>
    </div>
  )
} 