export const isTeacher = (groupName?: string | null) => {
    const typedGroupName = groupName ?? ""

    return typedGroupName?.split(" ").length > 1 && typedGroupName?.length > 8
}
