---
name: aos_animations
description: Guidelines for implementing scroll animations using AOS (Animate on Scroll) by michalsnik.
---

# AOS (Animate on Scroll) Skill

This skill provides guidelines and snippets for adding smooth scroll animations to web designs using the AOS library created by Michał Sajnóg (michalsnik).

## Setup & Installation

To include AOS in your HTML project without a bundler, add the following CDN links:

**CSS (in `<head>`):**
```html
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
```

**JavaScript (before closing `</body>`):**
```html
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
  AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 800, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  });
</script>
```

## Usage

Add `data-aos` attributes to your HTML elements to animate them when they scroll into view.

### Basic Animations
```html
<div data-aos="fade-up">Fades up</div>
<div data-aos="fade-down">Fades down</div>
<div data-aos="fade-right">Fades right</div>
<div data-aos="fade-left">Fades left</div>
```

### Zoom Animations
```html
<div data-aos="zoom-in">Zooms in</div>
<div data-aos="zoom-in-up">Zooms in up</div>
<div data-aos="zoom-out">Zooms out</div>
```

### Flip Animations
```html
<div data-aos="flip-left">Flips left</div>
<div data-aos="flip-right">Flips right</div>
<div data-aos="flip-up">Flips up</div>
```

### Element Specific Settings
Override global settings on a specific element:
```html
<div 
  data-aos="fade-up"
  data-aos-offset="200"
  data-aos-delay="50"
  data-aos-duration="1000"
  data-aos-easing="ease-in-out"
  data-aos-mirror="true"
  data-aos-once="false"
  data-aos-anchor-placement="top-center">
  Animated content
</div>
```

## Best Practices
- **Don't overuse animations**: Keep it subtle so as not to overwhelm the user.
- **Duration**: Aim for 400ms - 800ms for natural feeling animations.
- **Once**: Consider setting `once: true` globally so animations don't replay every time the user scrolls back up, which can be distracting.
