export default function TrainingFrames() {

  const cards = Array.from({ length: 4 }, (_, i) => i + 1)
  const symbolGif = "/vault/afronaut-symbol.gif"

  return (

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      {cards.map((cardNumber) => (

        <div
          key={cardNumber}
          className="relative overflow-hidden rounded-2xl border border-[rgba(0,255,156,0.28)] shadow-[0_0_18px_rgba(0,255,156,0.18),0_0_4px_rgba(0,255,156,0.12)_inset] hover:shadow-[0_0_30px_rgba(0,255,156,0.38),0_0_8px_rgba(0,255,156,0.2)_inset] hover:border-[rgba(0,255,156,0.52)] hover:scale-[1.03] transition-all duration-300"
        >

          <img
            src={symbolGif}
            alt={`Afronaut Symbol Card ${cardNumber}`}
            className="w-full h-auto"
          />

        </div>

      ))}

    </div>

  )
}