import { trpc } from "@/shared/api"
import { useMemo, useRef } from "react"
import Select, { SelectInstance } from "react-select"
import { useTheme } from "styled-components"

type GroupSelectProps = {
    group?: string
    withPlaceholder?: boolean
    onSelect: (newGroup: string) => void
    onFocus?: () => void
    onBlur?: () => void
}

export const GroupSelect = ({
    group,
    onSelect,
    onFocus,
    onBlur,
    withPlaceholder = true,
}: GroupSelectProps) => {
    const { data: groups } = trpc.group.getGroups.useQuery()
    const theme = useTheme()

    const sortedGroups = useMemo(() => groups?.sort((a, b) => (a < b ? -1 : 0)), [groups])

    const selectRef = useRef<SelectInstance>(null)

    return (
        <div
            style={{
                position: "relative",
            }}
        >
            <div
                style={{ position: "absolute", inset: 0, zIndex: 2 }}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    e.currentTarget.focus()
                    selectRef.current?.focus()
                }}
            />
            <Select
                ref={selectRef}
                openMenuOnClick={false}
                noOptionsMessage={() => "Не найдено"}
                value={group && { value: group, label: group }}
                options={sortedGroups?.map((group) => ({
                    value: group,
                    label: group.replace(/\(.*\)/g, "").trim(),
                }))}
                blurInputOnSelect={true}
                isSearchable={true}
                // @ts-expect-error value is not defined
                onChange={({ value }) => {
                    onSelect && onSelect(value)
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={withPlaceholder && "Введи название группы"}
                filterOption={(option, value) =>
                    option.value
                        .split("-")
                        .join("")
                        .toLowerCase()
                        .includes(value.split("-").join("").toLowerCase())
                }
                styles={{
                    container: (baseStyles) => ({
                        ...baseStyles,
                        outline: "unset",
                        border: "unset",
                    }),
                    valueContainer: (baseStyles) => ({
                        ...baseStyles,
                        padding: "11px 16px",
                    }),
                    singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: "inherit",
                    }),
                    control: (baseStyles) => ({
                        ...baseStyles,
                        background: "transparent",
                        outline: "unset",
                        border: "unset",
                        boxShadow: "unset",
                    }),
                    dropdownIndicator: (baseStyles) => ({
                        ...baseStyles,
                        display: "none",
                    }),
                    indicatorSeparator: (baseStyles) => ({
                        ...baseStyles,
                        display: "none",
                    }),
                    menu: (baseStyles) => ({
                        ...baseStyles,
                        background: theme.background.primary,
                        borderRadius: 16,
                        boxShadow: "unset",
                    }),
                    option: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: "11px 16px",
                        background: state.isSelected
                            ? theme.accent
                            : state.isFocused
                              ? theme.background.secondary
                              : "",
                    }),
                    input: (baseStyles) => ({
                        ...baseStyles,
                        color: "inherit",
                    }),
                    noOptionsMessage: (baseStyles) => ({
                        ...baseStyles,
                        textAlign: "left",
                        padding: "11px 16px",
                    }),
                }}
            />
        </div>
    )
}
