import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

function useAuthority(
    userAuthority: string[] = [],  // Quyền của người dùng, mặc định là mảng rỗng
    authority: string[] = [],       // Quyền cần kiểm tra, mặc định là mảng rỗng
    emptyCheck = false              // Kiểm tra xem quyền có rỗng không
) {
    const roleMatched = useMemo(() => {
        return authority.some((role) => userAuthority.includes(role))
    }, [authority, userAuthority]) // Tính toán lại chỉ khi authority hoặc userAuthority thay đổi

    // Nếu quyền cần kiểm tra hoặc quyền của người dùng là rỗng
    if (
        isEmpty(authority) ||          // Nếu authority rỗng
        isEmpty(userAuthority) ||      // Nếu userAuthority rỗng
        typeof authority === 'undefined' // Nếu authority không xác định
    ) {
        return !emptyCheck // Trả về true hoặc false dựa trên emptyCheck
    }

    return roleMatched // Trả về kết quả so sánh quyền
}

export default useAuthority
