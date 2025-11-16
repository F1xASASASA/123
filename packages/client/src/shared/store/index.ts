import { atom } from "recoil"

export const isGroupSaved = atom<boolean | string>({
    key: "isGroupSaved",
    default: true,
})

export const isEasterEggActivated = atom<boolean>({
    key: "isEasterEggActivated",
    default: false,
})

export const isGreetingsShown = atom<boolean>({
    key: "isGreetingsShown",
    default: false,
})
