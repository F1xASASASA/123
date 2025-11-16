import { AnimatePresence, motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"

type TransitionItemProps = {
    children: ReactNode | string | number
    className?: string
}

export const TransitionItem = ({ children, className }: TransitionItemProps) => {
    const [id, setId] = useState(Date.now)

    useEffect(() => {
        setId(Date.now)
    }, [children])

    return (
        <AnimatePresence>
            <motion.span
                className={className}
                initial={{
                    translateY: "-50%",
                    scale: 0.01,
                    filter: "blur(6px)",
                }}
                animate={{
                    translateY: "0",
                    scale: 1,
                    filter: "blur(0px)",
                }}
                key={id}
            >
                {children}
            </motion.span>
        </AnimatePresence>
    )
}
