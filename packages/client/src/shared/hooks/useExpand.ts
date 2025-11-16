import { useExpand } from "@vkruglikov/react-telegram-web-app"
import { useEffect } from "react"

export default () => {
    const [, expand] = useExpand()

    useEffect(() => {
        expand()
    }, [])
}
