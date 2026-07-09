import React, { useEffect, useState } from 'react';
import './FAQ.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFAQ } from '../../redux/Slice/FAQSlice';


const FAQ = () => {
  const dispatch = useDispatch();
  const { FAQ: faqs, status, error } = useSelector((state) => state.FAQ);
  const loading = status === 'loading';

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFAQ());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (faqs && faqs.length > 0) {
      const cats = ['All', ...new Set(faqs.map((f) => f.category).filter(Boolean))];
      setCategories(cats);
    }
  }, [faqs]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setOpenIndex(null);
  };

  const filteredFAQs = activeCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-label">FAQ</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Everything you need to know about shopping with us. Can't find an answer?{' '}
            <a href="https://wa.me/919003466189" className="faq-contact-link" target="_blank" rel="noopener noreferrer">
              Reach out to our team.
            </a>
          </p>
        </div>

        {categories.length > 1 && (
          <div className="faq-tabs">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`faq-tab ${activeCategory === cat ? 'faq-tab--active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="faq-loading">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="faq-skeleton" />
            ))}
          </div>
        )}

        {error && <p className="faq-error">{error}</p>}

        {!loading && !error && filteredFAQs.length === 0 && (
          <p className="faq-empty">No FAQs available at the moment.</p>
        )}

        {!loading && !error && filteredFAQs.length > 0 && (
          <div className="faq-list">
            {filteredFAQs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.id} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => handleToggle(idx)}
                    aria-expanded={isOpen}
                    id={`faq-q-${idx}`}
                  >
                    <span className="faq-q-text">{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <svg
                        width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={`faq-chevron ${isOpen ? 'faq-chevron--open' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="faq-answer-wrapper"
                    style={{ maxHeight: isOpen ? '600px' : '0px' }}
                    aria-hidden={!isOpen}
                  >
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="faq-still-need-help">
          <div className="faq-help-card">
            <span className="faq-help-icon">💬</span>
            <h3>Still have questions?</h3>
            <p>Our support team is available Mon–Sat, 10:30 AM – 6:00 PM</p>
            <div className="faq-help-actions">
              <a
                href="https://wa.me/919003466189"
                className="faq-help-btn faq-help-btn--primary"
                target="_blank" rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
              <a href="mailto:info@shop.in" className="faq-help-btn faq-help-btn--secondary">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
