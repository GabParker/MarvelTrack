
import { useEffect, useState } from 'react'

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 300)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      className="back-to-top"
      type="button"
      onClick={scrollToTop}
      aria-label="Volver al inicio de la página"
    >
      <span aria-hidden="true">↑</span>
      Volver arriba
    </button>
  )
}

export default ScrollToTopButton
