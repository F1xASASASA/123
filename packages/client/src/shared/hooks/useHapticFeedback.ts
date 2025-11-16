import { useHapticFeedback } from "@vkruglikov/react-telegram-web-app"

export default function () {
    const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback()

    return {
        impactOccurred,
        notificationOccurred,
        selectionChanged,
    }
}
