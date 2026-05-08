import { ColorValue } from "react-native"

type Gradient = readonly [ColorValue, ColorValue, ...ColorValue[]]

type ThemeSchema = {
  navigatorColor: string
  background: string
  text: string
  card: string
  accent: string
  anchor: string
  icon: string
  border: string
  navIconActive: string
  navIconDeactive: string
  btnConfirm: string
  btnCancel: string
  btn: string
  draggable: string
  gradient: Gradient
}

export const themes: Record<string, ThemeSchema> = {
  claro: {
    navigatorColor: "#fcfcfc",
    background: "#f5f5f5",
    text: "#0e0e0e",
    card: "#cccccc",
    accent: "#999",
    anchor: "#eee",
    icon: "#0e0e0e",
    border: "#ccc",

    navIconActive: "#0e0e0e",
    navIconDeactive: "#9e9e9e",

    btnConfirm: "#22c55e",
    btnCancel: "#F44336",
    btn: "#fafafa",

    draggable: "#eeeeee",

    gradient: ["#3d3d3d", "#6d6d6d", "#9d9d9d", "#adadad"],
  },

  escuro: {
    navigatorColor: "#0f172a",
    background: "#020617",
    text: "#f8fafc",
    card: "#1e293b",
    accent: "#334155",
    anchor: "#46B1C9",
    icon: "#f8fafc",
    border: "#fff",

    navIconActive: "#f8fafc",
    navIconDeactive: "#64748b",

    btnConfirm: "#22c55e",
    btnCancel: "#ef4444",
    btn: "#334155",

    draggable: "#020617",

    gradient: ["#020617", "#020617", "#0f172a", "#1e293b"],
  },

  verde: {
    navigatorColor: "#163832",
    background: "#051F20",
    text: "#f5f5f5",
    card: "#235347",
    accent: "#8EB69B",
    anchor: "#8EB69B",
    icon: "#163832",
    border: "#DAF1DE",

    navIconActive: "#f5f5f5",
    navIconDeactive: "#8EB69B",

    btnConfirm: "#8EB69B",
    btnCancel: "#ff6b6b",
    btn: "#8EB69B",

    draggable: "#0b2e2f",

    gradient: ["#051F20", "#0B2B26", "#163832", "#235347"],
  },
}
