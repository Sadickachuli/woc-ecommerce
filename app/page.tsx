'use client'

import { useState } from 'react'
import Hero from './components/Hero'
import { Leaf, Users, Globe, Award, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're dedicated to making sustainable living accessible to everyone through 
              carefully curated eco-friendly products that don't compromise on quality or style.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Wings of Change?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Curated Selection</h4>
                    <p className="text-gray-600">Every product is carefully selected for sustainability and quality</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparent Sourcing</h4>
                    <p className="text-gray-600">Know exactly where your products come from and how they're made</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Support Local Artisans</h4>
                    <p className="text-gray-600">Your purchases directly support small businesses and artisans</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Educational Content</h4>
                    <p className="text-gray-600">Learn about sustainability and make informed choices</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-8">
              <div className="text-center">
                <Leaf className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability First</h3>
                <p className="text-gray-600 mb-6">
                  Every product in our collection is chosen with the planet in mind, helping you 
                  make environmentally conscious decisions without sacrificing quality or style.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Learn More About Our Mission
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at Wings of Change
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Environmental Responsibility</h3>
              <p className="text-gray-600">
                We prioritize products that minimize environmental impact through sustainable 
                materials and ethical production practices.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-8 shadow-sm">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                We support artisans and small businesses that share our commitment to 
                sustainability and fair labor practices.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-8 shadow-sm">
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
        </section>

        {/* CTA Section */}
        <section className="mb-16">
          <div className="bg-primary-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Change?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start your sustainable living journey today with our carefully curated collection 
              of eco-friendly products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Explore Our Products
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're here to help you find the perfect sustainable products for your lifestyle.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </section>
      </main>
    </div>
  )
} 