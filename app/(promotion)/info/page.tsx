"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, LeafIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type InfoCard = {
  id: number
  title: string
  description: string
  hoverText: string
  icon: React.ReactNode
}

const infoCards: InfoCard[] = [
  {
    id: 1,
    title: "Who is Trashbusters",
    description: "Who are we, what do we do?",
    hoverText: "Trashbusters is a team of students dedicated to developing environmentally conscious projects. As Trashbusters, we have launched this platform, Carbonbusters, to raise awareness and take action against carbon emissions. Baha Özsoy leads the team and directs the project. Seçkin Özek contributes to artificial intelligence development. Sezai Emre Konuk and Nisa Sakınmaz work on integrations, while Dilara İnce creates user-friendly designs. As a team, we aim to develop and implement innovative solutions for a sustainable future.",
    icon: <LeafIcon className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "What is a carbon footprint?",
    description: "Understand your environmental impact",
    hoverText: `A carbon footprint is the total amount of carbon dioxide (CO₂) and other greenhouse gas emissions released into the atmosphere by individuals, businesses, or products, either directly or indirectly. These emissions originate from various sources such as fossil fuel combustion, deforestation, and agricultural activities. The carbon footprint is typically measured in carbon dioxide equivalents (CO₂e), which represent the combined impact of different greenhouse gases on the climate. Reducing one's carbon footprint is crucial in mitigating global warming, ensuring environmental sustainability, and leaving a livable world for future generations. Individuals and businesses can lower their carbon footprint by improving energy efficiency, adopting renewable energy sources, and implementing sustainable production methods.`,
    icon: <LeafIcon className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "What is a Corporate Carbon Footprint?",
    description: "Get personalized recommendations",
    hoverText: `The corporate carbon footprint refers to the total greenhouse gas emissions generated by a company during the production of its goods or services. These emissions, including carbon dioxide (CO₂), methane (CH₄), and nitrous oxides (NOx), directly contribute to global climate change.
Unlike an individual's carbon footprint, the corporate carbon footprint encompasses all direct and indirect greenhouse gas emissions resulting from a company's activities. This value, usually expressed in tons of CO₂ equivalent, plays a significant role in developing sustainability strategies and assessing a company's environmental impact.`,
    icon: <LeafIcon className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Carbon footprint measurement and reduction methods",
    description: "Learn how to measure and reduce your carbon footprint",
    hoverText: `Tracking daily, monthly, and annual carbon footprints allows individuals and organizations to measure and reduce their environmental impact.
On an individual level, monitoring transportation habits, energy consumption, and dietary choices can help in making sustainable decisions. For instance, using public transportation or promoting recycling can significantly reduce one's carbon footprint.
On a corporate level, improving energy efficiency in production processes and utilizing sustainable materials are effective strategies to lower emissions.
Regularly measuring and analyzing emissions allows for the development of more informed and effective sustainability strategies.
To reduce a carbon footprint:
Individuals can conserve energy, opt for public transport, and adopt eco-friendly habits like recycling.
Businesses can invest in renewable energy, implement efficient production processes, and build sustainable supply chains.
Both individual and corporate actions contribute not only to environmental preservation but also to long-term economic benefits.`,
    icon: <LeafIcon className="h-6 w-6" />,
  },
]

export default function Info() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(true)

  // Add useEffect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 640) { // mobile only
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollTop = window.scrollY
        
        // Check if user has scrolled near the bottom
        const isNearBottom = windowHeight + scrollTop >= documentHeight - 100
        setIsDrawerVisible(!isNearBottom)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCardInteraction = (id: number) => {
    if (window.innerWidth <= 640) { // mobile
      setHoveredCard(hoveredCard === id ? null : id)
    }
  }

  return (
    <div className="min-h-screen-navbar py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.id * 0.1 }}
            >
              <Card
                className="relative h-[400px] sm:h-[300px] p-4 sm:p-6 flex flex-col justify-between overflow-hidden cursor-pointer group"
                onClick={() => handleCardInteraction(card.id)}
                onMouseEnter={() => window.innerWidth > 640 && setHoveredCard(card.id)}
                onMouseLeave={() => window.innerWidth > 640 && setHoveredCard(null)}
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{card.description}</p>
                </div>

                <div className="text-forest mt-4">{card.icon}</div>

                {/* Hover Overlay with scrollable content */}
                <div
                  className={cn(
                    "absolute inset-0 bg-sage p-4 sm:p-6 flex items-start justify-center text-white transition-all duration-300 overflow-auto",
                    hoveredCard === card.id ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <p className="text-xs sm:text-sm">{card.hoverText}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modified drawer div */}
      <div
        className={cn(
          "fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] sm:w-[90%] max-w-7xl bg-muted shadow-lg transition-all duration-300 ease-in-out overflow-hidden sm:rounded-t-xl hover:bg-sage",
          isDrawerOpen ? "h-[90vh] sm:h-[40vh]" : "h-[20vh] sm:h-[15vh]",
          !isDrawerVisible && "sm:translate-y-0 translate-y-full" // Add translation for hiding
        )}
        onMouseEnter={() => setIsDrawerOpen(true)}
        onMouseLeave={() => setIsDrawerOpen(false)}
      >
        <div 
          className="px-4 sm:px-8 h-full overflow-auto" 
          onClick={(e) => {
            e.stopPropagation();
            setIsDrawerOpen(!isDrawerOpen);
          }}
        >
          <div className="space-y-4 max-w-5xl mx-auto py-12">
            <div className="space-y-12">
              <h1 className={cn("text-xl sm:text-3xl  xl font-semibold text-center", isDrawerOpen ? "text-white" : "text-forest")}>Track and Analyze Your Carbon Footprint with Carbonbusters!</h1>
              <p className={cn("text-sm sm:text-base text-center", isDrawerOpen ? "text-white" : "text-muted-foreground")}>
                At Trashbusters, our Carbonbusters platform allows both individuals and businesses to monitor their carbon footprint through detailed daily, monthly, and yearly analyses. By understanding your environmental impact, you can take informed, sustainable actions.
                Our platform provides data-driven insights and easy-to-understand reports, helping individuals optimize their energy consumption and enabling businesses to develop effective sustainability strategies.
                By consistently tracking your carbon footprint, you can protect the environment and reduce costs in the long run. Take action today—analyze your impact and make a difference for a greener future!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

