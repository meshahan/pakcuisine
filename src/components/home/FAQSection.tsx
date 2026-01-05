import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is your food halal?",
    answer: "Yes, all our meat is 100% halal certified. We take great care to ensure our ingredients meet halal standards, and we can provide certification upon request.",
  },
  {
    question: "Do you accommodate dietary restrictions?",
    answer: "Absolutely! We offer vegetarian, vegan, and gluten-free options. Our menu clearly marks dishes with dietary icons. Please inform your server of any allergies, and our kitchen will take special precautions.",
  },
  {
    question: "Do I need a reservation?",
    answer: "While walk-ins are welcome, we highly recommend making a reservation, especially for weekends and larger parties. You can book online or call us directly at (123) 456-7890.",
  },
  {
    question: "Is there parking available?",
    answer: "Yes, we have a private parking lot with 20 spaces. Street parking is also available, and there's a public parking garage one block away.",
  },
  {
    question: "Do you offer catering services?",
    answer: "Yes! We cater events of all sizes, from intimate gatherings to large corporate functions. Contact us for a customized catering menu and quote.",
  },
  {
    question: "Can I host a private event at your restaurant?",
    answer: "Yes, we have a private dining room that seats up to 30 guests. For larger events, we can accommodate up to 80 guests for exclusive restaurant buyouts.",
  },
  {
    question: "Do you offer takeout and delivery?",
    answer: "Yes, we offer both takeout and delivery within a 5-mile radius. You can order by phone or through our website. Third-party delivery apps are also available.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "We ask for at least 24 hours notice for cancellations. For large parties (8+), we require 48 hours notice to avoid a cancellation fee.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-primary font-medium uppercase tracking-wider">FAQ</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our restaurant.
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 shadow-sm border-none"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/contact"
              className="text-primary font-semibold hover:underline"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
