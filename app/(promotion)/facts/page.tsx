'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function FactsPage() {
  return (
    <div className="container mx-auto relative min-h-screen-navbar">
      {/* Desktop Layout (xl and above) */}
      <div className="hidden xl:block relative min-h-[700px]">
        {/* Center Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
        <motion.div
          initial={{ opacity: 0, rotate: 180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 2 }}
        >
          <Image
            src="/facts.png"
            alt="Carbon Emissions Facts"
            width={400}
            height={400}
            className="w-full h-full"
          />
        </motion.div>
        </div>

        {/* Manufacturing & Industry - Top Left */}
        <div className="absolute top-[15%] left-[10%] max-w-[300px] text-right">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Manufacturing & Industry</h2>
          <p className="text-sm">
            Industrial processes, including cement production, steelmaking, and chemical manufacturing,
            account for nearly <span className="font-bold">20% of global emissions</span>.
          </p>
        </div>

        {/* Energy Production - Top Right */}
        <div className="absolute top-[15%] right-[10%] max-w-[300px]">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Energy Production</h2>
          <p className="text-sm">
            Fossil fuel combustion for electricity and heat is the largest contributor, responsible for about
            <span className="font-bold"> 73% of global emissions</span>.
          </p>
        </div>

        {/* Deforestation - Middle Left */}
        <div className="absolute top-[45%] left-[5%] max-w-[300px] text-right">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Deforestation</h2>
          <p className="text-sm">
            Cutting down forests releases stored carbon, contributing up to
            <span className="font-bold"> 10% of global emissions</span>.
          </p>
        </div>

        {/* Transportation - Middle Right */}
        <div className="absolute top-[42%] right-[5%] max-w-[300px]">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Transportation</h2>
          <p className="text-sm">
            Cars, planes, ships, and trucks contribute <span className="font-bold">about 16%</span> of global CO₂ emissions,
            with air travel having the highest impact per kilometer traveled.
          </p>
        </div>

        {/* Air Travel - Bottom Left */}
        <div className="absolute bottom-[15%] left-[10%] max-w-[300px] text-right">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Air Travel</h2>
          <p className="text-sm">
            A single round-trip flight from New York to London emits <span className="font-bold">about 1 ton of CO₂</span> per passenger,
            nearly the annual footprint of a person in some developing countries.
          </p>
        </div>

        {/* Food Industry - Bottom Right */}
        <div className="absolute bottom-[15%] right-[10%] max-w-[300px]">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Food Industry</h2>
          <p className="text-sm">
            The food system accounts for <span className="font-bold">about 26%</span> of global greenhouse gas emissions,
            with meat and dairy contributing the most due to methane emissions from livestock.
          </p>
        </div>
      </div>

      {/* Mobile Layout (below xl) */}
      <div className="xl:hidden space-y-8 px-4">
        {/* Center Image */}
        <div className="w-full max-w-[300px] mx-auto mb-8">
          <Image
            src="/facts.png"
            alt="Carbon Emissions Facts"
            width={300}
            height={300}
            className="w-full h-auto"
          />
        </div>

        {/* Facts Grid */}
        <div className="grid gap-8 max-w-2xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Manufacturing & Industry</h2>
            <p className="text-sm">
              Industrial processes, including cement production, steelmaking, and chemical manufacturing,
              account for nearly <span className="font-bold">20% of global emissions</span>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Energy Production</h2>
            <p className="text-sm">
              Fossil fuel combustion for electricity and heat is the largest contributor, responsible for about
              <span className="font-bold"> 73% of global emissions</span>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Deforestation</h2>
            <p className="text-sm">
              Cutting down forests releases stored carbon, contributing up to
              <span className="font-bold"> 10% of global emissions</span>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Transportation</h2>
            <p className="text-sm">
              Cars, planes, ships, and trucks contribute <span className="font-bold">about 16%</span> of global CO₂ emissions,
              with air travel having the highest impact per kilometer traveled.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Air Travel</h2>
            <p className="text-sm">
              A single round-trip flight from New York to London emits <span className="font-bold">about 1 ton of CO₂</span> per passenger,
              nearly the annual footprint of a person in some developing countries.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Food Industry</h2>
            <p className="text-sm">
              The food system accounts for <span className="font-bold">about 26%</span> of global greenhouse gas emissions,
              with meat and dairy contributing the most due to methane emissions from livestock.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
