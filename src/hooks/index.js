import { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Typed Redux hooks
export const useAppSelector = useSelector
export const useAppDispatch = useDispatch

// Debounce hook
export function useDebounce(callback, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay])
}

// Posture status helper
export function usePostureStatus(angle) {
  if (angle >= 80) return { label: 'Good Posture ✅', cls: 'status-good', color: '#22C55E', desc: 'Excellent spinal alignment! Keep it up.' }
  if (angle >= 65) return { label: 'Fix Posture ⚠️',  cls: 'status-warn', color: '#F97316', desc: 'Slight forward lean. Sit back in your chair.' }
  return         { label: 'Bad Posture 🔴',  cls: 'status-bad',  color: '#EF4444', desc: 'Severe slouching! Correct immediately.' }
}

// Dark mode effect
export function useDarkMode(dark) {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
}

// Chart destroy on unmount
export function useChartCleanup(chartRef) {
  useEffect(() => () => chartRef.current?.destroy(), [])
}
