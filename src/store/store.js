import { configureStore, createSlice } from '@reduxjs/toolkit'

// ─── Auth Slice ───────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuth: false, user: null },
  reducers: {
    login: (state, action) => { state.isAuth = true; state.user = action.payload },
    logout: (state) => { state.isAuth = false; state.user = null },
  }
})

// ─── UI Slice ─────────────────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState: { dark: false },
  reducers: {
    toggleDark: (state) => { state.dark = !state.dark },
  }
})

// ─── Posture Slice ────────────────────────────────────────────
const postureSlice = createSlice({
  name: 'posture',
  initialState: {
    angle: 82,
    history: Array.from({ length: 20 }, () => Math.round(65 + Math.random() * 25)),
    todayStats: { slouchCount: 12, breaksCount: 3, goodHours: 4.2, bestAngle: 92, worstAngle: 54 }
  },
  reducers: {
    setAngle: (state, action) => {
      state.angle = action.payload
      state.history = [...state.history.slice(-49), action.payload]
    },
    incrementSlouch: (state) => { state.todayStats.slouchCount++ },
  }
})

// ─── Appointments Slice ───────────────────────────────────────
const aptsSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: [
      { id: 1, doctor: 'Dr. Priya Mehta',   specialty: 'Orthopedic',      date: '2026-04-28', time: '10:00', status: 'confirmed' },
      { id: 2, doctor: 'Dr. Arun Sharma',   specialty: 'Physiotherapist', date: '2026-04-30', time: '14:30', status: 'confirmed' },
      { id: 3, doctor: 'Dr. Kavita Joshi',  specialty: 'Neurologist',     date: '2026-05-02', time: '09:00', status: 'pending'   },
      { id: 4, doctor: 'Dr. Rohit Gupta',   specialty: 'Cardiologist',    date: '2026-05-05', time: '11:00', status: 'confirmed' },
    ]
  },
  reducers: {
    addApt:  (state, action) => { state.list.push(action.payload) },
    editApt: (state, action) => { state.list = state.list.map(a => a.id === action.payload.id ? action.payload : a) },
    delApt:  (state, action) => { state.list = state.list.filter(a => a.id !== action.payload) },
  }
})

// ─── Alerts Slice ─────────────────────────────────────────────
const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    list: [
      { id: 1, type: 'warn', msg: 'You have been sitting for 2+ hours. Take a break!' },
      { id: 2, type: 'info', msg: 'Appointment reminder: Dr. Priya Mehta tomorrow at 10:00 AM' },
      { id: 3, type: 'good', msg: 'Posture score improved by 8% this week! 🎉' },
    ]
  },
  reducers: {
    addAlert:    (state, action) => { state.list = [action.payload, ...state.list.slice(0, 9)] },
    removeAlert: (state, action) => { state.list = state.list.filter(a => a.id !== action.payload) },
  }
})

// ─── Store ────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    auth:         authSlice.reducer,
    ui:           uiSlice.reducer,
    posture:      postureSlice.reducer,
    appointments: aptsSlice.reducer,
    alerts:       alertsSlice.reducer,
  }
})

export const { login, logout }              = authSlice.actions
export const { toggleDark }                 = uiSlice.actions
export const { setAngle, incrementSlouch }  = postureSlice.actions
export const { addApt, editApt, delApt }    = aptsSlice.actions
export const { addAlert, removeAlert }      = alertsSlice.actions
