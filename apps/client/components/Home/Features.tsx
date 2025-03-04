import React from 'react'

const featuresList = [
  { title: "AI-Powered Automation", description: "Leverage AI to streamline workflows." },
  { title: "Seamless Integrations", description: "Connect with 1000+ apps effortlessly." },
  { title: "Scalable & Secure", description: "Enterprise-ready security and performance." },
];

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-4xl font-bold text-center">Why Choose Forge Flow?</h2>
      <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
        {featuresList.map((feature, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Features;