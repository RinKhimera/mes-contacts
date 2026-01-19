import "@testing-library/jest-dom/vitest"

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Mock ResizeObserver
class MockResizeObserver {
  observe = () => {}
  disconnect = () => {}
  unobserve = () => {}
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = () => {}
  disconnect = () => {}
  unobserve = () => {}
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
})
