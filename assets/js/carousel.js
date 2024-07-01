document.addEventListener("DOMContentLoaded", initCarousels );

function initCarousels() {
  carousels = document.querySelectorAll('[data-scroll="scroller"]')
  carousels.forEach((element) => {setCarousel(element)})
}

function setCarousel(nodeElement) {
  const scroller = nodeElement
  let items = scroller.querySelectorAll('[data-scroll="item"]');
  let copyOfItems = Array.from(items);
  let reverseNewItems = [...copyOfItems].reverse();

  const setElements = () => {
    copyOfItems.forEach((item) => {
      scroller.insertBefore(item.cloneNode(true), items[0]);
    })
    reverseNewItems.forEach((item) => {
      scroller.insertBefore(item.cloneNode(true), items[items.length-1].nextSibling);
    })
  }
  setElements();
  items.length <= 6 && (setElements(), setElements(), setElements());

  scroller.scrollLeft = 2000;

  scroller.addEventListener("click", event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const middle = rect.width / 2;

    if (clickX > middle) {
      scroller.scroll({ left: scroller.scrollLeft + scroller.children[1].offsetWidth, behavior: "smooth", });
    } else {
      scroller.scroll({ left: scroller.scrollLeft - scroller.children[1].offsetWidth, behavior: "smooth", });
    }
  });

  function checkElementUnderWindow() {
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('scaling-up', entry.isIntersecting);
      })
    }, {
      root: scroller,
      rootMargin: "-100px",
      threshold: 1,
    })
    Array.from(scroller.children).forEach(div => observer.observe(div));
  }
  if (!CSS.supports('animation-timeline: --item')) { checkElementUnderWindow(); }
}


function loop({ target, target: { scrollLeft, scrollWidth, offsetWidth } }) {

  const progress = scrollLeft / (scrollWidth - offsetWidth) * 100
  if (window.scrollProgress === progress) return

  const isForward = (window.scrollProgress <= progress)
  window.scrollProgress = progress;

  if (offsetWidth + scrollLeft >= scrollWidth - offsetWidth && isForward) {
    target.style.scrollSnapAlign = 'auto';
    target.scrollLeft = scrollLeft - scrollWidth / 2
    setTimeout(function() { target.style.scrollSnapAlign = 'center'; }, 100);
    window.scrollProgress = 0
    return
  }
  if (scrollLeft <= offsetWidth && !isForward) {
    target.style.scrollSnapAlign = 'auto';
    target.scrollLeft = scrollLeft + scrollWidth / 2
    setTimeout(function() { target.style.scrollSnapAlign = 'center'; }, 100);
    window.scrollProgress = 100
  }
}
