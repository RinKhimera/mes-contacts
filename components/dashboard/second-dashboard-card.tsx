export const SecondDashboardCard = () => {
  const categories = [
    { name: "Restaurants", icon: "🍽️" },
    { name: "Plombiers", icon: "🔧" },
    { name: "Médecins", icon: "⚕️" },
    { name: "Hôtels", icon: "🏨" },
    { name: "Coiffeurs", icon: "💇" },
    { name: "Garages", icon: "🔧" },
  ]

  return (
    <div className="bg-muted/50 @container aspect-video rounded-xl p-2">
      <div className="flex h-full flex-col">
        <h3 className="mb-1 hidden text-base font-semibold @[220px]:block @[400px]:mb-3 @[400px]:text-lg">
          Catégories populaires
        </h3>
        <div className="grid flex-grow grid-cols-3 gap-1 @[300px]:grid-cols-2 @[400px]:grid-cols-3 @[400px]:gap-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`bg-muted/60 hover:bg-muted flex flex-col items-center justify-center rounded-lg p-1 text-center transition-colors @[400px]:p-2 ${index >= 3 && index < 4 ? "hidden @[300px]:flex" : ""} ${index >= 4 ? "hidden @[400px]:flex" : ""}`}
            >
              <span className="text-lg @[350px]:text-2xl">{category.icon}</span>
              <span className="text-xs font-medium @[350px]:text-sm">
                {category.name}
              </span>
            </button>
          ))}
        </div>
        <button className="bg-primary/10 text-primary hover:bg-primary/20 mt-1 w-full rounded-md py-1 text-xs font-medium transition-colors @[400px]:mt-3 @[400px]:py-1.5 @[400px]:text-sm">
          Voir toutes les catégories
        </button>
      </div>
    </div>
  )
}
