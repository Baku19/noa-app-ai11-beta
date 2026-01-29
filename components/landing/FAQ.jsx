import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
    {
      question: "What year levels does Noa support?",
      answer: "Noa supports Australian students from Year 3 to Year 9, covering all four NAPLAN domains: Numeracy, Reading, Writing, and Grammar & Punctuation."
    },
    {
      question: "How long are the daily sessions?",
      answer: "We recommend 20-minute sessions for optimal learning. Parents can adjust this to 15 or 30 minutes in settings. Short, focused practice is more effective than long cramming sessions."
    },
    {
      question: "Is Noa aligned with the Australian Curriculum?",
      answer: "Yes! All content is mapped to the Australian Curriculum v9.0 and designed to prepare students for NAPLAN-style assessments. Note: Noa provides practice and indicative feedback, not official NAPLAN scoring."
    },
    {
      question: "Can my child use Noa independently?",
      answer: "Absolutely. Each child gets their own login code. They can access their personalised sessions on any device, while parents maintain full visibility through the Parent Portal."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes 1 scholar with access to the Numeracy domain only, basic progress tracking, and limited sessions per week. It's a great way to try Noa before upgrading."
    },
    {
      question: "Can I add more children to my Family Plan?",
      answer: "Yes! The Family Plan includes 2 scholars, and you can add up to 3 more for $15/month each (or $150/year), for a maximum of 5 scholars total."
    },
    {
      question: "How does the AI writing feedback work?",
      answer: "When your child completes a writing task, Noa's AI analyses their work and creates an improved version. It then shows both side-by-side, explaining each improvement in kid-friendly language — helping them learn by example."
    },
    {
      question: "What happens after the free trial?",
      answer: "After your 30-day trial, you'll be prompted to select a paid plan. If you don't upgrade, your account reverts to the Free plan (Numeracy only). No surprise charges — we'll always ask first."
    }
  ];

const FAQ = ({ openFaq, setOpenFaq }) => {

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-500">
            Everything you need to know about Noa
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-all focus:outline-none"
                aria-expanded={openFaq === index}
              >
                <span className="font-semibold text-slate-800 pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;