/**
 * विद्यार्थी पालक कौन्सिलिंग कार्यशाळा - Interactive Logic, WhatsApp Lead Flow & Analytics Readiness
 * Mobile-First, Accessible, and Conversion-Focused for Meta Ads
 */

// ============================================================================
// 1. Central Workshop & Contact Configuration
// ============================================================================
const WORKSHOP_CONFIG = {
  whatsappNumber: '918390296755',
  displayPhoneNumber: '९३७०२७४६७५',
  rawPhoneNumber: '+919370274675',
  workshopName: 'विद्यार्थी पालक कौन्सिलिंग कार्यशाळा',
  mentorName: 'डॉ. अशोक सोनवणे'
};

// ============================================================================
// 2. Google Apps Script Web App Configuration
// ============================================================================
const GOOGLE_APPS_SCRIPT_CONFIG = {
  webAppUrl: 'https://script.google.com/macros/s/AKfycbyJ5C5dtKModmc7k3At4D8Dh5ZU0WzbY9YHjqJMCJkk83cZ4UWeEAc6kvTxYaj-s8Z6/exec',
  requestTimeoutMs: 10000
};

// ============================================================================
// 3. Central Analytics & Meta Pixel Configuration
// ============================================================================
/**
 * INSTRUCTIONS FOR META PIXEL & GOOGLE ANALYTICS INTEGRATION:
 * 
 * To activate Meta Pixel tracking:
 * 1. Insert your verified Meta Pixel ID into `ANALYTICS_CONFIG.metaPixelId` (e.g. '1234567890123456')
 * 2. Set `ANALYTICS_CONFIG.isPixelEnabled = true`
 * 
 * To activate Google Analytics (GA4):
 * 1. Insert your GA4 Measurement ID into `ANALYTICS_CONFIG.googleAnalyticsId` (e.g. 'G-XXXXXXXXXX')
 * 2. Set `ANALYTICS_CONFIG.isGoogleAnalyticsEnabled = true`
 * 
 * NOTE: No tracking calls are made until valid IDs are configured and enabled.
 */
const ANALYTICS_CONFIG = {
  metaPixelId: '', // Leave blank until verified Meta Pixel ID is supplied
  isPixelEnabled: false, // Set to true after entering valid Pixel ID
  googleAnalyticsId: '', // Leave blank until verified GA4 ID is supplied
  isGoogleAnalyticsEnabled: false
};

// Internal flag to prevent duplicate 'Lead' event firing on single submission
let leadEventFired = false;

/**
 * Initialize Meta Pixel and standard events when configured
 */
function initializeAnalytics() {
  if (ANALYTICS_CONFIG.isPixelEnabled && ANALYTICS_CONFIG.metaPixelId) {
    // Official Meta Pixel base snippet
    (function(f,b,e,v,n,t,s) {
      if(f.fbq) return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', ANALYTICS_CONFIG.metaPixelId);
    window.fbq('track', 'PageView');
    window.fbq('track', 'ViewContent', {
      content_name: WORKSHOP_CONFIG.workshopName,
      content_category: 'Educational Workshop',
      value: 3999,
      currency: 'INR'
    });
    console.log('[Analytics] Meta Pixel initialized with ID:', ANALYTICS_CONFIG.metaPixelId);
  } else {
    // Pixel is inactive - no fake tracking calls are made
    console.log('[Analytics] Meta Pixel is on standby. Configure ANALYTICS_CONFIG.metaPixelId to activate.');
  }

  // Google Analytics initialization placeholder
  if (ANALYTICS_CONFIG.isGoogleAnalyticsEnabled && ANALYTICS_CONFIG.googleAnalyticsId) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_CONFIG.googleAnalyticsId)}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.googleAnalyticsId);
    console.log('[Analytics] Google Analytics initialized with ID:', ANALYTICS_CONFIG.googleAnalyticsId);
  }
}

/**
 * Track 'Lead' conversion strictly when a valid registration is submitted
 */
function trackLeadConversion() {
  if (leadEventFired) return;
  leadEventFired = true;

  // Fire Meta Pixel 'Lead' event
  if (ANALYTICS_CONFIG.isPixelEnabled && typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: WORKSHOP_CONFIG.workshopName,
      content_category: 'Workshop Registration Enquiry',
      value: 3999,
      currency: 'INR'
    });
    console.log('[Analytics] Meta Pixel "Lead" event tracked successfully.');
  }

  // Fire Google Analytics 'generate_lead' event
  if (ANALYTICS_CONFIG.isGoogleAnalyticsEnabled && typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'Registration',
      event_label: WORKSHOP_CONFIG.workshopName,
      value: 3999
    });
  }
}

// ============================================================================
// 3. WhatsApp Message Generation (Pure Unicode UTF-8 & Single encodeURIComponent)
// ============================================================================

/**
 * Constructs the official WhatsApp registration enquiry message.
 * Strict Unicode string with natural Marathi Devanagari characters, punctuation, and line breaks.
 * Encoded exactly once using JavaScript's encodeURIComponent() function.
 * 
 * @param {Object} details
 * @param {string} details.name Full name of applicant
 * @param {string} details.phone Mobile number
 * @param {string} details.email Optional email address
 * @param {string} details.city City name
 * @param {string} details.profession Selected profession
 * @returns {string} Fully encoded WhatsApp URL targeting WORKSHOP_CONFIG.whatsappNumber
 */
function generateRegistrationWhatsAppUrl(details) {
  const formattedEmail = (details.email && details.email.trim().length > 0) ? details.email.trim() : '-';
  const formattedProfession = (details.profession && details.profession.trim().length > 0) ? details.profession.trim() : '-';

  // Construct complete WhatsApp message as a normal JavaScript Unicode string
  const unicodeMessage = 
`नमस्कार डॉ. अशोक सोनवणे,

मला विद्यार्थी पालक कौन्सिलिंग कार्यशाळेत प्रवेश घ्यायचा आहे.

माझी माहिती खालीलप्रमाणे आहे:

नाव: ${details.name.trim()}
मोबाईल नंबर: ${details.phone.trim()}
ईमेल: ${formattedEmail}
शहर: ${details.city.trim()}
व्यवसाय: ${formattedProfession}

कृपया मला प्रवेश प्रक्रियेची पुढील माहिती द्यावी.`;

  // Encode the entire message exactly once using JavaScript's encodeURIComponent() function
  const encodedText = encodeURIComponent(unicodeMessage);

  return `https://wa.me/${WORKSHOP_CONFIG.whatsappNumber}?text=${encodedText}`;
}

/**
 * Constructs the direct enquiry WhatsApp URL for general inquiry buttons.
 * Pure JavaScript Unicode string encoded exactly once using encodeURIComponent().
 * @returns {string} Fully encoded WhatsApp URL
 */
function generateDirectEnquiryWhatsAppUrl() {
  const directMessage = `नमस्कार डॉ. अशोक सोनवणे, मला विद्यार्थी पालक कौन्सिलिंग कार्यशाळेबद्दल माहिती हवी आहे.`;
  return `https://wa.me/${WORKSHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(directMessage)}`;
}

// ============================================================================
// 5. Google Apps Script Web App Integration
// ============================================================================

/**
 * Submits registration lead data to Google Apps Script Web App.
 * Sends a POST request with Content-Type: application/json and the required fields:
 * { name, phone, email, city, occupation }.
 * 
 * Handles network errors and browser CORS/opaque redirect characteristics gracefully.
 * Does not falsely claim confirmed save when response is opaque or erroring.
 * 
 * @param {Object} payload
 * @param {string} payload.name Full name of applicant
 * @param {string} payload.phone Mobile number
 * @param {string} payload.email Optional email address
 * @param {string} payload.city City name
 * @param {string} payload.occupation Profession / occupation
 * @returns {Promise<{ status: 'success' | 'opaque' | 'error', message: string, detail?: any }>}
 */
async function sendRegistrationToAppsScript(payload) {
  const url = GOOGLE_APPS_SCRIPT_CONFIG.webAppUrl;
  const jsonBody = JSON.stringify(payload);

  // 1. Primary Attempt: Standard POST with Content-Type: application/json
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GOOGLE_APPS_SCRIPT_CONFIG.requestTimeoutMs);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonBody,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      try {
        const data = await response.json();
        return { status: 'success', message: 'Google Sheet मध्ये माहिती नोंदवली गेली.', detail: data };
      } catch (_) {
        return { status: 'success', message: 'सर्व्हरकडून सकारात्मक प्रतिसाद मिळाला.' };
      }
    } else if (response.type === 'opaque') {
      return { status: 'opaque', message: 'Google Apps Script कडून अपारदर्शक (opaque) प्रतिसाद मिळाला.' };
    } else {
      return { status: 'error', statusCode: response.status, message: `सर्व्हर त्रुटी: HTTP ${response.status}` };
    }
  } catch (error) {
    console.warn('[AppsScript] Primary JSON POST error / CORS limitation:', error.message || error);

    if (error.name === 'AbortError') {
      return { status: 'error', message: 'सर्व्हरकडून प्रतिसाद मिळण्यास उशीर झाला (Timeout).' };
    }

    // 2. Fallback Attempt: mode 'no-cors' allows payload delivery to Google Apps Script
    // even when browser restricts cross-origin response reading
    try {
      const fallbackController = new AbortController();
      const fbTimeout = setTimeout(() => fallbackController.abort(), 6000);

      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: jsonBody,
        signal: fallbackController.signal
      });

      clearTimeout(fbTimeout);
      return { status: 'opaque', message: 'नोंदणी माहिती Google Apps Script कडे पाठवली गेली आहे.' };
    } catch (fbError) {
      console.error('[AppsScript] Fallback delivery failed:', fbError.message || fbError);
      return { status: 'error', message: 'इंटरनेट किंवा नेटवर्क जोडणीत अडथळा आला.' };
    }
  }
}

// ============================================================================
// 6. DOM Ready Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {

  // Initialize analytics module
  initializeAnalytics();

  // Dynamically synchronize all direct inquiry WhatsApp buttons with clean UTF-8 encoding
  const directWhatsAppLinks = document.querySelectorAll('a[href*="wa.me"]');
  const directEnquiryUrl = generateDirectEnquiryWhatsAppUrl();
  directWhatsAppLinks.forEach(link => {
    if (link.id !== 'whatsapp-send-link') {
      link.href = directEnquiryUrl;
    }
  });

  /* --------------------------------------------------------------------------
     Smooth Scrolling with Sticky Header Offset
     -------------------------------------------------------------------------- */
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.getElementById('site-header');

  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 12;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     FAQ Accordion Interaction
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open FAQ items for clean UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* --------------------------------------------------------------------------
     Registration Form Validation & WhatsApp Lead Submission
     -------------------------------------------------------------------------- */
  const form = document.getElementById('registration-form');
  const successBox = document.getElementById('form-success-box');
  const resetBtn = document.getElementById('reset-form-btn');
  const whatsappSendLink = document.getElementById('whatsapp-send-link');

  if (form) {
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const cityInput = document.getElementById('city');
    const professionSelect = document.getElementById('profession');
    const consentCheckbox = document.getElementById('consent');

    const fullNameError = document.getElementById('fullName-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    const cityError = document.getElementById('city-error');
    const consentError = document.getElementById('consent-error');

    // Helper: validate single field and update UI
    const validateField = (input, errorEl, condition) => {
      if (!condition) {
        if (input && input.classList) input.classList.add('has-error');
        if (errorEl) errorEl.classList.add('show');
        return false;
      } else {
        if (input && input.classList) input.classList.remove('has-error');
        if (errorEl) errorEl.classList.remove('show');
        return true;
      }
    };

    // Real-time error clearing when user types or changes input
    [fullNameInput, phoneInput, emailInput, cityInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('has-error');
          const errorEl = document.getElementById(`${input.id}-error`);
          if (errorEl) errorEl.classList.remove('show');
        });
      }
    });

    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        if (consentCheckbox.checked && consentError) {
          consentError.classList.remove('show');
        }
      });
    }

    // Guard to avoid duplicate submissions
    let isSubmitting = false;

    // Form Submission Handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      // 1. Full name validation: must not be empty
      const trimmedName = fullNameInput.value.trim();
      const isNameValid = validateField(
        fullNameInput,
        fullNameError,
        trimmedName.length >= 2
      );

      // 2. Mobile number validation: valid 10-digit Indian mobile number
      const trimmedPhone = phoneInput.value.trim();
      const phoneRegex = /^[6-9]\d{9}$/;
      const isPhoneValid = validateField(
        phoneInput,
        phoneError,
        phoneRegex.test(trimmedPhone)
      );

      // 3. Email validation: optional, but if provided must be valid
      const trimmedEmail = emailInput ? emailInput.value.trim() : '';
      let isEmailValid = true;
      if (trimmedEmail.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isEmailValid = validateField(
          emailInput,
          emailError,
          emailRegex.test(trimmedEmail)
        );
      } else {
        if (emailInput) emailInput.classList.remove('has-error');
        if (emailError) emailError.classList.remove('show');
      }

      // 4. City validation: must not be empty
      const trimmedCity = cityInput.value.trim();
      const isCityValid = validateField(
        cityInput,
        cityError,
        trimmedCity.length >= 2
      );

      // 5. Consent checkbox validation: must be checked
      const isConsentValid = validateField(
        consentCheckbox,
        consentError,
        consentCheckbox && consentCheckbox.checked
      );

      // If any field is invalid, do NOT clear the form, focus the first invalid field
      if (!isNameValid || !isPhoneValid || !isEmailValid || !isCityValid || !isConsentValid) {
        if (!isNameValid) {
          fullNameInput.focus();
        } else if (!isPhoneValid) {
          phoneInput.focus();
        } else if (!isEmailValid) {
          emailInput.focus();
        } else if (!isCityValid) {
          cityInput.focus();
        } else if (!isConsentValid) {
          consentCheckbox.focus();
        }
        return;
      }

      // Lock submission to prevent duplicate clicks
      isSubmitting = true;
      const submitBtn = document.getElementById('submit-btn');
      let originalBtnHtml = '';
      if (submitBtn) {
        originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> <span>माहिती पाठवत आहे...</span>';
      }

      // Format optional fields
      const selectedProfession = (professionSelect && professionSelect.value && professionSelect.value !== '-') ? professionSelect.value : '';

      // Construct WhatsApp URL with destination contact number from central config (918390296755)
      // Construct complete Unicode message and encode exactly once using encodeURIComponent
      const whatsappUrl = generateRegistrationWhatsAppUrl({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        city: trimmedCity,
        profession: selectedProfession
      });

      // Update the fallback / manual link in the thank-you card
      if (whatsappSendLink) {
        whatsappSendLink.href = whatsappUrl;
      }

      // Fire Meta Pixel & GA Lead tracking (guarded against multiple triggers)
      trackLeadConversion();

      // Construct JSON payload for Google Apps Script Web App
      // Required fields: name, phone, email, city, occupation
      const payload = {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        city: trimmedCity,
        occupation: selectedProfession
      };

      // Send POST request with application/json to Google Apps Script Web App
      let sheetResult = null;
      try {
        sheetResult = await sendRegistrationToAppsScript(payload);
        console.log('[Registration] Apps Script submission result:', sheetResult);
      } catch (err) {
        console.error('[Registration] Unexpected error in Apps Script request:', err);
        sheetResult = { status: 'error', message: 'नेटवर्क जोडणीत अडथळा आला.' };
      }

      // Inform user of submission status transparently without making false claims
      if (successBox) {
        let statusNotice = successBox.querySelector('.sheet-status-notice');
        if (!statusNotice) {
          statusNotice = document.createElement('div');
          statusNotice.className = 'sheet-status-notice';
          const stepsBox = successBox.querySelector('.enquiry-steps-box');
          if (stepsBox) {
            stepsBox.insertAdjacentElement('afterend', statusNotice);
          } else {
            successBox.prepend(statusNotice);
          }
        }

        if (sheetResult && sheetResult.status === 'success') {
          statusNotice.style.cssText = 'background-color: #ECFDF5; border: 1px solid #10B981; color: #065F46; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.875rem; margin-bottom: 1rem; text-align: left; line-height: 1.5;';
          statusNotice.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true" style="color: #059669; margin-right: 0.35rem;"></i> <strong>नोंदणी माहिती:</strong> तुमची नोंदणी माहिती यशस्वीरीत्या नोंदवली गेली आहे.';
        } else if (sheetResult && sheetResult.status === 'opaque') {
          statusNotice.style.cssText = 'background-color: #F0FDF4; border: 1px solid #86EFAC; color: #166534; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.875rem; margin-bottom: 1rem; text-align: left; line-height: 1.5;';
          statusNotice.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true" style="color: #16A34A; margin-right: 0.35rem;"></i> <strong>नोंदणी माहिती:</strong> तुमची माहिती नोंदणीसाठी पाठवण्यात आली आहे. खालील बटणावर क्लिक करून व्हॉट्सॲपवर संदेश पाठवा.';
        } else {
          statusNotice.style.cssText = 'background-color: #FFFBEB; border: 1px solid #FCD34D; color: #92400E; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.875rem; margin-bottom: 1rem; text-align: left; line-height: 1.5;';
          statusNotice.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true" style="color: #D97706; margin-right: 0.35rem;"></i> <strong>नोंदणी माहिती:</strong> ऑनलाइन सर्व्हर जोडणीत अडथळा आला असला तरी तुमची संपूर्ण माहिती व्हॉट्सॲप संदेशामध्ये सुरक्षितपणे तयार आहे. खालील बटणावर क्लिक करून थेट व्हॉट्सॲपवर पाठवा.';
        }
      }

      // Open WhatsApp directly in a new window/tab
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Popup blocked by browser; direct WhatsApp button is available on page.', err);
      }

      // Transition UI to Thank-You / Enquiry Initiated experience (Never claim confirmed admission)
      form.classList.add('hidden');
      if (successBox) {
        successBox.classList.remove('hidden');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Reset Form button handler
    if (resetBtn && successBox) {
      resetBtn.addEventListener('click', () => {
        isSubmitting = false;
        leadEventFired = false; // Allow tracking next valid submission
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i> <span>नोंदणीसाठी माहिती पाठवा</span>';
        }
        const statusNotice = successBox.querySelector('.sheet-status-notice');
        if (statusNotice) {
          statusNotice.remove();
        }
        successBox.classList.add('hidden');
        form.classList.remove('hidden');
        fullNameInput.focus();
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. Mobile Persistent CTA Visibility Controller
     (Hides when form fields, content, or footer are visible)
     -------------------------------------------------------------------------- */
  const mobileCtaBar = document.getElementById('mobile-cta-bar');
  const registerSection = document.getElementById('register');
  const footerSection = document.getElementById('footer');

  if (mobileCtaBar) {
    const handleScroll = () => {
      // Only process on mobile devices
      if (window.innerWidth > 768) {
        mobileCtaBar.style.display = 'none';
        return;
      }

      const windowHeight = window.innerHeight;
      let shouldHide = false;

      // 1. Check if user is viewing the registration section
      if (registerSection) {
        const regRect = registerSection.getBoundingClientRect();
        if (regRect.top < windowHeight && regRect.bottom > 60) {
          shouldHide = true;
        }
      }

      // 2. Check if user has reached the footer
      if (footerSection) {
        const footerRect = footerSection.getBoundingClientRect();
        if (footerRect.top < windowHeight - 40) {
          shouldHide = true;
        }
      }

      // Toggle display cleanly without obscuring content
      if (shouldHide) {
        mobileCtaBar.style.display = 'none';
      } else {
        mobileCtaBar.style.display = 'block';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    // Initial check
    handleScroll();
  }

});
