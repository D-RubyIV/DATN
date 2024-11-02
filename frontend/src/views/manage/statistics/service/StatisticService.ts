import ApiService from '@/services/ApiService'

type TimeRequestsPayload = {
    from: string,
    to: string,
}

export default function apiFetchOverviewStatistic<T extends Record<string, unknown>>(data: TimeRequestsPayload) {
    return ApiService.fetchData<T>({
        url: '/statistics/overview',
        method: 'post',
        data: data
    })
}