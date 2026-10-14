import WavyBottomBorder from '../common/WavyBottomBorder';

const ProcedureStepsSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Консультація',
      description: 'Оцінка типу шкіри та волосся',
    },
    {
      number: '02',
      title: 'Підготовка',
      description: 'Очищення та дезінфекція зони',
    },
    {
      number: '03',
      title: 'Епіляція',
      description: 'Обробка лазером з охолодженням',
    },
    {
      number: '04',
      title: 'Догляд',
      description: 'Заспокійливий крем та рекомендації',
    },
  ];

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 pt-16 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-10 relative ">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">Етапи процедури</h2>
        </div>

        {/* Steps Container */}
        <div className="max-w-5xl mx-auto ">
          {/* Mobile Layout - Single Column */}
          <div className="lg:hidden flex flex-col gap-y-20 px-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step Number */}
                <div className="shrink-0 w-20 h-20 rounded-2xl bg-brand-300 p-4 z-0 absolute left-[10%] top-0 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-2xl font-bold text-gray-700">{step.number}</span>
                </div>

                {/* Step Content Container with SVG */}
                <div className="w-4/5 mx-auto relative">
                  {/* Mobile SVG - positioned relative to each step content background */}
                  {index < steps.length - 1 && (
                    <svg
                      className="absolute top-full left-1/2 transform -translate-x-1/2 pointer-events-none z-0"
                      width="200"
                      height="80"
                      viewBox="0 0 200 80"
                      style={{ overflow: 'visible' }}
                    >
                      {/* Connecting line from current step to next */}
                      <path
                        d="M 100 0 L 100 40 L 100 80"
                        stroke="#D1D5DB"
                        strokeWidth="4"
                        strokeDasharray="8,6"
                        fill="none"
                        opacity="0.8"
                      />
                    </svg>
                  )}

                  {/* Step Content */}
                  <div
                    id={`step-content-${index}`}
                    className="bg-gray-200/70 rounded-lg py-6 px-8 pt-10 text-center relative z-10"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-lg text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout - 2x2 Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-32 lg:gap-y-20">
            {/* CUSTOMIZABLE CONNECTING LINE - Adjust coordinates as needed */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 800 400"
            >
              <path
                d="M 110 140 L 110 225 L 370 225 L 370 90 L 550 90 L 550 108 "
                stroke="#D1D5DB"
                strokeWidth="2"
                strokeDasharray="8,6"
                fill="none"
                opacity="0.9"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 800 400"
            >
              <path
                d="M 550 213 L 550 250 L 400 250 L 400 385 L 110 385 L 110 250"
                stroke="#D1D5DB"
                strokeWidth="2"
                strokeDasharray="8,6"
                fill="none"
                opacity="0.9"
              />
            </svg>

            {/* Step 1 - Top Left */}
            <div className="relative flex items-center justify-end ">
              <div className="text-center max-w-xs h-full w-full">
                <div className="flex items-center justify-end gap-6 relative h-full w-full">
                  <div className="bg-gray-200/70 rounded-lg py-6 px-8 z-10 h-full w-full">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 ">{steps[0].title}</h3>
                    <p className="text-lg text-gray-600">{steps[0].description}</p>
                  </div>
                  <div className="shrink-0 w-20 h-20 rounded-2xl bg-brand-300 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-0 ">
                    <span className="text-2xl font-bold text-gray-700 absolute bottom-1/2 right-1/2">
                      {steps[0].number}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Top Right */}
            <div className="relative flex items-center justify-start">
              <div className="text-center max-w-xs">
                <div className="flex items-center gap-6 relative">
                  <div className="shrink-0 w-20 h-20 rounded-2xl bg-brand-300 flex items-center justify-center absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-0">
                    <span className="text-2xl font-bold text-gray-700 absolute bottom-1/2 right-1/2">
                      {steps[1].number}
                    </span>
                  </div>
                  <div className="bg-gray-200/70 rounded-lg py-6 px-8 z-10 relative">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{steps[1].title}</h3>
                    <p className="text-lg text-gray-600">{steps[1].description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 - Bottom Left */}
            <div className="relative flex items-center justify-end">
              <div className="text-center max-w-xs ">
                <div className="flex items-center justify-end gap-6 relative">
                  <div className="bg-gray-200/70 rounded-lg py-6 px-8 z-10 relative">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{steps[3].title}</h3>
                    <p className="text-lg text-gray-600">{steps[3].description}</p>
                  </div>
                  <div className="shrink-0 w-20 h-20 rounded-2xl bg-brand-300 flex items-center justify-center absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-0">
                    <span className="text-2xl font-bold text-gray-700 absolute bottom-1/2 right-1/2">
                      {steps[3].number}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Bottom Right */}
            <div className="relative flex items-center justify-start ">
              <div className="text-center max-w-xs">
                <div className="flex items-center gap-6 relative">
                  <div className="shrink-0 w-20 h-20 rounded-2xl bg-brand-300 flex items-center justify-center absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 z-0">
                    <span className="text-2xl font-bold text-gray-700 absolute bottom-1/2 right-1/2">
                      {steps[2].number}
                    </span>
                  </div>
                  <div className="bg-gray-200/70 rounded-lg py-6 px-8 z-10 relative">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{steps[2].title}</h3>
                    <p className="text-lg text-gray-600">{steps[2].description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WavyBottomBorder />
    </section>
  );
};

export default ProcedureStepsSection;
