'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import Image from 'next/image'

const PropertyTools = () => {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('2.5')
  const [loanTerm, setLoanTerm] = useState('35')
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

  const [propertyPrice, setPropertyPrice] = useState('')
  const [rentalYield, setRentalYield] = useState('5.0')
  const [annualRent, setAnnualRent] = useState<number | null>(null)

  useEffect(() => {
    const amount = parseFloat(loanAmount)
    const rate = parseFloat(interestRate) / 100 / 12
    const term = parseFloat(loanTerm) * 12

    if (amount > 0 && rate > 0 && term > 0) {
      const payment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
      setMonthlyPayment(Math.round(payment))
    } else {
      setMonthlyPayment(null)
    }
  }, [loanAmount, interestRate, loanTerm])

  useEffect(() => {
    const price = parseFloat(propertyPrice)
    const yieldRate = parseFloat(rentalYield) / 100

    if (price > 0 && yieldRate > 0) {
      setAnnualRent(Math.round(price * yieldRate))
    } else {
      setAnnualRent(null)
    }
  }, [propertyPrice, rentalYield])

  return (
    <section className="relative section-padding">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="工具背景"
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" />
      </div>
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mb-4">房产实用工具</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            快速计算房贷月供与租金收益，辅助您的投资决策
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 房贷计算器 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-navy-700">房贷月供计算</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  贷款金额（日元）
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="例如：50000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年利率（%）
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  贷款年限（年）
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {monthlyPayment !== null && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">月供金额</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ¥{monthlyPayment.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 租金收益计算器 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-navy-700">租金收益计算</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  房产价格（日元）
                </label>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                  placeholder="例如：50000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年化收益率（%）
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={rentalYield}
                  onChange={(e) => setRentalYield(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {annualRent !== null && (
                <div className="mt-6 space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">年租金收入</p>
                    <p className="text-3xl font-bold text-green-600">
                      ¥{annualRent.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">月租金收入</p>
                    <p className="text-2xl font-bold text-gray-700">
                      ¥{Math.round(annualRent / 12).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PropertyTools

